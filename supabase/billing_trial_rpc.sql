-- İşinn — ücretsiz deneme başlatma (gerçek ödeme YOK, sadece kayıt).
-- provider_subscriptions / provider_addons tabloları schema.sql'de bilerek
-- sadece "sahibi görebilir" (SELECT) RLS politikasıyla geliyor — insert/update
-- politikası yok. Bunu istemciden doğrudan yazılabilir hale getirmek (geniş bir
-- insert policy eklemek), herkesin kendine bedava/süresiz "aktif" abonelik
-- açabilmesine kapı aralardı. Onun yerine buradaki iki fonksiyon, SADECE
-- auth.uid() için, SADECE "trialing"/"active" durumuna, sınırlı bir işlemi
-- güvenli şekilde yapıyor (security definer + kendi mantığı sabit).
-- Gerçek ödeme entegrasyonu (kart, fatura vb.) hâlâ ayrı, sonraki bir faz.

create or replace function start_free_trial(p_billing_cycle text default 'monthly')
returns void as $$
declare
  v_plan_id uuid;
  v_trial_days integer;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;
  if p_billing_cycle not in ('monthly', 'yearly') then
    p_billing_cycle := 'monthly';
  end if;

  select id, trial_days into v_plan_id, v_trial_days
  from subscription_plans where slug = 'standart' and active = true;
  if v_plan_id is null then
    raise exception 'Standart plan bulunamadı.';
  end if;

  v_period_end := now() + make_interval(days => coalesce(v_trial_days, 30));

  if exists (select 1 from provider_subscriptions where profile_id = auth.uid()) then
    update provider_subscriptions
    set plan_id = v_plan_id,
        status = 'trialing',
        billing_cycle = p_billing_cycle,
        current_period_start = now(),
        current_period_end = v_period_end,
        cancel_at_period_end = false,
        updated_at = now()
    where profile_id = auth.uid();
  else
    insert into provider_subscriptions (profile_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
    values (auth.uid(), v_plan_id, 'trialing', p_billing_cycle, now(), v_period_end);
  end if;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function start_free_trial(text) to authenticated;

create or replace function add_boost_addon()
returns void as $$
declare
  v_addon_id uuid;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;

  select id into v_addon_id from addon_products where slug = 'one-cikarma' and active = true;
  if v_addon_id is null then
    raise exception 'Öne Çıkarma Paketi bulunamadı.';
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

grant execute on function add_boost_addon() to authenticated;
