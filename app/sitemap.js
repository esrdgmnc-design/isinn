// Next.js App Router özel dosyası — /sitemap.xml'i otomatik üretir.
//
// NOT: İşinn'in vitrin/ilan detay sayfaları kendi URL'lerine sahip değil —
// tüm uygulama tek bir "/" sayfası üzerinde, istemci tarafı görünüm durumuyla
// (view state) çalışıyor. Yani her vitrini burada ayrı ayrı listeleyemiyoruz;
// bu, gerçek bir SEO sınırlaması (her vitrin kendi başına indekslenip
// paylaşılamıyor) ama bugünkü kapsamın ötesinde, ayrı bir mimari iş —
// şimdilik gerçekten var olan statik sayfaları listeliyoruz.
const BASE_URL = "https://www.isinn.com.tr";

export default function sitemap() {
  const staticPaths = [
    "",
    "/kvkk-aydinlatma-metni",
    "/gizlilik-politikasi",
    "/kullanim-sartlari",
    "/mesafeli-satis-sozlesmesi",
    "/iptal-iade-kosullari",
  ];
  return staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.3,
  }));
}
