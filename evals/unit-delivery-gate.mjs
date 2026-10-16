// deliveryGate.js: karşı taraf onayladıysa ve ben yanıt vermediysem onay penceresi çıkar
import assert from "node:assert/strict";
const { pendingConfirmationRole, nextPending } = await import("../lib/deliveryGate.js");

const C = "client-1", P = "provider-1", X = "stranger";
const mk = (o = {}) => ({ id: "j1", state: "delivered", client_id: C, client_delivered_at: null, provider_delivered_at: null, services: { provider_id: P }, ...o });
const T = "2026-10-16T10:00:00Z";

// Hizmeti veren işaretledi, müşteri henüz yanıtlamadı -> müşteri engellenir
assert.equal(pendingConfirmationRole(mk({ provider_delivered_at: T }), C), "client");
// Müşteri onayladı, hizmeti veren yanıtlamadı -> hizmeti veren engellenir
assert.equal(pendingConfirmationRole(mk({ client_delivered_at: T }), P), "provider");
// İşaretleyen kendisi engellenmez
assert.equal(pendingConfirmationRole(mk({ provider_delivered_at: T }), P), null);
assert.equal(pendingConfirmationRole(mk({ client_delivered_at: T }), C), null);
// İki taraf da onayladıysa ya da eski (damgasız) işlerde engel yok
assert.equal(pendingConfirmationRole(mk({ client_delivered_at: T, provider_delivered_at: T }), C), null);
assert.equal(pendingConfirmationRole(mk(), C), null);
assert.equal(pendingConfirmationRole(mk(), P), null);
// Delivered değilse (itirazdan sonra negotiating) engel yok
assert.equal(pendingConfirmationRole(mk({ state: "negotiating", provider_delivered_at: T }), C), null);
// Taraf olmayan, eksik veri
assert.equal(pendingConfirmationRole(mk({ provider_delivered_at: T }), X), null);
assert.equal(pendingConfirmationRole(null, C), null);
assert.equal(pendingConfirmationRole(mk({ provider_delivered_at: T }), ""), null);
assert.equal(pendingConfirmationRole(mk({ provider_delivered_at: T, services: null }), C), "client");
// Kendi vitrinine kendi yazan (iki taraf aynı kişi) engellenmez
assert.equal(pendingConfirmationRole(mk({ client_id: P, provider_delivered_at: T }), P), null);

// nextPending: ilk bekleyeni verir, atlananı geçer
const jobs = [mk({ id: "a" }), mk({ id: "b", provider_delivered_at: T }), mk({ id: "c", provider_delivered_at: T })];
assert.equal(nextPending(jobs, C)?.job.id, "b");
assert.equal(nextPending(jobs, C, ["b"])?.job.id, "c");
assert.equal(nextPending(jobs, C, ["b", "c"]), null);
assert.equal(nextPending([], C), null);
assert.equal(nextPending(undefined, C), null);
console.log("teslim onayı penceresi testleri geçti");
