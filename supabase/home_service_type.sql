-- İşinn — "Nerede hizmet veriyorsun?" (CreateListingView'daki homeServiceVal
-- state'i) hiçbir yere kaydedilmiyordu. services tablosunda bu bilgi için
-- sütun yoktu — kullanıcı hangi seçeneği işaretlerse işaretlesin, vitrin
-- kaydedilince bilgi kayboluyordu (kozmetik/sahte bir alandı, kullanıcı
-- etiketleri "Müşteri Konumu/Kendi Konumum/İkisi de Olsun" olarak
-- değiştirirken fark edildi). Mevcut UI/filtre kodu zaten 'evde'/'mekanda'/
-- 'esnek' string değerlerini bekliyor (HomeServiceBadge, HomeView filtresi,
-- AIMatchView) — aynı değerleri kullanıyoruz, başka hiçbir yer değişmesin diye.

alter table services
  add column if not exists home_service_type text
  check (home_service_type in ('evde', 'mekanda', 'esnek'));

comment on column services.home_service_type is
  'Sadece is_remote=false iken anlamlı: evde=müşteri konumuna gider, mekanda=kendi konumunda karşılar, esnek=ikisi de olur.';
