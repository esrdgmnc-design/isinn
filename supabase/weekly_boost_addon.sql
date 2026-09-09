-- İşinn — "Haftalık Öne Çıkarma" — mevcut 30 günlük Öne Çıkarma Paketi'nin
-- yanına, kısa süreli deneyip/kampanya yapmak isteyenler için düşük giriş
-- bariyerli bir seçenek. Bilerek günlük birim fiyatı aylıktan yüksek
-- (459₺/30gün ≈ 15,3₺/gün, 149₺/7gün ≈ 21,3₺/gün) — aylığa geçmeyi
-- caydırmasın diye teşvik etsin diye. add_boost_addon() ile birebir aynı
-- desen, sadece slug ve süre farklı — provider_addons zaten süre-bağımsız
-- (current_period_start/end) çalıştığı için ekstra bir şema değişikliği
-- gerekmiyor, sadece yeni bir addon_products satırı + yeni bir RPC.
insert into addon_products (name, slug, price_monthly, description)
values (
  'Haftalık Öne Çıkarma', 'one-cikarma-haftalik', 149,
  '7 gün süreyle Öne Çıkarma Paketi ile aynı ayrıcalıklar (öne çıkan rozet, haritada/aramada üstte görünme). Kısa süreli denemek ya da bir kampanyayı desteklemek isteyenler için.'
)
on conflict (slug) do update set
  price_monthly = excluded.price_monthly,
  description = excluded.description;

create or replace function add_weekly_boost_addon()
returns void as $$
declare
  v_addon_id uuid;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;

  select id into v_addon_id from addon_products where slug = 'one-cikarma-haftalik' and active = true;
  if v_addon_id is null then
    raise exception 'Haftalık Öne Çıkarma paketi bulunamadı.';
  end if;

  v_period_end := now() + interval '7 days';

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

grant execute on function add_weekly_boost_addon() to authenticated;
