import Link from "next/link";
import { notFound } from "next/navigation";
import { REHBER_POSTS, findRehberPost, rehberMeta } from "../../../lib/rehberContent";
import { jsonLdString } from "../../../lib/jsonLd";

const BASE_URL = "https://www.isinn.com.tr";

export function generateStaticParams() {
  return REHBER_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = findRehberPost(params.slug);
  if (!post) return { title: "Rehber bulunamadı — İşinn" };
  const url = `${BASE_URL}/rehber/${post.slug}`;
  return {
    title: `${post.title} — İşinn`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, url, siteName: "İşinn", locale: "tr_TR", type: "article" },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default function RehberPostPage({ params }) {
  const post = findRehberPost(params.slug);
  if (!post) notFound();

  // Yazılar birbirine hiç link vermiyordu — her biri kendi kategorisine tek
  // yönlü bir CTA veriyordu, aralarında iç link akışı yoktu. Aynı kategoriden
  // başlayıp gerekirse diğerleriyle 3'e tamamlayan basit bir "ilgili rehber"
  // listesi, hem kullanıcıyı sitede tutuyor hem de rehber sayfalarının
  // birbirine PageRank/keşif değeri aktarmasını sağlıyor.
  const sameCategory = REHBER_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = REHBER_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const relatedPosts = [...sameCategory, ...others].slice(0, 3);

  const meta = rehberMeta(post);
  const fmtDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  // Yazar: kurucunun adı onayıyla eklenene kadar kurum (Organization). Şema, sayfadaki
  // görünür "Hazırlayan" satırıyla aynı bilgiyi taşır.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/rehber/${post.slug}`,
    mainEntityOfPage: `${BASE_URL}/rehber/${post.slug}`,
    inLanguage: "tr",
    datePublished: meta.published,
    dateModified: meta.updated,
    author: { "@type": "Organization", name: "İşinn", url: BASE_URL },
    publisher: { "@type": "Organization", name: "İşinn", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/icons/icon-512.webp` } },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "İşinn", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Rehberler", item: `${BASE_URL}/rehber` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${BASE_URL}/rehber/${post.slug}` },
    ],
  };
  // Bu sayfaya özel SSS şeması — Google'ın "İnsanlar ayrıca soruyor" kutusunda
  // gösterebileceği türden, gerçek ve sayfa içeriğiyle birebir eşleşen sorular
  // (bkz. lib/rehberContent.js'teki faq alanı). Sitedeki her sayfaya aynı genel
  // SSS'yi basmak yerine (eskiden layout'ta öyleydi) yalnızca bu yazıyla ilgili
  // sorular, yalnızca bu sayfada.
  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }} />
      )}
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › <Link href="/rehber" style={{ color: "#2563EB" }}>Rehberler</Link> › <span>{post.title}</span>
        </nav>
        <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-2" style={{ color: "#0F1115" }}>{post.title}</h1>
        <p className="text-xs mb-5" style={{ color: "#6B7280" }}>
          Yayın: {fmtDate(meta.published)} · Güncelleme: {fmtDate(meta.updated)} · Hazırlayan: İşinn
        </p>
        {meta.shortAnswer && (
          <p className="text-sm rounded-xl px-4 py-3 mb-6" style={{ background: "#EFF6FF", color: "#1E3A8A" }}>
            <b>Kısa cevap:</b> {meta.shortAnswer}
          </p>
        )}
        <div
          className="text-sm leading-relaxed rehber-body"
          style={{ color: "#374151" }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
        {post.faq && post.faq.length > 0 && (
          <div className="mt-8 pt-6 border-t" style={{ borderColor: "#E5E7EB" }}>
            <h2 className="font-sans text-lg font-black mb-4" style={{ color: "#0F1115" }}>Sıkça Sorulan Sorular</h2>
            <div className="space-y-4">
              {post.faq.map((f, i) => (
                <div key={i}>
                  <p className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</p>
                  <p className="text-sm" style={{ color: "#4B5563" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Link
          href={post.ctaHref}
          className="inline-block mt-8 text-sm font-bold px-6 py-3 rounded-full text-white"
          style={{ background: "#2563EB" }}
        >
          {post.ctaText}
        </Link>

        {relatedPosts.length > 0 && (
          <div className="mt-10 pt-6 border-t" style={{ borderColor: "#E5E7EB" }}>
            <h2 className="font-sans text-lg font-black mb-4" style={{ color: "#0F1115" }}>İlgini Çekebilir</h2>
            <div className="space-y-3">
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={`/rehber/${p.slug}`} className="block text-sm font-bold" style={{ color: "#2563EB" }}>
                  {p.title} →
                </Link>
              ))}
            </div>
          </div>
        )}
        <style>{`.rehber-body h2 { font-size: 18px; font-weight: 800; color: #0F1115; margin: 24px 0 8px; } .rehber-body p { margin: 0 0 12px; } .rehber-body ul { margin: 0 0 12px; padding-left: 20px; list-style: disc; } .rehber-body ol { margin: 0 0 12px; padding-left: 22px; list-style: decimal; } .rehber-body li { margin-bottom: 6px; } .rehber-body a { color: #2563EB; text-decoration: underline; }`}</style>
      </div>
    </>
  );
}
