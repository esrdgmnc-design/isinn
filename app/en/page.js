import Link from "next/link";
import { REHBER_POSTS } from "../../lib/rehberContent";
import { jsonLdString } from "../../lib/jsonLd";
import { socialMeta } from "../../lib/seoMeta";
import { COMPANY } from "../../lib/companyInfo";

// İngilizce ana sayfa (2026-10-19, yurt dışı hazırlığı): Google'ın İngilizce sürümü görebilmesi için sunucuda üretilen
// tek sayfa. Türkçe ana sayfayla hreflang ile bağlı (app/page.js). Vitrinlerin /en kopyası BİLEREK yok (Türkçe kullanıcı
// metni = kopya içerik). Reklam/aktif hedefleme yok: belirli ülke anılmaz. Her cümle platformun gerçek durumuna dayanır.
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/en`;
const TITLE = "İşinn | Find Freelancers and Services, Open Your Showcase";
const DESCRIPTION = "İşinn is a commission-free service discovery platform based in Turkey. Freelancers and service providers open a showcase; clients browse and message them directly.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL, languages: { tr: `${BASE_URL}/`, en: URL, "x-default": `${BASE_URL}/` } },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL, locale: "en_US" }),
};

const FAQ = [
  { q: "What is İşinn?", a: "İşinn is a service discovery platform based in Turkey. Freelancers and service providers open a showcase with work samples, a description and pricing, and people looking for help browse showcases and message providers directly." },
  { q: "Does İşinn take a commission?", a: "No. İşinn takes no commission and does not handle payments between users. Clients and providers agree on scope and payment between themselves." },
  { q: "Is it free?", a: "Browsing and messaging are free for clients. Providers can open showcases for free during the launch period, until 1 January 2027; after that a fixed membership applies, still with no commission." },
  { q: "Can I use İşinn in English?", a: "Yes. Use the EN switch at the top of the site. Many showcases are written in Turkish by their providers; you can write your message in English and ask whether the provider is comfortable working in English." },
  { q: "What does the “Verified” badge mean?", a: "It only means the provider's phone number was verified by SMS. It is not an identity, document or service quality check. Look at the showcase and reviews before deciding." },
];

export default function EnglishHomePage() {
  const guides = REHBER_POSTS.filter((p) => p.lang === "en");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${URL}#page`, url: URL, name: TITLE, description: DESCRIPTION, inLanguage: "en", isPartOf: { "@id": `${BASE_URL}/#website` } },
      { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
  const h2 = "font-sans text-xl font-black mb-3";
  return (
    <main lang="en">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Language" className="text-xs mb-6 flex justify-between" style={{ color: "#6B7280" }}>
          <span className="font-black text-base" style={{ color: "#0F1115" }}>İşinn<span style={{ color: "#2563EB" }}>.</span></span>
          <Link href="/" hrefLang="tr" style={{ color: "#2563EB" }}>Türkçe</Link>
        </nav>
        <h1 className="font-sans text-3xl sm:text-4xl font-black mb-3 tracking-tight" style={{ color: "#0F1115" }}>Find the right freelancer. Showcase your talent.</h1>
        <p className="text-base mb-6" style={{ color: "#374151" }}>
          İşinn is a commission-free service discovery platform based in Turkey. Freelancers and service providers open a showcase; people looking for help browse showcases and message them directly.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/" className="px-5 py-2.5 rounded-full text-sm font-bold text-white" style={{ background: "#2563EB" }}>Browse showcases</Link>
          <Link href="/?view=createListing" className="px-5 py-2.5 rounded-full text-sm font-bold" style={{ border: "1px solid #0F1115", color: "#0F1115" }}>Open your showcase</Link>
        </div>

        <h2 className={h2} style={{ color: "#0F1115" }}>How it works</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-8 text-sm" style={{ color: "#374151" }}>
          <li><b>Providers open a showcase</b> for one service, with work samples, a description and pricing. Remote freelance work (software, design, translation, consulting) and local services are both welcome.</li>
          <li><b>Clients browse or describe what they need</b> and message providers directly. Phone numbers stay private.</li>
          <li><b>Both sides agree between themselves</b> on scope, timing and payment. When the job is done, both can confirm it on the site.</li>
        </ol>

        <h2 className={h2} style={{ color: "#0F1115" }}>Not sure what you could offer?</h2>
        <p className="text-sm mb-8" style={{ color: "#374151" }}>
          The AI-assisted <Link href="/yetenegini-farket" style={{ color: "#2563EB" }}>Discover Your Talent</Link> tool suggests service ideas and a showcase draft from the skills you describe. Suggestions are a starting point, not a guarantee of work or income.
        </p>

        {guides.length > 0 && (
          <>
            <h2 className={h2} style={{ color: "#0F1115" }}>Guides in English</h2>
            <ul className="space-y-2 mb-8 text-sm">
              {guides.map((g) => (
                <li key={g.slug}><Link href={`/rehber/${g.slug}`} hrefLang="en" style={{ color: "#2563EB" }}>{g.title}</Link></li>
              ))}
            </ul>
          </>
        )}

        <h2 className={h2} style={{ color: "#0F1115" }}>Frequently asked questions</h2>
        <div className="space-y-5 mb-10">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</h3>
              <p className="text-sm" style={{ color: "#4B5563" }}>{f.a}</p>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: "#6B7280" }}>
          İşinn is a brand of {COMPANY.legalName} (Turkey). Legal texts are available in Turkish:{" "}
          <Link href="/kullanim-sartlari" hrefLang="tr" style={{ color: "#2563EB" }}>Terms</Link> ·{" "}
          <Link href="/gizlilik-politikasi" hrefLang="tr" style={{ color: "#2563EB" }}>Privacy</Link>
        </p>
      </div>
    </main>
  );
}
