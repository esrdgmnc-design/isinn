/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
