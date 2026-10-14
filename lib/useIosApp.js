import { useEffect, useState } from "react";
import { isIosApp } from "./nativeApp";

// Sunucu çıktısıyla uyumlu kalsın diye ilk render her zaman false; bağlanınca gerçek değer.
export function useIosApp() {
  const [v, setV] = useState(false);
  useEffect(() => { setV(isIosApp()); }, []);
  return v;
}
