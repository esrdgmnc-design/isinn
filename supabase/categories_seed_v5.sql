-- İşinn — categories_seed.sql / v2 / v3 / v4'e ek.
-- Kullanıcı isteği (2026-09-15): "Oyun Ablası" kategorisi eklendi — çocuklarla
-- evde/etkinlikte oyun oynayan, vakit geçiren refakatçi hizmeti. Bakıcı'dan
-- farkı: sabit/uzun süreli çocuk bakımı değil, saatlik/etkinlik bazlı oyun
-- arkadaşlığı. components/IsinnApp.jsx'teki CATEGORIES dizisine zaten eklendi
-- (id: "oyun-ablasi") — bu dosya çalıştırılmadan bu kategori seçilip
-- vitrin/ilan yayınlanmaya çalışılınca "Bu kategori veritabanında henüz tanımlı
-- değil" hatası alınır (services.category_id / jobs.category_id NOT NULL FK).
-- Aynı istekte ikinci kategori: "İç Mimarlık / Dekorasyon" — mevcut "Tasarım"
-- kategorisinden (uzaktan grafik/web tasarım) tamamen ayrı, yerinde (local)
-- hizmet. components/IsinnApp.jsx'e zaten eklendi (id: "ic-mimarlik").
--
-- Üçüncü kategori: "Moda & Tekstil Tasarımı" — kıyafet/tekstil tasarımı,
-- mevcut "Terzi" (dikiş/tadilat, el işçiliği) ve "Tasarım" (grafik/web)
-- kategorilerinden farklı, hem yerinde hem uzaktan çalışılabilir ("both").
-- components/IsinnApp.jsx'e zaten eklendi (id: "moda-tekstil-tasarim").
insert into categories (name, slug, mode) values
  ('Oyun Ablası / Ağabeyi', 'oyun-ablasi', 'local'),
  ('İç Mimarlık / Dekorasyon', 'ic-mimarlik', 'local'),
  ('Moda & Tekstil Tasarımı', 'moda-tekstil-tasarim', 'both')
on conflict (slug) do nothing;
