// iOS cihaz anahtarını (APNs token) kaydeder / siler. Yazma yalnızca burada, service role ile yapılır:
// aynı cihaz anahtarı başka bir hesaba geçebilir (çıkış/giriş), upsert eski sahibi değiştirir.
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../../lib/serverAuth";
import { checkRateLimit } from "../../../../lib/rateLimit";

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key) : null;
}
const validToken = (t) => typeof t === "string" && /^[0-9a-fA-F]{32,200}$/.test(t);

export async function POST(request) {
  const user = await getAuthedUser(request);
  if (!user) return Response.json({ ok: false }, { status: 401 });
  if (!checkRateLimit(`push-register:${user.id}`, { limit: 20, windowMs: 60 * 60 * 1000 })) return Response.json({ ok: false }, { status: 429 });
  let body = {};
  try { body = await request.json(); } catch {}
  if (!validToken(body?.token)) return Response.json({ ok: false }, { status: 400 });
  const sb = admin();
  if (!sb) return Response.json({ ok: false }, { status: 500 });
  const { error } = await sb.from("device_push_tokens").upsert(
    { token: body.token.toLowerCase(), profile_id: user.id, platform: "ios", last_seen_at: new Date().toISOString() },
    { onConflict: "token" },
  );
  return Response.json({ ok: !error }, { status: error ? 500 : 200 });
}

export async function DELETE(request) {
  const user = await getAuthedUser(request);
  if (!user) return Response.json({ ok: false }, { status: 401 });
  let body = {};
  try { body = await request.json(); } catch {}
  if (!validToken(body?.token)) return Response.json({ ok: false }, { status: 400 });
  const sb = admin();
  if (!sb) return Response.json({ ok: false }, { status: 500 });
  await sb.from("device_push_tokens").delete().eq("token", body.token.toLowerCase()).eq("profile_id", user.id);
  return Response.json({ ok: true });
}
