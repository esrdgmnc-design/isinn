-- İşinn — Yönetim Paneli'ne "siteye uğrayanların sayısı" eklemek için
-- (2026-09-13 konuşması). search_queries ile aynı prensip: kimin geldiğini
-- değil, SADECE ne zaman bir ziyaret olduğunu tutuyor — profile_id, IP,
-- cihaz bilgisi, çerez yok. Bu yüzden KVKK açısından kişisel veri değil,
-- anonim kullanım istatistiği (aynı search_queries.sql'deki gerekçe).
--
-- "Ziyaretçi" değil "ziyaret" saydığımızı unutma: aynı kişi farklı
-- zamanlarda birden çok kez gelirse birden çok satır olur (tekil ziyaretçi
-- değil, tarayıcı sekmesi/oturumu başına bir kayıt — bkz. IsinnApp.jsx'teki
-- loglama effect'i, sessionStorage ile aynı sekmede tekrar saymayı önlüyor).

create table if not exists page_views (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now()
);
create index if not exists idx_page_views_created on page_views(created_at desc);

alter table page_views enable row level security;

create policy "Anyone can log a page view" on page_views
  for insert with check (true);

create policy "Admins can view page views" on page_views
  for select using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
