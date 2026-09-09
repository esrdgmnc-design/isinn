-- İşinn — categories_seed.sql / v2 / v3'e ek.
-- Kullanıcı geri bildirimi (2026-09-10): "Öğretmen" okul müfredatı/özel ders
-- çağrışımı yapıyor — diksiyon, el sanatları (örgü vb.), dans gibi akademik
-- olmayan beceri/hobi eğitimi verenler için yanlış terim. "Eğitmen" ayrı bir
-- kategori olarak eklendi. components/IsinnApp.jsx'teki CATEGORIES dizisine
-- zaten eklendi — bu dosya çalıştırılmadan "Eğitmen" seçilip vitrin/ilan
-- yayınlanmaya çalışılınca "Bu kategori veritabanında henüz tanımlı değil"
-- hatası alınır (services.category_id / jobs.category_id NOT NULL FK).
insert into categories (name, slug, mode) values
  ('Eğitmen', 'egitmen', 'both')
on conflict (slug) do nothing;
