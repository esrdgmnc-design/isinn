import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { SEO_CITIES, SEO_CATEGORIES, matchesCitySlug, categorySeoName } from "../../../lib/seoTaxonomy";
import { formatPrice, getProviderName, getCityIntro, isIndexableListing, MIN_CITY_LISTINGS, MIN_COMBO_LISTINGS } from "../../../lib/seoFormat";
import { getCityFaq } from "../../../lib/categoryFaq";

// SEO için eklendi — bkz. app/kategori/[slug]/page.js'teki aynı gerekçe.
// services.city serbest metin olduğu için (bkz. lib/seoTaxonomy.js) şehir
// eşleşmesi sorgudan sonra JS tarafında yapılıyor; veri seti (aktif vitrin
// sayısı) küçük olduğu için bu maliyetsiz.
const BASE_URL = "https://www.isinn.com.tr";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200";

function findCity(slug) {
  return SEO_CITIES.find((c) => c.slug === slug) || null;
}

async function getServices(citySlug) {
  const { data: services } = await supabase
    .from("services")
    .select("*, profiles(*), categories(name, slug)")
    .eq("active", true)
    .eq("is_remote", false)
    .order("updated_at", { ascending: false });
  return (services || []).filter((row) => matchesCitySlug(row.city, citySlug));
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const meta = findCity(params.city);
  if (!meta) return { title: "Şehir bulunamadı — İşinn" };
  const services = await getServices(params.city);
  const url = `${BASE_URL}/sehir/${params.city}`;
  const title = `${meta.name} Hizmet Sağlayıcıları — İşinn`;
  const description = `${meta.name} bölgesindeki hizmet sağlayıcılarını (temizlik, tadilat, özel ders ve daha fazlası) keşfet, doğrudan ulaş — komisyonsuz, İşinn'de.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: services.filter(isIndexableListing).length < MIN_CITY_LISTINGS ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url, siteName: "İşinn", locale: "tr_TR", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CityPage({ params }) {
  const meta = findCity(params.city);
  if (!meta) notFound();
  const services = (await getServices(params.city)).filter(isIndexableListing);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${meta.name} — İşinn`,
    itemListElement: services.filter(isIndexableListing).map((row, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/vitrin/${row.id}`,
      name: row.title,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "İşinn", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: meta.name, item: `${BASE_URL}/sehir/${params.city}` },
    ],
  };

  const cityFaq = services.length > 0 ? getCityFaq(meta.name) : null;
  const faqJsonLd = cityFaq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cityFaq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {services.some(isIndexableListing) && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {faqJsonLd && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <div className="max-w-5xl mx-auto px-5 py-10">
        <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>
        <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-2" style={{ color: "#0F1115" }}>
          {meta.name} Hizmet Sağlayıcıları
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
          {getCityIntro(meta.name)}
        </p>

        {services.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ border: "1px solid #F0F0F0" }}>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{meta.name} bölgesinde henüz aktif bir vitrin yok — ilk sen ol.</p>
            <Link href="/?view=createListing" className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white" style={{ background: "#2563EB" }}>
              Hizmet Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((row) => {
              const provider = getProviderName(row);
              const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
              return (
                <div key={row.id} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
                  <Link href={`/vitrin/${row.id}`} className="block relative w-full h-40">
                    <Image src={img} alt={row.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </Link>
                  <div className="p-4">
                    {row.categories?.slug && (
                      <Link href={`/kategori/${row.categories.slug}`} className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: "#2563EB" }}>
                        {row.categories.name}
                      </Link>
                    )}
                    <Link href={`/vitrin/${row.id}`} className="block">
                      <p className="text-sm font-bold mb-1 line-clamp-2" style={{ color: "#0F1115" }}>{row.title}</p>
                      <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{provider}</p>
                      <p className="text-sm font-black" style={{ color: "#0F1115" }}>{formatPrice(row.price, row.price_type)}</p>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(() => {
          // Yalnızca indekslenecek kadar dolu kategori+şehir sayfalarına bağlanır.
          const real = services.filter(isIndexableListing);
          const cats = SEO_CATEGORIES.filter((c) => c.slug !== "diger").map((c) => ({ ...c, n: real.filter((r) => r.categories?.slug === c.slug).length })).filter((c) => c.n >= MIN_COMBO_LISTINGS);
          if (cats.length === 0) return null;
          return (
            <div className="mt-10 pt-8 border-t" style={{ borderColor: "#F0F0F0" }}>
              <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>{meta.name} için kategoriler</h2>
              <div className="flex flex-wrap gap-2">
                {cats.map((c) => (
                  <Link key={c.slug} href={`/kategori/${c.slug}/${params.city}`} className="text-sm font-bold px-4 py-2 rounded-full" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{categorySeoName(c)}</Link>
                ))}
              </div>
            </div>
          );
        })()}

        {cityFaq && (
          <div className="mt-10 pt-8 border-t" style={{ borderColor: "#F0F0F0" }}>
            <h2 className="font-sans text-lg font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
            <div className="space-y-4">
              {cityFaq.map((f, i) => (
                <div key={i}>
                  <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
