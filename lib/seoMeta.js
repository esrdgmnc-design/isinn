// Sayfa meta verisi için ortak yardımcılar. Next.js'te bir sayfa kendi openGraph/twitter alanını tanımlayınca layout'taki
// görsel (opengraph-image) düşüyor; bu yüzden her sayfa paylaşım kartı için görseli açıkça vermeli.
// (Teknik SEO denetimi: 40'tan fazla sayfada og:image / twitter:image yoktu.)
const BASE = "https://www.isinn.com.tr";

export const OG_IMAGE_URL = `${BASE}/opengraph-image`;
export const OG_IMAGES = [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: "İşinn: Becerinden Hizmet Vitrini" }];

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

// Kullanıcının yüklediği (ham Supabase) görseli paylaşım kartı için küçültülmüş adresten ver:
// WhatsApp/Telegram ~300 KB üstü önizlemeyi göstermiyor; aynı dosya optimize edilince 2 MB'tan ~130 KB'a iniyor.
export function optimizedImageUrl(src, width = 1200) {
  if (!src) return null;
  return `${BASE}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
