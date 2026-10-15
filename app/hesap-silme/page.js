import Link from "next/link";
import { COMPANY } from "../../lib/companyInfo";
import { socialMeta } from "../../lib/seoMeta";
import SeoFooter from "../../components/SeoFooter";

// Hesap ve veri silme sayfası. Google Play (Veri güvenliği formu) uygulama içi silme yoluna ek olarak,
// oturum açmadan erişilebilen bir web bağlantısı ister; Apple 5.1.1(v) uygulama içi yolu zaten karşılıyor.
// Bu sayfadaki her cümle kodla uyumlu olmalı: app/api/delete-account/route.js (auth.users silinir, profil/vitrin/mesaj/yorum
// cascade ile gider, Storage'daki profile-media ve provider-documents klasörleri temizlenir; ödeme kayıtlarının hesap bağı kopar).
const BASE_URL = "https://www.isinn.com.tr";
const URL = `${BASE_URL}/hesap-silme`;
const TITLE = "Hesap ve Veri Silme | İşinn";
const DESCRIPTION = "İşinn hesabını ve verilerini nasıl silebileceğini adım adım öğren; uygulamaya giremiyorsan e-postayla silme talebi gönder.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
};

const h2 = "font-sans text-xl font-black mb-3";
const p = "text-sm mb-3";

export default function HesapSilmePage() {
  return (
    <>
      <div className="max-w-2xl mx-auto px-5 py-10">
        <nav aria-label="Sayfa yolu" className="text-xs mb-4" style={{ color: "#6B7280" }}>
          <Link href="/" style={{ color: "#2563EB" }}>İşinn</Link> › Hesap ve veri silme
        </nav>
        <h1 className="font-sans text-3xl font-black mb-3" style={{ color: "#0F1115" }}>İşinn Hesabını ve Verilerini Sil</h1>
        <p className="text-base mb-8" style={{ color: "#374151" }}>
          Bu sayfa İşinn mobil uygulaması ve web sitesi içindir. Hesabını istediğin zaman kendin silebilirsin.
        </p>

        <h2 className={h2} style={{ color: "#0F1115" }}>1. Uygulamadan ya da siteden sil (en hızlı yol)</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-8 text-sm" style={{ color: "#374151" }}>
          <li>İşinn'e giriş yap.</li>
          <li>Menüden <b>Profilim</b> ekranını aç.</li>
          <li>En alttaki <b>“Hesabımı sil”</b> bölümüne gel.</li>
          <li>Onay kutusuna <b>SİL</b> yaz ve silmeyi onayla.</li>
        </ol>
        <p className={p} style={{ color: "#374151" }}>
          Onayladığında silme hemen yapılır ve geri alınamaz.
        </p>

        <h2 className={h2} style={{ color: "#0F1115" }}>2. Uygulamaya giremiyorsan</h2>
        <p className={p} style={{ color: "#374151" }}>
          Şifreni ya da erişimini kaybettiysen, hesabına kayıtlı e-posta adresinden <b>{COMPANY.email}</b> adresine
          “İşinn hesap silme talebi” konulu bir e-posta gönder. Hesabın sana ait olduğunu doğrulamak için gerekirse ek bilgi isteyebiliriz.
          Talebini en geç 30 gün içinde sonuçlandırırız (KVKK başvuru süresi). Telefonla da ulaşabilirsin: {COMPANY.phone}.
        </p>

        <h2 className={h2} style={{ color: "#0F1115", marginTop: "2rem" }}>Neler silinir?</h2>
        <ul className="list-disc pl-5 space-y-1.5 mb-8 text-sm" style={{ color: "#374151" }}>
          <li>Hesabın ve profil bilgilerin (ad, e-posta, telefon, şehir)</li>
          <li>Açtığın vitrinler ve ilanlar</li>
          <li>Gönderdiğin ve aldığın mesajlar</li>
          <li>Yazdığın yorumlar ve değerlendirmeler</li>
          <li>Yüklediğin fotoğraf, video ve belge dosyaları</li>
        </ul>

        <h2 className={h2} style={{ color: "#0F1115" }}>Neler saklanabilir?</h2>
        <p className={p} style={{ color: "#374151" }}>
          Geçmişte ödeme yaptıysan ödemeye ilişkin kayıtlar, mevzuatın öngördüğü süre boyunca hesabınla bağı kopmuş biçimde saklanabilir.
          Yasal yükümlülüklerimiz ve güvenlik amacıyla sınırlı kayıtlar da bu süre boyunca tutulabilir. Ayrıntılar{" "}
          <Link href="/gizlilik-politikasi" style={{ color: "#2563EB" }}>Gizlilik Politikası</Link>'ndadır.
        </p>

        <div className="flex flex-wrap gap-4 text-sm font-bold mt-8" style={{ color: "#2563EB" }}>
          <Link href="/destek">Destek</Link>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kullanim-sartlari">Kullanım Şartları</Link>
        </div>
      </div>
      <SeoFooter />
    </>
  );
}
