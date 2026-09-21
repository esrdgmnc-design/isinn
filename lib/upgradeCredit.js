// Standart'tan Pro'ya geçişte kalan ücretli sürenin değeri Pro fiyatından düşülür.
// Eskiden Pro'ya geçen tam fiyatı ödüyor, Standart için ödediği dönem ise kayboluyordu
// (yıllık 799₺ ödeyen biri için 799₺ kayıp = şikayet/chargeback riski).
//
// Kredi = SON başarılı Standart ödemesinin tutarı × (kalan gün / dönem günü).
// Sadece ÜCRETLİ ('active') Standart için — ücretsiz deneme kredi vermez (ödenen bir
// şey yok). Pro'dan Standart'a inişte iade/kredi yoktur (Pro dönemi sonuna kadar sürer).
export async function computeUpgradeCredit(admin, profileId, targetPlanSlug) {
  if (targetPlanSlug !== "pro") return 0;

  const now = new Date();
  const { data: sub } = await admin
    .from("provider_subscriptions")
    .select("status, current_period_end, subscription_plans(slug)")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .gt("current_period_end", now.toISOString())
    .maybeSingle();
  if (!sub || sub.subscription_plans?.slug !== "standart") return 0;

  const { data: order } = await admin
    .from("payment_orders")
    .select("amount, billing_cycle")
    .eq("profile_id", profileId)
    .eq("order_type", "plan")
    .eq("plan_slug", "standart")
    .eq("status", "success")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!order) return 0;

  const paid = Number(order.amount);
  if (!Number.isFinite(paid) || paid <= 0) return 0;

  const cycleDays = order.billing_cycle === "yearly" ? 365 : 30;
  const remainingDays = Math.min(cycleDays, Math.max(0, (new Date(sub.current_period_end) - now) / 86400000));
  const credit = Math.min(paid, (paid * remainingDays) / cycleDays);
  return Math.round(credit * 100) / 100;
}

// Pro fiyatından kredi düşülmüş tutar; PayTR'ın kabul edeceği en az 1₺.
export function applyCredit(price, credit) {
  return Math.max(1, Math.round((Number(price) - credit) * 100) / 100);
}
