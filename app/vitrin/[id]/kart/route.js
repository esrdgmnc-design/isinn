import { ImageResponse } from "next/og";
import { supabase } from "../../../../lib/supabaseClient";

// Paylaşılabilir vitrin kartı (2026-11-10): Instagram hikâyesi boyutunda (1080×1920) görsel. Vitrin sahibi "Vitrin
// araçların" sayfasından indirip paylaşır; her paylaşım ek emek olmadan vitrine ve İşinn'e ziyaretçi getirir.
// Yalnızca yayındaki, demo olmayan vitrinler için üretilir. Fiyat yazılmaz (premium algı kuralı).
export const revalidate = 3600;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clip = (s, n) => { const t = String(s || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1) + "…" : t; };

export async function GET(_req, { params }) {
  if (!UUID_RE.test(params.id || "")) return new Response("Bulunamadı", { status: 404 });
  const { data: row } = await supabase
    .from("services")
    .select("id, title, description, city, is_remote, images, display_name, active, categories(name, slug), profiles(business_name, full_name)")
    .eq("id", params.id)
    .eq("active", true)
    .maybeSingle();
  if (!row || String(row.description || "").trim().startsWith("DEMO VİTRİN")) return new Response("Bulunamadı", { status: 404 });

  const provider = clip((row.profiles?.business_name || "").trim() || row.display_name || row.profiles?.full_name || "", 40);
  const place = row.is_remote ? "Uzaktan" : clip(String(row.city || "").split(",").pop(), 24);
  const category = row.categories?.slug && row.categories.slug !== "diger" ? clip(row.categories.name, 32) : "";
  const cover = Array.isArray(row.images) && /^https:\/\//i.test(row.images[0] || "") ? row.images[0] : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F5F1EA", padding: "96px 80px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#0F1115", letterSpacing: -2 }}>İşinn</span>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#2563EB" }}>.</span>
        </div>
        <div style={{ display: "flex", marginTop: 64, width: 920, height: 920, borderRadius: 40, overflow: "hidden", background: "#E7E1D6" }}>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} width={920} height={920} style={{ width: 920, height: 920, objectFit: "cover" }} alt="" />
          ) : (
            <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 180, fontWeight: 800, color: "#0F1115" }}>
              {(provider || row.title || "İ").charAt(0).toLocaleUpperCase("tr-TR")}
            </div>
          )}
        </div>
        {category ? (
          <div style={{ display: "flex", marginTop: 56 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: "#1D4ED8", background: "#E0E7FF", padding: "10px 24px", borderRadius: 999 }}>{category}</span>
          </div>
        ) : null}
        <div style={{ display: "flex", marginTop: 28, fontSize: 68, fontWeight: 800, color: "#0F1115", lineHeight: 1.1, letterSpacing: -1 }}>{clip(row.title, 70)}</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 36, fontWeight: 600, color: "#4B5563" }}>
          {[provider, place].filter(Boolean).join(" · ")}
        </div>
        <div style={{ display: "flex", flexGrow: 1 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: "#0F1115" }}>Vitrinim İşinn'de</span>
          <span style={{ fontSize: 30, fontWeight: 600, color: "#2563EB", marginTop: 10 }}>isinn.com.tr</span>
          <span style={{ fontSize: 28, color: "#6B7280", marginTop: 18 }}>İşini göster, uzmanını bul.</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
