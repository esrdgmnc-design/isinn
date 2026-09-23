import ProviderLandingClient from "../../components/ProviderLandingClient";
import { getProviderAudience, PROVIDER_FAQ } from "../../lib/providerLandingContent";

// Ücretli sosyal medya reklamlarının (Meta/TikTok, sağlayıcı kazanımı) yönlendirdiği
// iniş sayfası. Soğuk trafiğe ana uygulamayı değil, tek bir net teklifi gösterir.
// ?meslek=temizlik|nakliye|nailart ile reklam setine göre başlık değişir.
// Rakip adı bilerek hiç geçmiyor (ücretli reklamda karşılaştırmalı reklam riski
// organik paylaşımdan yüksek, bkz. TTK m.55 / Ticari Reklam Yönetmeliği).

export function generateMetadata({ searchParams }) {
  const audience = getProviderAudience(searchParams?.meslek);
  return {
    title: `${audience.title} — İşinn`,
    description: audience.headline,
    robots: { index: false, follow: true }, // reklam iniş sayfası, organik indekste rekabet etmesin
  };
}

export default function HizmetVerPage({ searchParams }) {
  const audience = getProviderAudience(searchParams?.meslek);

  return (
    <div className="max-w-md mx-auto px-5 py-14 text-center">
      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#2563EB" }}>{audience.title}</p>
      <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>{audience.headline}</h1>
      <p className="text-sm mb-4" style={{ color: "#4B5563" }}>{audience.sub}</p>
      <span
        className="inline-block text-xs font-bold px-4 py-2 rounded-full text-white mb-8"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
      >
        İlk 3 Ay Ücretsiz
      </span>

      <div className="rounded-2xl border p-5 mb-8 text-left space-y-3" style={{ borderColor: "#F0F0F0" }}>
        {[
          "İlk 3 ay tamamen ücretsiz — kart bilgisi talep edilmez",
          "Komisyon uygulanmaz — kazancınızın tamamı size kalır",
          "Teklif ya da mesaj başına ücret alınmaz",
          "Vitrininiz dışında, müşterilerin paylaştığı açık iş ilanlarına da teklif verebilirsiniz",
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#2563EB" }} />
            <p className="text-sm" style={{ color: "#1B2B24" }}>{t}</p>
          </div>
        ))}
      </div>

      <ProviderLandingClient audienceSlug={searchParams?.meslek || "genel"} />

      <div className="mt-12 text-left">
        <h2 className="font-sans text-lg font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
        <div className="space-y-4">
          {PROVIDER_FAQ.map((f, i) => (
            <div key={i}>
              <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</p>
              <p className="text-sm" style={{ color: "#6B7280" }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
