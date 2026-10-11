// Kendi olay tablomuz (supabase/audit_fixes_2026_09_22.sql). Huni adımlarını ve kaynağı
// (UTM) ölçmek için. Sessiz ve engellemez: tablo yoksa ya da ağ hatası olursa hiçbir şey
// olmaz, kullanıcı akışı etkilenmez. Kişisel içerik (mesaj metni, ad, e-posta) ASLA gönderilmez.
const SESSION_KEY = "isinn_sid";
const ATTR_KEY = "isinn_attr";
// İç trafik (kurucu, test cihazları, yönetici hesapları) ölçümleri bozmasın diye: bir cihazda "/?internal=1" açılınca bu cihazın
// tüm olaylarına internal:true eklenir ("/?internal=0" ile kalkar). Yönetici hesapla giriş de aynı bayrağı koyar.
// Hiçbir kişisel veri tutulmaz: yalnızca "bu cihaz iç" bilgisi.
const INTERNAL_KEY = "isinn_internal";
export function markInternal(on = true) { if (on) safeSet(INTERNAL_KEY, "1"); else { try { localStorage.removeItem(INTERNAL_KEY); } catch {} } }

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
  const q = new URLSearchParams(window.location.search);
  if (q.get("internal") === "1") markInternal(true);
  else if (q.get("internal") === "0") markInternal(false);
  if (safeGet(ATTR_KEY)) return;
  const attr = {};
  // ref: paylaşım bağlantılarında kısa kaynak etiketi (ör. ref=wa, ref=qr, ref=friend)
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "ref"].forEach((k) => { if (q.get(k)) attr[k === "ref" ? "src" : k] = q.get(k).slice(0, 60); });
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
    // supabase-js ilk pakette değil, ilk olayda yüklenir (reklam iniş sayfaları hafif kalır).
    const extra = safeGet(INTERNAL_KEY) === "1" ? { internal: true } : {};
    const row = { name, profile_id: profileId, session_id: sessionId(), props: { ...attr, ...extra, ...props } };
    import("./supabaseClient")
      .then(({ supabase }) => supabase.from("events").insert(row))
      .then(() => {}, () => {});
  } catch {}
}
