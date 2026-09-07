-- İşinn — Destek Asistanı sohbetinin "yönetime bildir" adımı gerçekten
-- çalışır hale geldi (bkz. az önce düzeltilen api.anthropic.com bug'ı), ama
-- rapor hâlâ sadece o anki tarayıcı oturumunun local state'inde duruyordu —
-- sayfa yenilenince kayboluyordu, başka bir cihaz/oturum hiç göremiyordu.
-- Bu, user_reports (supabase/user_safety.sql) ile aynı desende gerçek bir
-- tablo kuruyor: bildiren kendi geçmiş taleplerini görebilir. Bu şemada
-- gerçek bir admin/personel rolü yok, o yüzden "herkes hepsini görsün"
-- policy'si eklenmiyor — aynı bilinçli sınır user_reports'ta da var.

create table if not exists support_tickets (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  category text not null check (category in ('teknik sorun', 'istek', 'şikayet', 'diğer')),
  summary text not null,
  transcript text, -- tam konuşma metni — özet yeterli olmazsa gerçek bağlam için
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists idx_support_tickets_reporter on support_tickets(reporter_id);

alter table support_tickets enable row level security;
create policy "Reporters can view their own support tickets" on support_tickets for select using (auth.uid() = reporter_id);
create policy "Users can create their own support tickets" on support_tickets for insert with check (auth.uid() = reporter_id);
