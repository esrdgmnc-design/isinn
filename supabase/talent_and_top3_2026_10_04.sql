-- İşinn — 2026-10-04: iki özellik için veritabanı hazırlığı. Supabase Dashboard ->
-- SQL Editor'e yapıştırıp bir kez çalıştırın (idempotent: tekrar çalıştırmak zararsız).
--
-- 1) 'ai_match_top3' bildirim türü: iş ilanı verilince ilan sahibine "en uygun 3
--    profil" bildirimi (app/api/job-match/route.js). Bu tür kısıtta yoksa bildirim
--    yazılamaz ve özellik sessizce atlanır.
-- 2) talent_profiles: "Yeteneğini Farket" cevaplarının ve fikirlerin, kullanıcı
--    AYRI bir onay kutusuyla isterse hesabına kaydedilmesi. Satır yalnızca sahibi
--    tarafından okunur/yazılır/silinir; hesap silinince birlikte silinir (KVKK).
--    Tablo yoksa uygulama "kaydedilemedi" notu gösterir, başka bir şey bozulmaz.

-- 1) Bildirim türleri — önceki tüm dosyalardaki türlerin birleşimi + yenisi.
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'pending_media_approval', 'staff_review_needed', 'media_approved', 'media_rejected',
    'new_message', 'job_delivered', 'saved_search_match',
    'subscription_ending_soon', 'vitrin_deactivated', 'new_job_match',
    'service_favorited', 'ai_match_top3'
  ));

-- 2) Kayıtlı beceri/fikir profili.
create table if not exists talent_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  skills text check (skills is null or char_length(skills) <= 600),
  hours text check (hours is null or char_length(hours) <= 60),
  budget text check (budget is null or char_length(budget) <= 60),
  remote text check (remote is null or char_length(remote) <= 20),
  strength text check (strength is null or char_length(strength) <= 400),
  district text check (district is null or char_length(district) <= 80),
  suggestions jsonb check (suggestions is null or pg_column_size(suggestions) <= 20000),
  updated_at timestamptz not null default now()
);

alter table talent_profiles enable row level security;

drop policy if exists "Owner reads own talent profile" on talent_profiles;
create policy "Owner reads own talent profile" on talent_profiles for select
  using (auth.uid() = profile_id);

drop policy if exists "Owner inserts own talent profile" on talent_profiles;
create policy "Owner inserts own talent profile" on talent_profiles for insert
  with check (auth.uid() = profile_id);

drop policy if exists "Owner updates own talent profile" on talent_profiles;
create policy "Owner updates own talent profile" on talent_profiles for update
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "Owner deletes own talent profile" on talent_profiles;
create policy "Owner deletes own talent profile" on talent_profiles for delete
  using (auth.uid() = profile_id);

grant select, insert, update, delete on talent_profiles to authenticated;
