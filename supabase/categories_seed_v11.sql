-- İşinn — 2026-11-23: "Hafriyat" ve "İnşaat" kategorileri (kurucu isteği; toplam 70 kategori).
-- components/IsinnApp.jsx CATEGORIES, lib/seoTaxonomy.js, lib/searchSynonyms.js ve lib/i18n ile aynı slug/ad.
-- Bu dosya Supabase SQL Editor'da çalıştırılmadan bu kategoriler seçilip vitrin yayınlanamaz (FK). İdempotent.
insert into categories (name, slug, mode) values
  ('Hafriyat', 'hafriyat', 'local'),
  ('İnşaat', 'insaat', 'local')
on conflict (slug) do nothing;
