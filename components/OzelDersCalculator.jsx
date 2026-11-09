"use client";
// Özel ders ücreti hesaplayıcı (2026-11-09). Aralıklar yalnızca İşinn fiyat rehberlerinde zaten kaynak gösterilen,
// pazaryeri olmayan yayınlardan alınır; İşinn fiyat belirlemez. Hesap tarayıcıda yapılır, veri gönderilmez.
import { useMemo, useState } from "react";

const ELEMAN = { label: "eleman.net, Eylül 2025", href: "https://www.eleman.net/is-rehberi/maaslar-ve-ucretler/ozel-ders-ucretleri-h14676" };
const MESLEKMAAS_ING = { label: "meslekmaas.com, Kasım 2025", href: "https://meslekmaas.com/ingilizce-ogretmeni-maaslari/" };
const MESLEKMAAS_MUZIK = { label: "meslekmaas.com, Kasım 2025", href: "https://meslekmaas.com/muzik-ogretmeni-maaslari/" };

export const DERSLER = [
  { id: "ilkokul", ad: "İlkokul dersleri", min: 650, max: 1000, kaynak: ELEMAN },
  { id: "lise-mat", ad: "Lise matematik", min: 750, max: 1500, kaynak: ELEMAN },
  { id: "lgs-yks", ad: "LGS / YKS hazırlık", min: 1000, max: 2000, arti: true, kaynak: ELEMAN },
  { id: "ingilizce", ad: "Genel İngilizce", min: 1500, max: 2000, kaynak: ELEMAN },
  { id: "sinav-ing", ad: "YDS / IELTS / TOEFL hazırlık", min: 1500, max: 2500, kaynak: MESLEKMAAS_ING },
  { id: "piyano", ad: "Piyano / keman (deneyimli öğretmen)", min: 1200, max: 2000, kaynak: MESLEKMAAS_MUZIK },
  { id: "gitar", ad: "Gitar / şan / bateri", min: 800, max: 1500, kaynak: MESLEKMAAS_MUZIK },
];

const tl = (n) => n.toLocaleString("tr-TR") + " TL";

export default function OzelDersCalculator() {
  const [dersId, setDersId] = useState("lgs-yks");
  const [haftalik, setHaftalik] = useState(2);
  const d = DERSLER.find((x) => x.id === dersId);
  const aylik = useMemo(() => ({ min: d.min * haftalik * 4, max: d.max * haftalik * 4 }), [d, haftalik]);

  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: "#FFFFFF", border: "1px solid #E4E4E7" }}>
      <label className="text-xs font-medium block mb-1.5" style={{ color: "#4B5563" }} htmlFor="od-ders">Ders</label>
      <select id="od-ders" value={dersId} onChange={(e) => setDersId(e.target.value)} className="w-full px-3 py-2 rounded-xl mb-4 text-sm" style={{ border: "1px solid #D4D4D8" }}>
        {DERSLER.map((x) => <option key={x.id} value={x.id}>{x.ad}</option>)}
      </select>
      <label className="text-xs font-medium block mb-1.5" style={{ color: "#4B5563" }} htmlFor="od-hafta">Haftada kaç ders?</label>
      <select id="od-hafta" value={haftalik} onChange={(e) => setHaftalik(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl mb-5 text-sm" style={{ border: "1px solid #D4D4D8" }}>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ders</option>)}
      </select>
      <dl className="grid grid-cols-2 gap-y-2 text-sm" style={{ color: "#374151" }}>
        <dt>Ders başı (saatlik)</dt><dd className="text-right font-bold">{tl(d.min)} – {tl(d.max)}{d.arti ? " ve üzeri" : ""}</dd>
        <dt className="font-bold" style={{ color: "#0F1115" }}>Aylık tahmini (4 hafta)</dt><dd className="text-right font-black" style={{ color: "#0F1115" }}>{tl(aylik.min)} – {tl(aylik.max)}{d.arti ? "+" : ""}</dd>
      </dl>
      <p className="text-xs mt-4" style={{ color: "#6B7280" }}>
        Kaynak: <a href={d.kaynak.href} rel="nofollow noopener" target="_blank" style={{ color: "#2563EB" }}>{d.kaynak.label}</a>. Rakamlar yayımlanmış aralıklardır; öğretmenin deneyimi, şehir ve dersin yüz yüze ya da online olması fiyatı değiştirir. Kesin ücreti öğretmen belirler.
      </p>
    </div>
  );
}
