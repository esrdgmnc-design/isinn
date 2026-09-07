-- İşinn — sahibinden.com stratejisinden (ücretsiz keşif katmanı, ödeme
-- koruması yok, sadece görünürlük/güven araçları) alınan 3 özellik:
--   1) İlanı Bildir — user_reports sadece KİŞİYİ şikayet ediyordu, bir
--      vitrini/iş ilanını kendisini (yanlış kategori, sahte, kopya) bildirme
--      yolu yoktu.
--   2) Kayıtlı Arama + bildirim — bir arama kaydedilebilsin, o aramaya uyan
--      yeni bir vitrin/iş ilanı geldiğinde bildirim gitsin (yeni bildirim
--      merkezi bunun üstüne oturuyor).
--   3) İlan Yenile ("bump") — iş ilanları sessizce eskiyip listede dibe
--      batmasın, sahibi manuel olarak üste çıkarabilsin.

-- 1) İlan şikayeti — user_reports'tan bilerek ayrı bir tablo: bir kişiyi
-- değil, bir İLANIN KENDİSİNİ (yanlış kategori, sahte/şüpheli, kopya) bildirme.
create table if not exists listing_reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  reason text not null check (reason in ('yanlis_kategori', 'supheli_sahte', 'kopya_ilan', 'uygunsuz_icerik', 'diger')),
  detail text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  check ((service_id is not null) <> (job_id is not null)) -- tam olarak biri: ya vitrin ya iş ilanı
);
create index if not exists idx_listing_reports_service on listing_reports(service_id);
create index if not exists idx_listing_reports_job on listing_reports(job_id);

alter table listing_reports enable row level security;
create policy "Reporters can view their own listing reports" on listing_reports for select using (auth.uid() = reporter_id);
create policy "Users can create listing reports" on listing_reports for insert with check (auth.uid() = reporter_id);
-- Admin erişimi — bkz. admin_role.sql'deki aynı desen.
create policy "Admins can view all listing reports" on listing_reports for select
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));
create policy "Admins can update listing report status" on listing_reports for update
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));

-- 2) Kayıtlı arama — basit tutuldu: serbest metin (tam metin araması gibi
-- ILIKE ile), kategori/şehir filtresi opsiyonel. Yeni bir vitrin/iş ilanı
-- yayına girince eşleşen aramaları olan herkese bildirim gider.
create table if not exists saved_searches (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  query text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_saved_searches_profile on saved_searches(profile_id);

alter table saved_searches enable row level security;
create policy "Users can view their own saved searches" on saved_searches for select using (auth.uid() = profile_id);
create policy "Users can create their own saved searches" on saved_searches for insert with check (auth.uid() = profile_id);
create policy "Users can delete their own saved searches" on saved_searches for delete using (auth.uid() = profile_id);

alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'pending_media_approval', 'staff_review_needed', 'media_approved', 'media_rejected',
    'new_message', 'job_delivered', 'saved_search_match'
  ));

create or replace function notify_saved_search_matches()
returns trigger as $$
begin
  if new.active then
    insert into notifications (profile_id, type, title, body, related_service_id)
    select s.profile_id, 'saved_search_match',
      'Kaydettiğin aramaya uyan yeni bir vitrin var',
      new.title,
      new.id
    from saved_searches s
    where s.profile_id <> new.provider_id
      and (new.title ilike '%' || s.query || '%' or coalesce(new.description, '') ilike '%' || s.query || '%');
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_notify_saved_search_matches on services;
create trigger trg_notify_saved_search_matches
  after insert on services
  for each row execute function notify_saved_search_matches();

-- 3) İlan yenile ("bump") — sadece iş ilanları için (jobs). Var olan
-- "Clients can update their own jobs" RLS policy'si (auth.uid() = client_id)
-- zaten bu update'e izin veriyor, yeni bir policy gerekmiyor.
alter table jobs add column if not exists bumped_at timestamptz;
update jobs set bumped_at = created_at where bumped_at is null;
alter table jobs alter column bumped_at set default now();
alter table jobs alter column bumped_at set not null;
