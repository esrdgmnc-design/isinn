"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { registerAiConsentPrompt } from "../lib/aiConsent";

// Yapay zekâ özelliği ilk kullanıldığında (yalnızca iOS kabuğunda) çıkan onay penceresi.
export default function AiConsentModal() {
  const { t } = useLanguage();
  const [done, setDone] = useState(null); // bekleyen çağrının çözücüsü

  useEffect(() => registerAiConsentPrompt((cb) => setDone(() => cb)), []);

  if (!done) return null;
  const answer = (accepted) => { const cb = done; setDone(null); cb(accepted); };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(15,17,21,0.55)" }} role="dialog" aria-modal="true" aria-labelledby="ai-consent-title">
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl" style={{ background: "#FFFFFF" }}>
        <h2 id="ai-consent-title" className="text-lg font-black mb-2" style={{ color: "#0F1115" }}>{t("aiConsent.title")}</h2>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>{t("aiConsent.body")}</p>
        <a href="/gizlilik-politikasi" target="_blank" rel="noopener" className="text-xs font-semibold underline" style={{ color: "#2563EB" }}>{t("aiConsent.policyLink")}</a>
        <div className="flex flex-col gap-2 mt-5">
          <button onClick={() => answer(true)} className="w-full py-3 rounded-full text-sm font-bold text-white" style={{ background: "#2563EB" }}>{t("aiConsent.accept")}</button>
          <button onClick={() => answer(false)} className="w-full py-3 rounded-full text-sm font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>{t("aiConsent.decline")}</button>
        </div>
      </div>
    </div>
  );
}
