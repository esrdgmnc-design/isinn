import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { SEO_CATEGORIES, SEO_CITIES, matchesCitySlug } from "../lib/seoTaxonomy";
import { isIndexableListing, MIN_CITY_LISTINGS, MIN_CATEGORY_LISTINGS } from "../lib/seoFormat";

// Alt sayfalarda (rehber, kategori, şehir, vitrin, hakkımızda...) site genelinde gezinme ve iç bağlantı sağlar. Teknik SEO denetimi:
// bu sayfalarda menü/alt bilgi yoktu, /hakkimizda'ya yalnızca ana sayfadan 1 bağlantı gidiyordu. Yalnızca gerçekten indekslenebilir
// (yeterli gerçek vitrini olan) kategori ve şehirlere bağlanır; boş sayfalara bağlantı verilmez. Veri alınamazsa yalnızca sabit bağlantılar görünür.
async function loadIndexable() {
  try {
    const { data } = await supabase.from("services").select("city, description, categories(slug)").eq("active", true).limit(1000);
    const rows = (data || []).filter(isIndexableListing);
    const catCounts = {};
    for (const r of rows) { const s = r.categories?.slug; if (s) catCounts[s] = (catCounts[s] || 0) + 1; }
    const cats = SEO_CATEGORIES.filter((c) => c.slug !== "diger" && (catCounts[c.slug] || 0) >= MIN_CATEGORY_LISTINGS)
      .sort((a, b) => (catCounts[b.slug] || 0) - (catCounts[a.slug] || 0)).slice(0, 8);
    const cities = SEO_CITIES.filter((c) => rows.filter((r) => matchesCitySlug(r.city, c.slug)).length >= MIN_CITY_LISTINGS).slice(0, 6);
    return { cats, cities };
  } catch {
    return { cats: [], cities: [] };
  }
}

export default async function SeoFooter() {
  const { cats, cities } = await loadIndexable();
  const link = { color: "#2563EB" };
  return (
    <footer className="max-w-2xl mx-auto px-5 pb-12 pt-6 mt-6 border-t text-xs" style={{ borderColor: "#E5E7EB", color: "#6B7280" }} aria-label="Site bağlantıları">
      <p className="mb-3">İşinn (isinn.com.tr), Türkiye'de <Link href="/" style={link}>freelance uzman ve hizmet bulma</Link> platformudur; komisyon almaz. Bir banka, işe alım/personel arama sitesi ya da ürün satış sitesi değildir.</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 font-bold">
        <Link href="/" style={link}>Ana sayfa</Link>
        <Link href="/yetenegini-farket" style={link}>Yeteneğini Farket</Link>
        <Link href="/rehber" style={link}>Rehberler</Link>
        <Link href="/hakkimizda" style={link}>Hakkımızda</Link>
        <Link href="/en" hrefLang="en" style={link}>English</Link>
      </div>
      {cats.length > 0 && (
        <p className="mb-2">
          <span className="font-bold">Kategoriler: </span>
          {cats.map((c, i) => (
            <span key={c.slug}>{i > 0 && " · "}<Link href={`/kategori/${c.slug}`} style={link}>{c.name}</Link></span>
          ))}
        </p>
      )}
      {cities.length > 0 && (
        <p className="mb-2">
          <span className="font-bold">Şehirler: </span>
          {cities.map((c, i) => (
            <span key={c.slug}>{i > 0 && " · "}<Link href={`/sehir/${c.slug}`} style={link}>{c.name}</Link></span>
          ))}
        </p>
      )}
      <p className="flex flex-wrap gap-x-4 gap-y-1.5">
        <Link href="/gizlilik-politikasi" style={link}>Gizlilik</Link>
        <Link href="/kvkk-aydinlatma-metni" style={link}>KVKK</Link>
        <Link href="/kullanim-sartlari" style={link}>Kullanım Şartları</Link>
      </p>
    </footer>
  );
}
