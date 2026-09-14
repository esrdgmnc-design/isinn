import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://www.isinn.com.tr"),
  title: "İşinn — Güvendiğin Ellere",
  description: "Yerinde ve uzaktan hizmet pazaryeri",
  // Mobil uygulama çalışmasının (bkz. docs/mobile-app.md) yan ürünü — site
  // artık gerçek bir PWA da (telefon tarayıcısından "Ana ekrana ekle").
  // Asıl mağaza dağıtımı Capacitor/Codemagic üzerinden, bu sadece bonus.
  manifest: "/manifest.webmanifest",
  // Bu alanlar olmadan link WhatsApp/Instagram/X'te paylaşıldığında çıplak
  // bir metin linki görünüyordu — og:image app/opengraph-image.js'ten
  // (özel dosya kuralı) otomatik bağlanıyor, burada ayrıca belirtmeye
  // gerek yok.
  openGraph: {
    title: "İşinn — Güvendiğin Ellere",
    description: "İhtiyacın olan hizmeti bulduğun ya da kendi hizmetini sunduğun güvenilir yerel pazar yeri. Sıfır komisyon.",
    url: "https://www.isinn.com.tr",
    siteName: "İşinn",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "İşinn — Güvendiğin Ellere",
    description: "İhtiyacın olan hizmeti bulduğun ya da kendi hizmetini sunduğun güvenilir yerel pazar yeri.",
  },
};

export const viewport = {
  themeColor: "#16321F",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
        {/* Ziyaretçi/sayfa görüntüleme sayısı hiç tutulmuyordu ("kaç kişi
            tıklamış siteyi" — cevap yoktu). Vercel Web Analytics çerezsiz
            çalışır (gizlilik politikasındaki "takip çerezi kullanmıyoruz"
            beyanını bozmaz) — Google Analytics kasıtlı olarak tercih
            edilmedi, bkz. bu tercihin gerekçesi konuşma geçmişinde. */}
        <Analytics />
      </body>
    </html>
  );
}
