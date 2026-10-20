-- GÜVENLİK (2026-10-20): send-notification-email Edge Function'ı açık e-posta rölesiydi. Herkese açık anon anahtarı bilen
-- herkes İşinn adına istediği adrese e-posta gönderebiliyordu. Fonksiyon artık yalnızca service_role anahtarını kabul ediyor.
-- Bu dosya mesaj bildirimi tetikleyicisini service_role anahtarını Supabase Vault'tan okuyacak şekilde günceller
-- (anahtar SQL kaynağında DÜZ METİN olarak durmaz). İki dilli metinler notify_new_message_bilingual_2026_10_19.sql ile aynı;
-- o dosya henüz çalıştırılmadıysa artık GEREK YOK, bu dosya onu da kapsar.
--
-- SIRA ÖNEMLİ:
--   1) ÖNCE aşağıdaki tek satırı, <SERVICE_ROLE_KEY> yerine Project Settings → API → service_role anahtarını yapıştırarak
--      SQL editöründe AYRI çalıştır (bu satırı dosyaya kaydetme / commit etme):
--        select vault.create_secret('<SERVICE_ROLE_KEY>', 'service_role_key');
--   2) SONRA bu dosyanın geri kalanını çalıştır.
--   3) EN SON Edge Function'ı yeni koduyla deploy et (supabase/functions/send-notification-email/index.ts).
-- Bu sıra bozulmazsa e-postalar hiç kesilmez: eski fonksiyon da service_role anahtarını kabul eder.

create or replace function notify_new_message()
returns trigger as $$
declare
  v_to_email text;
  v_sender_name text;
  v_key text;
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
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'service_role_key' limit 1;

  -- Anahtar Vault'ta yoksa e-posta atlanır; uygulama içi bildirim yine oluşur, mesaj gönderimi asla bozulmaz.
  if v_to_email is not null and v_key is not null then
    perform net.http_post(
      url := 'https://djnegowgtcffyjksnuly.supabase.co/functions/v1/send-notification-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_key
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
$$ language plpgsql security definer set search_path = public, auth, extensions, vault;
