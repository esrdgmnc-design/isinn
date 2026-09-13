import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Next.js'in App Router "özel dosya" kuralı — bunu yazmak otomatik olarak
// favicon/site icon üretir, ayrı bir .ico dosyası eklemeye gerek yok.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16321F",
          borderRadius: 14,
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ color: "#FFFFFF", fontSize: 40, fontWeight: 800 }}>İ</span>
        <span style={{ color: "#2563EB", fontSize: 40, fontWeight: 800 }}>.</span>
      </div>
    ),
    { ...size }
  );
}
