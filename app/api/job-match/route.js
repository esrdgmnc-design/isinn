// İlan verilince, ilan sahibine "ilanın için en uygun 3 profil" bildirimi.
// Bildirimler istemciden yazılamıyor (tetikleyiciler/servis rolüyle yazılıyor),
// bu yüzden eşleştirme burada, sunucuda yapılır: aday vitrinler veritabanından
// çekilir, AI yalnızca puanlar; bildirimde SADECE vitrin adları ve "AI tahmini
// uyum" yüzdesi yer alır (AI'ın serbest metni bildirime konmaz). Her ilan için
// en fazla bir kez çalışır. Veritabanında 'ai_match_top3' bildirim türü henüz
// etkin değilse (bkz. supabase/talent_and_top3_2026_10_04.sql) sessizce atlar.
// Asıl mantık lib/jobMatchRun.js'te (kuru çalıştırmayla test edilebilir).
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit } from "../../../lib/rateLimit";
import { matchJobAndNotify } from "../../../lib/jobMatchRun";

export const maxDuration = 60;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!apiKey || !serviceKey) return Response.json({ ok: false, reason: "config" }, { status: 500 });

  const user = await getAuthedUser(request);
  if (!user) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  if (!checkRateLimit(`job-match:${user.id}`, { limit: 10, windowMs: 60 * 60 * 1000 })) {
    return Response.json({ ok: false, reason: "rate" }, { status: 429 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ ok: false, reason: "bad_request" }, { status: 400 }); }
  const jobId = typeof body?.jobId === "string" ? body.jobId : "";
  if (!/^[0-9a-f-]{36}$/i.test(jobId)) return Response.json({ ok: false, reason: "bad_request" }, { status: 400 });

  const admin = createClient(supabaseUrl, serviceKey);

  // İlan gerçekten bu kullanıcının mı, daha önce bildirim gitti mi?
  const { data: job } = await admin.from("jobs").select("id, client_id, title, description, category_id, city, is_remote, service_id").eq("id", jobId).maybeSingle();
  if (!job || job.client_id !== user.id || job.service_id) return Response.json({ ok: false, reason: "not_found" }, { status: 404 });
  const { data: existing } = await admin.from("notifications").select("id").eq("profile_id", user.id).eq("type", "ai_match_top3").eq("related_job_id", job.id).limit(1);
  if (existing && existing.length > 0) return Response.json({ ok: true, skipped: "already" });

  const result = await matchJobAndNotify({ admin, job, userId: user.id, apiKey });
  return Response.json(result, { status: result.ok ? 200 : result.reason === "notify" ? 200 : 502 });
}
