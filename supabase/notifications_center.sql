-- İşinn — bildirim merkezi. schema (3).sql'de tam bir `notifications` tablosu
-- ve tek bir trigger (pending medya onayı için) hazır duruyordu ama hiçbir
-- kod bu tabloyu okumuyordu — ne bir zil ikonu, ne bir liste vardı. Şu anki
-- tek "bildirim" global deneme-süresi banner'ıydı. Bu dosya:
--   1) var olan pending-medya trigger'ındaki gerçek bir hatayı düzeltiyor
--      (sadece UPDATE'te tetikleniyordu, ama gerçek akış INSERT ile direkt
--      'pending' yazıyor — bkz. attachRealReviewMedia — o yüzden hiç
--      tetiklenmiyordu)
--   2) üç yeni, gerçekten kullanılan olay için bildirim ekliyor: medya
--      onaylandı/reddedildi, yeni mesaj, iş teslim onaylandı
-- E-posta gönderimi (send-notification-email Edge Function) BİLEREK
-- devreye alınmıyor — kullanıcının kendi kararı "trial bitişi için bile
-- mail/sms istemiyorum, sadece uygulama içi" idi, bu prensip burada da geçerli.

-- 1) type kısıtını genişlet — yeni iki tür için.
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'pending_media_approval', 'staff_review_needed', 'media_approved', 'media_rejected',
    'new_message', 'job_delivered'
  ));

-- Bildirime tıklayınca nereye gidileceğini bilmek için genel hedef alanları.
alter table notifications add column if not exists related_job_id uuid references jobs(id) on delete cascade;
alter table notifications add column if not exists related_service_id uuid references services(id) on delete cascade;

-- 2) Pending medya onayı — INSERT'te de tetiklensin diye trigger'ı yeniden
-- kur (gerçek akış zaten INSERT ile approval_status='pending' yazıyor,
-- eski trigger sadece UPDATE dinlediği için hiç çalışmıyordu).
drop trigger if exists trg_notify_pending_media_approval on review_media;
create or replace function notify_pending_media_approval()
returns trigger as $$
declare
  v_provider_id uuid;
  v_service_id uuid;
begin
  if new.approval_status = 'pending' and (tg_op = 'INSERT' or old.approval_status is distinct from 'pending') then
    select rated_profile_id, service_id into v_provider_id, v_service_id from ratings where ratings.id = new.rating_id;

    insert into notifications (profile_id, type, title, body, related_review_media_id, related_service_id)
    values (
      v_provider_id, 'pending_media_approval',
      'Onayını bekleyen bir fotoğraf var',
      'Bir müşteri sana yorum bırakırken seni gösterebilecek bir görsel ekledi. Yayınlanması için profilinden onaylaman gerekiyor.',
      new.id, v_service_id
    );
    -- E-posta gönderimi bilerek eklenmedi (bkz. dosya başındaki not).
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_notify_pending_media_approval
  after insert or update on review_media
  for each row execute function notify_pending_media_approval();

-- 3) Medya onaylandı/reddedildi — yorumu yapan kişiye (rater) bildirim.
create or replace function notify_media_decision()
returns trigger as $$
declare
  v_rater_id uuid;
  v_service_id uuid;
  v_type text;
  v_title text;
  v_body text;
begin
  if old.approval_status = 'pending' and new.approval_status in ('approved', 'rejected') then
    select rater_id, service_id into v_rater_id, v_service_id from ratings where ratings.id = new.rating_id;
    if new.approval_status = 'approved' then
      v_type := 'media_approved';
      v_title := 'Fotoğrafın onaylandı';
      v_body := 'Değerlendirmene eklediğin fotoğraf sağlayıcı tarafından onaylandı, artık herkese görünür.';
    else
      v_type := 'media_rejected';
      v_title := 'Fotoğrafın onaylanmadı';
      v_body := 'Değerlendirmene eklediğin fotoğrafı sağlayıcı onaylamadı, yayınlanmadı. Yazılı yorumun etkilenmedi.';
    end if;
    insert into notifications (profile_id, type, title, body, related_review_media_id, related_service_id)
    values (v_rater_id, v_type, v_title, v_body, new.id, v_service_id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_notify_media_decision on review_media;
create trigger trg_notify_media_decision
  after update on review_media
  for each row execute function notify_media_decision();

-- 4) Yeni mesaj — alıcıya bildirim (mesajlaşma ekranı gerçek zamanlı değil,
-- kullanıcı sayfayı açmadan haberi olmuyordu).
create or replace function notify_new_message()
returns trigger as $$
begin
  insert into notifications (profile_id, type, title, body, related_job_id)
  values (
    new.receiver_id, 'new_message',
    'Yeni bir mesajın var',
    left(new.body, 120),
    new.job_id
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_notify_new_message on messages;
create trigger trg_notify_new_message
  after insert on messages
  for each row execute function notify_new_message();

-- 5) İş teslim onaylandı ("Hizmeti Aldım") — sağlayıcıya bildirim.
create or replace function notify_job_delivered()
returns trigger as $$
declare
  v_provider_id uuid;
begin
  if new.state = 'delivered' and (old.state is distinct from 'delivered') then
    select provider_id into v_provider_id from services where services.id = new.service_id;
    if v_provider_id is not null then
      insert into notifications (profile_id, type, title, body, related_job_id, related_service_id)
      values (
        v_provider_id, 'job_delivered',
        'Müşteri hizmeti aldığını onayladı',
        'Bir müşteri "' || new.title || '" görüşmesinde hizmeti aldığını işaretledi. Artık seni değerlendirebilir.',
        new.id, new.service_id
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_notify_job_delivered on jobs;
create trigger trg_notify_job_delivered
  after update on jobs
  for each row execute function notify_job_delivered();
