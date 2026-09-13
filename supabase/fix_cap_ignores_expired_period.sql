-- GERÇEK HATA (2026-09-13, "farklı senaryolar/profiller" taramasında
-- bulundu) — enforce_job_cap() ilan tavanını hesaplarken sadece
-- provider_subscriptions.status'a bakıyordu, current_period_end'in geçip
-- geçmediğine hiç bakmıyordu. sync_subscription_period kapatıldıktan sonra
-- (bkz. revoke_free_grant_rpcs.sql) bu daha da önemli hale geldi: biri bir
-- kere Pro'ya ödesin, dönemi bitsin, bir daha hiç ödemesin — status hâlâ
-- 'active' kalacağı için bu fonksiyon onu SÜRESİZ olarak Pro'nun 20 ilan
-- hakkıyla değerlendirmeye devam ederdi. Artık sadece süresi hâlâ geçerli
-- (current_period_end > now()) bir abonelik sayılıyor.

create or replace function enforce_job_cap()
returns trigger as $$
declare
  v_cap integer;
  v_active_count integer;
begin
  if new.active is not true then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.active is true then
    return new;
  end if;
  if new.service_id is not null then
    return new;
  end if;

  select coalesce(sp.max_active_jobs, 5) into v_cap
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = new.client_id
    and ps.status in ('active', 'trialing')
    and ps.current_period_end > now()
  order by ps.current_period_end desc
  limit 1;

  if v_cap is null then
    v_cap := 5;
  end if;

  select count(*) into v_active_count
  from jobs
  where client_id = new.client_id and active = true and service_id is null
    and id is distinct from new.id;

  if v_active_count >= v_cap then
    raise exception 'Aynı anda en fazla % aktif ilanın olabilir. Yeni bir ilan açmak için önce eski bir tanesini pasife al.', v_cap;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;
