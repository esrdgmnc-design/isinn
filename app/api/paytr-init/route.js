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
import { computeUpgradeCredit, applyCredit } from "../../../lib/upgradeCredit";

export async function POST(request) {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.isinn.com.tr";

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

  // orderType "plan" (Standart/Pro, subscription_plans) veya "addon" (Ek
  // Vitrin Paketi, Öne Çıkarma vb., addon_products) — ikisi de aynı akıştan
  // geçiyor, sadece fiyatı hangi tablodan okuduğumuz değişiyor. Addon'lar
  // şu an sadece aylık (addon_products'ta price_yearly yok).
  const { planSlug, addonSlug, billingCycle, serviceId } = await request.json();
  const orderType = addonSlug ? "addon" : "plan";
  const itemSlug = addonSlug || planSlug;
  if (!itemSlug || !["monthly", "yearly"].includes(billingCycle)) {
    return Response.json({ ok: false, message: "Eksik veya geçersiz ürün bilgisi." }, { status: 400 });
  }
  if (orderType === "addon" && billingCycle !== "monthly") {
    return Response.json({ ok: false, message: "Bu paket sadece aylık satın alınabilir." }, { status: 400 });
  }

  // "Ek Vitrin Paketi" satışta DEĞİL: 2'den fazla vitrin hakkı sadece Pro Üyelikle
  // gelir. (Eski satın alımlar süreleri bitene kadar geçerli kalır, ama yeni
  // satış/yenileme yapılamaz.)
  if (itemSlug === "ek-vitrin") {
    return Response.json({ ok: false, message: "Bu paket artık satışta değil. Daha fazla vitrin için Pro Üyeliğe geç." }, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  // Öne Çıkarma Paketi artık "seçtiğin bir vitrini öne çıkarır" sözünü
  // gerçekten tutuyor (2026-09-14) — hangi vitrin olduğunu burada, ödeme
  // başlamadan ÖNCE doğruluyoruz. Sahiplik kontrolü kritik: kullanıcı
  // başkasının vitrinini seçip onu öne çıkaramamalı.
  const boostSlugs = ["one-cikarma", "one-cikarma-haftalik"];
  let boostedServiceTitle = null;
  // Öne Çıkarma artık kişinin TÜM (aktif) vitrinlerine birden uygulanır — vitrin
  // seçimi yok, sipariş service_id taşımaz (tek satır, tek ücret). Öne çıkarılacak
  // en az bir aktif vitrin olmalı.
  if (boostSlugs.includes(itemSlug)) {
    const { count: activeVitrinCount } = await admin
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("provider_id", user.id)
      .eq("active", true);
    if (!activeVitrinCount) {
      return Response.json({ ok: false, message: "Öne çıkarmak için önce yayında bir vitrinin olmalı." }, { status: 400 });
    }
  }

  let itemName, price;
  if (orderType === "addon") {
    const { data: addon } = await admin
      .from("addon_products")
      .select("id, name, slug, price_monthly")
      .eq("slug", itemSlug)
      .eq("active", true)
      .maybeSingle();
    if (!addon) return Response.json({ ok: false, message: "Paket bulunamadı." }, { status: 404 });
    itemName = boostedServiceTitle ? `${addon.name} — ${boostedServiceTitle}` : addon.name;
    price = addon.price_monthly;
  } else {
    const { data: plan } = await admin
      .from("subscription_plans")
      .select("id, name, slug, price_monthly, price_yearly")
      .eq("slug", itemSlug)
      .eq("active", true)
      .maybeSingle();
    if (!plan) return Response.json({ ok: false, message: "Plan bulunamadı." }, { status: 404 });
    itemName = plan.name;
    price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
    // Standart'tan Pro'ya geçişte kalan ücretli sürenin değeri düşülür.
    const upgradeCredit = await computeUpgradeCredit(admin, user.id, itemSlug);
    if (upgradeCredit > 0) {
      price = applyCredit(price, upgradeCredit);
      itemName = `${plan.name} (Standart kalan süre indirimi: -${upgradeCredit.toFixed(2)}₺)`;
    }
  }
  if (!price || price <= 0) {
    return Response.json({ ok: false, message: "Bu ürün için fiyat tanımlı değil." }, { status: 400 });
  }

  // "Kredi kartı otomatik hatırlar mı" (2026-09-13) — PayTR'ın Kart Saklama
  // API'siyle her ödemede kartı saklamayı deniyoruz (store_card:1). Kullanıcının
  // zaten kayıtlı bir kartı varsa (payment_methods'ta utoken) onu da birlikte
  // gönderiyoruz — PayTR dokümanına göre var olan bir utoken'a yeni kart
  // eklenirken ikisi birlikte gitmesi gerekiyor.
  const { data: existingMethod } = await admin
    .from("payment_methods")
    .select("utoken")
    .eq("profile_id", user.id)
    .maybeSingle();

  const merchantOid = generateMerchantOid("ISINN");
  const userIp = getClientIp(request);
  const email = user.email || "";
  const paymentAmount = Math.round(price * 100); // PayTR kuruş cinsinden bekliyor
  const userBasketBase64 = Buffer.from(JSON.stringify([[`${itemName} (${billingCycle === "yearly" ? "yıllık" : "aylık"})`, price.toFixed(2), 1]])).toString("base64");
  const currency = "TL";
  // GÜVENLİ VARSAYILAN (2026-09-13 — gerçek bir yakın-kaçırma sonrası
  // düzeltildi): eskiden bu satır "PAYTR_TEST_MODE === '1' ise test, aksi
  // halde canlı" diyordu — yani ortam değişkeni Vercel'e hiç eklenmemişse
  // ya da yanlış yazılmışsa sessizce CANLI moda düşüyordu. Gerçekten de
  // öyle oldu: env değişkeni eklenmeden önce yapılan bir "test" ödemesi
  // muhtemelen gerçek bir kart çekimiydi. Artık tam tersi: sadece açıkça
  // "0" yazılırsa canlıya geçiyor, her şey (eksik, yanlış yazılmış, boş)
  // güvenli tarafta — test modunda kalıyor.
  const testMode = process.env.PAYTR_TEST_MODE === "0" ? "0" : "1";
  const noInstallment = "0";
  const maxInstallment = "0";

  const { error: insertErr } = await admin.from("payment_orders").insert({
    merchant_oid: merchantOid,
    profile_id: user.id,
    plan_slug: itemSlug,
    order_type: orderType,
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
    store_card: "1",
    ...(existingMethod?.utoken ? { utoken: existingMethod.utoken } : {}),
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
