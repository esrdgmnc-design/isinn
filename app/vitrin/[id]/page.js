import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import ShareButton from "../../../components/ShareButton";
import { formatPrice, getProviderName, isIndexableListing } from "../../../lib/seoFormat";
import { socialMeta, clamp, optimizedImageUrl } from "../../../lib/seoMeta";
import { SEO_CITIES, matchesCitySlug } from "../../../lib/seoTaxonomy";
import { jsonLdString } from "../../../lib/jsonLd";
import SeoFooter from "../../../components/SeoFooter";

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
// Bilinen aktif vitrinler build'de önceden üretilir (ilk bot ziyareti de önbellekten gelir); yeni vitrinler dynamicParams ile açılır.
export async function generateStaticParams() {
  try {
    const { data } = await supabase.from("services").select("id").eq("active", true).limit(200);
    return (data || []).map((r) => ({ id: r.id }));
  } catch {
    return [];
  }
}

// Sayfayı şablon yerine GERÇEK kullanıcı verisiyle zenginleştiren sorgular. Her biri hata verirse boş döner (sayfa yine açılır).
async function getPortfolio(serviceId) {
  try {
    const { data } = await supabase.from("portfolio_items").select("media_type, url").eq("service_id", serviceId).eq("media_type", "image").limit(9);
    return data || [];
  } catch { return []; }
}
const provinceOf = (city) => String(city || "").split(",").pop().trim().toLocaleLowerCase("tr-TR");
async function getRelated(row) {
  try {
    const cols = "id, title, description, city, is_remote, images, price, price_type, display_name, profiles(business_name, full_name)";
    const [{ data: sameCat }, { data: sameProv }] = await Promise.all([
      row.category_id ? supabase.from("services").select(cols).eq("category_id", row.category_id).eq("active", true).neq("id", row.id).order("created_at", { ascending: false }).limit(12) : Promise.resolve({ data: [] }),
      row.provider_id ? supabase.from("services").select(cols).eq("provider_id", row.provider_id).eq("active", true).neq("id", row.id).limit(4) : Promise.resolve({ data: [] }),
    ]);
    const prov = (sameProv || []).filter(isIndexableListing);
    const used = new Set(prov.map((r) => r.id));
    const cat = (sameCat || []).filter((r) => isIndexableListing(r) && !used.has(r.id));
    // aynı ildekiler önce
    cat.sort((a, b) => (provinceOf(b.city) === provinceOf(row.city)) - (provinceOf(a.city) === provinceOf(row.city)));
    return { sameProvider: prov.slice(0, 3), similar: cat.slice(0, 4) };
  } catch { return { sameProvider: [], similar: [] }; }
}
async function hasSameTitle(row) {
  try {
    const { data } = await supabase.from("services").select("id").eq("title", row.title).eq("active", true).neq("id", row.id).limit(1);
    return !!(data && data.length);
  } catch { return false; }
}

export async function generateMetadata({ params }) {
  const row = await getListing(params.id);
  if (!row) {
    return { title: "Vitrin bulunamadı — İşinn", robots: { index: false } };
  }
  const provider = getProviderName(row);
  const city = row.is_remote ? "Uzaktan" : (row.city || "Türkiye");
  // Başlık kullanıcının yazdığına bağlı ve çoğu zaman kategori/şehir içermiyor; arama sonucunda anlamlı görünmesi için
  // başlıkta zaten geçmeyen kategori/şehir eklenir. "Diğer" bir yakalama kutusu: eklenmez. Başlık ~60 karakterde tutulur.
  const catName = row.categories?.slug === "diger" ? "" : (row.categories?.name || "");
  const place = row.is_remote ? "Uzaktan" : (row.city || "").split(",").pop().trim();
  const lowerTitle = String(row.title || "").toLocaleLowerCase("tr-TR");
  const tailParts = [catName, place].filter(Boolean).filter((x) => !lowerTitle.includes(x.toLocaleLowerCase("tr-TR")));
  // Aynı başlığı taşıyan başka bir vitrin varsa sağlayıcı adıyla ayrıştır (iki sayfa aynı başlıkla yarışmasın).
  if (await hasSameTitle(row)) tailParts.unshift(provider);
  const tail = tailParts.join(" · ");
  const title = tail ? `${clamp(row.title, 44)} — ${tail} | İşinn` : `${clamp(row.title, 52)} | İşinn`;
  const description = clamp(row.description?.trim() || `${provider} tarafından ${city} bölgesinde sunulan "${row.title}" hizmeti — İşinn'de komisyonsuz keşfet.`, 155);
  // DEMO (örnek) ve içeriği çok ince vitrinler arama motoruna açılmaz.
  const isDemo = (row.description || "").trim().startsWith("DEMO VİTRİN");
  const isThin = (row.description || "").trim().length < 40;
  const url = `${BASE_URL}/vitrin/${row.id}`;
  const realImg = Array.isArray(row.images) && row.images[0] ? row.images[0] : null;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: isDemo || isThin ? { index: false, follow: true } : undefined,
    // Paylaşım kartı için küçültülmüş görsel (WhatsApp ~300 KB üstünü göstermiyor); görseli olmayan vitrinde varsayılan kart.
    ...socialMeta({ title, description, url, image: optimizedImageUrl(realImg) }),
  };
}

