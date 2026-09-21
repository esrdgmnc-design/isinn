-- Ücretsiz dönem kuralı (2026-09-22): "eski kayıtlarda 3 ay tamamlanınca aboneliğe tabi".
-- Tüm hesaplar 20 Aralık 2026'ya kadar ücretsiz; bu tarihten SONRA kaydolanlar en az 30
-- günlük normal deneme alır. Bu tarihten ÖNCE kaydolanlar (telefonunu doğrulayınca)
-- deneme bitişi olarak ücretsiz dönemin sonunu (en az 30 gün) alır — böylece herkes aynı
-- gün aboneliğe tabi olur. phone_unique_and_cancel_2026_09_21.sql'den SONRA çalıştır.
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

  v_end := greatest(now() + interval '30 days', timestamptz '2026-12-20 20:00:00+00');
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

-- Süre artık yukarıdaki fonksiyonda hesaplanıyor; plan alanı normal 30 güne dönsün.
update subscription_plans set trial_days = 30 where slug = 'standart';
