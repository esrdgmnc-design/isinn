-- Öne Çıkarma artık kişinin TÜM vitrinlerine uygulanıyor (service_id'siz tek satır).
-- Pro'nun ücretsiz "ilk hafta" hediyesi de aynı satırı kullanıyor; hediye ÜCRETLİ
-- bir boost satırının süresini KISALTMASIN diye süre greatest() ile hesaplanır.
-- audit_fixes_2026_09_21.sql'den SONRA çalıştır (idempotent).
create or replace function sync_pro_boost()
returns void as $$
declare
  v_anchor timestamptz;
  v_plan_slug text;
  v_addon_id uuid;
  v_period_end timestamptz;
  v_days_since_anchor double precision;
  v_window_start timestamptz;
begin
  if auth.uid() is null then
    return;
  end if;

  select ps.boost_anchor_at, sp.slug into v_anchor, v_plan_slug
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = auth.uid()
    and ps.status = 'active'
    and ps.current_period_end > now();

  if v_plan_slug is distinct from 'pro' then return; end if;
  if v_anchor is null then return; end if;

  v_days_since_anchor := extract(epoch from (now() - v_anchor)) / 86400;
  v_window_start := v_anchor + (floor(v_days_since_anchor / 30) * interval '30 days');
  if now() > v_window_start + interval '7 days' then return; end if;

  select id into v_addon_id from addon_products where slug = 'one-cikarma' and active = true;
  if v_addon_id is null then return; end if;

  v_period_end := v_window_start + interval '7 days';

  if exists (select 1 from provider_addons where profile_id = auth.uid() and addon_id = v_addon_id and service_id is null) then
    -- Ücretli (30 günlük) satırın başlangıç/bitişine dokunma; sadece daha kısa/sona
    -- ermiş bir hediye satırını yeniden aç.
    update provider_addons
    set status = 'active',
        current_period_start = case when current_period_end > v_period_end then current_period_start else now() end,
        current_period_end = greatest(current_period_end, v_period_end)
    where profile_id = auth.uid() and addon_id = v_addon_id and service_id is null;
  else
    insert into provider_addons (profile_id, addon_id, status, current_period_start, current_period_end)
    values (auth.uid(), v_addon_id, 'active', now(), v_period_end);
  end if;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function sync_pro_boost() to authenticated;
