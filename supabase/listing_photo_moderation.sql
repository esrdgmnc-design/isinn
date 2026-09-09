-- İşinn — vitrin kapak fotoğrafı AI kontrolü de review_media ile aynı sınıfta
-- bir açığa sahipti: AI kontrolü (checkPhotoContent) tarayıcıda çalışıyordu,
-- sonucu yine tarayıcı yorumlayıp submit'i engelliyordu (handleSubmit'teki
-- moderation.status==='flagged' kontrolü). Teknik bilgisi olan biri bu adımı
-- hiç tetiklemeden (ya da hiç UI kullanmadan doğrudan insert ederek)
-- uygunsuz bir kapak fotoğrafını yayınlayabilirdi — kontrol edilen İÇERİK
-- değil, kontrolü ATLAMA riskiydi (review_media'daki ile birebir aynı kalıp).
--
-- review_media'dan farkı: orada approval_status diye ayrı bir kolon vardı,
-- burada services.images sadece düz bir url dizisi — o yüzden ayrı bir
-- "onaylanmış url'ler" tablosu + bir trigger ile, services'e SADECE
-- gerçekten sunucu tarafında AI onayından geçmiş url'lerin yazılabilmesini
-- veritabanı seviyesinde zorunlu kılıyoruz. Bu, review_media'dakinden bile
-- daha sıkı bir garanti — client'ın "AI onayladı" demesi yetmiyor, gerçekten
-- onaylanmış olması gerekiyor.

create table if not exists moderated_images (
  url text primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  approved boolean not null,
  reason text,
  checked_at timestamptz not null default now()
);

alter table moderated_images enable row level security;
-- Bilerek hiçbir client policy yok — bu tabloya sadece app/api/listing-photo-check
-- route'u (service_role ile) ve aşağıdaki trigger (tablo sahibi yetkisiyle,
-- security definer) erişebilir. authenticated/anon'un buraya ne okuma ne
-- yazma yetkisi olmalı (Supabase'in varsayılan "tüm tabloya tam yetki"
-- davranışını burada da bilerek kapatıyoruz).
revoke all on public.moderated_images from authenticated, anon;

create or replace function enforce_listing_photo_moderation()
returns trigger as $$
begin
  -- Fotoğraf hiç değişmediyse (örn. başlık/fiyat düzenleniyor) tekrar
  -- kontrol etmiyoruz — eski, bu sistemden önce onaylanmış vitrinlerin
  -- düzenlenmesini kırmamak için.
  if tg_op = 'UPDATE' and new.images is not distinct from old.images then
    return new;
  end if;

  if new.images is not null and array_length(new.images, 1) > 0 then
    if exists (
      select 1 from unnest(new.images) as img_url
      where not exists (
        select 1 from moderated_images m
        where m.url = img_url and m.approved = true and m.profile_id = new.provider_id
      )
    ) then
      raise exception 'Kapak fotoğrafı AI içerik kontrolünden geçmemiş ya da reddedilmiş.';
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_enforce_listing_photo_moderation on services;
create trigger trg_enforce_listing_photo_moderation
before insert or update on services
for each row execute function enforce_listing_photo_moderation();
