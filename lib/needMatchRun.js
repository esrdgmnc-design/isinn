// "Ne arıyorsun?" eşleştirmesini çalıştırır: aday havuzu (gerçek, yayında, DEMO olmayan vitrinler),
// süzgeçler, tek yapay zekâ çağrısı, doğrulama. app/api/need-match/route.js çağırır;
// evals/needmatch-dry.mjs aynı kodu kuru çalıştırır (yalnızca okur + yapay zekâ çağırır).
// Dönüş içeriği kullanıcıya gidecek alanlarla sınırlıdır: vitrin kimliği + sabit etiket kodları.
import { extractJsonValue } from "./jsonExtract.js";
import { SEO_CITIES } from "./seoTaxonomy.js";
import {
  redactPII, detectRemote, detectProvince, healthCategory, looksLikeProductPurchase,
  buildPrompt, parseResult, reasonCodes, deterministicRank, pickResults,
} from "./needMatchCore.js";

export const NEED_MODEL = "claude-haiku-5-5";
// Havuz sınırı: vitrin sayısı bunu aşınca önce SQL'de kategori/il ön süzmesi eklenmeli (bkz. plan, 2026-10-17).
const MAX_POOL = 80;
const isDemo = (row) => /^\s*DEMO V[İI]TR[İI]N/i.test(row.description || "");

// admin: service-role Supabase istemcisi; parentGroups: [{ id, categoryIds:[slug] }] (opsiyonel, deterministik yedek için)
export async function runNeedMatch({ admin, text, apiKey, parentGroups = [], dryRun = false }) {
  const provinces = SEO_CITIES;
  const provinceSlugs = new Set(provinces.map((p) => p.slug));
  const safeText = redactPII(text);
  const hint = { province: detectProvince(safeText, provinces), remote: detectRemote(safeText) };

  const [{ data: cats }, { data: rows }] = await Promise.all([
    admin.from("categories").select("id, slug, name"),
    admin
      .from("services")
      .select("id, title, description, city, is_remote, category_id, categories(slug, name)")
      .eq("active", true)
      .order("updated_at", { ascending: false })
      .limit(MAX_POOL + 20),
  ]);
  const categories = (cats || []).filter((c) => c.slug && c.slug !== "diger-ozel");
  const allowedSlugs = new Set(categories.map((c) => c.slug));
  const candidates = (rows || [])
    .filter((r) => !isDemo(r))
    .slice(0, MAX_POOL)
    .map((r) => ({ id: r.id, title: r.title, description: r.description, city: r.city, isRemote: !!r.is_remote, categorySlug: r.categories?.slug || "", categoryName: r.categories?.name || "" }));

  const prefillBase = (intent) => ({ categorySlug: intent.category, province: intent.province, remote: intent.mode === "remote" });
  const finish = (intent, picked, kind, extra = {}) => {
    const results = picked.map((m) => ({ serviceId: m.c.id, reasons: reasonCodes(m.c, intent) }));
    return {
      ok: true,
      kind: results.length === 0 ? (kind === "match" ? "none" : kind) : kind,
      results,
      noMatch: results.length === 0,
      prefill: prefillBase(intent),
      // günlük için (içerik değil): kategori, il, sonuç kovası
      log: { category: intent.category, province: intent.province, mode: intent.mode, results: results.length, pool: candidates.length },
      ...extra,
    };
  };
  const parentOf = (slug) => new Set((parentGroups.find((g) => g.categoryIds.includes(slug))?.categoryIds) || []);

  // Sağlık şikâyeti: yapay zekâya gönderilmez, kural tabanlı eşleşir.
  const health = healthCategory(safeText);
  if (health) {
    const intent = { category: allowedSlugs.has(health) ? health : null, province: hint.province, mode: hint.remote || "any", parentSlugs: parentOf(health) };
    return finish(intent, pickResults(deterministicRank(candidates, intent), candidates, intent), "match", { health: true, ai: false });
  }
  if (looksLikeProductPurchase(safeText)) {
    return finish({ category: null, province: hint.province, mode: "any" }, [], "product", { ai: false });
  }
  if (candidates.length === 0) return finish({ category: null, province: hint.province, mode: hint.remote || "any" }, [], "none", { ai: false });

  const { system, user } = buildPrompt({ text: safeText, categories, candidates, provinceHint: hint.province, remoteHint: !!hint.remote });
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  let data = null;
  let status = "ok";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      // Haiku 5.5: örnekleme parametresi (temperature) gönderilmez (400); sınıflandırma için düşük effort.
      body: JSON.stringify({ model: NEED_MODEL, max_tokens: 1500, output_config: { effort: "low" }, system, messages: [{ role: "user", content: user }] }),
      signal: controller.signal,
    });
    if (!res.ok) status = "upstream_" + res.status;
    else data = await res.json().catch(() => null);
  } catch (err) {
    status = err?.name === "AbortError" ? "timeout" : "network_error";
  }
  clearTimeout(timer);
  const usage = { model: NEED_MODEL, inputTokens: data?.usage?.input_tokens, outputTokens: data?.usage?.output_tokens, latencyMs: Date.now() - started };

  let parsed = null;
  if (data && data.stop_reason !== "refusal") {
    const textOut = (data.content || []).filter((b) => b.type === "text").map((b) => b.text || "").join("\n");
    parsed = extractJsonValue(textOut);
  } else if (data?.stop_reason === "refusal") status = "refusal";
  if (data && !parsed && status === "ok") status = "parse";

  // Yapay zekâ çöktüyse: kurallarla sırala (kategori bilinmiyorsa sonuç çıkmaz → talep yolu).
  if (!parsed) {
    const intent = { category: null, province: hint.province, mode: hint.remote || "any" };
    return finish(intent, [], "none", { ai: false, aiStatus: status, usage });
  }

  const r = parseResult(parsed, { allowedSlugs, provinceSlugs, candidateCount: candidates.length });
  const intent = {
    category: r.category,
    // kural tabanlı il/uzaktan yakalaması modelle çelişirse kural kazanır
    province: hint.province || r.province,
    mode: hint.remote ? "remote" : r.mode,
  };
  if (r.vague) return finish(intent, [], "vague", { ai: true, aiStatus: status, usage });
  if (r.product) return finish(intent, [], "product", { ai: true, aiStatus: status, usage });
  const picked = pickResults(r.matches, candidates, intent);
  const out = finish(intent, picked, "match", { ai: true, aiStatus: status, usage });
  if (dryRun) out.debug = { intent, top: picked.map((m) => ({ title: m.c.title, score: m.score })), pool: candidates.length };
  return out;
}
