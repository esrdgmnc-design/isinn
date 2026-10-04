/** @type {import('next').NextConfig} */
const nextConfig = {
  // public/ altındaki görsel/video/ikonlar "max-age=0, must-revalidate" ile geliyordu: her ziyarette yeniden doğrulanıyordu.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/videos/:path*", headers: cache },
      { source: "/images/:path*", headers: cache },
      { source: "/icons/:path*", headers: cache },
    ];
  },
  images: {
    // Yüklenen vitrin fotoğrafları benzersiz dosya adlarıyla saklanıyor; optimize edilmiş çıktı 31 gün önbellekte kalsın.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      // Gerçek vitrin/kullanıcı fotoğrafları Supabase Storage'dan geliyor —
      // next/image bu domainden optimize edebilsin diye eklendi (programatik
      // SEO sayfalarındaki ham <img> etiketlerini next/image'a taşırken
      // fark edildi, önceden sadece fallback Unsplash/Pexels görselleri
      // optimize edilebiliyordu).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

module.exports = nextConfig;
