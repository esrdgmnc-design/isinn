import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { SEO_CATEGORIES, SEO_CITIES, matchesCitySlug, categorySeoName } from "../../../lib/seoTaxonomy";
import { formatPrice, getProviderName, getCategoryIntro, isIndexableListing, MIN_COMBO_LISTINGS, MIN_CATEGORY_LISTINGS } from "../../../lib/seoFormat";
import { getCategoryFaq } from "../../../lib/categoryFaq";
import { jsonLdString } from "../../../lib/jsonLd";
import { socialMeta, clamp } from "../../../lib/seoMeta";
import { getCategoryGuides } from "../../../lib/categoryGuides";
import SeoFooter from "../../../components/SeoFooter";
import { getCategoryLongIntro } from "../../../lib/categoryIntros";
import { orderByResponsiveness, getProviderLastSent } from "../../../lib/providerResponsiveness";

// SEO için eklendi: kategoriler eskiden sadece ana sayfadaki bir istemci
// tarafı filtreydi, kendi URL'leri yoktu — Google "istanbul temizlikçi" gibi
// aramalarda gösterecek tek bir sayfa bulamıyordu (bkz. SEO stratejisi
// dokümanı, madde 3). Bu sayfa her kategori için gerçek, sunucu tarafında
// render edilen, o kategorideki aktif vitrinleri listeleyen bir giriş noktası
// veriyor. Kategori+şehir kombinasyonu için app/kategori/[slug]/[city]/page.js.
const BASE_URL = "https://www.isinn.com.tr";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200";

function findCategory(slug) {
  return SEO_CATEGORIES.find((c) => c.slug === slug) || null;
}

async function getServices(slug) {
  const { data: category } = await supabase.from("categories").select("id, name, slug").eq("slug", slug).maybeSingle();
  if (!category) return { category: null, services: [] };
  const { data: services } = await supabase
    .from("services")
    .select("*, profiles(*)")
    .eq("category_id", category.id)
    .eq("active", true)
    .order("updated_at", { ascending: false });
  const rows = services || [];
  return { category, services: orderByResponsiveness(rows, await getProviderLastSent(rows.map((r) => r.provider_id))) };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return SEO_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const meta = findCategory(params.slug);
  if (!meta) return { title: "Kategori bulunamadı — İşinn" };
  const { services } = await getServices(params.slug);
  const url = `${BASE_URL}/kategori/${params.slug}`;
  const title = `${meta.seoTitle || `${categorySeoName(meta)} Hizmeti Bul`} — İşinn`;
  const realCount = services.filter(isIndexableListing).length;
  const intro = getCategoryIntro(meta.name, params.slug);
  const description = realCount > 0 ? `${intro} İşinn'de şu an ${realCount} aktif vitrin var.`.slice(0, 200) : intro;
  return {
    title,
    description,
    alternates: { canonical: url },
    // Az sayıda (veya sıfır) sonuç olan sayfalar ince içerik sayılıp
    // cezalandırılmasın diye indekslemeden çıkarılıyor — vitrin sayısı
    // arttıkça otomatik olarak indekslenebilir hâle gelir.
    // "Diğer" bir yakalama kutusu (arama niyeti yok); gerçek (demo/ince olmayan) vitrini
    // olmayan sayfalar da indekslenmez.
    robots: params.slug === "diger" || services.filter(isIndexableListing).length < MIN_CATEGORY_LISTINGS ? { index: false, follow: true } : undefined,
    ...socialMeta({ title, description, url }),
  };
}

export default async function CategoryPage({ params }) {
  const meta = findCategory(params.slug);
  if (!meta) notFound();
  const { services: allServices } = await getServices(params.slug);
  const services = allServices.filter(isIndexableListing);

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
      { "@type": "ListItem", position: 2, name: meta.name, item: `${BASE_URL}/kategori/${params.slug}` },
    ],
  };
  const categoryFaq = services.length > 0 ? getCategoryFaq(meta.name) : null;
  const guides = getCategoryGuides(params.slug);
  const longIntro = getCategoryLongIntro(params.slug);

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }} />
      {services.some(isIndexableListing) && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      )}
      <div className="max-w-5xl mx-auto px-5 py-10">
        <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>
        <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-2" style={{ color: "#0F1115" }}>
          {meta.seoTitle || `${categorySeoName(meta)} Hizmeti Bul`}
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
          {getCategoryIntro(meta.name, params.slug)}
        </p>

        {services.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ border: "1px solid #E4E4E7" }}>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Bu kategoride henüz aktif bir vitrin yok — ilk sen ol.</p>
            <Link href="/?view=createListing" className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white" style={{ background: "#2563EB" }}>
              Hizmet Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((row, cardIdx) => {
              const provider = getProviderName(row);
              const city = row.is_remote ? "Uzaktan" : (row.city || "Türkiye");
              const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
              return (
                <Link key={row.id} href={`/vitrin/${row.id}`} className="rounded-2xl overflow-hidden block" style={{ border: "1px solid #E4E4E7" }}>
                  <div className="relative w-full h-40">
                    <Image src={img} alt={row.title} fill priority={cardIdx < 2} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold mb-1 line-clamp-2" style={{ color: "#0F1115" }}>{row.title}</p>
                    <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{provider} · {city}</p>
                    {row.description && (
                      <p className="text-xs mb-2 line-clamp-3" style={{ color: "#6B7280" }}>{clamp(String(row.description).split(/\n\s*\n/)[0], 130)}</p>
                    )}
                    <p className="text-sm font-black" style={{ color: "#0F1115" }}>{formatPrice(row.price, row.price_type)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {(() => {
          // Yalnızca indekslenecek kadar dolu kategori+şehir sayfalarına bağlanır.
          const real = services.filter(isIndexableListing).filter((r) => !r.is_remote);
          const cities = SEO_CITIES.map((c) => ({ ...c, n: real.filter((r) => matchesCitySlug(r.city, c.slug)).length })).filter((c) => c.n >= MIN_COMBO_LISTINGS);
          if (cities.length === 0) return null;
          return (
            <div className="mt-10 pt-8 border-t" style={{ borderColor: "#E4E4E7" }}>
              <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>Şehre göre {categorySeoName(meta).toLocaleLowerCase("tr-TR")}</h2>
              <div className="flex flex-wrap gap-2">
                {cities.map((c) => (
                  <Link key={c.slug} href={`/kategori/${params.slug}/${c.slug}`} className="text-sm font-bold px-4 py-2 rounded-full" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{c.name}</Link>
                ))}
              </div>
            </div>
          );
        })()}

        {longIntro && (
          <div className="mt-10 pt-8 border-t max-w-2xl" style={{ borderColor: "#E4E4E7" }}>
            <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>{longIntro.heading}</h2>
            {longIntro.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>{p}</p>
            ))}
          </div>
        )}

        {guides.length > 0 && (
          <div className="mt-10 pt-8 border-t" style={{ borderColor: "#E4E4E7" }}>
            <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>İlgili rehberler</h2>
            <ul className="space-y-2">
              {guides.map((g) => (
                <li key={g.slug}><Link href={`/rehber/${g.slug}`} className="text-sm font-bold" style={{ color: "#2563EB" }}>{g.title}</Link></li>
              ))}
            </ul>
          </div>
        )}

        {categoryFaq && (
          <div className="mt-10 pt-8 border-t" style={{ borderColor: "#E4E4E7" }}>
            <h2 className="font-sans text-lg font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
            <div className="space-y-4">
              {categoryFaq.map((f, i) => (
                <div key={i}>
                  <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <SeoFooter />
    </>
  );
}
