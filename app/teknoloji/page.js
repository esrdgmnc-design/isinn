import Link from "next/link";
import { Sparkles, Lightbulb, Search, ScanEye, Bot, ShieldCheck, BadgeCheck, BellRing, Smartphone } from "lucide-react";
import { socialMeta } from "../../lib/seoMeta";
import { jsonLdString } from "../../lib/jsonLd";
import SeoFooter from "../../components/SeoFooter";

// "İşinn'in arkasındaki teknoloji" (2026-11-14). Kurucu: "insanlar sıradan algılıyor, teknik yüksekliğimizi vurgula".
// Kural: her cümle koddaki gerçek davranışa dayanır (kaynak dosya yorumda). "Doğrulanmış", "en iyi", kullanıcı sayısı,
// fiyat yok. Model adı yazılmaz (değişebilir); sağlayıcı Gizlilik Politikası'nda.
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/teknoloji`;
const TITLE = "İşinn Teknolojisi: Yapay Zekâ ile Hizmet Keşfi";
const DESCRIPTION = "İşinn'in arkasındaki teknoloji: derdini kendi cümlenle yazınca uzman bulan yapay zekâ eşleştirmesi, beceriden hizmet fikri çıkaran araç, Claude ve ChatGPT'ye açık arama, gizliliği koruyan altyapı.";
const UPDATED = "2026-11-14";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
};

const FEATURES = [
  {
    // lib/needMatchCore.js, lib/needMatchRun.js, app/api/need-match
    icon: Sparkles,
    tag: "Derdini yaz",
    title: "Derdini yaz, uzmanı o bulsun",
    body: "“Kızım LGS'ye hazırlanıyor, matematikte zorlanıyor” gibi kendi cümlenle yazarsın. Yapay zekâ ne aradığını ve nerede aradığını anlar, sana uygun vitrinleri sıralar. Sonra her öneri kurallarla bir kez daha kontrol edilir: yüz yüze işte başka şehirden kimse çıkmaz, para verip öne çıkmak sırayı etkilemez.",
    href: "/?view=needMatch",
    cta: "Dene",
  },
  {
    // app/api/talent, lib/talentCore.js, app/yetenegini-farket
    icon: Lightbulb,
    tag: "Yeteneğini Farket",
    title: "Beceriden hizmete, hazır vitrin taslağıyla",
    body: "Ne yapmaktan keyif aldığını ve haftada ne kadar vaktin olduğunu yazarsın. Yapay zekâ 1-2 hizmet fikri, bu hafta atacağın ilk adımı ve yayına hazır bir vitrin metni çıkarır. Uymazsa nedenini yazarsın (vaktim yok, yüzümü göstermem…), yenisini önerir.",
    href: "/yetenegini-farket",
    cta: "Dene",
  },
  {
    // components/IsinnApp.jsx feature "search_expand"
    icon: Search,
    tag: "Akıllı arama",
    title: "Kelime tutmasa da sonuç bulur",
    body: "Yazdığın kelimeyle birebir uyan vitrin yoksa arama boş dönmez: yapay zekâ ne aradığını anlar, ilgili alanlara bakar ve yakın sonuçları getirir.",
  },
  {
    // app/api/listing-photo-check + supabase/listing_photo_moderation.sql (trigger)
    icon: ScanEye,
    tag: "Fotoğraf kontrolü",
    title: "Her fotoğraf yayından önce kontrol edilir",
    body: "Vitrine yüklenen her fotoğraf yapay zekâ ile kontrol edilir. Kontrolden geçmeyen fotoğraf vitrine eklenemez; bu kontrol atlanamaz.",
  },
  {
    // app/api/mcp/route.js
    icon: Bot,
    tag: "Asistanına da sor",
    title: "Claude ve ChatGPT, İşinn'de arama yapabilir",
    body: "Claude ya da ChatGPT gibi yapay zekâ asistanları İşinn'e bağlanabilir. Asistana “İstanbul'da matematik öğretmeni bul” dersen sonuçlar İşinn vitrinlerinden, bağlantılarıyla gelir. Yalnızca vitrinde zaten herkese açık olan bilgiler paylaşılır.",
    href: "/yapay-zeka-araci",
    cta: "Nasıl bağlanır",
  },
  {
    // lib/piiScrub.js, lib/needMatchCore.js
    icon: ShieldCheck,
    tag: "Gizlilik",
    title: "Kişisel bilgi yapay zekâya gitmez",
    body: "Telefon, e-posta, T.C. kimlik numarası ve IBAN, yapay zekâya gitmeden yazından silinir. Aramada yazdığın metin saklanmaz. Sağlıkla ilgili bir şey yazarsan metin yapay zekâya hiç gönderilmez, yalnızca kurallarla aranır. Yapay zekânın kendi yazdığı cümleler sana sonuç diye gösterilmez.",
  },
  {
    // supabase/two_sided_confirmation_2026_10_05.sql, delivery_dispute_2026_10_16.sql
    icon: BadgeCheck,
    tag: "İki taraflı onay",
    title: "“İş yapıldı” bilgisini iki taraf da onaylar",
    body: "İş bitince hizmet alan da hizmet veren de onay verir; onayların zamanı kaydedilir. İkisi de onaylarsa yorumda “İki taraf da onayladı” yazar, biri itiraz ederse bu yazı kalkar.",
  },
  {
    // features list D.51
    icon: BellRing,
    tag: "Aramayı kaydet",
    title: "Aradığın kişi gelince haber verir",
    body: "Aramanı kaydedersin; sonradan bu aramaya uyan yeni bir vitrin açıldığında bildirim alırsın. Tekrar tekrar bakman gerekmez.",
  },
  {
    // COMPANY.appStoreUrl / playStoreUrl
    icon: Smartphone,
    tag: "Her yerde",
    title: "Web, iOS ve Android",
    body: "Aynı hesapla tarayıcıdan, App Store'daki iPhone uygulamasından ya da Google Play'deki Android uygulamasından kullanırsın. Türkçe ve İngilizce.",
  },
];

const LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: URL,
  dateModified: UPDATED,
  inLanguage: "tr-TR",
  isPartOf: { "@type": "WebSite", name: "İşinn", url: BASE_URL },
};

export default function TechnologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(LD) }} />
      <div className="max-w-6xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-5" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Teknoloji
        </nav>

        <section className="rounded-3xl px-6 sm:px-10 py-10 sm:py-14" style={{ background: "#0B0B0F" }}>
          <p className="text-xs tracking-[0.2em] uppercase font-bold mb-3" style={{ color: "#3B82F6" }}>Teknoloji</p>
          <h1 className="font-sans text-3xl sm:text-5xl font-black tracking-tight mb-4 max-w-3xl" style={{ color: "#FFFFFF" }}>
            İhtiyacın olan kişiyi bulmana yapay zekâ yardım eder
          </h1>
          <p className="text-base sm:text-lg max-w-2xl leading-relaxed" style={{ color: "#A1A1AA" }}>
            Ne aradığını kendi cümlenle yazarsın. Yapay zekâ ne istediğini anlar, uymayanları eler ve sana uygun kişileri gösterir. Kişisel bilgilerin yapay zekâya gitmez.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/?view=needMatch" className="text-sm font-bold px-5 py-3 rounded-full text-white" style={{ background: "#2563EB" }}>Uzman bul</Link>
            <Link href="/yetenegini-farket" className="text-sm font-bold px-5 py-3 rounded-full" style={{ border: "1px solid #3F3F46", color: "#FFFFFF" }}>Ne iş yapabilirim?</Link>
          </div>
        </section>

        <h2 className="font-sans text-2xl sm:text-3xl font-black tracking-tight mt-14 mb-6" style={{ color: "#0F1115" }}>Neler çalışıyor?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.tag} className="rounded-2xl p-6 flex flex-col" style={{ border: "1px solid #E4E4E7", background: "#FFFFFF" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#0F1115" }}>
                  <Icon size={18} className="text-white" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#2563EB" }}>{f.tag}</p>
                <h3 className="font-sans text-lg font-black leading-snug mb-2" style={{ color: "#0F1115" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#374151" }}>{f.body}</p>
                {f.href && (
                  <Link href={f.href} className="text-sm font-bold mt-4" style={{ color: "#2563EB" }}>{f.cta} →</Link>
                )}
              </article>
            );
          })}
        </div>

        <section className="mt-14 max-w-3xl">
          <h2 className="font-sans text-2xl sm:text-3xl font-black tracking-tight mb-4" style={{ color: "#0F1115" }}>Yapay zekâ neye karar vermez?</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed" style={{ color: "#374151" }}>
            <li>Kiminle çalışacağına sen karar verirsin. Yapay zekâ öneri sunar, seçimi ve anlaşmayı taraflar kendi aralarında yapar.</li>
            <li>Sırayı para belirlemez: ücretli öne çıkarma bu sıralamada hesaba katılmaz.</li>
            <li>Yapay zekânın önerileri iş, kazanç ya da hizmet kalitesi sözü değildir. İşinn ödemeye aracılık etmez.</li>
            <li>Hangi verinin nasıl işlendiği: <Link href="/gizlilik-politikasi" style={{ color: "#2563EB" }}>Gizlilik Politikası</Link> ve <Link href="/kvkk-aydinlatma-metni" style={{ color: "#2563EB" }}>KVKK Aydınlatma Metni</Link>.</li>
          </ul>
          <p className="text-sm mt-6" style={{ color: "#374151" }}>
            Daha fazlası için: <Link href="/rehber/yapay-zeka-ile-hizmet-veren-nasil-bulunur" style={{ color: "#2563EB" }}>Yapay zekâ ile doğru hizmet veren nasıl bulunur?</Link>
          </p>
          <p className="text-xs mt-6" style={{ color: "#6B7280" }}>Son güncelleme: 14 Kasım 2026</p>
        </section>
      </div>
      <SeoFooter />
    </>
  );
}
