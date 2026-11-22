"use client";
import { useRef, useState } from "react";

// SEO stratejisi dokümanı madde 5: sağlayıcıların kendi vitrin linklerini
// (artık gerçek, kalıcı bir URL'si var — bkz. app/vitrin/[id]/page.js)
// Instagram/WhatsApp'ta paylaşması hem direkt trafik hem de Google'a yeni
// sayfa keşfettirme etkisi yaratır — tek tıkla paylaşmayı kolaylaştırıyor.
// 2026-11-22 kurucu: tek "Paylaş" düğmesi; basınca "Hikâyede paylaş / Mesajla gönder" seçimi açılır.
// Hikâye için 1080×1920 kart (storyCardPath) dosya olarak paylaşılır; Instagram bağlantıyı yalnızca mesajda kabul ediyor.
// Kart, seçim açılır açılmaz indirilir: iPhone paylaşım menüsünü dokunuştan uzun süre sonra açmaya izin vermiyor.
export default function ShareButton({ url, title, storyCardPath = null }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const fileRef = useRef(null);

  function loadFile() {
    if (!fileRef.current) {
      fileRef.current = fetch(storyCardPath)
        .then((r) => (r.ok ? r.blob() : null))
        .then((b) => (b ? new File([b], "isinn-vitrin.png", { type: "image/png" }) : null))
        .catch(() => null);
    }
    return fileRef.current;
  }

  async function shareLink() {
    setOpen(false);
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Kullanıcı paylaşım penceresini kapattıysa sessizce geç.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API erişilemezse (izin/tarayıcı desteği) sessizce geç.
    }
  }

  async function shareStory() {
    setPreparing(true);
    const file = await loadFile();
    setPreparing(false);
    setOpen(false);
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file] }); } catch {}
      return;
    }
    window.open(storyCardPath, "_blank", "noopener");
  }

  function handleClick() {
    if (!storyCardPath) { shareLink(); return; }
    setOpen((v) => !v);
    loadFile();
  }

  const item = "block w-full px-4 py-3 text-sm font-medium text-left hover:bg-[#F4F4F5]";
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={storyCardPath ? open : undefined}
        className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-3 rounded-full"
        style={{ border: "1px solid #E4E4E7", color: "#0F1115" }}
      >
        {copied ? "Link kopyalandı ✓" : "Paylaş"}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 z-20 w-56 rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid #E4E4E7", background: "#FFFFFF" }}>
          <button type="button" onClick={shareStory} disabled={preparing} className={item} style={{ color: "#0F1115", opacity: preparing ? 0.6 : 1 }}>
            {preparing ? "Hazırlanıyor…" : "Hikâyede paylaş"}
          </button>
          <button type="button" onClick={shareLink} className={item} style={{ color: "#0F1115", borderTop: "1px solid #E4E4E7" }}>
            Mesajla gönder
          </button>
        </div>
      )}
    </div>
  );
}
