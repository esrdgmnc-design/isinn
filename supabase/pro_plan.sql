-- İşinn — vitrin sınırı + Pro Üyelik planı + lansman fiyatlandırması.
-- Rekabet taraması (Armut: ücretsiz üyelik + teklif başına ücret; Bionluk: tek
-- seferlik ücret + komisyon; Fiverr: ücretsiz + komisyon, gig sayısı seviyeyle
-- açılır; sahibinden.com: ücretsiz ilan + ayrı "Vitrin/Doping" ücretli öne
-- çıkarma) sonrası İşinn'in KOMİSYONSUZ, sabit-ücretli modelini koruyoruz —
-- fark burada "kaç vitrin açabilirsin" ölçeğinde. schema (3).sql zaten bunun
-- için tasarlanmıştı (subscription_plans.max_active_listings, null=sınırsız,
-- şimdiye kadar hiç set edilmemişti).
--
-- Lansman fiyatları (esrdgmnc@gmail.com ile birlikte karara bağlandı):
--   Standart  159₺/ay  · 1.590₺/yıl (~%17 indirim)  · 1 vitrin, sınırsız teklif
--   Pro       649₺/ay  · 6.490₺/yıl (~%17 indirim)  · 3 vitrin, sınırsız teklif,
--             Pro'ya geçişten sonraki ilk 7 gün tüm vitrinlerde öne çıkarma hediyeli
--   Öne Çıkarma  459₺/30 gün  · tek bir vitrini öne çıkarır (Pro'dan bağımsız, herkese açık)
-- İlk 30 gün HERKESE ücretsiz Standart (kart bilgisi istenmez) — bu zaten
-- start_free_trial() ile kuruluydu, burada sadece fiyatları güncelliyoruz.
-- Pro, ilk ayda öne çıkarılmıyor — asıl teklif noktası, kullanıcı 2. vitrini
-- açmak isteyip sınıra takıldığı an (CreateListingView'daki duvar).

update subscription_plans
set max_active_listings = 1,
    price_yearly = 1590
where slug = 'standart';

insert into subscription_plans (name, slug, price_monthly, price_yearly, trial_days, max_active_listings, ai_match_priority, badge, description)
values (
  'Pro Üyelik', 'pro', 649, 6490, 0, 3, true, 'Pro Üye',
  '3 vitrin hakkı, sınırsız teklif, AI eşleştirmede öncelik. Pro''ya geçtiğin ilk 7 gün içinde açtığın her vitrin, Öne Çıkarma Paketi hediyeli.'
)
on conflict (slug) do update set
  price_monthly = excluded.price_monthly,
  price_yearly = excluded.price_yearly,
  max_active_listings = excluded.max_active_listings,
  ai_match_priority = excluded.ai_match_priority,
  badge = excluded.badge,
  description = excluded.description;

-- "İlk 7 gün hediye Öne Çıkarma" promosyonunun süresini tutuyor. Pro'ya
-- geçildiğinde now()+7 gün olarak set edilir; claim_new_vitrin_boost() bu
-- pencere içinde açılan her vitrinde Boost'u otomatik (ve sessizce) yeniler.
alter table provider_subscriptions add column if not exists pro_boost_until timestamptz;

-- Standart Üyelik → Pro Üyelik yükseltmesi. Gerçek ödeme entegrasyonu henüz
-- yok (start_free_trial/add_boost_addon ile aynı desen) — bu fonksiyon sadece
-- kaydı oluşturuyor/güncelliyor, kart tahsilatı sonraki bir faz. Aylık/yıllık
-- seçimi start_free_trial ile aynı desende p_billing_cycle parametresiyle geliyor.
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
        pro_boost_until = now() + interval '7 days',
        updated_at = now()
    where profile_id = auth.uid();
  else
    insert into provider_subscriptions (profile_id, plan_id, status, billing_cycle, current_period_start, current_period_end, pro_boost_until)
    values (auth.uid(), v_plan_id, 'active', p_billing_cycle, now(), v_period_end, now() + interval '7 days');
  end if;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function upgrade_to_pro(text) to authenticated;

-- Pro'ya geçişten sonraki ilk 7 gün içinde açılan her yeni vitrin için,
-- mevcut "Öne Çıkarma Paketi" addon'unu (add_boost_addon ile aynı satır)
-- sessizce açar/yeniler. Pencere dışındaysa ya da Pro değilse hiçbir şey yapmaz.
create or replace function claim_new_vitrin_boost()
returns void as $$
declare
  v_boost_until timestamptz;
  v_addon_id uuid;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    return;
  end if;

  select pro_boost_until into v_boost_until
  from provider_subscriptions
  where profile_id = auth.uid() and status in ('active', 'trialing');

  if v_boost_until is null or v_boost_until < now() then
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

grant execute on function claim_new_vitrin_boost() to authenticated;
