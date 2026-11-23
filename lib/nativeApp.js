// İşinn mobil uygulamaları (Capacitor kabuğu) kullanıcı ajanına işaret ekler:
// iOS -> "IsinnApp-iOS", Android -> "IsinnApp-Android" (capacitor.config.json -> appendUserAgent).
// Mağaza kuralları gereği uygulama kabuğunda ücretli plan/ödeme yüzeyleri (Apple 3.1.1, Google Play Faturalandırma)
// gösterilmez. Google ile giriş gömülü WebView'da çalışmaz; yeni sürümlerde sistem tarayıcısıyla yapılır
// (lib/nativeGoogleAuth.js), eski sürümlerde gizli kalır.
// Bu dosya bilinçli olarak bağımlılıksız: birim testleri paket kurmadan çalışır (React kancası lib/useIosApp.js'te).
const ua = () => (typeof navigator !== "undefined" ? navigator.userAgent || "" : "");

export function isIosApp() {
  return /IsinnApp-iOS/.test(ua());
}

export function isAndroidApp() {
  return /IsinnApp-Android/.test(ua());
}

// Herhangi bir mağaza uygulaması kabuğu (iOS ya da Android): plan/fiyat/Google girişi gizleme, yapay zekâ onayı vb. için.
export function isStoreApp() {
  return isIosApp() || isAndroidApp();
}
