// Her yapay zekâ çağrısını (özellik, model, istem sürümü, token, gecikme, sonuç) kalıcı olarak kaydeder:
// özellik başına maliyet/gecikme/ret oranı artık ölçülebilir. İçerik (kullanıcı metni, model cevabı) ASLA
// kaydedilmez, yalnızca sayaçlar. Tablo yoksa (supabase/ai_calls_2026_10_05.sql henüz çalışmadıysa) ya da
// ağ hatası olursa sessizce geçer; çağrıyı asla yavaşlatmaz ya da bozmaz (kısa zaman aşımı).
// Yalnızca sunucuda çalışır (service role anahtarı).
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
