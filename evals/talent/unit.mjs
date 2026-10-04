// Saf fonksiyonlar için hızlı birim testleri (ağ yok): node evals/talent/unit.mjs
import assert from "node:assert/strict";
import { talentTextIsSafe, sanitizeTalentDraft, redactTalentPII, parseTalentResponse, allowedTalentCategories, buildTalentFallback, TALENT_BLOCKED_IDS } from "../../lib/talentCore.js";
import { pickTopMatches } from "../../lib/jobMatchCore.js";
import { extractJsonValue } from "../../lib/jsonExtract.js";

const names = ["Sosyal Medya Uzmanı", "Yemek"];
// güvenlik denetimi
assert.equal(talentTextIsSafe("Bu alanda talep çok yüksek", "yemek yapıyorum", names), false);
assert.equal(talentTextIsSafe("Ayda 20000 TL kazanabilirsin", "yemek yapıyorum", names), false);
assert.equal(talentTextIsSafe("10 yıllık uzman", "yemek yapıyorum", names), false);
assert.equal(talentTextIsSafe("üç yıl deneyimli", "yemek yapıyorum", names), false);
assert.equal(talentTextIsSafe("iki yıl boyunca", "yemek yapıyorum", names), false);
assert.equal(talentTextIsSafe("tamamen farklı bir müşteri kapısı açar", "yemek yapıyorum", names, { reason: true }), true);
assert.equal(talentTextIsSafe("Haftada 5 saatle başlayabilirsin", "haftada 5 saat", names), true);
assert.equal(talentTextIsSafe("1 saat", "haftada 10 saat", names), false, "alt dize eşleşmesi olmamalı");
assert.equal(talentTextIsSafe("Sosyal Medya Uzmanı olarak içerik hazırla", "sosyal medya", names), true, "kategori adı serbest");
assert.equal(talentTextIsSafe("Vitrinine örnek fotoğraf ekle", "yemek", names), true);
// gerekçede küçük öneri sayısı serbest, para/süre/müşteri birimli yeni sayı yasak
assert.equal(talentTextIsSafe("1-2 örnek metin ekle", "günde 1 saat", names, { reason: true }), true);
assert.equal(talentTextIsSafe("1-2 örnek metin ekle", "günde 1 saat", names), false, "taslakta sayı yasak");
assert.equal(talentTextIsSafe("Haftada 3 saat ayır", "haftada 5 saat", names, { reason: true }), false);
assert.equal(talentTextIsSafe("Ayda 20 müşteri bulursun", "yemek", names, { reason: true }), false);
assert.equal(talentTextIsSafe("2000 örnek", "yemek", names, { reason: true }), false);
// taslak
assert.equal(sanitizeTalentDraft({ title: "Ev yemekleri", description: "Ev yemeği yapıyorum." }, "ev yemeği yapıyorum", names)?.title, "Ev yemekleri");
assert.equal(sanitizeTalentDraft({ title: "Profesyonel şef", description: "x" }, "yemek", names), null);
assert.equal(sanitizeTalentDraft({ title: "Bir iki üç dört beş altı yedi sekiz dokuz on onbir", description: "x" }, "yemek", names), null);
// PII
const red = redactTalentPII("tel 0532 123 45 67, TC 12345678901, ayse@ornek.com, TR33 0006 1005 1978 6457 8413 26");
assert.ok(!/0532|12345678901|ayse@|TR33/.test(red), red);
// ayrıştırma
const allowed = [{ id: "yemek", name: "Yemek", mode: "local" }, { id: "terzi", name: "Terzi", mode: "local" }];
assert.deepEqual(parseTalentResponse('{"suggestions": []}', { allowed, userText: "x" }), { suggestions: [], empty: true });
assert.deepEqual(parseTalentResponse("bozuk", { allowed, userText: "x" }), { suggestions: [], empty: false });
const ok = parseTalentResponse(JSON.stringify({ suggestions: [
  { categoryId: "avukat", reason: "r", title: "t", description: "d" },
  { categoryId: "yemek", reason: "Fotoğraf ekle", title: "Ev yemekleri", description: "Yemek yapıyorum." },
  { categoryId: "yemek", reason: "tekrar", title: "t", description: "d" },
] }), { allowed, userText: "yemek yapıyorum" });
assert.equal(ok.suggestions.length, 1);
assert.equal(ok.suggestions[0].categoryId, "yemek");
// kategori süzme
const cats = [{ id: "avukat", name: "A", mode: "both" }, { id: "nakliye", name: "N", mode: "local" }, { id: "yazilim", name: "Y", mode: "remote" }, { id: "terzi", name: "T", mode: "local" }];
// çalışma tercihi kodla elemez (evden çalışıp ürün satan biri için yerinde kategoriler de uygun)
assert.deepEqual(allowedTalentCategories(cats, { remoteKey: "home" }).map((c) => c.id), ["nakliye", "yazilim", "terzi"]);
assert.deepEqual(allowedTalentCategories(cats, { remoteKey: "local" }).map((c) => c.id), ["nakliye", "yazilim", "terzi"]);
assert.deepEqual(allowedTalentCategories(cats, { excludeIds: ["terzi"] }).map((c) => c.id), ["nakliye", "yazilim"]);
// yedek öneriler güvenli ve engelli kategori içermiyor
for (const k of ["chipYemek", "chipCocuk", "chipDers", "chipElIsi", "chipTemizlik", "chipOrganize", "chipBilgisayar", "chipFotograf", "chipBahce", "chipHayvan", "chipGuzellik", "chipYazi"]) {
  const fb = buildTalentFallback([k], []);
  assert.ok(fb.length > 0, k);
  for (const s of fb) { assert.ok(!TALENT_BLOCKED_IDS.has(s.categoryId), s.categoryId); assert.equal(talentTextIsSafe(s.reason, "", []), true, s.reason); }
}
// eşleştirme seçimi
const top = pickTopMatches([{ idx: 2, matchScore: 90 }, { idx: 2, matchScore: 99 }, { idx: 9, matchScore: 95 }, { idx: 1, matchScore: "81.4" }, { idx: 3, matchScore: 150 }, { idx: 3, matchScore: 70 }, { idx: "x", matchScore: 60 }], 3, 3);
assert.deepEqual(top, [{ idx: 2, score: 90 }, { idx: 1, score: 81 }, { idx: 3, score: 70 }]);
assert.deepEqual(pickTopMatches("bozuk", 3), []);
// JSON ayıklama: model JSON'dan sonra/önce metin yazsa da çalışmalı
assert.deepEqual(extractJsonValue("```json\n{\"a\": 1}\n```\nNot: yukarıdaki {kısıt} geçerli"), { a: 1 });
assert.deepEqual(extractJsonValue('Cevap: {"s": [{"r": "süslü } parantez içeren dize"}]} bitti'), { s: [{ r: "süslü } parantez içeren dize" }] });
assert.deepEqual(extractJsonValue('[{"idx": 1, "matchScore": 90}] açıklama'), [{ idx: 1, matchScore: 90 }]);
assert.equal(extractJsonValue("hiç json yok"), null);
assert.equal(extractJsonValue('{"a": '), null);
console.log("tüm birim testleri geçti");
