// Uygulama içi "Hesabımı sil" (KVKK silme hakkı + mağaza şartı). Yalnızca giriş yapmış
// kullanıcı KENDİ hesabını silebilir; istemci yazılı onay ("SİL") gönderir.
// auth.users silinince profil, vitrinler, mesajlar vb. cascade ile gider. Ödeme kayıtları
// yasal saklama için korunur (payment_orders.profile_id ON DELETE SET NULL).
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit } from "../../../lib/rateLimit";

export async function POST(request) {
  const user = await getAuthedUser(request);
  if (!user) return Response.json({ ok: false, message: "Giriş yapmış olmalısın." }, { status: 401 });
  if (!checkRateLimit(`delete-account:${user.id}`, { limit: 3, windowMs: 60 * 60 * 1000 })) {
    return Response.json({ ok: false, message: "Çok fazla deneme yaptın, biraz sonra tekrar dene." }, { status: 429 });
  }

  let body = {};
  try { body = await request.json(); } catch {}
  if (String(body?.confirm || "").trim().toLocaleUpperCase("tr-TR") !== "SİL") {
    return Response.json({ ok: false, message: "Silmek için onay kutusuna SİL yazmalısın." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ ok: false, message: "Sunucu yapılandırması eksik." }, { status: 500 });
  }
  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return Response.json({ ok: false, message: "Hesap silinemedi: " + error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}
