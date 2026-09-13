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
import fetch from "node-fetch";
import { HttpsProxyAgent } from "hpagent";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit } from "../../../lib/rateLimit";

// Netgsm hesabında IP kısıtlaması var (2026-09-13'te "IP adres ekle" hatası
// aldık) — ama Vercel'in sunucuları sabit bir IP kullanmıyor, her istek
// farklı bir IP'den gidebiliyor. QuotaGuard Static, bu isteği SABİT iki IP'den
// (52.29.67.170 / 52.29.96.40 — Netgsm panelinde beyaz listeye alındı) geçiren
// bir proxy sağlıyor. Sadece BU istek proxy'den geçiyor — uygulamanın geri
// kalanı (Supabase, PayTR, vb.) etkilenmiyor.
const proxyUrl = process.env.QUOTAGUARD_STATIC_URL;
const proxyAgent = proxyUrl ? new HttpsProxyAgent({ keepAlive: true, proxy: proxyUrl }) : null;

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
  // Netgsm'in OTP API'si numarayı başında 0 veya ülke kodu OLMADAN, tam
  // 10 haneli ("5XXXXXXXXX") bekliyor (dokümandaki örnek: "510XXXXXXX").
  // Kullanıcı "0536...", "+90536...", "536..." gibi her formatta girebilir.
  let gsmno = phone.replace(/\D/g, "");
  if (gsmno.startsWith("90") && gsmno.length === 12) gsmno = gsmno.slice(2);
  else if (gsmno.startsWith("0") && gsmno.length === 11) gsmno = gsmno.slice(1);
  if (gsmno.length !== 10 || !gsmno.startsWith("5")) {
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

  // Netgsm OTP SMS "Türkçe karakterli gönderim yapılamamaktadır" diyor —
  // yani "İşinn doğrulama kodun" gibi bir metin bu uç noktada reddediliyor
  // (2026-09-13'te uzun süre "30" hatası almamızın asıl sebeplerinden biri
  // buydu — yanlış uç noktayı kullanıyorduk, o da klasik sms/send/get'in
  // kendi kısıtlarını taşıyordu). Mesaj bilerek tamamen ASCII.
  const message = `Isinn dogrulama kodun: ${code}`;
  const authHeader = "Basic " + Buffer.from(`${usercode}:${password}`).toString("base64");

  try {
    const res = await fetch("https://api.netgsm.com.tr/sms/rest/v2/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ msgheader: header, msg: message, no: gsmno }),
      ...(proxyAgent ? { agent: proxyAgent } : {}),
    });
    const data = await res.json();
    // Başarı: {"jobid": "...", "code": "00", "description": "success"}
    const ok = data.code === "00";
    return Response.json({ sent: ok, configured: true, message: ok ? undefined : data.description }, { status: ok ? 200 : 502 });
  } catch (err) {
    return Response.json({ sent: false, configured: true, message: err.message }, { status: 500 });
  }
}
