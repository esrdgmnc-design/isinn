import { useEffect, useState } from "react";
import { isIosApp, isStoreApp } from "./nativeApp";

// Sunucu çıktısıyla uyumlu kalsın diye ilk render her zaman false; bağlanınca gerçek değer.
export function useIosApp() {
  const [v, setV] = useState(false);
  useEffect(() => { setV(isIosApp()); }, []);
  return v;
}

// iOS ya da Android uygulama kabuğu.
export function useStoreApp() {
  const [v, setV] = useState(false);
  useEffect(() => { setV(isStoreApp()); }, []);
  return v;
}
