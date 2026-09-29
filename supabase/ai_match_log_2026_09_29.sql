-- İşinn — 2026-09-29: AI eşleştirme sonuçlarını kalıcı olarak logla.
-- İhtiyaç: TÜBİTAK sunumu için "AI eşleştirme gerçekten çalışıyor" iddiasını
-- somut, sahte olmayan rakamlarla kanıtlamak (kaç kez çalıştı, ortalama puan,
-- kullanıcı seçim oranı). Şu ana kadar AIMatchView'in ürettiği sonuç hiçbir
-- yere yazılmıyordu, sadece ekranda görünüp sayfa kapanınca kayboluyordu.
-- Idempotent.

create table if not exists ai_match_log (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete set null,
  client_id uuid not null references profiles(id) on delete cascade,
  candidate_service_id uuid references services(id) on delete set null,
  candidate_name text,
  match_score integer,
  reason text,
  rank integer,
  model text default 'claude-sonnet-4-6',
  selected boolean not null default false,
  created_at timestamptz not null default now()
);

alter table ai_match_log enable row level security;

-- Sadece kendi eşleştirme geçmişini görebilir/yazabilir (müşteri tarafı).
drop policy if exists "ai_match_log_select_own" on ai_match_log;
create policy "ai_match_log_select_own" on ai_match_log
  for select using (auth.uid() = client_id);

drop policy if exists "ai_match_log_insert_own" on ai_match_log;
create policy "ai_match_log_insert_own" on ai_match_log
  for insert with check (auth.uid() = client_id);

drop policy if exists "ai_match_log_update_own" on ai_match_log;
create policy "ai_match_log_update_own" on ai_match_log
  for update using (auth.uid() = client_id);
