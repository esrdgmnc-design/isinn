// "Kayıtlı kartınla öde" — kullanıcının daha önce sakladığı kartla (PayTR'ın
// utoken/ctoken'ı, kart numarası bizde hiç yok) tek tıkla, iframe açmadan
// ödeme alır. Ek Vitrin Paketi / Öne Çıkarma gibi ikinci bir satın alma için
// kullanılıyor — ilk satın alma hâlâ iframe'den geçiyor (kart CVV'si ilk
// seferde gerekiyor).
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";
import { chargeSavedCard } from "../../../lib/paytrRecurringCharge";

export async function POST(request) {
  const user = await getAuthedUser(request);
  if (!user) {
    return Response.json({ ok: false, message: "Giriş yapmış olmalısın." }, { status: 401 });
  }
  if (!checkRateLimit(`paytr-charge-saved:${user.id}`, { limit: 10, windowMs: 60 * 60 * 1000 })) {
    return Response.json({ ok: false, message: "Çok fazla deneme yaptın, bir süre sonra tekrar dene." }, { status: 429 });
  }

  const { planSlug, addonSlug, billingCycle } = await request.json();
  const orderType = addonSlug ? "addon" : "plan";
  const itemSlug = addonSlug || planSlug;
  if (!itemSlug || !["monthly", "yearly"].includes(billingCycle)) {
    return Response.json({ ok: false, message: "Eksik veya geçersiz ürün bilgisi." }, { status: 400 });
  }

  const result = await chargeSavedCard({
    profileId: user.id,
    orderType,
    itemSlug,
    billingCycle,
    userIp: getClientIp(request),
  });

  return Response.json(result, { status: result.ok ? 200 : 502 });
}
