"use client";
import { useEffect } from "react";
import { isIosApp } from "../lib/nativeApp";

// iOS kabuğunda: <html>'e sınıf ekler (çentik/alt çubuk boşlukları globals.css'te) ve viewport-fit=cover açar.
// Web ziyaretçilerinde hiçbir şey değişmez.
export default function IosShellMarker() {
  useEffect(() => {
    if (!isIosApp()) return;
    document.documentElement.classList.add("isinn-ios-app", "isinn-booted"); // booted: açılış perdesi solar
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && !/viewport-fit/.test(meta.content)) meta.setAttribute("content", `${meta.content}, viewport-fit=cover`);
  }, []);
  return null;
}
