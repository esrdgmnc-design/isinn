"use client";
import { useState } from "react";

// Araç sayfalarında tek tıkla kopyalanacak metin (vitrin linki, gömme kodu).
export default function CopyText({ text, label = "Kopyala", dark = false }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Pano izni yoksa metin zaten seçilebilir durumda.
    }
  }
  return (
    <div className="relative mb-3">
      <pre
        className="text-xs p-4 pr-24 rounded-xl overflow-x-auto whitespace-pre-wrap break-all"
        style={dark ? { background: "#0F1115", color: "#EFE8D8" } : { background: "#fff", color: "#0F1115", border: "1px solid #E4E4E7" }}
      >{text}</pre>
      <button
        type="button"
        onClick={copy}
        className="absolute top-2.5 right-2.5 text-xs font-bold px-3 py-1.5 rounded-full"
        style={{ background: copied ? "#16A34A" : "#2563EB", color: "#fff" }}
      >
        {copied ? "Kopyalandı" : label}
      </button>
    </div>
  );
}
