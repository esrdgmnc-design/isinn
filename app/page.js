import Link from "next/link";
import Image from "next/image";
import HomeClient from "../components/HomeClient";
import { faqJsonLd } from "../lib/faqJsonLd";
import { supabase } from "../lib/supabaseClient";
import { SEO_CATEGORIES } from "../lib/seoTaxonomy";
import { formatPrice, getProviderName } from "../lib/seoFormat";

// Ana sayfa artık sunucu bileşeni: kanonik adres "/" (parametreli ?vitrin=… gibi URL'ler
// ayrı sayfa sayılmasın) ve SSS şeması yalnızca burada.
export const metadata = {
  title: "İşinn — Usta, Temizlikçi Bul; Yeteneğini Gelire Dönüştür",
  alternates: { canonical: "/" },
};

const BASE_URL = "https://www.isinn.com.tr";

// SEO denetiminde bulunan en kritik sorun: <HomeClient/> tamamen "use client"
// ve gerçek içeriği (kategoriler, vitrinler) useEffect+Supabase ile istemci
// tarafında çekiyor — Google'ın/AI botlarının ilk HTML'inde H1 dahil hiçbir
// gerçek metin yoktu. IsinnApp.jsx'in karmaşık, elle ayarlanmış durum
// yönetimine (boost/puan/seededDailyShuffle mantığı) dokunmadan, düşük riskli
// bir çözüm: ana uygulamanın ALTINA, gerçek verilerle dolu, sunucu tarafında
// render edilen bir "Popüler Kategoriler / Yeni Eklenen Vitrinler" keşif
// bölümü eklemek — bu hem crawler'lara ilk yanıtta somut, indekslenebilir
// içerik verir hem de kategori/vitrin sayfalarına iç link akışı sağlar
// (madde 6'daki breadcrumb'ları tamamlayan bir footer-tipi bağlantı kümesi).
async function getDiscoveryData() {
  const { data } = await supabase
    .from("services")
    .select("id, title, price, price_type, city, is_remote, description, display_name, images, created_at, profiles(business_name, full_name), categories(name, slug)")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(300);

  const indexable = (data || []).filter((row) => {
    const d = (row.description || "").trim();
    return !d.startsWith("DEMO VİTRİN") && d.length >= 40;
  });

  const countByCategorySlug = {};
  for (const row of indexable) {
    const slug = row.categories?.slug;
    if (!slug) continue;
    countByCategorySlug[slug] = (countByCategorySlug[slug] || 0) + 1;
  }
  const popularCategories = SEO_CATEGORIES
    .map((c) => ({ ...c, count: countByCategorySlug[c.slug] || 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const recentListings = indexable.slice(0, 8);

  return { popularCategories, recentListings };
}

export default async function Page() {
  const { popularCategories, recentListings } = await getDiscoveryData();
  const FALLBACK_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200";

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeClient />

      {(popularCategories.length > 0 || recentListings.length > 0) && (
        <div className="max-w-6xl mx-auto px-5 py-12 border-t" style={{ borderColor: "#F0F0F0" }}>
          {popularCategories.length > 0 && (
            <div className="mb-10">
              <h2 className="font-sans text-xl font-black mb-4" style={{ color: "#0F1115" }}>Popüler Kategoriler</h2>
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/kategori/${c.slug}`}
                    className="text-sm font-bold px-4 py-2 rounded-full"
                    style={{ border: "1px solid #E5E7EB", color: "#1B2B24" }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {recentListings.length > 0 && (
            <div>
              <h2 className="font-sans text-xl font-black mb-4" style={{ color: "#0F1115" }}>Yeni Eklenen Vitrinler</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recentListings.map((row) => {
                  const provider = getProviderName(row);
                  const city = row.is_remote ? "Uzaktan" : (row.city || "Türkiye");
                  const img = (Array.isArray(row.images) && row.images[0]) || FALLBACK_IMG;
                  return (
                    <Link key={row.id} href={`/vitrin/${row.id}`} className="rounded-2xl overflow-hidden block" style={{ border: "1px solid #F0F0F0" }}>
                      <div className="relative w-full h-32">
                        <Image src={img} alt={row.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                      </div>
                      <div className="p-3">
                        {row.categories?.name && (
                          <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: "#2563EB" }}>{row.categories.name}</p>
                        )}
                        <p className="text-sm font-bold mb-1 line-clamp-2" style={{ color: "#0F1115" }}>{row.title}</p>
                        <p className="text-xs mb-1" style={{ color: "#6B7280" }}>{provider} · {city}</p>
                        <p className="text-sm font-black" style={{ color: "#0F1115" }}>{formatPrice(row.price, row.price_type)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
