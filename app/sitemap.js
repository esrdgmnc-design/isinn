// Next.js App Router özel dosyası — /sitemap.xml'i otomatik üretir.
//
// 2026-09-16'ya kadar İşinn'in vitrin/ilan detay sayfaları kendi URL'lerine
// sahip değildi — tüm uygulama tek bir "/" sayfası üzerinde, istemci tarafı
// görünüm durumuyla çalışıyordu, Google tek tek vitrinleri hiç
// indeksleyemiyordu. Artık her aktif vitrin app/vitrin/[id]/page.js'te
// gerçek, kendi başlığı/açıklaması olan bir sayfaya sahip — bu dosya artık
// hepsini de sitemap'e ekliyor.
import { supabase } from "../lib/supabaseClient";

const BASE_URL = "https://www.isinn.com.tr";

export default async function sitemap() {
  const staticPaths = [
    "",
    "/kvkk-aydinlatma-metni",
    "/gizlilik-politikasi",
    "/kullanim-sartlari",
    "/mesafeli-satis-sozlesmesi",
    "/iptal-iade-kosullari",
  ];
  const staticEntries = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.3,
  }));

  const { data: services } = await supabase
    .from("services")
    .select("id, updated_at, created_at")
    .eq("active", true);

  const vitrinEntries = (services || []).map((row) => ({
    url: `${BASE_URL}/vitrin/${row.id}`,
    lastModified: new Date(row.updated_at || row.created_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...vitrinEntries];
}
