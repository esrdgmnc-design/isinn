// This route keeps the Anthropic API key on the server, never exposed to the browser.
// Add your key as an environment variable named ANTHROPIC_API_KEY in Vercel's project
// settings (Settings -> Environment Variables) before deploying, or in a local .env.local
// file for development. Get a key at https://console.anthropic.com/settings/keys
//
// GÜVENLİK: bu route eskiden hiçbir kısıtlama olmadan herkese açıktı — giriş
// yapmadan bile herkes buraya istediği isteği atıp ANTHROPIC_API_KEY'i
// kullanarak Anthropic'e ücretli çağrı yaptırabiliyordu (kötüye
// kullanılırsa faturaya çıkar). Anonim tarama/arama akışları (örn. AI
// arama-genişletme) login gerektirmediği için burayı sert bir "giriş yapmış
// olmalısın" duvarına çevirmedik — onun yerine iki pratik sınır kondu:
// (1) IP başına rate limit, (2) model/max_tokens için makul bir tavan —
// tek bir isteğin/istemcinin maliyeti sınırsız büyütmesini engelliyor.
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";
import { logAiCall } from "../../../lib/aiLog";

// Vitrin taslağı da üreten Yeteneğini Farket yanıtı ~15-25 sn sürebiliyor; Vercel'in
// varsayılan fonksiyon süresi (Hobby'de 10 sn) bunu üretimde 504 ile keserdi.
export const maxDuration = 60;

const ALLOWED_MODELS = new Set(["claude-sonnet-4-6"]);
const MAX_TOKENS_CAP = 1200; // uygulamadaki en yüksek gerçek kullanım 1000 (bkz. IsinnApp.jsx)
const MAX_PROMPT_CHARS = 12000;
const MAX_SYSTEM_CHARS = 14000; // eskiden system sınırsızdı: ücretsiz LLM vekili riski
const MAX_MESSAGES = 12;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY ortam değişkeni ayarlanmamış. Vercel proje ayarlarından ekleyin." },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);
  // Varsayılan 30/5 dk. Salonda herkes aynı Wi-Fi'de (aynı IP) olacağı bir
  // etkinlik günü için Vercel'de CLAUDE_RATE_LIMIT ortam değişkeniyle geçici
  // olarak yükseltilebilir (kod değiştirmeden) — etkinlikten sonra sil.
  const limit = Math.min(Math.max(parseInt(process.env.CLAUDE_RATE_LIMIT || "30", 10) || 30, 5), 500);
  if (!checkRateLimit(`claude:${ip}`, { limit, windowMs: 5 * 60 * 1000 })) {
    return Response.json({ error: "Çok fazla istek gönderildi. Birkaç dakika sonra tekrar dene." }, { status: 429 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Geçersiz istek." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Geçersiz istek." }, { status: 400 });

  if (!ALLOWED_MODELS.has(body.model)) {
    return Response.json({ error: "Desteklenmeyen model." }, { status: 400 });
  }
  if (typeof body.max_tokens !== "number" || body.max_tokens <= 0) {
    return Response.json({ error: "Geçersiz max_tokens." }, { status: 400 });
  }
  body.max_tokens = Math.min(body.max_tokens, MAX_TOKENS_CAP);

  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Geçersiz mesajlar." }, { status: 400 });
  }
  const promptChars = JSON.stringify(body.messages).length;
  if (promptChars > MAX_PROMPT_CHARS) {
    return Response.json({ error: "İstek çok uzun." }, { status: 400 });
  }
  if (body.system != null && (typeof body.system !== "string" || body.system.length > MAX_SYSTEM_CHARS)) {
    return Response.json({ error: "Sistem istemi geçersiz ya da çok uzun." }, { status: 400 });
  }

  // Yalnızca bilinen alanlar Anthropic'e iletilir (tools, stream, metadata vb. atılır).
  const upstreamBody = { model: body.model, max_tokens: body.max_tokens, messages: body.messages };
  if (typeof body.system === "string") upstreamBody.system = body.system;
  if (typeof body.temperature === "number" && body.temperature >= 0 && body.temperature <= 1) upstreamBody.temperature = body.temperature;
  const feature = typeof body.feature === "string" ? body.feature.replace(/[^a-z0-9_-]/gi, "").slice(0, 40) : "claude_proxy";
  const started = Date.now();

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(upstreamBody),
  });

  const data = await anthropicResponse.json();
  await logAiCall({
    feature, model: body.model, latencyMs: Date.now() - started,
    inputTokens: data?.usage?.input_tokens, outputTokens: data?.usage?.output_tokens,
    status: anthropicResponse.ok ? "ok" : "upstream_" + anthropicResponse.status,
  });
  return Response.json(data, { status: anthropicResponse.status });
}
