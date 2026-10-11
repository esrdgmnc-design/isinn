// Her yapay zekâ çağrısını (özellik, model, istem sürümü, token, gecikme, sonuç) kalıcı olarak kaydeder:
// özellik başına maliyet/gecikme/ret oranı artık ölçülebilir. İçerik (kullanıcı metni, model cevabı) ASLA
// kaydedilmez, yalnızca sayaçlar. Tablo yoksa (supabase/ai_calls_2026_10_05.sql henüz çalışmadıysa) ya da
// ağ hatası olursa sessizce geçer; çağrıyı asla yavaşlatmaz ya da bozmaz (kısa zaman aşımı).
// Yalnızca sunucuda çalışır (service role anahtarı).

// Günlük harcama tavanı: ani bir trafik dalgası (viral paylaşım, bot) üyeliksiz çalışan yapay zekâ özelliklerinden
// kontrolsüz fatura çıkarmasın. Bugünün (Türkiye saati) ai_calls satır sayısına bakar; sayı 60 sn önbelleğe alınır.
// Tablo yoksa ya da sorgu hata verirse tavan UYGULANMAZ (kullanıcıyı yanlışlıkla engellememek için).
const capCache = new Map();
function istanbulDayStartIso() {
  const now = new Date();
  const ist = new Date(now.getTime() + 3 * 3600 * 1000);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - 3 * 3600 * 1000).toISOString();
}
export async function aiCapReached({ feature = null, cap }) {
  try {
    if (!Number.isFinite(cap) || cap <= 0) return false;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return false;
    const cacheKey = feature || "*";
    const hit = capCache.get(cacheKey);
    if (hit && Date.now() - hit.at < 60000) return hit.n >= cap;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const filter = feature ? `&feature=eq.${encodeURIComponent(feature)}` : "";
    const res = await fetch(`${url}/rest/v1/ai_calls?select=id&created_at=gte.${encodeURIComponent(istanbulDayStartIso())}${filter}&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const n = parseInt((res.headers.get("content-range") || "").split("/")[1] || "", 10);
    if (!Number.isFinite(n)) return false;
    capCache.set(cacheKey, { at: Date.now(), n });
    return n >= cap;
  } catch {
    return false;
  }
}
export async function logAiCall({ feature, model, promptVersion = null, inputTokens = null, outputTokens = null, latencyMs = null, status = "ok", meta = null }) {
  try {
    console.log(JSON.stringify({ event: "ai_call", feature, model, promptVersion, inputTokens, outputTokens, latencyMs, status }));
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    await fetch(`${url}/rest/v1/ai_calls`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        feature: String(feature || "unknown").slice(0, 40),
        model: String(model || "").slice(0, 60),
        prompt_version: promptVersion ? String(promptVersion).slice(0, 30) : null,
        input_tokens: Number.isFinite(inputTokens) ? inputTokens : null,
        output_tokens: Number.isFinite(outputTokens) ? outputTokens : null,
        latency_ms: Number.isFinite(latencyMs) ? Math.round(latencyMs) : null,
        status: String(status).slice(0, 30),
        meta,
      }),
      signal: controller.signal,
    }).catch(() => {});
    clearTimeout(timer);
  } catch {
    // günlük asla ana akışı bozmaz
  }
}
