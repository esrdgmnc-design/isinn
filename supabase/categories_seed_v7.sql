-- İşinn — categories_seed.sql / v2..v6'ya ek.
-- Gerçek kullanıcı bildirimi (2026-09-30): direksiyon dersi vermek isteyen bir
-- eğitmen, sabit kategori listesinde uygun bir seçenek bulamayıp vitrin
-- açamamıştı ("Diğer" seçeneğini fark etmemiş). components/IsinnApp.jsx'teki
-- CATEGORIES dizisine zaten eklendi — bu dosya çalıştırılmadan bu kategori
-- seçilip vitrin/ilan yayınlanmaya çalışılınca "Bu kategori veritabanında
-- henüz tanımlı değil" hatası alınır (services.category_id / jobs.category_id
-- NOT NULL FK).
insert into categories (name, slug, mode) values
  ('Direksiyon Dersi / Sürücü Kursu Eğitmeni', 'direksiyon-egitmeni', 'local')
on conflict (slug) do nothing;
