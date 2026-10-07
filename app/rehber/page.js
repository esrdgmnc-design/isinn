import Link from "next/link";
import { REHBER_POSTS } from "../../lib/rehberContent";
import { jsonLdString } from "../../lib/jsonLd";

const BASE_URL = "https://www.isinn.com.tr";

export const metadata = {
  title: "Rehberler: Beceriden Hizmete, Hizmet Seçerken | İşinn",
  description: "Becerini hizmete çevirmek, ilk vitrinini hazırlamak ve hizmet alırken doğru seçim yapmak için pratik rehberler. Kazanç vaadi içermez.",
  alternates: { canonical: `${BASE_URL}/rehber` },
};

// Rehberler üç konu kümesinde gösterilir. Bir slug burada yoksa "Diğer rehberler"e düşer
// (yeni yazı eklenince sayfa yine hepsini gösterir).
const GROUPS = [
  {
    title: "Beceriden hizmete: nereden başlarım?",
    slugs: [
      "becerilerimi-nasil-degerlendirebilirim",
      "ilk-vitrinini-nasil-hazirlarsin",
      "evden-ders-ve-atolye-vermek",
      "sirket-kurmadan-hizmet-sunmak",
      "calisan-anneler-icin-esnek-hizmet-fikirleri",
      "gencler-icin-teknolojik-hizmet-fikirleri",
      "ek-gelir-ve-freelance-is-yollari",
      "birkac-bin-takipci-ile-yerel-isletmelerden-sponsorluk",
    ],
  },
  {
    title: "Hizmet alırken: nasıl seçerim?",
    slugs: [
      "ev-temizligi-kac-saat-surer",
      "iyi-ozel-ders-ogretmeni-nasil-secilir",
      "lgs-hazirlik-sureci-nasil-planlanir",
      "ev-tadilatinda-usta-secerken-nelere-dikkat-edilmeli",
      "cocuk-bakicisi-secerken-sorulmasi-gereken-sorular",
    ],
  },
];

export default function RehberIndexPage() {
  const bySlug = new Map(REHBER_POSTS.map((p) => [p.slug, p]));
  const used = new Set(GROUPS.flatMap((g) => g.slugs));
  const groups = GROUPS.map((g) => ({ title: g.title, posts: g.slugs.map((s) => bySlug.get(s)).filter(Boolean) }));
  const rest = REHBER_POSTS.filter((p) => !used.has(p.slug) && p.lang !== "en");
  if (rest.length) groups.push({ title: "Diğer rehberler", posts: rest });
  const english = REHBER_POSTS.filter((p) => p.lang === "en");
  if (english.length) groups.push({ title: "Guides in English: finding freelance work", posts: english, lang: "en" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "İşinn Rehberleri",
    url: `${BASE_URL}/rehber`,
    inLanguage: "tr",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: REHBER_POSTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${BASE_URL}/rehber/${p.slug}`, name: p.title })),
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>
      <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-2" style={{ color: "#0F1115" }}>Rehberler</h1>
      <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
        Ne yapabileceğini bilmiyorsan <Link href="/yetenegini-farket" style={{ color: "#2563EB" }}>Yeteneğini Farket</Link> aracını deneyebilirsin.
      </p>
      {groups.map((g) => (
        <section key={g.title} className="mb-10" lang={g.lang}>
          <h2 className="font-sans text-lg font-black mb-3" style={{ color: "#0F1115" }}>{g.title}</h2>
          <div className="flex flex-col gap-4">
            {g.posts.map((post) => (
              <Link key={post.slug} href={`/rehber/${post.slug}`} className="block rounded-2xl p-5" style={{ border: "1px solid #F0F0F0" }}>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#0F1115" }}>{post.title}</h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
