import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { SEO_CATEGORIES, SEO_CITIES, matchesCitySlug } from "../../../../lib/seoTaxonomy";

// SEO'nun en değerli sayfası: "istanbul temizlikçi", "ankara özel ders" gibi
// uzun kuyruk aramaların doğrudan hedefi — bkz. SEO stratejisi dokümanı,
// madde 3. Kategori-only ve şehir-only sayfalar app/kategori/[slug] ve
// app/sehir/[city]'de.
const BASE_URL = "https://www.isinn.com.tr";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200";

function findCategory(slug) {
  return SEO_CATEGORIES.find((c) => c.slug === slug) || null;
}
function findCity(slug) {
  return SEO_CITIES.find((c) => c.slug === slug) || null;
}

function formatPrice(price, priceType) {
  if (price == null) return priceType === "hourly" ? "Fiyat belirtilmemiş/saat" : "Fiyat belirtilmemiş";
  const formatted = Number(price).toLocaleString("tr-TR");
  if (priceType === "hourly") return `${formatted}₺/saat`;
  if (priceType === "quote") return "Teklif alın";
  return `${formatted}₺'den`;
}

function getProviderName(row) {
  return (row.display_name && row.display_name.trim()) || (row.profiles?.business_name && row.profiles.business_name.trim()) || row.profiles?.full_name || "Sağlayıcı";
}

async function getServices(categorySlug, citySlug) {
  const { data: category } = await supabase.from("categories").select("id, name, slug").eq("slug", categorySlug).maybeSingle();
  if (!category) return { category: null, services: [] };
  const { data: services } = await supabase
    .from("services")
    .select("*, profiles(*)")
    .eq("category_id", category.id)
    .eq("active", true)
    .eq("is_remote", false)
    .order("updated_at", { ascending: false });
  return { category, services: (services || []).filter((row) => matchesCitySlug(row.city, citySlug)) };
}

export const revalidate = 3600;

// 81 il x 50 kategori (4000+ sayfa) yerine bilinçli olarak sadece arzın zaten
// yoğun olduğu büyük şehirler için derleme zamanında statik üretim yapılıyor —
// bkz. SEO stratejisi dokümanı, "gerçekçi başlangıç". Diğer kombinasyonlar
// yine de istek anında (SSR) çalışır, sadece build'e dahil edilmez.
const PRIORITY_CITY_SLUGS = ["istanbul", "ankara", "izmir", "bursa", "antalya", "kocaeli"];

export async function generateStaticParams() {
  return SEO_CATEGORIES.flatMap((cat) => PRIORITY_CITY_SLUGS.map((city) => ({ slug: cat.slug, city })));
}

export async function generateMetadata({ params }) {
  const categoryMeta = findCategory(params.slug);
  const cityMeta = findCity(params.city);
  if (!categoryMeta || !cityMeta) return { title: "Sayfa bulunamadı — İşinn" };
  const { services } = await getServices(params.slug, params.city);
  const url = `${BASE_URL}/kategori/${params.slug}/${params.city}`;
  const title = `${cityMeta.name} ${categoryMeta.name} — Güvenilir ${categoryMeta.name} Bul | İşinn`;
  const description = `${cityMeta.name} bölgesinde güvenilir ${categoryMeta.name.toLocaleLowerCase("tr-TR")} sağlayıcılarını keşfet, doğrudan ulaş — komisyonsuz, İşinn'de.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: services.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url, siteName: "İşinn", locale: "tr_TR", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryCityPage({ params }) {
  const categoryMeta = findCategory(params.slug);
  const cityMeta = findCity(params.city);
  if (!categoryMeta || !cityMeta) notFound();
  const { services } = await getServices(params.slug, params.city);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "İşinn", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: categoryMeta.name, item: `${BASE_URL}/kategori/${params.slug}` },
      { "@type": "ListItem", position: 3, name: cityMeta.name, item: `${BASE_URL}/kategori/${params.slug}/${params.city}` },
    ],
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-5 py-10">
        <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>
        <p className="text-xs mt-4 mb-1" style={{ color: "#9CA3AF" }}>
          <Link href={`/kategori/${params.slug}`} style={{ color: "#2563EB" }}>{categoryMeta.name}</Link> · {cityMeta.name}
        </p>
        <h1 className="font-sans text-2xl md:text-3xl font-black mb-2" style={{ color: "#0F1115" }}>
          {cityMeta.name} {categoryMeta.name}
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
          {cityMeta.name} bölgesinde güvenilir {categoryMeta.name.toLocaleLowerCase("tr-TR")} sağlayıcılarını keşfet, doğrudan ulaş — komisyonsuz.
        </p>

        {services.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ border: "1px solid #F0F0F0" }}>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{cityMeta.name} bölgesinde bu kategoride henüz aktif bir vitrin yok — ilk sen ol.</p>
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
                <Link key={row.id} href={`/vitrin/${row.id}`} className="rounded-2xl overflow-hidden block" style={{ border: "1px solid #F0F0F0" }}>
                  <img src={img} alt={row.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-bold mb-1 line-clamp-2" style={{ color: "#0F1115" }}>{row.title}</p>
                    <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{provider}</p>
                    <p className="text-sm font-black" style={{ color: "#0F1115" }}>{formatPrice(row.price, row.price_type)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
