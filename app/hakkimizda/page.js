import Link from "next/link";
import { COMPANY } from "../../lib/companyInfo";
import { jsonLdString } from "../../lib/jsonLd";

// İşinn nedir sorusuna (marka aramaları, yapay zekâ özetleri) tek, tutarlı ve doğrulanabilir
// cevap. Her cümle platformun gerçek durumuna dayanır: komisyon yok, ödemeye aracılık yok,
// ürün satışı yok, "Doğrulandı" yalnızca telefon doğrulaması. Kişisel kurucu hikâyesi
// kurucunun onayıyla eklenmek üzere bilerek eklenmedi.
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/hakkimizda`;
const TITLE = "İşinn Nedir? Ne Yapar, Ne Yapmaz | Hakkımızda";
const DESCRIPTION = "İşinn, becerini fark edip hizmet vitrinine dönüştürmene ve yakınındaki hizmetleri bulmana yardım eden bir hizmet keşif platformudur. Komisyon almaz, ödemeye aracılık etmez, ürün satmaz.";
const UPDATED = "2026-10-04";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "İşinn", locale: "tr_TR", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const DOES = [
  "Becerini fark etmene yardım eder: Yeteneğini Farket aracı yazdıklarından 1-2 hizmet fikri ve hazır bir vitrin taslağı önerir.",
  "Hizmetini fotoğraflı bir vitrinde sergilemeni sağlar; şirket kurman gerekmez.",
  "Hizmet arayanların vitrinleri kategori, şehir ve konuma göre bulmasını ve doğrudan iletişime geçmesini sağlar.",
  "Hizmet arayanlar için ücretsizdir; hizmet verenlerden sabit üyelik ücreti alır (20 Aralık 2026'ya kadar ücretsiz).",
];
const DOESNT = [
  "Komisyon almaz: kazandığın işten İşinn'e pay vermezsin.",
  "Kullanıcılar arasındaki ödemeye aracılık etmez; emanet (escrow) ya da sonuç garantisi sunmaz.",
  "Ürün satışı yapmaz ve ürün satışına yönlendirmez: mağaza, sepet ya da kargo yoktur.",
  "Kazanç ya da iş garantisi vermez; araçtaki öneriler başlangıç noktasıdır.",
  "“Doğrulandı” rozeti yalnızca telefon numarasının SMS ile doğrulandığını gösterir; kimlik, belge ya da hizmet kalitesi doğrulaması değildir.",
];
const FAQ = [
  { q: "İşinn nedir?", a: "İşinn, insanların becerilerini fark edip hizmet vitrinine dönüştürmesine ve Türkiye'de yerel ya da uzaktan hizmet arayanlarla buluşmasına yardım eden bir hizmet keşif platformudur." },
  { q: "İşinn güvenilir mi?", a: "İşinn, Code G Teknoloji ve Ticaret Limited Şirketi'nin markasıdır ve şirket bilgileri bu sayfada yer alır. Hizmet verenlerin telefon numarası SMS ile doğrulanır; bu bir kimlik ya da kalite doğrulaması değildir. İşinn ödemeye aracılık etmediği için karar vermeden önce vitrini ve değerlendirmeleri incelemeni, ücret ve iptal koşullarını yazılı netleştirmeni öneririz." },
  { q: "İşinn komisyon alıyor mu?", a: "Hayır. Hizmet verenler sabit üyelik ücreti öder, kazandıkları işten komisyon ödemez. Üyelik 20 Aralık 2026'ya kadar ücretsizdir." },
];

export default function HakkimizdaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${URL}#page`,
        url: URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "tr",
        dateModified: UPDATED,
        isPartOf: { "@type": "WebSite", name: "İşinn", url: BASE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "İşinn", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Hakkımızda", item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-4" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Hakkımızda
        </nav>
        <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>İşinn Nedir? Ne Yapar, Ne Yapmaz</h1>
        <p className="text-base mb-3" style={{ color: "#374151" }}>
          <b>Kısa cevap:</b> İşinn, becerini fark edip hizmet vitrinine dönüştürmene ve yakınındaki hizmetleri bulmana yardım eden bir hizmet keşif platformudur. Komisyon almaz, ödemeye aracılık etmez, ürün satmaz.
        </p>
        <p className="text-xs mb-8" style={{ color: "#6B7280" }}>Son güncelleme: 4 Ekim 2026</p>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Kimler için?</h2>
        <p className="text-sm mb-8" style={{ color: "#374151" }}>
          Öncelikle üç gruba destek olmak için kurduk: çalışan annelere, evden bir şeyler yapıp şirket kurmadan “nasıl görünür olabilirim” diyen ev kadınlarına ve okurken gelire ihtiyacı olan gençlere. İşini fotoğraf ve videoyla göstermek isteyen gerçek profesyoneller ve hizmet arayan herkes de İşinn'i kullanabilir. İşinn'i kullanmak için 18 yaşından büyük olmak gerekir.
        </p>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Nasıl çalışır?</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-8 text-sm" style={{ color: "#374151" }}>
          <li><b>Becerini keşfet.</b> <Link href="/yetenegini-farket" style={{ color: "#2563EB" }}>Yeteneğini Farket</Link> ile ne sunabileceğini bul ya da doğrudan vitrinini oluştur.</li>
          <li><b>Vitrinini yayınla.</b> Başlık, açıklama ve fotoğraflarla hizmetini tanıt; yayın otomatik değildir, karar senindir.</li>
          <li><b>Müşteriyle doğrudan görüş.</b> Ücret, ödeme ve iptal koşulları senin ve müşterinin arasındadır.</li>
        </ol>

        <div className="grid gap-4 mb-8 sm:grid-cols-2">
          <div className="rounded-2xl p-4" style={{ background: "#F0FDF4" }}>
            <h2 className="font-sans text-base font-black mb-2" style={{ color: "#166534" }}>İşinn ne yapar?</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm" style={{ color: "#374151" }}>{DOES.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "#FEF3C7" }}>
            <h2 className="font-sans text-base font-black mb-2" style={{ color: "#92400E" }}>İşinn ne yapmaz?</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm" style={{ color: "#374151" }}>{DOESNT.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
        </div>

        <h2 className="font-sans text-xl font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
        <div className="space-y-5 mb-8">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</h3>
              <p className="text-sm" style={{ color: "#4B5563" }}>{f.a}</p>
            </div>
          ))}
        </div>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Şirket bilgileri</h2>
        <p className="text-sm mb-2" style={{ color: "#374151" }}>İşinn, {COMPANY.legalName} markasıdır.</p>
        <ul className="text-sm space-y-1 mb-8" style={{ color: "#374151" }}>
          <li>Adres: {COMPANY.address}</li>
          <li>Telefon: {COMPANY.phone}</li>
          <li>E-posta: {COMPANY.email}</li>
        </ul>

        <div className="flex flex-wrap gap-4 text-sm font-bold" style={{ color: "#2563EB" }}>
          <Link href="/rehber">Rehberler</Link>
          <Link href="/yetenegini-farket">Yeteneğini Farket</Link>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>
          <Link href="/kullanim-sartlari">Kullanım Şartları</Link>
        </div>
      </div>
    </>
  );
}
