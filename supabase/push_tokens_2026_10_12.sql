-- iOS push bildirimi: cihaz anahtarları (APNs). Yazma yalnızca sunucu route'larından (service role) yapılır;
-- aynı cihaz anahtarı başka kullanıcıya geçebileceği için istemciye yazma izni verilmez.
create table if not exists public.device_push_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,
  platform text not null default 'ios',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists device_push_tokens_profile_idx on public.device_push_tokens(profile_id);

alter table public.device_push_tokens enable row level security;
drop policy if exists "device_push_tokens_select_own" on public.device_push_tokens;
create policy "device_push_tokens_select_own" on public.device_push_tokens for select using (auth.uid() = profile_id);
revoke insert, update, delete on public.device_push_tokens from anon, authenticated;

-- Hangi bildirim için push gönderildi (günlük sınır ve tekrar önleme)
alter table public.notifications add column if not exists push_sent_at timestamptz;
