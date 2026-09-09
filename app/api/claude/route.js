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

const ALLOWED_MODELS = new Set(["claude-sonnet-4-6"]);
const MAX_TOKENS_CAP = 1200; // uygulamadaki en yüksek gerçek kullanım 1000 (bkz. IsinnApp.jsx)
const MAX_PROMPT_CHARS = 12000;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY ortam değişkeni ayarlanmamış. Vercel proje ayarlarından ekleyin." },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`claude:${ip}`, { limit: 30, windowMs: 5 * 60 * 1000 })) {
    return Response.json({ error: "Çok fazla istek gönderildi. Birkaç dakika sonra tekrar dene." }, { status: 429 });
  }

  const body = await request.json();

  if (!ALLOWED_MODELS.has(body.model)) {
    return Response.json({ error: "Desteklenmeyen model." }, { status: 400 });
  }
  if (typeof body.max_tokens !== "number" || body.max_tokens <= 0) {
    return Response.json({ error: "Geçersiz max_tokens." }, { status: 400 });
  }
  body.max_tokens = Math.min(body.max_tokens, MAX_TOKENS_CAP);

  const promptChars = JSON.stringify(body.messages || []).length;
  if (promptChars > MAX_PROMPT_CHARS) {
    return Response.json({ error: "İstek çok uzun." }, { status: 400 });
  }

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  const data = await anthropicResponse.json();
  return Response.json(data, { status: anthropicResponse.status });
}
