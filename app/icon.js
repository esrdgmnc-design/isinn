import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Next.js'in App Router "özel dosya" kuralı — bunu yazmak otomatik olarak
// favicon/site icon üretir, ayrı bir .ico dosyası eklemeye gerek yok.
// Beyaz zemin üzerine siyah "İ" + marka logosundaki gibi sondaki MAVİ nokta
// ("İ."). Şekillerle çiziliyor, yazı tipine bağımlı değil.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "#FFFFFF",
          paddingBottom: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: "#000000", marginBottom: 4 }} />
          <div style={{ width: 11, height: 28, borderRadius: 3, background: "#000000" }} />
        </div>
        <div style={{ width: 9, height: 9, borderRadius: 5, background: "#2563EB", marginLeft: 4, marginBottom: 1 }} />
      </div>
    ),
    { ...size }
  );
}
