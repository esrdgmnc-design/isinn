"use client";
// "Bu aracı sitene ekle" kutusu (2026-11-10). Kod iki parçadır: aracı gösteren iframe ve iframe'in DIŞINDA kaynak
// bağlantısı. Kalıcı backlink ikinci parçadan gelir (iframe içindeki bağlantı ev sahibi sitenin HTML'inde değildir).
import { useState } from "react";

export default function EmbedCode({ embedUrl, toolUrl, name, height }) {
  const [copied, setCopied] = useState(false);
  const code =
    `<iframe src="${embedUrl}" title="${name}" width="100%" height="${height}" loading="lazy" style="border:0;max-width:640px;border-radius:12px"></iframe>\n` +
    `<p style="font-size:12px;margin-top:4px">Kaynak: <a href="${toolUrl}">${name} | İşinn</a></p>`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="rounded-2xl p-5 mt-8" style={{ background: "#F9FAFB", border: "1px solid #E4E4E7" }}>
      <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>Bu aracı sitene ekle</p>
      <p className="text-xs mb-3" style={{ color: "#4B5563" }}>
        Blogun, eğitim siten ya da kurum sayfan için: aşağıdaki kodu sayfana yapıştır, araç ziyaretçilerin için orada çalışsın.
      </p>
      <textarea readOnly value={code} rows={4} aria-label="Gömme kodu" className="w-full text-xs font-mono p-3 rounded-xl" style={{ border: "1px solid #D4D4D8", color: "#374151", background: "#FFFFFF" }} onFocus={(e) => e.target.select()} />
      <button type="button" onClick={copy} className="mt-2 text-xs font-bold px-4 py-2 rounded-full text-white" style={{ background: "#0F1115" }}>
        {copied ? "Kopyalandı" : "Kodu kopyala"}
      </button>
    </div>
  );
}
