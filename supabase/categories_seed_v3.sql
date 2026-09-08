-- İşinn — categories_seed.sql / categories_seed_v2.sql'e ek.
-- "Uzaktan hizmetler" grubu 5 kategoriyle çok dardı, kullanıcı birkaç tane
-- daha eklenmesini istedi (2026-09-08). components/IsinnApp.jsx'teki
-- CATEGORIES dizisine zaten eklendi — bu dosya çalıştırılmadan bu
-- kategoriler altında "Bu kategori veritabanında henüz tanımlı değil"
-- hatası alınır (services.category_id NOT NULL FK).
insert into categories (name, slug, mode) values
  ('İçerik Yazarlığı', 'icerik-yazarligi', 'remote'),
  ('Video Düzenleme', 'video-duzenleme', 'remote'),
  ('Seslendirme', 'seslendirme', 'remote'),
  ('Sanal Asistan', 'sanal-asistan', 'remote')
on conflict (slug) do nothing;
