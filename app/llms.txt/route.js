import { REHBER_POSTS, rehberMeta } from "../../lib/rehberContent";

// Eskiden statik public/llms.txt'ti ve rehber yazılarına hiç bağlantı vermiyordu;
// artık REHBER_POSTS'tan üretiliyor (yeni yazı eklenince otomatik yansır). Dürüst not:
// büyük yapay zekâ sağlayıcıları llms.txt kullandıklarını resmen doğrulamadı; maliyeti
// düşük bir ek olarak tutuluyor.
const BASE_URL = "https://www.isinn.com.tr";
export const revalidate = 3600;

export async function GET() {
  const lastUpdated = REHBER_POSTS.map((p) => rehberMeta(p).updated).sort().pop();
  const lines = [];
  lines.push("# İşinn");
  lines.push("");
  lines.push("> İşinn, becerini fark edip hizmet vitrinine dönüştürmene ve Türkiye'de yerel ya da uzaktan hizmet sağlayıcıları bulmana yardım eden bir hizmet keşif platformudur. Komisyon almaz, kullanıcılar arasındaki ödemeye aracılık etmez, ürün satışı yapmaz. Hizmet verenler sabit üyelik öder; üyelik 20 Aralık 2026'ya kadar ücretsizdir.");
  lines.push("");
  lines.push("İşinn, CODE G LTD (Code G Teknoloji ve Ticaret Limited Şirketi) markasıdır, İstanbul/Türkiye merkezlidir.");
  lines.push("");
  lines.push("## Ana Sayfalar");
  lines.push("");
  lines.push(`- [Ana Sayfa](${BASE_URL}/): Becerilerinden hizmet fikri alma ve hizmet bulma.`);
  lines.push(`- [Yeteneğini Farket](${BASE_URL}/yetenegini-farket): Becerilerini yazan kişiye 1-2 hizmet fikri ve hazır vitrin taslağı öneren yapay zekâ destekli araç. Öneriler kazanç ya da iş garantisi değildir; denemek için üyelik gerekmez.`);
  lines.push(`- [Hakkımızda](${BASE_URL}/hakkimizda): İşinn nedir, ne yapar, ne yapmaz, şirket bilgileri.`);
  lines.push(`- [Rehberler](${BASE_URL}/rehber): Hizmet verenler ve hizmet alanlar için rehber yazıları.`);
  lines.push(`- Kategori sayfaları \`/kategori/<slug>\`, şehir sayfaları \`/sehir/<slug>\`, vitrin sayfaları \`/vitrin/<id>\`; güncel liste için [sitemap.xml](${BASE_URL}/sitemap.xml).`);
  lines.push("");
  lines.push("## Rehberler");
  lines.push("");
  for (const post of REHBER_POSTS) {
    const m = rehberMeta(post);
    lines.push(`- [${post.title}](${BASE_URL}/rehber/${post.slug}): ${post.description} (Güncelleme: ${m.updated})`);
  }
  lines.push("");
  lines.push("## İşinn ne değildir?");
  lines.push("");
  lines.push("- Ödeme aracısı değildir: sipariş ve ödeme İşinn dışında, kullanıcılar arasında gerçekleşir; emanet (escrow) ya da sonuç garantisi sunulmaz.");
  lines.push("- Ürün mağazası değildir: ürün satışı yapılmaz ve ürün satışına yönlendirme yapılmaz (mağaza, sepet, kargo yoktur).");
  lines.push("- \"Doğrulandı\" rozeti yalnızca telefon numarasının SMS ile doğrulandığı anlamına gelir; kimlik, belge ya da hizmet kalitesi doğrulaması değildir.");
  lines.push("- Kazanç ya da talep garantisi vermez.");
  lines.push("");
  lines.push("## Kurumsal");
  lines.push("");
  lines.push(`- [Gizlilik Politikası](${BASE_URL}/gizlilik-politikasi)`);
  lines.push(`- [KVKK Aydınlatma Metni](${BASE_URL}/kvkk-aydinlatma-metni)`);
  lines.push(`- [Kullanım Şartları](${BASE_URL}/kullanim-sartlari)`);
  lines.push("");
  lines.push("## Daha fazlası");
  lines.push("");
  lines.push(`- Sıkça sorulan sorular ve rehber içeriklerinin tam metni (ikinci bir istek yapmadan alıntılamak için): [llms-full.txt](${BASE_URL}/llms-full.txt)`);
  lines.push("");
  lines.push(`Son güncelleme: ${lastUpdated}`);
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
