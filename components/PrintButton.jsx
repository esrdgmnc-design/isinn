"use client";

// Broşür sayfasındaki "Yazdır / PDF kaydet" düğmesi. Tarayıcının yazdırma penceresi
// "PDF olarak kaydet" seçeneğini de sunar; ayrı PDF kütüphanesine gerek yok.
export default function PrintButton({ children }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm font-bold px-5 py-2.5 rounded-full text-white"
      style={{ background: "#2563EB" }}
    >
      {children}
    </button>
  );
}
