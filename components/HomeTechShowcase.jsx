"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Scale, Check, ChevronRight, Pause, Play } from "lucide-react";
import { useLanguage } from "../lib/i18n/LanguageContext";

// Ana sayfa teknoloji vitrini (2026-11-14, kurucu: "daha etkileyici olsun").
// Sağdaki panel "Ne arıyorsun?" eşleştirmesinin gerçek akışını adım adım oynatır (lib/needMatchCore.js):
// 1) serbest metin → 2) kişisel bilgi silme (lib/piiScrub.js, telefon gerçekten bu biçimde yakalanır)
// → 3) niyet çıkarma (kategori/il/şekil) → 4) sunucu kuralları (il uyumu, ücretli öne çıkarma sıralamaya girmez)
// → 5) sıralama. Panel bir ÖRNEKtir, sonuç ekranı taklit edilmez (sayı/isim/puan yok).
// Hareket azaltılmışsa ya da ekran dışındaysa oynatılmaz; kullanıcı durdurabilir (WCAG 2.2.2).

const TXT = {
  tr: {
    eyebrow: "Teknoloji",
    heading: ["Kategorilerde kaybolma.", "Derdini yaz,", "doğru uzmanı yapay zekâ bulsun."],
    sub: "Hangi kategoriye bakacağını bilmene gerek yok. İhtiyacını bir arkadaşına anlatır gibi yaz; yapay zekâ ne istediğini anlar ve sana uygun uzmanları önüne getirir.",
    ctaTry: "Yapay zekâ ile uzman bul",
    ctaMore: "Teknolojimizi incele",
    caps: [
      { icon: Sparkles, t: "Tek cümle yeter", d: "Kategori seçmekle uğraşmazsın." },
      { icon: Scale, t: "Sana en uygun kişi önce gelir", d: "Reklam verenler öne geçirilmez." },
    ],
    panelTitle: "Örnek",
    input: "Kızım LGS'ye hazırlanıyor, matematikte zorlanıyor. İstanbul Kadıköy.",
    steps: ["Ne istediğin anlaşıldı", "Sana uygun uzmanlar gösterildi"],
    matchPct: "%{score} uyum",
    chips: [["Ne", "Matematik özel ders"], ["Düzey", "LGS"], ["Nerede", "İstanbul"]],
    pause: "Animasyonu durdur", play: "Animasyonu oynat",
  },
  en: {
    eyebrow: "Technology",
    heading: ["Skip the categories.", "Describe your need,", "AI finds the right expert."],
    sub: "No need to know which category to browse. Write it the way you would tell a friend; AI understands what you want and brings matching experts to you.",
    ctaTry: "Find an expert with AI",
    ctaMore: "See our technology",
    caps: [
      { icon: Sparkles, t: "One sentence is enough", d: "No categories to pick." },
      { icon: Scale, t: "The best match comes first", d: "Advertisers are not pushed ahead." },
    ],
    panelTitle: "Example",
    input: "My daughter is preparing for the LGS exam and struggles with maths. Istanbul Kadıköy.",
    steps: ["What you want was understood", "Matching experts were shown"],
    matchPct: "{score}% match",
    chips: [["What", "Maths tutoring"], ["Level", "LGS"], ["Where", "Istanbul"]],
    pause: "Pause animation", play: "Play animation",
  },
};

// 2026-11-22 kurucu: "teknoloji kısmı daha basit anlaşılsın, telefonun silinir kimsenin umrunda değil".
// Panel yalnızca kullanıcının gördüğü sonucu anlatır: yaz → anlaşıldı → uygun uzmanlar. Bölüm de küçüldü.
// Zaman çizelgesi (ms): yazma → anlaşıldı → uzmanlar → bekle → başa dön
const TYPE_MS = 2400, T_INTENT = 2900, T_RANK = 4100, LOOP = 7500;

