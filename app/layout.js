import AttributionCapture from "../components/AttributionCapture";
import IosShellMarker from "../components/IosShellMarker";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { COMPANY } from "../lib/companyInfo";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import { jsonLdString } from "../lib/jsonLd";

export const metadata = {
  metadataBase: new URL("https://www.isinn.com.tr"),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  title: "İşinn | Yerel Hizmet Keşif Platformu, Komisyonsuz Vitrin",
  description: "Yakınındaki hizmet verenleri keşfet, becerinden hizmet vitrini aç. İşinn komisyon almaz, ürün satmaz; hizmet verenler için 20 Aralık 2026'ya kadar ücretsiz.",
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
    title: "İşinn — Yeteneğini Farket, Hizmet Vitrinini Aç",
    description: "Becerilerinden hizmet fikirleri ve hazır vitrin taslağı al; yakınındaki hizmetleri bul. Komisyonsuz yerel hizmet platformu.",
    url: "https://www.isinn.com.tr",
    siteName: "İşinn",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "İşinn — Yeteneğini Farket, Hizmet Vitrinini Aç",
    description: "Becerilerinden hizmet fikirleri ve hazır vitrin taslağı al; yakınındaki hizmetleri bul. Komisyonsuz yerel hizmet platformu.",
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
// (sameAs) eklendiğinde bunları da aynı varlığa bağlar. TikTok ve Instagram
// hesapları buradaki sameAs dizisinde; yeni resmî hesap açılırsa buraya eklenmeli.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.isinn.com.tr/#website",
  name: "İşinn",
  alternateName: ["Isinn", "isinn.com.tr"],
  url: "https://www.isinn.com.tr",
  inLanguage: "tr",
  publisher: { "@id": "https://www.isinn.com.tr/#org" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.isinn.com.tr/#org",
  founder: { "@type": "Person", name: "Esra Güneş", sameAs: ["https://www.linkedin.com/in/esra-g-037912138/"] },
  name: "İşinn",
  legalName: COMPANY.legalName,
  alternateName: ["Isinn", "isinn.com.tr"],
  url: "https://www.isinn.com.tr",
  logo: "https://www.isinn.com.tr/icons/icon-512.webp",
  description: "İşinn, becerini fark edip hizmet vitrinine dönüştürmene ve yakınındaki hizmetleri bulmana yardım eden bir hizmet keşif platformudur. Komisyon almaz, ödemeye aracılık etmez, ürün satmaz. İşinn (isinn.com.tr) bir banka, iş ilanı sitesi ya da ürün satış sitesi değildir.",
  // Konum/hizmet alanı bilgisi eskiden hiç yoktu — AI arama motorlarının ve
  // Google'ın İşinn'i "Türkiye'de yerleşik, yerel" bir varlık olarak
  // çözümlemesini (Knowledge Panel'de adres/harita gösterimi dahil)
  // kolaylaştırıyor. Tek kaynak lib/companyInfo.js — burada elle tekrar
  // yazılmıyor.
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.split(",")[0]?.trim(),
    addressLocality: "Şişli",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  areaServed: "TR",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: COMPANY.email,
    telephone: COMPANY.phoneHref,
    areaServed: "TR",
    availableLanguage: ["Turkish"],
  },
  sameAs: [
    "https://www.tiktok.com/@isinn.com.tr",
    "https://www.instagram.com/isinn.com.tr/",
    "https://www.linkedin.com/company/145299576/",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <IosShellMarker />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd) }} />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd) }} />
        {children}
        <ServiceWorkerRegister />
        <AttributionCapture />
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
