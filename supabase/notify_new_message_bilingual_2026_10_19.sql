-- Yeni mesaj bildirimi e-postası İKİ DİLLİ (2026-10-19, yurt dışı hazırlığı): kullanıcının dil tercihi veritabanında
-- tutulmadığı için Türkçe metnin altına kısa İngilizce karşılık eklendi; konu satırı da iki dilli; uygulama içi başlık Türkçe kalır, İngilizce arayüz onu kendisi çevirir.
-- Yalnızca metinler değişti; mantık supabase/notify_new_message_email.sql ile aynı. Supabase SQL editöründe tek seferde çalıştır.

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
        'subject', v_sender_name || ' sana bir mesaj gönderdi / sent you a message — İşinn',
        'body', v_sender_name || ' sana İşinn üzerinden bir mesaj gönderdi:' || chr(10) || chr(10) ||
                left(new.body, 300) || chr(10) || chr(10) ||
                'Yanıtlamak için İşinn''e giriş yap: https://www.isinn.com.tr' || chr(10) || chr(10) ||
                '—' || chr(10) ||
                v_sender_name || ' sent you a message on İşinn (shown above). To reply, sign in: https://www.isinn.com.tr'
      )
    );
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public, auth, extensions;
