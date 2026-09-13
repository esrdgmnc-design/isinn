// Kullanıcı "Pro'ya/Standart'a Yükselt → Öde" dediğinde çağrılan route.
// PayTR'ın get-token uç noktasına sunucu tarafında (merchant_key/salt hiç
// tarayıcıya çıkmadan) istek atıp dönen iframe_token'ı client'a veriyor —
// client bunu <iframe src="https://www.paytr.com/odeme/guvenli/{token}">
// içinde açıyor. Aynı zamanda payment_orders'a "pending" bir satır yazıyor;
// gerçek onay paytr-callback route'undan geliyor (bkz. o dosyadaki not).
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";
import { computeGetTokenHash, generateMerchantOid } from "../../../lib/paytr";

export async function POST(request) {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isinn.com.tr";

  if (!merchantId || !merchantKey || !merchantSalt) {
    return Response.json({ ok: false, message: "Ödeme servisi henüz yapılandırılmadı." }, { status: 500 });
  }
  if (!serviceRoleKey || !supabaseUrl) {
    return Response.json({ ok: false, message: "Sunucu yapılandırması eksik." }, { status: 500 });
  }

  const user = await getAuthedUser(request);
  if (!user) {
    return Response.json({ ok: false, message: "Giriş yapmış olmalısın." }, { status: 401 });
  }

  if (!checkRateLimit(`paytr-init:${user.id}`, { limit: 10, windowMs: 60 * 60 * 1000 })) {
    return Response.json({ ok: false, message: "Çok fazla deneme yaptın, bir süre sonra tekrar dene." }, { status: 429 });
  }

  const { planSlug, billingCycle } = await request.json();
  if (!planSlug || !["monthly", "yearly"].includes(billingCycle)) {
    return Response.json({ ok: false, message: "Eksik veya geçersiz plan bilgisi." }, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { data: plan } = await admin
    .from("subscription_plans")
    .select("id, name, slug, price_monthly, price_yearly")
    .eq("slug", planSlug)
    .eq("active", true)
    .maybeSingle();
  if (!plan) {
    return Response.json({ ok: false, message: "Plan bulunamadı." }, { status: 404 });
  }
  const price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
  if (!price || price <= 0) {
    return Response.json({ ok: false, message: "Bu plan için fiyat tanımlı değil." }, { status: 400 });
  }

  const merchantOid = generateMerchantOid("ISINN");
  const userIp = getClientIp(request);
  const email = user.email || "";
  const paymentAmount = Math.round(price * 100); // PayTR kuruş cinsinden bekliyor
  const userBasketBase64 = Buffer.from(JSON.stringify([[`${plan.name} (${billingCycle === "yearly" ? "yıllık" : "aylık"})`, price.toFixed(2), 1]])).toString("base64");
  const currency = "TL";
  const testMode = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";
  const noInstallment = "0";
  const maxInstallment = "0";

  const { error: insertErr } = await admin.from("payment_orders").insert({
    merchant_oid: merchantOid,
    profile_id: user.id,
    plan_slug: plan.slug,
    billing_cycle: billingCycle,
    amount: price,
    status: "pending",
  });
  if (insertErr) {
    return Response.json({ ok: false, message: "Sipariş oluşturulamadı: " + insertErr.message }, { status: 500 });
  }

  const paytrToken = computeGetTokenHash({
    merchantId, userIp, merchantOid, email, paymentAmount, userBasketBase64,
    noInstallment, maxInstallment, currency, testMode, merchantSalt, merchantKey,
  });

  const body = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email,
    payment_amount: String(paymentAmount),
    user_basket: userBasketBase64,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    currency,
    test_mode: testMode,
    paytr_token: paytrToken,
    user_name: user.user_metadata?.full_name || email,
    user_address: "Türkiye",
    user_phone: "05000000000",
    merchant_ok_url: `${siteUrl}/odeme/basarili`,
    merchant_fail_url: `${siteUrl}/odeme/basarisiz`,
    timeout_limit: "30",
    debug_on: testMode === "1" ? "1" : "0",
    lang: "tr",
  });

  try {
    const res = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = await res.json();
    if (data.status !== "success") {
      await admin.from("payment_orders").update({ status: "failed", failed_reason: data.reason || "get-token reddedildi" }).eq("merchant_oid", merchantOid);
      return Response.json({ ok: false, message: data.reason || "Ödeme başlatılamadı." }, { status: 502 });
    }
    return Response.json({ ok: true, token: data.token });
  } catch (err) {
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
