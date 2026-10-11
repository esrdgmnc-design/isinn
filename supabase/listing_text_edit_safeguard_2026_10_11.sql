-- İşinn — Vitrin metni düzenleme güvencesi (2026-10-11)
-- Amaç: İşinn, hizmet verenin yazdığı vitrin açıklamasını (kurucu yetkisiyle, yapay zekâ desteğiyle) düzenlediğinde
--   1) eski metin saklanır (description_prev), düzenleme zamanı kaydedilir (description_edited_at),
--   2) sahibi vitrin detayında "Eski metne dön" / "Böyle kalsın" seçeneklerini görür; ziyaretçi, metnin düzenlendiğini görür,
--   3) sahibi kendi metnini sonradan değiştirirse bu işaret otomatik temizlenir,
--   4) sahibine uygulama içi bildirim gönderilebilir (type: listing_text_edited).
-- Idempotent.

alter table public.services add column if not exists description_prev text;
alter table public.services add column if not exists description_edited_at timestamptz;
-- Bilerek update/insert grant'i verilmiyor: sağlayıcı bu iki kolonu doğrudan yazamaz, yalnızca aşağıdaki RPC ile çözer.

-- Bildirim türü: mevcut kısıttaki TÜM türler korunur, yeni tür eklenir (hangi migration'ın en son çalıştığına bakmadan).
do $$
declare
  def text;
begin
  select pg_get_constraintdef(c.oid) into def
  from pg_constraint c
  where c.conname = 'notifications_type_check' and c.conrelid = 'public.notifications'::regclass;
  if def is null then
    raise exception 'notifications_type_check bulunamadı';
  end if;
  if position('listing_text_edited' in def) = 0 then
    def := replace(def, 'ARRAY[', 'ARRAY[''listing_text_edited''::text, ');
    alter table public.notifications drop constraint notifications_type_check;
    execute 'alter table public.notifications add constraint notifications_type_check ' || def;
  end if;
end $$;

-- Sahibi kendi metnini değiştirirse (oturum açmış kullanıcı), düzenleme işareti kalkar.
create or replace function clear_description_edit_flag()
returns trigger as $$
begin
  if new.description is distinct from old.description and auth.uid() is not null then
    new.description_prev := null;
    new.description_edited_at := null;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_clear_description_edit_flag on public.services;
create trigger trg_clear_description_edit_flag
before update on public.services
for each row execute function clear_description_edit_flag();

-- Sahibinin kararı: eski metne dön (p_restore = true) ya da düzenlenmiş metin kalsın (false).
create or replace function resolve_listing_description(p_service_id uuid, p_restore boolean)
returns void as $$
declare
  v_owner uuid;
  v_prev text;
begin
  select provider_id, description_prev into v_owner, v_prev from public.services where id = p_service_id;
  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'Bu vitrin sana ait değil.';
  end if;
  if v_prev is null then
    return;
  end if;
  if p_restore then
    update public.services set description = v_prev, description_prev = null, description_edited_at = null where id = p_service_id;
  else
    update public.services set description_prev = null, description_edited_at = null where id = p_service_id;
  end if;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function resolve_listing_description(uuid, boolean) from public, anon;
grant execute on function resolve_listing_description(uuid, boolean) to authenticated;
