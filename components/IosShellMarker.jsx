"use client";
import { useEffect } from "react";
import { isIosApp, isAndroidApp } from "../lib/nativeApp";

// Mobil uygulama kabuğunda: <html>'e sınıf ekler (çentik/alt çubuk boşlukları globals.css'te), viewport-fit=cover açar
// ve açılış perdesini kaldırır (isinn-booted). Web ziyaretçilerinde hiçbir şey değişmez.
export default function IosShellMarker() {
  useEffect(() => {
    const ios = isIosApp();
    const android = isAndroidApp();
    if (!ios && !android) return;
    document.documentElement.classList.add(ios ? "isinn-ios-app" : "isinn-android-app", "isinn-booted");
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && !/viewport-fit/.test(meta.content)) meta.setAttribute("content", `${meta.content}, viewport-fit=cover`);
  }, []);
  return null;
}
