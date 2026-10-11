-- İşinn — "Çalışmalarımı gör" bağlantısına kişinin kendi web sitesi eklendi (2026-10-11)
-- Kabul edilenler: Instagram/TikTok/YouTube/LinkedIn profil adresleri (değişmedi) + kendi web sitesi:
--   https, ASCII alan adı (IP/localhost/punycode yok), en çok 4 yol parçası, sorgu/parça/port/kullanıcı bilgisi yok.
-- Reddedilenler: kısaltıcılar, link-in-bio, mesajlaşma, diğer sosyal ağlar, pazaryerleri, dosya paylaşım adresleri.
-- lib/workLink.js (buildWebsite + WEB_DENY) ile aynı kurallar; ikisi birlikte güncellenmeli.

create or replace function validate_work_link()
returns trigger as $$
declare
  u text;
  h text;
  d text;
  deny text[] := array[
    'bit.ly','tinyurl.com','t.co','goo.gl','cutt.ly','rb.gy','is.gd','ow.ly','shorturl.at','we.tl',
    'linktr.ee','beacons.ai','lnk.bio','taplink.cc','carrd.co','bio.link','linkin.bio',
    'wa.me','whatsapp.com','t.me','telegram.me','telegram.org',
    'facebook.com','fb.com','fb.me','x.com','twitter.com','pinterest.com',
    'trendyol.com','hepsiburada.com','n11.com','etsy.com','shopier.com','ciceksepeti.com','sahibinden.com','dolap.com',
    'gittigidiyor.com','letgo.com','aliexpress.com','temu.com','myshopify.com','amazon.com','amazon.com.tr',
    'drive.google.com','docs.google.com','dropbox.com','wetransfer.com','mega.nz'
  ];
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
  if length(u) > 300 then
    raise exception 'Çalışma bağlantısı çok uzun.';
  end if;
  if u ~ '^https://www\.instagram\.com/[A-Za-z0-9._]{1,30}/$'
     or u ~ '^https://www\.tiktok\.com/@[A-Za-z0-9._]{2,24}$'
     or u ~ '^https://www\.youtube\.com/@[A-Za-z0-9._-]{3,30}$'
     or u ~ '^https://www\.youtube\.com/(channel|c|user)/[A-Za-z0-9._-]{1,60}$'
     or u ~ '^https://www\.linkedin\.com/(in|company)/[A-Za-z0-9_%-]{3,100}/$' then
    return new;
  end if;
  -- Kendi web sitesi
  if u ~ '^https://([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}(/[A-Za-z0-9._~%-]{1,60}){0,4}/?$'
     and u !~ '^https://([^/]*\.)?xn--' then
    h := substring(u from '^https://([^/]+)');
    foreach d in array deny loop
      if h = d or h like '%.' || d then
        raise exception 'Bu adres çalışma bağlantısı olarak eklenemez (kısaltılmış bağlantı, link-in-bio, mesajlaşma, pazaryeri ya da dosya paylaşım adresi).';
      end if;
    end loop;
    return new;
  end if;
  raise exception 'Çalışma bağlantısı Instagram, TikTok, YouTube, LinkedIn profil adresi ya da kendi web siten olmalı.';
end;
$$ language plpgsql security definer set search_path = public;
