-- İşinn — "yeni kategori eklemek isterse müşteri talep iletebiliyor mu ya
-- da kendi tanımlayabiliyor mu" sorusuna cevap: hayırdı, kategori seçimi
-- sabit bir listeydi. Bu, hem Hizmet Ekle (services) hem İlan Ver (jobs)
-- formuna bir "Diğer (belirtiniz)" seçeneği ekliyor — kullanıcı serbest
-- metinle kendi kategorisini yazabiliyor, ilan/vitrin normal şekilde
-- yayınlanıyor (geçici olarak "Diğer" kategorisi altında) ve aynı anda
-- support_tickets'a bir "kategori talebi" bileti düşüyor (bkz.
-- IsinnApp.jsx — CreateListingView/PostJobView handleSubmit). Admin uygun
-- görürse CATEGORIES dizisine + bu tabloya gerçek bir kategori ekleyip
-- ilgili satırların category_id'sini elle günceller (categories_seed_v2/v3
-- ile aynı manuel süreç).

-- 1) Her iki formda da FK hedefi olacak catch-all "Diğer" kategorisi.
insert into categories (name, slug, mode) values
  ('Diğer', 'diger', 'both')
on conflict (slug) do nothing;

-- 2) Kullanıcının yazdığı serbest metin — categories.name'i değiştirmiyoruz
-- (o hâlâ "Diğer" olarak görünür, kategoriye göre filtrelemeyi bozmaz),
-- gerçek talep burada saklanıyor.
alter table services add column if not exists custom_category_label text;
alter table jobs add column if not exists custom_category_label text;