export default function HomeTechShowcase({ onTry }) {
  const { language } = useLanguage();
  const L = TXT[language === "en" ? "en" : "tr"];
  const full = L.input;
  const [t, setT] = useState(LOOP - 1); // ilk çizimde (SSR, hareket yok) son durum görünür
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setAnimate(true);
    setT(0);
    const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0.25 });
    if (rootRef.current) io.observe(rootRef.current);
    let last = performance.now();
    let raf;
    const tick = (now) => {
      const dt = now - last; last = now;
      if (visibleRef.current && !pausedRef.current) setT((v) => (v + dt) % LOOP);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const togglePause = () => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); };

  const typed = full.slice(0, Math.round(Math.min(1, t / TYPE_MS) * full.length));
  const done = t >= TYPE_MS;
  const shown = typed;
  const stepOn = [t >= T_INTENT, t >= T_RANK];
  const fade = (on, delay = 0) => ({
    opacity: on ? 1 : 0.18,
    transform: on ? "translateY(0)" : "translateY(4px)",
    transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms`,
  });

  return (
    <section ref={rootRef} className="max-w-6xl mx-auto px-5 mt-14 sm:mt-16">
      <div className="rounded-3xl overflow-hidden relative" style={{ background: "#0B0B0F" }}>
        {/* ince ızgara dokusu: teknik his, gradyan değil */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-10 px-5 sm:px-8 py-7 sm:py-9">
          <div className="min-w-0 flex flex-col">
            <p className="text-xs tracking-[0.2em] uppercase font-bold mb-3" style={{ color: "#3B82F6" }}>{L.eyebrow}</p>
            <h2 className="font-sans text-2xl sm:text-3xl font-black tracking-tight leading-[1.1] mb-3" style={{ color: "#FFFFFF" }}>
              {L.heading[0]}<br />{L.heading[1]}<br /><span style={{ color: "#3B82F6" }}>{L.heading[2]}</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-lg mb-5" style={{ color: "#A1A1AA" }}>{L.sub}</p>
            <div className="flex flex-wrap gap-3 mb-5">
              <button type="button" onClick={onTry} className="text-sm font-bold px-5 py-3 rounded-full text-white inline-flex items-center gap-2" style={{ background: "#2563EB" }}>
                <Sparkles size={16} aria-hidden="true" /> {L.ctaTry}
              </button>
              <Link href="/teknoloji" className="text-sm font-bold px-5 py-3 rounded-full inline-flex items-center gap-1" style={{ border: "1px solid #3F3F46", color: "#FFFFFF" }}>
                {L.ctaMore} <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {L.caps.map(({ icon: Icon, t: title, d }) => (
                <div key={title} className="rounded-2xl p-3.5 flex items-start gap-3" style={{ border: "1px solid #27272A", background: "#111114" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#1E3A8A" }}>
                    <Icon size={15} className="text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-snug" style={{ color: "#FFFFFF" }}>{title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#71717A" }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canlı akış paneli */}
          <div className="min-w-0 rounded-2xl p-5 sm:p-6 self-start w-full" style={{ background: "#111114", border: "1px solid #27272A" }} aria-label={L.panelTitle}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#A1A1AA" }}>
                {L.panelTitle}
              </p>
              {animate && (
                <button type="button" onClick={togglePause} aria-label={paused ? L.play : L.pause} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ border: "1px solid #3F3F46", color: "#A1A1AA" }}>
                  {paused ? <Play size={13} /> : <Pause size={13} />}
                </button>
              )}
            </div>

            <div className="rounded-xl px-4 py-3.5 text-sm leading-relaxed min-h-[64px]" style={{ background: "#0B0B0F", border: "1px solid #3F3F46", color: "#E4E4E7" }}>
              {shown}
              {animate && !done && <span className="inline-block w-[2px] h-4 align-middle ml-0.5 animate-pulse" style={{ background: "#3B82F6" }} />}
            </div>

            <ol className="mt-4 space-y-3">
              <li style={fade(stepOn[0])}>
                <div className="flex items-center gap-3 mb-2"><StepDot on={stepOn[0]} /> <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{L.steps[0]}</span></div>
                <div className="flex flex-wrap gap-2 pl-9">
                  {L.chips.map(([k, v], i) => (
                    <span key={k} style={fade(stepOn[0], i * 120)} className="text-xs rounded-full px-3 py-1.5" >
                      <span style={{ color: "#71717A" }}>{k}: </span><span className="font-bold" style={{ color: "#BFDBFE" }}>{v}</span>
                    </span>
                  ))}
                </div>
              </li>
              <li style={fade(stepOn[1])}>
                <div className="flex items-center gap-3 mb-2"><StepDot on={stepOn[1]} /> <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{L.steps[1]}</span></div>
                <div className="pl-9 space-y-2" aria-hidden="true">
                  {/* 2026-11-22 kurucu: örnek sonuçlarda uyum yüzdesi görünsün ("Ne arıyorsun?" kartlarındaki gibi). */}
                  {[[0.8, 94], [0.62, 87]].map(([w, pct], i) => (
                    <div key={i} style={fade(stepOn[1], i * 150)} className="flex items-center gap-3 rounded-lg px-3 py-2" >
                      <span className="w-7 h-7 rounded-md shrink-0" style={{ background: "#27272A" }} />
                      <span className="h-2 rounded-full flex-1" style={{ maxWidth: `${w * 100}%`, background: "#3F3F46" }} />
                      <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "#14532D", color: "#86EFAC" }}>{L.matchPct.replace("{score}", pct)}</span>
                    </div>
                  ))}
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepDot({ on }) {
  return (
    <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: on ? "#2563EB" : "#27272A", transition: "background .4s ease" }}>
      {on && <Check size={13} className="text-white" aria-hidden="true" />}
    </span>
  );
}
