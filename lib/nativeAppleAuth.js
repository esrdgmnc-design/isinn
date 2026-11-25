// iOS uygulamasında "Apple ile devam et" — 2026-11-25.
// Apple, başka bir sosyal giriş (Google) sunan iOS uygulamalarından Apple ile girişi de ister (App Store 4.8).
// Giriş yerel Apple penceresiyle yapılır (uygulamanın kendi eklentisi: ios/App/App/AppDelegate.swift,
// IsinnAppleSignInPlugin, JS adı "AppleSignIn"). Dönen kimlik jetonu Supabase'e signInWithIdToken ile verilir;
// bu yol Supabase'te gizli anahtar istemez, yalnızca Apple sağlayıcısında Client ID = com.isinn.app.
//
// Eski sürümlerde eklenti yok; düğme gizli kalır (isNativeAppleAvailable false). Site uzaktan yüklendiği için şart.
import { supabase } from "./supabaseClient";
import { isIosApp } from "./nativeApp";

export function isNativeAppleAvailable() {
  if (typeof window === "undefined" || !isIosApp()) return false;
  try {
    return !!window.Capacitor?.isPluginAvailable?.("AppleSignIn");
  } catch {
    return false;
  }
}

function randomNonce(len = 32) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Apple adı yalnızca ilk girişte verir. Profil satırı IsinnApp.jsx'teki yedek akışla e-posta önekiyle
// oluşabilir; ad geldiyse onu yazarız (yalnızca ad henüz yedek değerdeyse — kullanıcının değiştirdiği ada dokunmayız).
async function saveAppleName(user, fullName) {
  if (!fullName) return;
  try { await supabase.auth.updateUser({ data: { full_name: fullName } }); } catch {}
  const fallbacks = new Set(["Kullanıcı", "", user?.email ? user.email.split("@")[0] : null].filter((v) => v !== null));
  for (let i = 0; i < 6; i++) {
    const { data: row } = await supabase.from("profiles").select("id, full_name").eq("id", user.id).maybeSingle();
    if (row) {
      if (!row.full_name || fallbacks.has(row.full_name)) {
        await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
      }
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

// { ok: true } | { ok: false, error?: string, cancelled?: boolean }
export async function signInWithAppleNative() {
  try {
    const { registerPlugin } = await import("@capacitor/core");
    const AppleSignIn = registerPlugin("AppleSignIn");
    const rawNonce = randomNonce();
    const hashedNonce = await sha256Hex(rawNonce);

    let res;
    try {
      res = await AppleSignIn.authorize({ nonce: hashedNonce });
    } catch (e) {
      if (e?.code === "CANCELLED" || /cancel/i.test(e?.message || "")) return { ok: false, cancelled: true };
      return { ok: false, error: e?.message || "Apple ile giriş tamamlanamadı" };
    }
    if (!res?.identityToken) return { ok: false, error: "Apple kimlik bilgisi alınamadı" };

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: res.identityToken,
      nonce: rawNonce,
    });
    if (error || !data?.session) return { ok: false, error: error?.message || "Oturum açılamadı" };

    const fullName = [res.givenName, res.familyName].filter(Boolean).join(" ").trim();
    saveAppleName(data.user, fullName);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message || "Apple ile giriş tamamlanamadı" };
  }
}
