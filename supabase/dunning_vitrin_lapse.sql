-- İşinn — abonelik/deneme süresi bittiğinde vitrin "dunning" politikası
-- (2026-09-19, esrdgmnc@gmail.com ile karara bağlandı). Şu ana kadar
-- current_period_end geçmiş bir abonelik/deneme için TEK şey oluyordu:
-- cron (app/api/cron/renew-subscriptions) kayıtlı karttan tahsilat DENİYORDU
-- — kart yoksa ya da tahsilat reddedilirse sessizce hiçbir şey olmuyordu,
-- vitrin(ler) süresiz olarak yayında kalmaya devam ediyordu
-- (enforce_vitrin_cap_server_side.sql sadece YENİ vitrin AÇMAYI/tekrar
-- AKTİFLEŞTİRMEYİ engelliyor, zaten açık olanı kendiliğinden kapatmıyor).
-- Karar verilen akış:
--   1) current_period_end'e 3 gün kalınca uygulama içi bir UYARI bildirimi
--      gidiyor ("vitrinin kapanacak, öde"). 3 gün seçildi çünkü PayTR
--      tarafında ayrı, çok günlü bir "deneme takvimi" yok — tahsilat tam
--      current_period_end'de TEK seferde deneniyor (bkz. chargeSavedCard),
--      yani uyarının tek işi o tek denemeden önce makul bir sürede haber
--      vermek; çok erken verilmesi (ör. 7 gün) "hatırlatma" değil "gürültü"
--      olurdu, çok geç verilmesi (ör. 1 gün) kart güncellemeye vakit
--      bırakmazdı.
--   2) current_period_end gerçekten geçtiğinde VE (kayıtlı kart yok YA DA
--      tahsilat reddedildi) vitrin(ler) GERÇEKTEN kapatılıyor
--      (services.active=false) + ayrı, farklı bir "kapatıldı" bildirimi
--      gidiyor. Ücretsiz deneme (status='trialing') için zaten hiç kayıtlı
--      kart yok — tahsilat denenmeden doğrudan bu kapatma uygulanıyor.
--   3) Kullanıcı sonradan gerçek bir ödeme yaparsa (paytr-callback, bkz. o
--      dosyadaki yeni blok) BİZİM bu yüzden kapattığımız vitrin(ler)
--      otomatik geri açılıyor — kullanıcının kendi iradesiyle pasife aldığı
--      vitrinlere asla dokunulmuyor (aradaki fark aşağıdaki yeni sütun).
-- E-posta/SMS YOK — kullanıcının "trial bitişi için bile mail istemiyorum,
-- sadece uygulama içi bildirim" kararı (bkz. notifications_center.sql
-- başındaki not) burada da aynen geçerli.

-- 1) Bir vitrinin BİZİM (cron) tarafından, ödeme alınamadığı için
-- kapatıldığını, kullanıcının kendi isteğiyle pasife aldığından ayırt etmek
-- için tek bir zaman damgası yeterli. Bu sütun doluysa "biz kapattık" demek
-- — sadece bu işaretli satırlar bir sonraki gerçek ödemede otomatik geri
-- açılıyor (bkz. app/api/paytr-callback/route.js). Null bırakılan / kullanıcının
-- kendi kapattığı vitrinlere ödeme sonrası asla dokunulmuyor.
alter table services add column if not exists deactivated_for_billing_at timestamptz;

-- 2) Bildirim merkezine iki yeni tür (bkz. notifications_center.sql /
-- sahibinden_features.sql — kısıt her seferinde tam listeyle yeniden
-- kuruluyor, aynı deseni sürdürüyoruz).
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'pending_media_approval', 'staff_review_needed', 'media_approved', 'media_rejected',
    'new_message', 'job_delivered', 'saved_search_match',
    'subscription_ending_soon', 'vitrin_deactivated'
  ));

-- Not: asıl uyarı/kapatma/yeniden-açma MANTIĞI burada bir trigger/RPC değil
-- — app/api/cron/renew-subscriptions/route.js içinde (zaten service role
-- ile çalışan, günlük Vercel Cron route'u) ve app/api/paytr-callback/
-- route.js içinde (yeniden açma). Bu dosya sadece o iki route'un ihtiyaç
-- duyduğu şemayı hazırlıyor — cron route'u zaten payment_orders/
-- provider_subscriptions gibi tablolara doğrudan admin client'la yazıyor,
-- yeni bir RPC eklemek yerine aynı deseni sürdürüyoruz.
