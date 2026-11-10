import Link from "next/link";
import { PRICE_GUIDES } from "../../lib/priceGuides";
import { findRehberPost, rehberMeta } from "../../lib/rehberContent";
import { TOOLS } from "../../lib/tools";
import { socialMeta } from "../../lib/seoMeta";
import { jsonLdString } from "../../lib/jsonLd";
import SeoFooter from "../../components/SeoFooter";

// "Hizmet Fiyatları" merkez sayfası (2026-11-10). Yeni içerik yazmaz; mevcut fiyat rehberlerinin kısa cevaplarını tek,
// KALICI bir adreste toplar. Adres yıl içermez: her yıl aynı sayfa güncellenir, basından ve sitelerden alınan
// bağlantılar birikir (yıllık veri haberi bu sayfayı kaynak gösterir).
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/hizmet-fiyatlari`;
const YEAR = 2026;
const TITLE = `Hizmet Fiyatları ${YEAR}: Özel Ders, Mali Müşavir, Web Sitesi ve Daha Fazlası`;
const DESCRIPTION = `${YEAR} hizmet fiyatları tek sayfada: özel ders, mali müşavir, çeviri, web sitesi, logo, ev temizliği, boya badana ve diğer hizmetler için kaynaklı aralıklar.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
};

export const revalidate = 86400;

function rows() {
  return PRICE_GUIDES.map((g) => {
    const post = findRehberPost(g.slug);
    if (!post) return null;
    const meta = rehberMeta(post);
    return { slug: g.slug, label: g.label, title: post.title, answer: meta.shortAnswer || post.description, updated: meta.updated };
  }).filter(Boolean);
}

export default function HizmetFiyatlariPage() {
  const list = rows();
  const lastUpdated = list.map((r) => r.updated).filter(Boolean).sort().pop();
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: "tr",
    ...(lastUpdated ? { dateModified: lastUpdated } : {}),
    publisher: { "@type": "Organization", name: "İşinn", url: BASE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: list.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.title, url: `${BASE_URL}/rehber/${r.slug}` })),
    },
  };
  const fmt = (d) => { try { return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; } };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(ld) }} />
      <div className="max-w-3xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-4" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Hizmet fiyatları
        </nav>
        <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>Hizmet fiyatları {YEAR}</h1>
        <p className="text-base mb-2" style={{ color: "#374151" }}>
          Bir hizmeti yaptırmadan ya da kendi fiyatını belirlemeden önce: her başlıkta yayımlanmış kaynaklara dayanan aralıklar ve fiyatı neyin değiştirdiği. Ayrıntı ve kaynaklar ilgili rehberde.
        </p>
        {lastUpdated && <p className="text-xs mb-8" style={{ color: "#6B7280" }}>Son güncelleme: {fmt(lastUpdated)}</p>}

        <div className="grid gap-3">
          {list.map((r) => (
            <Link key={r.slug} href={`/rehber/${r.slug}`} className="block rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E4E4E7" }}>
              <h2 className="text-base font-black mb-1" style={{ color: "#0F1115" }}>{r.label}</h2>
              <p className="text-sm" style={{ color: "#4B5563" }}>{r.answer}</p>
              <span className="inline-block text-xs font-bold mt-2" style={{ color: "#2563EB" }}>Rehberin tamamı →</span>
            </Link>
          ))}
        </div>

        <h2 className="font-sans text-xl font-black mt-10 mb-3" style={{ color: "#0F1115" }}>Hesaplama araçları</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TOOLS.map((t) => (
            <Link key={t.id} href={t.path} className="block rounded-2xl p-4" style={{ background: "#F5F7FF", border: "1px solid #DCE4FF" }}>
              <span className="block text-sm font-bold" style={{ color: "#0F1115" }}>{t.name}</span>
              <span className="block text-xs mt-1" style={{ color: "#4B5563" }}>{t.teaser}</span>
            </Link>
          ))}
        </div>

        <p className="text-xs mt-8" style={{ color: "#6B7280" }}>
          Rakamlar bağlantısı verilen kaynaklarda yayımlanan aralıklardır; İşinn'in belirlediği ya da garanti ettiği fiyatlar değildir. Bu sayfadaki verileri kaynak göstererek kullanabilirsiniz: "Kaynak: İşinn Hizmet Fiyatları ({BASE_URL.replace("https://", "")}/hizmet-fiyatlari)".
        </p>
      </div>
      <SeoFooter />
    </>
  );
}
