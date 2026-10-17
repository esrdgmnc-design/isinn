// "Ne arıyorsun?" — üyeliksiz ziyaretçinin kendi cümlesiyle yazdığı ihtiyacı gerçek vitrinlerle eşleştirir.
// Asıl mantık lib/needMatchRun.js'te (kuru çalıştırma: evals/needmatch-dry.mjs).
// Koruma katmanları (en ucuzdan pahalıya): kapatma anahtarı → IP sınırı → anlamlı metin süzgeci →
// önbellek → günlük tavan → yapay zekâ. Ham metin hiçbir yere yazılmaz; ai_calls'a yalnızca
// sayaçlar + kategori/il/sonuç kovası gider.
// YAYIN NOTU: NEED_MATCH_ENABLED=1 olmadan uç nokta kapalıdır. Anthropic ile KVKK standart sözleşmesi
// imzalanıp Kurul'a bildirilmeden canlıda açılmamalı (hukuk incelemesi, 2026-10-17).
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";
import { logAiCall, aiCapReached } from "../../../lib/aiLog";
import { isMeaningful, normalizeText, MAX_TEXT } from "../../../lib/needMatchCore";
import { runNeedMatch } from "../../../lib/needMatchRun";

const PROMPT_VERSION = "need-v1";
export const maxDuration = 20;

// Aynı metin tekrar yazılırsa ikinci kez ücret çıkmasın (örnek başına bellek; ham metin değil özet anahtar).
const cache = new Map();
const CACHE_MS = 10 * 60 * 1000;
function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_MS) { cache.delete(key); return null; }
  return hit.value;
}
function cacheSet(key, value) {
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  cache.set(key, { at: Date.now(), value });
}

// İstemciye yalnızca bunlar gider (yapay zekâ metni, puan, havuz büyüklüğü gitmez).
const publicShape = (r) => ({ kind: r.kind, results: r.results, noMatch: r.noMatch, prefill: r.prefill });

export async function POST(request) {
  if (process.env.NEED_MATCH_ENABLED !== "1") return Response.json({ error: "disabled" }, { status: 503 });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!apiKey || !serviceKey) return Response.json({ error: "config" }, { status: 500 });

  const ip = getClientIp(request);
  // Not: bellek içi sayaç örnek başınadır (Vercel'de ilk süzgeç); asıl sigorta aşağıdaki günlük tavan.
  if (!checkRateLimit(`need:10m:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 }) || !checkRateLimit(`need:day:${ip}`, { limit: 30, windowMs: 24 * 60 * 60 * 1000 })) {
    return Response.json({ error: "rate" }, { status: 429 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "bad_request" }, { status: 400 }); }
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, MAX_TEXT) : "";
  if (!isMeaningful(text)) return Response.json({ kind: "vague", results: [], noMatch: true, prefill: null });

  const key = createHash("sha256").update(normalizeText(text)).digest("hex");
  const cached = cacheGet(key);
  if (cached) return Response.json(cached);

  const needCap = parseInt(process.env.NEED_DAILY_CAP || "100", 10) || 100;
  const totalCap = parseInt(process.env.AI_DAILY_CAP_TOTAL || "3000", 10) || 3000;
  if ((await aiCapReached({ feature: "need-match", cap: needCap })) || (await aiCapReached({ cap: totalCap }))) {
    // Tavan dolunca kutu kapanmaz: kişi talep yayınlama yoluna yönlendirilir.
    return Response.json({ kind: "busy", results: [], noMatch: true, prefill: null });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  let result;
  try {
    result = await runNeedMatch({ admin, text, apiKey });
  } catch (err) {
    console.error("need-match", err?.message);
    return Response.json({ kind: "busy", results: [], noMatch: true, prefill: null });
  }
  if (result.usage) {
    await logAiCall({
      feature: "need-match", model: result.usage.model, promptVersion: PROMPT_VERSION,
      inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens, latencyMs: result.usage.latencyMs,
      status: result.aiStatus || "ok",
      meta: { kind: result.kind, category: result.log?.category || null, province: result.log?.province || null, results: result.log?.results ?? 0 },
    });
  }
  const out = publicShape(result);
  if (result.aiStatus === "ok" || result.ai === false) cacheSet(key, out);
  return Response.json(out);
}
