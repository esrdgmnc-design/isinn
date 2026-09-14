// Kayıtlı karttan (utoken/ctoken) yeniden ödeme alma — hem otomatik yenileme
// cron'u (app/api/cron/renew-subscriptions) hem "kayıtlı kartınla öde" hızlı
// satın alma butonu tarafından kullanılıyor. Kullanıcı hiçbir kart bilgisi
// girmiyor — non_3d + recurring_payment ile doğrudan PayTR'a gidiyor.
import { createClient } from "@supabase/supabase-js";
import { computeRecurringHash, generateMerchantOid } from "./paytr";

// @param {object} opts
// @param {string} opts.profileId
// @param {"plan"|"addon"} opts.orderType
// @param {string} opts.itemSlug - subscription_plans.slug ya da addon_products.slug
// @param {"monthly"|"yearly"} opts.billingCycle
// @param {string} [opts.userIp] - varsa isteği başlatan kullanıcının IP'si
//   (hızlı satın alma butonu için); cron'dan çağrılırken gerçek bir kullanıcı
//   IP'si yok, o yüzden bizim kendi sabit QuotaGuard IP'mize düşüyor —
//   uydurma bir adres değil, gerçekten bize ait, sabit bir IP.
// @param {string} [opts.serviceId] - Öne Çıkarma (boost) satın alımlarında
//   hangi vitrin öne çıkarılacak (bkz. boost_per_vitrin.sql). Sahiplik
//   kontrolü ÇAĞIRANDA yapılmalı (paytr-charge-saved route'unda olduğu gibi,
//   paytr-init'teki pattern'in aynısı) — bu fonksiyon güveniyor, tekrar
//   sorgulamıyor, çünkü cron'dan da çağrılıyor ve cron'un zaten kendi
//   service_id'si güvenilir kaynaktan (provider_subscriptions/provider_addons
//   satırının kendisinden) geliyor.
export async function chargeSavedCard({ profileId, orderType, itemSlug, billingCycle, userIp = "52.29.67.170", serviceId = null }) {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!merchantId || !merchantKey || !merchantSalt || !serviceRoleKey || !supabaseUrl) {
    return { ok: false, message: "Ödeme servisi yapılandırılmamış." };
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { data: method } = await admin
    .from("payment_methods")
    .select("utoken, ctoken")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (!method) {
    return { ok: false, message: "Kayıtlı kart bulunamadı." };
  }

  const { data: profile } = await admin.from("profiles").select("id").eq("id", profileId).maybeSingle();
  if (!profile) return { ok: false, message: "Kullanıcı bulunamadı." };

  let itemName, price;
  if (orderType === "addon") {
    const { data: addon } = await admin.from("addon_products").select("name, price_monthly").eq("slug", itemSlug).eq("active", true).maybeSingle();
    if (!addon) return { ok: false, message: "Paket bulunamadı." };
    itemName = addon.name;
    price = addon.price_monthly;
  } else {
    const { data: plan } = await admin.from("subscription_plans").select("name, price_monthly, price_yearly").eq("slug", itemSlug).eq("active", true).maybeSingle();
    if (!plan) return { ok: false, message: "Plan bulunamadı." };
    itemName = plan.name;
    price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
  }
  if (!price || price <= 0) return { ok: false, message: "Fiyat tanımlı değil." };

  // auth.users'tan e-posta — admin.auth.admin API'si service role ile çalışır.
  const { data: userRes } = await admin.auth.admin.getUserById(profileId);
  const email = userRes?.user?.email || "";

  const merchantOid = generateMerchantOid("ISINNREC");
  const paymentAmount = Math.round(price * 100);
  const currency = "TL";
  const testMode = process.env.PAYTR_TEST_MODE === "0" ? "0" : "1";
  const paymentType = "card";
  const installmentCount = "0";
  const non3d = "1";
  const userBasketBase64 = Buffer.from(JSON.stringify([[`${itemName} (otomatik yenileme)`, price.toFixed(2), 1]])).toString("base64");

  const boostSlugs = ["one-cikarma", "one-cikarma-haftalik"];
  const { error: insertErr } = await admin.from("payment_orders").insert({
    merchant_oid: merchantOid,
    profile_id: profileId,
    plan_slug: itemSlug,
    order_type: orderType,
    billing_cycle: billingCycle,
    amount: price,
    status: "pending",
    ...(boostSlugs.includes(itemSlug) && serviceId ? { service_id: serviceId } : {}),
  });
  if (insertErr) return { ok: false, message: "Sipariş oluşturulamadı: " + insertErr.message };

  const paytrToken = computeRecurringHash({
    merchantId, userIp, merchantOid, email, paymentAmount, paymentType,
    installmentCount, currency, testMode, non3d, merchantSalt, merchantKey,
  });

  try {
    const res = await fetch("https://www.paytr.com/odeme", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        merchant_id: merchantId,
        user_ip: userIp,
        merchant_oid: merchantOid,
        email,
        payment_amount: String(paymentAmount),
        payment_type: paymentType,
        installment_count: installmentCount,
        currency,
        test_mode: testMode,
        non_3d: non3d,
        recurring_payment: "1",
        utoken: method.utoken,
        ctoken: method.ctoken,
        user_basket: userBasketBase64,
        user_name: email || "İşinn kullanıcısı",
        user_address: "Türkiye",
        user_phone: "05000000000",
        merchant_ok_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.isinn.com.tr"}/odeme/basarili`,
        merchant_fail_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.isinn.com.tr"}/odeme/basarisiz`,
        paytr_token: paytrToken,
      }).toString(),
    });
    const data = await res.json();
    if (data.status === "failed") {
      await admin.from("payment_orders").update({ status: "failed", failed_reason: data.msg || "recurring reddedildi" }).eq("merchant_oid", merchantOid);
      return { ok: false, message: data.msg || "Ödeme reddedildi." };
    }
    // "success" ya da "wait_callback" — kesin onay her hâlükârda
    // paytr-callback route'undan (Bildirim URL) geliyor, burada sadece
    // isteğin PayTR'a ulaştığını biliyoruz. merchantOid'i döndürüyoruz ki
    // çağıran taraf (hızlı satın alma butonu) callback gerçekten işleyene
    // kadar payment_orders.status'u kısaca polling ile izleyebilsin.
    return { ok: true, merchantOid };
  } catch (err) {
    await admin.from("payment_orders").update({ status: "failed", failed_reason: err.message }).eq("merchant_oid", merchantOid);
    return { ok: false, message: err.message };
  }
}
