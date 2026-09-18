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

const WARN_DAYS_BEFORE_END = 3;

// Bir sağlayıcının hâlâ AKTİF olan vitrinlerini, ödeme alınamadığı için
// kapatır ve tek seferlik bir "kapatıldı" bildirimi bırakır. `.eq("active",
// true)` filtresi kendi kendine idempotent yapıyor: bir vitrin bir kere
// kapatıldıktan sonra ertesi gün tekrar çalışsa bile artık eşleşmeyecek,
// yani aynı vitrin için ikinci bir bildirim gitmez. deactivated_for_billing_at
// damgası, kullanıcının kendi kapattığı vitrinlerden ayırt etmek için — bkz.
// app/api/paytr-callback/route.js'deki geri açma bloğu.
async function deactivateVitrinsForLapsedSubscription(admin, profileId) {
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
      title: "Vitrinin yayından kaldırıldı",
      body: "Üyeliğinin/deneme sürenin ödemesi alınamadığı için vitrin(ler)in yayından kaldırıldı. Yeniden yayınlamak için hemen ödeme yapabilirsin.",
    });
  }
  return { deactivated: (updated || []).length };
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
  const { data: dueSubs, error } = await admin
    .from("provider_subscriptions")
    .select("id, profile_id, plan_id, billing_cycle, current_period_end, subscription_plans(slug)")
    .eq("status", "active")
    .lte("current_period_end", nowIso);

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  const results = [];
  for (const sub of dueSubs || []) {
    const planSlug = sub.subscription_plans?.slug;
    if (!planSlug) { results.push({ profile_id: sub.profile_id, skipped: "no plan slug" }); continue; }

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
    if (!result.ok) {
      // PayTR isteği açıkça reddetti (ya da istek hiç atılamadı) — gerçek
      // bir lapse, vitrin(ler) kapanıyor.
      const deactivation = await deactivateVitrinsForLapsedSubscription(admin, sub.profile_id);
      results.push({ profile_id: sub.profile_id, planSlug, ...result, ...deactivation });
    } else {
      results.push({ profile_id: sub.profile_id, planSlug, ...result });
    }
  }

  return Response.json({
    ok: true,
    checked: (dueSubs || []).length,
    warned: warnResults,
    trialLapses: trialResults,
    results,
  });
}
