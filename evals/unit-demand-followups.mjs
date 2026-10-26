// demandFollowups.js: ilan eşleştirme, yanıtsız görüşme seçimi, benzer vitrin, e-posta metinleri
import assert from "node:assert/strict";
const L = await import("../lib/demandFollowups.js");

const H = 36e5;
const NOW = Date.parse("2026-10-26T07:00:00Z");
const ago = (h) => new Date(NOW - h * H).toISOString();

// --- jobCityKey
assert.equal(L.jobCityKey("Sarıyer, İstanbul"), "istanbul");
assert.equal(L.jobCityKey("Ankara"), "ankara");
assert.equal(L.jobCityKey(null), "");

// --- matchProvidersForJob
const svc = (o) => ({ id: o.id, provider_id: o.p, category_id: o.c ?? "ogr", active: o.active ?? true, is_remote: !!o.remote, city: o.city ?? null, description: o.desc ?? "Gerçek bir açıklama", title: o.t ?? "Vitrin " + o.id, display_name: o.n ?? "Ad" });
const services = [
  svc({ id: "s1", p: "p1", city: "İstanbul" }),
  svc({ id: "s2", p: "p2", city: "Kadıköy, İstanbul" }),
  svc({ id: "s3", p: "p3", city: "Ankara" }),
  svc({ id: "s4", p: "p4", remote: true }),
  svc({ id: "s5", p: "p5", c: "yaz", city: "İstanbul" }), // başka kategori
  svc({ id: "s6", p: "p6", city: "İstanbul", active: false }), // pasif
  svc({ id: "s7", p: "p7", city: "İstanbul", desc: "DEMO VİTRİN — örnek" }), // demo
  svc({ id: "s8", p: "client", city: "İstanbul" }), // ilan sahibinin kendi vitrini
  svc({ id: "s9", p: "p1", city: "İstanbul" }), // aynı sahibin ikinci vitrini
];
const job = { id: "j1", client_id: "client", category_id: "ogr", city: "Sarıyer, İstanbul", is_remote: false, active: true, service_id: null };
assert.deepEqual(L.matchProvidersForJob(job, services).map((m) => m.providerId), ["p1", "p2", "p4"]);
// Uzaktan ilan: şehir aranmaz
assert.deepEqual(L.matchProvidersForJob({ ...job, is_remote: true }, services).map((m) => m.providerId), ["p1", "p2", "p3", "p4"]);
// Görüşme satırı (service_id dolu) ya da pasif ilan duyurulmaz
assert.deepEqual(L.matchProvidersForJob({ ...job, service_id: "s1" }, services), []);
assert.deepEqual(L.matchProvidersForJob({ ...job, active: false }, services), []);
// Sınır
assert.equal(L.matchProvidersForJob({ ...job, is_remote: true }, services, 2).length, 2);

// --- buildConversations + pickNudges
const convJob = (id, client, prov, sid = "s1") => ({ id, client_id: client, service_id: sid, services: { provider_id: prov, title: "Vitrin" } });
const jobs = [convJob("c1", "u1", "p1"), convJob("c2", "u2", "p2"), convJob("c3", "u3", "p3"), convJob("c4", "admin", "p4"), convJob("c5", "u5", "p5"), convJob("c6", "u6", "p6"), { id: "ilan", client_id: "x", service_id: null }];
const messages = [
  { job_id: "c1", sender_id: "u1", body: "Merhaba", created_at: ago(30) }, // 30 sa yanıtsız -> hatırlatma
  { job_id: "c2", sender_id: "u2", body: "Selam", created_at: ago(80) }, // 80 sa yanıtsız -> benzer vitrin
  { job_id: "c3", sender_id: "u3", body: "Soru", created_at: ago(40) },
  { job_id: "c3", sender_id: "p3", body: "Yanıt", created_at: ago(39) }, // yanıtlanmış -> yok
  { job_id: "c4", sender_id: "admin", body: "Tanıtım", created_at: ago(30) }, // kurucu -> atla
  { job_id: "c5", sender_id: "u5", body: "Eski", created_at: ago(20 * 24) }, // 20 gün -> çok eski
  { job_id: "c6", sender_id: "u6", body: "Yeni", created_at: ago(5) }, // 5 sa -> erken
  { job_id: "c1", sender_id: "u1", body: "İkinci mesaj", created_at: ago(29) },
];
const convs = L.buildConversations(jobs, messages);
assert.equal(convs.length, 6); // ilan satırı görüşme değildir
assert.equal(convs.find((c) => c.job.id === "c1").firstClientBody, "Merhaba");
assert.ok(convs.find((c) => c.job.id === "c3").replyAt);
let n = L.pickNudges(convs, NOW, new Set(), new Set(["admin"]));
assert.deepEqual(n.reminders.map((c) => c.job.id), ["c1"]);
assert.deepEqual(n.similar.map((c) => c.job.id), ["c2"]);
// Daha önce gönderilmişse tekrar yok
n = L.pickNudges(convs, NOW, new Set(["reminder:c1", "similar:c2"]), new Set(["admin"]));
assert.equal(n.reminders.length + n.similar.length, 0);
// 3 gün geçmiş ama hatırlatma hiç gitmemişse doğrudan benzer vitrin gider (iki e-posta aynı gün gitmez)
assert.ok(!n.reminders.some((c) => c.job.id === "c2"));

// --- pickSimilarServices: aynı kategori, beklenen kişi/müşteri hariç, son 14 günde aktif olanlar önce, sahip başına tek
const c2 = convs.find((c) => c.job.id === "c2"); // beklenen sağlayıcı p2, vitrin s1 (kategori ogr)
const recentActive = { p4: ago(24), p3: ago(30 * 24) };
const sims = L.pickSimilarServices(c2, services, recentActive, NOW);
assert.equal(sims[0].provider_id, "p4"); // yakın zamanda aktif olan önce
assert.ok(!sims.some((s) => s.provider_id === "p2" || s.provider_id === "u2"));
assert.ok(sims.every((s) => s.category_id === "ogr" && s.active && !L.isDemoService(s)));
assert.equal(new Set(sims.map((s) => s.provider_id)).size, sims.length);
assert.ok(sims.length <= 3);
assert.deepEqual(L.pickSimilarServices({ ...c2, job: { ...c2.job, service_id: "yok" } }, services), []);

// --- E-posta metinleri: bağlantılar doğru, rakam/fiyat yok, uzun metin kırpılır
const m1 = L.jobMatchEmail({ providerName: "Ayşe", job: { ...job, title: "LGS Türkçe", description: "x".repeat(500) }, categoryName: "Öğretmen" });
assert.ok(m1.body.includes(`${L.SITE}/?ilan=j1`));
assert.ok(m1.body.includes("Sarıyer, İstanbul"));
assert.ok(m1.body.length < 900);
const m2 = L.reminderEmail({ providerName: "Ayşe", clientName: "Mehmet", serviceTitle: "İngilizce", firstMessage: "Merhaba" });
assert.ok(m2.subject.startsWith("Mehmet"));
assert.ok(m2.body.includes(`${L.SITE}/?view=messages`));
const m3 = L.similarEmail({ clientName: "Mehmet", serviceTitle: "İngilizce", days: 3, suggestions: sims });
assert.ok(sims.every((s) => m3.body.includes(`${L.SITE}/vitrin/${s.id}`)));
for (const m of [m1, m2, m3]) assert.ok(!/₺|TL\b|ücretsiz|komisyon/i.test(m.body), "e-postada fiyat/ücret dili olmamalı");
console.log("talep takibi testleri geçti");
