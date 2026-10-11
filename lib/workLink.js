// "Çalışmalarımı gör" bağlantısı: Instagram, YouTube, TikTok ve LinkedIn PROFİL/KANAL/SAYFA adresleri
// ya da kişinin kendi web sitesi (https, düz alan adı, en çok 4 yol parçası; sorgu/parça/port/kullanıcı bilgisi yok).
// Kısaltıcı (bit.ly), link-in-bio (linktr.ee), mesajlaşma (wa.me, t.me), pazaryeri/satış platformları (trendyol, etsy,
// shopier...), diğer sosyal ağlar ve dosya paylaşım adresleri bilerek kabul edilmez (WEB_DENY). Aynı kurallar veritabanında
// da uygulanır (supabase/work_link_website_2026_10_11.sql); ikisi birlikte güncellenmeli.
// Saf fonksiyonlar: DOM/ağ yok.

const IG_USER = /^[A-Za-z0-9._]{1,30}$/;
const TT_USER = /^[A-Za-z0-9._]{2,24}$/;
const YT_HANDLE = /^@[A-Za-z0-9._-]{3,30}$/;
const YT_ID = /^[A-Za-z0-9._-]{1,60}$/;
const LI_SLUG = /^[A-Za-z0-9_%-]{3,100}$/;
const WEB_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const WEB_SEG = /^[A-Za-z0-9._~%-]{1,60}$/;
export const WEB_DENY = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "cutt.ly", "rb.gy", "is.gd", "ow.ly", "shorturl.at", "we.tl",
  "linktr.ee", "beacons.ai", "lnk.bio", "taplink.cc", "carrd.co", "bio.link", "linkin.bio",
  "wa.me", "whatsapp.com", "t.me", "telegram.me", "telegram.org",
  "facebook.com", "fb.com", "fb.me", "x.com", "twitter.com", "pinterest.com",
  "trendyol.com", "hepsiburada.com", "n11.com", "etsy.com", "shopier.com", "ciceksepeti.com", "sahibinden.com", "dolap.com",
  "gittigidiyor.com", "letgo.com", "aliexpress.com", "temu.com", "myshopify.com", "amazon.com", "amazon.com.tr",
  "drive.google.com", "docs.google.com", "dropbox.com", "wetransfer.com", "mega.nz",
  "youtu.be", "vm.tiktok.com", "vt.tiktok.com", "bitly.com", "lnkd.in", "ig.me", "instagr.am", "wa.link", "forms.gle", "pin.it", "fb.watch", "discord.gg", "discord.com", "snapchat.com", "t.ly", "kisa.link", "sites.google.com", "translate.goog", "web.archive.org", "ebay.com", "armut.com", "shein.com", "fiverr.com", "amazon.de", "web.app", "github.io", "nip.io", "sslip.io",
];
// Riskli/özel uzantılar ve marka taklidi: bu sözcükleri içeren alan adları (ör. instagram.com.evil.com, isinn-giris.com) reddedilir.
const WEB_BAD_TLD = new Set(["tk", "ml", "ga", "cf", "gq", "zip", "mov", "local", "internal", "test", "localhost", "invalid", "onion", "xyz", "top", "click", "icu"]);
const WEB_BRAND = /(instagram|tiktok|youtube|linkedin|whatsapp|facebook|isinn|banka|giris|login|signin|password|sifre)/;
const IG_RESERVED = new Set(["p", "reel", "reels", "tv", "stories", "explore", "accounts", "direct", "s", "share"]);

export const WORK_LINK_PLATFORMS = ["instagram", "tiktok", "youtube", "linkedin"];

// Kendi web sitesi: ASCII alan adı (punycode/IP/localhost yok), kök ya da kısa yol. Kanonik biçim: https://alan.adi/ ya da https://alan.adi/yol
function buildWebsite(u) {
  const host = u.hostname.toLowerCase();
  const labels = host.split(".");
  if (host.length > 100 || labels.length < 2 || !labels.every((l) => WEB_LABEL.test(l)) || !/^[a-z]{2,24}$/.test(labels[labels.length - 1]) || labels.some((l) => l.startsWith("xn--"))) return null;
  if (WEB_BAD_TLD.has(labels[labels.length - 1]) || WEB_BRAND.test(host) || WEB_DENY.some((d) => host === d || host.endsWith("." + d))) return { denied: true };
  const segs = u.pathname.split("/").filter(Boolean);
  if (segs.length > 4 || !segs.every((s) => WEB_SEG.test(s) && s !== "." && s !== ".." && !/%2f|%5c|%3a|%3f/i.test(s))) return null;
  return { url: "https://" + host + "/" + segs.join("/") };
}

// LinkedIn: kişi profili (/in/) ya da şirket sayfası (/company/); yalnızca kullanıcı adı yazılırsa kişi profili varsayılır.
function buildLinkedIn(kind, slug) {
  return (kind === "in" || kind === "company") && LI_SLUG.test(slug) ? `https://www.linkedin.com/${kind}/${slug}/` : null;
}

