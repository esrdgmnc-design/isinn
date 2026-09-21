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

  const { planSlug, addonSlug, billingCycle } = await request.json();
  const orderType = addonSlug ? "addon" : "plan";
  const itemSlug = addonSlug || planSlug;
  if (!itemSlug || !["monthly", "yearly"].includes(billingCycle)) {
    return Response.json({ ok: false, message: "Eksik veya geçersiz ürün bilgisi." }, { status: 400 });
  }
  if (itemSlug === "ek-vitrin") {
    return Response.json({ ok: false, message: "Bu paket artık satışta değil. Daha fazla vitrin için Pro Üyeliğe geç." }, { status: 400 });
  }

  // Öne Çıkarma kişinin TÜM aktif vitrinlerine uygulanır (vitrin seçimi yok) —
  // ama öne çıkarılacak en az bir aktif vitrin olmalı.
  const boostSlugs = ["one-cikarma", "one-cikarma-haftalik"];
  if (boostSlugs.includes(itemSlug)) {
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { count: activeVitrinCount } = await admin
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("provider_id", user.id)
      .eq("active", true);
    if (!activeVitrinCount) {
      return Response.json({ ok: false, message: "Öne çıkarmak için önce yayında bir vitrinin olmalı." }, { status: 400 });
    }
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
