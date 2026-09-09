-- İşinn — Standart Üyelik vitrin hakkı 1'den 2'ye çıkarıldı. Gerçek kullanıcı
-- geri bildirimi: iki alakasız beceri sunan biri (örn. diksiyon eğitmenliği +
-- örgü işleri) için tek vitrin yetersiz kalıyor, Pro'ya (649₺/ay, 3 vitrin)
-- geçmek bu ihtiyaç için gereğinden büyük bir sıçrama. Fiyat aynı kalıyor
-- (159₺/ay), sadece hak büyüyor. Pro'nun asıl teklif noktası (3+ vitrin,
-- AI önceliği, hediye boost) duruyor.
update subscription_plans set max_active_listings = 2 where slug = 'standart';

-- Server-side trigger'ın (enforce_vitrin_cap_server_side.sql) hiç abonelik
-- satırı olmayan bir kullanıcı için kullandığı varsayılan da tutarlı olsun.
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

  select coalesce(sp.max_active_listings, 2) into v_cap
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = new.provider_id and ps.status in ('active', 'trialing')
  order by ps.current_period_end desc
  limit 1;

  if v_cap is null then
    v_cap := 2; -- hiç abonelik satırı yoksa Standart'la aynı, 2 vitrin
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
    raise exception 'Vitrin hakkını doldurdun (limit: %). Daha fazla vitrin açmak için üyeliğini yükselt ya da Ek Vitrin Paketi al.', v_cap;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;
