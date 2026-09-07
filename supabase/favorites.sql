-- İşinn — gerçek favoriler. Kalp ikonu şimdiye kadar sadece o anki ekranın
-- local state'inde işaretleniyordu — hiçbir yere kaydedilmiyordu, sayfa
-- yenilenince kayboluyordu ve favorileri görebileceğin bir sayfa da yoktu.
-- Bu tablo gerçek kalıcılığı sağlıyor.

create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_id, service_id)
);
create index if not exists idx_favorites_profile on favorites(profile_id);

alter table favorites enable row level security;
create policy "Owners can view their own favorites" on favorites for select using (auth.uid() = profile_id);
create policy "Owners can add their own favorites" on favorites for insert with check (auth.uid() = profile_id);
create policy "Owners can remove their own favorites" on favorites for delete using (auth.uid() = profile_id);
