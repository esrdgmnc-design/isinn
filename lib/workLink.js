// "Çalışmalarımı gör" bağlantısı: yalnızca Instagram, YouTube, TikTok ve LinkedIn PROFİL/KANAL/SAYFA adresleri.
// Serbest web adresi, kısaltıcı (bit.ly), link-in-bio (linktr.ee), mesajlaşma (wa.me, t.me) ve
// satış siteleri (trendyol, etsy, shopier...) bilerek kabul edilmez — hepsi izinli alan adı
// listesinin dışında kaldığı için tek hamlede reddedilir. Aynı kurallar veritabanında da
// uygulanır (supabase/work_link_2026_10_05.sql); ikisi birlikte güncellenmeli.
// Saf fonksiyonlar: DOM/ağ yok.

const IG_USER = /^[A-Za-z0-9._]{1,30}$/;
const TT_USER = /^[A-Za-z0-9._]{2,24}$/;
const YT_HANDLE = /^@[A-Za-z0-9._-]{3,30}$/;
const YT_ID = /^[A-Za-z0-9._-]{1,60}$/;
const LI_SLUG = /^[A-Za-z0-9_%-]{3,100}$/;
const IG_RESERVED = new Set(["p", "reel", "reels", "tv", "stories", "explore", "accounts", "direct", "s", "share"]);

export const WORK_LINK_PLATFORMS = ["instagram", "tiktok", "youtube", "linkedin"];

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
  return { ok: false, reason: "platform" };
}

// Gösterirken savunma derinliği: veritabanından gelen değer yine de normalize edilir; geçersizse hiç gösterilmez.
export function safeWorkLink(stored) {
  const r = normalizeWorkLink(stored);
  if (!r.ok || !r.url || r.url !== String(stored).trim()) return null;
  const host = new URL(r.url).hostname.replace(/^www\./, "");
  return { url: r.url, platform: r.platform, host };
}
