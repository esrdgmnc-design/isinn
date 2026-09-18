import Link from "next/link";
import { REHBER_POSTS } from "../../lib/rehberContent";

const BASE_URL = "https://www.isinn.com.tr";

export const metadata = {
  title: "Rehberler — İşinn",
  description: "Hizmet alırken ya da verirken işine yarayacak pratik rehberler: temizlik, özel ders ve daha fazlası.",
  alternates: { canonical: `${BASE_URL}/rehber` },
};

export default function RehberIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Link href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</Link>
      <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-8" style={{ color: "#0F1115" }}>Rehberler</h1>
      <div className="flex flex-col gap-4">
        {REHBER_POSTS.map((post) => (
          <Link key={post.slug} href={`/rehber/${post.slug}`} className="block rounded-2xl p-5" style={{ border: "1px solid #F0F0F0" }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#0F1115" }}>{post.title}</h2>
            <p className="text-sm" style={{ color: "#6B7280" }}>{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
