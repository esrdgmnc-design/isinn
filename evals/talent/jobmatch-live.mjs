// Gerçek (dryRun olmayan) ilan eşleştirmesi: bildirimi yazar, doğrular ve test kayıtlarını SİLER.
//   node evals/talent/jobmatch-live.mjs <jobId>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { matchJobAndNotify } from "../../lib/jobMatchRun.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(dir, "..", "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))[1].trim();
const admin = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"));
const { data: job } = await admin.from("jobs").select("id, client_id, title, description, category_id, city, is_remote, service_id").eq("id", process.argv[2]).maybeSingle();
if (!job) { console.log("ilan yok"); process.exit(1); }
const result = await matchJobAndNotify({ admin, job, userId: job.client_id, apiKey: get("ANTHROPIC_API_KEY") });
console.log("sonuç:", JSON.stringify(result));
await new Promise((r) => setTimeout(r, 1500));
const { data: notifs } = await admin.from("notifications").select("id, type, title, body, related_job_id, related_service_id").eq("profile_id", job.client_id).eq("type", "ai_match_top3").eq("related_job_id", job.id);
console.log("bildirim:", JSON.stringify(notifs));
const { data: logs } = await admin.from("ai_match_log").select("id, candidate_name, match_score, rank").eq("job_id", job.id).eq("reason", "otomatik bildirim");
console.log("log:", JSON.stringify(logs));
if (notifs?.length) await admin.from("notifications").delete().in("id", notifs.map((n) => n.id));
if (logs?.length) await admin.from("ai_match_log").delete().in("id", logs.map((l) => l.id));
console.log("test kayıtları silindi");
