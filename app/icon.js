import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Next.js'in App Router "özel dosya" kuralı — bunu yazmak otomatik olarak
// favicon/site icon üretir, ayrı bir .ico dosyası eklemeye gerek yok.
// Beyaz zemin üzerine siyah "İ" (nokta + gövde şekillerle çiziliyor, yazı
// tipine bağımlı değil — küçük boyutta da net kalsın diye kalın).
export default function Icon() {
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
          background: "#FFFFFF",
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#2563EB", marginBottom: 5 }} />
        <div style={{ width: 13, height: 30, borderRadius: 3, background: "#000000" }} />
      </div>
    ),
    { ...size }
  );
}
