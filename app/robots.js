// Her özel kullanıcı ajanı grubunun KENDİ kuralları geçerlidir ve "*" grubunu yok sayar:
// önceden GPTBot/ClaudeBot gibi gruplarda "/api/" engeli yoktu, yani bu botlar teoride
// API yollarını da tarayabilirdi. Ortak kural listesi her gruba aynen uygulanıyor.
// Yapay zekâ ARAMA ve kullanıcı botları (OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
// Claude-User, Perplexity-User) ile klasik arama botları açıkça izinli — eğitim
// botlarından ayrıdırlar ve engellemek İşinn'in yapay zekâ aramalarında görünmesini keser.
const BOTS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: "https://www.isinn.com.tr/sitemap.xml",
  };
}
