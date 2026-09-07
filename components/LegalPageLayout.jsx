// Üç yasal sayfa (KVKK Aydınlatma Metni, Gizlilik Politikası, Kullanım
// Şartları) için ortak düzen. Bu sayfalar taslak — köşeli parantez [...]
// içindeki alanlar doldurulup bir avukata kontrol ettirilmeden gerçek
// bir hukuki belge olarak kullanılmamalı (bkz. legal/ klasöründeki notlar).
export default function LegalPageLayout({ title, updatedLabel, children }) {
  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <div className="max-w-2xl mx-auto px-5 py-10">
        <a href="/" className="inline-block text-sm font-medium mb-6" style={{ color: "#6B7280" }}>
          ← İşinn'e dön
        </a>
        <h1 className="font-sans text-2xl font-black mb-1" style={{ color: "#0F1115" }}>{title}</h1>
        {updatedLabel && (
          <p className="text-xs mb-8" style={{ color: "#9CA3AF" }}>{updatedLabel}</p>
        )}
        <div className="legal-content text-sm leading-relaxed" style={{ color: "#374151" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