export default async function VitrinPage({ params }) {
  const row = await getListing(params.id);

  // Yayından kalkan / silinen vitrin gerçek 404 döner (eskiden 200 + "artık aktif değil" — soft-404).
  if (!row) notFound();

  const ratingStats = await getRatingStats(row.id);
  const [portfolio, related] = await Promise.all([getPortfolio(row.id), getRelated(row)]);

  const provider = getProviderName(row);
  const city = row.is_remote ? "Uzaktan" : (row.city || "Belirtilmemiş");
  const price = formatPrice(row.price, row.price_type);
  const realImg = Array.isArray(row.images) && row.images[0] ? row.images[0] : null;
  const img = realImg || FALLBACK_IMG;
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
      ...(categorySlug && categorySlug !== "diger" ? [{ "@type": "ListItem", position: 2, name: category, item: `${BASE_URL}/kategori/${categorySlug}` }] : []),
      { "@type": "ListItem", position: categorySlug && categorySlug !== "diger" ? 3 : 2, name: row.title, item: url },
    ],
  };

  // Hizmet şeması (yalnızca gerçek veriden): bireysel sağlayıcı Person, işletme adı varsa Organization; konum il/ilçe olarak ayrıştırılır;
  // fiyat tipi yok sayılmaz; stok fotoğraf şemaya yazılmaz. aggregateRating BASILMAZ: sayfada yorum metni görünür değil (az yorum, politika riski).
  const rawCity = (row.city || "").split(",").map((x) => x.trim()).filter(Boolean);
  const capWord = (x) => (x ? x.charAt(0).toLocaleUpperCase("tr-TR") + x.slice(1) : x);
  const province = capWord(rawCity[rawCity.length - 1]);
  const district = rawCity.length > 1 ? capWord(rawCity[0]) : null;
  const areaServed = row.is_remote
    ? { "@type": "Country", name: "Türkiye" }
    : { "@type": district ? "AdministrativeArea" : "City", name: [district, province].filter(Boolean).join(", ") || "Türkiye" };
  const priceNum = Number(row.price);
  const offers = row.price != null && priceNum > 0 && row.price_type !== "quote"
    ? {
        "@type": "Offer", url, priceCurrency: "TRY",
        priceSpecification: row.price_type === "hourly"
          ? { "@type": "UnitPriceSpecification", price: priceNum, priceCurrency: "TRY", unitCode: "HUR", unitText: "saat" }
          : { "@type": "PriceSpecification", minPrice: priceNum, priceCurrency: "TRY" },
      }
    : null;
  const hasBusinessName = !!(row.profiles?.business_name || "").trim();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: row.title,
    ...(description ? { description } : {}),
    ...(realImg ? { image: realImg } : {}),
    url,
    areaServed,
    ...(category && categorySlug !== "diger" ? { serviceType: category } : {}),
    provider: {
      "@type": hasBusinessName ? "Organization" : "Person",
      name: provider,
      ...(row.is_remote || !province ? {} : { address: { "@type": "PostalAddress", addressLocality: district || province, addressRegion: province, addressCountry: "TR" } }),
    },
    ...(offers ? { offers } : {}),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav className="flex flex-wrap items-center gap-1 text-sm" style={{ color: "#6B7280" }}>
          <Link href="/" className="font-bold" style={{ color: "#2563EB" }}>İşinn</Link>
          {categorySlug && categorySlug !== "diger" && (
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
            {description && <p className="text-sm leading-relaxed mb-6 whitespace-pre-line" style={{ color: "#374151" }}>{description}</p>}
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

        {/* Hizmet bilgileri: yalnızca dolu alanlar gösterilir; sabit/şablon cümle yok. */}
        {(() => {
          const rows = [];
          if (row.is_remote) rows.push(["Hizmet şekli", "Uzaktan"]);
          else if (row.home_service_type) rows.push(["Hizmet şekli", { evde: "Müşterinin evinde", mekanda: "Kendi mekânında", esnek: "Esnek (ev ya da mekân)" }[row.home_service_type] || null]);
          if (!row.is_remote && row.city) rows.push(["Konum", row.city]);
          rows.push(["Fiyat", price]);
          if (row.created_at) rows.push(["Yayın tarihi", new Date(row.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })]);
          if (row.video_intro_url) rows.push(["Tanıtım videosu", "Var"]);
          const filtered = rows.filter(([, v]) => v);
          if (filtered.length < 2) return null;
          return (
            <section className="mt-6">
              <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>Hizmet bilgileri</h2>
              <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5" style={{ color: "#374151" }}>
                {filtered.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-bold">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs mt-3" style={{ color: "#9CA3AF" }}>Bilgiler sağlayıcının kendi beyanıdır; İşinn içeriği doğrulamaz.</p>
            </section>
          );
        })()}

        {portfolio.length > 0 && (
          <section className="mt-8">
            <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>Çalışma örnekleri</h2>
            <div className="grid grid-cols-3 gap-2">
              {portfolio.map((p, i) => (
                <div key={p.url} className="relative aspect-square rounded-xl overflow-hidden" style={{ background: "#F3F4F6" }}>
                  <Image src={p.url} alt={`${row.title}, ${provider} çalışma örneği ${i + 1}/${portfolio.length}`} fill sizes="(max-width: 768px) 33vw, 220px" className="object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        {related.sameProvider.length > 0 && (
          <section className="mt-8">
            <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>{provider} tarafından diğer vitrinler</h2>
            <ul className="space-y-2">
              {related.sameProvider.map((r) => (
                <li key={r.id}><Link href={`/vitrin/${r.id}`} className="text-sm font-bold" style={{ color: "#2563EB" }}>{r.title}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {related.similar.length > 0 && (
          <section className="mt-8">
            <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>Benzer vitrinler</h2>
            <ul className="space-y-2">
              {related.similar.map((r) => (
                <li key={r.id}>
                  <Link href={`/vitrin/${r.id}`} className="text-sm font-bold" style={{ color: "#2563EB" }}>{r.title}</Link>
                  <span className="text-xs ml-2" style={{ color: "#6B7280" }}>{getProviderName(r)} · {r.is_remote ? "Uzaktan" : (r.city || "").split(",").pop().trim()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <SeoFooter />
    </>
  );
}
