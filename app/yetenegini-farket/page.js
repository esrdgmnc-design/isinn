import Link from "next/link";
import TalentTryBox from "../../components/TalentTryBox";
import { jsonLdString } from "../../lib/jsonLd";

// Yeteneğini Farket artık Google'ın tarayabileceği gerçek bir sayfaya sahip (eskiden
// yalnızca uygulama içinde, ?view=talentDiscovery ile açılıyordu). Sayfadaki her
// iddia platformun gerçek durumuna dayanır: ürün mağazası yok, ödemeye aracılık
// edilmez, kazanç/talep garantisi verilmez. SSS görünür olarak yazılır ve aynı
// metin FAQPage şemasına da konur (görünmeyen içerik şemaya konmaz).
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/yetenegini-farket`;
const TITLE = "Becerilerimi Nasıl Değerlendirebilirim? Yeteneğini Farket | İşinn";
const DESCRIPTION = "Ne iş yapabileceğini bilmiyorsan becerilerini yaz: yapay zekâ 1-2 hizmet fikri ve hazır vitrin taslağı önersin. Denemek için üyelik gerekmez, komisyon yok.";

// Beceriden hizmete somut örnekler. Hepsi gerçek İşinn kategorilerine bağlanır;
// kazanç ya da talep iddiası içermez, "örnek" olduğu açıktır.
const EXAMPLES = [
  { skill: "Yemek yapmayı seviyorum", ideas: [["Ev yemeği ve ikram hazırlama", "yemek"], ["Küçük davetler için organizasyon", "etkinlik-organizatoru"]] },
  { skill: "Çocuklarla vakit geçirmeyi seviyorum", ideas: [["Oyun ve etkinlik desteği", "oyun-ablasi"], ["Belirli saatlerde çocuk bakımı", "bakici"]] },
  { skill: "Dikiş ve örgü yapıyorum", ideas: [["Onarım ve düzeltme hizmeti", "terzi"], ["Kişiye özel dikiş çalışması", "moda-tekstil-tasarim"], ["Küçük grup atölyesi", "egitmen"]] },
  { skill: "Düzenli ve planlıyım", ideas: [["Uzaktan takvim ve randevu düzeni", "sanal-asistan"], ["Doğum günü ve küçük etkinlik planlama", "etkinlik-organizatoru"]] },
  { skill: "Telefonla fotoğraf ve video çekiyorum", ideas: [["İşletmeler için fotoğraf çekimi", "profesyonel-fotograf"], ["Kısa video düzenleme", "video-duzenleme"]] },
  { skill: "Bir şeyi anlatmayı seviyorum", ideas: [["Bire bir özel ders", "ogretmen"], ["Hobi ve beceri dersi", "egitmen"]] },
  { skill: "Yazı yazıyor, yabancı dil biliyorum", ideas: [["İçerik yazarlığı", "icerik-yazarligi"], ["Çeviri", "ceviri"]] },
];

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "İşinn", locale: "tr_TR", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    q: "Ne iş yapabilirim?",
    a: "Gündelik yaptığın şeylerden başlayabilirsin: yemek yapmak, çocuklarla ilgilenmek, düzenli olmak, dikiş-örgü, telefonla fotoğraf-video çekmek gibi. Becerini, ayırabileceğin zamanı ve çalışma tercihini yazdığında araç 1-2 hizmet fikri (ders, atölye, organizasyon, uzaktan destek gibi) ve her biri için hazır bir vitrin taslağı önerir. Öneriler garanti değil, başlangıç noktasıdır.",
  },
  {
    q: "Becerilerimi nasıl değerlendirebilirim?",
    a: "Üç soruya cevap ver: Bunu kim ister? Nerede ve ne kadar sürede yaparım? İlk örneğimi nasıl gösteririm? Yeteneğini Farket bu soruları senin yazdıklarından düzenler, ilk vitrin başlığını ve açıklamasını önerir; sana ait olmayan bir bilgiyi taslağa eklemez.",
  },
  {
    q: "Yeteneğini Farket nedir?",
    a: "Ne sunabileceğini bilmeyenlere, anlattığı becerilerden yola çıkarak 1-2 hizmet fikri ve her biri için hazır bir vitrin taslağı öneren, yapay zekâ destekli bir araçtır. Öneriler kesin bir kazanç ya da iş garantisi değil, başlangıç noktasıdır.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>

        <h1 className="font-sans text-3xl font-black mt-4 mb-3" style={{ color: "#0F1115" }}>
          Yeteneğini Farket: Becerilerinden Hizmet Fikirleri Al
        </h1>
        <p className="text-base mb-6" style={{ color: "#374151" }}>
          Ne sunabileceğini bilmiyor musun? Gündelik yaptığın şeylerden birkaçına dokun ya da kendi cümlenle yaz; İşinn sana 1-2 hizmet fikri ve her biri için düzenleyebileceğin hazır bir vitrin taslağı önersin. Aracı denemek için üyelik gerekmez.
        </p>
        <TalentTryBox />

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Örnek bir sonuç nasıl görünür?</h2>
        <p className="text-xs mb-3" style={{ color: "#6B7280" }}>Aşağıdaki, aracın gerçek bir denemede verdiği sonuçtur. Sen farklı yazarsan farklı fikirler çıkar; öneriler bir başlangıç noktasıdır.</p>
        <div className="rounded-2xl p-4 mb-4" style={{ background: "#F7F7F8" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>Yazılan: “Telefonla fotoğraf çekmeyi ve video düzenlemeyi seviyorum”</p>
          <p className="text-xs" style={{ color: "#6B7280" }}>Haftada 8 saat · evden/uzaktan</p>
        </div>
        <div className="space-y-3 mb-10">
          {[
            { cat: "Video Düzenleme", offer: "Telefon Çekimlerinden Kısa Video Kurgusu", words: "video düzenlemeyi seviyorum", reason: "Telefon videolarını düzenleyebildiğini söylediğin için, bir esnafın tanıtım klibini ya da bir etkinlik anısını kurgulamak gibi somut işlerle vitrini açtığında sana ulaşmak isteyen biri olabilir.", step: "Daha önce düzenlediğin bir videoyu vitrin açıklamasının yanına örnek olarak ekle." },
            { cat: "Profesyonel Fotoğraf", offer: "Telefon ile Yaratıcı Fotoğraf Çekimi", words: "", reason: "Telefon fotoğrafçılığını sevdiğini belirttiğin için, çektiğin yemek, mekân ya da portre fotoğraflarından birkaçını vitrine koyarsan bu konuda fotoğrafçı arayan biri sana ulaşabilir.", step: "Telefonunla çektiğin en iyi birkaç fotoğrafı seçip vitrin taslağına yükle." },
          ].map((c) => (
            <div key={c.cat} className="rounded-2xl p-4" style={{ border: "1px solid #F0F0F0" }}>
              <p className="text-sm font-black mb-1" style={{ color: "#0F1115" }}>{c.cat}</p>
              <p className="text-sm font-bold mb-1.5" style={{ color: "#16321F" }}>İlk teklifin: {c.offer}</p>
              {c.words && <p className="text-xs mb-1.5 italic" style={{ color: "#374151" }}>Senin sözlerin: “{c.words}”</p>}
              <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{c.reason}</p>
              <p className="text-xs rounded-xl px-3 py-2" style={{ background: "#F0FDF4", color: "#166534" }}><b>Bu hafta ilk adım:</b> {c.step}</p>
            </div>
          ))}
        </div>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Ne iş yapabilirim? Beceriden hizmete örnekler</h2>
        <p className="text-sm mb-4" style={{ color: "#374151" }}>
          Çoğumuz gündelik yaptığımız şeyleri beceri olarak görmüyoruz. Aşağıdakiler, bir beceriyi hizmete çevirmenin örnekleridir; garanti ya da kazanç vaadi değil, düşünmeye başlamak için bir listedir. Kendi cümlenle yazdığında araç sana özel örnekler çıkarır.
        </p>
        <div className="space-y-3 mb-10">
          {EXAMPLES.map((e) => (
            <div key={e.skill} className="rounded-2xl p-4" style={{ background: "#F7F7F8" }}>
              <p className="text-sm font-bold mb-1.5" style={{ color: "#0F1115" }}>“{e.skill}” diyorsan:</p>
              <ul className="list-disc pl-5 text-sm space-y-1" style={{ color: "#374151" }}>
                {e.ideas.map(([label, slug]) => (
                  <li key={label}><Link href={`/kategori/${slug}`} style={{ color: "#2563EB" }}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Becerilerimi nasıl değerlendirebilirim?</h2>
        <p className="text-sm mb-3" style={{ color: "#374151" }}>Bir beceriyi hizmete çevirip çeviremeyeceğini anlamak için kendine şu üç soruyu sor:</p>
        <ol className="list-decimal pl-5 space-y-2 mb-4 text-sm" style={{ color: "#374151" }}>
          <li><b>Bunu kim ister?</b> Çevrende bu işe ihtiyaç duyan biri var mı (komşu, veli, küçük bir işletme)? Somut bir kişi düşünebiliyorsan başlangıç iyidir.</li>
          <li><b>Nerede, ne kadar sürede yaparım?</b> Haftada kaç saat ayırabileceğini ve evden mi, yüz yüze mi çalışmak istediğini baştan netleştir.</li>
          <li><b>İlk örneğimi nasıl gösteririm?</b> Daha önce yaptığın bir iş, fotoğraf ya da kısa bir anlatım vitrinin ilk kanıtı olur.</li>
        </ol>
        <p className="text-sm mb-10" style={{ color: "#374151" }}>
          Detaylı anlatım için <Link href="/rehber/becerilerimi-nasil-degerlendirebilirim" style={{ color: "#2563EB" }}>becerini değerlendirme rehberine</Link> ve ilk vitrinini yazmak için <Link href="/rehber/ilk-vitrinini-nasil-hazirlarsin" style={{ color: "#2563EB" }}>ilk vitrin hazırlama rehberine</Link> bakabilirsin.
        </p>

        <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>Nasıl çalışır?</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-10 text-sm" style={{ color: "#374151" }}>
          <li><b>Becerilerini anlat.</b> Hazır seçeneklere dokun ya da kendi cümlenle yaz. İstersen haftalık süreni, bütçeni ve nasıl çalışmak istediğini de belirt.</li>
          <li><b>1-2 fikri incele.</b> Her fikirde neden sana uygun olabileceğini anlatan bir cümle ve ilk teklifin olabilecek bir başlık gelir. Uygun değilse nedenini seç, yeni fikirler iste.</li>
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
          <Link href="/rehber/evden-ders-ve-atolye-vermek">Evden ders ve atölye</Link>
          <Link href="/rehber/calisan-anneler-icin-esnek-hizmet-fikirleri">Çalışan anneler için fikirler</Link>
          <Link href="/rehber/gencler-icin-teknolojik-hizmet-fikirleri">Gençler için fikirler</Link>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>
        </div>
      </div>
    </>
  );
}
