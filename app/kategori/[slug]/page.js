import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { SEO_CATEGORIES } from "../../../lib/seoTaxonomy";

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

async function getServices(slug) {
  const { data: category } = await supabase.from("categories").select("id, name, slug").eq("slug", slug).maybeSingle();
  if (!category) return { category: null, services: [] };
  const { data: services } = await supabase
    .from("services")
    .select("*, profiles(*)")
    .eq("category_id", category.id)
    .eq("active", true)
    .order("updated_at", { ascending: false });
  return { category, services: services || [] };
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
  const title = `${meta.name} Hizmeti Bul — İşinn`;
  const description = `Türkiye genelinde güvenilir ${meta.name.toLocaleLowerCase("tr-TR")} sağlayıcılarını keşfet, doğrudan ulaş — komisyonsuz, İşinn'de.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    // Az sayıda (veya sıfır) sonuç olan sayfalar ince içerik sayılıp
    // cezalandırılmasın diye indekslemeden çıkarılıyor — vitrin sayısı
    // arttıkça otomatik olarak indekslenebilir hâle gelir.
    robots: services.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url, siteName: "İşinn", locale: "tr_TR", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params }) {
  const meta = findCategory(params.slug);
  if (!meta) notFound();
  const { services } = await getServices(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${meta.name} — İşinn`,
    itemListElement: services.map((row, i) => ({
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

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {services.length > 0 && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div className="max-w-5xl mx-auto px-5 py-10">
        <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>
        <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-2" style={{ color: "#0F1115" }}>
          {meta.name} Hizmeti Bul
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
          Türkiye genelinde güvenilir {meta.name.toLocaleLowerCase("tr-TR")} sağlayıcılarını keşfet, doğrudan ulaş — komisyonsuz.
        </p>

        {services.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ border: "1px solid #F0F0F0" }}>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Bu kategoride henüz aktif bir vitrin yok — ilk sen ol.</p>
            <Link href="/?view=createListing" className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white" style={{ background: "#2563EB" }}>
              Hizmet Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((row) => {
              const provider = getProviderName(row);
              const city = row.is_remote ? "Uzaktan" : (row.city || "Türkiye");
              const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
              return (
                <Link key={row.id} href={`/vitrin/${row.id}`} className="rounded-2xl overflow-hidden block" style={{ border: "1px solid #F0F0F0" }}>
                  <img src={img} alt={row.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-bold mb-1 line-clamp-2" style={{ color: "#0F1115" }}>{row.title}</p>
                    <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{provider} · {city}</p>
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
