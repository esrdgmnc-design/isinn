// Sağlayıcı reklamı iniş sayfası içeriği. Meslek gruplarına göre başlık/görsel dil
// değişir, teklif aynı kalır. Rakip adı ASLA geçmez (ücretli reklamda karşılaştırmalı
// reklam/kötüleme riski organik paylaşımdan daha yüksek — bkz. TTK m.55). Resmi
// (siz) hitap kullanılır.
export const PROVIDER_AUDIENCES = {
  temizlik: {
    title: "Temizlik Hizmeti Sağlayıcıları İçin",
    headline: "Teklif Başına Ücret Ödemeden Müşteriye Ulaşın",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, müşterilerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
  nakliye: {
    title: "Nakliye Hizmeti Sağlayıcıları İçin",
    headline: "Her İş İçin Ayrı Ücret Ödemeden İlanlara Ulaşın",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, müşterilerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
  nailart: {
    title: "Nail Art Uzmanları İçin",
    headline: "Portföyünüzü Sergileyin, Müşteriler Size Ulaşsın",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, çalışmalarınızı sergileyin, kazancınızın tamamı size kalsın.",
  },
  default: {
    title: "Hizmet Sağlayıcıları İçin",
    headline: "Komisyonsuz, Teklif Başına Ücretsiz Bir Platform",
    sub: "İş arıyor ya da hizmet vererek ek gelir kazanmak istiyorsanız: İşinn'de vitrininizi oluşturun, müşterilerle doğrudan iletişime geçin, kazancınızın tamamı size kalsın.",
  },
};

export function getProviderAudience(slug) {
  return PROVIDER_AUDIENCES[slug] || PROVIDER_AUDIENCES.default;
}

export const PROVIDER_FAQ = [
  { q: "Vitrin oluşturmak şu an ücretli mi?", a: "Hayır. İlk 3 ay (20 Aralık 2026'ya kadar) tüm kullanıcılar için ücretsizdir; kart bilgisi talep edilmez." },
  { q: "3 ay sonunda ne olacak?", a: "Süre yaklaştığında önceden bilgilendirme yapılır. Bu aşamada herhangi bir yükümlülük söz konusu değildir, dilediğiniz zaman vazgeçebilirsiniz." },
  { q: "Komisyon uygulanıyor mu?", a: "Hayır. Ödemeyi doğrudan müşteriden alırsınız, İşinn bu sürece dahil olmaz." },
  { q: "Vitrin ne kadar sürede oluşturulur?", a: "Kayıt ve telefon doğrulamasının ardından birkaç dakika içinde, tek ekran üzerinden." },
  { q: "Yalnızca vitrinime gelecek mesajları mı bekliyorum, iş de arayabilir miyim?", a: "İkisi de mümkün. Vitrininize doğrudan mesaj gelebilir; ayrıca müşterilerin paylaştığı açık iş ilanlarına da teklif verebilirsiniz." },
  { q: "Zaten Instagram hesabım var, neden İşinn'e de üye olayım?", a: "Instagram'da takipçileriniz sizi zaten bilir. İşinn'de ise o an tam olarak aradığınız hizmeti kategori ve konuma göre filtreleyerek arayan, sizi henüz hiç tanımayan müşterilere ulaşırsınız — ikisi birbirinin yerine değil, tamamlayıcısıdır." },
];
