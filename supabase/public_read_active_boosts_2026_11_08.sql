-- 2026-11-08: Öne çıkarma ziyaretçilere görünmüyordu.
-- IsinnApp.jsx öne çıkan vitrinleri provider_addons tablosundan, ziyaretçinin
-- kendi yetkisiyle okuyor. Anon anahtarla yapılan testte aktif öne çıkarma
-- satırları 0 döndü (servis anahtarıyla aktif satır var). Yani giriş yapmamış
-- ziyaretçiler hiçbir "Öne Çıkan / Sponsorlu" vitrini göremiyordu.
--
-- Bu politika YALNIZCA aktif öne çıkarma paketlerinin (one-cikarma,
-- one-cikarma-haftalik) satırlarını herkese okunur yapar. Ek Vitrin Paketi
-- ve diğer satırlar eskisi gibi gizli kalır. Yazma yetkisi değişmez.

drop policy if exists "Herkes aktif one cikarma satirlarini okuyabilir" on public.provider_addons;

create policy "Herkes aktif one cikarma satirlarini okuyabilir"
  on public.provider_addons
  for select
  to anon, authenticated
  using (
    status = 'active'
    and current_period_end > now()
    and addon_id in (
      select id from public.addon_products
      where slug in ('one-cikarma', 'one-cikarma-haftalik')
    )
  );

-- addon_products zaten herkese okunur (anon ile kontrol edildi), ek izin gerekmez.

-- Kontrol (çalıştırdıktan sonra, anon anahtarla): Nihan Yüksel'in influencer
-- vitrini (f88bb314-b4d3-4bbf-b37a-bba3752ba5d3) için 1 satır dönmeli.
