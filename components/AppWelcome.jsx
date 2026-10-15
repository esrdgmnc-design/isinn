"use client";
import { useEffect, useState } from "react";
import { Palette, BookOpen, Baby, ChefHat, Languages, Laptop, ArrowRight } from "lucide-react";
import { isStoreApp } from "../lib/nativeApp";
import { trackEvent } from "../lib/analytics";

const SEEN_KEY = "isinn_ios_welcome_seen_v1";
const TALENT_PREFILL_KEY = "isinn_talent_prefill"; // IsinnApp.jsx ile aynı anahtar (Yeteneğini Farket ön doldurma)

// Kutucuklar: yalnızca fikir verir, kazanç/müşteri vaadi yok. Dokununca Yeteneğini Farket açılır, cümle hazır gelir.
const CARDS = [
  { icon: Palette, label: "El işi ve tasarım", text: "El işi, tasarım ve yaratıcı işler yapmayı severim" },
  { icon: BookOpen, label: "Ders ve eğitim", text: "Bildiğim bir konuyu öğretmeyi, özel ders vermeyi severim" },
  { icon: Baby, label: "Bakım ve ilgi", text: "Çocuk, yaşlı ya da evcil hayvan bakımı yapmayı severim" },
  { icon: ChefHat, label: "Yemek ve pastacılık", text: "Yemek, pasta ve ev lezzetleri yapmayı severim" },
  { icon: Languages, label: "Dil ve yazı", text: "Çeviri, yazı yazma ve yabancı dil konusunda iyiyim" },
  { icon: Laptop, label: "Bilgisayar ve dijital", text: "Bilgisayar, sosyal medya ve dijital işlerde iyiyim" },
];

function readSeen() {
  try { return localStorage.getItem(SEEN_KEY) === "1"; } catch {}
  try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch {}
  return false;
}
function writeSeen() {
  try { localStorage.setItem(SEEN_KEY, "1"); return; } catch {}
  try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
}

// iOS ve Android uygulamasında ilk açılışta 2 ekranlık karşılama. Web ziyaretçilerinde ve sonraki açılışlarda hiçbir şey çizmez.
export default function AppWelcome() {
  const [step, setStep] = useState(0); // 0 = kapalı/yok, 1 ve 2 = ekranlar
  useEffect(() => {
    if (!isStoreApp() || readSeen()) return;
    setStep(1);
    trackEvent("app_welcome_shown", {}, null);
  }, []);

  if (!step) return null;

  const close = (how) => {
    writeSeen();
    trackEvent("app_welcome_done", { how }, null);
    setStep(0);
  };
  const openTalent = (text, how) => {
    writeSeen();
    trackEvent("app_welcome_done", { how }, null);
    try { if (text) sessionStorage.setItem(TALENT_PREFILL_KEY, text); } catch {}
    window.location.assign("/?view=talentDiscovery");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="İşinn'e hoş geldin"
      style={{
        position: "fixed", inset: 0, zIndex: 200, background: "#FFFFFF", color: "#0F2A4A",
        display: "flex", flexDirection: "column",
        padding: "calc(max(env(safe-area-inset-top), var(--safe-area-inset-top, 0px)) + 16px) 22px calc(max(env(safe-area-inset-bottom), var(--safe-area-inset-bottom, 0px)) + 20px)",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", minHeight: 32 }}>
        <button onClick={() => close("skip")} style={{ fontSize: 14, fontWeight: 600, color: "#64748B", padding: "6px 4px" }}>
          Atla
        </button>
      </div>

      {step === 1 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
          <img src="/icons/icon-192.webp" alt="İşinn" width={84} height={84} style={{ margin: "0 auto 22px", borderRadius: 20 }} />
          <h1 style={{ fontSize: 30, lineHeight: 1.15, fontWeight: 900, margin: 0 }}>Yeteneğini keşfet,<br />işini kur.</h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#2563EB", margin: "10px 0 0" }}>İşin gücün burada</p>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "#475569", margin: "18px auto 0", maxWidth: 320 }}>
            Bildiğin işi komşunun ötesine taşı. Komisyon yok, telefonun gizli kalır.
          </p>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: 26, lineHeight: 1.2, fontWeight: 900, margin: "0 0 6px", textAlign: "center" }}>Sen ne yapmayı seviyorsun?</h1>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 18px", textAlign: "center" }}>Birine dokun, sana hizmet fikirleri çıkaralım.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {CARDS.map(({ icon: Icon, label, text }) => (
              <button
                key={label}
                onClick={() => openTalent(text, "card")}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, textAlign: "left",
                  padding: "14px 12px", borderRadius: 16, border: "1px solid #DBEAFE", background: "#F5F9FF",
                }}
              >
                <span style={{ width: 36, height: 36, borderRadius: 12, background: "#FFFFFF", display: "grid", placeItems: "center", color: "#2563EB", border: "1px solid #DBEAFE" }}>
                  <Icon size={19} />
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>{label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => openTalent("", "unknown")}
            style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: "#2563EB", padding: "10px 4px", textAlign: "center" }}
          >
            Ne yapacağımı bilmiyorum
          </button>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            onClick={() => setStep(2)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "15px 18px",
              borderRadius: 16, background: "#2563EB", color: "#FFFFFF", fontSize: 16, fontWeight: 800,
            }}
          >
            Başlayalım <ArrowRight size={18} />
          </button>
          <button onClick={() => close("browse")} style={{ padding: "12px 4px", fontSize: 14, fontWeight: 600, color: "#64748B" }}>
            Sadece göz atacağım
          </button>
        </div>
      )}
    </div>
  );
}
