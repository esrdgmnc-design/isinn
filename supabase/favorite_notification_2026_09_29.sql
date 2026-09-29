-- İşinn — 2026-09-29: bir vitrin favorilere eklenince sağlayıcıya bildirim.
-- Kullanıcının isteği: "ben bir vitrini fav'a ekleyince bildirim gitmiyorsa
-- gitsin". Sadece VİTRİN (services) favorileri için — iş ilanı (jobs)
-- favorilemesi bu kapsamda değil, notifications_center.sql'deki diğer
-- trigger'larla aynı desende (security definer, after insert). Idempotent.

-- 1) type kısıtını genişlet — önceki tüm dosyalarda görülen türlerin
-- BİRLEŞİMİ + yeni 'service_favorited' (hangi migration'ın en son çalıştığı
-- belirsiz olduğu için, hiçbirini kaybetmemek adına birleşim alındı).
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'pending_media_approval', 'staff_review_needed', 'media_approved', 'media_rejected',
    'new_message', 'job_delivered', 'saved_search_match',
    'subscription_ending_soon', 'vitrin_deactivated', 'new_job_match',
    'service_favorited'
  ));

-- 2) Favori eklenince (sadece vitrin, iş ilanı değil) sağlayıcıya bildirim.
create or replace function notify_service_favorited()
returns trigger as $$
declare
  v_provider_id uuid;
  v_title text;
begin
  if new.service_id is null then
    return new;
  end if;
  select provider_id, title into v_provider_id, v_title from services where services.id = new.service_id;
  -- Kendi vitrinini favorileyen biri olursa (ör. sahibi kendi test ederken) bildirim gitmesin.
  if v_provider_id is null or v_provider_id = new.profile_id then
    return new;
  end if;
  insert into notifications (profile_id, type, title, body, related_service_id)
  values (
    v_provider_id, 'service_favorited',
    'Vitrinin favorilere eklendi',
    coalesce(v_title, 'Bir vitrinin') || ' birisi tarafından favorilere eklendi.',
    new.service_id
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_notify_service_favorited on favorites;
create trigger trg_notify_service_favorited
  after insert on favorites
  for each row execute function notify_service_favorited();
