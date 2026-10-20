-- İşinn — 2026-10-20: genel "Danışmanlık & Mentorluk" kategorisi (kurucu: tanıtımlarda anılıyordu, listede yoktu).
-- components/IsinnApp.jsx CATEGORIES, lib/seoTaxonomy.js ve lib/i18n ile aynı slug/ad. Canlıya 2026-10-20'de eklendi (idempotent).
insert into categories (name, slug, mode) values
  ('Danışmanlık & Mentorluk', 'danismanlik', 'both')
on conflict (slug) do nothing;
