// Mağaza uygulamalarında (Capacitor kabuğu) "Google ile devam et" — 2026-11-23.
// Google, OAuth'u gömülü WebView içinde engeller (disallowed_useragent). Bu yüzden giriş sayfası
// sistem tarayıcısında açılır (iOS: SFSafariViewController, Android: Chrome Custom Tabs; @capacitor/browser)
// ve Supabase, işlem bitince com.isinn.app://auth-callback?code=... adresine yönlendirir. Uygulama bu adresi
// yakalar (appUrlOpen), tarayıcıyı kapatır ve kodu oturuma çevirir (PKCE).
//
// Neden ayrı bir istemci: ana istemci (lib/supabaseClient.js) web'deki e-posta onayı / şifre sıfırlama
// bağlantıları başka cihazda açılabildiği için "implicit" akışta kalmalı. PKCE yalnızca burada, kendi
// depolama anahtarıyla kullanılır; ortaya çıkan oturum ana istemciye setSession ile aktarılır.
// Bu istemci jeton yenilemez (autoRefreshToken: false) — yenilerse ana istemcinin jetonunu geçersiz kılar.
//
// Eski mağaza sürümlerinde Browser eklentisi ve com.isinn.app şeması yok; o sürümlerde düğme gizli kalır
// (isNativeGoogleAvailable false döner). Site uzaktan yüklendiği için bu kontrol şarttır.
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { isStoreApp } from "./nativeApp";

export const NATIVE_OAUTH_REDIRECT = "com.isinn.app://auth-callback";
const PKCE_STORAGE_KEY = "sb-isinn-native-oauth";

let pkceClient = null;
function getPkceClient() {
  if (!pkceClient) {
    pkceClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        flowType: "pkce",
        storageKey: PKCE_STORAGE_KEY,
        persistSession: true,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return pkceClient;
}

function clearPkceStorage() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith(PKCE_STORAGE_KEY)).forEach((k) => localStorage.removeItem(k));
  } catch {}
}

// Senkron: yalnızca mağaza kabuğunda ve Browser eklentisi olan (yeni) sürümlerde true.
export function isNativeGoogleAvailable() {
  if (typeof window === "undefined" || !isStoreApp()) return false;
  try {
    return !!window.Capacitor?.isPluginAvailable?.("Browser");
  } catch {
    return false;
  }
}

let activeListeners = [];
async function removeListeners() {
  const ls = activeListeners;
  activeListeners = [];
  for (const l of ls) { try { await l.remove(); } catch {} }
}

// Google girişini sistem tarayıcısında başlatır. Promise, akış bitince (başarı, hata ya da kullanıcı
// tarayıcıyı kapatınca) çözülür: { ok: true } | { ok: false, error?: string, cancelled?: boolean }.
export async function signInWithGoogleNative() {
  const { registerPlugin } = await import("@capacitor/core");
  const Browser = registerPlugin("Browser");
  const App = registerPlugin("App");
  await removeListeners();
  clearPkceStorage();

  const client = getPkceClient();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: NATIVE_OAUTH_REDIRECT, skipBrowserRedirect: true },
  });
  if (error || !data?.url) return { ok: false, error: error?.message || "OAuth URL alınamadı" };

  // skip_http_redirect yalnızca istemcinin kendisinin yönlendirmemesi içindi; tarayıcıda açılan adreste
  // bulunmasın (sunucu bu parametreyle JSON dönebiliyor).
  const authUrl = new URL(data.url);
  authUrl.searchParams.delete("skip_http_redirect");

  return new Promise((resolve) => {
    let done = false;
    let handling = false; // dönüş adresi işleniyor; bu sırada "iptal" sayma
    const finish = async (result) => {
      if (done) return;
      done = true;
      await removeListeners();
      try { await Browser.close(); } catch {}
      resolve(result);
    };

    (async () => {
      activeListeners.push(await App.addListener("appUrlOpen", async (ev) => {
        const raw = ev?.url || "";
        if (!raw.startsWith(NATIVE_OAUTH_REDIRECT)) return;
        handling = true;
        let u;
        try { u = new URL(raw); } catch { return finish({ ok: false, error: "Geçersiz dönüş adresi" }); }
        const hash = new URLSearchParams(u.hash.replace(/^#/, ""));
        const errDesc = u.searchParams.get("error_description") || hash.get("error_description") || u.searchParams.get("error") || hash.get("error");
        const code = u.searchParams.get("code");
        if (errDesc || !code) { clearPkceStorage(); return finish({ ok: false, error: errDesc || "Giriş tamamlanamadı" }); }
        try {
          const { data: ex, error: exErr } = await client.auth.exchangeCodeForSession(code);
          if (exErr || !ex?.session) throw exErr || new Error("Oturum alınamadı");
          const { error: setErr } = await supabase.auth.setSession({
            access_token: ex.session.access_token,
            refresh_token: ex.session.refresh_token,
          });
          clearPkceStorage();
          if (setErr) throw setErr;
          finish({ ok: true });
        } catch (e) {
          clearPkceStorage();
          finish({ ok: false, error: e?.message || "Giriş tamamlanamadı" });
        }
      }));
      // Kullanıcı tarayıcıyı elle kapatırsa. Başarılı dönüşte de tetiklenebilir; kod işlenirken
      // erken "iptal" dememek için kısa bir bekleme.
      activeListeners.push(await Browser.addListener("browserFinished", () => {
        setTimeout(() => { if (!handling) finish({ ok: false, cancelled: true }); }, 1500);
      }));
      await Browser.open({ url: authUrl.toString() });
    })().catch((e) => finish({ ok: false, error: e?.message || "Tarayıcı açılamadı" }));
  });
}
