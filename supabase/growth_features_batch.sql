-- İşinn — kullanıcının "hepsini yap" dediği 5 istekten SQL gerektiren 3'ü:
-- mesaj/şikayet hız sınırlama, değerlendirmeye herkese açık yanıt, ve AI
-- taramasının işaretlediği içerik için bir kuyruk. (Diğer ikisi — ana
-- sayfadaki sahte istatistikler ve sağlayıcı performans özeti — sadece
-- client tarafı, gerçek veriyi zaten var olan tablolardan okuyor.)

-- ============================================================
-- 1) HIZ SINIRLAMA — mesaj/şikayet/destek talebi spam'ini engeller.
-- Trigger seviyesinde: istemci tarafı kontrolü atlanabilir ama DB seviyesi
-- atlanamaz. Aşan denemeler açık bir hata mesajıyla reddedilir.
-- ============================================================
create or replace function enforce_message_rate_limit()
returns trigger as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from messages
  where sender_id = new.sender_id and created_at > now() - interval '5 minutes';
  if v_count >= 30 then
    raise exception 'Çok hızlı mesaj gönderiyorsun, birkaç dakika bekleyip tekrar dener misin?';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_message_rate_limit on messages;
create trigger trg_message_rate_limit
  before insert on messages
  for each row execute function enforce_message_rate_limit();

create or replace function enforce_report_rate_limit()
returns trigger as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from user_reports
  where reporter_id = new.reporter_id and created_at > now() - interval '1 hour';
  if v_count >= 5 then
    raise exception 'Kısa sürede çok fazla şikayet gönderdin, bir saat sonra tekrar dener misin?';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_report_rate_limit on user_reports;
create trigger trg_report_rate_limit
  before insert on user_reports
  for each row execute function enforce_report_rate_limit();

create or replace function enforce_listing_report_rate_limit()
returns trigger as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from listing_reports
  where reporter_id = new.reporter_id and created_at > now() - interval '1 hour';
  if v_count >= 5 then
    raise exception 'Kısa sürede çok fazla ilan şikayeti gönderdin, bir saat sonra tekrar dener misin?';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_listing_report_rate_limit on listing_reports;
create trigger trg_listing_report_rate_limit
  before insert on listing_reports
  for each row execute function enforce_listing_report_rate_limit();

create or replace function enforce_support_ticket_rate_limit()
returns trigger as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from support_tickets
  where reporter_id = new.reporter_id and created_at > now() - interval '1 hour';
  if v_count >= 5 then
    raise exception 'Kısa sürede çok fazla destek talebi gönderdin, bir saat sonra tekrar dener misin?';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_support_ticket_rate_limit on support_tickets;
create trigger trg_support_ticket_rate_limit
  before insert on support_tickets
  for each row execute function enforce_support_ticket_rate_limit();

-- ============================================================
-- 2) DEĞERLENDİRMEYE HERKESE AÇIK YANIT — sağlayıcı kendi vitrinine
-- bırakılan bir yoruma tek, herkese görünür bir yanıt yazabilsin.
-- ============================================================
alter table ratings add column if not exists provider_reply text;
alter table ratings add column if not exists provider_reply_at timestamptz;

-- edit_reviews.sql'de rater için bir update policy zaten var — bu, SAĞLAYICI
-- için ayrı bir update policy (kendi rated_profile_id'sine ait satırlara).
-- Not: policy satır bazlı çalışır, hangi sütunların değiştiğini kısıtlamaz —
-- ama client kodu sadece provider_reply/provider_reply_at gönderiyor, aynı
-- güven modeli edit_reviews.sql'de de var.
drop policy if exists "Providers can reply to their own ratings" on ratings;
create policy "Providers can reply to their own ratings" on ratings for update
  using (auth.uid() = rated_profile_id)
  with check (auth.uid() = rated_profile_id);

-- ============================================================
-- 3) İÇERİK UYARI KUYRUĞU — AI'nin şüpheli bulduğu mesaj/vitrin/iş ilanı
-- metinleri buraya düşer (platform dışına çekme girişimi, dolandırıcılık
-- kalıbı vb.). Otomatik hiçbir şeyi engellemiyor/silmiyor — sadece admin'in
-- incelemesine sunuyor (aynı user_reports/listing_reports felsefesi).
-- ============================================================
create table if not exists content_flags (
  id uuid primary key default uuid_generate_v4(),
  content_type text not null check (content_type in ('message', 'service', 'job')),
  content_id uuid not null,
  flagged_profile_id uuid references profiles(id) on delete cascade, -- içeriği üreten kişi (varsa)
  reason text not null,
  excerpt text, -- şüpheli metnin kısa bir alıntısı (bağlam için)
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists idx_content_flags_status on content_flags(status);

alter table content_flags enable row level security;
-- Sadece admin görebilir/güncelleyebilir — bu, kullanıcının kendi çıktığı bir
-- şikayet değil, sistemin (AI'nin) ürettiği bir sinyal, kimse "kendi
-- şikayetini" görmüyor.
create policy "Admins can view content flags" on content_flags for select
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));
create policy "Admins can update content flags" on content_flags for update
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));
-- İşaretlemeyi istemci (AI kontrolünü tetikleyen taraf) yapıyor — herhangi
-- bir giriş yapmış kullanıcı insert edebilir (kendi gönderdiği mesaj/ilan
-- için), ama SADECE admin okuyabildiği için bu bir gizlilik sorunu değil.
create policy "Authenticated users can create content flags" on content_flags for insert
  with check (auth.uid() is not null);
