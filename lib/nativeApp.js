// İşinn iOS uygulaması (Capacitor kabuğu) kullanıcı ajanına "IsinnApp-iOS" ekler
// (capacitor.config.json -> ios.appendUserAgent). Mağaza kuralları gereği iOS kabuğunda
// Google ile giriş (4.8) ve ücretli plan/ödeme yüzeyleri (3.1.1) gösterilmez.
import { useEffect, useState } from "react";

export function isIosApp() {
  return typeof navigator !== "undefined" && /IsinnApp-iOS/.test(navigator.userAgent || "");
}

// Sunucu çıktısıyla uyumlu kalsın diye ilk render her zaman false; bağlanınca gerçek değer.
export function useIosApp() {
  const [v, setV] = useState(false);
  useEffect(() => { setV(isIosApp()); }, []);
  return v;
}
