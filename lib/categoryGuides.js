// Kategori sayfalarından ilgili Türkçe rehber yazılarına iç bağlantı (hem ziyaretçi hem arama motoru için).
// Yalnızca gerçekten var olan yazılar bağlanır (findRehberPost); eşleşme yoksa genel "ilk vitrin" yazıları kullanılır.
import { findRehberPost } from "./rehberContent";

const DEFAULT_GUIDES = [
  "ilk-vitrinini-nasil-hazirlarsin",
  "hizmet-fiyati-nasil-belirlenir-saatlik-sabit-teklif",
  "musteriye-ilk-mesaj-ve-yazili-anlasma-sablonlari",
];

const GROUPS = [
  { slugs: ["ogretmen", "muzik-egitmeni", "kodlama-egitmeni", "direksiyon-egitmeni"], guides: ["iyi-ozel-ders-ogretmeni-nasil-secilir", "ozel-ders-vermek-icin-ne-gerekir", "lgs-hazirlik-sureci-nasil-planlanir"] },
  { slugs: ["temizlik", "hali-yikama", "bocek-ilaclama"], guides: ["ev-temizligi-kac-saat-surer"] },
  { slugs: ["tadilat", "boya-badana", "elektrikci", "su-tesisatcisi", "klima-beyaz-esya", "cilingir", "teknik-servis"], guides: ["ev-tadilatinda-usta-secerken-nelere-dikkat-edilmeli"] },
  { slugs: ["bakici", "hasta-bakici", "logusa-bakicisi", "oyun-ablasi"], guides: ["cocuk-bakicisi-secerken-sorulmasi-gereken-sorular"] },
  { slugs: ["egitmen", "cocuk-atolyesi", "el-sanatlari-atolyesi", "seramik-atolyesi", "dikis-orgu-atolyesi", "resim-sanat-atolyesi", "mutfak-atolyesi", "geleneksel-sanatlar-atolyesi"], guides: ["evden-ders-ve-atolye-vermek", "evde-cocuk-atolyesi-vermeden-once-dikkat-edilecekler"] },
  { slugs: ["yazilim", "muhendis", "teknik-servis"], guides: ["yazilimci-ve-muhendis-icin-freelance-vitrin-nasil-yazilir", "danismanlik-ve-mentorluk-hizmeti-nasil-paketlenir", "sirket-kurmadan-hizmet-sunmak"] },
  { slugs: ["psikolog", "avukat", "muhasebe", "diyetisyen", "fizyoterapist", "yoga-koc", "emzirme-danismani"], guides: ["danismanlik-ve-mentorluk-hizmeti-nasil-paketlenir", "hizmet-fiyati-nasil-belirlenir-saatlik-sabit-teklif"] },
  { slugs: ["sosyal-medya", "dijital", "tasarim", "icerik-yazarligi", "video-duzenleme", "seslendirme", "sanal-asistan", "ceviri", "profesyonel-fotograf"], guides: ["birkac-bin-takipci-ile-yerel-isletmelerden-sponsorluk", "sirket-kurmadan-hizmet-sunmak", "ek-gelir-ve-freelance-is-yollari"] },
];

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
