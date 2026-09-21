-- İşinn — 2026-09-22 (ajan önerilerinin uygulanması). Supabase SQL Editor'de TEK SEFERDE
-- çalıştırılabilir, idempotent. Önceki dosyalardan (audit_fixes_2026_09_21, no_subscription…,
-- phone_unique_and_cancel…) SONRA çalıştır. Kod bu dosya çalıştırılmadan da hata vermez
-- (yeni özellikler sessizce pasif kalır); çalıştırınca devreye girer.

-- ============================================================
-- 1) Yeni ilan -> uygun sağlayıcılara bildirim (talep sağlayıcıya ulaşsın)
-- ============================================================
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'pending_media_approval', 'staff_review_needed', 'media_approved', 'media_rejected',
    'new_message', 'job_delivered', 'saved_search_match',
    'subscription_ending_soon', 'vitrin_deactivated', 'new_job_match'
  ));

-- Aynı kategoride yayında vitrini olan (ve şehri eşleşen ya da uzaktan) en fazla 30
-- sağlayıcıya uygulama içi bildirim. Vitrinden doğan "görüşme" satırları (service_id dolu)
-- gerçek ilan değildir, bildirim üretmez.
create or replace function notify_matching_providers()
returns trigger as $$
declare
  v_city text;
begin
  if new.active is not true or new.service_id is not null then
    return new;
  end if;
  v_city := lower(trim(regexp_replace(coalesce(new.city, ''), '^.*,\s*', '')));

  insert into notifications (profile_id, type, title, body, related_job_id)
  select p.provider_id, 'new_job_match', 'Kategorinde yeni bir ilan var', new.title, new.id
  from (
    select distinct s.provider_id
    from services s
    where s.active = true
      and s.category_id = new.category_id
      and s.provider_id <> new.client_id
      and (
        new.is_remote is true
        or s.is_remote is true
        or (v_city <> '' and lower(coalesce(s.city, '')) like '%' || v_city || '%')
      )
    limit 30
  ) p;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_notify_matching_providers on jobs;
create trigger trg_notify_matching_providers
  after insert on jobs
  for each row execute function notify_matching_providers();

-- ============================================================
-- 2) Yorum güvenliği: tek taraflı "teslim" ile sahte yorum yazılamasın
-- ============================================================
-- Eskiden işi sağlayıcının kendisi "delivered" yapabiliyor, ardından bir tanıdık hesap
-- 5 yıldız bırakabiliyordu. Artık yorum için işin gerçek bir yazışmaya dayanması gerekir:
-- en az 3 mesaj ve ilk mesajdan en az 12 saat sonra.
create or replace function validate_rating_insert()
returns trigger as $$
declare
  v_job record;
  v_provider uuid;
  v_msgs integer;
  v_first timestamptz;
begin
  if auth.uid() is null then
    return new;
  end if;
  if new.rater_id = new.rated_profile_id then
    raise exception 'Kendini değerlendiremezsin.';
  end if;

  select client_id, state, service_id into v_job from jobs where id = new.job_id;
  if not found then
    raise exception 'Değerlendirilecek iş bulunamadı.';
  end if;
  if v_job.client_id is distinct from new.rater_id then
    raise exception 'Sadece işin müşterisi değerlendirme yazabilir.';
  end if;
  if v_job.state is distinct from 'delivered' then
    raise exception 'Değerlendirme için işin teslim edilmiş olması gerekir.';
  end if;
  if v_job.service_id is not null then
    select provider_id into v_provider from services where id = v_job.service_id;
    if v_provider is distinct from new.rated_profile_id then
      raise exception 'Değerlendirilen kişi bu işin sağlayıcısı değil.';
    end if;
    if new.service_id is not null and new.service_id is distinct from v_job.service_id then
      raise exception 'Değerlendirilen vitrin bu işe ait değil.';
    end if;
  end if;

  select count(*), min(created_at) into v_msgs, v_first from messages where job_id = new.job_id;
  if v_msgs < 3 then
    raise exception 'Değerlendirme için taraflar arasında yeterli yazışma olmalı.';
  end if;
  if v_first > now() - interval '12 hours' then
    raise exception 'Değerlendirme, ilk yazışmadan en az 12 saat sonra yazılabilir.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- ============================================================
-- 3) Ölçüm: huni olayları + UTM (kendi olay tablomuz)
-- ============================================================
create table if not exists events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 64),
  profile_id uuid,
  session_id text check (session_id is null or char_length(session_id) <= 64),
  props jsonb check (props is null or pg_column_size(props) <= 2000)
);
create index if not exists idx_events_name_created on events(name, created_at desc);
alter table events enable row level security;

drop policy if exists "Anyone can insert events" on events;
create policy "Anyone can insert events" on events for insert
  with check (profile_id is null or profile_id = auth.uid());

drop policy if exists "Admins can read events" on events;
create policy "Admins can read events" on events for select
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));

grant insert on events to anon, authenticated;
