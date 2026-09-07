"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Kayıt sırasında hangi yasal metin sürümüne onay verildiğini işaretlemek
// için — metinler (bkz. legal/ klasörü, /kvkk-aydinlatma-metni vb.) ileride
// güncellenirse bu değer de güncellenmeli, böylece "kim hangi versiyona
// onay verdi" sorusu her zaman cevaplanabilir kalır.
const TERMS_VERSION = "2026-09-07-taslak";

export default function AuthView({ onAuthenticated, onCancel }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Adını yazmalısın.");
        setLoading(false);
        return;
      }
      if (!agreedToTerms) {
        setError("Devam edebilmek için KVKK Aydınlatma Metni, Gizlilik Politikası ve Kullanım Şartları'nı kabul etmelisin.");
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
            ← Gezinmeye devam et
          </button>
        )}
        <div className="max-w-sm w-full text-center">
          <h1 className="font-sans text-2xl font-black mb-3" style={{ color: "#0F1115" }}>E-postanı kontrol et</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            {email} adresine bir onay linki gönderdik. Hesabını etkinleştirmek için linke tıkla, sonra buraya geri dönüp giriş yap.
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
          ← Gezinmeye devam et
        </button>
      )}
      <form onSubmit={handleSubmit} className="max-w-sm w-full">
        <h1 className="font-sans text-3xl font-black mb-1" style={{ color: "#0F1115" }}>
          İşinn<span style={{ color: "#2563EB" }}>.</span>
        </h1>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
          {mode === "login" ? "Hesabına giriş yap" : "Yeni bir hesap oluştur"}
        </p>

        {mode === "signup" && (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adın Soyadın"
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-3"
            style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#0F1115" }}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          required
          className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-3"
          style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#0F1115" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre (en az 6 karakter)"
          required
          minLength={6}
          className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-4"
          style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#0F1115" }}
        />

        {mode === "signup" && (
          <label className="flex items-start gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 shrink-0"
            />
            <span className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
              <a href="/kvkk-aydinlatma-metni" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB" }}>KVKK Aydınlatma Metni</a>,{" "}
              <a href="/gizlilik-politikasi" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB" }}>Gizlilik Politikası</a> ve{" "}
              <a href="/kullanim-sartlari" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB" }}>Kullanım Şartları</a>'nı okudum, kabul ediyorum.
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
          {loading ? "Bekleyin..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          className="w-full text-xs font-medium text-center"
          style={{ color: "#2563EB" }}
        >
          {mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
        </button>
      </form>
    </div>
  );
}
