import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { supabase } from "../../../../lib/supabaseClient";
import { formatPrice, getProviderName } from "../../../../lib/seoFormat";
import { clamp, optimizedImageUrl } from "../../../../lib/seoMeta";
import PrintButton from "../../../../components/PrintButton";

// Vitrin sahibinin kendi işi için kullanacağı A5 broşür (2026-11-01, kalıcı büyüme planı madde 3).
// Kurucunun broşür QR'ı trafik getirdi; bu sayfa aynı aracı her vitrine verir. QR kişinin kendi
// vitrin sayfasına gider (utm_source=vitrin_brosur, ilk kaynak AttributionCapture ile yakalanır).
// Arama motoruna kapalı; vitrin verisi zaten herkese açık olduğu için oturum istemez.
const BASE_URL = "https://www.isinn.com.tr";

export const revalidate = 3600;

async function getListing(id) {
  const { data } = await supabase.from("services").select("*, profiles(*), categories(*)").eq("id", id).eq("active", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }) {
  const row = await getListing(params.id);
  return {
    title: row ? `Broşür: ${clamp(row.title || "", 50)} | İşinn` : "Broşür | İşinn",
    robots: { index: false, follow: false },
  };
}

export default async function VitrinBrosurPage({ params }) {
  const row = await getListing(params.id);
  if (!row) notFound();

  const provider = getProviderName(row);
  const category = row.categories?.slug === "diger" ? "" : (row.categories?.name || "");
  const place = row.is_remote ? "Uzaktan / online" : String(row.city || "").split(",").map((s) => s.trim()).filter(Boolean).join(", ");
  const price = row.price != null && Number(row.price) > 0 ? formatPrice(row.price, row.price_type, row.price_unit) : "";
  const realImg = Array.isArray(row.images) && row.images[0] ? row.images[0] : null;
  const cover = realImg ? optimizedImageUrl(realImg, 1080) : null;
  // A5'e sığsın diye: uzun başlıkta yazı küçülür, açıklama kısaltılır (QR alt kenardan taşmasın).
  const longTitle = String(row.title || "").length > 42;
  const desc = clamp(String(row.description || "").replace(/\s+/g, " ").trim(), longTitle ? 170 : 220);
  const vitrinUrl = `${BASE_URL}/vitrin/${row.id}`;
  const qrSvg = await QRCode.toString(`${vitrinUrl}?utm_source=vitrin_brosur&utm_medium=qr`, {
    type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: "#111111", light: "#FFFFFF" },
  });

  return (
    <div className="brosur-root">
      <style>{`
        @page { size: 148mm 210mm; margin: 0; }
        .brosur-root { background: #E9E6E0; min-height: 100vh; padding: 24px 16px 48px; }
        .brosur-bar { max-width: 148mm; margin: 0 auto 16px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
        .brosur-bar p { font-size: 13px; color: #4A453D; max-width: 340px; }
        .brosur-page { width: 148mm; height: 210mm; margin: 0 auto; background: #F7F4EE; color: #111; display: flex; flex-direction: column; padding: 11mm 12mm 9mm; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,.12); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .b-top { display: flex; justify-content: space-between; align-items: baseline; }
        .b-logo { font-size: 15pt; font-weight: 800; letter-spacing: -.6px; }
        .b-logo span { color: #1E3A8A; }
        .b-kick { font-size: 6.5pt; font-weight: 700; letter-spacing: 1.8px; color: #6B6458; text-transform: uppercase; text-align: right; }
        .b-cover { margin-top: 7mm; height: 62mm; border-radius: 2mm; background: #D9D2C5 center/cover no-repeat; }
        .b-title { margin-top: 7mm; font-size: 22pt; font-weight: 800; line-height: 1.08; letter-spacing: -.8px; }
        .b-who { margin-top: 3mm; font-size: 10pt; font-weight: 700; color: #1E3A8A; }
        .b-meta { margin-top: 1.5mm; font-size: 8.5pt; color: #6B6458; }
        .b-desc { margin-top: 5mm; font-size: 9pt; line-height: 1.55; color: #4A453D; }
        .b-qr { margin-top: auto; display: flex; align-items: center; gap: 6mm; background: #fff; border: 1px solid #D9D2C5; border-radius: 2mm; padding: 5mm; }
        .b-qr .q { width: 30mm; height: 30mm; flex: 0 0 30mm; }
        .b-qr .q svg { width: 100%; height: 100%; display: block; }
        .b-qr b { display: block; font-size: 12pt; font-weight: 800; letter-spacing: -.3px; }
        .b-qr span { display: block; margin-top: 1.5mm; font-size: 8pt; line-height: 1.45; color: #4A453D; }
        .b-qr small { display: block; margin-top: 2mm; font-size: 6.5pt; color: #8C8579; word-break: break-all; }
        .b-foot { margin-top: 3.5mm; font-size: 6.5pt; color: #8C8579; display: flex; justify-content: space-between; }
        @media print {
          .brosur-root { background: none; padding: 0; min-height: 0; }
          .brosur-bar, #isinn-boot { display: none !important; }
          .brosur-page { box-shadow: none; margin: 0; }
        }
        @media screen and (max-width: 600px) {
          .brosur-page { transform: scale(.62); transform-origin: top center; margin-bottom: -80mm; }
        }
      `}</style>

      <div className="brosur-bar">
        <p>Broşürün hazır. Yazdırabilir ya da yazdırma penceresinde <b>PDF olarak kaydet</b> seçerek WhatsApp&apos;tan paylaşabilirsin. QR, vitrin sayfana gider.</p>
        <PrintButton>Yazdır / PDF kaydet</PrintButton>
      </div>

      <div className="brosur-page">
        <div className="b-top">
          <div className="b-logo">İş<span>inn</span></div>
          <div className="b-kick">{[category, place].filter(Boolean).join(" · ")}</div>
        </div>

        {cover && <div className="b-cover" style={{ backgroundImage: `url("${cover}")` }} role="img" aria-label={row.title} />}

        <h1 className="b-title" style={longTitle ? { fontSize: "17pt" } : undefined}>{row.title}</h1>
        <p className="b-who">{provider}</p>
        {price && <p className="b-meta">{price}</p>}
        {desc && <p className="b-desc">{desc}</p>}

        <div className="b-qr">
          {/* eslint-disable-next-line react/no-danger */}
          <div className="q" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div>
            <b>Vitrinimi incele, bana yaz</b>
            <span>Telefonunun kamerasıyla kodu okut. Çalışmalarımı görebilir, İşinn üzerinden doğrudan mesaj gönderebilirsin.</span>
            <small>{vitrinUrl.replace("https://", "")}</small>
          </div>
        </div>
        <div className="b-foot">
          <span>isinn.com.tr</span>
          <span>Hizmet verenler ve müşteriler burada buluşur</span>
        </div>
      </div>
    </div>
  );
}
