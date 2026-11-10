import CopyText from "../../components/CopyText";

const BASE_URL = "https://www.isinn.com.tr";
// Profildeki "Vitrin araçların" bağlantısı ?vitrin=<id> ile gelir: broşür, Google İşletme Profili linki,
// bio linki ve rozet gömme kodu kişinin kendi vitrinine bağlanır (her kullanım o vitrine bir dış bağlantı
// ya da QR ziyareti olur). Yalnızca UUID kabul edilir. 2026-11-01: rozet sayfası araç sayfasına genişletildi.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function embedCode(vitrinId) {
  const href = vitrinId ? `${BASE_URL}/vitrin/${vitrinId}` : BASE_URL;
  return `<a href="${href}" target="_blank" rel="noopener">
  <img src="${BASE_URL}/rozet.svg" alt="İşinn Sağlayıcısı" width="220" height="64" />
</a>`;
}

export const metadata = {
  title: "Vitrin Araçları — İşinn",
  description: "İşinn'de vitrin sahibi sağlayıcılar için QR'lı broşür, Google İşletme Profili linki, bio linki ve web sitesi rozeti.",
  alternates: { canonical: `${BASE_URL}/rozet` },
  robots: { index: false, follow: true },
};

const H2 = ({ n, children }) => (
  <h2 className="text-base font-black mb-2 flex items-baseline gap-2" style={{ color: "#0F1115" }}>
    <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>{n}</span>{children}
  </h2>
);
const P = ({ children }) => <p className="text-sm mb-3" style={{ color: "#575E6B" }}>{children}</p>;

export default function RozetPage({ searchParams }) {
  const raw = typeof searchParams?.vitrin === "string" ? searchParams.vitrin : "";
  const vitrinId = UUID_RE.test(raw) ? raw : null;
  const vitrinUrl = vitrinId ? `${BASE_URL}/vitrin/${vitrinId}` : null;
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <a href="/" className="text-sm font-bold" style={{ color: "#2563EB" }}>← İşinn</a>
      <h1 className="font-sans text-2xl md:text-3xl font-black mt-4 mb-2" style={{ color: "#0F1115" }}>
        Vitrin araçların
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
        Vitrinin, web siten olmasa bile müşterilerine gösterebileceğin kendi sayfan. Aşağıdaki araçlar onu kendi işinde kullanman için: kartvizitte, Google&apos;da, Instagram&apos;da.
      </p>

      {!vitrinId && (
        <div className="rounded-xl p-4 mb-8 text-sm" style={{ background: "#EFF6FF", color: "#1E3A8A" }}>
          Araçların vitrinine bağlı çalışması için bu sayfayı profilindeki <b>Vitrin araçların</b> bağlantısından aç.
          <a href="/?view=profile" className="font-bold underline ml-1">Profilime git</a>
        </div>
      )}

      {vitrinUrl && (
        <section className="mb-10">
          <H2 n="1">QR kodlu broşür</H2>
          <P>A5 boyutunda, vitrin fotoğrafın, başlığın ve QR kodunla hazır bir sayfa. Yazdırıp dükkânına, okul ya da site panosuna asabilir, PDF olarak kaydedip WhatsApp&apos;tan gönderebilirsin. Kodu okutan kişi doğrudan vitrinine gelir.</P>
          <a
            href={`/vitrin/${vitrinId}/brosur`}
            target="_blank"
            rel="noopener"
            className="inline-block text-sm font-bold px-5 py-2.5 rounded-full text-white"
            style={{ background: "#2563EB" }}
          >
            Broşürümü aç
          </a>
        </section>
      )}

      {vitrinUrl && (
        <section className="mb-10">
          <H2 n="★">Instagram hikâyesi kartı</H2>
          <P>Vitrinin için hazırlanmış, hikâye boyutunda bir paylaşım görseli. İndir, Instagram ya da WhatsApp hikâyende paylaş; üstüne bağlantı çıkartması olarak vitrin linkini ekle.</P>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/vitrin/${vitrinId}/kart`} alt="Vitrin paylaşım kartı önizlemesi" width={216} height={384} loading="lazy" className="rounded-xl mb-3" style={{ border: "1px solid #E4E4E7" }} />
          <div className="flex flex-wrap gap-2 items-center">
            <a href={`/vitrin/${vitrinId}/kart`} download="isinn-vitrin-karti.png" className="inline-block text-sm font-bold px-5 py-2.5 rounded-full text-white" style={{ background: "#2563EB" }}>
              Kartı indir
            </a>
            <CopyText text={`${vitrinUrl}?utm_source=hikaye_karti`} label="Hikâye linkini kopyala" />
          </div>
        </section>
      )}

      {vitrinUrl && (
        <section className="mb-10">
          <H2 n="2">Google İşletme Profili&apos;ne web sitesi olarak ekle</H2>
          <P>Google Haritalar&apos;da görünen bir işletme profilin varsa ve web siten yoksa, &quot;Web sitesi&quot; alanına vitrin linkini yazabilirsin. Google&apos;da seni bulan kişi tek dokunuşla çalışmalarını ve fiyatını görür.</P>
          <CopyText text={vitrinUrl} label="Linki kopyala" />
          <ol className="text-sm mb-3 list-decimal pl-5 space-y-1" style={{ color: "#575E6B" }}>
            <li>Google&apos;da işletmenin adını arat ya da Google Haritalar uygulamasında profilini aç.</li>
            <li><b>Profili düzenle</b>, ardından <b>İletişim</b> bölümüne gir.</li>
            <li><b>Web sitesi</b> alanına kopyaladığın linki yapıştır ve kaydet.</li>
          </ol>
          <p className="text-xs" style={{ color: "#8A8F9C" }}>Google, işletme profilini yalnızca müşterileriyle yüz yüze görüşen işletmelere açar ve değişiklikleri incelemesi birkaç gün sürebilir. Yalnızca online hizmet veriyorsan bu adımı atla, 3. adımı kullan.</p>
        </section>
      )}

      {vitrinUrl && (
        <section className="mb-10">
          <H2 n="3">Instagram, WhatsApp ve e-posta imzası</H2>
          <P>Instagram profilindeki bağlantı alanına, WhatsApp Business&apos;taki web sitesi alanına ya da e-posta imzana aynı linki ekle. &quot;Fiyatın ne, örnek var mı?&quot; diye soranlara tek linkle cevap vermiş olursun.</P>
          <CopyText text={vitrinUrl} label="Linki kopyala" />
        </section>
      )}

      <section className="mb-10">
        <H2 n={vitrinUrl ? "4" : "1"}>Web sitene rozet</H2>
        <P>Kendi web siten varsa bu rozeti ekleyerek ziyaretçilerine İşinn vitrinini gösterebilirsin. Rozet kimlik ya da belge doğrulaması anlamına gelmez.</P>
        <div className="rounded-2xl p-8 flex justify-center mb-4" style={{ border: "1px solid #E4E4E7", background: "#F7F7F8" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rozet.svg" alt="İşinn Sağlayıcısı" width={220} height={64} />
        </div>
        <CopyText text={embedCode(vitrinId)} label="Kodu kopyala" dark />
      </section>

      <a
        href="/?view=profile"
        className="inline-block text-sm font-bold px-6 py-3 rounded-full"
        style={{ border: "1px solid #E4E4E7", color: "#0F1115" }}
      >
        Profilime dön
      </a>
    </div>
  );
}
