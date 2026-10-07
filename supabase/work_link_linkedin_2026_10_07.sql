-- İşinn — "Çalışmalarımı gör" bağlantısına LinkedIn eklendi (2026-10-07)
-- Kabul edilen LinkedIn adresleri: kişi profili (/in/kullanici) ve şirket sayfası (/company/ad).
-- Gönderi, makale, iş ilanı, feed gibi adresler kabul edilmez. lib/workLink.js ile aynı kurallar.
-- (Yalnızca doğrulama fonksiyonu güncellenir; mevcut bağlantılar ve diğer platformlar değişmez.)

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
    or u ~ '^https://www\.linkedin\.com/(in|company)/[A-Za-z0-9_%-]{3,100}/$'
  ) then
    raise exception 'Çalışma bağlantısı yalnızca Instagram, TikTok, YouTube ya da LinkedIn profil adresi olabilir.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;
