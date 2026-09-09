// Netgsm anahtarını sunucuda tutar, hiç tarayıcıya çıkarmaz — /api/claude ile
// aynı desen.
//
// GÜVENLİK DÜZELTMESİ: bu route eskiden kodun ÜRETİMİNİ Postgres'e
// (request_phone_otp RPC) bırakıyordu ve o RPC kodun düz halini tarayıcıya
// döndürüyordu — yani telefon sahibi olduğunu "kanıtlamak" için gönderilen
// SMS'i hiç almadan da kodu bilebiliyordu (bkz. supabase/fix_otp_leak.sql).
// Artık kodun ÜRETİMİ VE DB'YE YAZILMASI tamamen burada, sunucuda oluyor —
// tarayıcıya asla kod dönmüyor, sadece "gönderildi mi" bilgisi dönüyor.
// Ayrıca eskiden bu route tamamen açıktı (kimlik doğrulama yoktu) — herkes
// istediği numaraya istediği "kod" metniyle SMS attırabilirdi (SMS
// bombalama + Netgsm kredisi tüketimi). Şimdi gerçek bir Supabase
// oturumu şart (zaten alttaki DB akışı da hep bunu gerektiriyordu).
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit } from "../../../lib/rateLimit";

export async function GET() {
  const configured = !!(process.env.NETGSM_USERCODE && process.env.NETGSM_PASSWORD && process.env.NETGSM_HEADER);
  return Response.json({ configured });
}

export async function POST(request) {
  const usercode = process.env.NETGSM_USERCODE;
  const password = process.env.NETGSM_PASSWORD;
  const header = process.env.NETGSM_HEADER;

  if (!usercode || !password || !header) {
    return Response.json({ sent: false, configured: false, message: "SMS servisi henüz yapılandırılmadı." });
  }

  const user = await getAuthedUser(request);
  if (!user) {
    return Response.json({ sent: false, configured: true, message: "Giriş yapmış olmalısın." }, { status: 401 });
  }

  if (!checkRateLimit(`send-otp:${user.id}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return Response.json({ sent: false, configured: true, message: "Çok fazla deneme yaptın, bir süre sonra tekrar dene." }, { status: 429 });
  }

  const { phone } = await request.json();
  if (!phone) {
    return Response.json({ sent: false, configured: true, message: "Telefon eksik." }, { status: 400 });
  }
  const gsmno = phone.replace(/\D/g, "");
  if (gsmno.length < 10) {
    return Response.json({ sent: false, configured: true, message: "Geçerli bir telefon numarası gir." }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return Response.json(
      { sent: false, configured: true, message: "SUPABASE_SERVICE_ROLE_KEY ortam değişkeni ayarlanmamış." },
      { status: 500 }
    );
  }

  // Kod SUNUCUDA üretiliyor, hiçbir zaman tarayıcıya dönmüyor.
  const code = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { error: storeErr } = await admin.rpc("store_phone_otp", {
    p_profile_id: user.id,
    p_phone: phone,
    p_code: code,
  });
  if (storeErr) {
    return Response.json({ sent: false, configured: true, message: storeErr.message }, { status: 500 });
  }

  const message = `İşinn doğrulama kodun: ${code}`;
  const params = new URLSearchParams({ usercode, password, gsmno, message, msgheader: header });

  try {
    const res = await fetch(`https://api.netgsm.com.tr/sms/send/get?${params.toString()}`, { method: "GET" });
    const text = await res.text();
    // Netgsm başarı durumunda "00 <jobid>" gibi bir kodla başlar; "00" veya
    // "01" ile başlamayan yanıtlar hata anlamına gelir.
    const ok = /^0[01]/.test(text.trim());
    return Response.json({ sent: ok, configured: true }, { status: ok ? 200 : 502 });
  } catch (err) {
    return Response.json({ sent: false, configured: true, message: err.message }, { status: 500 });
  }
}
