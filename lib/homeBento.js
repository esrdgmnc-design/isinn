// Ana sayfa "vurucu alan" (bento) içeriği — 2026-10-17. Kurucu kararı: Freelancer'ın bento'sundaki
// kategoriler ve kalıp (1 büyük kampanya kutucuğu + 4 iş kutucuğu, her birinde tek cümle + tek düğme);
// düğme "Ne arıyorsun?" ekranını o işin örnek cümlesiyle açar. Cümleler Freelancer'ın metinlerinin
// kopyası değil, aynı ruhta yeniden yazıldı (rakip metnini birebir almamak için).
// Görseller: kurucunun onayıyla üretilen/seçilen kareler public/bento/ altına konur, burada yol olarak
// yazılır; yol boşken kutucuk kendi renginde yer tutucu gösterir. Vitrin kapakları KULLANILMAZ.

// Bento başlığı (kurucu, 2026-10-17): görseller hayata geçirilecek projeler; İşinn bunları yapacak insanları topluyor.
// İki taraflı mesaj: arayan "bul", veren "o kişi sen ol".
export const BENTO_HEADING = { lead: "Bunları gerçekleştirecek kişiyi bul.", accent: "Ya da o kişi sen ol." };
// İngilizce arayüz için (kutucuklarda titleEn/pitchEn/ctaEn/exampleEn; boşsa Türkçesi gösterilir).
export const BENTO_HEADING_EN = { lead: "Find the person who will make these happen.", accent: "Or be that person." };

export const BENTO_BIG = {
  title: "Firmalar için",
  // 2026-11-11 (kurucu): büyük kutucuk firmalara da seslensin (savunma, otomotiv, havacılık ekipleri proje bazlı
  // uzman arasın ya da talep bıraksın). Firma adı kullanılmaz. Düğme talep ekranını kurumsal örnek cümleyle açar.
  pitch: "Projen için mühendis ya da uzman mı lazım? Ne aradığını yaz, uygun kişileri bulalım.",
  cta: "İhtiyacını yaz",
  titleEn: "For companies",
  pitchEn: "Need an engineer or expert for your project? Describe it and we will find the right people.",
  ctaEn: "Describe your need",
  example: "Firmamızın bir projesi için proje bazlı çalışacak, tasarım ve analiz deneyimi olan bir mühendis arıyoruz.",
  exampleEn: "We're looking for an engineer with design and analysis experience to work on a project basis for our company.",
  // Büyük kutucuğun arkasındaki video (Freelancer'daki gibi): { mp4: "/bento/lansman-5.mp4", webm: "/bento/lansman.webm", poster: "/bento/lansman.jpg" }.
  video: { mp4: "/bento/lansman-6.mp4", poster: "/bento/lansman-6.jpg" },
  // Video yoksa sırayla değişen görseller (ör. ["/bento/arka-1.jpg", ...]); ikisi de boşsa koyu zemin.
  frames: [],
};

export const BENTO_TILES = [
  {
    id: "robotik",
    titleEn: "Robotics",
    pitchEn: "Find an engineer for your robotics project.",
    ctaEn: "Find an expert",
    exampleEn: "I'm looking for an engineer to support mechanical design and prototyping for a robotics project.",
    title: "Robotik",
    pitch: "Robot projen için mühendis bul.",
    cta: "Uzman bul",
    color: "#2563EB",
    example: "Bir robotik projesi için mekanik tasarım ve prototip konusunda destek verecek bir mühendis arıyorum.",
    image: "/bento/robotik-2.jpg",
  },
  {
    id: "teknoloji",
    titleEn: "Technology and engineering",
    pitchEn: "Find design and engineering help for your product idea.",
    ctaEn: "Find an expert",
    exampleEn: "I'm looking for an expert to provide design and engineering support for a product idea I have.",
    title: "Teknoloji ve mühendislik",
    pitch: "Ürün fikrin için tasarım ve mühendislik desteği bul.",
    cta: "Uzman bul",
    color: "#111111",
    example: "Aklımdaki bir ürün fikri için tasarım ve mühendislik desteği verecek bir uzman arıyorum.",
    image: "/bento/teknoloji-3.jpg",
  },
  {
    id: "uygulama",
    titleEn: "Web development",
    pitchEn: "Get a website built for your business.",
    ctaEn: "Find an expert",
    exampleEn: "I'm looking for a developer to build a modern website for my business that also looks good on phones.",
    title: "Web geliştirme",
    pitch: "İşin için web sitesi yaptır.",
    cta: "Uzman bul",
    color: "#7C3AED",
    example: "İşletmem için modern, telefonda da düzgün görünen bir web sitesi yaptıracak bir yazılımcı arıyorum.",
    image: "/bento/uygulama-5.jpg",
  },
  {
    id: "marka",
    titleEn: "Brand strategy",
    pitchEn: "Find a designer for your logo, name and brand look.",
    ctaEn: "Find an expert",
    exampleEn: "I'm looking for a designer to create a logo, name and brand identity for my new café.",
    title: "Marka stratejisi",
    pitch: "Logo, isim ve marka görünümü için tasarımcı bul.",
    cta: "Uzman bul",
    color: "#EA580C",
    example: "Yeni kafem için logo, isim ve marka kimliği çalışması yapacak bir tasarımcı arıyorum.",
    image: "/bento/marka.jpg",
  },
];
