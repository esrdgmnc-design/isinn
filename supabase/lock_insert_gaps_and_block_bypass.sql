-- ÜÇÜNCÜ TUR GÜVENLİK TARAMASI (yayın öncesi, en detaylı) — bugün UPDATE
-- policy'lerini tek tek taradık ama INSERT policy'lerini aynı titizlikte
-- taramamıştık. Aynı "satır korunuyor, kolon korunmuyor" hatası INSERT
-- tarafında da bulundu — bazıları UPDATE'tekinden de ciddi, çünkü bir
-- INSERT ile ilk andan itibaren yanlış/sahte bir durum yaratılabiliyor.

-- ============================================================
-- 1) PROFILE_PHONE — telefon doğrulamasını yine bypass etmenin bir yolu
-- daha vardı. Bugün erken saatlerde phone_otp_codes/request_phone_otp'daki
-- kod sızıntısını kapattık (fix_otp_leak.sql) ama profile_phone tablosunun
-- KENDİ insert/update policy'leri hiç kolon kısıtlamıyordu — yani biri
-- store_phone_otp/verify_phone_otp RPC'lerini hiç kullanmadan, doğrudan
-- şunu çağırabilirdi:
--   supabase.from('profile_phone').upsert({profile_id: kendiId, phone: 'ANY',
--     verified: true, show_publicly: true})
-- Bu GERÇEKTEN ÇALIŞIRDI — telefon doğrulamasını sıfırdan, hiç SMS almadan
-- bypass ederdi (profiles.phone_verified da sync trigger'ıyla true olurdu).
-- Client kodu (IsinnApp.jsx) bu tabloya artık SADECE select ve
-- update({show_publicly}) yapıyor — insert tamamen service-role RPC'ye
-- taşındı (bkz. store_phone_otp). Buna göre kilitliyoruz: authenticated
-- artık bu tabloya hiç INSERT yapamaz, UPDATE'te sadece show_publicly'ye
-- dokunabilir.
revoke insert on public.profile_phone from authenticated, anon;

revoke update on public.profile_phone from authenticated, anon;
grant update (show_publicly) on public.profile_phone to authenticated;

-- ============================================================
-- 2) RATINGS — INSERT policy'si de UPDATE'teki gibi kolon kısıtlamıyordu.
-- Gerçek akış sadece job_id/rater_id/rated_profile_id/service_id/value/
-- comment gönderiyor (bkz. IsinnApp.jsx submitRealReview) — ama kısıtlama
-- olmadığı için biri ilk INSERT anında helpful_count'u (örn. 500) ya da
-- provider_reply'ı ("Harika hizmet!" diye SAHTE bir sağlayıcı yanıtı)
-- doğrudan yazabilirdi — bugünkü UPDATE trigger'ımız (protect_ratings_columns)
-- bunu SONRADAN değiştirmeyi engelliyordu ama İLK YARATILIŞTA engellemiyordu.
revoke insert on public.ratings from authenticated, anon;
grant insert (job_id, rater_id, rated_profile_id, service_id, value, comment)
  on public.ratings to authenticated;

-- ============================================================
-- 3) REVIEW_MEDIA — gerçek akış approval_status'u SADECE 'pending' ya da
-- 'not_required' olarak insert ediyor (bkz. attachRealReviewMedia — AI
-- kontrolü appropriate=false ya da showsIdentifiableChild derse zaten hiç
-- insert edilmiyor). Ama policy kısıtlamadığı için biri doğrudan
-- approval_status:'approved' göndererek AI/onay sürecini tamamen atlayıp
-- kendi yüklediği (belki uygunsuz, belki sağlayıcının rızası olmadan yüz
-- gösteren) bir görseli anında yayınlayabilirdi. Trigger ile: insert anında
-- 'not_required'/'pending' DIŞINDA bir değer gönderilirse sessizce
-- 'pending'e zorlanır (uygulamanın kendi davranışını hiç bozmuyor, sadece
-- kötüye kullanımı kapatıyor) — onaylama/reddetme hâlâ sadece sağlayıcının
-- UPDATE'i üzerinden, bugün eklediğimiz trigger ile korunuyor.
create or replace function force_review_media_pending_state()
returns trigger as $$
begin
  if new.approval_status not in ('not_required', 'pending') then
    new.approval_status := 'pending';
  end if;
  new.approved_at := null;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_force_review_media_pending_state on review_media;
create trigger trg_force_review_media_pending_state
before insert on review_media
for each row execute function force_review_media_pending_state();

-- ============================================================
-- 4) MESSAGES — "Engelle" özelliği (user_safety.sql) sadece CLIENT
-- KODUNDA kontrol ediliyordu (sendRealMessage, göndermeden önce
-- is_blocked_between'i çağırıp iptal ediyordu). Bu bir GÜVENLİK SINIRI
-- DEĞİL, sadece bir kolaylıktı — anon key'i olan biri uygulamayı hiç
-- kullanmadan, engellenmiş olsa bile doğrudan mesaj insert edebilirdi.
-- Yarın canlıya çıkarken bu, "Engelle" butonunun bir kullanıcıyı gerçekten
-- koruduğu YALANINI söylememesi için mutlaka veritabanı seviyesinde de
-- uygulanmalı.
create or replace function enforce_message_not_blocked()
returns trigger as $$
begin
  if exists (
    select 1 from user_blocks
    where (blocker_id = new.sender_id and blocked_id = new.receiver_id)
       or (blocker_id = new.receiver_id and blocked_id = new.sender_id)
  ) then
    raise exception 'Bu kişiyle mesajlaşamıyorsun.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_enforce_message_not_blocked on messages;
create trigger trg_enforce_message_not_blocked
before insert on messages
for each row execute function enforce_message_not_blocked();
