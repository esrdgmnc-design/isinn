// Next.js App Router özel dosyası — /sitemap.xml'i otomatik üretir.
//
// 2026-09-16'ya kadar İşinn'in vitrin/ilan detay sayfaları kendi URL'lerine
// sahip değildi — tüm uygulama tek bir "/" sayfası üzerinde, istemci tarafı
// görünüm durumuyla çalışıyordu, Google tek tek vitrinleri hiç
// indeksleyemiyordu. Artık her aktif vitrin app/vitrin/[id]/page.js'te
// gerçek, kendi başlığı/açıklaması olan bir sayfaya sahip — bu dosya artık
// hepsini de sitemap'e ekliyor.
import { supabase } from "../lib/supabaseClient";
import { SEO_CATEGORIES, SEO_CITIES, matchesCitySlug } from "../lib/seoTaxonomy";
import { REHBER_POSTS } from "../lib/rehberContent";
import { isIndexableListing, MIN_CITY_LISTINGS, MIN_COMBO_LISTINGS } from "../lib/seoFormat";

const BASE_URL = "https://www.isinn.com.tr";

// Sitemap build anında dondurulmasın: yeni/kaldırılan vitrinler en geç 1 saat içinde yansır.
export const revalidate = 3600;

export default async function sitemap() {
  const staticPaths = [
    "",
    "/rehber",
    "/yetenegini-farket",
    "/rozet",
    "/kvkk-aydinlatma-metni",
    "/gizlilik-politikasi",
    "/kullanim-sartlari",
    "/mesafeli-satis-sozlesmesi",
    "/iptal-iade-kosullari",
  ];
  const staticEntries = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date("2026-09-21T00:00:00Z"),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.3,
  }));

  const rehberEntries = REHBER_POSTS.map((post) => ({
    url: `${BASE_URL}/rehber/${post.slug}`,
    lastModified: new Date("2026-09-21T00:00:00Z"),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const { data: services } = await supabase
    .from("services")
    .select("id, updated_at, created_at, city, is_remote, category_id, description, categories(slug)")
    .eq("active", true);

  // DEMO ve içeriği çok ince vitrinler sitemap'e girmez (sayfaları da noindex) —
  // aynı filtre artık kategori/şehir sayfalarında da kullanılıyor (lib/seoFormat.js).
  const indexable = (services || []).filter(isIndexableListing);
  const rowDate = (row) => new Date(row.updated_at || row.created_at || Date.now());
  const vitrinEntries = indexable.map((row) => ({
    url: `${BASE_URL}/vitrin/${row.id}`,
    lastModified: rowDate(row),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Kategori/şehir landing sayfaları sadece gerçekten yeterli aktif vitrini olan
  // kombinasyonlar için sitemap'e eklenir — ince sayfaları Google'a "buraya bak"
  // diye göndermemek için. Sayfaların kendisi aynı eşiklerle noindex olur
  // (MIN_CITY_LISTINGS / MIN_COMBO_LISTINGS), kategori için en az 1 gerçek vitrin.
  // "diger" bir yakalama kutusu (arama niyeti yok), asla sitemap'e girmez.
  // lastModified artık sabit bir tarih değil, o sayfadaki en yeni vitrin güncellemesi
  // (Google güvenilmez lastmod değerlerini yok sayar).
  // Yalnızca lib/seoTaxonomy.js'nin bildiği slug'lar sayfa üretir — DB'de var olup bu
  // listede henüz olmayan bir kategori slug'ı sitemap'e sızıp 404 veren bir URL üretmesin.
  const knownCategorySlugs = new Set(SEO_CATEGORIES.map((c) => c.slug));
  const categoryStats = new Map(); // slug -> { n, last }
  const cityStats = new Map();
  const comboStats = new Map();
  const bump = (map, key, date) => {
    const cur = map.get(key) || { n: 0, last: date };
    cur.n += 1;
    if (date > cur.last) cur.last = date;
    map.set(key, cur);
  };

  for (const row of indexable) {
    const date = rowDate(row);
    const categorySlug = row.categories?.slug;
    const knownCategory = categorySlug && categorySlug !== "diger" && knownCategorySlugs.has(categorySlug) ? categorySlug : null;
    if (knownCategory) bump(categoryStats, knownCategory, date);
    if (row.is_remote) continue;
    for (const city of SEO_CITIES) {
      if (matchesCitySlug(row.city, city.slug)) {
        bump(cityStats, city.slug, date);
        if (knownCategory) bump(comboStats, `${knownCategory}|${city.slug}`, date);
        break;
      }
    }
  }

  const categoryEntries = SEO_CATEGORIES.filter((c) => (categoryStats.get(c.slug)?.n || 0) >= 1).map((c) => ({
    url: `${BASE_URL}/kategori/${c.slug}`,
    lastModified: categoryStats.get(c.slug).last,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const cityEntries = [...cityStats.entries()].filter(([, s]) => s.n >= MIN_CITY_LISTINGS).map(([slug, s]) => ({
    url: `${BASE_URL}/sehir/${slug}`,
    lastModified: s.last,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const comboEntries = [...comboStats.entries()].filter(([, s]) => s.n >= MIN_COMBO_LISTINGS).map(([key, s]) => {
    const [categorySlug, citySlug] = key.split("|");
    return {
      url: `${BASE_URL}/kategori/${categorySlug}/${citySlug}`,
      lastModified: s.last,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...rehberEntries, ...vitrinEntries, ...categoryEntries, ...cityEntries, ...comboEntries];
}
