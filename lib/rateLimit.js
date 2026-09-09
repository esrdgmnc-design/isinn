// Basit, bellek-içi (in-memory) rate limiter. Redis/Upstash gibi ayrı bir
// altyapı olmadan "tamamen sınırsız" durumundan "sınırlı" duruma geçmek için
// yeterli bir ilk savunma katmanı — tek sunucu instance'ında güvenilir
// çalışır. Not: eğer ileride Vercel gibi çoklu/serverless instance'lara
// yayılan bir dağıtım kullanılırsa bu sayaçlar instance'lar arasında
// paylaşılmaz (her instance kendi belleğinde sayar) — o noktada gerçek bir
// paylaşılan store (Upstash Redis vb.) gerekir. Şimdilik "tamamen açık uç
// noktayı" kapatan, ek bağımlılık gerektirmeyen pratik bir önlem.
const buckets = new Map();

// Bellek şişmesin diye eskiyen kovaları arada temizle.
function sweep(now) {
  for (const [key, entry] of buckets) {
    if (now - entry.start > entry.windowMs) buckets.delete(key);
  }
}

/**
 * @param {string} key - limit anahtarı (örn. `${ip}:/api/claude`)
 * @param {{limit:number, windowMs:number}} opts
 * @returns {boolean} true = izinli, false = limit aşıldı
 */
export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  if (buckets.size > 5000) sweep(now);

  const entry = buckets.get(key);
  if (!entry || now - entry.start > windowMs) {
    buckets.set(key, { start: now, count: 1, windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
