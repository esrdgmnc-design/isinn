// PayTR "Bildirim URL (Callback URL)" — mağaza panelinde bu route'un tam
// adresi girilmeli: https://isinn.com.tr/api/paytr-callback
//
// PayTR ödeme sonucunu buraya form-encoded bir POST ile bildiriyor (JSON
// DEĞİL). Kritik kurallar (dev.paytr.com/en/iframe-api/iframe-api-2-adim):
// 1) Her zaman hash doğrulaması yap — merchant_oid + merchant_salt + status
//    + total_amount, HMAC-SHA256, merchant_key ile — bu satırlar sahte bir
//    "ödeme başarılı" isteğini engelleyen tek şey.
// 2) merchant_oid ile siparişi bul, ZATEN işlenmişse (idempotency) tekrar
//    işleme — PayTR aynı bildirimi birden fazla kez gönderebiliyor.
// 3) Yanıt olarak SADECE "OK" metni dön — JSON değil, HTML değil, başka
//    hiçbir şey değil. Aksi halde PayTR bildirimi "başarısız" sayıp tekrar
//    tekrar dener.
import { createClient } from "@supabase/supabase-js";
import { computeCallbackHash } from "../../../lib/paytr";

export async function POST(request) {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!merchantKey || !merchantSalt || !serviceRoleKey || !supabaseUrl) {
    // Yapılandırma eksikse PayTR'a "OK" DEMİYORUZ ki bir şey ters gittiğini
    // fark edip tekrar denesin — ama bu route zaten sadece PayTR'ın
    // ulaştığı bir uç, kullanıcıya hiçbir şey göstermiyor.
    return new Response("PAYTR notification failed: server not configured", { status: 500 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return new Response("PAYTR notification failed: bad body", { status: 400 });
  }
  const merchantOid = form.get("merchant_oid");
  const status = form.get("status");
  const totalAmount = form.get("total_amount");
  const hash = form.get("hash");
  const failedReasonMsg = form.get("failed_reason_msg") || null;

  if (!merchantOid || !status || !totalAmount || !hash) {
    return new Response("PAYTR notification failed: missing fields", { status: 400 });
  }

  const expectedHash = computeCallbackHash({ merchantOid, merchantSalt, status, totalAmount, merchantKey });
  if (expectedHash !== hash) {
    // Hash tutmuyorsa bu PayTR'dan gelmiyor demektir (ya da sahte) — işleme,
    // "OK" da deme.
    return new Response("PAYTR notification failed: bad hash", { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { data: order } = await admin
    .from("payment_orders")
    .select("id, profile_id, plan_slug, order_type, billing_cycle, status")
    .eq("merchant_oid", merchantOid)
    .maybeSingle();

  if (!order) {
    // Bilmediğimiz bir sipariş — yine de PayTR'a tekrar denemesin diye "OK"
    // döndürmüyoruz, ama bu ileride debug için loglanabilir.
    return new Response("PAYTR notification failed: unknown order", { status: 404 });
  }

  if (order.status !== "pending") {
    // Zaten işlenmiş (PayTR'ın tekrar gönderdiği bir bildirim) — sorun yok,
    // sadece onayla.
    return new Response("OK");
  }

  if (status === "success") {
    const periodEnd = new Date(Date.now() + (order.billing_cycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000);

    if (order.order_type === "addon") {
      const { data: addon } = await admin
        .from("addon_products")
        .select("id")
        .eq("slug", order.plan_slug)
        .maybeSingle();

      if (addon) {
        const { data: existingAddon } = await admin
          .from("provider_addons")
          .select("id")
          .eq("profile_id", order.profile_id)
          .eq("addon_id", addon.id)
          .maybeSingle();

        if (existingAddon) {
          await admin.from("provider_addons").update({
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
          }).eq("id", existingAddon.id);
        } else {
          await admin.from("provider_addons").insert({
            profile_id: order.profile_id,
            addon_id: addon.id,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
          });
        }
      }
    } else {
      const { data: plan } = await admin
        .from("subscription_plans")
        .select("id")
        .eq("slug", order.plan_slug)
        .maybeSingle();

      if (plan) {
        const { data: existing } = await admin
          .from("provider_subscriptions")
          .select("id")
          .eq("profile_id", order.profile_id)
          .maybeSingle();

        if (existing) {
          await admin.from("provider_subscriptions").update({
            plan_id: plan.id,
            status: "active",
            billing_cycle: order.billing_cycle,
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
          }).eq("id", existing.id);
        } else {
          await admin.from("provider_subscriptions").insert({
            profile_id: order.profile_id,
            plan_id: plan.id,
            status: "active",
            billing_cycle: order.billing_cycle,
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
          });
        }
      }
    }

    await admin.from("payment_orders").update({ status: "success", paid_at: new Date().toISOString() }).eq("id", order.id);
  } else {
    await admin.from("payment_orders").update({ status: "failed", failed_reason: failedReasonMsg }).eq("id", order.id);
  }

  return new Response("OK");
}
