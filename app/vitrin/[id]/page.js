import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import ShareButton from "../../../components/ShareButton";
import { formatPrice, getProviderName } from "../../../lib/seoFormat";

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

// Sitemap ve indeksleme için bu sayfayı statik/ISR yapıyoruz — her istekte
// yeniden sorgulamak yerine saatte bir tazeleniyor, hem hızlı hem güncel.
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const row = await getListing(params.id);
  if (!row) {
    return { title: "Vitrin bulunamadı — İşinn", robots: { index: false } };
  }
  const provider = getProviderName(row);
  const city = row.is_remote ? "Uzaktan" : (row.city || "Türkiye");
  const title = `${row.title} — ${provider} | İşinn`;
  const description = (row.description?.trim() || `${provider} tarafından ${city} bölgesinde sunulan "${row.title}" hizmeti — İşinn'de komisyonsuz keşfet.`).slice(0, 160);
  const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
  const url = `${BASE_URL}/vitrin/${row.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "İşinn", locale: "tr_TR", type: "website", images: [{ url: img }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export default async function VitrinPage({ params }) {
  const row = await getListing(params.id);

  if (!row) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <h1 className="font-sans text-xl font-bold mb-3" style={{ color: "#0F1115" }}>Bu vitrin artık aktif değil</h1>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Kaldırılmış ya da yayından kaldırılmış olabilir.</p>
        <Link href="/" className="inline-block text-sm font-bold px-5 py-2.5 rounded-full text-white" style={{ background: "#2563EB" }}>İşinn'e Dön</Link>
      </div>
    );
  }

  const provider = getProviderName(row);
  const city = row.is_remote ? "Uzaktan" : (row.city || "Belirtilmemiş");
  const price = formatPrice(row.price, row.price_type);
  const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
  const category = row.categories?.name || "";
  const description = row.description?.trim() || "";
  const url = `${BASE_URL}/vitrin/${row.id}`;
  const title = `${row.title} — İşinn`;

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
      "@type": row.is_remote ? "Organization" : "LocalBusiness",
      name: provider,
      ...(row.is_remote ? {} : { address: { "@type": "PostalAddress", addressLocality: city.split(",")[0]?.trim() || city, addressCountry: "TR" } }),
    },
    ...(row.price != null ? { offers: { "@type": "Offer", price: row.price, priceCurrency: "TRY" } } : {}),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>

        <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
          <img src={img} alt={row.title} className="w-full h-64 object-cover" />
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#2563EB" }}>{category}</p>
            <h1 className="font-sans text-2xl font-black mb-2" style={{ color: "#0F1115" }}>{row.title}</h1>
            <p className="text-sm mb-1" style={{ color: "#6B7280" }}>{provider} · {city}</p>
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
