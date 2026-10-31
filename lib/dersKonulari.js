// Özel ders vitrinlerinde ders ve düzey tespiti (2026-10-31). Öğretmen kategorisi tek liste olduğu için
// İngilizce vitrinin "benzer vitrinler"ine ilkokul matematik giriyordu; ayrıca ders bazlı sayfalar
// (app/ozel-ders/[ders]) aynı eşleştirmeyi kullanır. Kaynak yalnızca vitrinin kendi başlığı ve açıklaması.

const norm = (s) =>
  String(s || "")
    .replace(/İ/g, "i").replace(/I/g, "ı")
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");

const TOPICS = {
  matematik: /matematik|geometri/,
  ingilizce: /ingilizce|english|\bielts\b|\btoefl\b|\byds\b/,
  turkce: /turkce|paragraf/,
  fen: /\bfen\b|fizik|kimya|biyoloji/,
  lgs: /\blgs\b|liselere hazirlik|lise(ye|lere) gecis/,
  yks: /\byks\b|\btyt\b|\bayt\b|universite sinav/,
};
const LEVELS = {
  ilkokul: /ilkokul|\b[1-4]\. sinif/,
  ortaokul: /ortaokul|\b[5-8]\. sinif|\blgs\b/,
  lise: /\blise\b|\b9\. sinif|\b1[0-2]\. sinif|\byks\b|\btyt\b|\bayt\b/,
  yetiskin: /yetiskin|universite ogrenci|is hayati|profesyonel/,
};

const pick = (map, text) => Object.keys(map).filter((k) => map[k].test(text));
const textOf = (row) => norm(`${row.title || ""} ${row.description || ""}`);

export function dersBilgisi(row) {
  const t = textOf(row);
  return { topics: pick(TOPICS, t), levels: pick(LEVELS, t), online: !!row.is_remote || /online|uzaktan|cevrim ?ici/.test(t) };
}

// Benzer vitrin puanı: önce ortak ders, sonra ortak düzey, sonra aynı il.
export function benzerlikPuani(base, other, sameProvince) {
  const a = dersBilgisi(base), b = dersBilgisi(other);
  const ders = a.topics.filter((x) => b.topics.includes(x)).length;
  const duzey = a.levels.filter((x) => b.levels.includes(x)).length;
  return ders * 100 + duzey * 10 + (sameProvince ? 1 : 0);
}

