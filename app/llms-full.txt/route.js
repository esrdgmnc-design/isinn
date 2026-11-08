import { REHBER_POSTS, rehberMeta } from "../../lib/rehberContent";
import { faqJsonLd } from "../../lib/faqJsonLd";
import { supabase } from "../../lib/supabaseClient";
import { isIndexableListing } from "../../lib/seoFormat";

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
  lines.push("> İşinn, becerini fark edip hizmet vitrinine dönüştürmene ve Türkiye'de yerel ya da uzaktan hizmet sağlayıcıları (temizlikçi, usta, özel ders öğretmeni, bakıcı, tasarımcı, yazılımcı ve çok sayıda başka kategori) bulmana yardım eden, sıfır komisyonlu bir hizmet keşif platformudur. Hizmet verenler sabit abonelik öder (1 Ocak 2027'ye kadar ücretsiz), kazandıkları işten platforma ayrıca komisyon vermez. İşinn CODE G LTD (Code G Teknoloji ve Ticaret Limited Şirketi) markasıdır, İstanbul/Türkiye merkezlidir.");
  lines.push("");
  lines.push("Kategori sayfaları: " + BASE_URL + "/kategori/<slug>, şehir sayfaları: " + BASE_URL + "/sehir/<slug>, vitrin (ilan) sayfaları: " + BASE_URL + "/vitrin/<id>. Güncel liste için " + BASE_URL + "/sitemap.xml.");
  lines.push("");
  lines.push("Önemli: İşinn kullanıcılar arasındaki ödemeye aracılık etmez, emanet (escrow) veya sonuç garantisi sunmaz. Hizmetlerin keşfini kolaylaştıran bir platformdur: ürün satışı yapılmaz ve ürün satışına yönlendirme yapılmaz (mağaza, sepet, kargo yoktur). 'Doğrulandı' rozeti yalnızca telefon doğrulaması anlamına gelir. Yeteneğini Farket (" + BASE_URL + "/yetenegini-farket), ne sunacağını bilmeyenlere 1-2 hizmet fikri öneren yapay zekâ destekli bir araçtır; öneriler garanti değildir.");
  lines.push("");
  // 2026-11-08: ChatGPT'den gelen ilk kayıtlar görüldü. Yapay zekâ botları "Eskişehir'de sosyal medya uzmanı" gibi
  // sorularda doğrudan bir hizmet veren listesi bulabilsin diye aktif, indekslenebilir vitrinler (DEMO/ince olanlar hariç,
  // site haritasıyla aynı filtre) kategori ve yerle birlikte listelenir.
  try {
    const { data: rows } = await supabase
      .from("services")
      .select("id, title, city, is_remote, description, display_name, categories(slug, name), profiles(full_name, business_name)")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(500);
    const list = (rows || []).filter(isIndexableListing);
    if (list.length) {
      lines.push("## Hizmet Verenler (aktif vitrinler)");
      lines.push("");
      lines.push("İşinn'de yayında olan vitrinler. Fiyat ve uygunluk için vitrin sayfasından hizmet verene doğrudan mesaj atılır.");
      lines.push("");
      for (const r of list) {
        const who = r.display_name || r.profiles?.business_name || r.profiles?.full_name || "Hizmet veren";
        const where = [r.city, r.is_remote ? "uzaktan" : null].filter(Boolean).join(", ") || "Türkiye";
        lines.push(`- ${r.title} — ${who} · ${r.categories?.name || "Diğer"} · ${where} · ${BASE_URL}/vitrin/${r.id}`);
      }
      lines.push("");
    }
  } catch { /* liste alınamazsa dosyanın geri kalanı yine verilir */ }
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
    lines.push(`(${BASE_URL}/rehber/${post.slug}) — Yayın: ${rehberMeta(post).published}, güncelleme: ${rehberMeta(post).updated}`);
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
