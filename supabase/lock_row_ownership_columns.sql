-- İKİNCİ TUR GÜVENLİK TARAMASI — profiles'ta bulduğumuz "RLS policy sadece
-- SATIRI korur, KOLONU korumaz" hatasının şemadaki HER "sahibi güncelleyebilir"
-- policy'sinde tekrarlanıp tekrarlanmadığı tek tek kontrol edildi. Aynı hata
-- 4 tabloda daha bulundu — hepsi burada kapatılıyor.

-- ============================================================
-- 1) SERVICES — has_certificates provider tarafından direkt yazılabiliyordu.
-- Sertifika hiç yüklemeden "Doğrulanmış" rozetini kendi kendine takabiliyordu
-- (aynı has_certificates deseni profiles'ta zaten bulunup kapatılmıştı).
-- Kod taranarak (her .update()/.insert() çağrısı) çıkarılan gerçek/güvenli
-- kolon listesiyle aynı yöntem: önce tüm yetkiyi geri al, sonra sadece
-- kullanılanları geri ver.
-- ============================================================
revoke update on public.services from authenticated, anon;
grant update (
  category_id, title, description, display_name, price, price_type,
  is_remote, city, location, home_service_type, images,
  custom_category_label, share_profile_reviews, video_intro_url, video_intro_name
) on public.services to authenticated;

revoke insert on public.services from authenticated, anon;
grant insert (
  provider_id, category_id, title, description, display_name, price, price_type,
  is_remote, city, location, home_service_type, images,
  custom_category_label, active
) on public.services to authenticated;

-- ============================================================
-- 2) RATINGS — İKİ ayrı update policy var (rater'ın kendi yazdığı
-- değerlendirmeyi güncellemesi + sağlayıcının kendi hakkındaki
-- değerlendirmeye yanıt yazması, bkz. edit_reviews.sql + growth_features_batch.sql).
-- İkisi de "hangi satır" kısıtlıyor, "hangi kolon" kısıtlamıyor. Sonuç:
--   - Rater kendi ratings satırının rated_profile_id'sini BAŞKA bir
--     sağlayıcıya çevirip değerlendirmeyi ondan alakasız birinin profiline
--     "taşıyabilirdi" (rakibe kötü yorum yapıştırma / arkadaşına iyi yorum
--     taşıma riski), provider_reply'ı da kendi yazıp sanki sağlayıcı cevap
--     vermiş gibi SAHTE bir yanıt üretebilirdi.
--   - Sağlayıcı da (kendi hakkındaki satırı güncelleyebildiği için) rater'ın
--     yazdığı value/comment'i DEĞİŞTİREBİLİRDİ — yani kötü bir yorumu
--     sessizce "düzeltebilirdi". Bu, tüm değerlendirme sisteminin güvenini
--     baştan sona geçersiz kılan bir açıktı.
-- growth_features_batch.sql'de bu risk fark edilip yorumla not edilmişti
-- ("client kodu sadece X gönderiyor") ama bu gerçek bir koruma değil —
-- anon key'i olan herkes client kodunu atlayıp doğrudan istek atabilir
-- (tam olarak profiles/is_admin açığındaki gibi).
--
-- Çözüm burada GRANT/REVOKE ile yapılamıyor çünkü kısıtlama KİMİN
-- güncellediğine göre değişiyor (aynı "authenticated" rolü, satıra göre
-- farklı hak) — bu yüzden bir BEFORE UPDATE trigger ile, hangi kolonların
-- hangi taraf tarafından değişebileceğini satır bazında kontrol ediyoruz.
-- helpful_count ayrı: onu SADECE sync_review_helpful_count trigger'ı
-- (review_helpful_votes üzerinden, tablo sahibi yetkisiyle) değiştirmeli —
-- o yüzden bu direkt client'tan yazılamasın diye ayrıca REVOKE ediliyor.
-- ============================================================
revoke update (helpful_count) on public.ratings from authenticated, anon;

