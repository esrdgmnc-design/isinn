// "Kayıtlı kartınla öde" — kullanıcının daha önce sakladığı kartla (PayTR'ın
// utoken/ctoken'ı, kart numarası bizde hiç yok) tek tıkla, iframe açmadan
// ödeme alır. Standart/Pro yükseltme, Öne Çıkarma ve Ek Vitrin Paketi gibi
// TÜM ürünler için kullanılabilir — kart zaten kayıtlıysa iframe'e hiç gerek
// yok (iframe sadece ilk kart kaydında/CVV gerektiğinde şart).
import { createClient } from "@supabase/supabase-js";
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

  const { planSlug, addonSlug, billingCycle, serviceId } = await request.json();
  const orderType = addonSlug ? "addon" : "plan";
  const itemSlug = addonSlug || planSlug;
  if (!itemSlug || !["monthly", "yearly"].includes(billingCycle)) {
    return Response.json({ ok: false, message: "Eksik veya geçersiz ürün bilgisi." }, { status: 400 });
  }

  // paytr-init'teki AYNI sahiplik kontrolü (bkz. o dosyadaki not, 2026-09-14)
  // — burası da kullanıcı girdisiyle serviceId alan ayrı bir uç nokta olduğu
  // için tekrarlanması gerekiyor, çağıran tarafın (client) doğru davrandığına
  // güvenmiyoruz.
  const boostSlugs = ["one-cikarma", "one-cikarma-haftalik"];
  if (boostSlugs.includes(itemSlug)) {
    if (!serviceId) {
      return Response.json({ ok: false, message: "Öne çıkarmak istediğin vitrini seçmelisin." }, { status: 400 });
    }
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: ownedService } = await admin
      .from("services")
      .select("id")
      .eq("id", serviceId)
      .eq("provider_id", user.id)
      .maybeSingle();
    if (!ownedService) {
      return Response.json({ ok: false, message: "Bu vitrin sana ait değil ya da bulunamadı." }, { status: 403 });
    }
  }

  const result = await chargeSavedCard({
    profileId: user.id,
    orderType,
    itemSlug,
    billingCycle,
    userIp: getClientIp(request),
    serviceId: boostSlugs.includes(itemSlug) ? serviceId : null,
  });

  return Response.json(result, { status: result.ok ? 200 : 502 });
}
