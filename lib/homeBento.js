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
  title: "Lansman yılı",
  pitch: "Ertelediğin o projeyi sonunda hayata geçireceğin yıl.",
  cta: "Şimdi başla",
  titleEn: "Launch year",
  pitchEn: "The year you finally bring that postponed project to life.",
  ctaEn: "Start now",
  example: "",
  // Büyük kutucuğun arkasındaki video (Freelancer'daki gibi): { mp4: "/bento/lansman-5.mp4", webm: "/bento/lansman.webm", poster: "/bento/lansman.jpg" }.
  video: { mp4: "/bento/lansman-6.mp4", poster: "/bento/lansman-6.jpg" },
  // Video yoksa sırayla değişen görseller (ör. ["/bento/arka-1.jpg", ...]); ikisi de boşsa koyu zemin.
  frames: [],
};

export const BENTO_TILES = [
  {
    id: "robotik",
    titleEn: "Robotics",
    pitchEn: "Build the future together, piece by piece.",
    ctaEn: "Post a request",
    exampleEn: "I'm looking for an engineer to support mechanical design and prototyping for a robotics project.",
    title: "Robotik",
    pitch: "Geleceği parça parça birlikte kur.",
    cta: "Talep oluştur",
    color: "#2563EB",
    example: "Bir robotik projesi için mekanik tasarım ve prototip konusunda destek verecek bir mühendis arıyorum.",
    image: "/bento/robotik-2.jpg",
  },
  {
    id: "teknoloji",
    titleEn: "Technology and engineering",
    pitchEn: "Take your idea from a sketch to a working product.",
    ctaEn: "Post a request",
    exampleEn: "I'm looking for an expert to provide design and engineering support for a product idea I have.",
    title: "Teknoloji ve mühendislik",
    pitch: "Fikrini çizimden çalışan bir ürüne taşı.",
    cta: "Talep oluştur",
    color: "#111111",
    example: "Aklımdaki bir ürün fikri için tasarım ve mühendislik desteği verecek bir uzman arıyorum.",
    image: "/bento/teknoloji-3.jpg",
  },
  {
    id: "uygulama",
    titleEn: "Web development",
    pitchEn: "Let the address on your business card finally lead somewhere.",
    ctaEn: "Post a request",
    exampleEn: "I'm looking for a developer to build a modern website for my business that also looks good on phones.",
    title: "Web geliştirme",
    pitch: "Kartvizitine yazdığın adres sonunda bir yere çıksın.",
    cta: "Talep oluştur",
    color: "#7C3AED",
    example: "İşletmem için modern, telefonda da düzgün görünen bir web sitesi yaptıracak bir yazılımcı arıyorum.",
    image: "/bento/uygulama-5.jpg",
  },
  {
    id: "marka",
    titleEn: "Brand strategy",
    pitchEn: "Seen once, remembered always.",
    ctaEn: "Post a request",
    exampleEn: "I'm looking for a designer to create a logo, name and brand identity for my new café.",
    title: "Marka stratejisi",
    pitch: "Bir kez gören bir daha hatırlasın.",
    cta: "Talep oluştur",
    color: "#EA580C",
    example: "Yeni kafem için logo, isim ve marka kimliği çalışması yapacak bir tasarımcı arıyorum.",
    image: "/bento/marka.jpg",
  },
];
