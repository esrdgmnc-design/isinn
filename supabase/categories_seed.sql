-- İşinn — categories seed
-- components/IsinnApp.jsx içindeki CATEGORIES dizisi ~30 kategori tanımlıyor,
-- ama schema.sql sadece 2 örnek kategori (teknoloji, nakliye) ekliyordu.
-- services.category_id NOT NULL olduğu için, uygulamanın kullandığı her
-- kategori slug'ının categories tablosunda karşılığı olmalı.
-- Bunu bir kere Supabase SQL Editor'de çalıştırman yeterli (RLS, categories
-- tablosuna client'tan insert'e izin vermiyor — "managed by admins" notuna bak).
insert into categories (name, slug, mode) values
  ('Temizlik', 'temizlik', 'local'),
  ('Nakliye', 'nakliye', 'local'),
  ('Tadilat', 'tadilat', 'local'),
  ('Çilingir', 'cilingir', 'local'),
  ('Öğretmen', 'ogretmen', 'both'),
  ('Bakıcı', 'bakici', 'local'),
  ('Hasta Bakıcı', 'hasta-bakici', 'local'),
  ('Hemşire', 'hemsire', 'local'),
  ('Fizyoterapist', 'fizyoterapist', 'local'),
  ('Yoga & Meditasyon / Yaşam Koçu', 'yoga-koc', 'both'),
  ('Spor Eğitmeni', 'spor-egitmeni', 'both'),
  ('Nailart', 'tirnakci', 'local'),
  ('Makyaj', 'makyaj', 'local'),
  ('Bakım', 'bakim', 'local'),
  ('Terzi', 'terzi', 'local'),
  ('Yemek', 'yemek', 'local'),
  ('Mühendis', 'muhendis', 'both'),
  ('Tasarım', 'tasarim', 'remote'),
  ('Yazılım', 'yazilim', 'remote'),
  ('Sosyal Medya Uzmanı', 'sosyal-medya', 'remote'),
  ('Dijital Pazarlama', 'dijital', 'remote'),
  ('Diyetisyen', 'diyetisyen', 'both'),
  ('Psikolog / Aile Danışmanı', 'psikolog', 'both'),
  ('Loğusa Bakıcısı', 'logusa-bakicisi', 'local'),
  ('Emzirme Danışmanı', 'emzirme-danismani', 'both'),
  ('Elektrikçi', 'elektrikci', 'local'),
  ('Su Tesisatçısı', 'su-tesisatcisi', 'local'),
  ('Halı & Koltuk Yıkama', 'hali-yikama', 'local'),
  ('Doğum Günü / Etkinlik Organizatörü', 'etkinlik-organizatoru', 'local'),
  ('Bahçe / Bakım', 'bahce-bakim', 'local'),
  ('Profesyonel Fotoğraf', 'profesyonel-fotograf', 'local')
on conflict (slug) do nothing;
