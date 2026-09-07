-- İşinn — kullanıcı şikayet/engelleme. Önceki "Destek Talepleri" ekranı
-- (AdminReportsView) tamamen sahteydi — sadece o anki oturumun local
-- state'inde duruyordu, veritabanına hiç yazmıyordu ve hiçbir aksiyon butonu
-- yoktu. Bu, gerçek ve kalıcı bir alt yapı kuruyor.
--
-- Not: bu şemada henüz gerçek bir admin/staff rolü yok (schema (3).sql'in
-- kendi notu — "no admin/staff role defined here"), o yüzden şikayetleri
-- inceleyip aksiyon alacak bir "Yönetim" arayüzü ayrı, daha büyük bir iş
-- (gerçek bir rol sistemi gerektiriyor). Şimdilik en somut, hemen koruyucu
-- olan kısmı kuruyoruz: ENGELLEME gerçekten uygulanıyor (engellenen kişiyle
-- mesajlaşma kapanıyor), ŞİKAYET kalıcı olarak kaydediliyor (ileride bir
-- yönetim ekranı bu tabloyu okuyabilir).

create table if not exists user_blocks (
  id uuid primary key default uuid_generate_v4(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index if not exists idx_user_blocks_blocker on user_blocks(blocker_id);
create index if not exists idx_user_blocks_blocked on user_blocks(blocked_id);

alter table user_blocks enable row level security;
-- Sadece kendi engellediklerini görebilir/ekleyebilir/kaldırabilir. Kimin
-- kimi engellediği karşı tarafa asla görünmez (mahremiyet).
create policy "Users can view their own blocks" on user_blocks for select using (auth.uid() = blocker_id);
create policy "Users can create their own blocks" on user_blocks for insert with check (auth.uid() = blocker_id);
create policy "Users can remove their own blocks" on user_blocks for delete using (auth.uid() = blocker_id);

-- Mesaj göndermeden önce "aramızda herhangi bir yönde engel var mı" diye
-- sorulacak fonksiyon. RLS select policy'si sadece "auth.uid() = blocker_id"
-- olduğu için istemci diğer tarafın satırını doğrudan sorgulayamaz (bilerek —
-- kimin kimi engellediği karşı tarafa görünmemeli). Bu security definer
-- fonksiyon, YÖNÜ açıklamadan sadece true/false döner.
create or replace function is_blocked_between(other_id uuid)
returns boolean as $$
begin
  if auth.uid() is null then
    return false;
  end if;
  return exists (
    select 1 from user_blocks
    where (blocker_id = auth.uid() and blocked_id = other_id)
       or (blocker_id = other_id and blocked_id = auth.uid())
  );
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function is_blocked_between(uuid) to authenticated;

create table if not exists user_reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  reported_id uuid not null references profiles(id) on delete cascade,
  reason text not null,
  detail text,
  job_id uuid references jobs(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  check (reporter_id <> reported_id)
);
create index if not exists idx_user_reports_reported on user_reports(reported_id);

alter table user_reports enable row level security;
-- Bildiren kendi bildirdiklerini görebilir (geçmişini kontrol edebilsin).
-- Bildirilen kişi KENDİSİ hakkındaki şikayetleri GÖREMEZ (karşı misilleme
-- riskini azaltmak için bilerek). Gerçek bir yönetim rolü kurulduğunda o role
-- ayrı bir "tümünü gör" policy'si eklenebilir.
create policy "Reporters can view their own reports" on user_reports for select using (auth.uid() = reporter_id);
create policy "Users can create reports" on user_reports for insert with check (auth.uid() = reporter_id);
