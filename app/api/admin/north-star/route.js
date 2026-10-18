// Kuzey yıldızı sayacı (2026-10-18): yönetim paneli için iki taraflı onaylı iş ve vitrin görüşmesi sayısı.
// jobs tablosu RLS ile yalnızca taraflara açık; sayım sunucuda service role ile yapılır, çağıranın admin
// olduğu oturum belirteciyle doğrulanır. Kişisel içerik döndürülmez, yalnızca sayılar.
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return Response.json({ error: "config" }, { status: 500 });

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "unauthorized" }, { status: 401 });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { data: me } = await admin.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
  if (!me?.is_admin) return Response.json({ error: "forbidden" }, { status: 403 });

  const { data: admins } = await admin.from("profiles").select("id").eq("is_admin", true);
  const adminIds = new Set((admins || []).map((a) => a.id));

  const { data: jobs, error } = await admin
    .from("jobs")
    .select("service_id, client_id, client_delivered_at, provider_delivered_at");
  if (error) return Response.json({ error: "query" }, { status: 500 });

  // Yönetici hesaplarının müşteri olduğu kayıtlar (test) sayılmaz; evals/funnel-report.mjs ile aynı kural.
  const real = (jobs || []).filter((j) => !adminIds.has(j.client_id));
  const threads = real.filter((j) => j.service_id).length;
  const bothConfirmed = real.filter((j) => j.client_delivered_at && j.provider_delivered_at).length;
  const oneSide = real.filter((j) => (j.client_delivered_at ? 1 : 0) + (j.provider_delivered_at ? 1 : 0) === 1).length;

  return Response.json({ threads, bothConfirmed, oneSide });
}
