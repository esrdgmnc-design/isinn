-- Ücretsiz lansman dönemi 20 Aralık 2026 → 1 Ocak 2027 (karar: 2026-10-16).
-- Kod tarafı lib/freePeriod.js'te (FREE_PERIOD_UNTIL_ISO = 2027-01-01T20:00:00Z).
-- Bu dosya veritabanını aynı tarihe çeker. free_period_trial_end_2026_09_22.sql'den SONRA çalıştır.
-- Supabase SQL editöründe sırayla: önce 1. adımı (yalnızca okur) çalıştırıp sayıya bak, sonra 2 ve 3.

-- 1) ÖNİZLEME (hiçbir şeyi değiştirmez): uzatılacak abonelikler
select status, count(*) as adet, min(current_period_end) as en_erken, max(current_period_end) as en_gec
from provider_subscriptions
where status in ('trialing', 'active')
  and current_period_end >= now()
  and current_period_end < timestamptz '2027-01-01 20:00:00+00'
group by status;

-- 2) Yeni kayıtların deneme bitişi: 1 Ocak 2027 (en az 30 gün kuralı aynen).
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
  if not exists (select 1 from profile_phone where profile_id = p_profile and verified = true) then
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
$$ language plpgsql security definer set search_path = public;

revoke all on function grant_trial_if_eligible(uuid) from public, anon, authenticated;

-- 3) Mevcut, henüz bitmemiş abonelikleri 1 Ocak 2027'ye uzat (kimsenin süresi kısalmaz:
--    yalnızca bu tarihten ÖNCE bitecek olanlar güncellenir; süresi geçmiş olanlara dokunulmaz).
update provider_subscriptions
set current_period_end = timestamptz '2027-01-01 20:00:00+00'
where status in ('trialing', 'active')
  and current_period_end >= now()
  and current_period_end < timestamptz '2027-01-01 20:00:00+00';
