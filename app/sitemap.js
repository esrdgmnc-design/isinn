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

const BASE_URL = "https://www.isinn.com.tr";

export default async function sitemap() {
  const staticPaths = [
    "",
    "/kvkk-aydinlatma-metni",
    "/gizlilik-politikasi",
    "/kullanim-sartlari",
    "/mesafeli-satis-sozlesmesi",
    "/iptal-iade-kosullari",
  ];
  const staticEntries = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.3,
  }));

  const { data: services } = await supabase
    .from("services")
    .select("id, updated_at, created_at, city, is_remote, category_id, categories(slug)")
    .eq("active", true);

  const vitrinEntries = (services || []).map((row) => ({
    url: `${BASE_URL}/vitrin/${row.id}`,
    lastModified: new Date(row.updated_at || row.created_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Kategori/şehir landing sayfaları sadece gerçekten aktif vitrini olan
  // kombinasyonlar için sitemap'e eklenir — boş sayfaları Google'a "ince
  // içerik" olarak göndermemek için (bkz. SEO stratejisi dokümanı, madde 3).
  // Sayfaların kendisi her kombinasyon için çalışır (istek anında SSR), bu
  // filtre sadece hangilerinin Google'a "buraya bak" denildiğini belirliyor.
  // Yalnızca lib/seoTaxonomy.js'nin bildiği slug'lar sayfa üretir (o dosya
  // IsinnApp.jsx'teki listenin elle tutulan bir kopyası) — DB'de var olup bu
  // listede henüz olmayan bir kategori slug'ı (ör. ileride eklenen yeni bir
  // kategori) sitemap'e sızıp 404 veren bir URL üretmesin diye.
  const knownCategorySlugs = new Set(SEO_CATEGORIES.map((c) => c.slug));
  const categorySlugsWithContent = new Set();
  const citySlugsWithContent = new Set();
  const comboKeysWithContent = new Set();

  for (const row of services || []) {
    const categorySlug = row.categories?.slug;
    const knownCategory = categorySlug && knownCategorySlugs.has(categorySlug) ? categorySlug : null;
    if (knownCategory) categorySlugsWithContent.add(knownCategory);
    if (row.is_remote) continue;
    for (const city of SEO_CITIES) {
      if (matchesCitySlug(row.city, city.slug)) {
        citySlugsWithContent.add(city.slug);
        if (knownCategory) comboKeysWithContent.add(`${knownCategory}|${city.slug}`);
        break;
      }
    }
  }

  const categoryEntries = SEO_CATEGORIES.filter((c) => categorySlugsWithContent.has(c.slug)).map((c) => ({
    url: `${BASE_URL}/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const cityEntries = [...citySlugsWithContent].map((slug) => ({
    url: `${BASE_URL}/sehir/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const comboEntries = [...comboKeysWithContent].map((key) => {
    const [categorySlug, citySlug] = key.split("|");
    return {
      url: `${BASE_URL}/kategori/${categorySlug}/${citySlug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...vitrinEntries, ...categoryEntries, ...cityEntries, ...comboEntries];
}
