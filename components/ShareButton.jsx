"use client";
import { useState } from "react";

// SEO stratejisi dokümanı madde 5: sağlayıcıların kendi vitrin linklerini
// (artık gerçek, kalıcı bir URL'si var — bkz. app/vitrin/[id]/page.js)
// Instagram/WhatsApp'ta paylaşması hem direkt trafik hem de Google'a yeni
// sayfa keşfettirme etkisi yaratır — tek tıkla paylaşmayı kolaylaştırıyor.
export default function ShareButton({ url, title }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Kullanıcı paylaşım penceresini kapattıysa sessizce geç.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API erişilemezse (izin/tarayıcı desteği) sessizce geç.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-3 rounded-full"
      style={{ border: "1px solid #D9D0BA", color: "#0F1115" }}
    >
      {copied ? "Link kopyalandı ✓" : "Paylaş"}
    </button>
  );
}
