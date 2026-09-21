// Otomatik yenileme (2026-09-13) — "PayTR canlıya geçince gerçek bir
// otomatik tekrar tahsilat yok, dönem bitince sessizce 'yenilenmiş' sayılıyor"
// bulgusunun gerçek çözümü. Vercel Cron her gün bir kez bu route'u çağırır
// (bkz. vercel.json → crons), süresi bugün veya daha önce dolan VE kayıtlı
// kartı olan tüm abonelikleri kayıtlı karttan tahsil eder. Kartı olmayan
// (hiç kayıt olmamış, eski) kullanıcılar atlanır — onlar için otomatik
// tahsilat yapılamaz, dönemleri normal şekilde sona erer.
//
// Dunning politikası (2026-09-19, bkz. supabase/dunning_vitrin_lapse.sql) —
// aynı günlük çalışmaya iki aşama daha eklendi:
//   1) current_period_end'e WARN_DAYS_BEFORE_END gün kalan (henüz lapse
//      olmamış) abonelik/denemeler için uygulama içi bir uyarı bildirimi.
//   2) Gerçekten lapse olmuş (süresi geçmiş VE kayıtlı kart yok/tahsilat
//      reddedildi, ya da hiç kart gerektirmeyen bir deneme süresi bittiyse)
//      abonelikler için services.active=false + "kapatıldı" bildirimi.
// Bu iki aşama da e-posta/SMS GÖNDERMİYOR — sadece notifications tablosuna
// yazıyor (kullanıcının "sadece uygulama içi" kararı, bkz. notifications_
// center.sql başındaki not).
import { createClient } from "@supabase/supabase-js";
import { chargeSavedCard } from "../../../../lib/paytrRecurringCharge";
import { isFreePeriod } from "../../../../lib/freePeriod";

const WARN_DAYS_BEFORE_END = 3;
// Ödeme dönemi bittikten sonra bu kadar gün geçmesine rağmen hâlâ yenilenememişse
// (geçici/belirsiz hatalar dahil) vitrinler kapatılır — aksi halde kalıcı bir
// hata (yanlış anahtar, geçersiz kart) sonsuza dek ücretsiz abonelik demekti.
const GRACE_DAYS_AFTER_END = 3;

// Vercel varsayılan süre sınırı çok abonelikte yetmeyebilir.
export const maxDuration = 60;

// Bir sağlayıcının hâlâ AKTİF olan vitrinlerini, ödeme alınamadığı için
// kapatır ve tek seferlik bir "kapatıldı" bildirimi bırakır. `.eq("active",
// true)` filtresi kendi kendine idempotent yapıyor: bir vitrin bir kere
// kapatıldıktan sonra ertesi gün tekrar çalışsa bile artık eşleşmeyecek,
// yani aynı vitrin için ikinci bir bildirim gitmez. deactivated_for_billing_at
// damgası, kullanıcının kendi kapattığı vitrinlerden ayırt etmek için — bkz.
// app/api/paytr-callback/route.js'deki geri açma bloğu.
async function deactivateVitrinsForLapsedSubscription(admin, profileId, reason = "unpaid") {
  const { data: updated, error } = await admin
    .from("services")
    .update({ active: false, deactivated_for_billing_at: new Date().toISOString() })
    .eq("provider_id", profileId)
    .eq("active", true)
    .select("id");

  if (error) return { deactivated: 0, error: error.message };
  if ((updated || []).length > 0) {
    await admin.from("notifications").insert({
      profile_id: profileId,
      type: "vitrin_deactivated",
      title: reason === "canceled" ? "Üyeliğin sona erdi" : "Vitrinin yayından kaldırıldı",
      body: reason === "canceled"
        ? "İptal ettiğin üyeliğin ödenmiş dönemi bitti, vitrin(ler)in yayından kaldırıldı. Dilediğin zaman Planlar'dan üyeliğini yeniden başlatabilirsin."
        : "Üyeliğinin/deneme sürenin ödemesi alınamadığı için vitrin(ler)in yayından kaldırıldı. Yeniden yayınlamak için hemen ödeme yapabilirsin.",
    });
  }
  return { deactivated: (updated || []).length };
}

