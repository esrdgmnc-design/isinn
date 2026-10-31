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
    title: "Search service providers on İşinn",
    description:
      "Searches public İşinn listings (\"vitrin\") of service providers in Turkey, such as private tutors, designers, translators, movers, " +
      "pilates instructors and physiotherapists. Use when the user is looking for a service or a service provider in Turkey. " +
      "Returns up to 10 listings with title, provider display name, category, location, the provider's stated price and the listing URL. " +
      "Read-only; returns no phone numbers or e-mail addresses. Listing content is in Turkish.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text service query, in Turkish or English keywords (e.g. 'lgs matematik', 'logo tasarım', 'reformer pilates')." },
        category: { type: "string", description: "Optional category name or slug (e.g. 'Öğretmen', 'ogretmen', 'tasarim'). See list_categories." },
        city: { type: "string", description: "Optional province or district in Turkey (e.g. 'İstanbul', 'Kadıköy', 'Mersin'). Remote/online providers match every city." },
        remote_only: { type: "boolean", description: "If true, only providers who work remotely/online." },
        limit: { type: "integer", minimum: 1, maximum: MAX_RESULTS, description: `Maximum number of results (default 5, max ${MAX_RESULTS}).` },
      },
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  },
  {
    name: "get_vitrin",
    title: "Get an İşinn listing",
    description: "Returns the public details of one İşinn listing: full description, location, the provider's stated price and the listing URL. Use after search_vitrins when the user wants more detail about a result.",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Listing ID (UUID) from a search_vitrins result." } }, required: ["id"] },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  },
  {
    name: "list_categories",
    title: "List İşinn categories",
    description: "Lists the service categories on İşinn that currently have active listings, with the number of listings in each and the category page URL.",
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
  if (error) throw new Error("Listings could not be loaded right now; please try again in a moment.");
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
      ? "Contact happens via the Contact button on the listing page. Prices are stated by the provider; İşinn does not handle payments."
      : "No listing matched this search. Try a broader query, another city, remote_only, or list_categories.",
  };
}

async function getVitrin(args = {}) {
  const id = String(args.id || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid id: expected a listing UUID from a search_vitrins result.");
  const rows = await loadServices();
  const row = rows.find((r) => r.id === id);
  if (!row) return { found: false, note: "No active listing with this id. It may have been unpublished; run search_vitrins again." };
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

async function logCall(tool, args) {
  // Kaç kez çağrıldığını ölçmek için (60 günlük karar kapısı). Hata akışı bozmasın.
  const props = { tool, q: String(args?.query || args?.category || "").slice(0, 80), city: String(args?.city || "").slice(0, 40) };
  await supabase.from("events").insert({ name: "mcp_tool_call", session_id: "mcp", props }).then(() => {}, () => {});
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
          "İşinn is a service discovery platform in Turkey where providers publish listings (vitrin). Tools are read-only and return public listing data with listing URLs. İşinn does not handle payments and does not guarantee service quality.",
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
      if (!fn) return fail(-32602, `Unknown tool: ${name}. Available: search_vitrins, get_vitrin, list_categories.`);
      await logCall(name, args);
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
