// Ücretsiz hesaplama araçları (2026-11-10). Tek kaynak: araç sayfaları, gömülü sürümler ve diğer sayfalardaki
// "araç kartı" buradan beslenir. Kalıcı Google görünürlüğü için: araç başka sitelere gömüldüğünde altındaki İşinn
// bağlantısı o sitenin HTML'inde kalır (iframe içindeki bağlantı backlink sayılmaz, bu yüzden kod iframe'in dışında
// bir <a> da içerir).
export const TOOLS = [
  {
    id: "ozel-ders",
    path: "/araclar/ozel-ders-ucreti-hesaplama",
    embedPath: "/araclar/ozel-ders-ucreti-hesaplama/gomulu",
    name: "Özel ders ücreti hesaplama",
    teaser: "Ders ve haftalık ders sayısına göre saatlik aralık ve aylık tahmini maliyet.",
    embedHeight: 380,
    // Hangi kategori/rehber/ders sayfalarında kart gösterilir.
    categories: ["ogretmen", "muzik-egitmeni", "kodlama-egitmeni", "satranc-egitmeni", "dans-egitmeni", "diksiyon-hitabet-egitmeni", "ofis-programlari-egitmeni", "egitmen"],
    guides: ["ozel-ders-ucretleri-2026", "muzik-ve-piyano-dersi-ucretleri-2026", "iyi-ozel-ders-ogretmeni-nasil-secilir", "lgs-hazirlik-sureci-nasil-planlanir", "ozel-ders-vermek-icin-ne-gerekir", "evden-ders-ve-atolye-vermek"],
    ders: true,
  },
  {
    id: "smm",
    path: "/araclar/serbest-meslek-makbuzu-hesaplama",
    embedPath: "/araclar/serbest-meslek-makbuzu-hesaplama/gomulu",
    name: "Serbest meslek makbuzu hesaplama",
    teaser: "Brütten nete, netten brüte: %20 stopaj ve %20 KDV ile tahsil edilecek tutar.",
    embedHeight: 460,
    categories: ["danismanlik", "muhasebe", "ceviri", "muhendis", "avukat", "psikolog", "diyetisyen", "yazilim", "tasarim", "icerik-yazarligi", "sosyal-medya", "dijital", "video-duzenleme", "seslendirme", "sanal-asistan", "profesyonel-fotograf"],
    guides: ["mali-musavir-ucretleri-2026", "sirket-kurmadan-hizmet-sunmak", "hizmet-fiyati-nasil-belirlenir-saatlik-sabit-teklif", "freelance-musteri-nasil-bulunur-komisyonsuz-yollar"],
    ders: false,
  },
];

export const BASE_URL = "https://www.isinn.com.tr";

export function toolsForCategory(slug) {
  return TOOLS.filter((t) => t.categories.includes(slug));
}
export function toolsForGuide(slug) {
  return TOOLS.filter((t) => t.guides.includes(slug));
}
export function toolById(id) {
  return TOOLS.find((t) => t.id === id) || null;
}
