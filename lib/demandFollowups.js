// Talep takibi (2026-10-26): gelen talep kaybolmasın diye günlük cron'un saf mantığı (bkz. app/api/cron/demand-followups).
// Veri analizi: kurucu dışı görüşmelerin yarısı hiç yanıtlanmamıştı, ilan açılınca hiçbir vitrin sahibine bildirim gitmemişti.
//   1) Yeni ilan → aynı kategorideki uygun vitrin sahiplerine e-posta (+ uygulama içi new_job_match).
//   2) Müşterinin ilk mesajı ~1 gündür yanıtsız → vitrin sahibine tek hatırlatma.
//   3) ~3 gündür yanıtsız → müşteriye aynı kategoriden en fazla 3 benzer vitrin.
// Burada ağ/veritabanı yok; route veriyi çeker, kararı bu fonksiyonlar verir.

export const REMINDER_AFTER_H = 20; // cron günde bir kez çalışır: ~1 gün
export const SIMILAR_AFTER_H = 68; // ~3 gün
export const MAX_CONV_AGE_D = 14; // daha eski görüşmeleri artık kurcalama
export const JOB_WINDOW_D = 3; // yalnızca son 3 günde açılmış ilanlar duyurulur
export const MAX_JOB_RECIPIENTS = 30;
export const SITE = "https://www.isinn.com.tr";

const H = 36e5;
const trLower = (s) => String(s || "").toLocaleLowerCase("tr").trim();
export const isDemoService = (s) => String(s?.description || "").trim().startsWith("DEMO VİTRİN");

// "Sarıyer, İstanbul" → "istanbul" (SQL tetikleyicisiyle aynı kural: virgülden sonraki son parça).
export function jobCityKey(city) {
  const parts = String(city || "").split(",");
  return trLower(parts[parts.length - 1]);
}

// İlanı görmesi gereken vitrin sahipleri: aynı kategori, aktif, demo değil, ilan sahibi değil;
// ilan ya da vitrin uzaktansa konum aranmaz, değilse vitrin şehri ilanın ilini içermeli.
export function matchProvidersForJob(job, services, limit = MAX_JOB_RECIPIENTS) {
  if (!job || job.service_id || job.active === false) return [];
  const city = jobCityKey(job.city);
  const seen = new Set();
  const out = [];
  for (const s of services || []) {
    if (!s.active || isDemoService(s) || s.category_id !== job.category_id || s.provider_id === job.client_id) continue;
    const ok = job.is_remote || s.is_remote || (city && trLower(s.city).includes(city));
    if (!ok || seen.has(s.provider_id)) continue;
    seen.add(s.provider_id);
    out.push({ providerId: s.provider_id, service: s });
    if (out.length >= limit) break;
  }
  return out;
}

// Vitrinden açılan görüşmeleri mesajlardan kurar: müşterinin ilk mesajı ve sağlayıcının ondan sonraki ilk yanıtı.
export function buildConversations(jobs, messages) {
  const byJob = new Map();
  for (const j of jobs || []) {
    if (!j.service_id) continue;
    byJob.set(j.id, { job: j, providerId: j.services?.provider_id || null, firstClientAt: null, firstClientBody: "", replyAt: null });
  }
  const sorted = [...(messages || [])].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  for (const m of sorted) {
    const c = byJob.get(m.job_id);
    if (!c) continue;
    if (m.sender_id === c.job.client_id && !c.firstClientAt) { c.firstClientAt = m.created_at; c.firstClientBody = m.body || ""; }
    else if (c.providerId && m.sender_id === c.providerId && c.firstClientAt && !c.replyAt) c.replyAt = m.created_at;
  }
  return [...byJob.values()].filter((c) => c.firstClientAt && c.providerId && c.providerId !== c.job.client_id);
}

// Hangi görüşmeye ne gidecek. `sent` = zaten gönderilmişlerin anahtarları ("reminder:<jobId>", "similar:<jobId>").
// skipClientIds: kurucunun kendi tanıtım mesajları gibi müşteri olmayan yazışmalar.
export function pickNudges(conversations, now, sent = new Set(), skipClientIds = new Set()) {
  const reminders = [];
  const similar = [];
  for (const c of conversations || []) {
    if (c.replyAt || skipClientIds.has(c.job.client_id)) continue;
    const ageH = (now - new Date(c.firstClientAt).getTime()) / H;
    if (ageH > MAX_CONV_AGE_D * 24) continue;
    // ~3 günü geçtiyse artık yalnızca müşteri tarafı (geç bir hatırlatma sağlayıcıya gönderilmez).
    if (ageH >= SIMILAR_AFTER_H) { if (!sent.has(`similar:${c.job.id}`)) similar.push(c); }
    else if (ageH >= REMINDER_AFTER_H && !sent.has(`reminder:${c.job.id}`)) reminders.push(c);
  }
  return { reminders, similar };
}

