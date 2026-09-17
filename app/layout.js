import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://www.isinn.com.tr"),
  title: "İşinn — Güvenilir Usta, Temizlikçi, Özel Ders Bul | Komisyonsuz Hizmet Pazaryeri",
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
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "İşinn nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "İşinn, Türkiye'de yerel ve uzaktan hizmet sağlayıcılarla (temizlikçi, usta, özel ders öğretmeni, danışman ve daha fazlası) müşterileri buluşturan bir hizmet pazaryeridir.",
      },
    },
    {
      "@type": "Question",
      name: "İşinn'de komisyon var mı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. İşinn sıfır komisyon prensibiyle çalışır — sağlayıcılar aylık/yıllık sabit üyelik ücreti öder, kazandıkları işten platforma ayrıca komisyon vermez.",
      },
    },
    {
      "@type": "Question",
      name: "İşinn'de hizmet almak ücretsiz mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Hizmet arayan kullanıcılar için İşinn'de gezinmek, sağlayıcı profillerini incelemek ve mesajlaşmak tamamen ücretsizdir.",
      },
    },
    {
      "@type": "Question",
      name: "İşinn'de kendi hizmetimi nasıl sunarım?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "\"Hizmet Ekle\" butonuyla birkaç dakikada bir vitrin oluşturup fotoğraf, açıklama ve fiyat bilgisi ekleyerek hizmetini yayına alabilirsin.",
      },
    },
    {
      "@type": "Question",
      name: "İşinn'de sağlayıcılar güvenilir mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sağlayıcılar telefon doğrulaması ve profil bilgileriyle platformda yer alır; geçmiş müşterilerin gerçek değerlendirmelerini görerek karar verebilirsin.",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
