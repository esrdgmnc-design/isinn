"use client";
import { Component } from "react";

// Ekstra bir güvenlik ağı — bugün fark edilen "AI ile yazınca geri yapınca
// siteden komple atıyor" şikayetinin asıl kök nedenini (tarayıcı geçmişine
// hiç kayıt eklenmemesi) ayrıca düzelttik, ama beklenmeyen BAŞKA bir hata
// olursa (yakalanmamış bir render hatası) React'in varsayılan davranışı
// tüm uygulamayı çökertip beyaz/boş bir ekran bırakmak — kullanıcıya
// "siteden atıldım" hissi veren tam da bu. Bu bileşen olmadan hiçbir
// error boundary yoktu. Artık tek bir ekrandaki beklenmeyen bir hata,
// kullanıcıya "bir şeyler ters gitti, devam et" diyen dostane bir ekran
// gösteriyor — tüm site çökmüyor.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Prod'da bir hata izleme servisi yok — en azından konsola düşsün,
    // gelecekte gerçek bir izleme eklenirse buraya bağlanır.
    console.error("İşinn — beklenmeyen bir hata yakalandı:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "#FFFFFF" }}>
          <div className="max-w-sm text-center">
            <p className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>Bir şeyler ters gitti</p>
            <p className="text-sm mb-6" style={{ color: "#5C5744" }}>
              Beklenmeyen bir hata oluştu. Endişelenme, verilerin güvende — ana sayfaya dönüp tekrar deneyebilirsin.
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-white"
              style={{ background: "#2563EB" }}
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
