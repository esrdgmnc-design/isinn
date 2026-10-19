"use client";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { tr } from "./tr";
import { en } from "./en";

// Client-side dil sistemi — IsinnApp.jsx gerçek Next.js route'ları
// (app/[locale]/ gibi) kullanmadığı, tek bir "use client" bileşeni içinde
// kendi view state'ini yöneten bir SPA olduğu için, tercih tamamen tarayıcı
// tarafında tutuluyor (bkz. destek butonu konumu/kurulum bandı gibi
// diğer "isinn_" önekli localStorage kullanımları, IsinnApp.jsx). Varsayılan
// "tr" — mevcut kullanıcılar, SEO ve marka sesi Türkçe kalmaya devam ediyor,
// İngilizce eklenen bir seçenek, bir değiştirme değil.
const STORAGE_KEY = "isinn_language";
const DICTS = { tr, en };

const LanguageContext = createContext({
  language: "tr",
  setLanguage: () => {},
  t: (key) => key,
});

function getFromDict(dict, key) {
  return key.split(".").reduce((acc, part) => (acc && typeof acc === "object" ? acc[part] : undefined), dict);
}

function interpolate(value, vars) {
  if (typeof value !== "string" || !vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("tr");

  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch {}
    if (saved === "tr" || saved === "en") { setLanguageState(saved); return; }
    // Kayıtlı seçim yoksa (2026-10-19, yurt dışı hazırlığı): tarayıcının dil listesinde Türkçe yoksa ve
    // saat dilimi İstanbul değilse İngilizce aç. Telefonu İngilizce olan Türkiye'deki kullanıcı Türkçe kalır.
    // Seçim kaydedilmez; kullanıcı TR/EN anahtarına basınca kalıcı olur.
    try {
      const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]).map((l) => String(l).toLowerCase());
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (!langs.some((l) => l.startsWith("tr")) && tz !== "Europe/Istanbul") setLanguageState("en");
    } catch {}
  }, []);

  // <html lang> seçilen dile uysun: ekran okuyucular ve CSS büyük harf dönüşümü (ör. "CLEANİNG" hatası) için.
  useEffect(() => {
    try { document.documentElement.lang = language; } catch {}
  }, [language]);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, []);

  const t = useCallback((key, vars) => {
    const dict = DICTS[language] || DICTS.tr;
    let value = getFromDict(dict, key);
    // Phase 1 sadece bazı ekranları kapsıyor — henüz çevrilmemiş bir key
    // istenirse (örn. mesajlaşma/ilan oluşturma) sessizce tr'ye düşer,
    // İngilizce modda boş/garip bir metin yerine hâlâ okunabilir bir şey görünür.
    if (value === undefined) value = getFromDict(DICTS.tr, key);
    if (value === undefined) return key;
    return interpolate(value, vars);
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
