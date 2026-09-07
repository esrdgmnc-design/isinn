-- İşinn — profil medyası (fotoğraf, tanıtım videosu, portföy) için ek kurulum.
-- schema.sql'de zaten sertifika/CV (provider_documents) ve profil fotoğrafı
-- (profiles.avatar_url) alt yapısı vardı, ama tanıtım videosu ve "iş başında"
-- portföy galerisi için hiç kolon/tablo yoktu. Bunu bir kere Supabase SQL
-- Editor'de çalıştırman yeterli.

-- Tanıtım videosu: profil başına tek video, bu yüzden profiles'a iki kolon yeterli.
alter table profiles add column if not exists video_intro_url text;
alter table profiles add column if not exists video_intro_name text;

-- Portföy: "iş başında" galerisi, profil başına birden fazla foto/video.
create table if not exists portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  url text not null,
  file_name text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_portfolio_items_profile on portfolio_items(profile_id);

alter table portfolio_items enable row level security;
create policy "Portfolio items are viewable by everyone" on portfolio_items for select using (true);
create policy "Owners can insert their own portfolio items" on portfolio_items for insert with check (auth.uid() = profile_id);
create policy "Owners can delete their own portfolio items" on portfolio_items for delete using (auth.uid() = profile_id);

-- CV'ler için schema.sql sadece PDF/JPEG/PNG'ye izin veriyordu — insanlar CV'sini
-- Word (.doc/.docx) olarak da yükleyebilsin diye bucket'ın izinli mime tiplerini genişletiyoruz.
update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png'
]
where id = 'provider-documents';

-- Profil fotoğrafı + tanıtım videosu + portföy için PUBLIC bir bucket
-- (review-media'ya benzer, ama profil sahibinin kendi medyası için).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-media',
  'profile-media',
  true,
  104857600, -- 100MB (video intro için)
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
)
on conflict (id) do nothing;

create policy "Profile media files are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'profile-media');

-- App convention: upload to profile-media/{user_id}/{filename}
create policy "Users can upload their own profile media"
  on storage.objects for insert
  with check (bucket_id = 'profile-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own profile media"
  on storage.objects for delete
  using (bucket_id = 'profile-media' and auth.uid()::text = (storage.foldername(name))[1]);
