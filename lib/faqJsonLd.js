// Ana sayfaya özel SSS şeması (eskiden layout'ta her sayfaya basılıyordu; vitrin, kategori ve
// rehber sayfalarında içerikle eşleşmiyordu).
export const faqJsonLd = {
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
