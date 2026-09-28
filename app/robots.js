// Wildcard (userAgent: "*") zaten tüm botlara izin veriyordu, AI botları dahil
// — ama bu, ileride dikkatsiz bir düzenlemeyle (ör. sadece "*" kuralını
// daraltmak) AI botlarını da sessizce bloke etme riski taşıyordu. Her AI
// crawler'ı ayrı, açık bir kuralla listelemek hem kendi kendini belgeliyor hem
// de ileride kötü niyetli bir botu (ör. Bytespider) iyi olanlara dokunmadan
// engellemeyi mümkün kılıyor.
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: "https://www.isinn.com.tr/sitemap.xml",
  };
}
