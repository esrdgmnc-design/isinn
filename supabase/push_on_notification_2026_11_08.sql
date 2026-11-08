-- 2026-11-08: Telefon bildirimi hiç gitmiyordu (notifications.push_sent_at hep boş). /api/push/send hazırdı ama onu
-- çağıran bir tetikleyici hiç kurulmamıştı. Bu tetikleyici her yeni bildirimde Vercel'deki /api/push/send'i çağırır;
-- gönderilecek tür, günlük sınır (4) ve cihaz jetonu kontrolü o rotada yapılır. Yetki: e-posta tetikleyicisiyle aynı
-- kasa anahtarı (notify_hook_secret, notify_email_service_role_2026_10_20.sql ile oluşturuldu).

create or replace function public.push_on_notification()
returns trigger
language plpgsql
security definer
set search_path = public, vault, extensions
as $$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'notify_hook_secret' limit 1;
  if v_secret is null then
    return new;
  end if;
  perform net.http_post(
    url := 'https://www.isinn.com.tr/api/push/send',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_secret),
    body := jsonb_build_object('record', to_jsonb(new))
  );
  return new;
exception when others then
  -- Bildirim kaydı asla push yüzünden düşmesin.
  return new;
end;
$$;

drop trigger if exists trg_push_on_notification on public.notifications;
create trigger trg_push_on_notification
  after insert on public.notifications
  for each row execute function public.push_on_notification();
