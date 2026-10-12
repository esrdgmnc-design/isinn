// aiFetch: iOS kabuğunda onay yoksa sorar, vazgeçilirse ağ isteği atmaz; web'de davranış değişmez.
import assert from "node:assert/strict";

const store = {};
globalThis.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
let calls = 0;
globalThis.fetch = async () => { calls++; return { ok: true }; };
const setUA = (ua) => { Object.defineProperty(globalThis, "navigator", { value: { userAgent: ua }, configurable: true, writable: true }); };

const { aiFetch, registerAiConsentPrompt, hasAiConsent } = await import("../lib/aiConsent.js");

// Web (normal tarayıcı): sormadan geçer
setUA("Mozilla/5.0 Safari");
await aiFetch("/api/claude", {});
assert.equal(calls, 1, "web: istek atılmalı");

// iOS kabuğu, pencere bağlı değil: güvenli taraf, reddedilir
setUA("Mozilla/5.0 IsinnApp-iOS");
await assert.rejects(() => aiFetch("/api/claude", {}), /ai_consent_declined/);
assert.equal(calls, 1);

// iOS kabuğu, arka plan çağrısı: sormaz, vazgeçer
let asked = 0;
registerAiConsentPrompt((done) => { asked++; done(false); });
await assert.rejects(() => aiFetch("/api/claude", {}, { silent: true }), /ai_consent_declined/);
assert.equal(asked, 0, "silent: pencere açılmamalı");

// iOS kabuğu, kullanıcı vazgeçer
await assert.rejects(() => aiFetch("/api/talent", {}), /ai_consent_declined/);
assert.equal(asked, 1);
assert.equal(calls, 1);
assert.equal(hasAiConsent(), false);

// iOS kabuğu, kullanıcı onaylar: istek gider, onay saklanır, bir daha sorulmaz
registerAiConsentPrompt((done) => { asked++; done(true); });
await aiFetch("/api/talent", {});
assert.equal(calls, 2);
assert.equal(hasAiConsent(), true);
await aiFetch("/api/claude", {});
assert.equal(asked, 2, "onaydan sonra tekrar sorulmamalı");
assert.equal(calls, 3);
// onaydan sonra arka plan çağrıları da çalışır
await aiFetch("/api/job-match", {}, { silent: true });
assert.equal(calls, 4);

console.log("ai onay testleri geçti");
