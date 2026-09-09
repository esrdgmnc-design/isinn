import LegalPageLayout from "../../components/LegalPageLayout";

const h2 = { fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", marginTop: "1.75rem", marginBottom: "0.5rem" };
const h3 = { fontWeight: 700, fontSize: "0.9rem", color: "#0F1115", marginTop: "1.1rem", marginBottom: "0.35rem" };
const p = { marginBottom: "0.75rem" };
const li = { marginBottom: "0.35rem" };
const ul = { listStyle: "disc", paddingLeft: "1.25rem" };

export default function KvkkPage() {
  return (
    <LegalPageLayout title="KVKK Aydınlatma Metni" updatedLabel="Son güncelleme: 09.09.2026 — avukat incelemesinden geçmiştir">
      <p style={p}>
        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında Veri Sorumlusu Code G Teknoloji ve Ticaret
        Limited Şirketi olarak bizlerle paylaştığınız kişisel verilerinizi aşağıda yer verdiğimiz şekil ve şartlarda
        işliyoruz.
      </p>
      <p style={p}>
        İşbu Aydınlatma Metni, kişisel verilerinizin hangi kapsamda işlendiği, hangi amaçlarla kullanıldığı, kimlere
        ve hangi amaçlarla aktarılabileceği, kişisel verilerinizin toplanma yöntemi ve hukuki sebepleri ile KVKK
        kapsamındaki haklarınız hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır.
      </p>

      <h2 style={h2}>1. Veri Sorumlusu</h2>
      <ul style={ul}>
        <li style={li}>Veri Sorumlusu: Code G Teknoloji ve Ticaret Limited Şirketi</li>
        <li style={li}>Adres: Şişli, İstanbul</li>
        <li style={li}>MERSİS No: 0211145542800001</li>
        <li style={li}>VKN: 2111455428</li>
        <li style={li}>E-posta: esra.gunes@codegtechnology.com</li>
      </ul>

      <h2 style={h2}>2. İşlenen Kişisel Veriler</h2>
      <p style={p}>İşinn platformunu kullanmanız kapsamında aşağıdaki kişisel verileriniz işlenebilmektedir:</p>

      <h3 style={h3}>Kimlik ve kullanıcı bilgileri</h3>
      <ul style={ul}>
        <li style={li}>Ad-soyad</li>
        <li style={li}>İşletme adı</li>
        <li style={li}>Şehir bilgisi</li>
      </ul>

      <h3 style={h3}>İletişim bilgileri</h3>
      <ul style={ul}>
        <li style={li}>E-posta adresi</li>
        <li style={li}>Telefon numarası (doğrulama amacıyla ayrı ve kısıtlı erişimli bir tabloda tutulur, tarafınızca ayrıca görüntülenmesi tercih edilmediği sürece diğer kullanıcılara gösterilmez)</li>
      </ul>

      <h3 style={h3}>Görsel ve mesleki bilgiler</h3>
      <ul style={ul}>
        <li style={li}>Profil fotoğrafı</li>
        <li style={li}>Vitrin tanıtım videosu</li>
        <li style={li}>Portföy fotoğraf ve videoları</li>
        <li style={li}>Sertifika ve CV dosyaları</li>
      </ul>

      <h3 style={h3}>İletişim ve platform kullanım bilgileri</h3>
      <ul style={ul}>
        <li style={li}>Platform içi mesajlar</li>
        <li style={li}>Aldığınız ve bıraktığınız değerlendirmeler, puan ve yorumlar</li>
        <li style={li}>Değerlendirmelerde isteğe bağlı olarak paylaşılan fotoğraflar</li>
        <li style={li}>Favorilenen vitrinler, kayıtlı aramalar, bildirim tercihleri</li>
      </ul>

      <h3 style={h3}>Konum bilgisi</h3>
      <p style={p}>"Konumumu Kullan" fonksiyonunu kullanmanız halinde tarayıcınız tarafından sağlanan GPS konumu, yalnızca en yakın şehrin belirlenmesi amacıyla kullanılır, kaydedilmez.</p>

      <h3 style={h3}>İşlem ve ödeme bilgileri</h3>
      <p style={p}>Kart bilgileriniz İşinn sunucularında tutulmaz, ödeme işlemi doğrudan PayTR altyapısı üzerinden gerçekleştirilir.</p>

      <h2 style={h2}>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul style={ul}>
        <li style={li}>İşinn hesabınızın oluşturulması ve yönetilmesi</li>
        <li style={li}>Kullanıcı doğrulama işlemlerinin gerçekleştirilmesi</li>
        <li style={li}>Profil ve vitrin oluşturulması ve sunulması</li>
        <li style={li}>Profil, portföy, sertifika ve CV bilgilerinin ilgili fonksiyonlar kapsamında kullanılabilmesi</li>
        <li style={li}>Platform içi mesajlaşma hizmetinin sağlanması</li>
        <li style={li}>Değerlendirme ve puanlama hizmetlerinin yürütülmesi</li>
        <li style={li}>Arama ve favori özelliklerinin kullanılabilmesi, bildirim tercihlerinin uygulanması</li>
        <li style={li}>Konum özelliğinin kullanılması halinde en yakın şehrin belirlenmesi</li>
        <li style={li}>Ödeme ve telefon doğrulama işlemlerinin gerçekleştirilmesi</li>
        <li style={li}>Platformun güvenli ve teknik olarak çalışmasının sağlanması</li>
        <li style={li}>Fotoğraf uygunluk kontrolü, akıllı arama ve yazım yardımı gibi yapay zekâ destekli özelliklerin sunulması</li>
        <li style={li}>Kullanıcı taleplerinin ve iletişim süreçlerinin yönetilmesi</li>
        <li style={li}>Yasal yükümlülüklerin yerine getirilmesi ve mevzuattan kaynaklanan kayıtların tutulması</li>
      </ul>
      <p style={p}>Kişisel verileriniz, yukarıda belirtilen amaçlar dışında, belirli olmayan veya bu amaçlarla bağdaşmayan amaçlarla işlenmez.</p>

      <h2 style={h2}>4. Kişisel Verilerin Aktarılması</h2>
      <p style={p}>Kişisel verileriniz, yalnızca platformun işletilebilmesi ve yukarıda belirtilen amaçların yerine getirilebilmesi için gerekli olduğu ölçüde aşağıdaki hizmet sağlayıcılara aktarılabilmektedir:</p>
      <ul style={ul}>
        <li style={li}><b>Supabase</b> — verilerinizin saklanması amacıyla kullanılan veritabanı ve depolama altyapısı</li>
        <li style={li}><b>Anthropic (Claude AI)</b> — fotoğraf uygunluk kontrolü, akıllı arama ve yazım yardımı gibi yapay zekâ destekli özellikler için ilgili metin ve/veya görseller işlenebilir</li>
        <li style={li}><b>PayTR</b> — ödeme işlemlerinin gerçekleştirilmesi; kart bilgileriniz İşinn sunucularına aktarılmaz, doğrudan PayTR'ye iletilir</li>
        <li style={li}><b>Netgsm</b> — telefon numarası doğrulama işlemleri kapsamında SMS gönderimi</li>
      </ul>
      <p style={p}>Bunun yanında, kullanıcı tarafından platformda herkese açık şekilde paylaşılması tercih edilen bilgiler, platformun diğer kullanıcıları tarafından görüntülenebilir.</p>

      <h2 style={h2}>5. Diğer Kullanıcıların Görebileceği Bilgiler</h2>
      <p style={p}>Platformun niteliği gereği aşağıdaki bilgiler diğer kullanıcıların erişimine açık olabilir:</p>
      <ul style={ul}>
        <li style={li}>Profil fotoğrafı</li>
        <li style={li}>Vitrin başlığı ve açıklaması</li>
        <li style={li}>Şehir bilgisi</li>
        <li style={li}>Alınan değerlendirmeler</li>
        <li style={li}>Sertifika/CV belgesi paylaşılmış olduğunu gösteren rozet</li>
      </ul>
      <p style={p}>Sertifika ve CV dosyasının kendisi diğer kullanıcıların erişimine açık değildir; yalnızca kullanıcı tarafından görüntülenebilir. Platform içi mesaj geçmişi yalnızca mesajlaşmanın tarafları tarafından görülebilir. Telefon numarası, tam adres ve ödeme bilgileri diğer kullanıcılarla paylaşılmaz.</p>

      <h2 style={h2}>6. Toplanma Yöntemi ve Hukuki Sebebi</h2>
      <p style={p}>Kişisel verileriniz; İşinn internet sitesi/platformu üzerinden oluşturduğunuz hesap ve profiller, platform üzerinde gerçekleştirdiğiniz işlemler, mesajlaşma ve değerlendirme faaliyetleri, teknik altyapı ve kullanım süreçleri, telefon doğrulama ve ödeme işlemleri ile "Konumumu Kullan" fonksiyonu aracılığıyla elektronik ortamda toplanmaktadır.</p>
      <p style={p}>Kişisel verileriniz, işleme faaliyetinin niteliğine göre KVKK'nın 5. maddesinde düzenlenen şartlar (kanunlarda açıkça öngörülmesi, sözleşmenin kurulması/ifası, hukuki yükümlülüğün yerine getirilmesi, bir hakkın tesisi/korunması, veri sorumlusunun meşru menfaati) kapsamında işlenebilecektir. Açık rıza gerektiren durumlarda, açık rızanız ayrıca ve aydınlatma işleminden ayrı olarak alınacaktır.</p>

      <h2 style={h2}>7. Konum Verilerinin İşlenmesi</h2>
      <p style={p}>"Konumumu Kullan" özelliğini kullanmanız halinde tarayıcınız tarafından sağlanan GPS konumu, yalnızca size en yakın şehrin belirlenmesi amacıyla kullanılır ve kalıcı olarak kaydedilmez.</p>

      <h2 style={h2}>8. Çerezler</h2>
      <p style={p}>İşinn tarafından mevcut uygulamada pazarlama veya takip amacıyla kullanılan çerezler bulunmamaktadır. Platformda yalnızca oturumun devamlılığı için teknik olarak zorunlu bir oturum belirteci (session token) tarayıcınızda tutulmaktadır.</p>

      <h2 style={h2}>9. Kişisel Verilerin Saklanması</h2>
      <p style={p}>Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen saklama sürelerine uygun olarak muhafaza edilir. Hesabınızın silinmesi halinde profil, vitrin ve belgeleriniz kaldırılır; mevzuat uyarınca saklanması zorunlu kayıtlar ise öngörülen süre boyunca muhafaza edilebilir.</p>

      <h2 style={h2}>10. KVKK Kapsamındaki Haklarınız</h2>
      <p style={p}>
        KVKK'nın 11. maddesi uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep
        etme, işlenme amacını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini
        isteme, silinmesini/yok edilmesini isteme, bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme,
        otomatik sistemlerle analiz sonucu aleyhinize bir durum doğmasına itiraz etme ve kanuna aykırı işlenme
        nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz.
      </p>

      <h2 style={h2}>11. Başvuru Yöntemi</h2>
      <p style={p}>
        KVKK kapsamındaki haklarınızı kullanmak ve taleplerinizi iletmek için (hesap silme talepleri dahil){" "}
        <b>esra.gunes@codegtechnology.com</b> adresine başvurabilirsiniz. Başvurularınız, KVKK ve ilgili mevzuatta
        öngörülen usul ve esaslar ile yasal saklama zorunluluğu göz önünde bulundurularak değerlendirilir.
      </p>

      <h2 style={h2}>12. Yürürlük</h2>
      <p style={p}>İşbu Aydınlatma Metni, KVKK'nın 10. maddesi kapsamındaki aydınlatma yükümlülüğünün yerine getirilmesi amacıyla hazırlanmıştır.</p>
    </LegalPageLayout>
  );
}
