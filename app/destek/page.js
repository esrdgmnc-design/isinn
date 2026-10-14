import Link from "next/link";
import { COMPANY } from "../../lib/companyInfo";
import { socialMeta } from "../../lib/seoMeta";
import SeoFooter from "../../components/SeoFooter";

// App Store "Destek URL"si. iOS uygulaması bireysel geliştirici hesabıyla yayında olduğu için
// bu sayfada şirket adı/e-postası geçmez; iletişim uygulama içi destek ve telefonla.
// Fiyat/üyelik bilgisi de yok (App Store 3.1.1).
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/destek`;
const TITLE = "Destek ve İletişim | İşinn";
const DESCRIPTION = "İşinn hesabın, vitrinin, mesajların ve bildirimlerinle ilgili yardım al; bize uygulama içinden ya da telefonla ulaş.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
};

const TOPICS = [
  { q: "Şifremi unuttum", a: "Giriş ekranında “Şifremi unuttum”a dokun, e-posta adresini yaz. Gelen bağlantıyla yeni şifre belirleyebilirsin." },
  { q: "Vitrinimi nasıl açarım ya da düzenlerim?", a: "Giriş yaptıktan sonra menüden “Hizmet Ekle”ye dokun. Yayındaki vitrinini Profilim ekranından açıp düzenleyebilir ya da yayından kaldırabilirsin." },
  { q: "Rahatsız eden birini nasıl engellerim ya da şikâyet ederim?", a: "Mesajlar ekranında o kişiyle olan konuşmayı aç; “Engelle” ve “Şikayet Et” seçenekleri oradadır. Uygunsuz bir vitrin ya da ilanı, kendi sayfasındaki “Vitrini Bildir” / “İlanı Bildir” düğmesiyle bize iletebilirsin. Şikâyetleri yönetim ekibi inceler." },
  { q: "Bildirimleri nasıl kapatırım?", a: "iPhone'da Ayarlar > Bildirimler > İşinn'den kapatabilirsin. Kilit ekranında mesaj içeriği hiçbir zaman gösterilmez." },
  { q: "Hesabımı nasıl silerim?", a: "Profilim ekranının en altındaki “Hesabımı sil” bölümünde onay kutusuna SİL yazıp onayla. Hesabın, vitrinlerin, mesajların, yorumların ve yüklediğin dosyalar kalıcı olarak silinir." },
  { q: "Kişisel verilerim nasıl kullanılıyor?", a: "Ayrıntılar Gizlilik Politikası'nda. Konumun yalnızca cihazında en yakın şehri bulmak için kullanılır, saklanmaz. Yapay zekâ özellikleri ilk kullanımda onayını ister." },
];

export default function DestekPage() {
  return (
    <>
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-4" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Destek
        </nav>
        <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>Destek ve İletişim</h1>
        <p className="text-base mb-8" style={{ color: "#374151" }}>
          Bir sorun mu yaşıyorsun ya da sormak istediğin bir şey mi var? Aşağıdaki yollardan bize ulaşabilirsin.
        </p>

        <div className="grid gap-4 mb-10 sm:grid-cols-2">
          <div className="rounded-2xl p-5" style={{ background: "#EFF6FF" }}>
            <h2 className="font-sans text-base font-black mb-2" style={{ color: "#1E3A8A" }}>Uygulama içinden</h2>
            <p className="text-sm mb-3" style={{ color: "#374151" }}>
              Ekrandaki mavi destek düğmesine dokun, sorununu yaz. Asistan çözemezse “Hayır, yönetime bildir” ile yazışma bize iletilir.
            </p>
            <Link href="/?view=support" className="inline-block text-sm font-bold px-5 py-2.5 rounded-full text-white" style={{ background: "#2563EB" }}>
              Destek talebi oluştur
            </Link>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "#F0FDF4" }}>
            <h2 className="font-sans text-base font-black mb-2" style={{ color: "#166534" }}>Telefon</h2>
            <p className="text-sm mb-3" style={{ color: "#374151" }}>Arayabilir ya da mesaj bırakabilirsin; ulaşamazsak sana geri döneriz.</p>
            <a href={`tel:${COMPANY.phoneHref}`} className="inline-block text-sm font-bold px-5 py-2.5 rounded-full text-white" style={{ background: "#16A34A" }}>
              {COMPANY.phone}
            </a>
          </div>
        </div>

        <h2 className="font-sans text-xl font-black mb-4" style={{ color: "#0F1115" }}>Sık sorulanlar</h2>
        <div className="space-y-5 mb-10">
          {TOPICS.map((f) => (
            <div key={f.q}>
              <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1115" }}>{f.q}</h3>
              <p className="text-sm" style={{ color: "#4B5563" }}>{f.a}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-bold" style={{ color: "#2563EB" }}>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kullanim-sartlari">Kullanım Şartları</Link>
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>
        </div>
      </div>
      <SeoFooter />
    </>
  );
}