function build(platform, handle) {
  if (platform === "linkedin") return buildLinkedIn("in", handle);
  if (platform === "instagram") return IG_USER.test(handle) ? `https://www.instagram.com/${handle}/` : null;
  if (platform === "tiktok") return TT_USER.test(handle) ? `https://www.tiktok.com/@${handle}` : null;
  if (platform === "youtube") return YT_HANDLE.test(`@${handle}`) ? `https://www.youtube.com/@${handle}` : null;
  return null;
}

// raw: kullanıcının yazdığı metin; platformHint: yalnızca "@kullanici" gibi adres olmayan girişler için.
// Dönüş: { ok:true, url:null } (boş = bağlantıyı kaldır) | { ok:true, url, platform } | { ok:false, reason, needsPlatform? }
// reason: "format" | "post" | "platform"
export function normalizeWorkLink(raw, platformHint = "instagram") {
  const text = String(raw || "").trim();
  if (!text) return { ok: true, url: null };
  if (text.length > 300 || /\s/.test(text)) return { ok: false, reason: "format" };

  // Yalnızca kullanıcı adı: "@ilayda" ya da "ilayda" (nokta/eğik çizgi yok, alan adı gibi değil).
  if (/^@?[A-Za-z0-9_]{2,30}$/.test(text) || /^@[A-Za-z0-9._-]{2,30}$/.test(text) || /^[A-Za-z0-9_-]{3,100}$/.test(text)) {
    const handle = text.replace(/^@/, "");
    const url = build(WORK_LINK_PLATFORMS.includes(platformHint) ? platformHint : "instagram", handle);
    // needsPlatform: hangi platform olduğu sorulur (tireli kullanıcı adı Instagram'da geçersiz olsa da LinkedIn için olabilir)
    return url ? { ok: true, url, platform: platformHint, needsPlatform: true } : { ok: false, reason: "format", needsPlatform: true };
  }

  let candidate = text;
  if (/^http:\/\//i.test(candidate)) candidate = "https://" + candidate.slice(7);
  if (!/^https:\/\//i.test(candidate)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(candidate)) return { ok: false, reason: "format" }; // javascript:, data: vb.
    candidate = "https://" + candidate.replace(/^\/+/, "");
  }
  let u;
  try { u = new URL(candidate); } catch { return { ok: false, reason: "format" }; }
  if (u.protocol !== "https:" || u.username || u.password || u.port) return { ok: false, reason: "format" };

  const host = u.hostname.toLowerCase().replace(/^(www|m)\./, "");
  const segs = u.pathname.split("/").filter(Boolean);

  if (host === "instagram.com") {
    const first = segs[0] || "";
    if (!first) return { ok: false, reason: "format" };
    if (IG_RESERVED.has(first.toLowerCase())) return { ok: false, reason: "post" };
    const url = build("instagram", first);
    return url ? { ok: true, url, platform: "instagram" } : { ok: false, reason: "format" };
  }
  if (host === "tiktok.com") {
    const first = segs[0] || "";
    if (!first.startsWith("@")) return { ok: false, reason: first ? "post" : "format" };
    const url = build("tiktok", first.slice(1));
    return url ? { ok: true, url, platform: "tiktok" } : { ok: false, reason: "format" };
  }
  if (/^(?:[a-z]{2,3}\.)?linkedin\.com$/.test(host)) {
    const [kind, slug] = segs;
    if (!kind) return { ok: false, reason: "format" };
    if (kind !== "in" && kind !== "company") return { ok: false, reason: "post" };
    const url = slug ? buildLinkedIn(kind, slug) : null;
    return url ? { ok: true, url, platform: "linkedin" } : { ok: false, reason: "format" };
  }
  if (host === "youtube.com") {
    const [a, b] = segs;
    if (a && a.startsWith("@") && YT_HANDLE.test(a)) return { ok: true, url: `https://www.youtube.com/${a}`, platform: "youtube" };
    if ((a === "channel" || a === "c" || a === "user") && b && YT_ID.test(b)) return { ok: true, url: `https://www.youtube.com/${a}/${b}`, platform: "youtube" };
    return { ok: false, reason: a ? "post" : "format" };
  }
  const web = buildWebsite(u);
  if (web?.url) return { ok: true, url: web.url, platform: "web" };
  return { ok: false, reason: web?.denied ? "platform" : "format" };
}

// Gösterirken savunma derinliği: veritabanından gelen değer yine de normalize edilir; geçersizse hiç gösterilmez.
export function safeWorkLink(stored) {
  const r = normalizeWorkLink(stored);
  if (!r.ok || !r.url || r.url !== String(stored).trim()) return null;
  const host = new URL(r.url).hostname.replace(/^www\./, "");
  return { url: r.url, platform: r.platform, host };
}
