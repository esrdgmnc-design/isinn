-- KRİTİK — gerçek bir güvenlik açığı (2026-09-13, PayTR'ı gerçek ödemeye
-- bağlarken bulundu). upgrade_to_pro / add_boost_addon /
-- add_weekly_boost_addon / add_extra_vitrin_addon fonksiyonları, sadece
-- arayüzden çağrılmayı BIRAKTIK diye güvenli olmuyor — hâlâ
-- "grant execute ... to authenticated" ile veritabanında duruyorlar. Yani
-- oturum açmış HERKES, tarayıcı konsolundan
--   supabase.rpc('upgrade_to_pro')
-- çağırısıyla arayüzü hiç görmeden, PayTR'a hiç uğramadan, bedavaya Pro
-- Üyelik / Öne Çıkarma Paketi / Ek Vitrin Paketi alabiliyordu — anon key
-- zaten herkese açık (client bundle'da), fonksiyon adları da bu SQL
-- dosyalarının kendisinde (repo'da) yazıyor.
--
-- start_free_trial BİLEREK dokunulmadı — o gerçekten ücretsiz olması
-- gereken tek şey, arayüz de zaten sadece onu çağırıyor.
--
-- Fonksiyonları SİLMİYORUZ (ileride admin/service-role tarafından elle
-- kullanılmak istenebilir) — sadece "authenticated" rolünden çalıştırma
-- iznini geri alıyoruz. Gerçek aktivasyon artık SADECE
-- paytr-callback route'undan (service role ile) geliyor.

revoke execute on function upgrade_to_pro(text) from authenticated;
revoke execute on function add_boost_addon() from authenticated;
revoke execute on function add_weekly_boost_addon() from authenticated;
revoke execute on function add_extra_vitrin_addon() from authenticated;
