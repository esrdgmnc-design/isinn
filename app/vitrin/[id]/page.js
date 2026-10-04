import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import ShareButton from "../../../components/ShareButton";
import { formatPrice, getProviderName } from "../../../lib/seoFormat";
import { SEO_CITIES, matchesCitySlug } from "../../../lib/seoTaxonomy";

// SEO için eklendi (2026-09-16): İşinn'in tamamı eskiden tek bir "/" sayfası
// üzerinde, istemci tarafı görünüm durumuyla çalışıyordu — her vitrin kendi
// URL'sine sahip değildi, Google tek tek vitrinleri hiç indeksleyemiyordu
// (bkz. app/sitemap.js'teki eski not). Bu sayfa her vitrine gerçek, kalıcı,
// kendi başlığı/açıklaması/görseliyle bir URL veriyor. Tam etkileşimli
// deneyim (mesaj gönder, favorile vb.) hâlâ ana uygulamada — buradaki
// "İşinn'de Görüntüle" linki ?vitrin=<id> ile oraya taşıyor, IsinnApp.jsx'teki
// yeni bir useEffect o id'yi çekip doğrudan detay ekranını açıyor.
const BASE_URL = "https://www.isinn.com.tr";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200";

async function getListing(id) {
  const { data } = await supabase.from("services").select("*, profiles(*), categories(*)").eq("id", id).eq("active", true).maybeSingle();
  return data;
}

// Gerçek puan varsa Service şemasına aggregateRating ekliyoruz — yoksa hiç
// eklemiyoruz (uydurma/varsayılan puan koymak Google'ın yapılandırılmış veri
// politikasını ihlal eder). Basitlik için sadece bu vitrine (service_id)
// bırakılan değerlendirmeler sayılıyor — IsinnApp.jsx'teki "profil bazlı
// birleştirme" tercihi burada uygulanmıyor, sadece bu vitrine ait gerçek
// puanları gösteriyoruz.
async function getRatingStats(serviceId) {
  const { data } = await supabase.from("ratings").select("value").eq("service_id", serviceId);
  if (!data || data.length === 0) return null;
  const avg = data.reduce((s, r) => s + r.value, 0) / data.length;
  return { ratingValue: Number(avg.toFixed(1)), reviewCount: data.length };
}

// Sitemap ve indeksleme için bu sayfayı statik/ISR yapıyoruz — her istekte
// yeniden sorgulamak yerine saatte bir tazeleniyor, hem hızlı hem güncel.
export const revalidate = 3600;

