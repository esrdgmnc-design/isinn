-- İşinn — 2026-10-05: atölye / kurs / el sanatı eğitimi kategorileri (14 adet).
-- components/IsinnApp.jsx CATEGORIES ve lib/seoTaxonomy.js ile birebir aynı slug/ad olmalı.
-- Bu satırlar canlı veritabanına zaten eklendi; dosya kayıt ve yeniden kurulum içindir (idempotent).
insert into categories (name, slug, mode) values
  ('El Sanatları Atölyesi', 'el-sanatlari-atolyesi', 'both'),
  ('Seramik ve Çömlek Atölyesi', 'seramik-atolyesi', 'local'),
  ('Dikiş ve Örgü Atölyesi', 'dikis-orgu-atolyesi', 'both'),
  ('Resim ve Sanat Atölyesi', 'resim-sanat-atolyesi', 'both'),
  ('Mutfak Atölyesi ve Yemek Kursu', 'mutfak-atolyesi', 'local'),
  ('Çocuk Atölyesi', 'cocuk-atolyesi', 'local'),
  ('Geleneksel Sanatlar Atölyesi', 'geleneksel-sanatlar-atolyesi', 'both'),
  ('Kodlama ve Robotik Eğitmeni', 'kodlama-egitmeni', 'both'),
  ('Dans Eğitmeni', 'dans-egitmeni', 'both'),
  ('Satranç ve Zeka Oyunları Eğitmeni', 'satranc-egitmeni', 'both'),
  ('Diksiyon ve Hitabet Eğitmeni', 'diksiyon-hitabet-egitmeni', 'both'),
  ('Excel ve Ofis Programları Eğitmeni', 'ofis-programlari-egitmeni', 'both'),
  ('Mobilya Yenileme ve Restorasyon', 'mobilya-yenileme', 'local'),
  ('Ayakkabı ve Çanta Tamiri', 'ayakkabi-canta-tamiri', 'local')
on conflict (slug) do nothing;
