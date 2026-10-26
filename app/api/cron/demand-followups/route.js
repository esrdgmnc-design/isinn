// Talep takibi cron'u (2026-10-26) — mantık lib/demandFollowups.js'te. Vercel Cron günde bir kez çağırır (vercel.json).
// Sıra her gönderimde aynı: önce bildirim satırı yazılır (aynı kişiye aynı iş için ikinci kez gitmesin diye kayıt),
// yazılamazsa (ör. tür kısıtı henüz güncellenmediyse) e-posta GÖNDERİLMEZ. ?dry=1 hiçbir şey yazmadan/göndermeden planı döner.
import { createClient } from "@supabase/supabase-js";
import {
  JOB_WINDOW_D, MAX_CONV_AGE_D,
  matchProvidersForJob, buildConversations, pickNudges, pickSimilarServices,
  jobMatchEmail, reminderEmail, similarEmail,
} from "../../../../lib/demandFollowups";

export const maxDuration = 60;

const nameOf = (p) => (p?.business_name && p.business_name.trim()) || p?.full_name || "";

async function sendEmail(admin, to, { subject, body }) {
  // Açık röle kapatıldı (2026-10-20): fonksiyon Vault'taki gizli değeri ister; değeri yalnızca service_role okuyabilir.
  const { data: hookSecret } = await admin.rpc("get_notify_hook_secret");
  if (!hookSecret || !to) return false;
  const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, "x-notify-secret": hookSecret },
    body: JSON.stringify({ to, subject, body }),
  });
  return r.ok;
}

async function emailOf(admin, profileId) {
  const { data } = await admin.auth.admin.getUserById(profileId);
  return data?.user?.email || null;
}

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const dry = new URL(request.url).searchParams.get("dry") === "1";
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const now = Date.now();
  const sinceConv = new Date(now - (MAX_CONV_AGE_D + 1) * 864e5).toISOString();
  const sinceJob = new Date(now - JOB_WINDOW_D * 864e5).toISOString();

  const [{ data: services }, { data: newJobs }, { data: convJobs }, { data: messages }, { data: admins }, { data: sentRows }, { data: categories }] = await Promise.all([
    admin.from("services").select("id, provider_id, category_id, title, description, display_name, city, is_remote, active").eq("active", true).limit(5000),
    admin.from("jobs").select("id, client_id, category_id, title, description, city, is_remote, active, service_id, created_at").is("service_id", null).eq("active", true).gte("created_at", sinceJob),
    admin.from("jobs").select("id, client_id, service_id, created_at, services(provider_id, title)").not("service_id", "is", null).gte("created_at", sinceConv),
    admin.from("messages").select("job_id, sender_id, body, created_at").gte("created_at", sinceConv).limit(10000),
    admin.from("profiles").select("id").eq("is_admin", true),
    admin.from("notifications").select("type, profile_id, related_job_id").in("type", ["new_job_match", "message_reminder", "similar_vitrins"]).gte("created_at", sinceConv),
    admin.from("categories").select("id, name"),
  ]);

  const sent = new Set((sentRows || []).map((n) => (n.type === "new_job_match" ? `job:${n.related_job_id}:${n.profile_id}` : `${n.type === "message_reminder" ? "reminder" : "similar"}:${n.related_job_id}`)));
  const catName = Object.fromEntries((categories || []).map((c) => [c.id, c.name]));
  const profileIds = new Set();
  const plan = { jobMatches: [], reminders: [], similar: [] };

  // 1) Yeni ilanlar
  for (const job of newJobs || []) {
    for (const m of matchProvidersForJob(job, services)) {
      if (sent.has(`job:${job.id}:${m.providerId}`)) continue;
      plan.jobMatches.push({ job, providerId: m.providerId });
      profileIds.add(m.providerId);
    }
  }

  // 2-3) Yanıtsız görüşmeler. Yöneticinin (kurucu) kendi yazdığı tanıtım mesajları müşteri talebi değildir.
  const convs = buildConversations(convJobs, messages);
  const { reminders, similar } = pickNudges(convs, now, sent, new Set((admins || []).map((a) => a.id)));
  const lastActiveAt = {};
  for (const m of messages || []) if (!lastActiveAt[m.sender_id] || m.created_at > lastActiveAt[m.sender_id]) lastActiveAt[m.sender_id] = m.created_at;
  for (const c of reminders) { plan.reminders.push(c); profileIds.add(c.providerId); profileIds.add(c.job.client_id); }
  for (const c of similar) {
    const suggestions = pickSimilarServices(c, services, lastActiveAt, now);
    if (!suggestions.length) continue;
    plan.similar.push({ conv: c, suggestions });
    profileIds.add(c.job.client_id);
  }

  const { data: profs } = profileIds.size ? await admin.from("profiles").select("id, full_name, business_name").in("id", [...profileIds]) : { data: [] };
  const P = Object.fromEntries((profs || []).map((p) => [p.id, p]));

  const emails = [];
  for (const { job, providerId } of plan.jobMatches) {
    emails.push({ kind: "new_job_match", profileId: providerId, jobId: job.id, title: "Kategorinde yeni bir ilan var", note: job.title,
      mail: jobMatchEmail({ providerName: nameOf(P[providerId]), job, categoryName: catName[job.category_id] }) });
  }
  for (const c of plan.reminders) {
    emails.push({ kind: "message_reminder", profileId: c.providerId, jobId: c.job.id, title: "Bir müşteri yanıtını bekliyor", note: c.job.services?.title,
      mail: reminderEmail({ providerName: nameOf(P[c.providerId]), clientName: nameOf(P[c.job.client_id]), serviceTitle: c.job.services?.title, firstMessage: c.firstClientBody }) });
  }
  for (const { conv: c, suggestions } of plan.similar) {
    const days = Math.max(1, Math.round((now - new Date(c.firstClientAt).getTime()) / 864e5));
    emails.push({ kind: "similar_vitrins", profileId: c.job.client_id, jobId: c.job.id, title: "Henüz yanıt gelmedi: benzer vitrinler", note: c.job.services?.title,
      mail: similarEmail({ clientName: nameOf(P[c.job.client_id]), serviceTitle: c.job.services?.title, days, suggestions }) });
  }

  if (dry) {
    return Response.json({ ok: true, dry: true, count: emails.length,
      emails: emails.map((e) => ({ kind: e.kind, profile: e.profileId.slice(0, 8), job: e.jobId.slice(0, 8), subject: e.mail.subject, body: e.mail.body })) });
  }

  const result = { new_job_match: 0, message_reminder: 0, similar_vitrins: 0, skipped: 0 };
  for (const e of emails) {
    const { error } = await admin.from("notifications").insert({ profile_id: e.profileId, type: e.kind, title: e.title, body: (e.note || "").slice(0, 120), related_job_id: e.jobId });
    if (error) { result.skipped++; continue; }
    const to = await emailOf(admin, e.profileId);
    if (await sendEmail(admin, to, e.mail).catch(() => false)) result[e.kind]++;
    else result.skipped++;
  }
  return Response.json({ ok: true, ...result });
}
