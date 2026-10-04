// SEO sayfalarında (kategori, şehir, vitrin) ortak kullanılan fiyat/sağlayıcı adı biçimlendiricileri.

// DEMO vitrinler ve içeriği çok ince (açıklaması 40 karakterden kısa) vitrinler arama
// motoruna "gerçek içerik" olarak sunulmaz: sitemap'e girmez, vitrin sayfaları noindex,
// ve artık kategori/şehir sayfalarının listesi, ItemList şeması ve noindex kararı da
// aynı filtreyle verilir (sadece demo içeren bir sayfa indekslenebiliyordu).
export function isIndexableListing(row) {
  const d = (row?.description || "").trim();
  return !d.startsWith("DEMO VİTRİN") && d.length >= 40;
}
// Çok az gerçek vitrini olan kategori+şehir ve şehir sayfaları "ince içerik" sayılmasın
// diye bu eşiğin altında noindex olur; vitrin sayısı arttıkça otomatik indekslenir.
export const MIN_CITY_LISTINGS = 2;
export const MIN_COMBO_LISTINGS = 2;
export function formatPrice(price, priceType) {
  if (price == null) return priceType === "hourly" ? "Fiyat belirtilmemiş/saat" : "Fiyat belirtilmemiş";
  const formatted = Number(price).toLocaleString("tr-TR");
  if (priceType === "hourly") return `${formatted}₺/saat`;
  if (priceType === "quote") return "Teklif alın";
  return `${formatted}₺'den`;
}

export function getProviderName(row) {
  return (row.display_name && row.display_name.trim()) || (row.profiles?.business_name && row.profiles.business_name.trim()) || row.profiles?.full_name || "Sağlayıcı";
}

// 80+ kategori/şehir sayfası, kategori/şehir adı dışında birebir aynı tanıtım
// cümlesini kullanıyordu — bu, Google'a hafif bir "kalıp/thin content" sinyali
// verebilir. Kategori adına göre sabit (deterministik, build'ler arası
// tutarlı) bir varyant seçerek cümle YAPISINI da çeşitlendiriyoruz, anlamı
// değiştirmeden.
function pickVariant(seed, variants) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return variants[hash % variants.length];
}

export function getCategoryIntro(categoryName, seedKey) {
  const lower = categoryName.toLocaleLowerCase("tr-TR");
  const variants = [
    `Türkiye genelinde ${lower} sağlayıcılarını keşfet, doğrudan ulaş — komisyonsuz.`,
    `İhtiyacın olan ${lower} hizmetini İşinn'de bul, sağlayıcıyla doğrudan mesajlaş — aracı komisyonu yok.`,
    `${categoryName} arayışın için İşinn'deki gerçek vitrinlere göz at, uygun sağlayıcıya doğrudan ulaş.`,
    `Vitrinlerdeki portföyleri incele, sana en uygun ${lower} sağlayıcısıyla doğrudan iletişime geç — komisyonsuz.`,
  ];
  return pickVariant(seedKey || categoryName, variants);
}

export function getCategoryCityIntro(categoryName, cityName, seedKey) {
  const lower = categoryName.toLocaleLowerCase("tr-TR");
  const variants = [
    `${cityName} bölgesinde ${lower} sağlayıcılarını keşfet, doğrudan ulaş — komisyonsuz.`,
    `${cityName} bölgesindeki ${lower} vitrinlerine göz at, sana uygun sağlayıcıyla doğrudan mesajlaş.`,
    `İşinn'de ${cityName} bölgesinden gerçek ${lower} sağlayıcılarını incele, komisyon ödemeden doğrudan anlaş.`,
  ];
  return pickVariant(seedKey || `${categoryName}-${cityName}`, variants);
}

export function getCityIntro(cityName) {
  const variants = [
    `${cityName} bölgesindeki hizmet sağlayıcılarını keşfet, doğrudan ulaş — komisyonsuz.`,
    `${cityName} bölgesindeki gerçek vitrinlere göz at, ihtiyacına uygun sağlayıcıyla doğrudan mesajlaş.`,
    `İşinn'de ${cityName} bölgesindeki sağlayıcıları incele, aracı komisyonu ödemeden doğrudan anlaş.`,
  ];
  return pickVariant(cityName, variants);
}
