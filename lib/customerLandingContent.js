// Müşteri kazanım reklamı iniş sayfası içeriği. Temizlik ve nakliye için: bu iki
// meslekte İstanbul'da asıl kıtlık sağlayıcı değil müşteri tarafındadır (iyi bir
// temizlikçi/nakliyeci bulmak zor) — bu yüzden reklam sağlayıcıya değil, hizmet
// arayan müşteriye gösterilir. Rakip adı ve sosyal medya platformu adı geçmez.
export const CUSTOMER_AUDIENCES = {
  temizlik: {
    title: "Temizlikçi Arayanlar İçin",
    headline: "Güvenilir Bir Temizlikçi Bulmakta mı Zorlanıyorsunuz?",
    sub: "İhtiyacınızı ücretsiz ilan edin, teklifler gelsin, sağlayıcıların vitrinini inceleyip kararı siz verin.",
  },
  nakliye: {
    title: "Nakliyeci Arayanlar İçin",
    headline: "Güvenilir Bir Nakliyeci Bulmakta mı Zorlanıyorsunuz?",
    sub: "İhtiyacınızı ücretsiz ilan edin, teklifler gelsin, sağlayıcıların vitrinini inceleyip kararı siz verin.",
  },
  default: {
    title: "Hizmet Arayanlar İçin",
    headline: "İhtiyacınız Olan Hizmeti Bulmakta mı Zorlanıyorsunuz?",
    sub: "İhtiyacınızı ücretsiz ilan edin, teklifler gelsin, sağlayıcıların vitrinini inceleyip kararı siz verin.",
  },
};

export function getCustomerAudience(slug) {
  return CUSTOMER_AUDIENCES[slug] || CUSTOMER_AUDIENCES.default;
}

export const CUSTOMER_STEPS = [
  { n: "1", t: "İlanınızı verin", d: "İhtiyacınızı birkaç cümleyle anlatın — tamamen ücretsizdir." },
  { n: "2", t: "Teklifler gelsin", d: "İlgilenen sağlayıcılar size mesaj ve teklif gönderir." },
  { n: "3", t: "Vitrinleri inceleyin", d: "Portföy, paylaşılan belgeler ve gerçek müşteri yorumlarına bakın." },
  { n: "4", t: "Kararı siz verin", d: "Uygun bulduğunuz sağlayıcıyla doğrudan anlaşın." },
];

export const CUSTOMER_FAQ = [
  { q: "İlan vermek ücretli mi?", a: "Hayır. İlan vermek, mesajlaşmak ve teklif almak İşinn'de her zaman tamamen ücretsizdir." },
  { q: "Ödemeyi nasıl yaparım?", a: "Ödemeyi doğrudan seçtiğiniz sağlayıcıya yaparsınız. İşinn bu sürece dahil olmaz, komisyon almaz." },
  { q: "Yorumlar ve belgeler doğrulanıyor mu?", a: "Yorumlar hizmeti aldığını beyan eden müşterilerden gelir; paylaşılan belgeler sağlayıcı beyanıdır, İşinn tarafından incelenmez. Karar verirken bunları kendiniz değerlendirmenizi öneririz." },
  { q: "Ne kadar sürede teklif gelir?", a: "Bu, kategoriye ve bölgeye göre değişir; ilgilenen sağlayıcılar sizinle doğrudan iletişime geçer." },
];
