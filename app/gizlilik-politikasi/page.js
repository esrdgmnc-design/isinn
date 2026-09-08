import LegalPageLayout from "../../components/LegalPageLayout";

const h2 = { fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", marginTop: "1.75rem", marginBottom: "0.5rem" };
const p = { marginBottom: "0.75rem" };
const li = { marginBottom: "0.35rem" };
const note = { background: "#FFFBEB", border: "1px solid #F0E4C4", borderRadius: "0.75rem", padding: "0.9rem 1rem", fontSize: "0.8rem", color: "#92600A", marginBottom: "1.5rem" };
const fill = { color: "#9C4A3C", fontWeight: 700 };

export default function GizlilikPage() {
  return (
    <LegalPageLayout title="Gizlilik Politikası" updatedLabel="Taslak — henüz yürürlükte değil">
      <div style={note}>
        Bu metin taslaktır. Şirket bilgileri dolduruldu, ama bir avukat tarafından henüz onaylanmadı.
      </div>

      <h2 style={h2}>Hangi verileri topluyoruz?</h2>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}><b>Hesap bilgileri:</b> E-posta, ad-soyad/işletme adı, şehir</li>
        <li style={li}><b>Profil ve vitrin içeriği:</b> Profil fotoğrafı, vitrine özel tanıtım videosu, portföy, sertifika ve CV dosyaları</li>
        <li style={li}><b>Telefon numarası:</b> Doğrulama amacıyla, kısıtlı erişimli ayrı bir tabloda — siz göstermeyi seçmedikçe profilinizde görünmez</li>
        <li style={li}><b>Mesajlar:</b> Platform içi mesajlaşmada gönderdiğiniz/aldığınız mesajlar</li>
        <li style={li}><b>Değerlendirmeler:</b> Puan, yorum ve isteğe bağlı fotoğraflar</li>
        <li style={li}><b>Konum:</b> "Konumumu Kullan" dediğinizde tarayıcınızın GPS konumu — yalnızca en yakın şehri bulmak için, kaydedilmez</li>
        <li style={li}><b>Kullanım verisi:</b> Favoriler, kayıtlı aramalar, bildirim tercihleri</li>
      </ul>

      <h2 style={h2}>Verilerinizi kimlerle paylaşıyoruz?</h2>
      <p style={p}>Verilerinizi <b>satmıyoruz</b>. Yalnızca hizmeti çalıştırabilmek için:</p>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}><b>Supabase</b> — tüm verilerin saklandığı veritabanı/depolama altyapısı</li>
        <li style={li}><b>Anthropic (Claude AI)</b> — fotoğraf uygunluk kontrolü, akıllı arama, yazım yardımı gibi özellikler</li>
        <li style={li}><b>PayTR</b> — ödeme işlemleri (kart bilgileriniz bizim sunucularımıza hiç uğramaz)</li>
        <li style={li}><b>Netgsm</b> — telefon doğrulama SMS'i</li>
      </ul>

      <h2 style={h2}>Diğer kullanıcılar sizin hakkınızda ne görebilir?</h2>
      <p style={p}><b>Herkese açık:</b> profil fotoğrafı, vitrin başlığı/açıklaması, şehir, aldığınız değerlendirmeler, "belge paylaşıldı" rozeti (belgenin kendisi değil).</p>
      <p style={p}><b>Sadece mesajlaştığınız kişi:</b> mesaj geçmişiniz.</p>
      <p style={p}><b>Kimse:</b> telefon numaranız (siz göstermeyi seçmedikçe), tam adresiniz, ödeme bilgileriniz.</p>

      <h2 style={h2}>Verilerinizi nasıl silebilirsiniz?</h2>
      <p style={p}>
        Hesabınızı silmek için esra.gunes@codegtechnology.com üzerinden bize ulaşabilirsiniz. Hesap
        silindiğinde profil, vitrin ve belgeleriniz kaldırılır; yasal saklama yükümlülüğü olan kayıtlar mevzuatın
        öngördüğü süre kadar saklanabilir.
      </p>

      <h2 style={h2}>Çerezler</h2>
      <p style={p}>İşinn pazarlama/takip çerezi kullanmıyor — yalnızca oturumunuzu açık tutmak için teknik olarak zorunlu bir oturum belirteci tarayıcınızda tutulur.</p>

      <h2 style={h2}>İletişim</h2>
      <p style={p}>Gizlilikle ilgili sorularınız için: esra.gunes@codegtechnology.com</p>
    </LegalPageLayout>
  );
}
