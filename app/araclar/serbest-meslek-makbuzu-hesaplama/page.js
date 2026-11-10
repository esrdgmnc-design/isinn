import Link from "next/link";
import { socialMeta } from "../../../lib/seoMeta";
import SeoFooter from "../../../components/SeoFooter";
import SmmCalculator from "../../../components/SmmCalculator";
import EmbedCode from "../../../components/EmbedCode";
import { toolById } from "../../../lib/tools";

const TOOL = toolById("smm");

// 2026-11-09: SEO/büyüme ajanlarının önerisi. "serbest meslek makbuzu hesaplama" sürekli aranan, mevsimsiz bir sorgu;
// arayan kişi doğrudan danışman/serbest meslek sahibi (İşinn'in arz tarafı). Oranlar: GVK 94/2-b stopaj %20, KDV %20.
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/araclar/serbest-meslek-makbuzu-hesaplama`;
const TITLE = "Serbest Meslek Makbuzu Hesaplama 2026: Brüt, Net, Stopaj, KDV";
const DESCRIPTION = "Serbest meslek makbuzu brütten nete ve netten brüte hesaplama: %20 gelir vergisi stopajı ve %20 KDV ile tahsil edilecek tutar. Ücretsiz, kayıt gerektirmez.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
};

const FAQ = [
  { q: "Serbest meslek makbuzunda stopaj oranı kaç 2026?", a: "Makbuzu alan şirket ya da kurum vergi kesmekle yükümlüyse brüt ücret üzerinden %20 gelir vergisi stopajı kesilir (Gelir Vergisi Kanunu 94/2-b). Müşteri bireyse stopaj kesilmez." },
  { q: "Serbest meslek makbuzunda KDV nasıl hesaplanır?", a: "KDV brüt ücret üzerinden hesaplanır; genel oran %20'dir. Tahsil edilecek tutar = brüt ücret − stopaj + KDV. Stopaj ve KDV oranı %20 olduğunda tahsil edilen tutar brüt ücrete eşit çıkar." },
  { q: "Netten brüte nasıl hesaplanır?", a: "Hesabına geçmesini istediğin KDV dahil tutarı (1 − stopaj oranı + KDV oranı) değerine bölersin. %20 stopaj ve %20 KDV'de bu değer 1 olduğu için brüt, istenen tutara eşittir; stopaj yoksa tutar 1,20'ye bölünür." },
  { q: "Müşteri bireyse ne değişir?", a: "Bireyler vergi kesmekle yükümlü olmadığı için stopaj kesilmez; makbuzda brüt ücret ve üzerine KDV yer alır. Gelir vergisini yıllık beyannamenle kendin ödersin." },
];

const ldFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const ldApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Serbest Meslek Makbuzu Hesaplama",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "tr",
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  publisher: { "@type": "Organization", name: "İşinn", url: BASE_URL },
};

const h2 = "font-sans text-xl font-black mb-3 mt-8";
const p = "text-sm mb-3";
const ink = { color: "#374151" };

export default function SmmPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldApp).replace(/</g, "\\u003c") }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-4" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Araçlar › Serbest meslek makbuzu hesaplama
        </nav>
        <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>Serbest meslek makbuzu hesaplama 2026</h1>
        <p className="text-base mb-6" style={ink}>
          Danışmanlık, ders, tasarım, çeviri gibi serbest meslek işlerinde makbuza yazılacak brüt ücreti, kesilecek stopajı, eklenecek KDV'yi ve hesabına geçecek tutarı hesapla.
        </p>

        <SmmCalculator />

        <h2 className={h2} style={{ color: "#0F1115" }}>Nasıl hesaplanır?</h2>
        <ul className="list-disc pl-5 space-y-1 mb-3 text-sm" style={ink}>
          <li><b>Stopaj:</b> müşteri şirket ya da kurumsa brüt ücretin %20'si (Gelir Vergisi Kanunu 94/2-b). Müşteri bunu senin adına vergi dairesine yatırır.</li>
          <li><b>KDV:</b> brüt ücretin %20'si (genel oran). Müşteriden tahsil edip beyannameyle devlete ödersin.</li>
          <li><b>Tahsil edilecek tutar:</b> brüt − stopaj + KDV.</li>
        </ul>
        <p className={p} style={ink}><b>Örnek:</b> 10.000 TL brüt ücrette 2.000 TL stopaj kesilir, 2.000 TL KDV eklenir; müşteri sana 10.000 TL öder. 2.000 TL'lik KDV'yi devlete yatırırsın, KDV hariç sana 8.000 TL kalır.</p>
        <p className={p} style={ink}>Bazı hizmetlerde KDV tevkifatı ya da farklı oranlar uygulanabilir. Kesin hesap için mali müşavirine danış; ücretleri merak ediyorsan <Link href="/rehber/mali-musavir-ucretleri-2026" style={{ color: "#2563EB" }}>mali müşavir ücretleri 2026</Link> rehberine bak.</p>

        <h2 className={h2} style={{ color: "#0F1115" }}>Sık sorulanlar</h2>
        {FAQ.map((f) => (
          <div key={f.q} className="mb-4">
            <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</h3>
            <p className="text-sm" style={ink}>{f.a}</p>
          </div>
        ))}

        <div className="rounded-2xl p-5 mt-8" style={{ background: "#F5F7FF", border: "1px solid #DCE4FF" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>Bu ücretle hizmet veriyor musun?</p>
          <p className="text-sm mb-3" style={ink}>İşinn'de vitrinini aç; yaptığın işleri göster, seni arayan doğrudan sana yazsın.</p>
          <a href="/hizmet-ver?utm_source=smm_hesaplayici" className="inline-block text-sm font-bold px-4 py-2 rounded-full" style={{ background: "#0F1115", color: "#FFFFFF" }}>Vitrinini aç</a>
        </div>
        <EmbedCode embedUrl={`${BASE_URL}${TOOL.embedPath}`} toolUrl={URL} name={TOOL.name} height={TOOL.embedHeight} />
        <p className="text-xs mt-6" style={{ color: "#6B7280" }}>Bu sayfa genel bilgilendirme amaçlıdır, mali tavsiye değildir. Son güncelleme: 9 Kasım 2026.</p>
      </div>
      <SeoFooter />
    </>
  );
}
