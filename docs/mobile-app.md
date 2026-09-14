# İşinn — Mobil Uygulama (Capacitor)

## Nasıl çalışıyor

İşinn'in telefon uygulaması, web kodunu tekrar yazmak yerine **Capacitor** ile
gerçek bir native kabuğa sarılmış hali. `capacitor.config.json`'daki
`server.url` doğrudan **https://www.isinn.com.tr**'yi gösteriyor — yani
uygulama açıldığında gerçek, canlı siteyi native bir pencerede gösteriyor.

**Neden statik bir kopya değil de canlı siteyi gösteriyor:** İşinn'in ödeme
(PayTR), OTP (Netgsm), AI (Claude) ve otomatik yenileme (cron) gibi işleri
Next.js'in *sunucu tarafında* çalışan API route'ları — bunlar statik bir
dosyaya "export" edilemez. Bu yüzden en doğru, en az riskli yol: web sitesi
Vercel'de aynen çalışmaya devam ediyor, telefon uygulaması sadece ona gerçek
bir app ikonu, splash ekranı ve mağaza varlığı kazandırıyor.

**Sonuç olarak:** siteye yaptığın her değişiklik (push → Vercel deploy)
otomatik olarak telefon uygulamasına da yansıyor — ayrıca bir "uygulama
güncellemesi" yayınlamana gerek yok, tek istisna ikon/splash/ayar gibi
native tarafı değiştiren şeyler.

## Klasörler

- `android/` — Android native projesi (Android Studio ile de açılabilir)
- `ios/` — iOS native projesi (sadece Mac'te Xcode ile açılabilir)
- `resources/icon.png`, `resources/splash.png` — kaynak görseller (sitenin
  gerçek marka renkleriyle, `scripts/app-icon-source.html` ve
  `app-splash-source.html`'den üretildi)
- `codemagic.yaml` — bulut derleme tarifi (aşağıya bak)

## Şimdi senin yapman gerekenler

### 1. Android — test paketini dene (bugün, ücretsiz)
1. [codemagic.io](https://codemagic.io) → ücretsiz hesap aç → bu GitHub
   reposunu bağla.
2. Codemagic `codemagic.yaml`'ı otomatik bulur. **"android-debug"**
   iş akışını çalıştır.
3. Birkaç dakika sonra bir `.apk` dosyası iner — bunu Android telefonuna
   kurup gerçek uygulamayı deneyebilirsin (Play Store'a yüklenemez, sadece
   test amaçlı, imzasız).

### 2. iOS — test paketini dene
Aynı şekilde **"ios-debug"** iş akışını çalıştır — Codemagic bunu kendi bulut
Mac'inde derliyor, senin bir Mac'e ihtiyacın yok.

### 3. Gerçek mağaza yayını — hesaplar (senin adına, benim giremeyeceğim yerler)
- **Google Play Console** — $25 tek seferlik, kendi Google hesabınla.
- **Apple Developer Program** — $99/yıl, kendi Apple ID'inle.
- Bu hesapları açtıktan sonra Codemagic'in "Code signing" ayarlarına kendi
  imzalama sertifikalarını/anahtarlarını SEN yüklersin (bunlar özel
  anahtarlar — bana asla göstermene gerek yok, Codemagic bunları güvenli
  şekilde saklıyor).
- Hazır olduğunda haber ver, mağaza listeleme metnini (açıklama, ekran
  görüntüsü gereksinimleri, kategori vb.) birlikte hazırlarız.

## İkon/splash değiştirmek istersen
`resources/icon.png` ve `resources/splash.png`'i değiştirip şunu çalıştır:
```bash
npx capacitor-assets generate
npx cap sync
```
Sonra Codemagic'te ilgili iş akışını tekrar çalıştır.
