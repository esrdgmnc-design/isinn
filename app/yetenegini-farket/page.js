import Link from "next/link";

// Yeteneğini Farket artık Google'ın tarayabileceği gerçek bir sayfaya sahip (eskiden
// yalnızca uygulama içinde, ?view=talentDiscovery ile açılıyordu). Sayfadaki her
// iddia platformun gerçek durumuna dayanır: ürün mağazası yok, ödemeye aracılık
// edilmez, kazanç/talep garantisi verilmez. SSS görünür olarak yazılır ve aynı
// metin FAQPage şemasına da konur (görünmeyen içerik şemaya konmaz).
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/yetenegini-farket`;
const TITLE = "Yeteneğini Farket: Hangi Becerinle Gelir Elde Edebilirsin? | İşinn";
const DESCRIPTION = "Ne sunabileceğini bilmiyorsan, birkaç dokunuşla becerilerinden 2-3 hizmet fikri ve hazır bir vitrin taslağı al. Aracı denemek için üyelik gerekmez; İşinn komisyon almaz.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "İşinn", locale: "tr_TR", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    q: "Yeteneğini Farket nedir?",
    a: "Ne sunabileceğini bilmeyenlere, anlattığı becerilerden yola çıkarak 2-3 hizmet fikri ve her biri için hazır bir vitrin taslağı öneren, yapay zekâ destekli bir araçtır. Öneriler kesin bir kazanç ya da iş garantisi değil, başlangıç noktasıdır.",
  },
  {
    q: "Aracı kullanmak ücretli mi?",
    a: "Aracı denemek için üyelik ya da giriş gerekmez. Vitrin yayınlamak için hesap açılır. İşinn kazandığın işten komisyon almaz; hizmet verenler sabit üyelik öder ve üyelik 20 Aralık 2026'ya kadar ücretsizdir.",
  },
  {
    q: "Hiçbir yeteneğim yok, ne yapabilirim?",
    a: "Çoğu insan gündelik yaptığı şeyleri beceri olarak görmez. Araç, yemek yapmak, çocuklarla ilgilenmek, düzenli olmak, dikiş-örgü gibi gündelik işlerden tek dokunuşla seçim yapmana izin verir; yazdıklarından anlamlı bir fikir çıkmazsa sana bunu söyler ve biraz daha anlatmanı ister.",
  },
  {
    q: "Evden ne iş yapabilirim?",
    a: "Çalışma tercihini (evden/uzaktan, yüz yüze ya da fark etmez) araca söyleyebilirsin. Yazı yazma, çeviri, tasarım gibi uzaktan yapılabilen hizmetler ya da evden verilebilen ders ve danışmanlık gibi seçenekler, yazdıklarına göre öne çıkabilir. Öneriler garanti değildir.",
  },
  {
    q: "Örgü ile para kazanılır mı?",
    a: "Bunun garantisini veremeyiz. İşinn ürün satılan bir yer değil, hizmetlerin keşfini kolaylaştıran bir platformdur; bu yüzden ürün satışı yapılmaz. Ama örgü gibi bir beceriyi hizmet olarak sunabilirsin: ders ya da atölye, onarım-düzeltme, kişiye özel çalışma gibi.",
  },
  {
    q: "İşinn'de ürün satabilir miyim?",
    a: "Hayır. İşinn hizmetlerin keşfini kolaylaştıran bir platformdur; ürün satışı yapılmaz ve ürün satışına yönlendirme yapılmaz (mağaza, sepet ya da kargo yoktur). Becerini hizmet olarak sunmak istersen vitrin açabilirsin.",
  },
  {
    q: "Şirketim yok, hizmet sunabilir miyim?",
    a: "İşinn'de bireysel olarak vitrin açabilirsin. Vergi ve yasal yükümlülüklerin durumuna göre değişir; bu sayfa yasal ya da mali tavsiye değildir, kesin bilgi için Gelir İdaresi Başkanlığı'nın resmi kaynaklarına ve bir mali müşavire danış.",
  },
  {
    q: "Verilerim nasıl kullanılıyor?",
    a: "Yazdıkların, öneri üretebilmek için yapay zekâ hizmetine gönderilir; telefon, e-posta, TC kimlik ve IBAN gibi kişisel tanımlayıcılar göndermeden önce maskelenir. Cevapların, \"hesabıma kaydet\" kutusunu işaretlemediğin sürece hesabına kaydedilmez ve istediğin zaman silebilirsin. Ayrıntılar için Gizlilik Politikası ve KVKK Aydınlatma Metni'ne bak.",
  },
];

export default function YeteneginiFarketPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${URL}#page`,
        url: URL,
        name: "Yeteneğini Farket: Becerilerinden hizmet fikirleri al",
        description: DESCRIPTION,
        inLanguage: "tr",
        isPartOf: { "@type": "WebSite", name: "İşinn", url: BASE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "İşinn", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Yeteneğini Farket", item: URL },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>

        <h1 className="font-sans text-3xl font-black mt-4 mb-3" style={{ color: "#0F1115" }}>
          Yeteneğini Farket: Becerilerinden Hizmet Fikirleri Al
        </h1>
        <p className="text-base mb-6" style={{ color: "#374151" }}>
          Ne sunabileceğini bilmiyor musun? Gündelik yaptığın şeylerden birkaçına dokun ya da kendi cümlenle yaz; İşinn sana 2-3 hizmet fikri ve her biri için düzenleyebileceğin hazır bir vitrin taslağı önersin. Aracı denemek için üyelik gerekmez.
        </p>
        <Link
          href="/?view=talentDiscovery"
          className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white mb-10"
          style={{ background: "#2563EB" }}
        >
          İlham Al
        </Link>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Nasıl çalışır?</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-10 text-sm" style={{ color: "#374151" }}>
          <li><b>Becerilerini anlat.</b> Hazır seçeneklere dokun ya da kendi cümlenle yaz. İstersen haftalık süreni, bütçeni ve nasıl çalışmak istediğini de belirt.</li>
          <li><b>2-3 fikri incele.</b> Her fikirde neden sana uygun olabileceğini anlatan bir cümle ve ilk teklifin olabilecek bir başlık gelir. Uygun değilse nedenini seç, yeni fikirler iste.</li>
          <li><b>Taslağı düzenleyip yayınla.</b> Seçtiğin fikir için başlık ve açıklama hazır gelir; sana ait olmayan her şeyi düzeltip vitrinini yayına alırsın. Yayın otomatik değildir, karar senindir.</li>
        </ol>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Neleri yapmaz?</h2>
        <ul className="list-disc pl-5 space-y-2 mb-10 text-sm" style={{ color: "#374151" }}>
          <li>Kazanç ya da talep tahmini vermez, iş garantisi sunmaz.</li>
          <li>Avukatlık, hemşirelik gibi lisans ya da belge gerektiren meslekleri önermez.</li>
          <li>Taslakta senin yazmadığın deneyim, sertifika ya da fiyat bilgisi uydurmaz.</li>
          <li>Ürün mağazası değildir: İşinn bir hizmet pazaryeridir, ödemeye aracılık etmez.</li>
        </ul>

        <h2 className="font-sans text-xl font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
        <div className="space-y-5 mb-10">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</h3>
              <p className="text-sm" style={{ color: "#4B5563" }}>{f.a}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-bold" style={{ color: "#2563EB" }}>
          <Link href="/rehber">Rehberler</Link>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>
        </div>
      </div>
    </>
  );
}
