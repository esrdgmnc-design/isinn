-- İşinn — Pro Üyelik'in "her ayın ilk 7 günü tüm vitrinlerde öne çıkarma
-- hediyesi" özelliğini DÜZELTİYOR. pro_plan.sql'deki ilk hâli yanlıştı: sadece
-- Pro'ya geçildiği anda BİR KEZ tetikleniyordu ve sadece O ANDAN SONRA açılan
-- YENİ vitrinlere uygulanıyordu — ne aylık tekrar ediyordu, ne de mevcut
-- vitrinleri kapsıyordu. Bu dosya pro_plan.sql'in üzerine ek olarak çalışır
-- (pro_plan.sql'i tekrar çalıştırmana gerek yok, bu yeterli).
--
-- Yeni mantık: "hediye açık mı" artık ayrı bir "kullanıldı" bayrağı değil,
-- provider_subscriptions.current_period_start'tan TÜRETİLİYOR — dönem
-- başladıktan sonraki ilk 7 gün içindeysek hediye açık. Bu sayede dönem her
-- yenilendiğinde (current_period_start ilerledikçe) pencere otomatik olarak
-- yeniden açılıyor — "her ayın ilk haftası" gerçekten ay ay tekrarlanıyor.
-- Not: provider_addons zaten sağlayıcı bazlı (belirli bir vitrine değil profile
-- bağlı) — o yüzden bir kez açıldığında zaten TÜM vitrinleri kapsıyor, ekstra
-- bir şey yapmaya gerek yok.
--
-- Gerçek otomatik faturalama/yenileme (kart tahsilatı) henüz yok — bu yüzden
-- sync_subscription_period() dönemi "yenilenmiş" gibi simüle ediyor (süresi
-- dolmuş ama hâlâ 'active' bir üyelik görürse bir sonraki döneme ilerletiyor).
-- Gerçek ödeme entegrasyonu geldiğinde bu fonksiyon, ödeme başarılı olduğunda
-- webhook'tan çağrılan gerçek bir yenileme mantığıyla değiştirilebilir.

drop function if exists claim_new_vitrin_boost();

-- Pro Üyelik'teki bir sağlayıcı, mevcut dönemin (current_period_start) ilk 7
-- günü içindeyse Öne Çıkarma Paketi'ni açar/yeniler. provider_addons profile
-- bazlı olduğu için bu, sağlayıcının O ANDA sahip olduğu TÜM vitrinleri
-- kapsar (yeni açılanlar dahil, mevcut olanlar da dahil).
create or replace function sync_pro_boost()
returns void as $$
declare
  v_period_start timestamptz;
  v_plan_slug text;
  v_addon_id uuid;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    return;
  end if;

  select ps.current_period_start, sp.slug into v_period_start, v_plan_slug
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = auth.uid() and ps.status = 'active';

  if v_plan_slug is distinct from 'pro' then
    return;
  end if;
  if v_period_start is null or now() > v_period_start + interval '7 days' then
    return;
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

-- Gerçek fatura/kart tahsilatı yok — kullanıcı Profil sayfasını her açtığında
-- çağrılır: dönemi bitmiş ("current_period_end < now()") ama hâlâ 'active'
-- olan bir üyelik varsa bir sonraki döneme "yenilenmiş" sayılır. Bu, Pro'daki
-- 7 günlük hediye penceresinin ay ay gerçekten tekrar açılmasını sağlıyor.
create or replace function sync_subscription_period()
returns void as $$
declare
  v_id uuid;
  v_cycle text;
  v_end timestamptz;
  v_interval interval;
begin
  if auth.uid() is null then
    return;
  end if;

  select id, billing_cycle, current_period_end into v_id, v_cycle, v_end
  from provider_subscriptions
  where profile_id = auth.uid() and status = 'active';

  if v_id is null or v_end > now() then
    return;
  end if;

  v_interval := case when v_cycle = 'yearly' then interval '365 days' else interval '30 days' end;
  update provider_subscriptions
  set current_period_start = v_end,
      current_period_end = v_end + v_interval,
      updated_at = now()
  where id = v_id;

  perform sync_pro_boost();
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function sync_subscription_period() to authenticated;

-- upgrade_to_pro artık geçişten hemen sonra sync_pro_boost()'u da çağırıyor —
-- böylece o anda sahip olunan TÜM vitrinler (yeni açılanları beklemeden)
-- hemen öne çıkarılıyor (bkz. kullanıcının verdiği örnek: Pro alınca elindeki
-- 3 vitrin de aynı anda öne çıkmalı).
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
        updated_at = now()
    where profile_id = auth.uid();
  else
    insert into provider_subscriptions (profile_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
    values (auth.uid(), v_plan_id, 'active', p_billing_cycle, now(), v_period_end);
  end if;

  perform sync_pro_boost();
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function upgrade_to_pro(text) to authenticated;
