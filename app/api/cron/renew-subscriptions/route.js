// Otomatik yenileme (2026-09-13) — "PayTR canlıya geçince gerçek bir
// otomatik tekrar tahsilat yok, dönem bitince sessizce 'yenilenmiş' sayılıyor"
// bulgusunun gerçek çözümü. Vercel Cron her gün bir kez bu route'u çağırır
// (bkz. vercel.json → crons), süresi bugün veya daha önce dolan VE kayıtlı
// kartı olan tüm abonelikleri kayıtlı karttan tahsil eder. Kartı olmayan
// (hiç kayıt olmamış, eski) kullanıcılar atlanır — onlar için otomatik
// tahsilat yapılamaz, dönemleri normal şekilde sona erer.
import { createClient } from "@supabase/supabase-js";
import { chargeSavedCard } from "../../../../lib/paytrRecurringCharge";

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
      // Kayıtlı kartı yok — otomatik tahsilat yapılamaz. Dönemi olduğu gibi
      // bırakıyoruz (uygulama zaten "dönem bitmiş ama active" durumunu
      // sync_subscription_period ile ele alıyordu) — burada bilerek ekstra
      // bir şey yapmıyoruz, sessizce atlıyoruz.
      results.push({ profile_id: sub.profile_id, skipped: "no saved card" });
      continue;
    }

    const result = await chargeSavedCard({
      profileId: sub.profile_id,
      orderType: "plan",
      itemSlug: planSlug,
      billingCycle: sub.billing_cycle || "monthly",
    });
    results.push({ profile_id: sub.profile_id, planSlug, ...result });
  }

  return Response.json({ ok: true, checked: (dueSubs || []).length, results });
}
