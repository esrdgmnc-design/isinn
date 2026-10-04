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
      name: "Ne iş yapabilirim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gündelik yaptığın şeylerden başlayabilirsin: yemek yapmak, çocuklarla ilgilenmek, düzenli olmak, dikiş-örgü, bilgisayar ya da telefonla uğraşmak gibi. Yeteneğini Farket aracına bunları yazdığında, becerine ve ayırabileceğin zamana uyan 1-2 hizmet fikri (ders, atölye, organizasyon, uzaktan destek gibi) ve her biri için hazır bir vitrin taslağı alırsın. Öneriler garanti değil, başlangıç noktasıdır.",
      },
    },
    {
      "@type": "Question",
      name: "Becerilerimi nasıl değerlendirebilirim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Önce neyi seversin ve neyi zaten yapıyorsun, onu yaz. Sonra haftada kaç saat ayırabileceğini ve evden mi yüz yüze mi çalışmak istediğini belirt. Beceriyi bir hizmete çevirmek için üç soru işe yarar: Bunu kim ister? Nerede ve ne kadar sürede yaparım? İlk örneğimi nasıl gösteririm? Yeteneğini Farket bu soruları senin yerine düzenler ve ilk vitrin başlığını önerir.",
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
      name: "İşinn'de sağlayıcılar nasıl doğrulanıyor?",
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
