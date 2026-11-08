// Kaynak (ref) raporu: belirli bir paylaşım bağlantısından gelenleri sayar.
// Kullanım: node evals/kaynak-raporu.mjs nihan
// Bağlantı: https://www.isinn.com.tr/?utm_source=nihan (her sayfaya eklenebilir: /hizmet-ver?utm_source=nihan); ?ref=nihan da sayılır
//
// Nasıl çalışır: lib/analytics.js ilk ziyarette ?ref= değerini tarayıcıya kaydeder (ilk temas; sonraki ziyaretler
// ezmez) ve o tarayıcıdan gelen her olaya props.src olarak ekler. Sınırlar: daha önce siteye girmiş biri bu
// bağlantıyla gelirse eski kaynağı kalır; mağaza uygulamasından kayıt/vitrin bu sayıma girmez; kurucunun iç
// ziyaretleri (props.internal) hariç tutulur.
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const src = (process.argv[2] || "").trim();
if (!src) { console.error("Kaynak adı ver: node evals/kaynak-raporu.mjs nihan"); process.exit(1); }

const env = Object.fromEntries(
  fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; })
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const rows = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await sb.from("events").select("name, session_id, profile_id, created_at, props")
    .or(`props->>src.eq.${src},props->>utm_source.eq.${src}`).order("created_at").range(from, from + 999);
  if (error) { console.error(error.message); process.exit(1); }
  rows.push(...data);
  if (data.length < 1000) break;
}
const real = rows.filter((r) => !r.props?.internal);
const sessions = new Set(real.map((r) => r.session_id));
const profiles = new Set(real.filter((r) => r.profile_id).map((r) => r.profile_id));
const count = (name) => real.filter((r) => r.name === name).length;
const vitrinOwners = new Set(real.filter((r) => r.name === "vitrin_created" && r.profile_id).map((r) => r.profile_id));

console.log(`Kaynak: ${src}`);
console.log(`İlk olay: ${real[0]?.created_at || "-"} · Son olay: ${real.at(-1)?.created_at || "-"}`);
console.log(`Ziyaretçi (tekil oturum): ${sessions.size}`);
console.log(`Kayıt formu gönderen: ${count("signup_submitted")}`);
console.log(`Giriş yapmış tekil kullanıcı: ${profiles.size}`);
console.log(`Vitrin açan kişi: ${vitrinOwners.size} (vitrin_created olayı: ${count("vitrin_created")})`);
console.log(`Talep gönderen (need_submit): ${count("need_submit")}`);
console.log(`Yeteneğini Keşfet gönderimi: ${count("talent_submit")}`);
