"use client";
import { useEffect } from "react";

// Android/TWA paketi (Play Store) için gerekli — bkz. public/sw.js'teki not.
// Ayrı, minik bir client bileşen olarak var çünkü app/layout.js bir server
// component, navigator.serviceWorker gibi tarayıcı API'lerine doğrudan erişemez.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
