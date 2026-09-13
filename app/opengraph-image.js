import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "İşinn — Güvendiğin Ellere";

// Link paylaşıldığında (WhatsApp, Instagram, Twitter/X, LinkedIn) çıkan
// önizleme kartı. Next.js bunu otomatik olarak <meta property="og:image">
// ve <meta name="twitter:image"> olarak bağlıyor — layout.js'de metadata
// ayrıca og:image belirtmesine gerek yok.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 90px",
          background: "linear-gradient(135deg, #16321F 0%, #0F1E14 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 28 }}>
          <span style={{ color: "#FFFFFF", fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>İşinn</span>
          <span style={{ color: "#2563EB", fontSize: 72, fontWeight: 800 }}>.</span>
        </div>
        <div style={{ color: "#D1D5DB", fontSize: 34, fontWeight: 500, maxWidth: 820, lineHeight: 1.35 }}>
          İhtiyacın olan hizmeti bulduğun ya da kendi hizmetini sunduğun güvenilir yerel pazar yeri.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 44 }}>
          <div style={{ background: "#2563EB", color: "#fff", fontSize: 22, fontWeight: 700, padding: "12px 26px", borderRadius: 999 }}>
            Sıfır Komisyon
          </div>
          <div style={{ color: "#9CA3AF", fontSize: 24, fontWeight: 600 }}>isinn.com.tr</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
