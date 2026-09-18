"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n/LanguageContext";

// Kayıt sırasında hangi yasal metin sürümüne onay verildiğini işaretlemek
// için — metinler (bkz. legal/ klasörü, /kvkk-aydinlatma-metni vb.) ileride
// güncellenirse bu değer de güncellenmeli, böylece "kim hangi versiyona
// onay verdi" sorusu her zaman cevaplanabilir kalır.
const TERMS_VERSION = "2026-09-07-taslak";

export default function AuthView({ onAuthenticated, onCancel }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupDone, setSignupDone] = useState(false);
  // "Şifremi Unuttum" — gerçek bir kullanıcının şikayetiyle fark edildi
  // (2026-09-14): bu ekranda hiç böyle bir bağlantı yoktu, "link gelmiyor"
  // demişti çünkü aslında tıklayabileceği bir link/form hiç yoktu. Supabase'in
  // resetPasswordForEmail'i + aşağıdaki app/reset-password sayfası ile
  // gerçek bir şifre sıfırlama akışı kuruldu.
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError(t("auth.errorEmailFirst")); return; }
    setError("");
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) { setError(resetError.message); return; }
    // Supabase, e-posta kayıtlı olmasa bile aynı başarı yanıtını döner
    // (kullanıcı numaralandırmasını önlemek için, bilinçli bir davranış) —
    // o yüzden burada da her zaman "gönderildi" diyoruz.
    setResetSent(true);
  };

  // Google ile giriş (2026-09-13) — "kayıt sürtünmesini azaltmak için sosyal
  // giriş ekleyelim" kararı. Kayıt modunda da aynı KVKK/Gizlilik/Kullanım
  // Şartları onayını şart koşuyoruz (buton devre dışı kalıyor) — Google
  // kullanıcı için formu atlatsa da yasal onay atlanmıyor. Supabase kendi
  // OAuth callback'ini yönetiyor; app/page.js'teki onAuthStateChange zaten
  // dönen oturumu yakalıyor, burada ayrıca bir şey yapmaya gerek yok.
  const handleGoogleAuth = async () => {
    if (mode === "signup" && !agreedToTerms) {
      setError(t("auth.errorTerms"));
      return;
    }
    setError("");
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // Başarılıysa Google'a yönlendirir, buraya geri dönmez — loading state'i
    // sıfırlamaya gerek yok, sayfa zaten yeniden yüklenecek.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError(t("auth.errorFullName"));
        setLoading(false);
        return;
      }
      if (!agreedToTerms) {
        setError(t("auth.errorTerms"));
        setLoading(false);
        return;
      }
      const termsAcceptedAt = new Date().toISOString();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        // E-posta onayı beklenen durumlarda (session henüz yok) profiles
        // satırı hemen oluşturulamıyor — bu bilgiyi user_metadata'da
        // taşıyoruz, satır ne zaman oluşursa oluşsun (bkz. IsinnApp.jsx'teki
        // "eksikse tamamlıyoruz" fallback'i) oradan okunup kaydediliyor.
        options: { data: { full_name: fullName.trim(), terms_accepted_at: termsAcceptedAt, terms_version: TERMS_VERSION } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      // Supabase Auth creates the auth.users row; we separately create the
      // matching profiles row (see schema.sql — profiles.id references
      // auth.users.id). If Supabase email confirmation is turned on,
      // data.user exists but data.session is null until they click the
      // confirmation link — in that case we can't write the profile row
      // yet under RLS (auth.uid() isn't set), so we just tell them to
      // confirm their email first and skip the profile insert here.
      if (data.session) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName.trim(),
          terms_accepted_at: termsAcceptedAt,
          terms_version: TERMS_VERSION,
        });
        onAuthenticated(data.session);
      } else {
        setSignupDone(true);
      }
      setLoading(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    onAuthenticated(data.session);
    setLoading(false);
  };

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 relative" style={{ background: "#FFFFFF" }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="absolute top-5 left-5 text-sm font-medium" style={{ color: "#6B7280" }}>
            {t("auth.backToNav")}
          </button>
        )}
        <div className="max-w-sm w-full text-center">
          <h1 className="font-sans text-2xl font-black mb-3" style={{ color: "#0F1115" }}>{t("auth.checkEmailTitle")}</h1>
          <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
            {t("auth.resetSentBody", { email })}
          </p>
          <button
            type="button"
            onClick={() => { setResetSent(false); setMode("login"); }}
            className="text-xs font-medium"
            style={{ color: "#2563EB" }}
          >
            {t("auth.backToLogin")}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 relative" style={{ background: "#FFFFFF" }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="absolute top-5 left-5 text-sm font-medium" style={{ color: "#6B7280" }}>
            {t("auth.backToNav")}
          </button>
        )}
        <form onSubmit={handleForgotPassword} className="max-w-sm w-full">
          <h1 className="font-sans text-3xl font-black mb-1" style={{ color: "#0F1115" }}>
            İşinn<span style={{ color: "#2563EB" }}>.</span>
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>{t("auth.resetHeading")}</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.resetEmailPlaceholder")}
            required
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-4"
            style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#0F1115" }}
          />
          {error && (
            <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: "#FEF2F2", color: "#9C4A3C" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-sm font-bold text-white mb-4"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? t("auth.resetSubmitLoading") : t("auth.resetSubmit")}
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            className="w-full text-xs font-medium text-center"
            style={{ color: "#2563EB" }}
          >
            {t("auth.backToLogin")}
          </button>
        </form>
      </div>
    );
  }

  if (signupDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 relative" style={{ background: "#FFFFFF" }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-5 left-5 text-sm font-medium"
            style={{ color: "#6B7280" }}
          >
            {t("auth.backToNav")}
          </button>
        )}
        <div className="max-w-sm w-full text-center">
          <h1 className="font-sans text-2xl font-black mb-3" style={{ color: "#0F1115" }}>{t("auth.checkEmailTitle")}</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            {t("auth.signupDoneBody", { email })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative" style={{ background: "#FFFFFF" }}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-5 left-5 text-sm font-medium"
          style={{ color: "#6B7280" }}
        >
          {t("auth.backToNav")}
        </button>
      )}
      <form onSubmit={handleSubmit} className="max-w-sm w-full">
        <h1 className="font-sans text-3xl font-black mb-1" style={{ color: "#0F1115" }}>
          İşinn<span style={{ color: "#2563EB" }}>.</span>
        </h1>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
          {mode === "login" ? t("auth.subtitleLogin") : t("auth.subtitleSignup")}
        </p>

        {mode === "signup" && (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("auth.fullNamePlaceholder")}
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-3"
            style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#0F1115" }}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("auth.emailPlaceholder")}
          required
          className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-3"
          style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#0F1115" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.passwordPlaceholder")}
          required
          minLength={6}
          className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-2"
          style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#0F1115" }}
        />
        {mode === "login" && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(""); }}
              className="text-xs font-medium"
              style={{ color: "#2563EB" }}
            >
              {t("auth.forgotPassword")}
            </button>
          </div>
        )}
        {mode === "signup" && <div className="mb-2" />}

        {mode === "signup" && (
          <label className="flex items-start gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 shrink-0"
            />
            <span className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
              {t("auth.termsAgreeLead")}
              <a href="/kvkk-aydinlatma-metni" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB" }}>{t("auth.kvkkLabel")}</a>{t("auth.termsAgreeJoin1")}
              <a href="/gizlilik-politikasi" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB" }}>{t("auth.privacyLabel")}</a>{t("auth.termsAgreeJoin2")}
              <a href="/kullanim-sartlari" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB" }}>{t("auth.termsLabel")}</a>{t("auth.termsAgreeTail")}
            </span>
          </label>
        )}

        {error && (
          <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: "#FEF2F2", color: "#9C4A3C" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || (mode === "signup" && !agreedToTerms)}
          className="w-full py-3 rounded-full text-sm font-bold text-white mb-4"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", opacity: loading || (mode === "signup" && !agreedToTerms) ? 0.6 : 1 }}
        >
          {loading ? t("auth.submitLoading") : mode === "login" ? t("auth.submitLogin") : t("auth.submitSignup")}
        </button>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          className="w-full text-xs font-medium text-center mb-5"
          style={{ color: "#2563EB" }}
        >
          {mode === "login" ? t("auth.switchToSignup") : t("auth.switchToLogin")}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
          <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>{t("auth.or")}</span>
          <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2.5 border"
          style={{ borderColor: "#E5E7EB", color: "#1F2937", opacity: loading ? 0.6 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.68-3.87 2.68-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
          </svg>
          {t("auth.googleContinue")}
        </button>
      </form>
    </div>
  );
}
