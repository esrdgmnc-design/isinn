import CustomerLandingClient from "../../components/CustomerLandingClient";
import { getCustomerAudience, CUSTOMER_STEPS, CUSTOMER_FAQ } from "../../lib/customerLandingContent";

// Müşteri (talep tarafı) kazanım reklamının iniş sayfası. Temizlik ve nakliye
// için: İstanbul'da bu iki meslekte asıl kıtlık sağlayıcı değil, güvenilir bir
// sağlayıcı ARAYAN müşteri tarafındadır — bu yüzden reklam sağlayıcıya değil
// (bkz. app/hizmet-ver) doğrudan hizmet arayan müşteriye gösterilir.
// ?meslek=temizlik|nakliye ile başlık değişir. Rakip adı hiç geçmez.

export function generateMetadata({ searchParams }) {
  const audience = getCustomerAudience(searchParams?.meslek);
  return {
    title: `${audience.title} — İşinn`,
    description: audience.headline,
    robots: { index: false, follow: true },
  };
}

export default function HizmetAlPage({ searchParams }) {
  const audience = getCustomerAudience(searchParams?.meslek);

  return (
    <div className="max-w-md mx-auto px-5 py-14 text-center">
      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#2563EB" }}>{audience.title}</p>
      <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>{audience.headline}</h1>
      <p className="text-sm mb-8" style={{ color: "#4B5563" }}>{audience.sub}</p>

      <div className="rounded-2xl border p-5 mb-8 text-left" style={{ borderColor: "#F0F0F0" }}>
        <div className="space-y-4">
          {CUSTOMER_STEPS.map((s) => (
            <div key={s.n} className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "#2563EB" }}
              >
                {s.n}
              </span>
              <div>
                <p className="text-sm font-bold" style={{ color: "#0F1115" }}>{s.t}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CustomerLandingClient audienceSlug={searchParams?.meslek || "genel"} />

      <div className="mt-12 text-left">
        <h2 className="font-sans text-lg font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
        <div className="space-y-4">
          {CUSTOMER_FAQ.map((f, i) => (
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
