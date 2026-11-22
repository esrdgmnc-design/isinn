"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Scale, Bot, Check, ChevronRight, Pause, Play } from "lucide-react";
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
      { icon: Sparkles, t: "Daha hızlı bulursun", d: "Menülerde kaybolmazsın; tek cümle yeter." },
      { icon: Scale, t: "Para veren öne geçmez", d: "Sıralamayı ücretli öne çıkarma değil, ihtiyacın belirler." },
      { icon: ShieldCheck, t: "Numaran güvende", d: "Telefon ve e-posta yapay zekâya gitmeden silinir." },
      { icon: Bot, t: "Asistanından da ara", d: "Claude ya da ChatGPT'ye sor, İşinn uzmanları gelsin." },
    ],
    panelTitle: "Sen yazınca ne oluyor?",
    example: "örnek",
    input: "Kızım LGS'ye hazırlanıyor, matematikte zorlanıyor. İstanbul Kadıköy, haftada 2 ders. ",
    phone: "0532 111 22 33",
    removed: "[silindi]",
    steps: ["Telefon numaran silindi, yapay zekâya gitmedi", "Ne istediğin anlaşıldı", "Sana uymayanlar elendi", "Uygun uzmanlar önüne geldi"],
    chips: [["Ne", "Matematik özel ders"], ["Düzey", "LGS"], ["Nerede", "İstanbul"], ["Şekil", "Yüz yüze"]],
    rules: ["Başka şehirden, yüz yüze gelemeyecek olanlar çıkarıldı", "Para verip öne çıkanlara ayrıcalık yok"],
    pause: "Animasyonu durdur", play: "Animasyonu oynat",
  },
  en: {
    eyebrow: "Technology",
    heading: ["Skip the categories.", "Describe your need,", "AI finds the right expert."],
    sub: "No need to know which category to browse. Write it the way you would tell a friend; AI understands what you want and brings matching experts to you.",
    ctaTry: "Find an expert with AI",
    ctaMore: "See our technology",
    caps: [
      { icon: Sparkles, t: "Find faster", d: "No menus to dig through; one sentence is enough." },
      { icon: Scale, t: "Paying doesn't buy rank", d: "Your need decides the order, not paid boosts." },
      { icon: ShieldCheck, t: "Your number stays private", d: "Phone and e-mail are removed before any AI call." },
      { icon: Bot, t: "Ask your assistant", d: "Ask Claude or ChatGPT and get İşinn experts." },
    ],
    panelTitle: "What happens when you type?",
    example: "example",
    input: "My daughter is preparing for the LGS exam and struggles with maths. Istanbul Kadıköy, 2 lessons a week. ",
    phone: "0532 111 22 33",
    removed: "[removed]",
    steps: ["Your phone number was removed, never sent to AI", "What you want was understood", "Poor fits were filtered out", "Matching experts came to you"],
    chips: [["What", "Maths tutoring"], ["Level", "LGS"], ["Where", "Istanbul"], ["Mode", "In person"]],
    rules: ["Out-of-town providers who can't come in person removed", "No advantage for paid boosts"],
    pause: "Pause animation", play: "Play animation",
  },
};

// Zaman çizelgesi (ms): yazma → silme → niyet → kurallar → sıralama → bekle → başa dön
const TYPE_MS = 2600, T_SCRUB = 3100, T_INTENT = 3900, T_RULES = 5300, T_RANK = 6500, LOOP = 9500;

export default function HomeTechShowcase({ onTry }) {
  const { language } = useLanguage();
  const L = TXT[language === "en" ? "en" : "tr"];
  const full = L.input + L.phone;
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
  const scrubbed = t >= T_SCRUB;
  const shown = scrubbed ? L.input : typed;
  const stepOn = [scrubbed, t >= T_INTENT, t >= T_RULES, t >= T_RANK];
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
        <div className="relative grid lg:grid-cols-2 gap-10 px-6 sm:px-10 py-10 sm:py-14">
          <div className="min-w-0 flex flex-col">
            <p className="text-xs tracking-[0.2em] uppercase font-bold mb-3" style={{ color: "#3B82F6" }}>{L.eyebrow}</p>
            <h2 className="font-sans text-3xl sm:text-[2.6rem] font-black tracking-tight leading-[1.05] mb-5" style={{ color: "#FFFFFF" }}>
              {L.heading[0]}<br />{L.heading[1]}<br /><span style={{ color: "#3B82F6" }}>{L.heading[2]}</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-lg mb-7" style={{ color: "#A1A1AA" }}>{L.sub}</p>
            <div className="flex flex-wrap gap-3 mb-9">
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
                {L.panelTitle} <span className="normal-case font-normal tracking-normal" style={{ color: "#52525B" }}>· {L.example}</span>
              </p>
              {animate && (
                <button type="button" onClick={togglePause} aria-label={paused ? L.play : L.pause} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ border: "1px solid #3F3F46", color: "#A1A1AA" }}>
                  {paused ? <Play size={13} /> : <Pause size={13} />}
                </button>
              )}
            </div>

            <div className="rounded-xl px-4 py-3.5 text-sm leading-relaxed min-h-[96px]" style={{ background: "#0B0B0F", border: "1px solid #3F3F46", color: "#E4E4E7" }}>
              {shown}
              {scrubbed && <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "#14532D", color: "#86EFAC" }}>{L.removed}</span>}
              {animate && !scrubbed && <span className="inline-block w-[2px] h-4 align-middle ml-0.5 animate-pulse" style={{ background: "#3B82F6" }} />}
            </div>

            <ol className="mt-5 space-y-4">
              <li style={fade(stepOn[0])} className="flex items-center gap-3">
                <StepDot on={stepOn[0]} /> <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{L.steps[0]}</span>
              </li>
              <li style={fade(stepOn[1])}>
                <div className="flex items-center gap-3 mb-2.5"><StepDot on={stepOn[1]} /> <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{L.steps[1]}</span></div>
                <div className="flex flex-wrap gap-2 pl-9">
                  {L.chips.map(([k, v], i) => (
                    <span key={k} style={fade(stepOn[1], i * 120)} className="text-xs rounded-full px-3 py-1.5" >
                      <span style={{ color: "#71717A" }}>{k}: </span><span className="font-bold" style={{ color: "#BFDBFE" }}>{v}</span>
                    </span>
                  ))}
                </div>
              </li>
              <li style={fade(stepOn[2])}>
                <div className="flex items-center gap-3 mb-2"><StepDot on={stepOn[2]} /> <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{L.steps[2]}</span></div>
                <ul className="pl-9 space-y-1">
                  {L.rules.map((r, i) => (
                    <li key={r} style={fade(stepOn[2], i * 150)} className="text-xs flex items-center gap-2" >
                      <Check size={13} style={{ color: "#4ADE80" }} aria-hidden="true" /><span style={{ color: "#A1A1AA" }}>{r}</span>
                    </li>
                  ))}
                </ul>
              </li>
              <li style={fade(stepOn[3])}>
                <div className="flex items-center gap-3 mb-2.5"><StepDot on={stepOn[3]} /> <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{L.steps[3]}</span></div>
                <div className="pl-9 space-y-2" aria-hidden="true">
                  {[0.92, 0.78, 0.64].map((w, i) => (
                    <div key={i} style={fade(stepOn[3], i * 150)} className="flex items-center gap-3 rounded-lg px-3 py-2.5" >
                      <span className="w-7 h-7 rounded-md shrink-0" style={{ background: "#27272A" }} />
                      <span className="h-2 rounded-full" style={{ width: `${w * 100}%`, background: "#3F3F46" }} />
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
