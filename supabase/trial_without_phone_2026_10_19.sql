-- Ücretsiz dönemde deneme üyeliği için telefon şartı kalkıyor (kurucu kararı 2026-10-19).
-- Neden: telefon doğrulaması yalnızca Türk numarasıyla çalışıyor; yurt dışındaki kişi deneme
-- üyeliği alamadığı için vitrin açamıyordu. Artık doğrulanmış E-POSTA yeterli
-- (Google ile girenlerin e-postası Supabase'de zaten doğrulanmış sayılır).
-- İstemci tarafı: components/IsinnApp.jsx REQUIRE_PHONE_VERIFICATION = false (commit d0b6457).
-- free_period_extend_2027_01_01.sql'den SONRA çalıştır. Supabase SQL editöründe sırayla:
-- önce 1. adımı (yalnızca okur) çalıştırıp sayıya bak, sonra 2 ve 3.

-- 1) ÖNİZLEME (hiçbir şeyi değiştirmez): e-postası doğrulanmış ama üyeliği olmayan hesaplar
select count(*) as uyeligi_olmayan_dogrulanmis_hesap
from profiles p
join auth.users u on u.id = p.id
where u.email_confirmed_at is not null
  and not exists (select 1 from provider_subscriptions s where s.profile_id = p.id);

-- 2) Deneme üyeliği şartı: doğrulanmış telefon yerine doğrulanmış e-posta.
--    Geri almak için: free_period_extend_2027_01_01.sql'deki 2. adımı yeniden çalıştır.
create or replace function grant_trial_if_eligible(p_profile uuid)
returns void as $$
declare
  v_plan_id uuid;
  v_end timestamptz;
  r record;
begin
  if exists (select 1 from provider_subscriptions where profile_id = p_profile) then
    return;
  end if;
  if not exists (select 1 from auth.users where id = p_profile and email_confirmed_at is not null) then
    return;
  end if;
  select id into v_plan_id from subscription_plans where slug = 'standart' and active = true;
  if v_plan_id is null then
    return;
  end if;

  v_end := greatest(now() + interval '30 days', timestamptz '2027-01-01 20:00:00+00');
  insert into provider_subscriptions (profile_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
  values (p_profile, v_plan_id, 'trialing', 'monthly', now(), v_end);

  -- Üyelik yokluğundan kapatılmış vitrinleri tek tek, en eskiden başlayarak geri aç.
  for r in
    select id from services
    where provider_id = p_profile and deactivated_for_billing_at is not null
    order by created_at
  loop
    begin
      update services set active = true, deactivated_for_billing_at = null where id = r.id;
    exception when others then
      exit;
    end;
  end loop;
end;
$$ language plpgsql security definer set search_path = public, auth;

revoke all on function grant_trial_if_eligible(uuid) from public, anon, authenticated;

-- 3) Geriye dönük: e-postası doğrulanmış, üyeliği olmayan mevcut hesaplara deneme üyeliği ver
--    (bugüne kadar telefon doğrulamadığı için alamamış olanlar).
do $$
declare
  r record;
begin
  for r in
    select p.id from profiles p
    join auth.users u on u.id = p.id
    where u.email_confirmed_at is not null
      and not exists (select 1 from provider_subscriptions s where s.profile_id = p.id)
  loop
    perform grant_trial_if_eligible(r.id);
  end loop;
end $$;

-- 4) KONTROL: 1. adımdaki sayı artık 0 olmalı
select count(*) as kalan
from profiles p
join auth.users u on u.id = p.id
where u.email_confirmed_at is not null
  and not exists (select 1 from provider_subscriptions s where s.profile_id = p.id);
