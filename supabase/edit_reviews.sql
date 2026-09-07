-- İşinn — değerlendirme güncelleme. schema (3).sql'de ratings için sadece
-- "herkes görebilir" (select) ve "kendi değerlendirmeni bırakabilirsin"
-- (insert) policy'leri vardı — update policy'si hiç yoktu. Yani biri bir
-- yorumu yazdıktan sonra fikrini değiştirse/düzeltse bile veritabanı
-- seviyesinde güncelleyemiyordu (tekrar denerse unique(job_id, rater_id,
-- rated_profile_id) kısıtına takılıp "zaten değerlendirdin" hatası alıyordu
-- — kısıt doğru çalışıyor ama düzeltme yolu hiç yoktu).

create policy "Raters can update their own ratings" on ratings for update
  using (auth.uid() = rater_id)
  with check (auth.uid() = rater_id);
