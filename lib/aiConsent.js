// iOS kabuğunda (App Store 5.1.2(i)) yapay zekâ sağlayıcısına içerik göndermeden önce açık onay.
// Yalnızca iOS uygulamasında çalışır; web'de davranış değişmez. Onay cihazda saklanır.
import { isStoreApp } from "./nativeApp.js";

const KEY = "isinn_ai_consent_v1";
let prompt = null;
let pending = null;

export function hasAiConsent() {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}

// AiConsentModal bileşeni bağlanınca kendini kaydeder: prompt(done) -> done(true|false)
export function registerAiConsentPrompt(fn) {
  prompt = fn;
  return () => { if (prompt === fn) prompt = null; };
}

function ask() {
  if (pending) return pending;
  if (!prompt) return Promise.resolve(false);
  const p = new Promise((resolve) => {
    prompt((accepted) => {
      if (accepted) { try { localStorage.setItem(KEY, "1"); } catch {} }
      resolve(!!accepted);
    });
  });
  pending = p;
  p.finally(() => { if (pending === p) pending = null; });
  return p;
}

// fetch gibi çalışır; iOS kabuğunda onay yoksa önce sorar. silent: arka plan çağrıları için, sormaz, sessizce vazgeçer.
export async function aiFetch(input, init, { silent = false } = {}) {
  if (isStoreApp() && !hasAiConsent()) {
    const ok = silent ? false : await ask();
    if (!ok) throw new Error("ai_consent_declined");
  }
  return fetch(input, init);
}
