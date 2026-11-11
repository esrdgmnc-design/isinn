-- Fiyat birimi ve ders bilgileri (2026-11-11). İkisi de isteğe bağlı; eski vitrinler olduğu gibi kalır.
-- price_unit: sabit fiyatın neyin karşılığı olduğu ("Başlangıç 8.000₺" belirsizdi). Saatlik fiyatta kullanılmaz.
-- lesson_details: öğretmen/eğitmen vitrinleri için {levels[], duration_min, format, education}.
-- Mevcut RLS (sahip kendi vitrinini günceller) yeni sütunları da kapsar; ek politika gerekmez.

alter table public.services add column if not exists price_unit text;
alter table public.services drop constraint if exists services_price_unit_check;
alter table public.services add constraint services_price_unit_check
  check (price_unit is null or price_unit in ('ders', 'ay', 'paket', 'proje'));

alter table public.services add column if not exists lesson_details jsonb;
alter table public.services drop constraint if exists services_lesson_details_check;
alter table public.services add constraint services_lesson_details_check
  check (lesson_details is null or (jsonb_typeof(lesson_details) = 'object' and pg_column_size(lesson_details) < 2000));
