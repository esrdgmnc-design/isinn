import { ImageResponse } from "next/og";

// GEÇİCİ dosya — reklam videosu için gerçek uygulama ekranlarının birebir
// (gerçek metin, gerçek renk, gerçek video karesi) yeniden üretimi. Üretimden
// sonra kaldırılacak.
export const runtime = "edge";

const BASE = "https://www.isinn.com.tr";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const scene = searchParams.get("scene") || "1";

  if (scene === "2") {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", fontFamily: "sans-serif", padding: "60px 50px" }}>
          <div style={{ display: "flex", alignItems: "baseline", marginBottom: 50 }}>
            <span style={{ color: "#0F1115", fontSize: 40, fontWeight: 900 }}>İşinn</span>
            <span style={{ color: "#2563EB", fontSize: 40, fontWeight: 900 }}>.</span>
          </div>
          <div style={{ color: "#0F1115", fontSize: 46, fontWeight: 900, marginBottom: 16, display: "flex" }}>Senin için 2-3 fikir bulduk</div>
          <div style={{ color: "#6B7280", fontSize: 24, marginBottom: 40, display: "flex" }}>Bunlar kesin bir garanti değil, birer başlangıç noktası.</div>
          <div style={{ display: "flex", flexDirection: "column", border: "3px solid #2563EB", borderRadius: 28, padding: 40, background: "#F8FAFF" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", width: 56, height: 56, borderRadius: 28, background: "#EFF6FF", alignItems: "center", justifyContent: "center", fontSize: 30, marginRight: 18 }}>🎙️</div>
              <span style={{ fontSize: 38, fontWeight: 900, color: "#0F1115" }}>Seslendirme</span>
            </div>
            <div style={{ color: "#374151", fontSize: 26, lineHeight: 1.5, display: "flex" }}>
              Çevrenizdeki herkesin beğendiği sesinizi artık gelire dönüştürme zamanı — bir seslendirme vitrini açın, tanıtım filmi, sesli kitap ya da podcast intro seslendirmesi gibi örneklerle kendinizi gösterin.
            </div>
            <div style={{ display: "flex", marginTop: 32, background: "#2563EB", color: "#fff", fontSize: 26, fontWeight: 700, padding: "20px 0", borderRadius: 999, justifyContent: "center" }}>
              Bu kategoride vitrin oluştur
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 }
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", fontFamily: "sans-serif", padding: "60px 50px" }}>
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 40 }}>
          <span style={{ color: "#0F1115", fontSize: 40, fontWeight: 900 }}>İşinn</span>
          <span style={{ color: "#2563EB", fontSize: 40, fontWeight: 900 }}>.</span>
        </div>
        <img src={`${BASE}/temp-ad-assets/hero-frame.jpg`} width={980} height={551} style={{ borderRadius: 28, marginBottom: 40, objectFit: "cover" }} />
        <div style={{ color: "#0F1115", fontSize: 46, fontWeight: 900, marginBottom: 16, display: "flex" }}>Yeteneğini Farket</div>
        <div style={{ color: "#6B7280", fontSize: 24, marginBottom: 40, lineHeight: 1.4, display: "flex" }}>
          Bu birkaç dakikalık bir form değil, kısa bir öz-farkındalık anı.
        </div>
        <div style={{ color: "#0F1115", fontSize: 30, fontWeight: 800, marginBottom: 20, display: "flex" }}>
          Vaktin ya da parası olmasa bile, yapmaktan gerçekten keyif aldığın şey ne?
        </div>
        <div style={{ display: "flex", border: "2px solid #E5B84B", borderRadius: 20, padding: 26, color: "#9CA3AF", fontSize: 24 }}>
          Örn. elimle bir şeyler üretmeyi, insanlarla sohbet etmeyi...
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
