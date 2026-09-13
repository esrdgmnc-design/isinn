// PayTR ödeme başarısız/iptal olunca kullanıcının geri yönlendiği sayfa
// (merchant_fail_url). Gerçek durum güncellemesi yine paytr-callback
// route'unda oluyor — bu sadece bilgilendirme ekranı.
export default function OdemeBasarisizPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#16321F", padding: 24 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 30px 70px -30px rgba(0,0,0,.4)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
        <h1 style={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: 22, color: "#0F1115", margin: "0 0 8px" }}>Ödeme tamamlanamadı</h1>
        <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
          Kartından herhangi bir tutar çekilmedi. Tekrar denemek istersen profilinden yeniden başlayabilirsin.
        </p>
        <a href="/" style={{ display: "inline-block", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 999, textDecoration: "none" }}>
          İşinn'e dön
        </a>
      </div>
    </div>
  );
}
