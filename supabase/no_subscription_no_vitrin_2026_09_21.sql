-- Kural: ABONE OLMAYANA VİTRİN HAKKI YOK (ürün kararı, 2026-09-21).
-- Geçerli (süresi dolmamış) aktif ya da deneme ('trialing') bir abonelik yoksa
-- vitrin açılamaz/aktifleştirilemez. Eskiden 1 vitrin serbestti.
-- Ek Vitrin Paketi artık satılmıyor; daha önce alınmış ve süresi dolmamış olanlar
-- süreleri bitene kadar +3 verir (yalnızca geçerli aboneliği olanlara).
-- audit_fixes_2026_09_21.sql'den SONRA çalıştır (idempotent).
create or replace function enforce_vitrin_cap()
returns trigger as $$
declare
  v_cap integer;
  v_addon_id uuid;
  v_has_addon boolean;
  v_active_count integer;
begin
  if new.active is not true then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.active is true then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtext('vitrin_cap:' || new.provider_id::text));

  select coalesce(sp.max_active_listings, 1) into v_cap
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = new.provider_id
    and ps.status in ('active', 'trialing')
    and ps.current_period_end > now()
  order by ps.current_period_end desc
  limit 1;

  if v_cap is null then
    raise exception 'Vitrin açmak için aktif bir üyelik gerekir. Planlar sayfasından üyeliğini başlatabilirsin.';
  end if;

  select id into v_addon_id from addon_products where slug = 'ek-vitrin' and active = true;
  if v_addon_id is not null then
    select exists(
      select 1 from provider_addons
      where profile_id = new.provider_id and addon_id = v_addon_id
        and status = 'active' and current_period_end > now()
    ) into v_has_addon;
    if v_has_addon then
      v_cap := v_cap + 3;
    end if;
  end if;

  select count(*) into v_active_count
  from services
  where provider_id = new.provider_id and active = true
    and id is distinct from new.id;

  if v_active_count >= v_cap then
    raise exception 'Vitrin hakkını doldurdun (limit: %). Daha fazla vitrin için Pro Üyeliğe geçebilirsin.', v_cap;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;
