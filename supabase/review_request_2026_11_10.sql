-- İşinn — Yorum isteği bildirim türü (2026-11-10)
-- app/api/cron/demand-followups her gün, iki tarafça onaylanmış ve henüz yorumlanmamış işler için müşteriye TEK bir
-- yorum isteği e-postası gönderir. Cron, aynı iş için ikinci kez göndermemek için önce bildirim satırını yazar; tür
-- kısıtında 'review_request' yoksa satır yazılamaz ve e-posta hiç gönderilmez (güvenli taraf). Bu dosya türü ekler.
-- Mevcut kısıttaki TÜM türler korunur. Idempotent: tekrar çalıştırmak güvenli.

do $$
declare
  def text;
  t text;
begin
  foreach t in array array['review_request'] loop
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
