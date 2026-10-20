-- GÜVENLİK (2026-10-20): send-notification-email Edge Function'ı açık e-posta rölesiydi. Herkese açık anon anahtarı bilen
-- herkes İşinn adına istediği adrese e-posta gönderebiliyordu. Fonksiyonun yeni sürümü yalnızca şunları kabul eder:
--   - sunucu rotaları: service_role anahtarı (Authorization başlığı);
--   - bu tetikleyici: x-notify-secret başlığında Vault'taki 'notify_hook_secret' değeri.
-- Gizli değeri veritabanı KENDİSİ üretir; kimse bir anahtarı kopyalayıp yapıştırmaz. Fonksiyon değeri service_role ile
-- get_notify_hook_secret() RPC'sinden okur (anon/authenticated bu RPC'yi çağıramaz).
-- İki dilli metinler notify_new_message_bilingual_2026_10_19.sql ile aynı; o dosya artık GEREKSİZ, bu dosya onu kapsar.
--
-- SIRA: önce bu dosya (eski fonksiyon fazladan başlığı yok sayar, e-postalar kesilmez), sonra Edge Function'ın yeni kodu.
-- Tekrar çalıştırmak güvenli (idempotent).

select vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'notify_hook_secret')
where not exists (select 1 from vault.secrets where name = 'notify_hook_secret');

create or replace function public.get_notify_hook_secret()
returns text
language sql
security definer
set search_path = vault, public
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'notify_hook_secret' limit 1;
$$;

revoke execute on function public.get_notify_hook_secret() from public, anon, authenticated;
grant execute on function public.get_notify_hook_secret() to service_role;

create or replace function notify_new_message()
returns trigger as $$
declare
  v_to_email text;
  v_sender_name text;
  v_secret text;
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
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'notify_hook_secret' limit 1;

  if v_to_email is not null then
    perform net.http_post(
      url := 'https://djnegowgtcffyjksnuly.supabase.co/functions/v1/send-notification-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        -- Anon anahtarı yalnızca Supabase ağ geçidinin JWT kontrolü için; yetki x-notify-secret ile verilir.
        'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbmVnb3dndGNmZnlqa3NudWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTA4ODgsImV4cCI6MjEwNDE2Njg4OH0.JohPWXd5_hWoi_VhQc0VFlF2WopFlC99u8QB4xGSoJM',
        'x-notify-secret', coalesce(v_secret, '')
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
