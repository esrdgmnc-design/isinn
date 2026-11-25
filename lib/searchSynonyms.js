// Aramada eş anlamlılar ve sık yazım hataları → kategori.
// 2026-11-17: ChatGPT'den gelen ziyaretçilerin 7 aramasının 5'i sonuçsuz kalmıştı; "Video editör",
// "Ressam" ve "Logo Desing" için uygun vitrin vardı ama düz kelime eşleşmesi bulamıyordu
// (bkz. docs/chatgpt-trafik-analizi-2026-11-17.md). Hem sitedeki arama (components/IsinnApp.jsx)
// hem yapay zekâ aracı (app/api/mcp/route.js) bunu kullanır. Yalnızca var olan kategori slug'ları yazılır.

export function normTr(s) {
  return (s || "")
    .replace(/İ/g, "i").replace(/I/g, "ı")
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const GROUPS = [
  { cats: ["video-duzenleme"], terms: ["editor", "video edit", "kurgu", "montaj", "reels", "youtube video"] },
  { cats: ["resim-sanat-atolyesi"], terms: ["ressam", "tablo", "portre", "yagli boya", "karakalem", "resim"] },
  { cats: ["tasarim"], terms: ["logo", "design", "desing", "dizayn", "grafik", "grafiker", "afis", "kartvizit", "kurumsal kimlik"] },
  { cats: ["muhendis", "ic-mimarlik"], terms: ["autocad", "rhino", "solidworks", "catia", "revit", "sketchup", "3d model", "teknik cizim", "mimar", "gemi insa", "gemi"] },
  { cats: ["yazilim"], terms: ["web sitesi", "web site", "yazilimci", "developer", "programci", "mobil uygulama", "uygulama gelistir"] },
  { cats: ["sosyal-medya", "dijital"], terms: ["instagram", "sosyal medya", "influencer", "reklam yonetimi", "icerik uretimi"] },
  // Ders adları (matematik, ingilizce...) bilerek yok: zaten vitrin metinlerinde geçiyor; eklenirse
  // "matematik özel ders" aramasında İngilizce öğretmenleri de öne çıkardı.
  { cats: ["ogretmen"], terms: ["lgs", "yks", "tyt", "ayt", "kpss", "hoca"] },
  { cats: ["spor-egitmeni"], terms: ["pilates", "fitness", "antrenor", "personal trainer", "kisisel antrenor"] },
  { cats: ["fizyoterapist"], terms: ["fizyoterapi", "bel agrisi", "boyun agrisi", "fizik tedavi"] },
  { cats: ["kurye"], terms: ["kurye", "moto kurye", "teslimat", "paket servis"] },
  { cats: ["nakliye"], terms: ["nakliyat", "tasimacilik", "evden eve", "tasima"] },
  { cats: ["hafriyat"], terms: ["hafriyat", "kazi", "kepce", "temel kazisi", "moloz", "dolgu", "is makinesi"] },
  { cats: ["insaat"], terms: ["insaat", "kaba insaat", "muteahhit", "kalip", "beton", "duvar orme", "insaat ustasi"] },
  { cats: ["muhasebe"], terms: ["muhasebeci", "mali musavir", "vergi beyan"] },
  { cats: ["avukat"], terms: ["hukuk", "hukuki", "dava"] },
  { cats: ["ceviri"], terms: ["tercume", "tercuman", "translation", "translator"] },
  { cats: ["yoga-koc"], terms: ["thetahealing", "theta healing", "reiki", "meditasyon", "nefes", "yasam kocu"] },
  { cats: ["temizlik"], terms: ["temizlikci", "ev temizligi", "ofis temizligi"] },
];

// Sorguda geçen eş anlamlılara karşılık gelen kategori slug'ları (yoksa boş dizi).
export function synonymCategories(query) {
  const q = ` ${normTr(query).replace(/\s+/g, " ").trim()} `;
  if (q.trim().length < 2) return [];
  const out = new Set();
  for (const g of GROUPS) {
    if (g.terms.some((t) => q.includes(` ${t}`))) g.cats.forEach((c) => out.add(c));
  }
  return [...out];
}
