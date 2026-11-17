// Destek Asistanı'nın, konuştuğu kullanıcının YALNIZCA kendi durumunu görmesi için.
// Kullanıcı "vitrinim yayınlanmadı / reddedildi uyarısı aldım" dediğinde asistan
// nedenini bilmiyordu (2026-11-17, Nisa vakası: portfolyo fotoğrafı sigara paketi
// yüzünden reddedilmişti, vitrin aslında yayındaydı). moderated_images tablosu
// istemciye kapalı (bkz. supabase/listing_photo_moderation.sql), bu yüzden okuma
// burada service role ile ve SADECE oturumdaki kullanıcının profile_id'siyle yapılır.
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit } from "../../../lib/rateLimit";

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return Response.json({ error: "Yapılandırma eksik." }, { status: 500 });

  const user = await getAuthedUser(request);
  if (!user) return Response.json({ error: "Giriş yapmış olmalısın." }, { status: 401 });
  if (!checkRateLimit(`support-context:${user.id}`, { limit: 20, windowMs: 10 * 60 * 1000 })) {
    return Response.json({ error: "Çok fazla istek." }, { status: 429 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
  const [{ data: services }, { data: rejected }] = await Promise.all([
    admin
      .from("services")
      .select("title, active, deactivated_for_billing_at, created_at")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    admin
      .from("moderated_images")
      .select("reason, checked_at")
      .eq("profile_id", user.id)
      .eq("approved", false)
      .gte("checked_at", since)
      .order("checked_at", { ascending: false })
      .limit(5),
  ]);

  return Response.json({
    vitrins: (services || []).map((s) => ({
      title: s.title,
      active: !!s.active,
      closedForBilling: !!s.deactivated_for_billing_at,
    })),
    rejectedPhotos: (rejected || []).map((r) => ({ reason: r.reason || "", at: r.checked_at })),
  });
}
