-- Öne Çıkarma Paketi artık gerçekten "seçtiğin bir vitrini öne çıkarır" —
-- eskiden provider_addons sadece sağlayıcı bazlıydı (service_id yoktu), yani
-- biri Öne Çıkarma alınca TÜM vitrinleri birden öne çıkıyordu, ama Planlar
-- sayfasındaki metin "seçtiğin bir vitrini" diyordu — üründe olmayan bir şeyi
-- vaat ediyordu (2026-09-14'te fark edildi, kullanıcının kararıyla gerçek
-- vitrin seçimi kuruldu).
--
-- service_id NULL bırakılabilir (Ek Vitrin Paketi gibi vitrine değil, hesaba
-- bağlı addon'lar için) — sadece Öne Çıkarma satın alımlarında dolduruluyor.
alter table provider_addons add column if not exists service_id uuid references services(id) on delete cascade;

-- Aynı sağlayıcının FARKLI vitrinlerini ayrı ayrı öne çıkarabilmesi gerekiyor
-- (her biri kendi satın alımı) — o yüzden artık tekillik (profile_id,
-- addon_id) değil, (profile_id, addon_id, service_id) üzerinden. Eski
-- kayıtlarda service_id NULL olduğu için mevcut satırları bozmuyor.
drop index if exists provider_addons_profile_id_addon_id_key;
create unique index if not exists provider_addons_profile_addon_service_key
  on provider_addons (profile_id, addon_id, coalesce(service_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- payment_orders da hangi vitrin için ödendiğini bilmeli — paytr-callback
-- provider_addons satırını bu bilgiyle oluşturuyor.
alter table payment_orders add column if not exists service_id uuid references services(id) on delete set null;
