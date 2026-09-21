"use client";
// Şifre sıfırlama e-postasındaki linke tıklayınca buraya düşülüyor —
// Supabase, URL'deki recovery token'ını otomatik işleyip geçici bir oturum
// açıyor (supabase-js'in kendi detectSessionInUrl davranışı, ekstra kod
// gerektirmiyor) ve "PASSWORD_RECOVERY" event'ini tetikliyor. Biz sadece bu
// event'i (ya da zaten var olan oturumu) bekleyip yeni şifre formunu
// gösteriyoruz (bkz. AuthView.jsx'teki "Şifremi Unuttum" akışının diğer
// yarısı, 2026-09-14 — gerçek bir kullanıcı şikayetiyle fark edilen eksik).
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && mounted) setReady(true);
    });
    // Event listener bağlanmadan önce token zaten işlenmiş olabilir —
    // o yüzden mevcut oturumu da ayrıca kontrol ediyoruz.
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        if (data.session) setReady(true);
        setChecking(false);
      }
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalı."); return; }
    if (password !== confirm) { setError("Şifreler eşleşmiyor."); return; }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setDone(true);
  };

  const shellStyle = { minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", padding: 24 };

  if (checking) {
    return <div style={shellStyle} />;
  }

  if (done) {
    return (
      <div style={shellStyle}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
          <h1 style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 22, color: "#0F1115", margin: "0 0 10px" }}>Şifren güncellendi</h1>
          <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 22px" }}>Artık yeni şifrenle giriş yapabilirsin.</p>
          <a href="/" style={{ display: "inline-block", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 999, textDecoration: "none" }}>
            İşinn'e dön
          </a>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={shellStyle}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
          <h1 style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 22, color: "#0F1115", margin: "0 0 10px" }}>Bağlantı geçersiz</h1>
          <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 22px" }}>
            Bu bağlantı süresi dolmuş ya da daha önce kullanılmış olabilir. Girişten "Şifremi unuttum" diyerek yeni bir bağlantı isteyebilirsin.
          </p>
          <a href="/" style={{ display: "inline-block", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 999, textDecoration: "none" }}>
            İşinn'e dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 360, width: "100%" }}>
        <h1 style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 26, color: "#0F1115", margin: "0 0 4px" }}>
          İşinn<span style={{ color: "#2563EB" }}>.</span>
        </h1>
        <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 22px" }}>Yeni bir şifre belirle</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Yeni şifre (en az 6 karakter)"
          required
          minLength={6}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#0F1115", fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }}
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Yeni şifre (tekrar)"
          required
          minLength={6}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#0F1115", fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" }}
        />
        {error && (
          <p style={{ fontSize: 12, marginBottom: 16, padding: "8px 12px", borderRadius: 8, background: "#FEF2F2", color: "#9C4A3C" }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "12px 0", borderRadius: 999, border: "none", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
}
