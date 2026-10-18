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
        text: "İşinn, insanların becerilerini fark edip hizmet vitrinine dönüştürmesine yardım eden ve Türkiye'de yerel ya da uzaktan hizmet arayanlarla (temizlikçi, usta, özel ders öğretmeni, danışman ve daha fazlası) buluşturan bir hizmet keşif platformudur. Ürün satışı yapılmaz, ödemeye aracılık edilmez.",
      },
    },
    {
      "@type": "Question",
      name: "İşinn'i kim, neden kurdu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "İşinn, kadın girişimci Esra Güneş tarafından Code G Teknoloji çatısı altında kuruldu. Çıkış noktası; çalışan annelerin, evden gelir elde etmek isteyen kadınların ve okurken çalışmak zorunda olan gençlerin şirket kurmadan ve komisyon ödemeden işlerini gösterebilmesiydi. Bugün yazılımcıdan özel ders öğretmenine, her meslekten insanın işini sergileyebildiği bir platform.",
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
      name: "İşinn'deki “Doğrulandı” rozeti ne anlama geliyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sağlayıcıların telefon numarası SMS ile doğrulanır; \"Doğrulandı\" rozeti yalnızca bunu ifade eder — kimlik, belge ya da hizmet kalitesi garantisi değildir. İşinn ödemeye aracılık etmez, emanet veya geri ödeme garantisi yoktur. Karar vermeden önce profili, vitrini ve değerlendirmeleri incele.",
      },
    },
    {
      "@type": "Question",
      name: "İşinn'de ürün satabilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. İşinn hizmetlerin keşfini kolaylaştıran bir platformdur; ürün satışı yapılmaz ve ürün satışına yönlendirme yapılmaz (mağaza, sepet ya da kargo yoktur). Becerini hizmet olarak sunmak istersen vitrin açabilirsin.",
      },
    },
    {
      "@type": "Question",
      name: "Ne iş yapabileceğimi bilmiyorum, İşinn nasıl yardım eder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yeteneğini Farket aracı, anlattığın becerilerden 1-2 hizmet fikri ve hazır bir vitrin taslağı önerir. Öneriler kesin bir kazanç ya da iş garantisi değil, başlangıç noktasıdır.",
      },
    },
  ],
};
