import Link from "next/link";
import { socialMeta } from "../../../lib/seoMeta";
import SeoFooter from "../../../components/SeoFooter";
import OzelDersCalculator from "../../../components/OzelDersCalculator";
import EmbedCode from "../../../components/EmbedCode";
import { toolById } from "../../../lib/tools";

const TOOL = toolById("ozel-ders");

// 2026-11-09: büyüme ajanının önerisi. "özel ders ücretleri 2026", "lgs özel ders ücreti", "aylık özel ders ne kadar"
// sorguları; hem veli (talep) hem öğretmen (arz) tarafı arar. Veriler fiyat rehberlerindeki kaynaklı aralıklardan.
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/araclar/ozel-ders-ucreti-hesaplama`;
const TITLE = "Özel Ders Ücreti Hesaplama 2026: Saatlik ve Aylık Maliyet";
const DESCRIPTION = "Özel ders ücreti hesaplama: LGS, YKS, lise matematik, İngilizce, IELTS, piyano ve gitar dersleri için 2026 saatlik aralık ve haftalık ders sayısına göre aylık maliyet.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
};

const FAQ = [
  { q: "1 saat özel ders ne kadar 2026?", a: "Yayımlanan kaynaklara göre ilkokul derslerinde saatlik 650–1.000 TL, lise matematikte 750–1.500 TL, LGS ve YKS hazırlıkta 1.000–2.000 TL ve üzeri. Öğretmenin deneyimi ve şehir fiyatı değiştirir." },
  { q: "Aylık özel ders maliyeti nasıl hesaplanır?", a: "Ders başı ücret × haftalık ders sayısı × 4 hafta. Örneğin haftada 2 LGS dersi, ders başı 1.000–2.000 TL ile aylık yaklaşık 8.000–16.000 TL eder." },
  { q: "İngilizce ve IELTS özel dersi ne kadar?", a: "Kaynaklara göre genel İngilizce özel ders saatlik 1.500–2.000 TL, YDS, IELTS ve TOEFL hazırlık 1.500–2.500 TL." },
];

const ldFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const ldApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Özel Ders Ücreti Hesaplama",
  url: URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "tr",
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  publisher: { "@type": "Organization", name: "İşinn", url: BASE_URL },
};

const h2 = "font-sans text-xl font-black mb-3 mt-8";
const ink = { color: "#374151" };

export default function OzelDersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldApp).replace(/</g, "\\u003c") }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-4" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Araçlar › Özel ders ücreti hesaplama
        </nav>
        <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>Özel ders ücreti hesaplama 2026</h1>
        <p className="text-base mb-6" style={ink}>
          Dersi ve haftalık ders sayısını seç; yayımlanmış kaynaklara göre saatlik aralığı ve aylık tahmini maliyeti gör.
        </p>

        <OzelDersCalculator />

        <h2 className={h2} style={{ color: "#0F1115" }}>Sık sorulanlar</h2>
        {FAQ.map((f) => (
          <div key={f.q} className="mb-4">
            <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</h3>
            <p className="text-sm" style={ink}>{f.a}</p>
          </div>
        ))}
        <p className="text-sm mb-3" style={ink}>
          Ayrıntılar için <Link href="/rehber/ozel-ders-ucretleri-2026" style={{ color: "#2563EB" }}>özel ders ücretleri 2026</Link> ve <Link href="/rehber/muzik-ve-piyano-dersi-ucretleri-2026" style={{ color: "#2563EB" }}>müzik ve piyano dersi ücretleri</Link> rehberlerine, öğretmen seçerken <Link href="/rehber/iyi-ozel-ders-ogretmeni-nasil-secilir" style={{ color: "#2563EB" }}>iyi bir özel ders öğretmeni nasıl seçilir</Link> yazısına bakabilirsin.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          <a href="/kategori/ogretmen?utm_source=ozel_ders_hesaplayici" className="rounded-2xl p-4 block" style={{ background: "#F5F7FF", border: "1px solid #DCE4FF" }}>
            <p className="text-sm font-bold" style={{ color: "#0F1115" }}>Öğretmen mi arıyorsun?</p>
            <p className="text-xs mt-1" style={ink}>Öğretmenlerin vitrinlerine bak, doğrudan yaz.</p>
          </a>
          <a href="/hizmet-ver?utm_source=ozel_ders_hesaplayici" className="rounded-2xl p-4 block" style={{ background: "#F5F7FF", border: "1px solid #DCE4FF" }}>
            <p className="text-sm font-bold" style={{ color: "#0F1115" }}>Ders mi veriyorsun?</p>
            <p className="text-xs mt-1" style={ink}>Vitrinini aç, seni arayan doğrudan sana ulaşsın.</p>
          </a>
        </div>
        <EmbedCode embedUrl={`${BASE_URL}${TOOL.embedPath}`} toolUrl={URL} name={TOOL.name} height={TOOL.embedHeight} />
        <p className="text-xs mt-6" style={{ color: "#6B7280" }}>Rakamlar bağlantısı verilen kaynaklarda yayımlanan aralıklardır; İşinn'in belirlediği fiyatlar değildir. Son güncelleme: 9 Kasım 2026.</p>
      </div>
      <SeoFooter />
    </>
  );
}
