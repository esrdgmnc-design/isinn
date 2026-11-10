import Link from "next/link";

// Kategori, ders ve rehber sayfalarında ilgili ücretsiz hesaplama aracına giden kart (2026-11-10).
// Araçlar önceden yalnızca alt bilgiden erişilebiliyordu; bu kart aracı ilgili ziyaretçinin önüne koyar.
export default function ToolCallout({ tools }) {
  if (!tools || tools.length === 0) return null;
  return (
    <div className="mt-8 grid gap-3">
      {tools.map((t) => (
        <Link key={t.id} href={t.path} className="rounded-2xl p-4 flex items-center justify-between gap-4" style={{ background: "#F5F7FF", border: "1px solid #DCE4FF" }}>
          <span>
            <span className="block text-sm font-bold" style={{ color: "#0F1115" }}>{t.name}</span>
            <span className="block text-xs mt-1" style={{ color: "#4B5563" }}>{t.teaser}</span>
          </span>
          <span className="shrink-0 text-xs font-bold px-3 py-2 rounded-full text-white" style={{ background: "#2563EB" }}>Hesapla</span>
        </Link>
      ))}
    </div>
  );
}
