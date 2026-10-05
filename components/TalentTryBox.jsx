"use client";

import { useState } from "react";

// /yetenegini-farket sayfasında (sunucu bileşeni) "tıklamadan dene": ilk cümle burada yazılır,
// uygulamadaki Yeteneğini Farket ekranı dolu açılır (ana sayfadaki kutuyla aynı sessionStorage anahtarı).
const TALENT_PREFILL_KEY = "isinn_talent_prefill";

export default function TalentTryBox() {
  const [text, setText] = useState("");
  const go = (e) => {
    e.preventDefault();
    try { if (text.trim()) sessionStorage.setItem(TALENT_PREFILL_KEY, text.trim().slice(0, 200)); } catch {}
    window.location.href = "/?view=talentDiscovery";
  };
  return (
    <form onSubmit={go} className="flex flex-col sm:flex-row gap-2.5 mb-10">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={200}
        placeholder="Örn. telefonla fotoğraf çekmeyi ve video düzenlemeyi seviyorum"
        aria-label="Yapmayı sevdiğin şeyi yaz"
        className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
        style={{ border: "1px solid #D1D5DB", background: "#FFFFFF", color: "#0F1115" }}
      />
      <button type="submit" className="shrink-0 text-sm font-bold px-6 py-3 rounded-full text-white" style={{ background: "#2563EB" }}>
        İlham Al
      </button>
    </form>
  );
}