// Ders sayfaları. Bir sayfa yalnızca en az MIN_DERS_VITRIN gerçek vitrin varsa dizine girer (boş/köprü sayfa olmasın).
export const MIN_DERS_VITRIN = 3;
export const DERS_SAYFALARI = [
  {
    slug: "matematik",
    name: "Matematik özel ders",
    h1: "Matematik Özel Ders Öğretmenleri",
    match: (d) => d.topics.includes("matematik"),
    intro: "İlkokuldan sınav hazırlığına kadar matematik özel dersi veren öğretmenlerin vitrinleri. Her vitrinde öğretmenin hangi düzeyde ders verdiği, yüz yüze mi online mı çalıştığı ve ücret bilgisi yer alır; sorularını doğrudan öğretmene yazabilirsin.",
    secim: [
      "Öğrencinin düzeyini ve hedefini (okul takviyesi, LGS, YKS) ilk mesajda yaz; öğretmenin o düzeyde deneyimi olup olmadığını sor.",
      "Ücretin tek ders mi, saat mi yoksa aylık paket mi olduğunu baştan netleştir.",
      "İlk derste öğrencinin eksiklerini nasıl belirleyeceğini ve ilerlemeyi veliye nasıl bildireceğini sor.",
    ],
    sss: [
      { q: "Matematik özel dersi online mı yüz yüze mi daha iyi?", a: "Kesin bir doğru yok. Yüz yüze ders küçük yaşta dikkat açısından kolaylık sağlayabilir; online ders ise ulaşım süresini ortadan kaldırır ve daha geniş bir öğretmen seçeneği sunar. Vitrinlerde öğretmenin hangi biçimde çalıştığı yazar." },
      { q: "Haftada kaç ders gerekir?", a: "Öğrencinin eksiklerine ve hedefe bağlıdır; çoğu öğretmen ilk dersten sonra bir plan önerir. Bunu ilk görüşmede sormak en sağlıklısı." },
      { q: "Ücretler nasıl belirleniyor?", a: "Ücreti her öğretmen kendisi belirler; İşinn ödemeye aracılık etmez. Genel bir fikir için özel ders ücretleri rehberine bakabilirsin." },
    ],
    rehberler: ["ozel-ders-ucretleri-2026", "iyi-ozel-ders-ogretmeni-nasil-secilir"],
  },
  {
    slug: "online-ingilizce",
    name: "Online İngilizce özel ders",
    h1: "Online İngilizce Özel Ders",
    match: (d) => d.topics.includes("ingilizce") && d.online,
    intro: "Online İngilizce dersi veren öğretmenlerin vitrinleri: çocuklar için okul takviyesinden yetişkinler için konuşma pratiğine kadar. Türkiye'nin her yerinden ders alınabilir; öğretmenin düzeyini, yöntemini ve ücretini vitrininde görüp doğrudan yazabilirsin.",
    secim: [
      "Hedefini yaz: okul dersleri, konuşma, sınav (YDS, IELTS gibi) ya da iş İngilizcesi.",
      "Deneme dersi veya kısa bir tanışma görüşmesi olup olmadığını sor.",
      "Ders araçlarını (görüntülü görüşme programı, ödev ve materyal) ve ücretin ders mi paket mi olduğunu baştan netleştir.",
    ],
    sss: [
      { q: "Online İngilizce dersi etkili olur mu?", a: "Konuşma ve dinleme çalışmaları için online ders yüz yüze kadar verimli olabilir; asıl fark düzenli ders ve ders dışı pratiktir. Öğretmene ders dışında ne çalışmanı önerdiğini sor." },
      { q: "Çocuklar için online İngilizce uygun mu?", a: "Ders süresi ve etkinlik türü yaşa göre ayarlandığında uygundur. Vitrinlerde öğretmenin hangi yaş grubuyla çalıştığı yazar; ilk mesajda çocuğun yaşını belirt." },
      { q: "Ücretler nasıl belirleniyor?", a: "Ücreti her öğretmen kendisi belirler; İşinn ödemeye aracılık etmez. Genel bir fikir için özel ders ücretleri rehberine bakabilirsin." },
    ],
    rehberler: ["ozel-ders-ucretleri-2026", "iyi-ozel-ders-ogretmeni-nasil-secilir"],
  },
  {
    slug: "lgs",
    name: "LGS özel ders",
    h1: "LGS Hazırlık Özel Ders ve Koçluk",
    match: (d) => d.topics.includes("lgs"),
    intro: "LGS'ye hazırlanan öğrenciler için özel ders, kurs ve eğitim koçluğu vitrinleri. Ders bazlı destek (Türkçe, matematik, fen) ya da çalışma planı ve takip odaklı koçluk arasından seçim yapabilir, öğretmene doğrudan yazabilirsin.",
    secim: [
      "Öğrencinin sınıfını ve deneme sınavlarındaki zayıf derslerini ilk mesajda paylaş.",
      "Ders bazlı destek mi (tek ders) yoksa tüm süreci kapsayan koçluk mu gerektiğine karar ver; ikisi farklı hizmetlerdir.",
      "Ücretin ders, ay ya da dönem karşılığı olduğunu ve deneme takibinin dahil olup olmadığını sor.",
    ],
    sss: [
      { q: "LGS hazırlığına ne zaman başlanmalı?", a: "Çoğu öğrenci 8. sınıfta yoğunlaşır, eksikleri olanlar 7. sınıftan başlar. Öğrencinin durumuna göre bir plan için LGS hazırlık rehberine ve öğretmenin önerisine bakabilirsin." },
      { q: "Özel ders mi, koçluk mu?", a: "Belirli derslerde eksik varsa ders bazlı özel ders; çalışma düzeni ve motivasyon sorunuysa koçluk daha uygun olabilir. Vitrin açıklamalarında hangisinin sunulduğu yazar." },
      { q: "Ücretler nasıl belirleniyor?", a: "Ücreti her öğretmen ya da kurum kendisi belirler; İşinn ödemeye aracılık etmez. Genel bir fikir için özel ders ücretleri rehberine bakabilirsin." },
    ],
    rehberler: ["lgs-hazirlik-sureci-nasil-planlanir", "ozel-ders-ucretleri-2026"],
  },
];

export const findDersSayfasi = (slug) => DERS_SAYFALARI.find((s) => s.slug === slug) || null;
export const dersSayfasiVitrinleri = (sayfa, rows) => rows.filter((r) => sayfa.match(dersBilgisi(r)));
