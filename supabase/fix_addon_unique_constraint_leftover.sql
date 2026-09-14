-- GERÇEK HATA (2026-09-14, canlıda ilk gerçek boost ödemesinden sonra
-- bulundu) — boost_per_vitrin.sql, provider_addons'taki eski "bir sağlayıcı
-- bir üründen sadece bir tane alabilir" kısıtlamasını kaldırmaya çalışmıştı,
-- ama YANLIŞ isimle: `provider_addons_profile_id_addon_id_key` diye
-- düşündüğü kısıtlamanın gerçek adı, orijinal schema (3).sql'de
-- `idx_one_active_addon_per_provider_per_product` imiş. Yani boost_per_vitrin
-- .sql'in kendi yeni per-vitrin kısıtlamasını eklemesine rağmen, bu ESKİ
-- kısıtlama hâlâ duruyordu — (profile_id, addon_id) tek başına hâlâ tekil
-- olmak zorundaydı, service_id'den bağımsız.
--
-- SONUÇ (gerçek, canlı bir müşteride yaşandı): Yudum Bulut gerçek parayla
-- Haftalık Öne Çıkarma satın aldı (149₺, ödeme başarılı), ama paytr-callback
-- provider_addons'a yeni satırı eklemeye çalışırken bu eski kısıtlamaya
-- çarpıp "23505 duplicate key" hatası aldı — insert asla tamamlanmadı.
-- paytr-callback bu insert'ün hata dönüp dönmediğini HİÇ kontrol etmiyordu
-- (ayrı bir kod düzeltmesiyle de kapatıldı), o yüzden hata tamamen sessiz
-- kaldı ve ödeme yine de "başarılı" işaretlendi — müşteri parayı ödedi,
-- boost'u hiç almadı.
drop index if exists idx_one_active_addon_per_provider_per_product;

-- Doğru kısıtlama zaten boost_per_vitrin.sql'de var olmalı
-- (provider_addons_profile_addon_service_key) — burada tekrar garanti
-- altına alıyoruz ki bu migration tek başına da çalıştırılabilsin.
create unique index if not exists provider_addons_profile_addon_service_key
  on provider_addons (profile_id, addon_id, coalesce(service_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Bu sınıf hatanın BİR DAHA sessizce kaybolmaması için: ödeme başarılı ama
-- ürün/abonelik gerçekten aktifleştirilemediyse (ör. yine beklenmeyen bir DB
-- hatası) artık burada görünür oluyor — paytr-callback'teki ilgili düzeltmeyle
-- birlikte kullanılıyor (bkz. o dosyadaki not).
alter table payment_orders add column if not exists grant_error text;
