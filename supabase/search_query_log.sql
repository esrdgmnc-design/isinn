-- İşinn — pazar açığı analizi için ("hangi kategoriler talep görüyor ama
-- arzı yok" sorusu, 2026-09-11 konuşması). Önceden sadece kullanıcının
-- BİLEREK kaydettiği aramalar tutuluyordu (saved_searches) — asıl değerli
-- sinyal olan "insanlar ne arıyor ama bulamıyor" (özellikle sıfır sonuçlu
-- aramalar) hiç loglanmıyordu.
--
-- Kişisel veri taşımıyor — kimin aradığını değil, SADECE arama metnini ve
-- kaç sonuç döndüğünü tutuyor (profile_id yok, bilerek). Bu yüzden KVKK
-- açısından kişiselleştirilmiş bir veri değil, anonim kullanım istatistiği.

create table if not exists search_queries (
  id uuid primary key default uuid_generate_v4(),
  query text not null,
  result_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_search_queries_created on search_queries(created_at desc);

alter table search_queries enable row level security;

-- Kimlik doğrulaması olsun olmasın herkes (anonim gezinen dahil) bir arama
-- logu ekleyebilir — kişisel veri taşımadığı için bunun bir riski yok.
create policy "Anyone can log a search query" on search_queries
  for insert with check (true);

-- Sadece adminler (pazar analizi amaçlı) okuyabilir.
create policy "Admins can view search queries" on search_queries
  for select using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
