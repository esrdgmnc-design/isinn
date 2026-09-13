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

-- DAHA BÜYÜK BİR TANESİ (2026-09-13, "tüm siteyi tara" taramasında bulundu):
-- sync_subscription_period() — status='active' olan, dönemi (current_period_end)
-- geçmiş HERKESİN aboneliğini, HİÇBİR ödeme kontrolü olmadan otomatik olarak
-- bir dönem daha (30/365 gün) uzatıyordu. Bu fonksiyon her uygulama açılışında
-- istemciden çağrılıyordu (IsinnApp.jsx → loadTrialInfo) — yani birinin GERÇEKTEN
-- ödeme yapması bir kere yetiyordu, ondan sonra süresiz olarak bedavaya
-- "yenileniyordu". Bugün kurduğumuz gerçek otomatik yenileme (cron +
-- kayıtlı kart) sistemini fiilen anlamsız kılıyordu, çünkü istemci tarafındaki
-- bu çağrı her zaman ondan önce davranıyordu. Kapatıyoruz — süresi dolan
-- abonelikler artık gerçekten "süresi dolmuş" görünecek, devam etmek için
-- paytr-init'ten gerçek ödeme gerekecek (bkz. PricingView'daki "Şimdi Öde"
-- butonu ve cron/renew-subscriptions).
revoke execute on function sync_subscription_period() from authenticated;

-- sync_pro_boost() BİLEREK dokunulmadı — sadece halihazırda GERÇEKTEN aktif
-- olan bir Pro aboneliğin (status='active', plan='pro') ilk 7 gün hakkını
-- kendi üzerinde tazeliyor, yeni bir dönem/ödeme yaratmıyor, güvenli.

-- ESKİ GERÇEK BİR GÜVENLİK AÇIĞI (2026-09-13): request_phone_otp(text) —
-- fix_otp_leak.sql'in kapatmaya çalıştığı TAM O SORUN hâlâ buradaydı. Bu
-- fonksiyon telefon doğrulama kodunu düz metin olarak GERİ DÖNDÜRÜYOR ve
-- authenticated'a açık — yani biri SMS'i hiç almadan, sadece bu RPC'yi
-- çağırarak kodu öğrenip ardından verify_phone_otp ile HERHANGİ bir telefon
-- numarasını (kendisininki olmasa bile) "doğrulanmış" işaretleyebilirdi.
-- Gerçek akış artık tamamen /api/send-otp'ta (kod sunucuda üretilip DB'ye
-- yazılıyor, hiç tarayıcıya dönmüyor) — bu eski fonksiyon client kodunda
-- hiç çağrılmıyor, sadece izni unutulmuştu.
revoke execute on function request_phone_otp(text) from authenticated;
