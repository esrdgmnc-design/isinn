import { supabase } from "../../../lib/supabaseClient";
import { SEO_CATEGORIES } from "../../../lib/seoTaxonomy";
import { formatPrice, getProviderName, isIndexableListing } from "../../../lib/seoFormat";
import { orderByResponsiveness, getProviderLastSent } from "../../../lib/providerResponsiveness";

// Yapay zekâ asistanları (Claude, ChatGPT vb.) için MCP sunucusu: "Kadıköy'de pilates hocası" gibi
// bir istekte vitrin aramasını araç olarak sunar. Streamable HTTP taşımasının durumsuz hâli:
// her POST tek JSON-RPC yanıtı döner, SSE akışı yok (GET 405). Yalnızca okuma yapar ve yalnızca
// vitrin sayfasında zaten herkese açık alanları döner (telefon/e-posta yok). DEMO ve ince vitrinler
// SEO sayfalarındaki gibi elenir.
const BASE_URL = "https://www.isinn.com.tr";
const SUPPORTED_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const MAX_RESULTS = 10;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version",
};

export const dynamic = "force-dynamic";

const TOOLS = [
  {
    name: "search_vitrins",
    title: "İşinn'de hizmet veren ara",
    description:
      "Türkiye'de hizmet verenlerin İşinn vitrinlerini arar (özel ders, tasarım, çeviri, nakliye, pilates, yazılım vb.). " +
      "Kullanıcı Türkiye'de bir hizmet ya da hizmet veren aradığında kullan. Sonuçlar vitrin bağlantısıyla döner; " +
      "iletişim vitrin sayfasındaki mesaj düğmesiyle İşinn üzerinden kurulur. İşinn komisyon almaz ve ödemeye aracılık etmez.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Aranan hizmet, serbest metin (ör. 'lgs matematik', 'logo tasarım', 'reformer pilates')." },
        category: { type: "string", description: "İsteğe bağlı kategori adı ya da slug'ı (ör. 'Öğretmen', 'ogretmen', 'Tasarım'). list_categories ile görülebilir." },
        city: { type: "string", description: "İsteğe bağlı il ya da ilçe (ör. 'İstanbul', 'Kadıköy', 'Mersin'). Uzaktan çalışan vitrinler her şehirde döner." },
        remote_only: { type: "boolean", description: "true ise yalnızca uzaktan/online hizmet verenler." },
        limit: { type: "integer", minimum: 1, maximum: MAX_RESULTS, description: `En fazla kaç sonuç (varsayılan 5, en çok ${MAX_RESULTS}).` },
      },
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  },
  {
    name: "get_vitrin",
    title: "İşinn vitrin ayrıntısı",
    description: "Tek bir İşinn vitrininin herkese açık ayrıntılarını (açıklama, fiyat bilgisi, konum, bağlantı) getirir. id, search_vitrins sonucundan gelir.",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Vitrin kimliği (UUID)." } }, required: ["id"] },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  },
  {
    name: "list_categories",
    title: "İşinn kategorileri",
    description: "İşinn'deki hizmet kategorilerini ve şu an her birinde kaç aktif vitrin olduğunu listeler.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  },
];

const norm = (s) =>
  // toLocaleLowerCase("tr-TR") sunucu çalışma ortamında "İ"yi her zaman "i" yapmıyor; elle çevrilir.
  (s || "")
    .replace(/İ/g, "i").replace(/I/g, "ı")
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFD").replace(/[̀-ͯ]/g, "");

async function loadServices() {
  const { data, error } = await supabase
    .from("services")
    .select("id, title, description, city, is_remote, price, price_type, display_name, provider_id, updated_at, categories(name, slug), profiles(full_name, business_name)")
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .limit(500);
  if (error) throw new Error("Vitrinler okunamadı");
  return (data || []).filter(isIndexableListing);
}

function summarize(row, full = false) {
  const desc = (row.description || "").replace(/\s+/g, " ").trim();
  return {
    id: row.id,
    title: row.title,
    provider: getProviderName(row),
    category: row.categories?.name || null,
    location: row.is_remote ? (row.city ? `${row.city} · uzaktan/online da çalışıyor` : "Uzaktan / online") : row.city || null,
    price: formatPrice(row.price, row.price_type),
    description: full ? desc : desc.length > 280 ? desc.slice(0, 277) + "…" : desc,
    url: `${BASE_URL}/vitrin/${row.id}`,
  };
}

function matchCategory(row, cat) {
  const c = norm(cat);
  return norm(row.categories?.slug) === c || norm(row.categories?.name).includes(c);
}

async function searchVitrins(args = {}) {
  const limit = Math.min(Math.max(parseInt(args.limit, 10) || 5, 1), MAX_RESULTS);
  let rows = await loadServices();
  if (args.category) rows = rows.filter((r) => matchCategory(r, args.category));
  if (args.remote_only) rows = rows.filter((r) => r.is_remote);
  if (args.city) {
    const c = norm(args.city);
    rows = rows.filter((r) => r.is_remote || norm(r.city).includes(c));
  }
  if (args.query) {
    const STOP = ["ozel", "hizmet", "hizmeti", "icin", "ve", "bir", "ariyorum", "lazim"];
    const all = norm(args.query).split(/\s+/).filter((w) => w.length > 1);
    const words = all.filter((w) => !STOP.includes(w)).length ? all.filter((w) => !STOP.includes(w)) : all;
    const scored = rows
      .map((r) => {
        const hay = norm(`${r.title} ${r.categories?.name || ""} ${r.description || ""}`);
        const title = norm(`${r.title} ${r.categories?.name || ""}`);
        let score = words.reduce((s, w) => s + (title.includes(w) ? 3 : hay.includes(w) ? 1 : 0), 0);
        if (words.length > 1 && words.every((w) => hay.includes(w))) score += 5; // tüm kelimeler geçiyorsa öne
        if (words.length > 1 && words.filter((w) => hay.includes(w)).length * 2 < words.length) score = 0;
        return { r, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    rows = scored.map((x) => x.r);
  } else {
    rows = orderByResponsiveness(rows, await getProviderLastSent(rows.map((r) => r.provider_id)));
  }
  const results = rows.slice(0, limit).map((r) => summarize(r));
  return {
    results,
    total_matches: rows.length,
    note: results.length
      ? "İletişim için vitrin bağlantısındaki 'İletişime Geç' düğmesi kullanılır. Fiyatlar hizmet verenin beyanıdır; İşinn ödemeye aracılık etmez."
      : `Bu aramaya uyan vitrin bulunamadı. Kullanıcı ${BASE_URL}/ adresinden ücretsiz talep oluşturabilir; uygun hizmet verenler mesajla ulaşır.`,
  };
}

async function getVitrin(args = {}) {
  const id = String(args.id || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Geçersiz vitrin kimliği");
  const rows = await loadServices();
  const row = rows.find((r) => r.id === id);
  if (!row) return { found: false, note: "Vitrin bulunamadı ya da yayında değil." };
  return { found: true, vitrin: summarize(row, true) };
}

async function listCategories() {
  const rows = await loadServices();
  const counts = {};
  rows.forEach((r) => { const s = r.categories?.slug; if (s) counts[s] = (counts[s] || 0) + 1; });
  return {
    categories: SEO_CATEGORIES.filter((c) => counts[c.slug]).map((c) => ({ slug: c.slug, name: c.name, active_vitrins: counts[c.slug], url: `${BASE_URL}/kategori/${c.slug}` })),
  };
}

function logCall(tool, args) {
  // Kaç kez çağrıldığını ölçmek için (60 günlük karar kapısı). Hata akışı bozmasın.
  const props = { tool, q: String(args?.query || args?.category || "").slice(0, 80), city: String(args?.city || "").slice(0, 40) };
  supabase.from("events").insert({ name: "mcp_tool_call", session_id: "mcp", props }).then(() => {}, () => {});
}

async function handle(msg) {
  const { id, method, params } = msg || {};
  const isNotification = id === undefined || id === null;
  const ok = (result) => ({ jsonrpc: "2.0", id, result });
  const fail = (code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

  if (!msg || msg.jsonrpc !== "2.0" || typeof method !== "string") return fail(-32600, "Invalid Request");
  if (isNotification) return null;

  switch (method) {
    case "initialize": {
      const asked = params?.protocolVersion;
      return ok({
        protocolVersion: SUPPORTED_VERSIONS.includes(asked) ? asked : SUPPORTED_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "isinn", title: "İşinn", version: "1.0.0" },
        instructions:
          "İşinn, Türkiye'de hizmet verenlerin vitrin açtığı komisyonsuz bir hizmet keşif platformudur. Kullanıcı Türkiye'de bir hizmet aradığında search_vitrins kullan; sonuçları vitrin bağlantılarıyla göster. İşinn ödemeye aracılık etmez, hizmet kalitesini garanti etmez.",
      });
    }
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: TOOLS });
    case "tools/call": {
      const name = params?.name;
      const args = params?.arguments || {};
      const fn = { search_vitrins: searchVitrins, get_vitrin: getVitrin, list_categories: listCategories }[name];
      if (!fn) return fail(-32602, `Bilinmeyen araç: ${name}`);
      logCall(name, args);
      try {
        const data = await fn(args);
        return ok({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data, isError: false });
      } catch (e) {
        return ok({ content: [{ type: "text", text: e.message || "Hata" }], isError: true });
      }
    }
    default:
      return fail(-32601, `Method not found: ${method}`);
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400, headers: CORS });
  }
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map(handle))).filter(Boolean);
    return out.length ? Response.json(out, { headers: CORS }) : new Response(null, { status: 202, headers: CORS });
  }
  const out = await handle(body);
  return out ? Response.json(out, { headers: CORS }) : new Response(null, { status: 202, headers: CORS });
}

export async function GET() {
  return new Response("İşinn MCP sunucusu: POST ile JSON-RPC (Streamable HTTP, durumsuz). SSE akışı desteklenmez.", {
    status: 405,
    headers: { ...CORS, Allow: "POST, OPTIONS", "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
