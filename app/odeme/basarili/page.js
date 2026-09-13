// PayTR ödeme sonrası kullanıcının GERİ YÖNLENDİĞİ sayfa (merchant_ok_url).
// DİKKAT: bu sayfa aboneliği AKTİF ETMİYOR — o iş tamamen paytr-callback
// route'unda, PayTR'ın sunucudan sunucuya attığı bildirimle oluyor (bkz. o
// dosyadaki not). Bu sayfa sadece kullanıcıya "ödemen alındı" diyen, hiçbir
// işlem yapmayan bir teşekkür ekranı — güvenlik açısından burada "başarılı"
// yazması hiçbir şeyi aktive etmiyor, sadece kullanıcı deneyimi.
export default function OdemeBasariliPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#16321F", padding: 24 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 30px 70px -30px rgba(0,0,0,.4)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 style={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: 22, color: "#0F1115", margin: "0 0 8px" }}>Ödemen alındı</h1>
        <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
          Aboneliğin birkaç saniye içinde otomatik olarak aktifleşecek. Görünmüyorsa profil sayfanı yenilemen yeterli.
        </p>
        <a href="/" style={{ display: "inline-block", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 999, textDecoration: "none" }}>
          İşinn'e dön
        </a>
      </div>
    </div>
  );
}
