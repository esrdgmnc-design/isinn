// Haftalık büyüme raporu (salt okunur): iç trafik ayıklanmış huni, arz/talep ve il dağılımı.
//   node evals/funnel-report.mjs [gün=14]
// İç trafik = (1) olayında internal:true olan cihazlar ("/?internal=1" ile işaretlenir), (2) yönetici hesaplar,
// (3) e-postasında test/demo geçen hesaplar. Bu oturumların TÜM olayları dışlanır. Kişisel içerik yazdırılmaz.
import fs from "node:fs";

let env = "";
try { env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8"); } catch {}
const get = (k) => process.env[k] || (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim();
const url = get("NEXT_PUBLIC_SUPABASE_URL");
const key = get("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) { console.log("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli."); process.exit(1); }
const days = Math.max(1, parseInt(process.argv[2] || "14", 10) || 14);
const h = { apikey: key, Authorization: `Bearer ${key}` };
const q = async (p) => { const r = await fetch(`${url}/rest/v1/${p}`, { headers: h }); const d = await r.json(); return Array.isArray(d) ? d : []; };
const since = new Date(Date.now() - days * 864e5).toISOString();

// --- iç hesaplar
const users = ((await (await fetch(`${url}/auth/v1/admin/users?per_page=1000`, { headers: h })).json()).users) || [];
const adminIds = new Set((await q("profiles?select=id&is_admin=eq.true")).map((p) => p.id));
const internalIds = new Set([...adminIds, ...users.filter((u) => /test|demo|deneme/i.test(u.email || "")).map((u) => u.id)]);

// --- olaylar (sayfalı)
const events = [];
for (let from = 0; from < 20000; from += 1000) {
  const rows = await q(`events?select=name,props,session_id,profile_id,created_at&created_at=gte.${since}&order=id.asc&limit=1000&offset=${from}`);
  events.push(...rows);
  if (rows.length < 1000) break;
}
const internalSessions = new Set(events.filter((e) => e.props?.internal === true || (e.profile_id && internalIds.has(e.profile_id))).map((e) => e.session_id));
const ext = events.filter((e) => !internalSessions.has(e.session_id));
const sess = (names) => new Set(ext.filter((e) => names.includes(e.name)).map((e) => e.session_id)).size;
const count = (name) => ext.filter((e) => e.name === name).length;

console.log(`İşinn büyüme raporu: son ${days} gün (iç trafik dışlanmış)`);
console.log(`Toplam oturum: ${new Set(events.map((e) => e.session_id)).size}, iç sayılan: ${internalSessions.size}, dış: ${new Set(ext.map((e) => e.session_id)).size}`);
console.log("\nHuni (tekil oturum):");
console.log(`  uygulama açıldı:            ${sess(["app_open"])}`);
console.log(`  Farket sayfası görüldü:     ${sess(["talent_page_view", "talent_home_start"])}`);
console.log(`  Farket gönderildi:          ${sess(["talent_submit"])}`);
console.log(`  Farket sonucu görüldü:      ${sess(["talent_results"])}`);
console.log(`  "vitrin oluştur" tıkladı:   ${sess(["talent_create_click"])}`);
console.log(`  vitrin yayınlandı (olay):   ${count("vitrin_created")} (Farket'ten gelen: ${ext.filter((e) => e.name === "vitrin_created" && e.props?.from_talent).length})`);
console.log(`  kayıt gönderildi:           ${count("signup_submitted")}`);
console.log("\nTalep tarafı:");
const sr = ext.filter((e) => e.name === "search_results");
const b = (k) => sr.filter((e) => e.props?.bucket === k).length;
console.log(`  arama sonucu olayı: ${sr.length} (0 sonuç: ${b("0")}, 1-2: ${b("1-2")}, 3+: ${b("3+")})  ← sıfır sonuç oranı arz boşluğunu gösterir`);
console.log(`  vitrin görüntüleme (tekil oturum): ${sess(["listing_view"])}, mesaj gönderimi: ${count("message_sent")}, iş ilanı: ${count("job_posted")}`);
console.log(`  vitrin paylaşımı: ${count("vitrin_shared")}, çalışma bağlantısı tıklaması: ${count("portfolio_link_click")}`);

// --- kaynak kırılımı (utm / src)
const bySrc = {};
for (const e of ext.filter((x) => x.name === "app_open")) {
  const s = e.props?.utm_source || e.props?.src || e.props?.ref || "doğrudan";
  (bySrc[s] ||= new Set()).add(e.session_id);
}
console.log("\nKaynak (tekil oturum): " + (Object.entries(bySrc).map(([k, v]) => `${k}=${v.size}`).join(", ") || "-"));

// --- arz / gerçek iş (tablolardan)
const services = await q("services?select=id,title,city,is_remote,active,description,provider_id&active=eq.true");
const real = services.filter((s) => !(s.description || "").startsWith("DEMO") && !internalIds.has(s.provider_id));
console.log("\nArz:");
console.log(`  aktif vitrin: ${services.length}, bunlardan DEMO/iç hesap hariç: ${real.length}`);
// Kapsam Türkiye geneli. İstenirse bir ilçe/şehir için: PILOT_DISTRICT=<ad> node evals/funnel-report.mjs
const pilot = (process.env.PILOT_DISTRICT || "").trim();
if (pilot) {
  const inPilot = services.filter((s) => (s.city || "").toLocaleLowerCase("tr-TR").includes(pilot.toLocaleLowerCase("tr-TR")));
  console.log(`  ${pilot}: ${inPilot.length} vitrin (DEMO/iç hariç: ${inPilot.filter((s) => !(s.description || "").startsWith("DEMO") && !internalIds.has(s.provider_id)).length})`);
}
const byProvince = {};
for (const s of real) { const p = s.is_remote ? "uzaktan" : ((s.city || "?").split(",").pop().trim() || "?"); byProvince[p] = (byProvince[p] || 0) + 1; }
console.log("  il dağılımı (DEMO/iç hariç): " + Object.entries(byProvince).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}=${v}`).join(", "));
const jobsAll = await q("jobs?select=id,service_id,state,client_delivered_at,provider_delivered_at,created_at,client_id");
const threads = jobsAll.filter((j) => j.service_id && !internalIds.has(j.client_id));
const both = jobsAll.filter((j) => j.client_delivered_at && j.provider_delivered_at && !internalIds.has(j.client_id));
console.log(`  vitrin görüşmesi (iç hesap müşterisi hariç, tüm zamanlar): ${threads.length}, iki taraflı onaylı iş: ${both.length}  ← kuzey yıldızı`);
console.log("\nNot: örneklem küçük; oranları kanıt değil, yön olarak oku.");
