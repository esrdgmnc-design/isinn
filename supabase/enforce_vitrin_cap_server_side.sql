-- İşinn — vitrin (Standart: 1, Pro: 3, +3 Ek Vitrin Paketi ile) sınırı
-- şimdiye kadar SADECE istemci tarafında (CreateListingView.checkVitrinLimit)
-- kontrol ediliyordu — hiçbir veritabanı kısıtlaması yoktu. Teknik bilgisi
-- olan biri (anon key ile doğrudan insert) ödeme yapmadan sınırsız vitrin
-- açabilirdi — güvenlik açığı değil ama gerçek bir gelir kaçağı. Yarın
-- canlıya çıkmadan önce bunu gerçek bir sunucu tarafı kurala çeviriyoruz.
--
-- checkVitrinLimit/getVitrinCapInfo'nun İSTEMCİDEKİ mantığını birebir
-- yansıtıyor (aynı sonucu üretmesi için — kullanıcı arayüzde "hakkın var"
-- görüp DB'de reddedilmemeli): kapasite = plan'ın max_active_listings'i
-- (abonelik yoksa/pasifse varsayılan 1) + aktif "Ek Vitrin Paketi" varsa +3.
-- Aktif vitrin sayısı = services.active=true olan satır sayısı.
create or replace function enforce_vitrin_cap()
returns trigger as $$
declare
  v_cap integer;
  v_addon_id uuid;
  v_has_addon boolean;
  v_active_count integer;
begin
  -- Sadece "bu satır artık aktif sayılacak" durumunda kontrol ediyoruz —
  -- zaten aktif bir vitrini düzenlemek (başlık/fiyat/vb. değiştirmek,
  -- active hiç dokunulmadan) kapasiteyi tekrar tüketmemeli.
  if new.active is not true then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.active is true then
    return new;
  end if;

  select coalesce(sp.max_active_listings, 1) into v_cap
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = new.provider_id and ps.status in ('active', 'trialing')
  order by ps.current_period_end desc
  limit 1;

  if v_cap is null then
    v_cap := 1; -- hiç abonelik satırı yoksa Standart'la aynı, 1 vitrin
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

drop trigger if exists trg_enforce_vitrin_cap on services;
create trigger trg_enforce_vitrin_cap
before insert or update on services
for each row execute function enforce_vitrin_cap();
