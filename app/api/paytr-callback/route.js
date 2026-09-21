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
import { computeCallbackHash, computeCapiListHash } from "../../../lib/paytr";
import { COMPANY } from "../../../lib/companyInfo";

// Ödeme başarılıysa PayTR bildirimde bir "utoken" de gönderiyor (kart
// store_card:1 ile saklandıysa). Bu tek başına kartı çekmek için yetmiyor —
// gerçek kart token'ı (ctoken) ayrı bir çağrıyla (CAPI LIST) alınıyor. İkisini
// birlikte payment_methods'a kaydediyoruz; "kredi kartı hatırlar mı" sorusunun
// gerçek cevabı bu iki satır (bkz. supabase/payment_methods.sql).
async function saveCardIfPresent(admin, form, profileId) {
  const utoken = form.get("utoken");
  if (!utoken) return;

  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  if (!merchantId || !merchantKey || !merchantSalt) return;

  try {
    const paytrToken = computeCapiListHash({ utoken, merchantSalt, merchantKey });
    const res = await fetch("https://www.paytr.com/odeme/capi/list", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ merchant_id: merchantId, utoken, paytr_token: paytrToken }).toString(),
    });
    const cards = await res.json();
    const card = Array.isArray(cards) ? cards[0] : Array.isArray(cards?.cards) ? cards.cards[0] : null;
    if (!card?.ctoken) return;

    await admin.from("payment_methods").upsert({
      profile_id: profileId,
      utoken,
      ctoken: card.ctoken,
      last_4: card.last_4 || null,
      card_brand: card.schema || card.c_brand || null,
      card_bank: card.c_bank || null,
      exp_month: card.month || null,
      exp_year: card.year || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "profile_id" });
  } catch {
    // Kart kaydı ikincil bir iyileştirme — başarısız olsa bile asıl ödeme
    // onayı (aşağıdaki payment_orders/provider_subscriptions güncellemesi)
    // etkilenmemeli.
  }
}

// Ödeme makbuzu e-postası (2026-09-13) — "profesyonel sitelerde ödeme sonrası
// makbuz gelir" eksikliğine cevap. send-notification-email Edge Function'ı
// zaten var ama henüz deploy edilmedi (bkz. notify_new_message_email.sql'in
// başındaki not) — o deploy edilene kadar bu da sessizce başarısız olur,
// asıl ödeme onayı/aktivasyon etkilenmez (try/catch ile izole).
async function sendReceiptEmail(admin, order, totalAmountKurus) {
  try {
    const { data: userRes } = await admin.auth.admin.getUserById(order.profile_id);
    const email = userRes?.user?.email;
    if (!email) return;

    const tl = (Number(totalAmountKurus) / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2 });
    const itemLabel = order.order_type === "addon" ? order.plan_slug : `${order.plan_slug === "pro" ? "Pro Üyelik" : order.plan_slug} Üyelik`;

    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        subject: "Ödemen alındı — İşinn",
        body:
          `Ödemen başarıyla alındı, teşekkürler!\n\n` +
          `Ürün: ${itemLabel}\n` +
          `Tutar: ${tl}₺\n` +
          `Tarih: ${new Date().toLocaleDateString("tr-TR")}\n\n` +
          `Bu bir otomatik makbuzdur. Sorularınız için ${COMPANY.email} adresine yazabilirsiniz.`,
      }),
    });
  } catch {
    // E-posta ikincil — asıl ödeme onayı/aktivasyon bundan etkilenmemeli.
  }
}

