import OzelDersCalculator from "../../../../components/OzelDersCalculator";
import { toolById, BASE_URL } from "../../../../lib/tools";

// Başka sitelere gömülen sürüm (2026-11-10): yalnızca araç + küçük kaynak bağlantısı. Dizine girmez; canonical asıl
// araç sayfasıdır. Kaynak bağlantısı yeni sekmede açılır (ev sahibi sitenin içinde gezinmesin).
const tool = toolById("ozel-ders");

export const metadata = {
  title: `${tool.name} | İşinn`,
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE_URL}${tool.path}` },
};

export default function Gomulu() {
  return (
    <div style={{ background: "#FFFFFF", padding: 8 }}>
      <OzelDersCalculator />
      <p className="text-xs" style={{ color: "#6B7280", marginTop: -12 }}>
        <a href={`${BASE_URL}${tool.path}?utm_source=gomulu_arac`} target="_blank" rel="noopener" style={{ color: "#2563EB" }}>İşinn ile hesaplandı</a>
      </p>
    </div>
  );
}
