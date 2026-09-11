import LegalPageLayout from "../../components/LegalPageLayout";

const h2 = { fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", marginTop: "1.75rem", marginBottom: "0.5rem" };
const p = { marginBottom: "0.75rem" };
const li = { marginBottom: "0.35rem" };
const ul = { listStyle: "disc", paddingLeft: "1.25rem" };

export default function GizlilikPage() {
  return (
    <LegalPageLayout title="Gizlilik Politikası" updatedLabel="Son güncelleme: 11.09.2026 — avukat incelemesinden geçmiştir">
      <p style={p}>
        Bu Gizlilik Politikası, İşinn platformunu ("Platform") kullanırken kişisel verilerinizin neler
        olduğunu, nasıl toplandığını, kimlerle paylaşıldığını ve haklarınızı ne şekilde kullanabileceğinizi
        sade bir dille anlatır. Verilerinizin işlenmesine ilişkin hukuki dayanaklar ve ayrıntılı kapsam için{" "}
        <a href="/kvkk-aydinlatma-metni" style={{ color: "#2563EB" }}>KVKK Aydınlatma Metni</a> esas alınır — bu
        iki belge birlikte, birbirini tamamlayacak şekilde okunmalıdır.
      </p>

      <h2 style={h2}>1. Hangi Verileri Topluyoruz?</h2>
      <ul style={ul}>
        <li style={li}><b>Hesap bilgileri:</b> E-posta, ad-soyad/işletme adı, şehir</li>
        <li style={li}><b>Profil ve vitrin içeriği:</b> Profil fotoğrafı, vitrine özel tanıtım videosu, portföy fotoğraf/videoları, sertifika ve CV dosyaları</li>
        <li style={li}><b>Telefon numarası:</b> Doğrulama amacıyla, kısıtlı erişimli ayrı bir tabloda tutulur — siz göstermeyi seçmedikçe profilinizde görünmez</li>
        <li style={li}><b>Mesajlar:</b> Platform içi mesajlaşmada gönderdiğiniz/aldığınız mesajlar</li>
        <li style={li}><b>Değerlendirmeler:</b> Puan, yorum ve isteğe bağlı fotoğraflar</li>
        <li style={li}><b>Konum:</b> "Konumumu Kullan" dediğinizde tarayıcınızın verdiği GPS konumu — yalnızca en yakın şehri bulmak için kullanılır, kaydedilmez</li>
        <li style={li}><b>Kullanım verisi:</b> Favoriler, kayıtlı aramalar, bildirim tercihleri</li>
        <li style={li}><b>Ziyaret istatistikleri:</b> Vercel Web Analytics üzerinden, kimliğinizi belirlemeyen (çerezsiz) toplu sayfa görüntüleme/ziyaretçi sayıları</li>
      </ul>

      <h2 style={h2}>2. Verilerinizi Kimlerle Paylaşıyoruz?</h2>
      <p style={p}>Verilerinizi <b>satmıyoruz</b>. Yalnızca platformu işletebilmek için aşağıdaki hizmet sağlayıcılarla paylaşıyoruz:</p>
      <ul style={ul}>
        <li style={li}><b>Supabase</b> — tüm verilerin saklandığı veritabanı/depolama altyapısı</li>
        <li style={li}><b>Anthropic (Claude AI)</b> — fotoğraf uygunluk kontrolü, akıllı arama, yazım yardımı gibi özellikler için ilgili içerik işlenir</li>
        <li style={li}><b>PayTR</b> — ödeme işlemleri (kart bilgileriniz bizim sunucularımıza hiç uğramaz, doğrudan PayTR'ye iletilir)</li>
        <li style={li}><b>Netgsm</b> — telefon doğrulama SMS'i</li>
        <li style={li}><b>Vercel</b> — platformun barındırıldığı ve çerezsiz ziyaret istatistiklerinin toplandığı altyapı</li>
      </ul>

      <h2 style={h2}>3. Diğer Kullanıcılar Sizin Hakkınızda Ne Görebilir?</h2>
      <p style={p}><b>Herkese açık:</b> profil fotoğrafı, vitrin başlığı/açıklaması, şehir, aldığınız değerlendirmeler, "belge paylaşıldı" rozeti (belgenin kendisi değil).</p>
      <p style={p}><b>Sadece mesajlaştığınız kişi:</b> mesaj geçmişiniz.</p>
      <p style={p}><b>Kimse:</b> telefon numaranız (siz göstermeyi seçmedikçe), tam adresiniz, ödeme bilgileriniz.</p>

      <h2 style={h2}>4. Verilerinizi Nasıl Silebilirsiniz?</h2>
      <p style={p}>
        Hesabınızı silmek için <b>esra.gunes@codegtechnology.com</b> üzerinden bize ulaşabilirsiniz. Hesap
        silindiğinde profil, vitrin ve belgeleriniz kaldırılır; yasal saklama yükümlülüğü olan kayıtlar
        mevzuatın öngördüğü süre kadar saklanabilir.
      </p>

      <h2 style={h2}>5. Çerezler</h2>
      <p style={p}>
        İşinn pazarlama/takip çerezi kullanmıyor — yalnızca oturumunuzu açık tutmak için teknik olarak zorunlu
        bir oturum belirteci tarayıcınızda tutulur. Ziyaret istatistikleri (Vercel Web Analytics) çerezsiz
        çalışır, kimliğinizi belirlemez.
      </p>

      <h2 style={h2}>6. Veri Güvenliği</h2>
      <p style={p}>
        Verileriniz, sektör standardı şifreleme ve erişim kontrolleriyle korunan Supabase altyapısında
        saklanır. Telefon numarası gibi hassas alanlar ayrı, kısıtlı erişimli tablolarda tutulur; ödeme kartı
        bilgileriniz hiçbir aşamada İşinn sunucularına ulaşmaz.
      </p>

      <h2 style={h2}>7. Politikada Değişiklikler</h2>
      <p style={p}>Bu politika zaman zaman güncellenebilir; önemli değişikliklerde kullanıcılar bilgilendirilir.</p>

      <h2 style={h2}>8. İletişim</h2>
      <p style={p}>Gizlilikle ilgili sorularınız için: <b>esra.gunes@codegtechnology.com</b> · 0536 460 36 82</p>
    </LegalPageLayout>
  );
}
