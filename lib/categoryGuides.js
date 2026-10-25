// Kategori sayfalarından ilgili Türkçe rehber yazılarına iç bağlantı (hem ziyaretçi hem arama motoru için).
// Yalnızca gerçekten var olan yazılar bağlanır (findRehberPost); eşleşme yoksa genel "ilk vitrin" yazıları kullanılır.
import { findRehberPost } from "./rehberContent";
import { supabase } from "./supabaseClient";
import { SEO_CATEGORIES, categorySeoName } from "./seoTaxonomy";
import { isIndexableListing, MIN_CATEGORY_LISTINGS } from "./seoFormat";

const DEFAULT_GUIDES = [
  "ilk-vitrinini-nasil-hazirlarsin",
  "hizmet-fiyati-nasil-belirlenir-saatlik-sabit-teklif",
  "musteriye-ilk-mesaj-ve-yazili-anlasma-sablonlari",
];

const GROUPS = [
  { slugs: ["ogretmen", "muzik-egitmeni", "kodlama-egitmeni", "direksiyon-egitmeni"], guides: ["iyi-ozel-ders-ogretmeni-nasil-secilir", "ozel-ders-vermek-icin-ne-gerekir", "lgs-hazirlik-sureci-nasil-planlanir"] },
  { slugs: ["temizlik", "hali-yikama", "bocek-ilaclama"], guides: ["ev-temizligi-kac-saat-surer"] },
  { slugs: ["tadilat", "boya-badana", "elektrikci", "su-tesisatcisi", "klima-beyaz-esya", "cilingir", "teknik-servis"], guides: ["ev-tadilatinda-usta-secerken-nelere-dikkat-edilmeli"] },
  { slugs: ["bakici", "hasta-bakici", "logusa-bakicisi", "oyun-ablasi"], guides: ["yasli-bakicisi-ile-gorusmede-sorulacak-sorular", "cocuk-bakicisi-secerken-sorulmasi-gereken-sorular"] },
  { slugs: ["egitmen", "cocuk-atolyesi", "el-sanatlari-atolyesi", "seramik-atolyesi", "dikis-orgu-atolyesi", "resim-sanat-atolyesi", "mutfak-atolyesi", "geleneksel-sanatlar-atolyesi"], guides: ["evden-ders-ve-atolye-vermek", "evde-cocuk-atolyesi-vermeden-once-dikkat-edilecekler"] },
  { slugs: ["yazilim", "muhendis", "teknik-servis"], guides: ["web-sitesi-freelancer-mi-ajans-mi", "yazilimci-ve-muhendis-icin-freelance-vitrin-nasil-yazilir", "freelance-musteri-nasil-bulunur-komisyonsuz-yollar", "danismanlik-ve-mentorluk-hizmeti-nasil-paketlenir"] },
  { slugs: ["danismanlik", "psikolog", "avukat", "muhasebe", "diyetisyen", "fizyoterapist", "yoga-koc", "emzirme-danismani"], guides: ["danismanlik-ve-mentorluk-hizmeti-nasil-paketlenir", "hizmet-fiyati-nasil-belirlenir-saatlik-sabit-teklif"] },
  { slugs: ["ceviri"], guides: ["cevirmen-secerken-nelere-dikkat-edilmeli", "freelancer-ile-calismadan-once-sorulacak-sorular", "freelance-iste-revizyon-hakki-kac-olmali"] },
  { slugs: ["sosyal-medya", "dijital", "tasarim", "icerik-yazarligi", "video-duzenleme", "seslendirme", "sanal-asistan", "profesyonel-fotograf"], guides: ["logo-tasarimcisi-secerken-nelere-dikkat-edilmeli", "freelancer-ile-calismadan-once-sorulacak-sorular", "freelance-iste-revizyon-hakki-kac-olmali", "freelance-musteri-nasil-bulunur-komisyonsuz-yollar", "freelance-portfolyo-sifir-referansla-nasil-hazirlanir", "hizmet-vitrini-aciklamasi-nasil-yazilir"] },
];

// Ters yön (2026-10-25): rehberden, o rehberi öneren kategorilere bağlantı. Yalnızca indekslenebilir (yeterli gerçek
// vitrini olan) kategoriler döner; boş kategori sayfasına bağlantı verilmez. Veri alınamazsa boş liste.
export async function getGuideCategories(guideSlug, limit = 4) {
  const slugs = [...new Set(GROUPS.filter((g) => g.guides.includes(guideSlug)).flatMap((g) => g.slugs))];
  if (!slugs.length) return [];
  try {
    const { data } = await supabase.from("services").select("city, description, categories(slug)").eq("active", true).limit(1000);
    const counts = {};
    for (const r of (data || []).filter(isIndexableListing)) { const s = r.categories?.slug; if (s) counts[s] = (counts[s] || 0) + 1; }
    return SEO_CATEGORIES.filter((c) => slugs.includes(c.slug) && (counts[c.slug] || 0) >= MIN_CATEGORY_LISTINGS)
      .sort((a, b) => (counts[b.slug] || 0) - (counts[a.slug] || 0)).slice(0, limit)
      .map((c) => ({ slug: c.slug, name: categorySeoName(c) }));
  } catch {
    return [];
  }
}

export function getCategoryGuides(categorySlug) {
  const group = GROUPS.find((g) => g.slugs.includes(categorySlug));
  const wanted = [...(group ? group.guides : []), ...DEFAULT_GUIDES];
  const seen = new Set();
  const out = [];
  for (const slug of wanted) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const post = findRehberPost(slug);
    if (post && post.lang !== "en") out.push({ slug: post.slug, title: post.title });
    if (out.length === 3) break;
  }
  return out;
}
