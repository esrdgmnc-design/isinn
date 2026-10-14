// İşinn iOS uygulaması (Capacitor kabuğu) kullanıcı ajanına "IsinnApp-iOS" ekler
// (capacitor.config.json -> ios.appendUserAgent). Mağaza kuralları gereği iOS kabuğunda
// Google ile giriş (4.8) ve ücretli plan/ödeme yüzeyleri (3.1.1) gösterilmez.
// Bu dosya bilinçli olarak bağımlılıksız: birim testleri paket kurmadan çalışır (React kancası lib/useIosApp.js'te).
export function isIosApp() {
  return typeof navigator !== "undefined" && /IsinnApp-iOS/.test(navigator.userAgent || "");
}
