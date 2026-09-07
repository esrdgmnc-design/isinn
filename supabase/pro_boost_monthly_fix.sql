-- İşinn — Pro Üyelik'in "her ayın ilk haftası tüm vitrinler Öne Çıkarma
-- hediyeli" özelliğinde gerçek bir hata: pro_boost_recurring.sql'deki
-- sync_pro_boost(), hediye penceresini provider_subscriptions.
-- current_period_start'a bağlıyordu — bu, AYLIK ödeyenlerde 30 günde bir
-- ilerliyor (doğru), ama YILLIK ödeyenlerde 365 günde bir ilerliyor (yanlış!).
-- Yani daha çok ödeyen yıllık müşteri, aylık müşteriden 12 kat daha az hediye
-- alıyordu — "her ayın ilk haftası" vaadi yıllık ödeyenler için gerçek
-- değildi. Bu dosya, hediye penceresini faturalama döneminden TAMAMEN
-- ayırıyor: Pro'ya ilk geçildiği andan (boost_anchor_at) itibaren, ödeme
-- döngüsünden bağımsız, matematiksel olarak 30 günlük periyotlar hesaplanıyor
-- — ne bir "ilerletme" adımına ne de cron'a ihtiyaç var, her çağrıda anchor'a
-- göre "şu an hangi 30 günlük periyottayız" hesaplanıyor.

alter table provider_subscriptions add column if not exists boost_anchor_at timestamptz;

-- Pro'da olup henüz anchor'ı olmayanlar için (ör. bu migration'dan önce Pro'ya
-- geçmiş olanlar) mevcut current_period_start'ı başlangıç noktası yapıyoruz —
-- geriye dönük bir hediye kaybı olmasın diye.
update provider_subscriptions ps
set boost_anchor_at = ps.current_period_start
from subscription_plans sp
where ps.plan_id = sp.id and sp.slug = 'pro' and ps.boost_anchor_at is null;

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
  where ps.profile_id = auth.uid() and ps.status = 'active';

  if v_plan_slug is distinct from 'pro' then
    return;
  end if;
  if v_anchor is null then
    -- Pro'ya yeni geçiliyor, upgrade_to_pro anchor'ı zaten now() olarak set eder.
    return;
  end if;

  -- Faturalama döngüsünden (aylık/yıllık) tamamen bağımsız: anchor'dan bu yana
  -- kaç 30 günlük periyot geçmiş, o periyodun başı neresi — matematiksel,
  -- "ilerletme" adımı gerektirmiyor.
  v_days_since_anchor := extract(epoch from (now() - v_anchor)) / 86400;
  v_window_start := v_anchor + (floor(v_days_since_anchor / 30) * interval '30 days');

  if now() > v_window_start + interval '7 days' then
    return; -- bu ayın hediye penceresi kapandı, bir sonraki 30 günlük periyotta yeniden açılacak
  end if;

  select id into v_addon_id from addon_products where slug = 'one-cikarma' and active = true;
  if v_addon_id is null then
    return;
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

grant execute on function sync_pro_boost() to authenticated;

-- upgrade_to_pro artık boost_anchor_at'ı da set ediyor (sadece daha önce
-- boş ise — tekrar Pro'ya dönen biri eski hediye takvimini korusun diye
-- sıfırlamıyoruz, sadece ilk kez Pro olanlarda başlatıyoruz).
create or replace function upgrade_to_pro(p_billing_cycle text default 'monthly')
returns void as $$
declare
  v_plan_id uuid;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;
  if p_billing_cycle not in ('monthly', 'yearly') then
    p_billing_cycle := 'monthly';
  end if;

  select id into v_plan_id from subscription_plans where slug = 'pro' and active = true;
  if v_plan_id is null then
    raise exception 'Pro Üyelik planı bulunamadı.';
  end if;

  v_period_end := now() + case when p_billing_cycle = 'yearly' then interval '365 days' else interval '30 days' end;

  if exists (select 1 from provider_subscriptions where profile_id = auth.uid()) then
    update provider_subscriptions
    set plan_id = v_plan_id,
        status = 'active',
        billing_cycle = p_billing_cycle,
        current_period_start = now(),
        current_period_end = v_period_end,
        cancel_at_period_end = false,
        boost_anchor_at = coalesce(boost_anchor_at, now()),
        updated_at = now()
    where profile_id = auth.uid();
  else
    insert into provider_subscriptions (profile_id, plan_id, status, billing_cycle, current_period_start, current_period_end, boost_anchor_at)
    values (auth.uid(), v_plan_id, 'active', p_billing_cycle, now(), v_period_end, now());
  end if;

  perform sync_pro_boost();
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function upgrade_to_pro(text) to authenticated;