// Müşteriye önerilecek benzer vitrinler: aynı kategori, aktif, demo değil, beklenen kişi ve müşterinin kendisi değil.
// Son 14 günde etkinliği olan (yanıt verme ihtimali yüksek) sahipler önce; sahip başına tek vitrin.
export function pickSimilarServices(conv, services, lastActiveAt = {}, now = Date.now(), limit = 3) {
  const target = (services || []).find((s) => s.id === conv.job.service_id);
  const categoryId = target?.category_id;
  if (!categoryId) return [];
  const recent = (p) => lastActiveAt[p] && now - new Date(lastActiveAt[p]).getTime() <= 14 * 24 * H;
  const pool = (services || []).filter((s) => s.active && !isDemoService(s) && s.category_id === categoryId
    && s.provider_id !== conv.providerId && s.provider_id !== conv.job.client_id);
  pool.sort((a, b) => Number(!!recent(b.provider_id)) - Number(!!recent(a.provider_id)));
  const seen = new Set();
  const out = [];
  for (const s of pool) {
    if (seen.has(s.provider_id)) continue;
    seen.add(s.provider_id);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}

const clip = (s, n) => { const t = String(s || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1) + "…" : t; };
const firstName = (s) => clip(s, 40) || "Merhaba";
const where = (s) => (s.is_remote ? "Uzaktan" : clip(s.city, 40) || "");

export function jobMatchEmail({ providerName, job, categoryName }) {
  const loc = job.is_remote ? "Uzaktan" : clip(job.city, 60) || "Konum belirtilmemiş";
  return {
    subject: `Alanında yeni bir ilan: ${clip(job.title, 70)} — İşinn`,
    body:
      `Merhaba ${firstName(providerName)},\n\n` +
      `${categoryName ? `${categoryName} alanında` : "Alanında"} yeni bir hizmet talebi açıldı:\n\n` +
      `${clip(job.title, 120)}\n${loc}\n${clip(job.description, 300)}\n\n` +
      `İlgileniyorsan ilanı aç ve doğrudan mesaj gönder:\n${SITE}/?ilan=${job.id}\n\n` +
      `Bu e-postayı, vitrinin bu ilanın kategorisinde olduğu için aldın.\n\n— İşinn`,
  };
}

export function reminderEmail({ providerName, clientName, serviceTitle, firstMessage }) {
  return {
    subject: `${clip(clientName, 40) || "Bir müşteri"} yanıtını bekliyor — İşinn`,
    body:
      `Merhaba ${firstName(providerName)},\n\n` +
      `${clip(clientName, 40) || "Bir kullanıcı"}, "${clip(serviceTitle, 80)}" vitrinin için sana yazdı ve henüz yanıt alamadı:\n\n` +
      `"${clip(firstMessage, 300)}"\n\n` +
      `Uygun değilsen kısa bir "şu an müsait değilim" yanıtı da yeterli; müşteri böylece beklemeden başka seçeneklere bakabilir.\n\n` +
      `Yanıtlamak için: ${SITE}/?view=messages\n\n— İşinn`,
  };
}

export function similarEmail({ clientName, serviceTitle, days, suggestions }) {
  const lines = suggestions.map((s) => `• ${clip(s.title, 70)} — ${clip(s.display_name, 40) || "İşinn vitrini"}${where(s) ? `, ${where(s)}` : ""}\n  ${SITE}/vitrin/${s.id}`).join("\n");
  return {
    subject: `"${clip(serviceTitle, 50)}" için henüz yanıt gelmedi — benzer vitrinler`,
    body:
      `Merhaba ${firstName(clientName)},\n\n` +
      `${days} gün önce "${clip(serviceTitle, 80)}" vitrinine yazdın, henüz yanıt gelmedi. ` +
      `Beklemek istemezsen aynı alandaki şu vitrinlere de bakabilirsin:\n\n${lines}\n\n` +
      `Mesajın yerinde duruyor; yanıt gelirse İşinn sana haber verecek.\n\n— İşinn`,
  };
}