// Ödeme alınamadığı için kapatılmış vitrinleri (deactivated_for_billing_at dolu)
// TEK TEK, en eskiden başlayarak geri açar. Kapasite dolunca (enforce_vitrin_cap
// trigger'ı istisna fırlatır) durur — eski toplu UPDATE tek bir vitrin bile
// kapasiteyi aşınca hepsini birden düşürüyordu. Kullanıcının kendi kapattığı
// vitrinlere (bu sütun boş) dokunulmaz.
async function reactivateBilledVitrins(admin, profileId) {
  const { data: rows } = await admin
    .from("services")
    .select("id")
    .eq("provider_id", profileId)
    .not("deactivated_for_billing_at", "is", null)
    .order("created_at", { ascending: true });
  for (const row of rows || []) {
    const { error } = await admin
      .from("services")
      .update({ active: true, deactivated_for_billing_at: null })
      .eq("id", row.id);
    if (error) {
      console.error("[paytr-callback] Vitrin geri açılamadı (kapasite dolmuş olabilir):", error.message);
      break;
    }
  }
}

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

  // Canlı modda (PAYTR_TEST_MODE=0) test ödemesi (test_mode=1) ürün vermemeli:
  // test kartıyla gelen sahte "success" bildirimi bedava abonelik demek olurdu.
  const isTestPayment = String(form.get("test_mode") || "") === "1";
  if (isTestPayment && process.env.PAYTR_TEST_MODE === "0") {
    await admin.from("payment_orders").update({ status: "failed", failed_reason: "test ödemesi (canlı modda geçersiz)" }).eq("merchant_oid", merchantOid).eq("status", "pending");
    return new Response("OK");
  }

  const { data: order } = await admin
    .from("payment_orders")
    .select("id, profile_id, plan_slug, order_type, billing_cycle, status, service_id, amount")
    .eq("merchant_oid", merchantOid)
    .maybeSingle();

  if (!order) {
    // Bilmediğimiz bir sipariş — yine de PayTR'a tekrar denemesin diye "OK"
    // döndürmüyoruz, ama bu ileride debug için loglanabilir.
    return new Response("PAYTR notification failed: unknown order", { status: 404 });
  }

  // "failed" bir sipariş, sonradan gelen "success" bildirimiyle yine de işlenir:
  // kayıtlı kart tahsilatında ağ zaman aşımı gibi belirsiz durumlar yüzünden bir
  // sipariş yanlışlıkla failed görünmüş olabilir ama para gerçekten çekilmiştir —
  // müşteri ödeyip ürünsüz kalmasın. "success" bir sipariş asla tekrar işlenmez.
  const canProcess = order.status === "pending" || (order.status === "failed" && status === "success");
  if (!canProcess) {
    // Zaten işlenmiş (PayTR'ın tekrar gönderdiği bir bildirim) — sorun yok,
    // sadece onayla.
    return new Response("OK");
  }

  if (status === "success") {
    // Atomik sahiplenme: PayTR aynı bildirimi eşzamanlı iki kez gönderirse
    // sadece biri bu güncellemeden satır alır (paid_at claim damgası); diğeri
    // "OK" dönüp çıkar — çift makbuz/çift bildirim/çift aktivasyon olmaz.
    // İşleyen istek çökerse 2 dk sonra yeniden sahiplenilebilir.
    const claimCutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: claimed } = await admin
      .from("payment_orders")
      .update({ paid_at: new Date().toISOString() })
      .eq("id", order.id)
      .in("status", ["pending", "failed"])
      .or(`paid_at.is.null,paid_at.lt.${claimCutoff}`)
      .select("id");
    if (!claimed || claimed.length === 0) {
      return new Response("OK");
    }

    // GERÇEK HATA (2026-09-14, canlıda ilk gerçek boost ödemesinden sonra
    // bulundu) — provider_addons/provider_subscriptions insert/update'lerinin
    // dönen hatası hiç kontrol edilmiyordu. Yudum Bulut gerçek parayla
    // Haftalık Öne Çıkarma aldı, ödeme başarılı oldu, ama insert eski bir
    // unique kısıtlamaya (bkz. fix_addon_unique_constraint_leftover.sql)
    // çarpıp sessizce başarısız oldu — müşteri parayı ödedi, ürünü hiç
    // almadı, kimse fark etmedi. Artık her yazmanın hatası `grantError`'da
    // toplanıyor; bir hata varsa ödeme yine "success" kalıyor (para gerçekten
    // alındı, PayTR'a tekrar denetmemesi gerekiyor) ama payment_orders.
    // grant_error'a açıkça yazılıyor ki admin panelinden/veritabanından
    // görülüp elle düzeltilebilsin.
    let grantError = null;
    // GERÇEK HATA (2026-09-13, canlıya geçtikten sonra fark edildi): addon'lar
    // için süre burada billing_cycle'a göre hesaplanıyordu ("yearly" değilse
    // hep 30 gün) — ama addon'ların hiç yearly/monthly seçimi yok, bazıları
    // (Haftalık Öne Çıkarma, "one-cikarma-haftalik") 7 GÜNLÜK. billing_cycle
    // bu ayrımı hiç taşımıyordu, yani haftalık paket parası ödenmiş biri
    // yanlışlıkla 30 gün alacaktı. Süre artık order_type'a göre doğru
    // hesaplanıyor: plan için billing_cycle (yearly/monthly), addon için
    // slug'ın kendisi ("haftalik" içeriyorsa 7 gün, değilse 30).
    const periodDays =
      order.order_type === "addon"
        ? (order.plan_slug?.includes("haftalik") ? 7 : 30)
        : (order.billing_cycle === "yearly" ? 365 : 30);
    const DAY_MS = 24 * 60 * 60 * 1000;
    const nowMs = Date.now();
    // Dönem başlangıcı: aynı ürünün hâlâ geçerli (ya da en fazla 3 gün önce
    // bitmiş, yani gecikmiş yenileme) bir dönemi varsa yeni süre onun BİTİŞİNE
    // eklenir — yoksa "dönemin 20 günü kalmışken yenileyen" kullanıcı o günleri
    // kaybediyordu. Farklı plana geçişte / deneme ya da süresi çoktan bitmiş
    // dönemde sıfırdan (şimdiden) başlar.
    const extendFrom = (existingEnd) => {
      const endMs = existingEnd ? new Date(existingEnd).getTime() : 0;
      return endMs > nowMs - 3 * DAY_MS ? Math.max(endMs, nowMs) : nowMs;
    };
    let periodEnd = new Date(nowMs + periodDays * DAY_MS);

    // Gerçek tahsilat tutarı beklenenden düşükse (PayTR panelinde yanlış tutar,
    // kampanya vb.) tam dönem/ürün vermiyoruz — para alındı, sipariş "success"
    // kalıyor ama grant_error'a yazılıp admin panelinde uyarı olarak görünüyor.
    const expectedKurus = Math.round(Number(order.amount) * 100);
    const paidKurus = Number(totalAmount);
    const shortfall = Number.isFinite(paidKurus) && paidKurus < expectedKurus;
    if (shortfall) {
      grantError = `tutar uyuşmazlığı: beklenen ${expectedKurus} kuruş, tahsil edilen ${paidKurus} kuruş`;
    }

    if (shortfall) {
      // ürün verilmiyor, aşağıda grant_error ile kaydedilecek
    } else if (order.order_type === "addon") {
      const { data: addon } = await admin
        .from("addon_products")
        .select("id")
        .eq("slug", order.plan_slug)
        .maybeSingle();

      if (addon) {
        // Öne Çıkarma Paketi artık vitrine özel (order.service_id) — aynı
        // sağlayıcı farklı vitrinlerini ayrı ayrı öne çıkarabildiği için
        // eşleşme sadece profile_id+addon_id değil, service_id'yi de
        // içermeli (bkz. boost_per_vitrin.sql). Ek Vitrin Paketi gibi
        // vitrine bağlı olmayan addon'larda service_id null kalıyor, eski
        // davranış aynen korunuyor.
        let existingQuery = admin
          .from("provider_addons")
          .select("id, current_period_end, status")
          .eq("profile_id", order.profile_id)
          .eq("addon_id", addon.id);
        existingQuery = order.service_id
          ? existingQuery.eq("service_id", order.service_id)
          : existingQuery.is("service_id", null);
        const { data: existingAddon } = await existingQuery.maybeSingle();

        if (existingAddon) {
          if (existingAddon.status === "active") periodEnd = new Date(extendFrom(existingAddon.current_period_end) + periodDays * DAY_MS);
          const { error } = await admin.from("provider_addons").update({
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
          }).eq("id", existingAddon.id);
          if (error) grantError = `provider_addons update: ${error.message}`;
        } else {
          const { error } = await admin.from("provider_addons").insert({
            profile_id: order.profile_id,
            addon_id: addon.id,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
            service_id: order.service_id || null,
          });
          if (error) grantError = `provider_addons insert: ${error.message}`;
        }
      } else {
        grantError = `addon_products bulunamadı: slug=${order.plan_slug}`;
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
          .select("id, plan_id, status, current_period_end, boost_anchor_at")
          .eq("profile_id", order.profile_id)
          .maybeSingle();

        // Süre uzatma sadece AYNI plan + ücretli (active) dönem için; farklı plana
        // geçişte ya da denemeden ücretliye geçişte sıfırdan başlar.
        if (existing && existing.plan_id === plan.id && existing.status === "active") {
          periodEnd = new Date(extendFrom(existing.current_period_end) + periodDays * DAY_MS);
        }

        // Pro'nun "ilk 7 gün açtığın her vitrin Öne Çıkarma hediyeli" hakkı
        // — eski upgrade_to_pro RPC'sinde vardı (pro_boost_until = +7 gün),
        // bugün gerçek ödemeye taşırken burada unutulmuştu (fark edildi ve
        // düzeltildi, 2026-09-13). Sadece Pro planı için, orijinal RPC'yle
        // birebir aynı davranış.
        const proBoostUntil = order.plan_slug === "pro" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null;

        if (existing) {
          const { error } = await admin.from("provider_subscriptions").update({
            plan_id: plan.id,
            status: "active",
            billing_cycle: order.billing_cycle,
            cancel_at_period_end: false, // yeniden ödeme yaptıysa iptal talebi geçersiz
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
            ...(proBoostUntil ? { pro_boost_until: proBoostUntil } : {}),
            // "Her ayın ilk haftası öne çıkarma" hediyesi boost_anchor_at'a bağlı
            // (bkz. pro_boost_monthly_fix.sql). Ödemeyle Pro alan kullanıcıda bu
            // hiç set edilmiyordu, hediye hiç verilmiyordu. Zaten varsa korunur.
            ...(order.plan_slug === "pro" && !existing.boost_anchor_at ? { boost_anchor_at: new Date().toISOString() } : {}),
          }).eq("id", existing.id);
          if (error) grantError = `provider_subscriptions update: ${error.message}`;
        } else {
          const { error } = await admin.from("provider_subscriptions").insert({
            profile_id: order.profile_id,
            plan_id: plan.id,
            status: "active",
            billing_cycle: order.billing_cycle,
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
            ...(proBoostUntil ? { pro_boost_until: proBoostUntil } : {}),
            ...(order.plan_slug === "pro" ? { boost_anchor_at: new Date().toISOString() } : {}),
          });
          if (error) grantError = `provider_subscriptions insert: ${error.message}`;
        }
        // Dunning geri açma (2026-09-19, bkz. supabase/dunning_vitrin_lapse.sql)
        // — bu abonelik daha önce ödeme alınamadığı için lapse olup cron
        // tarafından kapatılmış vitrinler bırakmış olabilir
        // (services.deactivated_for_billing_at dolu). Gerçek bir ödeme
        // şimdi geldiğine göre (buradayız, status==="success") bunları
        // otomatik geri açıyoruz. SADECE bu işaretli satırlara dokunuyoruz
        // — kullanıcının kendi iradesiyle pasife aldığı vitrinler (bu sütun
        // hiç dolmamış) asla etkilenmiyor. NOT: enforce_vitrin_cap trigger'ı
        // active=false→true geçişinde kapasiteyi tekrar kontrol ediyor;
        // yukarıdaki provider_subscriptions güncellemesi zaten bu satırdan
        // ÖNCE yapıldığı için (doğru current_period_end/plan ile) kapasite
        // kontrolü güncel veriyle çalışıyor. Tek bilinen kenar durum: kullanıcı
        // lapse SIRASINDA daha düşük bir plana geçtiyse (ör. Pro→Standart) ve
        // kapasitenin üstünde kapatılmış vitrini varsa bu tek UPDATE
        // istisna fırlatıp hiç geri açmayabilir — bu nadir senaryoda elle
        // müdahale (Vitrinlerim'den birini pasife alıp diğerini elle
        // aktifleştirme) gerekir.
        if (!grantError) await reactivateBilledVitrins(admin, order.profile_id);
      } else {
        grantError = `subscription_plans bulunamadı: slug=${order.plan_slug}`;
      }
    }

    if (grantError) {
      // Sunucu loglarında da görünsün (Vercel) — DB'deki grant_error asıl
      // kalıcı kayıt, bu sadece anlık/gerçek-zamanlı görünürlük içindir.
      console.error("[paytr-callback] Ürün/abonelik aktivasyonu başarısız:", grantError, "merchant_oid:", merchantOid);
    }
    // amount = GERÇEK tahsil edilen tutar (kuruş/100) — yönetim panelindeki gelir
    // beklenen değil gerçek tahsilattan hesaplanır. Yazım hatası yutulmuyor:
    // düşerse sipariş pending kalır ve PayTR'ın tekrar denemesi işlemi baştan alır.
    const realAmount = Number.isFinite(paidKurus) ? paidKurus / 100 : Number(order.amount);
    const { error: finalizeError } = await admin
      .from("payment_orders")
      .update({ status: "success", paid_at: new Date().toISOString(), grant_error: grantError, amount: realAmount })
      .eq("id", order.id);
    if (finalizeError) {
      console.error("[paytr-callback] Sipariş kapatılamadı:", finalizeError.message, "merchant_oid:", merchantOid);
      return new Response("PAYTR notification failed: finalize", { status: 500 });
    }
    await saveCardIfPresent(admin, form, order.profile_id);
    await sendReceiptEmail(admin, order, totalAmount);
  } else {
    await admin.from("payment_orders").update({ status: "failed", failed_reason: failedReasonMsg }).eq("id", order.id).eq("status", "pending");
  }

  return new Response("OK");
}
