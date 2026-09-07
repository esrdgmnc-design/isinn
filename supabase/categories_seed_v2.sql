-- İşinn — categories_seed.sql'e ek. Kullanıcıyla birlikte gerçek pazar
-- boşlukları olarak belirlenen 7 yeni kategori (2026-09-07): kuaför/berber ve
-- evcil hayvan bakımı gibi çok temel bazı ihtiyaçlar hiç kategorimizde yoktu.
-- components/IsinnApp.jsx'teki CATEGORIES dizisine zaten eklendi — bu dosya
-- olmadan "Bu kategori veritabanında henüz tanımlı değil" hatası alınır
-- (services.category_id NOT NULL FK).
insert into categories (name, slug, mode) values
  ('Boya & Badana', 'boya-badana', 'local'),
  ('Klima & Beyaz Eşya Servisi', 'klima-beyaz-esya', 'local'),
  ('Kuaför / Berber', 'kuafor-berber', 'local'),
  ('Evcil Hayvan Bakımı', 'evcil-hayvan', 'local'),
  ('Müzik Eğitmeni', 'muzik-egitmeni', 'both'),
  ('Muhasebe / Mali Müşavir', 'muhasebe', 'both'),
  ('Çeviri', 'ceviri', 'remote')
on conflict (slug) do nothing;
