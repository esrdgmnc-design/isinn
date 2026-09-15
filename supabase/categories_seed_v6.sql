-- İşinn — categories_seed.sql / v2 / v3 / v4 / v5'e ek.
-- Kullanıcı isteği (2026-09-15): platformda hiç karşılığı olmayan 5 gerçek
-- pazar boşluğu için kategori eklendi. components/IsinnApp.jsx'teki
-- CATEGORIES dizisine zaten eklendi — bu dosya çalıştırılmadan bu
-- kategoriler seçilip vitrin/ilan yayınlanmaya çalışılınca "Bu kategori
-- veritabanında henüz tanımlı değil" hatası alınır (services.category_id /
-- jobs.category_id NOT NULL FK).
insert into categories (name, slug, mode) values
  ('Bilgisayar & Telefon Teknik Servisi', 'teknik-servis', 'local'),
  ('Oto Tamiri / Araç Bakımı', 'oto-tamir', 'local'),
  ('Böcek İlaçlama (Haşere Kontrolü)', 'bocek-ilaclama', 'local'),
  ('Veteriner', 'veteriner', 'local'),
  ('Avukat / Hukuki Danışmanlık', 'avukat', 'both')
on conflict (slug) do nothing;
