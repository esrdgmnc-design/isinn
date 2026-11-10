import SmmCalculator from "../../../../components/SmmCalculator";
import { toolById, BASE_URL } from "../../../../lib/tools";

// Başka sitelere gömülen sürüm (2026-11-10). Dizine girmez; canonical asıl araç sayfası.
const tool = toolById("smm");

export const metadata = {
  title: `${tool.name} | İşinn`,
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE_URL}${tool.path}` },
};

export default function Gomulu() {
  return (
    <div style={{ background: "#FFFFFF", padding: 8 }}>
      <SmmCalculator />
      <p className="text-xs" style={{ color: "#6B7280", marginTop: -12 }}>
        <a href={`${BASE_URL}${tool.path}?utm_source=gomulu_arac`} target="_blank" rel="noopener" style={{ color: "#2563EB" }}>İşinn ile hesaplandı</a>
      </p>
    </div>
  );
}