// generateStaticParams olmadan bu sayfa canlıda her istekte dinamik (Cache-Control: no-store,
// X-Vercel-Cache: MISS) render ediliyordu; boş liste, sayfayı ilk istekte üretilip saatlik
// yeniden doğrulanan ISR yoluna sokar (yeni vitrinler yine anında açılır: dynamicParams).
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const row = await getListing(params.id);
  if (!row) {
    return { title: "Vitrin bulunamadı — İşinn", robots: { index: false } };
  }
  const provider = getProviderName(row);
  const city = row.is_remote ? "Uzaktan" : (row.city || "Türkiye");
  // Başlık kullanıcının yazdığına bağlı ve çoğu zaman kategori/şehir içermiyor; arama
  // sonucunda anlamlı görünmesi için kategori ve şehir eklenir, sağlayıcı adı çıkarılır.
  // "Diğer" bir yakalama kutusu: başlıkta anlamsız ("... — Diğer · İstanbul"), eklenmez.
  const catName = row.categories?.slug === "diger" ? "" : (row.categories?.name || "");
  const place = row.is_remote ? "Uzaktan" : (row.city || "").split(",").pop().trim();
  const title = `${row.title} — ${[catName, place].filter(Boolean).join(" · ")} | İşinn`.replace(" —  |", " |");
  const description = (row.description?.trim() || `${provider} tarafından ${city} bölgesinde sunulan "${row.title}" hizmeti — İşinn'de komisyonsuz keşfet.`).slice(0, 160);
  // DEMO (örnek) ve içeriği çok ince vitrinler arama motoruna açılmaz.
  const isDemo = (row.description || "").trim().startsWith("DEMO VİTRİN");
  const isThin = (row.description || "").trim().length < 40;
  const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
  const url = `${BASE_URL}/vitrin/${row.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: isDemo || isThin ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url, siteName: "İşinn", locale: "tr_TR", type: "website", images: [{ url: img }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export default async function VitrinPage({ params }) {
  const row = await getListing(params.id);

  // Yayından kalkan / silinen vitrin gerçek 404 döner (eskiden 200 + "artık aktif değil" — soft-404).
  if (!row) notFound();

  const ratingStats = await getRatingStats(row.id);

  const provider = getProviderName(row);
  const city = row.is_remote ? "Uzaktan" : (row.city || "Belirtilmemiş");
  const price = formatPrice(row.price, row.price_type);
  const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
  const category = row.categories?.name || "";
  const categorySlug = row.categories?.slug || "";
  // services.city serbest metin — aynı sehir/[city]/page.js'teki eşleştirme
  // mantığıyla gerçek bir /sehir/[slug] sayfasına bağlıyoruz (varsa).
  const citySeo = !row.is_remote && row.city
    ? SEO_CITIES.find((c) => matchesCitySlug(row.city, c.slug))
    : null;
  const description = row.description?.trim() || "";
  const url = `${BASE_URL}/vitrin/${row.id}`;
  const title = `${row.title} — İşinn`;

  // İç link akışını (PageRank dağılımı) kategori/şehir programatik SEO
  // sayfalarına da taşıyor — eskiden vitrin sayfasından bu sayfalara hiç link
  // yoktu, sadece ana uygulamaya (?vitrin=) gidiyordu.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "İşinn", item: BASE_URL },
      ...(categorySlug ? [{ "@type": "ListItem", position: 2, name: category, item: `${BASE_URL}/kategori/${categorySlug}` }] : []),
      { "@type": "ListItem", position: categorySlug ? 3 : 2, name: row.title, item: url },
    ],
  };

  // Google'ın hizmet sayfaları için beklediği yapılandırılmış veri — arama
  // sonuçlarında zengin snippet (fiyat, konum, sağlayıcı adı) ihtimalini artırır.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: row.title,
    ...(description ? { description } : {}),
    image: img,
    url: `${BASE_URL}/vitrin/${row.id}`,
    areaServed: city,
    ...(category ? { serviceType: category } : {}),
    provider: {
      // Bireysel bir sağlayıcıyı "LocalBusiness" diye işaretlemek yanıltıcı olabilir:
      // işletme adı varsa Organization, yoksa Person.
      "@type": (row.display_name || row.profiles?.business_name) ? "Organization" : "Person",
      name: provider,
      ...(row.is_remote ? {} : { address: { "@type": "PostalAddress", addressLocality: city.split(",")[0]?.trim() || city, addressCountry: "TR" } }),
    },
    ...(row.price != null ? { offers: { "@type": "Offer", price: row.price, priceCurrency: "TRY" } } : {}),
    ...(ratingStats ? { aggregateRating: { "@type": "AggregateRating", ratingValue: ratingStats.ratingValue, reviewCount: ratingStats.reviewCount } } : {}),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav className="flex flex-wrap items-center gap-1 text-sm" style={{ color: "#6B7280" }}>
          <Link href="/" className="font-bold" style={{ color: "#2563EB" }}>İşinn</Link>
          {categorySlug && (
            <>
              <span>/</span>
              <Link href={`/kategori/${categorySlug}`} className="font-bold" style={{ color: "#2563EB" }}>{category}</Link>
            </>
          )}
          {citySeo && (
            <>
              <span>/</span>
              <Link href={`/sehir/${citySeo.slug}`} className="font-bold" style={{ color: "#2563EB" }}>{citySeo.name}</Link>
            </>
          )}
        </nav>

        <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
          <div className="relative w-full h-64">
            <Image src={img} alt={row.title} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" priority />
          </div>
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#2563EB" }}>{category}</p>
            <h1 className="font-sans text-2xl font-black mb-2" style={{ color: "#0F1115" }}>{row.title}</h1>
            <p className="text-sm mb-1" style={{ color: "#6B7280" }}>{provider} · {city}</p>
            {/* JSON-LD'deki aggregateRating sayfada görünür olmalı (Google yapılandırılmış veri politikası). */}
            {ratingStats && (
              <p className="text-sm mb-1" style={{ color: "#6B7280" }}>★ {ratingStats.ratingValue.toLocaleString("tr-TR")} · {ratingStats.reviewCount} değerlendirme</p>
            )}
            <p className="text-sm font-black mb-4" style={{ color: "#0F1115" }}>{price}</p>
            {description && <p className="text-sm leading-relaxed mb-6" style={{ color: "#374151" }}>{description}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`/?vitrin=${row.id}`}
                className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white"
                style={{ background: "#2563EB" }}
              >
                İşinn'de Görüntüle ve Mesaj Gönder
              </a>
              <ShareButton url={url} title={title} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
