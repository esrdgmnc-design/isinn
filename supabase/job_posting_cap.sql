-- İşinn — ilan verme (jobs) tamamen sınırsızdı, hiçbir tavanı yoktu.
-- Kullanıcının kendi kararı (güvenlik amaçlı): kötü niyetli ya da dikkatsiz
-- biri yüzlerce ilan açıp platformu çöplüğe çevirebilirdi. Vitrin sınırıyla
-- aynı desen: plana göre değişen bir tavan — Standart 5, Pro 10 aktif ilan.
alter table subscription_plans add column if not exists max_active_jobs integer;
update subscription_plans set max_active_jobs = 5 where slug = 'standart';
update subscription_plans set max_active_jobs = 20 where slug = 'pro';

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

  select coalesce(sp.max_active_jobs, 5) into v_cap
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = new.client_id and ps.status in ('active', 'trialing')
  order by ps.current_period_end desc
  limit 1;

  if v_cap is null then
    v_cap := 5; -- hiç abonelik satırı yoksa Standart'la aynı
  end if;

  select count(*) into v_active_count
  from jobs
  where client_id = new.client_id and active = true
    and id is distinct from new.id;

  if v_active_count >= v_cap then
    raise exception 'Aynı anda en fazla % aktif ilanın olabilir. Yeni bir ilan açmak için önce eski bir tanesini pasife al.', v_cap;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_enforce_job_cap on jobs;
create trigger trg_enforce_job_cap
before insert or update on jobs
for each row execute function enforce_job_cap();
