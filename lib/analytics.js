// Kendi olay tablomuz (supabase/audit_fixes_2026_09_22.sql). Huni adımlarını ve kaynağı
// (UTM) ölçmek için. Sessiz ve engellemez: tablo yoksa ya da ağ hatası olursa hiçbir şey
// olmaz, kullanıcı akışı etkilenmez. Kişisel içerik (mesaj metni, ad, e-posta) ASLA gönderilmez.
import { supabase } from "./supabaseClient";

const SESSION_KEY = "isinn_sid";
const ATTR_KEY = "isinn_attr";

function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch {} }

function sessionId() {
  let id = safeGet(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
    safeSet(SESSION_KEY, id);
  }
  return id;
}

// İlk ziyarette utm_* ve referrer'ı kaydeder (sonraki ziyaretler ilk kaynağı ezmez).
export function captureAttribution() {
  if (typeof window === "undefined") return;
  if (safeGet(ATTR_KEY)) return;
  const q = new URLSearchParams(window.location.search);
  const attr = {};
  ["utm_source", "utm_medium", "utm_campaign"].forEach((k) => { if (q.get(k)) attr[k] = q.get(k).slice(0, 60); });
  if (document.referrer) {
    try { attr.ref = new URL(document.referrer).hostname.slice(0, 60); } catch {}
  }
  safeSet(ATTR_KEY, JSON.stringify(attr));
}

export function trackEvent(name, props = {}, profileId = null) {
  if (typeof window === "undefined") return;
  try {
    let attr = {};
    try { attr = JSON.parse(safeGet(ATTR_KEY) || "{}"); } catch {}
    supabase
      .from("events")
      .insert({ name, profile_id: profileId, session_id: sessionId(), props: { ...attr, ...props } })
      .then(() => {}, () => {});
  } catch {}
}
