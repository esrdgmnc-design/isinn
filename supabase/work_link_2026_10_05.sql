-- İşinn — vitrinlere isteğe bağlı "Çalışmalarımı gör" bağlantısı (Instagram / YouTube / TikTok).
-- Supabase SQL Editor'de BİR KEZ çalıştır (idempotent). Kod bu SQL'den ÖNCE yayında olabilir:
-- istemci yalnızca kullanıcı bağlantı yazarsa work_link_url gönderir.
--
-- ÖNEMLİ: lock_row_ownership_columns.sql dosyasını yeniden ÇALIŞTIRMA — o liste
-- professional_credential'ı içermiyor, yeniden çalıştırmak onun yetkisini düşürür.
-- Burada yalnızca YENİ kolon için grant veriyoruz (audit_fixes_2026_09_19.sql'deki kalıp).

alter table services add column if not exists work_link_url text;
-- Yönetici kapatma bayrağı: bilerek grant listesinde YOK, sağlayıcı kendi kendine açamaz.
alter table services add column if not exists work_link_blocked boolean not null default false;

grant update (work_link_url) on public.services to authenticated;
grant insert (work_link_url) on public.services to authenticated;

-- Biçim kuralları (lib/workLink.js ile aynı): yalnızca https + Instagram/TikTok/YouTube profil adresi.
-- Kanonik olmayanı reddeder, yeniden yazmaz. Sorgu/parça, port, kullanıcı bilgisi, kısaltıcı, mesajlaşma ve
-- mağaza alan adları bu desenlerin dışında kaldığı için kabul edilmez.
create or replace function validate_work_link()
returns trigger as $$
declare
  u text;
begin
  u := new.work_link_url;
  if u is null or btrim(u) = '' then
    new.work_link_url := null;
    return new;
  end if;
  -- Bağlantı değişmediyse (başlık/fiyat düzenleniyor) yeniden doğrulama.
  if tg_op = 'UPDATE' and new.work_link_url is not distinct from old.work_link_url then
    return new;
  end if;
  if new.work_link_blocked then
    raise exception 'Bu vitrinin çalışma bağlantısı yönetici tarafından kapatıldı.';
  end if;
  if length(u) > 300 or not (
       u ~ '^https://www\.instagram\.com/[A-Za-z0-9._]{1,30}/$'
    or u ~ '^https://www\.tiktok\.com/@[A-Za-z0-9._]{2,24}$'
    or u ~ '^https://www\.youtube\.com/@[A-Za-z0-9._-]{3,30}$'
    or u ~ '^https://www\.youtube\.com/(channel|c|user)/[A-Za-z0-9._-]{1,60}$'
  ) then
    raise exception 'Çalışma bağlantısı yalnızca Instagram, TikTok ya da YouTube profil adresi olabilir.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_validate_work_link on services;
create trigger trg_validate_work_link
before insert or update on services
for each row execute function validate_work_link();

-- Yönetici bağlantıyı kaldırıp kapatabilsin (services için admin update policy'si bilinmediğinden RPC).
create or replace function admin_set_work_link_block(p_service_id uuid, p_block boolean)
returns void as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_admin) then
    raise exception 'Yetkisiz.';
  end if;
  update services
     set work_link_blocked = p_block,
         work_link_url = case when p_block then null else work_link_url end
   where id = p_service_id;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function admin_set_work_link_block(uuid, boolean) from public, anon;
grant execute on function admin_set_work_link_block(uuid, boolean) to authenticated;
