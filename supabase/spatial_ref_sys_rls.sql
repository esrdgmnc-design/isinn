-- Supabase Security Advisor: "RLS Disabled in Public" on public.spatial_ref_sys.
-- Bu bizim tablomuz değil, PostGIS eklentisinin otomatik oluşturduğu, ~8500
-- standart EPSG referans satırı içeren salt-okunur bir lookup tablosu (kullanıcı
-- verisi yok). RLS'i açıp herkese okuma izni veriyoruz — PostGIS fonksiyonlarının
-- ve mevcut sorguların bozulmaması için select serbest bırakılmalı.
alter table public.spatial_ref_sys enable row level security;

create policy "Public read access" on public.spatial_ref_sys
  for select using (true);
