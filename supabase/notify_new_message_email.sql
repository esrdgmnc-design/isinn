-- Yeni mesaj bildirimi artık uygulama içi zilin YANINDA gerçek bir e-posta da
-- gönderiyor (2026-09-13 konuşması: "tamam mail düşsün"). Daha önce e-posta
-- gönderimi bilerek kapalıydı (bkz. notifications_center.sql'in başındaki
-- not — "trial bitişi için bile mail istemiyorum" kararı); bu, SADECE yeni
-- mesaj bildirimi için, kullanıcının kendi onayıyla açılan bir istisna.
-- Diğer bildirim türleri (medya onayı, iş teslimi vb.) hâlâ sadece uygulama
-- içi — bu dosya SADECE notify_new_message() fonksiyonunu değiştiriyor.
--
-- ÖN KOŞUL — bu SQL'i çalıştırmadan önce:
--   1) supabase/functions/send-notification-email/index.ts, Supabase
--      Dashboard'ın Edge Functions sekmesinden deploy edilmiş olmalı
--      (fonksiyon adı: send-notification-email).
--   2) O fonksiyonun ortam değişkeninde (Dashboard → Edge Functions →
--      send-notification-email → Secrets) RESEND_API_KEY gerçek bir Resend
--      API anahtarıyla ayarlanmış olmalı (resend.com, ücretsiz katman günde
--      100 e-posta, kredi kartı istemiyor).
-- İkisi de yoksa bu SQL yine de hata vermez — pg_net çağrısı sessizce
-- başarısız olur, uygulama içi bildirim satırı her hâlükârda yazılır (yeni
-- mesajın kaybolmaz, sadece e-postası gitmez).

create extension if not exists pg_net;

create or replace function notify_new_message()
returns trigger as $$
declare
  v_to_email text;
  v_sender_name text;
begin
  insert into notifications (profile_id, type, title, body, related_job_id)
  values (
    new.receiver_id, 'new_message',
    'Yeni bir mesajın var',
    left(new.body, 120),
    new.job_id
  );

  -- E-posta gönderimi — auth.users'tan alıcının e-postasını okuyoruz
  -- (profiles tablosunda e-posta hiç tutulmuyor, bilerek).
  select email into v_to_email from auth.users where id = new.receiver_id;
  select coalesce(business_name, full_name, 'Bir kullanıcı') into v_sender_name
    from profiles where id = new.sender_id;

  if v_to_email is not null then
    perform net.http_post(
      url := 'https://djnegowgtcffyjksnuly.supabase.co/functions/v1/send-notification-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbmVnb3dndGNmZnlqa3NudWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTA4ODgsImV4cCI6MjEwNDE2Njg4OH0.JohPWXd5_hWoi_VhQc0VFlF2WopFlC99u8QB4xGSoJM'
      ),
      body := jsonb_build_object(
        'to', v_to_email,
        'subject', v_sender_name || ' sana bir mesaj gönderdi — İşinn',
        'body', v_sender_name || ' sana İşinn üzerinden bir mesaj gönderdi:' || chr(10) || chr(10) ||
                left(new.body, 300) || chr(10) || chr(10) ||
                'Yanıtlamak için İşinn''e giriş yap: https://www.isinn.com.tr'
      )
    );
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public, auth, extensions;
