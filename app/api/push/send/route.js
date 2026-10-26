// Supabase Database Webhook (notifications INSERT) -> bu route -> APNs.
// Webhook başlığı: Authorization: Bearer <PUSH_WEBHOOK_SECRET> (Dashboard > Database > Webhooks; sır repoya girmez).
// Mahremiyet: bildirim metni (mesaj gövdesi vb.) kilit ekranına konmaz, sabit kısa başlıklar kullanılır.
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { sendApns, apnsConfigured } from "../../../../lib/apns";

export const runtime = "nodejs";
export const maxDuration = 30;

// iOS'ta Planlar gizli olduğu için abonelik/dunning bildirimleri; gürültü yüzünden favori ve yönetici bildirimleri push'a bağlanmaz.
const PUSH_TEXT = {
  new_message: ["İşinn", "Yeni bir mesajın var"],
  new_job_match: ["İşinn", "Sana uygun yeni bir ilan var"],
  ai_match_top3: ["İşinn", "İlanın için önerilen vitrinler hazır"],
  saved_search_match: ["İşinn", "Kayıtlı aramana uyan yeni bir vitrin var"],
  job_delivered: ["İşinn", "Bir iş teslim edildi olarak işaretlendi"],
  media_approved: ["İşinn", "Yüklediğin içerik onaylandı"],
  media_rejected: ["İşinn", "Yüklediğin içerik onaylanmadı"],
  listing_text_edited: ["İşinn", "Vitrin metninde bir değişiklik var"],
  message_reminder: ["İşinn", "Bir müşteri yanıtını bekliyor"],
  similar_vitrins: ["İşinn", "Henüz yanıt gelmedi: benzer vitrinlere göz at"],
};
const DAILY_LIMIT = 4;

function secretOk(request) {
  const expected = process.env.PUSH_WEBHOOK_SECRET || "";
  const got = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!expected || expected.length < 16) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request) {
  if (!secretOk(request)) return Response.json({ ok: false }, { status: 401 });
  if (!apnsConfigured()) return Response.json({ ok: false, reason: "apns_not_configured" }, { status: 200 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return Response.json({ ok: false }, { status: 500 });

  let payload = {};
  try { payload = await request.json(); } catch {}
  const row = payload?.record;
  if (!row?.id || !row?.profile_id || !PUSH_TEXT[row.type]) return Response.json({ ok: true, skipped: "type" });

  const sb = createClient(url, key);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await sb.from("notifications").select("id", { count: "exact", head: true }).eq("profile_id", row.profile_id).gte("push_sent_at", since);
  if ((count || 0) >= DAILY_LIMIT) return Response.json({ ok: true, skipped: "daily_limit" });

  const { data: tokens } = await sb.from("device_push_tokens").select("token").eq("profile_id", row.profile_id).limit(5);
  if (!tokens || tokens.length === 0) return Response.json({ ok: true, skipped: "no_token" });

  const [title, body] = PUSH_TEXT[row.type];
  let sent = 0;
  for (const { token } of tokens) {
    const r = await sendApns(token, {
      title,
      body,
      collapseId: row.related_job_id || row.id,
      data: { type: row.type, related_job_id: row.related_job_id || null, related_service_id: row.related_service_id || null },
    });
    if (r.status === 200) sent++;
    else if (r.status === 410 || (r.status === 400 && r.reason === "BadDeviceToken") || r.reason === "Unregistered") {
      await sb.from("device_push_tokens").delete().eq("token", token);
    }
  }
  if (sent > 0) await sb.from("notifications").update({ push_sent_at: new Date().toISOString() }).eq("id", row.id);
  return Response.json({ ok: true, sent });
}