// PostgREST varsayılan olarak tek istekte en fazla 1000 satır döndürür — büyük
// tablolarda sessizce kırpılmasın diye sayfa sayfa çeker.
async function fetchAll(buildQuery) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await buildQuery().range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

// AŞAMA 3 — kapasite taraması. Geçerli (süresi dolmamış) aboneliği olan bir
// sağlayıcının aktif vitrin sayısı hakkını (plan + geçerli Ek Vitrin) aşıyorsa
// fazlasını kapatır. enforce_vitrin_cap trigger'ı yalnızca AÇARKEN kontrol
// ettiği için şu durumlar hiç yakalanmıyordu: Ek Vitrin süresi bitti, Pro'dan
// Standart'a inildi. En yeni vitrinler kapatılır (en eskiler kalır);
// deactivated_for_billing_at damgası sayesinde ödeme gelince geri açılır.
// Geçerli aboneliği OLMAYAN sağlayıcıların tüm vitrinlerini de kapatır.
async function enforceVitrinCapacity(admin, nowIso) {
  const subs = await fetchAll(() =>
    admin
      .from("provider_subscriptions")
      .select("profile_id, current_period_end, subscription_plans(max_active_listings)")
      .in("status", ["active", "trialing"])
      .gt("current_period_end", nowIso)
      .order("profile_id")
  );
  const capByProfile = {};
  for (const sub of subs) {
    const cap = sub.subscription_plans?.max_active_listings ?? 1;
    capByProfile[sub.profile_id] = Math.max(capByProfile[sub.profile_id] || 0, cap);
  }

  const { data: extraAddon } = await admin.from("addon_products").select("id").eq("slug", "ek-vitrin").eq("active", true).maybeSingle();
  const addonProfiles = new Set();
  if (extraAddon) {
    const rows = await fetchAll(() =>
      admin
        .from("provider_addons")
        .select("profile_id")
        .eq("addon_id", extraAddon.id)
        .eq("status", "active")
        .gt("current_period_end", nowIso)
        .order("profile_id")
    );
    rows.forEach((r) => addonProfiles.add(r.profile_id));
  }

  const activeServices = await fetchAll(() =>
    admin.from("services").select("id, provider_id, created_at").eq("active", true).order("id")
  );
  const byProvider = {};
  for (const svc of activeServices) (byProvider[svc.provider_id] = byProvider[svc.provider_id] || []).push(svc);

  const out = [];
  for (const [providerId, list] of Object.entries(byProvider)) {
    // Geçerli (süresi dolmamış aktif/deneme) aboneliği olmayana vitrin hakkı yok:
    // hiç aboneliği olmayanlar dahil tüm aktif vitrinleri kapatılır (ürün kararı).
    const hasSub = capByProfile[providerId] !== undefined;
    const cap = hasSub ? capByProfile[providerId] + (addonProfiles.has(providerId) ? 3 : 0) : 0;
    if (list.length <= cap) continue;
    const excess = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, list.length - cap);
    const { data: closed, error } = await admin
      .from("services")
      .update({ active: false, deactivated_for_billing_at: new Date().toISOString() })
      .in("id", excess.map((e) => e.id))
      .eq("active", true)
      .select("id");
    if (error) { out.push({ profile_id: providerId, error: error.message }); continue; }
    if ((closed || []).length > 0) {
      await admin.from("notifications").insert({
        profile_id: providerId,
        type: "vitrin_deactivated",
        title: hasSub ? "Fazla vitrinin yayından kaldırıldı" : "Vitrinin yayından kaldırıldı",
        body: hasSub
          ? `Mevcut planının vitrin hakkı ${cap}. Hakkını aşan ${closed.length} vitrin yayından kaldırıldı. Daha fazla vitrin için Pro Üyeliğe geçebilirsin.`
          : "Aktif bir üyeliğin olmadığı için vitrin(ler)in yayından kaldırıldı. Planlar sayfasından üyeliğini başlattığında yeniden yayına alınır.",
      });
    }
    out.push({ profile_id: providerId, cap, closed: (closed || []).length });
  }
  return out;
}

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  // Vercel Cron istekleri "Authorization: Bearer <CRON_SECRET>" ile gelir
  // (Vercel'in kendi dokümantasyonundaki standart desen) — bu olmadan
  // herkes bu uç noktayı çağırıp rastgele tahsilat tetikleyebilirdi.
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return Response.json({ ok: false, message: "Sunucu yapılandırması eksik." }, { status: 500 });
  }
  const admin = createClient(supabaseUrl, serviceRoleKey);

  const nowIso = new Date().toISOString();

  // AŞAMA 0 — uyarı: current_period_end'e WARN_DAYS_BEFORE_END gün veya daha
  // az kalmış (ama henüz LAPSE OLMAMIŞ) her abonelik/deneme için tek seferlik
  // bir "yakında bitiyor" bildirimi. status hem 'active' (kayıtlı kart
  // tahsilatı yaklaşıyor) hem 'trialing' (ücretsiz deneme bitiyor) için
  // gönderiliyor — ikisi de aynı sonucu doğurabilir (vitrin kapanması).
  // Dönem başına tek bildirim: aynı current_period_start içinde zaten bir
  // 'subscription_ending_soon' bildirimi varsa tekrar göndermiyoruz (cron
  // her gün çalıştığı için bu kontrol olmadan her gün aynı uyarı giderdi).
  const warnThresholdIso = new Date(Date.now() + WARN_DAYS_BEFORE_END * 24 * 60 * 60 * 1000).toISOString();
  const { data: endingSoonSubs } = await admin
    .from("provider_subscriptions")
    .select("profile_id, status, current_period_start, current_period_end")
    .in("status", ["active", "trialing"])
    .eq("cancel_at_period_end", false) // iptal edenlere "yenilenecek" uyarısı gitmez
    .gt("current_period_end", nowIso)
    .lte("current_period_end", warnThresholdIso);

  const warnResults = [];
  for (const sub of endingSoonSubs || []) {
    const { data: existingWarning } = await admin
      .from("notifications")
      .select("id")
      .eq("profile_id", sub.profile_id)
      .eq("type", "subscription_ending_soon")
      .gte("created_at", sub.current_period_start)
      .limit(1)
      .maybeSingle();
    if (existingWarning) { warnResults.push({ profile_id: sub.profile_id, skipped: "already warned this period" }); continue; }

    const daysLeft = Math.max(0, Math.ceil((new Date(sub.current_period_end) - Date.now()) / (1000 * 60 * 60 * 24)));
    const body = sub.status === "trialing"
      ? `Ücretsiz deneme süren ${daysLeft <= 0 ? "bugün" : `${daysLeft} gün içinde`} doluyor. Vitrin(ler)in yayında kalmaya devam etmesi için Planlar'dan üyeliğini başlat.`
      : `Üyeliğinin ${daysLeft <= 0 ? "bugün" : `${daysLeft} gün içinde`} yenilenmesi gerekiyor. Kayıtlı kartından tahsilat başarısız olursa ya da kartın yoksa vitrin(ler)in yayından kaldırılır.`;
    await admin.from("notifications").insert({
      profile_id: sub.profile_id,
      type: "subscription_ending_soon",
      title: "Üyeliğin/deneme süren yakında bitiyor",
      body,
    });
    warnResults.push({ profile_id: sub.profile_id, warned: true });
  }

  // AŞAMA 1 — ücretsiz deneme lapse: status='trialing' VE current_period_end
  // geçmiş. Deneme hiç kayıtlı kart gerektirmediği için (bkz. pro_plan.sql
  // başındaki not) burada tahsilat denemiyoruz, doğrudan gerçek bir lapse
  // sayıyoruz — kullanıcı Planlar'dan gerçek bir ödeme yapmadıysa deneme
  // bittiğinde vitrin(ler) kapanır.
  const { data: lapsedTrials } = await admin
    .from("provider_subscriptions")
    .select("profile_id")
    .eq("status", "trialing")
    .lte("current_period_end", nowIso);

  const trialResults = [];
  for (const sub of lapsedTrials || []) {
    const result = await deactivateVitrinsForLapsedSubscription(admin, sub.profile_id);
    trialResults.push({ profile_id: sub.profile_id, reason: "trial_ended", ...result });
  }

  // AŞAMA 2 — ücretli abonelik lapse: status='active' VE current_period_end
  // geçmiş. Önce kayıtlı karttan tahsilat deneniyor (mevcut davranış) —
  // kart yoksa ya da PayTR isteği açıkça reddederse ("failed") bunu gerçek
  // bir lapse sayıp vitrin(ler)i kapatıyoruz. NOT: chargeSavedCard "wait_
  // callback" ile ok:true dönebilir (asıl sonuç asenkron, bkz. paytr-
  // callback) — o durumda burada henüz kapatmıyoruz; eğer callback'te de
  // gerçekten başarısız olursa dönem hâlâ geçmiş kalacağı için bir sonraki
  // günkü cron çalışmasında tekrar denenip (kartla) gerçekten reddedilirse
  // o zaman kapanır. En kötü ihtimalle bu bir günlük bir gecikme demek,
  // erken/sahte bir kapatmadan daha güvenli bir taraf tutma.
  // 90 günlük herkese ücretsiz dönemde tahsilat ve ödeme kaynaklı kapatma yok
  // (aboneliklerin bitişi zaten dönem sonuna çekildi). Kapasite taraması ve uyarılar sürer.
  const freePeriod = isFreePeriod();
  const { data: dueSubs, error } = await admin
    .from("provider_subscriptions")
    .select("id, profile_id, plan_id, billing_cycle, current_period_end, cancel_at_period_end, subscription_plans(slug)")
    .eq("status", "active")
    .lte("current_period_end", nowIso);
  if (freePeriod) {
    // hiçbir şey yapma: dueSubs boş sayılır
  }

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  const results = [];
  for (const sub of freePeriod ? [] : dueSubs || []) {
    const planSlug = sub.subscription_plans?.slug;
    if (!planSlug) { results.push({ profile_id: sub.profile_id, skipped: "no plan slug" }); continue; }

    // Kullanıcı üyeliğini iptal etmişse (cancel_at_period_end) ödediği dönem BİTTİ:
    // tahsilat yapılmaz, abonelik 'canceled' olur ve vitrinler kapanır.
    if (sub.cancel_at_period_end) {
      const { error: cancelErr } = await admin
        .from("provider_subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("id", sub.id);
      if (cancelErr) { results.push({ profile_id: sub.profile_id, cancel_error: cancelErr.message }); continue; }
      const deactivation = await deactivateVitrinsForLapsedSubscription(admin, sub.profile_id, "canceled");
      results.push({ profile_id: sub.profile_id, planSlug, canceled: true, ...deactivation });
      continue;
    }

    const { data: method } = await admin.from("payment_methods").select("id").eq("profile_id", sub.profile_id).maybeSingle();
    if (!method) {
      // Kayıtlı kartı yok — otomatik tahsilat yapılamaz. Bu artık gerçek bir
      // lapse: vitrin(ler) kapanıyor (bkz. dosya başındaki dunning notu).
      const deactivation = await deactivateVitrinsForLapsedSubscription(admin, sub.profile_id);
      results.push({ profile_id: sub.profile_id, skipped: "no saved card", ...deactivation });
      continue;
    }

    const result = await chargeSavedCard({
      profileId: sub.profile_id,
      orderType: "plan",
      itemSlug: planSlug,
      billingCycle: sub.billing_cycle || "monthly",
    });
    if (!result.ok && result.declined) {
      // PayTR ödemeyi AÇIKÇA reddetti (kart geçersiz/yetersiz bakiye) — gerçek
      // bir lapse, vitrin(ler) kapanıyor.
      const deactivation = await deactivateVitrinsForLapsedSubscription(admin, sub.profile_id);
      results.push({ profile_id: sub.profile_id, planSlug, ...result, ...deactivation });
    } else if (!result.ok) {
      // Geçici/belirsiz sorun (PayTR/ağ/yapılandırma/DB hatası, ya da zaten
      // işlenmekte olan bir tahsilat): müşterinin hatası DEĞİL — ilk günlerde
      // vitrinlerini kapatmıyoruz, ertesi günkü çalışmada yeniden denenecek.
      // AMA tolerans süresi (GRACE_DAYS_AFTER_END) dolduysa artık kapatılır.
      const overdueMs = Date.now() - new Date(sub.current_period_end).getTime();
      if (overdueMs > GRACE_DAYS_AFTER_END * 24 * 60 * 60 * 1000) {
        const deactivation = await deactivateVitrinsForLapsedSubscription(admin, sub.profile_id);
        results.push({ profile_id: sub.profile_id, planSlug, grace_expired: true, ...result, ...deactivation });
      } else {
        results.push({ profile_id: sub.profile_id, planSlug, retry_later: true, ...result });
      }
    } else {
      results.push({ profile_id: sub.profile_id, planSlug, ...result });
    }
  }

  // AŞAMA 2b — aylık Öne Çıkarma paketinin otomatik yenilemesi (Ek Vitrin artık satılmıyor).
  // Eskiden hiç taranmıyorlardı: 459₺/249₺'lik ürünler dönem sonunda sessizce
  // düşüyor, müşteri her ay elle yeniden almak zorunda kalıyordu (sözleşme
  // "otomatik yenilenir" diyor). Sadece: Ek Vitrin (service_id yok) ve vitrine
  // özel Öne Çıkarma (service_id dolu). service_id'si boş Öne Çıkarma satırı Pro'nun
  // ÜCRETSİZ hediyesi olabilir — asla tahsil edilmez. Haftalık paket yenilenmez.
  // Sadece son 3 gün içinde bitmiş olanlar: aylar önce bitmiş bir ürün için
  // sürpriz tahsilat yapılmaz.
  const addonResults = [];
  try {
    if (freePeriod) throw new Error("free period: addon renewals skipped");
    const graceStartIso = new Date(Date.now() - GRACE_DAYS_AFTER_END * 24 * 60 * 60 * 1000).toISOString();
    const { data: dueAddons } = await admin
      .from("provider_addons")
      .select("id, profile_id, service_id, current_period_start, current_period_end, addon_products!inner(slug)")
      .eq("status", "active")
      .lte("current_period_end", nowIso)
      .gt("current_period_end", graceStartIso)
      .eq("addon_products.slug", "one-cikarma");
    for (const row of dueAddons || []) {
      const slug = row.addon_products?.slug;
      // Pro'nun ücretsiz hediye boost'u da service_id'siz bir "one-cikarma" satırı
      // ama en fazla 7 günlük; ücretli paket 30 gün. Süresi ~30 gün olmayan satır
      // (hediye) asla tahsil edilmez.
      const lengthDays = (new Date(row.current_period_end) - new Date(row.current_period_start)) / 86400000;
      if (lengthDays < 25) { addonResults.push({ id: row.id, skipped: "gift or short boost (not billed)" }); continue; }
      const { data: method } = await admin.from("payment_methods").select("id").eq("profile_id", row.profile_id).maybeSingle();
      if (!method) { addonResults.push({ id: row.id, skipped: "no saved card" }); continue; }
      const r = await chargeSavedCard({
        profileId: row.profile_id,
        orderType: "addon",
        itemSlug: slug,
        billingCycle: "monthly",
        serviceId: row.service_id || null,
      });
      addonResults.push({ id: row.id, slug, ...r });
    }
  } catch (e) {
    addonResults.push({ error: e.message });
  }

  let capacityResults = [];
  try {
    capacityResults = await enforceVitrinCapacity(admin, nowIso);
  } catch (e) {
    capacityResults = [{ error: e.message }];
  }

  return Response.json({
    ok: true,
    capacity: capacityResults,
    addonRenewals: addonResults,
    checked: (dueSubs || []).length,
    warned: warnResults,
    trialLapses: trialResults,
    results,
  });
}
