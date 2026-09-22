// Kategori sayfalarında gösterilen genel, doğru soru-cevap bloğu — hangi kategoride
// olursa olsun gerçekte doğru olan bilgiler (komisyon yok, ödeme platform dışı, mesaj
// ücretsiz). Kategoriye özel abartılı/uydurma istatistik YOK, bilerek. Yalnızca aktif
// vitrini olan (indekslenebilir) sayfalarda gösterilir.
export function getCategoryFaq(categoryName, cityName) {
  // Şehir adına eklenecek çekim eki ("İstanbul'da" / "İzmir'de") şehre göre değiştiği
  // için (ünlü uyumu) ek KULLANMIYORUZ — "X bölgesinde" ifadesi her şehir adıyla
  // dilbilgisi hatasız çalışır.
  const name = categoryName.toLocaleLowerCase("tr-TR");
  const place = cityName ? `${cityName} bölgesinde ` : "";
  return [
    {
      q: `İşinn'de ${place}${name} sağlayıcı bulmak ücretli mi?`,
      a: `Hayır. Vitrinleri incelemek, mesaj göndermek ve teklif almak müşteri için tamamen ücretsizdir.`,
    },
    {
      q: `${place ? place.charAt(0).toLocaleUpperCase("tr-TR") + place.slice(1) : ""}${categoryName} hizmeti için ödeme nasıl yapılır?`,
      a: `Ödemeyi doğrudan sağlayıcıyla, kendi aranızda kararlaştırdığınız şekilde yaparsınız. İşinn hizmet ücretinden komisyon almaz ve ödemeye aracılık etmez.`,
    },
    {
      q: `Doğru ${name} nasıl seçilir?`,
      a: `Vitrindeki portföy, paylaşılan belgeler ve varsa gerçek müşteri yorumlarına bakman ve birkaç sağlayıcıyla mesajlaşıp fiyat/uygunluk karşılaştırman önerilir.`,
    },
  ];
}
