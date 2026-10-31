import Link from "next/link";
import { COMPANY } from "../../lib/companyInfo";
import { socialMeta } from "../../lib/seoMeta";
import SeoFooter from "../../components/SeoFooter";

// Yapay zekâ asistanları için MCP aracının herkese açık belgesi (Claude bağlayıcı dizini ve
// ChatGPT uygulama dizini "documentation URL" ister). Dizin incelemecileri için İngilizce bölüm de var.
// Her cümle app/api/mcp/route.js'in gerçek davranışına dayanır: salt okuma, yalnızca vitrin sayfasında
// zaten herkese açık alanlar, telefon/e-posta yok, çağrı başına yalnızca araç adı + arama metni + şehir kaydı.
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/yapay-zeka-araci`;
const MCP_URL = `${BASE_URL}/api/mcp`;
const TITLE = "İşinn Yapay Zekâ Aracı (MCP): Claude ve ChatGPT'de Hizmet Veren Ara";
const DESCRIPTION = "İşinn vitrin araması Claude ve ChatGPT gibi yapay zekâ asistanlarında kullanılabilir. Nasıl bağlanır, hangi araçlar var, hangi veriler paylaşılır.";
const UPDATED = "2026-10-31";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
};

const TOOLS = [
  { name: "search_vitrins", tr: "Hizmet, kategori, şehir ya da ilçeye göre vitrin arar; en fazla 10 sonuç döner.", en: "Searches listings by service query, category, city/district or remote-only; returns up to 10 results." },
  { name: "get_vitrin", tr: "Tek bir vitrinin açıklamasını, konumunu, hizmet verenin beyan ettiği fiyatı ve bağlantısını getirir.", en: "Returns one listing's description, location, the provider's stated price and URL." },
  { name: "list_categories", tr: "Aktif vitrini olan kategorileri ve vitrin sayılarını listeler.", en: "Lists categories that have active listings, with counts." },
];

const PROMPTS = [
  "İstanbul'da LGS matematik özel dersi veren öğretmen bul",
  "Sarıyer'de pilates dersi veren bir yer öner",
  "Online İngilizce dersi verenleri göster",
  "Find a logo designer in Turkey who works remotely",
];

const h2 = "font-sans text-xl font-black mb-3 mt-8";
const p = "text-sm mb-3";
const ink = { color: "#374151" };

export default function AiToolPage() {
  return (
    <>
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-4" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Yapay zekâ aracı
        </nav>
        <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>İşinn yapay zekâ aracı</h1>
        <p className="text-base mb-3" style={ink}>
          İşinn'deki vitrinleri Claude, ChatGPT ve MCP destekleyen diğer yapay zekâ asistanlarından arayabilirsin. Asistana “İstanbul'da matematik öğretmeni bul” demen yeterli; sonuçlar vitrin bağlantılarıyla gelir.
        </p>
        <p className="text-xs mb-6" style={{ color: "#6B7280" }}>Son güncelleme: 31 Ekim 2026</p>

        <h2 className={h2} style={{ color: "#0F1115" }}>Nasıl bağlanır?</h2>
        <p className={p} style={ink}>Sunucu adresi: <code className="px-1 rounded" style={{ background: "#F3F4F6" }}>{MCP_URL}</code> (Streamable HTTP, kimlik doğrulama yok).</p>
        <ul className="list-disc pl-5 space-y-1 mb-3 text-sm" style={ink}>
          <li><b>Claude:</b> Ayarlar → Bağlayıcılar → Özel bağlayıcı ekle → adı “İşinn”, adresi yukarıdaki.</li>
          <li><b>ChatGPT:</b> Ayarlar → Eklentiler → Ekle → Özel MCP sunucusu ekle → kimlik doğrulama “yok”.</li>
        </ul>

        <h2 className={h2} style={{ color: "#0F1115" }}>Araçlar</h2>
        <ul className="space-y-2 mb-3 text-sm" style={ink}>
          {TOOLS.map((t) => <li key={t.name}><code className="px-1 rounded" style={{ background: "#F3F4F6" }}>{t.name}</code> — {t.tr}</li>)}
        </ul>
        <p className={p} style={ink}>Araçların hepsi yalnızca okuma yapar; hiçbir şey oluşturmaz, değiştirmez ya da silmez.</p>

        <h2 className={h2} style={{ color: "#0F1115" }}>Örnek istekler</h2>
        <ul className="list-disc pl-5 space-y-1 mb-3 text-sm" style={ink}>
          {PROMPTS.map((q) => <li key={q}>{q}</li>)}
        </ul>

        <h2 className={h2} style={{ color: "#0F1115" }}>Hangi veriler paylaşılır?</h2>
        <ul className="list-disc pl-5 space-y-1 mb-3 text-sm" style={ink}>
          <li>Yalnızca vitrin sayfasında zaten herkese açık olan bilgiler: başlık, hizmet verenin vitrindeki adı, kategori, konum, açıklama, beyan edilen fiyat ve vitrin bağlantısı.</li>
          <li>Telefon numarası, e-posta adresi ya da hesap bilgisi paylaşılmaz. Demo ve içeriği çok kısa vitrinler sonuçlara girmez.</li>
          <li>Kullanım istatistiği için her çağrıda yalnızca araç adı, arama metni ve şehir kaydedilir. Asistandaki sohbetin kendisi, kullanıcı adı ya da kimlik bilgisi alınmaz.</li>
          <li>Ayrıntılar: <Link href="/gizlilik-politikasi" style={{ color: "#2563EB" }}>Gizlilik Politikası</Link>.</li>
        </ul>
        <p className={p} style={ink}>İşinn kullanıcılar arasındaki ödemeye aracılık etmez ve hizmet kalitesini garanti etmez. Fiyatlar hizmet verenin beyanıdır.</p>

        <h2 className={h2} style={{ color: "#0F1115" }}>Destek</h2>
        <p className={p} style={ink}>Sorun ve öneriler için: <a href={`mailto:${COMPANY.email}`} style={{ color: "#2563EB" }}>{COMPANY.email}</a> · <Link href="/destek" style={{ color: "#2563EB" }}>Destek sayfası</Link></p>

        <hr className="my-10" style={{ borderColor: "#E5E7EB" }} />

        <section lang="en">
          <h2 className="font-sans text-xl font-black mb-3" style={{ color: "#0F1115" }}>İşinn MCP server (English)</h2>
          <p className={p} style={ink}>İşinn is a service discovery platform in Turkey where providers publish listings (“vitrin”). This remote MCP server lets AI assistants search those public listings.</p>
          <ul className="list-disc pl-5 space-y-1 mb-3 text-sm" style={ink}>
            <li><b>URL:</b> {MCP_URL} — Streamable HTTP, stateless, no authentication.</li>
            {TOOLS.map((t) => <li key={t.name}><b>{t.name}</b> (read-only): {t.en}</li>)}
            <li><b>Data:</b> only fields already public on listing pages; no phone numbers, e-mail addresses or account data. Per call we log the tool name, query text and city for usage statistics; no conversation content or user identity is received.</li>
            <li><b>Language:</b> listing content is in Turkish; queries work with Turkish keywords.</li>
            <li><b>Support:</b> {COMPANY.email}</li>
          </ul>
        </section>
      </div>
      <SeoFooter />
    </>
  );
}
