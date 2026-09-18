import Link from "next/link";
import { notFound } from "next/navigation";
import { REHBER_POSTS, findRehberPost } from "../../../lib/rehberContent";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/rehber/${post.slug}`,
    publisher: { "@type": "Organization", name: "İşinn", url: BASE_URL },
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

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <Link href="/rehber" className="text-sm font-bold" style={{ color: "#2563EB" }}>← Rehberler</Link>
        <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-6" style={{ color: "#0F1115" }}>{post.title}</h1>
        <div
          className="text-sm leading-relaxed rehber-body"
          style={{ color: "#374151" }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
        <Link
          href={post.ctaHref}
          className="inline-block mt-8 text-sm font-bold px-6 py-3 rounded-full text-white"
          style={{ background: "#2563EB" }}
        >
          {post.ctaText}
        </Link>
        <style>{`.rehber-body h2 { font-size: 18px; font-weight: 800; color: #0F1115; margin: 24px 0 8px; } .rehber-body p { margin: 0 0 12px; } .rehber-body ul { margin: 0 0 12px; padding-left: 20px; } .rehber-body li { margin-bottom: 6px; }`}</style>
      </div>
    </>
  );
}
