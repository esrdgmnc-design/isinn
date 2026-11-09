"use client";
// Serbest meslek makbuzu brüt/net hesaplayıcı (2026-11-09). Yalnızca tarayıcıda hesaplar; hiçbir veri gönderilmez.
// Oranlar: gelir vergisi stopajı %20 (GVK 94/2-b, makbuzu alan vergi kesmekle yükümlüyse), KDV genel oran %20.
import { useMemo, useState } from "react";

const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "–");

export default function SmmCalculator() {
  const [mode, setMode] = useState("brut"); // brut | net
  const [amount, setAmount] = useState("10000");
  const [stopaj, setStopaj] = useState(true);
  const [kdvRate, setKdvRate] = useState(20);

  const r = useMemo(() => {
    const v = parseFloat(String(amount).replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(v) || v <= 0) return null;
    const s = stopaj ? 0.2 : 0;
    const k = kdvRate / 100;
    const brut = mode === "brut" ? v : v / (1 - s + k);
    const stopajTl = brut * s;
    const kdv = brut * k;
    const tahsil = brut - stopajTl + kdv;
    return { brut, stopajTl, kdv, tahsil, netKdvHaric: brut - stopajTl };
  }, [mode, amount, stopaj, kdvRate]);

  const btn = (on) => ({ background: on ? "#0F1115" : "#FFFFFF", color: on ? "#FFFFFF" : "#374151", border: "1px solid #E4E4E7" });

  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: "#FFFFFF", border: "1px solid #E4E4E7" }}>
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setMode("brut")} className="flex-1 text-sm font-bold px-3 py-2 rounded-xl" style={btn(mode === "brut")}>Brütten nete</button>
        <button type="button" onClick={() => setMode("net")} className="flex-1 text-sm font-bold px-3 py-2 rounded-xl" style={btn(mode === "net")}>Netten brüte</button>
      </div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: "#4B5563" }} htmlFor="smm-tutar">
        {mode === "brut" ? "Brüt ücret (TL)" : "Hesabına geçecek toplam tutar (KDV dahil, TL)"}
      </label>
      <input id="smm-tutar" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full text-lg font-bold px-3 py-2 rounded-xl mb-4" style={{ border: "1px solid #D4D4D8" }} />
      <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm" style={{ color: "#374151" }}>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={stopaj} onChange={(e) => setStopaj(e.target.checked)} />
          Müşteri şirket ya da kurum (%20 stopaj kesilir)
        </label>
        <label className="flex items-center gap-2">
          KDV oranı
          <select value={kdvRate} onChange={(e) => setKdvRate(Number(e.target.value))} className="px-2 py-1 rounded-lg" style={{ border: "1px solid #D4D4D8" }}>
            <option value={20}>%20</option>
            <option value={10}>%10</option>
            <option value={1}>%1</option>
            <option value={0}>KDV yok / istisna</option>
          </select>
        </label>
      </div>
      {r ? (
        <dl className="grid grid-cols-2 gap-y-2 text-sm" style={{ color: "#374151" }}>
          <dt>Brüt ücret</dt><dd className="text-right font-bold">{fmt(r.brut)} TL</dd>
          <dt>Gelir vergisi stopajı</dt><dd className="text-right">− {fmt(r.stopajTl)} TL</dd>
          <dt>KDV (%{kdvRate})</dt><dd className="text-right">+ {fmt(r.kdv)} TL</dd>
          <dt className="font-bold" style={{ color: "#0F1115" }}>Tahsil edilecek tutar</dt><dd className="text-right font-black" style={{ color: "#0F1115" }}>{fmt(r.tahsil)} TL</dd>
          <dt>KDV düşülünce sana kalan</dt><dd className="text-right">{fmt(r.netKdvHaric)} TL</dd>
        </dl>
      ) : (
        <p className="text-sm" style={{ color: "#B91C1C" }}>Geçerli bir tutar yaz.</p>
      )}
      <p className="text-xs mt-4" style={{ color: "#6B7280" }}>
        KDV'yi müşteriden tahsil eder ve beyanname ile devlete ödersin. Stopaj, müşterinin senin adına vergi dairesine yatırdığı peşin gelir vergisidir; yıllık beyannamende mahsup edilir. Hesap tarayıcında yapılır, hiçbir bilgi kaydedilmez.
      </p>
    </div>
  );
}
