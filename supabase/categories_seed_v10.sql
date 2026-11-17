-- İşinn — 2026-11-17: "Kurye" kategorisi (kurucu: kurye vitrini "Diğer"e düşmüş, destek talebi açılmıştı).
-- components/IsinnApp.jsx CATEGORIES, lib/seoTaxonomy.js ve lib/i18n ile aynı slug/ad. Canlıya 2026-11-17'de eklendi (idempotent).
insert into categories (name, slug, mode) values
  ('Kurye', 'kurye', 'local')
on conflict (slug) do nothing;
