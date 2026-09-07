// Netgsm anahtarını sunucuda tutar, hiç tarayıcıya çıkarmaz — /api/claude ile
// aynı desen. Kodun kendisi burada üretilmiyor (onu request_phone_otp RPC'si
// üretiyor, DB'de sadece hash'i tutuluyor) — bu route sadece "bu kodu şu
// numaraya SMS ile gönder" işini yapıyor.
//
// Netgsm hesabı/anahtarı henüz .env.local'e eklenmediyse (NETGSM_USERCODE /
// NETGSM_PASSWORD / NETGSM_HEADER yoksa) burası "configured: false" döner —
// istemci tarafı bunu "SMS doğrulama yakında aktif olacak" diye yorumlayıp
// akışı bloklamadan devam ettirir (yumuşak blok). Anahtarlar eklenince
// otomatik olarak gerçek SMS göndermeye başlar, kod değişikliği gerekmez.
// Gerçek SMS göndermeden, sadece Netgsm anahtarları .env.local'e eklenmiş mi
// diye ucuz bir kontrol — gating mantığı (Hizmet Ekle/İlan Ver/mesaj) bunu
// kullanıp "SMS servisi aktif mi, doğrulamayı zorunlu kılalım mı" karar veriyor.
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

  const { phone, code } = await request.json();
  if (!phone || !code) {
    return Response.json({ sent: false, configured: true, message: "Telefon veya kod eksik." }, { status: 400 });
  }

  // Netgsm'in uzun süredir değişmeyen klasik REST/GET API'si. Netgsm panelinde
  // farklı bir uç nokta (örn. OTP'ye özel) görürsen buradaki URL'i ona göre
  // güncellemek gerekebilir — hesabı açtıktan sonra dokümanla karşılaştır.
  const gsmno = phone.replace(/\D/g, "");
  const message = `İşinn doğrulama kodun: ${code}`;
  const params = new URLSearchParams({
    usercode,
    password,
    gsmno,
    message,
    msgheader: header,
  });

  try {
    const res = await fetch(`https://api.netgsm.com.tr/sms/send/get?${params.toString()}`, { method: "GET" });
    const text = await res.text();
    // Netgsm başarı durumunda "00 <jobid>" gibi bir kodla başlar; "00" veya
    // "01" ile başlamayan yanıtlar hata anlamına gelir.
    const ok = /^0[01]/.test(text.trim());
    return Response.json({ sent: ok, configured: true, providerResponse: text.trim() }, { status: ok ? 200 : 502 });
  } catch (err) {
    return Response.json({ sent: false, configured: true, message: err.message }, { status: 500 });
  }
}
