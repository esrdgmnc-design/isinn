-- İşinn — yapay zekâ çağrı günlüğü (maliyet / gecikme / ret oranı gözlemlenebilirliği).
-- Supabase SQL Editor'de BİR KEZ çalıştır (idempotent). Kod bu SQL'den önce yayında olabilir:
-- günlük yazımı tablo yoksa sessizce atlanır, hiçbir akış bozulmaz.
--
-- Sadece SUNUCU (service role) yazar/okur: istemciye (anon/authenticated) hiçbir yetki verilmez.
-- İçerik (kullanıcı metni / model cevabı) KAYDEDİLMEZ; yalnızca sayaçlar.

create table if not exists ai_calls (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  feature text not null check (char_length(feature) between 1 and 40),
  model text not null default '',
  prompt_version text,
  input_tokens integer,
  output_tokens integer,
  latency_ms integer,
  status text not null default 'ok',
  meta jsonb
);
create index if not exists idx_ai_calls_feature_created on ai_calls(feature, created_at desc);

alter table ai_calls enable row level security;
revoke all on public.ai_calls from authenticated, anon;

-- Örnek analiz sorguları (SQL Editor'de çalıştır):
--   Özellik başına çağrı, ortalama gecikme, token:
--     select feature, count(*) n, round(avg(latency_ms)) ms, sum(input_tokens) in_tok, sum(output_tokens) out_tok
--     from ai_calls where created_at > now() - interval '7 days' group by feature order by n desc;
--   Hata/ret oranı:
--     select feature, status, count(*) from ai_calls where created_at > now() - interval '7 days' group by 1,2 order by 1,3 desc;