create or replace function protect_ratings_columns()
returns trigger as $$
begin
  -- Kimlik alanları (hangi iş / kim / kimin hakkında) hiç kimse tarafından,
  -- hiçbir update ile değiştirilemez.
  if new.job_id is distinct from old.job_id
     or new.rater_id is distinct from old.rater_id
     or new.rated_profile_id is distinct from old.rated_profile_id
     or new.service_id is distinct from old.service_id
  then
    raise exception 'Bu değerlendirmenin kime/hangi işe ait olduğu değiştirilemez.';
  end if;

  -- Puan/yorumu SADECE değerlendirmeyi yazan kişi değiştirebilir.
  if (new.value is distinct from old.value or new.comment is distinct from old.comment)
     and auth.uid() is distinct from old.rater_id
  then
    raise exception 'Sadece değerlendirmeyi yazan kişi puan/yorumu değiştirebilir.';
  end if;

  -- Sağlayıcı yanıtını SADECE değerlendirilen sağlayıcı değiştirebilir.
  if (new.provider_reply is distinct from old.provider_reply or new.provider_reply_at is distinct from old.provider_reply_at)
     and auth.uid() is distinct from old.rated_profile_id
  then
    raise exception 'Sadece değerlendirilen sağlayıcı yanıt yazabilir.';
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_protect_ratings_columns on ratings;
create trigger trg_protect_ratings_columns
before update on ratings
for each row execute function protect_ratings_columns();

-- ============================================================
-- 3) REVIEW_MEDIA — sağlayıcı, kendisiyle ilgili bir review_media satırını
-- "onayla/reddet" için güncelleyebiliyordu (review_media için update policy'si
-- bu tek amaç için var) ama policy kolon kısıtlamadığı için url/media_type/
-- rating_id/contains_provider_identity gibi alanları da değiştirebilirdi —
-- yani müşterinin yüklediği gerçek fotoğrafı BAŞKA bir görselle
-- değiştirebilir ya da medyayı farklı bir değerlendirmeye
-- "taşıyabilirdi". Sadece onay durumunu değiştirebilsin diye kilitleniyor.
-- ============================================================
create or replace function protect_review_media_columns()
returns trigger as $$
begin
  if new.rating_id is distinct from old.rating_id
     or new.media_type is distinct from old.media_type
     or new.url is distinct from old.url
     or new.thumbnail_url is distinct from old.thumbnail_url
     or new.sort_order is distinct from old.sort_order
     or new.contains_provider_identity is distinct from old.contains_provider_identity
  then
    raise exception 'Bu alanlar değiştirilemez, sadece onay durumu güncellenebilir.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_protect_review_media_columns on review_media;
create trigger trg_protect_review_media_columns
before update on review_media
for each row execute function protect_review_media_columns();

-- ============================================================
-- 4) MESSAGES — alıcı, kendine gelen bir mesajı "okundu" işaretlemek için
-- güncelleyebiliyordu ama kolon kısıtlaması olmadığı için mesajın body'sini
-- (gönderilen metni) ya da sender_id'sini de değiştirebilirdi — yani
-- geçmişte "ne söylendiğini" değiştirebilir veya farklı bir gönderici gibi
-- gösterebilirdi (mesajlaşma geçmişi bir anlaşmazlıkta delil olarak
-- kullanılabileceği için önemli). Sadece "read" değişebilsin diye kilitleniyor.
-- ============================================================
create or replace function protect_messages_columns()
returns trigger as $$
begin
  if new.job_id is distinct from old.job_id
     or new.sender_id is distinct from old.sender_id
     or new.receiver_id is distinct from old.receiver_id
     or new.body is distinct from old.body
  then
    raise exception 'Sadece okundu durumu güncellenebilir.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_protect_messages_columns on messages;
create trigger trg_protect_messages_columns
before update on messages
for each row execute function protect_messages_columns();

-- ============================================================
-- 5) PROPOSALS — provider kendi teklifinin "status"unu (pending/accepted/...)
-- direkt "accepted" yapabiliyordu; normalde bu kararı işi veren client
-- vermeli. Düşük öncelik: bu tablo şu an uygulamada HİÇ kullanılmıyor (kod
-- taramasında proposals'a tek bir client çağrısı bile yok, tamamen atıl) —
-- yine de ileride kullanılmaya başlanırsa diye aynı prensiple kapatılıyor.
-- ============================================================
revoke update on public.proposals from authenticated, anon;
grant update (message, price) on public.proposals to authenticated;
