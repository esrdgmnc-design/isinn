import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { formatPrice, getProviderName, isIndexableListing } from "../../../lib/seoFormat";
import { jsonLdString } from "../../../lib/jsonLd";
import { socialMeta, clamp } from "../../../lib/seoMeta";
import { findRehberPost } from "../../../lib/rehberContent";
import { orderByResponsiveness, getProviderLastSent } from "../../../lib/providerResponsiveness";
import { DERS_SAYFALARI, MIN_DERS_VITRIN, findDersSayfasi, dersSayfasiVitrinleri } from "../../../lib/dersKonulari";
import SeoFooter from "../../../components/SeoFooter";
import TalepCta from "../../../components/TalepCta";

// Ders bazlı özel ders sayfaları (2026-10-31): öğretmen kategorisi matematik, İngilizce, LGS ve koçluğu tek
// listede gösteriyordu; "online ingilizce özel ders" gibi aramaların karşılığı yoktu. Sayfa yalnızca gerçek
// vitrinlerden oluşur ve en az MIN_DERS_VITRIN vitrin yoksa dizine girmez (boş/köprü sayfa üretmemek için).
const BASE_URL = "https://www.isinn.com.tr";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200";

async function getVitrinler(sayfa) {
  const { data: category } = await supabase.from("categories").select("id").eq("slug", "ogretmen").maybeSingle();
  if (!category) return [];
  const { data } = await supabase.from("services").select("*, profiles(*)").eq("category_id", category.id).eq("active", true).order("updated_at", { ascending: false });
  const rows = dersSayfasiVitrinleri(sayfa, (data || []).filter(isIndexableListing));
  return orderByResponsiveness(rows, await getProviderLastSent(rows.map((r) => r.provider_id)));
}

export const revalidate = 3600;

export function generateStaticParams() {
  return DERS_SAYFALARI.map((s) => ({ ders: s.slug }));
}

export async function generateMetadata({ params }) {
  const sayfa = findDersSayfasi(params.ders);
  if (!sayfa) return { title: "Sayfa bulunamadı — İşinn" };
  const rows = await getVitrinler(sayfa);
  const url = `${BASE_URL}/ozel-ders/${sayfa.slug}`;
  const title = `${sayfa.h1} — İşinn`;
  const description = clamp(sayfa.intro, 160);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: rows.length < MIN_DERS_VITRIN ? { index: false, follow: true } : undefined,
    ...socialMeta({ title, description, url }),
  };
}

export default async function DersSayfasi({ params }) {
  const sayfa = findDersSayfasi(params.ders);
  if (!sayfa) notFound();
  const rows = await getVitrinler(sayfa);
  const rehberler = sayfa.rehberler.map(findRehberPost).filter(Boolean);
  const digerDersler = DERS_SAYFALARI.filter((s) => s.slug !== sayfa.slug);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${sayfa.h1} — İşinn`,
    itemListElement: rows.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${BASE_URL}/vitrin/${r.id}`, name: r.title })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "İşinn", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Öğretmen", item: `${BASE_URL}/kategori/ogretmen` },
      { "@type": "ListItem", position: 3, name: sayfa.name, item: `${BASE_URL}/ozel-ders/${sayfa.slug}` },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sayfa.sss.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }} />
      {rows.length > 0 && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(listJsonLd) }} />
      )}
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }} />
      <div className="max-w-5xl mx-auto px-5 py-10">
        <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> · <Link href="/kategori/ogretmen" style={{ color: "#2563EB" }}>Öğretmen</Link> · {sayfa.name}
        </p>
        <h1 className="font-sans text-2xl md:text-3xl font-black mt-3 mb-2" style={{ color: "#0F1115" }}>{sayfa.h1}</h1>
        <p className="text-sm mb-8 max-w-3xl" style={{ color: "#6B7280" }}>{sayfa.intro}</p>

        {rows.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ border: "1px solid #E4E4E7" }}>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Bu derste şu an aktif bir vitrin yok — ders veriyorsan ilk sen ol.</p>
            <Link href="/?view=createListing" className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white" style={{ background: "#2563EB" }}>Vitrin aç</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rows.map((row, i) => {
              const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
              const yer = row.is_remote ? (row.city ? `${row.city} · online` : "Online") : (row.city || "Türkiye");
              return (
                <Link key={row.id} href={`/vitrin/${row.id}`} className="rounded-2xl overflow-hidden block" style={{ border: "1px solid #E4E4E7" }}>
                  <div className="relative w-full h-40">
                    <Image src={img} alt={row.title} fill priority={i < 2} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold mb-1 line-clamp-2" style={{ color: "#0F1115" }}>{row.title}</p>
                    <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{getProviderName(row)} · {yer}</p>
                    {row.description && <p className="text-xs mb-2 line-clamp-3" style={{ color: "#6B7280" }}>{clamp(String(row.description).split(/\n\s*\n/)[0], 130)}</p>}
                    <p className="text-sm font-black" style={{ color: "#0F1115" }}>{formatPrice(row.price, row.price_type)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <TalepCta categoryLabel={sayfa.name} />

        <div className="mt-10 pt-8 border-t max-w-2xl" style={{ borderColor: "#E4E4E7" }}>
          <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>Öğretmen seçerken</h2>
          <ul className="space-y-2 list-disc pl-5">
            {sayfa.secim.map((s, i) => <li key={i} className="text-sm leading-relaxed" style={{ color: "#374151" }}>{s}</li>)}
          </ul>
        </div>

        <div className="mt-10 pt-8 border-t" style={{ borderColor: "#E4E4E7" }}>
          <h2 className="font-sans text-lg font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
          <div className="space-y-4 max-w-3xl">
            {sayfa.sss.map((f, i) => (
              <div key={i}>
                <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</p>
                <p className="text-sm" style={{ color: "#6B7280" }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {rehberler.length > 0 && (
          <div className="mt-10 pt-8 border-t" style={{ borderColor: "#E4E4E7" }}>
            <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>İlgili rehberler</h2>
            <ul className="space-y-2">
              {rehberler.map((g) => <li key={g.slug}><Link href={`/rehber/${g.slug}`} className="text-sm font-bold" style={{ color: "#2563EB" }}>{g.title}</Link></li>)}
            </ul>
          </div>
        )}

        <div className="mt-10 pt-8 border-t" style={{ borderColor: "#E4E4E7" }}>
          <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>Diğer dersler</h2>
          <div className="flex flex-wrap gap-2">
            {digerDersler.map((s) => (
              <Link key={s.slug} href={`/ozel-ders/${s.slug}`} className="text-sm font-bold px-4 py-2 rounded-full" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{s.name}</Link>
            ))}
            <Link href="/kategori/ogretmen" className="text-sm font-bold px-4 py-2 rounded-full" style={{ background: "#F4F4F5", color: "#0F1115" }}>Tüm öğretmenler</Link>
          </div>
        </div>
      </div>
      <SeoFooter />
    </>
  );
}
