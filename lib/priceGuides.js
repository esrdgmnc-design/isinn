// Fiyat rehberleri (2026-11-05): Search Console'da tıklama getiren tek marka dışı sayfa türü bu. Kategori ve vitrin
// sayfalarında ilk sırada gösterilir; alt bilgide de (SeoFooter, ana sayfa) hepsine bağlantı verilir ki Google bunları
// sık taranan sayfalardan bir tık uzakta bulsun. Yeni fiyat rehberi eklenince buraya da eklenmeli.
export const PRICE_GUIDES = [
  { slug: "ozel-ders-ucretleri-2026", label: "Özel ders ücretleri", categories: ["ogretmen", "muzik-egitmeni", "kodlama-egitmeni", "satranc-egitmeni", "dans-egitmeni", "diksiyon-hitabet-egitmeni", "ofis-programlari-egitmeni"] },
  { slug: "ceviri-ucretleri-2026", label: "Çeviri ücretleri", categories: ["ceviri"] },
  { slug: "logo-tasarim-fiyatlari-2026", label: "Logo tasarım fiyatları", categories: ["tasarim"] },
  { slug: "pilates-fiyatlari-istanbul-2026", label: "Pilates fiyatları (İstanbul)", categories: ["yoga-koc", "spor-egitmeni"] },
  { slug: "evden-eve-nakliyat-fiyatlari-2026", label: "Evden eve nakliyat fiyatları", categories: ["nakliye"] },
];


// Ayrı küçük dosya: istemci bileşeni (IsinnApp alt bilgisi) rehber içeriklerini pakete çekmeden kullanabilsin.
