-- İşinn — Pro Üyelik'in 3 vitrin tavanı üstü. Pro'daki biri 4. (veya daha
-- fazla) vitrin açmak isterse (örn. üç değil dört ayrı uzmanlık alanı olan
-- biri) şimdiye kadar hiçbir yol yoktu — CreateListingView'daki "vitrin
-- hakkını doldurdun" duvarında Pro kullanıcılar için "vazgeç"ten başka
-- seçenek yoktu. Bu, mevcut Öne Çıkarma Paketi ile birebir aynı addon
-- deseniyle +3 ek vitrin hakkı satıyor (Pro'nun 3'üne ek, toplam 6 olur).

insert into addon_products (name, slug, price_monthly, description)
values (
  'Ek Vitrin Paketi', 'ek-vitrin', 249,
  'Pro Üyeliğe ek, isteğe bağlı. 3 vitrin hakkına +3 daha ekler (toplam 6 vitrin).'
)
on conflict (slug) do update set
  price_monthly = excluded.price_monthly,
  description = excluded.description;

-- Sadece Pro Üyelik'teki sağlayıcılar alabilir — Standart'tan direkt buraya
-- atlamak mantıklı değil, önce Pro'ya geçmeleri gerekiyor (aynı "Pro'yu ilk
-- ayda satmaya çalışma" mantığıyla, sıradaki doğal adım burası).
create or replace function add_extra_vitrin_addon()
returns void as $$
declare
  v_plan_slug text;
  v_addon_id uuid;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;

  select sp.slug into v_plan_slug
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = auth.uid() and ps.status = 'active';

  if v_plan_slug is distinct from 'pro' then
    raise exception 'Ek Vitrin Paketi sadece Pro Üyelik''te kullanılabilir.';
  end if;

  select id into v_addon_id from addon_products where slug = 'ek-vitrin' and active = true;
  if v_addon_id is null then
    raise exception 'Ek Vitrin Paketi bulunamadı.';
  end if;

  v_period_end := now() + interval '30 days';

  if exists (select 1 from provider_addons where profile_id = auth.uid() and addon_id = v_addon_id) then
    update provider_addons
    set status = 'active', current_period_start = now(), current_period_end = v_period_end
    where profile_id = auth.uid() and addon_id = v_addon_id;
  else
    insert into provider_addons (profile_id, addon_id, status, current_period_start, current_period_end)
    values (auth.uid(), v_addon_id, 'active', now(), v_period_end);
  end if;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function add_extra_vitrin_addon() to authenticated;
