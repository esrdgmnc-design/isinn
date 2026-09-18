const BASE_URL = "https://www.isinn.com.tr";
const EMBED_CODE = `<a href="${BASE_URL}" target="_blank" rel="noopener">
  <img src="${BASE_URL}/rozet.svg" alt="İşinn'de Doğrulanmış Sağlayıcı" width="220" height="64" />
</a>`;

export const metadata = {
  title: "Sağlayıcı Rozeti — İşinn",
  description: "İşinn'de vitrin sahibi sağlayıcılar için kendi web sitelerine ya da profillerine ekleyebilecekleri rozet ve gömme kodu.",
  alternates: { canonical: `${BASE_URL}/rozet` },
};

export default function RozetPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <a href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</a>
      <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-2" style={{ color: "#0F1115" }}>
        İşinn'de Doğrulanmış Sağlayıcı Rozeti
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
        İşinn'de aktif bir vitrini olan sağlayıcı mısın? Bu rozeti kendi web sitene, Instagram bio linkine ya da e-posta imzana ekleyerek müşterilerine İşinn'de doğrulanmış olduğunu gösterebilirsin.
      </p>

      <div className="rounded-2xl p-8 flex justify-center mb-8" style={{ border: "1px solid #F0F0F0", background: "#F8F4E9" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/rozet.svg" alt="İşinn'de Doğrulanmış Sağlayıcı" width={220} height={64} />
      </div>

      <h2 className="text-sm font-bold mb-2" style={{ color: "#0F1115" }}>Web sitene eklemek için (HTML)</h2>
      <pre
        className="text-xs p-4 rounded-xl overflow-x-auto mb-8"
        style={{ background: "#0F1115", color: "#EFE8D8" }}
      >{EMBED_CODE}</pre>

      <h2 className="text-sm font-bold mb-2" style={{ color: "#0F1115" }}>Web siten yoksa</h2>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
        Yukarıdaki rozet görselini (rozet.svg) indirip Instagram hikayende ya da gönderinde paylaşabilir, bio linkine isinn.com.tr'yi ya da kendi vitrin linkini ekleyebilirsin.
      </p>

      <a
        href="/?view=profile"
        className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white"
        style={{ background: "#2563EB" }}
      >
        Vitrinime Git
      </a>
    </div>
  );
}
