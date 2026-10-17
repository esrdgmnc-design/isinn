"use client";

import { useState } from "react";
import NeonWall from "./NeonWall";
import { ArrowLeft, ChevronRight, Loader2, MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { aiFetch } from "../lib/aiConsent";
import { trackEvent } from "../lib/analytics";

// "Ne arıyorsun?" (2026-10-17, Freelancer'ın "Ne yapmak istediğinizi söyleyin" ekranından uyarlandı).
// Ziyaretçi ihtiyacını kendi cümlesiyle yazar; sunucu (/api/need-match) gerçek vitrinleri isteğe
// yakınlığa göre sıralar. Ekranda sayı/yüzde yok, yapay zekânın serbest metni yok — yalnızca sıralama
// ve veriden hesaplanan sabit etiketler. Eşleşme yoksa kişi geri çevrilmez: metniyle dolu talep formu açılır.
export const NEED_PREFILL_KEY = "isinn_need_prefill";
// Ana sayfa bento kutucuğu → bu ekran: kutucuğun örnek cümlesi kutuya hazır gelir (bir kez okunur).
export const NEED_TEXT_KEY = "isinn_need_text";

export default function NeedMatchView({ realListings, onSelectListing, onBack, onPostRequest, userId }) {
  const { t } = useLanguage();
  const [text, setText] = useState(() => {
    if (typeof window === "undefined") return "";
    try { const v = sessionStorage.getItem(NEED_TEXT_KEY) || ""; sessionStorage.removeItem(NEED_TEXT_KEY); return v.slice(0, 500); } catch { return ""; }
  });
  const [state, setState] = useState({ status: "idle" }); // idle | loading | done | error
  const examples = t("needMatch.examples");

  const submit = async (e) => {
    e?.preventDefault();
    const q = text.trim();
    if (!q) return;
    setState({ status: "loading" });
    trackEvent("need_submit", {}, userId);
    try {
      const res = await aiFetch("/api/need-match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: q }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && !data.kind) {
        setState({ status: "done", kind: res.status === 429 ? "rate" : "busy", results: [], prefill: null });
        return;
      }
      setState({ status: "done", kind: data.kind || "none", results: Array.isArray(data.results) ? data.results : [], prefill: data.prefill || null });
      trackEvent("need_result", { kind: data.kind || "none", bucket: (data.results || []).length === 0 ? "0" : (data.results || []).length < 3 ? "1-2" : "3+" }, userId);
    } catch (err) {
      setState({ status: "done", kind: err?.message === "ai_consent_declined" ? "consent" : "busy", results: [], prefill: null });
    }
  };

  // Sonuçları istemcideki vitrin listesinden çiz (sunucu yalnızca kimlik + etiket döndürür).
  const byId = new Map((realListings || []).map((l) => [l.dbId, l]));
  const cards = state.status === "done" ? state.results.map((r) => ({ ...r, l: byId.get(r.serviceId) })).filter((r) => r.l) : [];

  const publish = () => {
    trackEvent("need_publish_click", {}, userId);
    const q = text.trim();
    try {
      sessionStorage.setItem(NEED_PREFILL_KEY, JSON.stringify({
        title: q.split(/[.!?\n]/)[0].slice(0, 80),
        desc: q.slice(0, 500),
        categorySlug: state.prefill?.categorySlug || "",
        province: state.prefill?.province || "",
        remote: !!state.prefill?.remote,
        ts: Date.now(),
      }));
    } catch {}
    onPostRequest();
  };

  const emptyKind = state.status === "done" && cards.length === 0 ? (state.kind === "match" ? "none" : state.kind) : null;

  return (
    <div className="min-h-screen" style={{ background: "#0B0B0F" }}>
      {/* Üst bölüm (2026-10-17, Freelancer'ın "Ne yapmak istediğinizi söyleyin." ekranı gibi): solda büyük
          üç satırlık başlık + sade yazı kutusu, sağda tam boy çarpıcı görsel (imza yazısı kurucu isteğiyle kaldırıldı). Örnek cümle
          düğmeleri kaldırıldı (kutu sade kalsın); örnek, kutunun içinde silik yazı olarak duruyor. */}
      <div className="grid lg:grid-cols-[1.55fr_1fr] lg:min-h-[560px]">
        <div className="px-5 sm:px-10 lg:px-16 pt-6 pb-10 flex flex-col justify-center">
          <button onClick={onBack} className="self-start inline-flex items-center gap-1.5 text-sm font-semibold mb-8 lg:mb-10" style={{ color: "#9CA3AF" }}>
            <ArrowLeft size={16} /> {t("needMatch.back")}
          </button>
          <h1 className="font-sans font-black tracking-[-0.04em] leading-[0.92] text-white" style={{ fontSize: "clamp(36px, 4.4vw, 64px)" }}>
            {t("needMatch.titleA")}<br />
            <span style={{ color: "#3B82F6" }}>{t("needMatch.titleB")}</span>
          </h1>
          <p className="mt-4 text-[15px] max-w-xl" style={{ color: "#E5E7EB" }}>{t("needMatch.subtitle")}</p>
          <form onSubmit={submit} className="mt-7 max-w-3xl">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={Array.isArray(examples) ? examples[0] : ""}
              aria-label={t("needMatch.inputLabel")}
              className="w-full rounded-md px-4 py-3 text-[15px] leading-relaxed outline-none resize-y focus:ring-2 focus:ring-[#3B82F6]"
              style={{ background: "#1E2029", border: "2px solid #3B82F6", color: "#F9FAFB" }}
            />
            <p className="mt-2.5 text-xs leading-relaxed" style={{ color: "#8B8D98" }}>{t("needMatch.privacyNote")}</p>
            <button type="submit" disabled={state.status === "loading" || !text.trim()} className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-md text-[15px] font-bold disabled:opacity-50 transition-colors" style={{ background: "#2563EB", color: "#FFFFFF" }}>
              {state.status === "loading" ? <><Loader2 size={16} className="animate-spin" /> {t("needMatch.loading")}</> : <>{t("needMatch.submit")} <ChevronRight size={16} /></>}
            </button>
          </form>
        </div>
        <div className="hidden lg:block relative overflow-hidden" aria-hidden="true" style={{ background: "#05050A" }}>
          {/* Sağ panel: farklı yazı stillerinde neon "İşinn" tabelaları (kurucu isteği; 10 tabela). Mürekkep görseli
              public/bento/ne-ariyorsun-3.jpg yedekte. */}
          <NeonWall />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-16">
        {state.status === "done" && cards.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-black text-white">{t("needMatch.resultsTitle")}</h2>
            <p className="text-sm mt-1 mb-6" style={{ color: "#9CA3AF" }}>{t("needMatch.rankingNote")}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map(({ l, reasons }, i) => (
                <button key={l.id} onClick={() => { trackEvent("need_card_click", { rank: i + 1 }, userId); onSelectListing(l); }} className="group text-left rounded-2xl overflow-hidden transition-transform hover:-translate-y-1" style={{ background: "#15161B", border: "1px solid #26272E" }}>
                  <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "#1F2028" }}>
                    {l.img && <img src={l.img} alt={l.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="p-4">
                    <p className="text-[15px] font-bold leading-snug line-clamp-2 text-white">{l.title}</p>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#9CA3AF" }}><MapPin size={11} />{l.provider}{l.city ? ` · ${l.city}` : ""}</p>
                    {reasons?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {reasons.map((r) => (
                          <span key={r} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(96,165,250,0.12)", color: "#93C5FD" }}>{t(`needMatch.reason.${r}`)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm" style={{ color: "#9CA3AF" }}>
              {t("needMatch.alsoPublish")}{" "}
              <button onClick={publish} className="font-bold underline" style={{ color: "#93C5FD" }}>{t("needMatch.publishCta")}</button>
            </p>
          </section>
        )}

        {emptyKind && (
          <section className="mt-14 rounded-2xl p-7 max-w-3xl" style={{ background: "#15161B", border: "1px solid #26272E" }}>
            <Sparkles size={20} style={{ color: "#60A5FA" }} />
            <h2 className="mt-3 text-xl font-black text-white">{t(`needMatch.empty.${emptyKind}.title`)}</h2>
            <p className="mt-1.5 text-sm" style={{ color: "#C7C9D1" }}>{t(`needMatch.empty.${emptyKind}.body`)}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {emptyKind !== "vague" && (
                <button onClick={publish} className="px-5 py-2.5 rounded-full text-sm font-bold" style={{ background: "#FFFFFF", color: "#0F1115" }}>{t("needMatch.publishCta")}</button>
              )}
              <button onClick={() => setState({ status: "idle" })} className="px-5 py-2.5 rounded-full text-sm font-bold" style={{ border: "1px solid #3A3B44", color: "#E5E7EB" }}>{t("needMatch.editCta")}</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
