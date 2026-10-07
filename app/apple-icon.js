import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iPhone/iPad "Ana Ekrana Ekle" simgesi (apple-touch-icon): bu olmadan iOS ana ekranda boş/genel bir simge gösteriyordu.
// app/icon.js ile aynı çizim (siyah "İ" + mavi nokta), 180x180 ölçeğinde.
export default function AppleIcon() {
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
          paddingBottom: 34,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: "#000000", marginBottom: 11 }} />
          <div style={{ width: 31, height: 79, borderRadius: 8, background: "#000000" }} />
        </div>
        <div style={{ width: 25, height: 25, borderRadius: 13, background: "#2563EB", marginLeft: 11, marginBottom: 3 }} />
      </div>
    ),
    { ...size }
  );
}
