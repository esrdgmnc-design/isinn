// İş ilanı eşleştirmesinin kuru çalıştırması (bildirim YAZMAZ): gerçek bir ilan için
// aday sorgusunu, AI puanlamasını ve en iyi 3 seçimini gerçek kodla çalıştırır.
//   node evals/talent/jobmatch-dry.mjs [jobId]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { matchJobAndNotify } from "../../lib/jobMatchRun.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(dir, "..", "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))[1].trim();
const admin = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"));

let job;
if (process.argv[2]) {
  ({ data: job } = await admin.from("jobs").select("id, client_id, title, description, category_id, city, is_remote, service_id").eq("id", process.argv[2]).maybeSingle());
} else {
  // Aday vitrini olan bir kategoriden, vitrin bağlantısı olmayan (gerçek) bir ilan.
  const { data: jobs } = await admin.from("jobs").select("id, client_id, title, description, category_id, city, is_remote, service_id").is("service_id", null).eq("active", true).order("created_at", { ascending: false }).limit(30);
  for (const j of jobs || []) {
    const { count } = await admin.from("services").select("id", { count: "exact", head: true }).eq("category_id", j.category_id).eq("active", true).neq("provider_id", j.client_id);
    if (count > 0) { job = j; break; }
  }
}
if (!job) { console.log("Uygun ilan bulunamadı"); process.exit(0); }
console.log("İlan:", job.title, "|", job.city || "uzaktan");
const result = await matchJobAndNotify({ admin, job, userId: job.client_id, apiKey: get("ANTHROPIC_API_KEY"), dryRun: true });
console.log(JSON.stringify(result, null, 2));
