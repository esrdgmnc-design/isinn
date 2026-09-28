import { ImageResponse } from "next/og";

// GEÇİCİ dosya — Facebook kapak fotoğrafı üretmek için tek seferlik kullanım,
// üretimde indirildikten sonra kaldırılacak. app/opengraph-image.js ile aynı
// render motoru/marka stili kullanılıyor.
export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #16321F 0%, #0F1E14 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 28 }}>
          <span style={{ color: "#FFFFFF", fontSize: 140, fontWeight: 800, letterSpacing: -3 }}>İşinn</span>
          <span style={{ color: "#2563EB", fontSize: 140, fontWeight: 800 }}>.</span>
        </div>
        <div style={{ color: "#B8BCC4", fontSize: 34, fontWeight: 500, maxWidth: 1100, textAlign: "center", lineHeight: 1.4 }}>
          İhtiyacın olan hizmeti bul, ya da kendi hizmetini sun — komisyonsuz.
        </div>
      </div>
    ),
    { width: 1640, height: 624 }
  );
}
