import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://www.isinn.com.tr"),
  title: "İşinn — Güvenilir Usta, Temizlikçi, Özel Ders Bul",
  description: "Temizlikçiden özel ders öğretmenine, ustadan danışmana — ihtiyacın olan yerel ya da uzaktan hizmeti İşinn'de bul, sıfır komisyonla kendi hizmetini sun.",
  // Mobil uygulama çalışmasının (bkz. docs/mobile-app.md) yan ürünü — site
  // artık gerçek bir PWA da (telefon tarayıcısından "Ana ekrana ekle").
  // Asıl mağaza dağıtımı Capacitor/Codemagic üzerinden, bu sadece bonus.
  manifest: "/manifest.webmanifest",
  verification: {
    google: "BjUpLpu5lRotGu1NKjfHrxpymXlrntgrWW_CdlTx0pk",
    // Bing Webmaster Tools doğrulaması (2026-09-17).
    other: {
      "msvalidate.01": "F04FEEAE89AC31F5BAA4440ACBAEB3C4",
    },
  },
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

// Ana sayfa için FAQPage yapılandırılmış verisi — Google'da zengin sonuç
// (SSS açılır kutusu) ihtimalini ve AI arama motorlarının (ChatGPT/Gemini/
// Perplexity) İşinn'i doğru tanıyıp alıntılama ihtimalini artırır. Bu dosya
// sunucu bileşeni olduğu için ilk HTML'de doğrudan yer alır, client-side
// render'ı beklemez.

// Marka/kuruluş yapılandırılmış verisi — Google'ın "İşinn" marka aramalarında
// bir Knowledge Panel oluşturma ihtimalini artırır, sosyal hesaplar
// (sameAs) eklendiğinde bunları da aynı varlığa bağlar. TikTok/Instagram
// hesapları açıldığında buradaki sameAs dizisine eklenmeli.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "İşinn",
  url: "https://www.isinn.com.tr",
  logo: "https://www.isinn.com.tr/icons/icon-512.webp",
  description: "İşinn, hizmet almak isteyenlerle hizmet vermek isteyenleri buluşturan, fayda ve güven odaklı bir platformdur. Sıfır komisyon ile çalışır.",
  parentOrganization: {
    "@type": "Organization",
    name: "CODE G LTD (Code G Teknoloji ve Ticaret Limited Şirketi)",
  },
  sameAs: [
    "https://www.tiktok.com/@isinn.com.tr",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
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
