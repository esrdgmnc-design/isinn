// Sağlayıcı reklamı iniş sayfası içeriği. Meslek gruplarına göre başlık/görsel dil
// değişir, teklif aynı kalır. Rakip adı ASLA geçmez (ücretli reklamda karşılaştırmalı
// reklam/kötüleme riski organik paylaşımdan daha yüksek — bkz. TTK m.55). Resmi
// (siz) hitap kullanılır.
export const PROVIDER_AUDIENCES = {
  temizlik: {
    title: "Temizlik Hizmeti Verenler İçin",
    headline: "Teklif Başına Ücret Ödemeden Müşteriye Ulaşın",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, müşterilerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
  nakliye: {
    title: "Nakliye Hizmeti Verenler İçin",
    headline: "Her İş İçin Ayrı Ücret Ödemeden İlanlara Ulaşın",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, müşterilerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
  nailart: {
    title: "Nail Art Uzmanları İçin",
    headline: "Yaptığınız İşleri Gösterin, Müşteriler Size Ulaşsın",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, çalışmalarınızı sergileyin, kazancınızın tamamı size kalsın.",
  },
  "oyun-ablasi": {
    title: "Oyun Ablaları ve Ağabeyleri İçin",
    headline: "Çocuklarla Vakit Geçirerek Ek Gelir Kazanın",
    sub: "Boş zamanlarınızda ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, ailelerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
  ogretmen: {
    title: "Özel Ders Vermek İsteyenler İçin",
    headline: "Bildiğiniz Konuda Özel Ders Vererek Gelir Kazanın",
    sub: "Öğrenciyseniz ya da yeni mezunsanız: İşinn'de vitrininizi oluşturun, ihtiyaç sahibi öğrenci ve velilerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
  default: {
    title: "Hizmet Verenler İçin",
    headline: "İşinizi Gösterin, Müşteri Size Doğrudan Ulaşsın",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, müşterilerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
};

export function getProviderAudience(slug) {
  return PROVIDER_AUDIENCES[slug] || PROVIDER_AUDIENCES.default;
}

export const PROVIDER_FAQ = [
  { q: "Vitrin oluşturmak şu an ücretli mi?", a: "Hayır. Lansman sürecindeyiz; 1 Ocak 2027'ye kadar tüm kullanıcılar için ücretsiz, kart bilgisi talep edilmez." },
  { q: "Ücretsiz dönem bitince ne olacak?", a: "Süre yaklaştığında önceden bilgilendirme yapılır. Bu aşamada herhangi bir yükümlülük söz konusu değildir, dilediğiniz zaman vazgeçebilirsiniz." },
  { q: "Komisyon uygulanıyor mu?", a: "Hayır. Ödemeyi doğrudan müşteriden alırsınız, İşinn bu sürece dahil olmaz." },
  { q: "Vitrin ne kadar sürede oluşturulur?", a: "Kayıt olup e-postanızı doğruladıktan sonra birkaç dakikada, tek ekrandan." },
  { q: "Yalnızca vitrinime gelecek mesajları mı bekliyorum, iş de arayabilir miyim?", a: "İkisi de mümkün. Vitrininize doğrudan mesaj gelebilir; ayrıca müşterilerin aradığı işlere de teklif verebilirsiniz." },
  { q: "Neden tercih edeyim, sosyal medyada zaten varım?", a: "Sosyal medya hesabınız sizi zaten bilenlere ulaşır. İşinn'de ise o an tam olarak aradığınız hizmeti kategori ve konuma göre filtreleyerek arayan, sizi henüz hiç tanımayan müşterilere ulaşırsınız — ikisi birbirinin yerine değil, tamamlayıcısıdır." },
];
