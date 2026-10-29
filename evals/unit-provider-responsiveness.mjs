// providerResponsiveness.js: kategori sayfalarında yanıt veren vitrinler önce, grup içinde eski sıra korunur
import assert from "node:assert/strict";
const { responsivenessRank, orderByResponsiveness, RECENT_DAYS } = await import("../lib/providerResponsiveness.js");

const NOW = Date.parse("2026-10-29T12:00:00Z");
const daysAgo = (d) => new Date(NOW - d * 864e5).toISOString();

assert.equal(responsivenessRank(null, NOW), 0);
assert.equal(responsivenessRank(daysAgo(1), NOW), 2);
assert.equal(responsivenessRank(daysAgo(RECENT_DAYS), NOW), 2);
assert.equal(responsivenessRank(daysAgo(RECENT_DAYS + 1), NOW), 1);

const rows = ["a", "b", "c", "d", "e"].map((id, i) => ({ id, provider_id: "p" + i }));
const lastSent = { p1: daysAgo(40), p3: daysAgo(2), p4: daysAgo(5) };
assert.deepEqual(orderByResponsiveness(rows, lastSent, NOW).map((r) => r.id), ["d", "e", "b", "a", "c"]);
// Veri yoksa sıra aynen kalır
assert.deepEqual(orderByResponsiveness(rows, {}, NOW).map((r) => r.id), ["a", "b", "c", "d", "e"]);
assert.deepEqual(orderByResponsiveness(null, lastSent, NOW), []);
// Girdi dizisi değiştirilmez
const copy = rows.map((r) => r.id);
orderByResponsiveness(rows, lastSent, NOW);
assert.deepEqual(rows.map((r) => r.id), copy);
console.log("yanıt veren vitrin sıralaması testleri geçti");
