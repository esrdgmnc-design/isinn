// Sağlayıcı reklamı iniş sayfası içeriği. Meslek gruplarına göre başlık/görsel dil
// değişir, teklif aynı kalır. Rakip adı ASLA geçmez (ücretli reklamda karşılaştırmalı
// reklam/kötüleme riski organik paylaşımdan daha yüksek — bkz. TTK m.55).
export const PROVIDER_AUDIENCES = {
  temizlik: {
    title: "Temizlikçiler için",
    headline: "Teklif başına ücret ödemeden müşteri bul",
    sub: "İşinn'de vitrinini aç, müşteriyle doğrudan konuş, kazandığının tamamı sende kalsın.",
  },
  nakliye: {
    title: "Nakliyeciler için",
    headline: "Her iş için ayrı ücret ödemeden ilan al",
    sub: "İşinn'de vitrinini aç, müşteriyle doğrudan konuş, kazandığının tamamı sende kalsın.",
  },
  nailart: {
    title: "Nail art ustaları için",
    headline: "Portfolyonu göster, müşteri sana ulaşsın",
    sub: "İşinn'de vitrinini aç, çalışmalarını sergile, kazandığının tamamı sende kalsın.",
  },
  default: {
    title: "Hizmet sağlayıcılar için",
    headline: "Komisyon yok, teklif başına ücret yok",
    sub: "İşinn'de vitrinini aç, müşteriyle doğrudan konuş, kazandığının tamamı sende kalsın.",
  },
};

export function getProviderAudience(slug) {
  return PROVIDER_AUDIENCES[slug] || PROVIDER_AUDIENCES.default;
}

export const PROVIDER_FAQ = [
  { q: "Vitrin açmak şu an ücretli mi?", a: "Hayır. 20 Aralık 2026'ya kadar herkese tamamen ücretsiz — kart bilgisi de istemiyoruz." },
  { q: "Ücretsiz dönem bitince ne olacak?", a: "O tarihe yaklaşırken önceden haber vereceğiz. Şu an hiçbir yükümlülük altına girmiyorsun." },
  { q: "Komisyon var mı?", a: "Hayır, hiçbir zaman olmadı. Ödemeyi doğrudan müşteriden alırsın, İşinn araya girmez." },
  { q: "Kaç dakikada vitrin açılır?", a: "Kayıt olup telefonunu doğruladıktan sonra birkaç dakikada, tek ekranda." },
  { q: "Sadece vitrinimi mi bekliyorum, yoksa iş de arayabilir miyim?", a: "İkisi birden. Vitrinine müşteri mesaj atabilir; ayrıca müşterilerin verdiği açık iş ilanlarına da göz atıp kendin teklif verebilirsin." },
];
