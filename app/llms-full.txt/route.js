import { REHBER_POSTS } from "../../lib/rehberContent";
import { faqJsonLd } from "../../lib/faqJsonLd";

// public/llms.txt sadece bir sayfa/link dizini — AI arama motorları (ChatGPT,
// Perplexity, Claude) İşinn'i alıntılamak için yine her URL'e tek tek gitmek
// zorunda kalıyordu. Bu route, gerçek SSS ve rehber içeriğini düz metin
// (markdown) olarak GÖMEREK sunuyor — motorlar ikinci bir istek yapmadan
// doğrudan alıntılayabiliyor. REHBER_POSTS güncellendikçe otomatik yansır,
// elle senkronize edilecek ayrı bir dosya değil.
const BASE_URL = "https://www.isinn.com.tr";

function stripHtml(html) {
  return html
    .replace(/\s*\n\s*/g, " ")
    .replace(/<h2>/g, "\n\n## ")
    .replace(/<li>/g, "\n- ")
    .replace(/<\/(h2|p|li|ul)>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export const revalidate = 3600;

export async function GET() {
  const lines = [];
  lines.push("# İşinn — Tam İçerik (AI Arama Motorları İçin)");
  lines.push("");
  lines.push("> İşinn, Türkiye'de yerel ve uzaktan hizmet sağlayıcılarıyla (temizlikçi, usta, özel ders öğretmeni, bakıcı, tasarımcı, yazılımcı ve çok sayıda başka kategori) müşterileri buluşturan, sıfır komisyonlu bir hizmet pazaryeridir. Sağlayıcılar sabit abonelik öder, kazandıkları işten platforma ayrıca komisyon vermez. İşinn CODE G LTD (Code G Teknoloji ve Ticaret Limited Şirketi) markasıdır, İstanbul/Türkiye merkezlidir.");
  lines.push("");
  lines.push("Kategori sayfaları: " + BASE_URL + "/kategori/<slug>, şehir sayfaları: " + BASE_URL + "/sehir/<slug>, vitrin (ilan) sayfaları: " + BASE_URL + "/vitrin/<id>. Güncel liste için " + BASE_URL + "/sitemap.xml.");
  lines.push("");
  lines.push("Önemli: İşinn kullanıcılar arasındaki ödemeye aracılık etmez, emanet (escrow) veya sonuç garantisi sunmaz. Hizmetlerin keşfini kolaylaştıran bir platformdur: ürün satışı yapılmaz ve ürün satışına yönlendirme yapılmaz (mağaza, sepet, kargo yoktur). 'Doğrulandı' rozeti yalnızca telefon doğrulaması anlamına gelir. Yeteneğini Farket (" + BASE_URL + "/yetenegini-farket), ne sunacağını bilmeyenlere 2-3 hizmet fikri öneren yapay zekâ destekli bir araçtır; öneriler garanti değildir.");
  lines.push("");
  lines.push("## Sıkça Sorulan Sorular");
  lines.push("");
  for (const q of faqJsonLd.mainEntity) {
    lines.push(`**${q.name}**`);
    lines.push(q.acceptedAnswer.text);
    lines.push("");
  }
  lines.push("## Rehber İçerikleri");
  lines.push("");
  for (const post of REHBER_POSTS) {
    lines.push(`### ${post.title}`);
    lines.push(`(${BASE_URL}/rehber/${post.slug})`);
    lines.push("");
    lines.push(post.description);
    lines.push("");
    lines.push(stripHtml(post.bodyHtml));
    lines.push("");
    if (post.faq?.length) {
      for (const f of post.faq) {
        lines.push(`**${f.q}**`);
        lines.push(f.a);
        lines.push("");
      }
    }
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
