import Link from "next/link";

// Google'dan gelen ziyaretçi aradığını bulamazsa kaybolmasın (2026-10-31): kategori sayfalarından talep formuna giriş.
// Açılan talep, günlük cron ile aynı kategorideki uygun vitrin sahiplerine e-postayla duyurulur (lib/demandFollowups.js).
export default function TalepCta({ categoryLabel }) {
  return (
    <div className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between" style={{ background: "#F5F1EA" }}>
      <div>
        <p className="text-base font-black mb-1" style={{ color: "#0F1115" }}>Aradığını tam bulamadın mı?</p>
        <p className="text-sm" style={{ color: "#4B5563" }}>
          İhtiyacını kısaca yaz; {categoryLabel ? `${categoryLabel} alanındaki` : "bu alandaki"} hizmet verenlere haber verelim.
        </p>
      </div>
      <Link href="/?view=post" className="shrink-0 inline-block text-sm font-bold px-6 py-3 rounded-full text-white text-center" style={{ background: "#2563EB" }}>
        Talep oluştur
      </Link>
    </div>
  );
}
