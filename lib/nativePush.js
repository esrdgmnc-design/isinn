// iOS kabuğunda (Capacitor) push bildirimi ve derin bağlantı. Web'de ve Android'de hiçbir şey yapmaz.
// Kabuk uzak sayfayı (server.url) açtığı için eklentiler @capacitor/core'un registerPlugin'i ile çağrılır.
// İzin, uygulama açılışında DEĞİL, kullanıcı ilk mesajını gönderdikten sonra bağlam içinde istenir (enablePush).
import { supabase } from "./supabaseClient";
import { isIosApp } from "./nativeApp";

const TOKEN_KEY = "isinn_push_token";
const ASKED_KEY = "isinn_push_asked";
let started = false;
let Push = null;

async function loadPlugins() {
  const { Capacitor, registerPlugin } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") return null;
  return { Push: registerPlugin("PushNotifications"), App: registerPlugin("App") };
}

async function authHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : null;
}

async function sendToken(token) {
  const h = await authHeader();
  if (!h) return;
  try {
    await fetch("/api/push/register", { method: "POST", headers: { "Content-Type": "application/json", ...h }, body: JSON.stringify({ token }) });
    try { localStorage.setItem(TOKEN_KEY, token); } catch {}
  } catch {}
}

// Oturum açıkken bir kez çağrılır: dinleyicileri kurar, izin zaten verilmişse cihazı kaydeder.
export async function startNativePush(onTap) {
  if (started || typeof window === "undefined" || !isIosApp() || !window.Capacitor) return;
  try {
    const p = await loadPlugins();
    if (!p) return;
    started = true;
    Push = p.Push;
    await Push.addListener("registration", (t) => { if (t?.value) sendToken(t.value); });
    await Push.addListener("registrationError", () => {});
    await Push.addListener("pushNotificationActionPerformed", (a) => {
      const d = a?.notification?.data || {};
      if (d.type) onTap?.({ type: d.type, related_job_id: d.related_job_id || null, related_service_id: d.related_service_id || null });
    });
    await p.App.addListener("appUrlOpen", (ev) => {
      try {
        const u = new URL(ev.url);
        if (/(^|\.)isinn\.com\.tr$/.test(u.hostname)) window.location.assign(u.pathname + u.search + u.hash);
      } catch {}
    });
    const perm = await Push.checkPermissions();
    if (perm?.receive === "granted") await Push.register(); // jeton değişmiş olabilir
  } catch { /* eklenti yoksa sessizce vazgeç */ }
}

// Kullanıcı bir mesaj gönderdikten sonra bir kez izin ister (reddedilirse iOS tekrar sormaz).
export async function enablePush() {
  if (!started || !Push) return;
  try {
    if (localStorage.getItem(ASKED_KEY)) return;
    const perm = await Push.checkPermissions();
    if (perm?.receive === "prompt") {
      localStorage.setItem(ASKED_KEY, "1");
      const r = await Push.requestPermissions();
      if (r?.receive === "granted") await Push.register();
    } else if (perm?.receive === "granted") {
      await Push.register();
    }
  } catch {}
}

// Çıkış yapılırken: bu cihaza önceki kullanıcının bildirimleri gitmesin.
export async function unregisterPush() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const h = await authHeader();
    if (h) await fetch("/api/push/register", { method: "DELETE", headers: { "Content-Type": "application/json", ...h }, body: JSON.stringify({ token }) });
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}
