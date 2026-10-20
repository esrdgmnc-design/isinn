// Sayfa meta verisi için ortak yardımcılar. Next.js'te bir sayfa kendi openGraph/twitter alanını tanımlayınca layout'taki
// görsel (opengraph-image) düşüyor; bu yüzden her sayfa paylaşım kartı için görseli açıkça vermeli.
// (Teknik SEO denetimi: 40'tan fazla sayfada og:image / twitter:image yoktu.)
const BASE = "https://www.isinn.com.tr";

export const OG_IMAGE_URL = `${BASE}/opengraph-image`;
export const OG_IMAGES = [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: "İşinn: Freelance Uzman ve Hizmet Bul, Vitrinini Aç" }];

// openGraph + twitter alanlarını görselle birlikte üretir. image verilirse (ör. vitrin kapağı) o kullanılır.
export function socialMeta({ title, description, url, locale = "tr_TR", type = "website", image = null }) {
  const images = image ? [{ url: image }] : OG_IMAGES;
  return {
    openGraph: { title, description, url, siteName: "İşinn", locale, type, images },
    twitter: { card: "summary_large_image", title, description, images: [image || OG_IMAGE_URL] },
  };
}

// Kelime sınırında kısaltır (arama sonucunda başlık/açıklama ortadan kesilmesin).
export function clamp(text, max) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, s.lastIndexOf(" ", max - 1) > 20 ? s.lastIndexOf(" ", max - 1) : max - 1);
  return cut.replace(/[,.;:!\-–—]+$/, "") + "…";
}

// Vitrin açıklamasını arama sonucuna uygun düz metne çevirir: "DEMO VİTRİN" satırı, emoji ve satır başı madde imleri
// atılır; satırlar cümleye bağlanır.
export function cleanListingText(text) {
  const lines = String(text || "")
    .replace(/^\s*DEMO V[İI]TR[İI]N[^\n]*\n?/i, "")
    .replace(/[\p{Extended_Pictographic}️‍]/gu, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[•▪►✓✔✦\-*·]+|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
  return lines
    .map((l) => (/[.!?:…]$/.test(l) ? l : l + "."))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

// Vitrin sayfası meta açıklaması (2026-10-20, SEO ajanı şablonu): "{Başlık} — {Ad}, {konum}. {ilk cümle} {eylem çağrısı}",
// en fazla 160 karakter, kelime ortasında kesilmez. Önceden açıklamanın ilk 155 karakteri ham haliyle kullanılıyordu.
export function vitrinMetaDescription({ title, provider, place, description }) {
  const MAX = 160;
  const CTA = "Vitrini incele, mesaj gönder.";
  const body = cleanListingText(description);
  const sentence = (body.match(/^(.{20,}?[.!?])(\s|$)/) || [null, body])[1] || "";
  const t = String(title || "").replace(/\s+/g, " ").trim();
  const name = String(provider || "").trim();
  const showName = name && name.length <= 30 && !sentence.toLocaleLowerCase("tr-TR").startsWith(name.toLocaleLowerCase("tr-TR")) && !t.toLocaleLowerCase("tr-TR").includes(name.toLocaleLowerCase("tr-TR"));
  let out = `${t}${showName ? ` — ${name}` : ""}${place ? `, ${place}` : ""}.`;
  if (out.length > MAX) return clamp(out, MAX);
  const room = MAX - out.length - 1;
  if (sentence && sentence.length <= room) {
    out += " " + sentence;
    if (out.length + 1 + CTA.length <= MAX) out += " " + CTA;
  } else if (sentence && room >= 40) {
    out += " " + clamp(sentence, room);
  } else if (CTA.length <= room) {
    out += " " + CTA;
  }
  return out;
}

// Kullanıcının yüklediği (ham Supabase) görseli paylaşım kartı için küçültülmüş adresten ver:
// WhatsApp/Telegram ~300 KB üstü önizlemeyi göstermiyor; aynı dosya optimize edilince 2 MB'tan ~130 KB'a iniyor.
export function optimizedImageUrl(src, width = 1200) {
  if (!src) return null;
  return `${BASE}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
