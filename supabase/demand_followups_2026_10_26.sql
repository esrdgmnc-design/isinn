-- İşinn — Talep takibi bildirim türleri (2026-10-26)
-- app/api/cron/demand-followups her gün:
--   new_job_match    : yeni ilanı uygun vitrin sahiplerine bildirir (tür zaten vardı),
--   message_reminder : ~1 gündür yanıtsız müşteri mesajı için vitrin sahibine hatırlatma,
--   similar_vitrins  : ~3 gündür yanıtsız kalan müşteriye benzer vitrin önerisi.
-- Cron, aynı kişiye aynı iş için ikinci kez göndermemek için önce bildirim satırını yazar; tür kısıtında yeni türler
-- yoksa satır yazılamaz ve e-posta hiç gönderilmez (güvenli taraf). Bu dosya iki yeni türü ekler.
-- Mevcut kısıttaki TÜM türler korunur. Idempotent: tekrar çalıştırmak güvenli.

do $$
declare
  def text;
  t text;
begin
  foreach t in array array['message_reminder', 'similar_vitrins'] loop
    select pg_get_constraintdef(c.oid) into def
    from pg_constraint c
    where c.conname = 'notifications_type_check' and c.conrelid = 'public.notifications'::regclass;
    if def is null then
      raise exception 'notifications_type_check bulunamadı';
    end if;
    if position(t in def) = 0 then
      def := replace(def, 'ARRAY[', 'ARRAY[''' || t || '''::text, ');
      alter table public.notifications drop constraint notifications_type_check;
      execute 'alter table public.notifications add constraint notifications_type_check ' || def;
    end if;
  end loop;
end $$;
