// Yeteneğini Farket sunucu uç noktası. Eskiden istemci prompt'u kendisi kurup
// genel /api/claude vekiline gönderiyordu (herkes herhangi bir prompt
// gönderebiliyordu). Artık istemci yalnızca yapılandırılmış alanları gönderir;
// prompt, kategori listesi (veritabanından), güvenlik denetimi ve hız sınırı
// burada. Kullanıcının yazdığı metin loglanmaz — yalnızca token sayıları.
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";
import { allowedTalentCategories, buildTalentPrompt, parseTalentResponse } from "../../../lib/talentCore";

// Taslaklı yanıt ~15-25 sn sürüyor; Vercel'in varsayılan fonksiyon süresi bunu keserdi.
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";
const REMOTE_KEYS = new Set(["", "home", "local", "any"]);

let categoryCache = { at: 0, rows: null };
async function loadCategories() {
  const now = Date.now();
  if (categoryCache.rows && now - categoryCache.at < 5 * 60 * 1000) return categoryCache.rows;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/categories?select=slug,name,mode`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error("categories");
  const rows = (await res.json()).map((r) => ({ id: r.slug, name: r.name, mode: r.mode }));
  categoryCache = { at: now, rows };
  return rows;
}

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const idList = (v, maxItems) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.length <= 40).slice(0, maxItems) : []);

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: "api" }, { status: 500 });

  // Salonda herkes aynı IP'de olabilir: TALENT_RATE_LIMIT ile geçici yükseltilebilir.
  const limit = Math.min(Math.max(parseInt(process.env.TALENT_RATE_LIMIT || "20", 10) || 20, 5), 500);
  if (!checkRateLimit(`talent:${getClientIp(request)}`, { limit, windowMs: 5 * 60 * 1000 })) {
    return Response.json({ error: "rate" }, { status: 429 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "bad_request" }, { status: 400 }); }
  const input = {
    skills: str(body?.skills, 600),
    hours: str(body?.hours, 60),
    budget: str(body?.budget, 60),
    remote: str(body?.remote, 40),
    experience: str(body?.experience, 400),
    district: str(body?.district, 80),
  };
  if (!input.skills) return Response.json({ error: "bad_request" }, { status: 400 });
  const remoteKey = REMOTE_KEYS.has(body?.remoteKey) ? body.remoteKey : "";
  const excludeIds = idList(body?.excludeIds, 40);
  const objection = str(body?.objection, 300);
  const clientIds = idList(body?.categoryIds, 120);

  let rows;
  try { rows = await loadCategories(); } catch { return Response.json({ error: "api" }, { status: 502 }); }
  const pool = clientIds.length ? rows.filter((r) => clientIds.includes(r.id)) : rows.filter((r) => r.id !== "diger");
  const allowed = allowedTalentCategories(pool, { excludeIds, remoteKey });
  if (allowed.length < 3) return Response.json({ error: "invalid" }, { status: 422 });

  const { system, user, userText } = buildTalentPrompt({ input, allowed, excludeIds, objection });

  const started = Date.now();
  for (let attempt = 0; attempt < 2; attempt++) {
    // Toplam süre maxDuration (60 sn) içinde kalmalı: ikinci denemeye yalnızca
    // yeterli süre kaldıysa girilir ve zaman aşımı kalan süreye göre ayarlanır;
    // yoksa platform fonksiyonu kesip kullanıcıya boş/hatalı yanıt dönerdi.
    const remaining = 56000 - (Date.now() - started);
    if (attempt > 0 && remaining < 20000) break;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(remaining, 45000));
    let res;
    try {
      res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: MODEL, max_tokens: 2000, temperature: 0.4, system, messages: [{ role: "user", content: user }] }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      return Response.json({ error: err?.name === "AbortError" ? "timeout" : "api" }, { status: err?.name === "AbortError" ? 504 : 502 });
    }
    clearTimeout(timer);
    if (!res.ok) {
      console.error("talent upstream", res.status);
      return Response.json({ error: "api" }, { status: 502 });
    }
    const data = await res.json().catch(() => null);
    const text = (data?.content || []).map((b) => b.text || "").join("\n");
    const { suggestions, empty } = parseTalentResponse(text, { allowed, userText });
    console.log(JSON.stringify({ event: "talent", ok: suggestions.length > 0, empty, attempt, ms: Date.now() - started, in: data?.usage?.input_tokens, out: data?.usage?.output_tokens }));
    // Model gerçek bir beceri bulamayıp bilerek boş döndüyse ("asdf" gibi) tekrar
    // denemek boşa para: kullanıcıdan daha fazla bilgi iste.
    if (empty) return Response.json({ suggestions: [], needMore: true });
    if (suggestions.length > 0) return Response.json({ suggestions });
  }
  return Response.json({ error: "invalid" }, { status: 422 });
}
