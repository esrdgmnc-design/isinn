import LegalPageLayout from "../../components/LegalPageLayout";

const h2 = { fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", marginTop: "1.75rem", marginBottom: "0.5rem" };
const p = { marginBottom: "0.75rem" };
const li = { marginBottom: "0.35rem" };
const note = { background: "#FFFBEB", border: "1px solid #F0E4C4", borderRadius: "0.75rem", padding: "0.9rem 1rem", fontSize: "0.8rem", color: "#92600A", marginBottom: "1.5rem" };
const fill = { color: "#9C4A3C", fontWeight: 700 };

export default function KvkkPage() {
  return (
    <LegalPageLayout title="KVKK Aydınlatma Metni" updatedLabel="Taslak — henüz yürürlükte değil">
      <div style={note}>
        Bu metin taslaktır. <span style={fill}>[köşeli parantez]</span> içindeki alanlar doldurulmadan ve bir
        avukat/KVKK danışmanı tarafından onaylanmadan yürürlüğe girmemiştir.
      </div>

      <h2 style={h2}>1. Veri Sorumlusu</h2>
      <p style={p}>
        <span style={fill}>[Şirket/şahıs unvanı]</span> ("İşinn", "biz") olarak, 6698 sayılı Kişisel Verilerin
        Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla, aşağıda açıklanan kapsamda kişisel
        verilerinizi işlemekteyiz.
      </p>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}>Unvan: <span style={fill}>[doldurulacak]</span></li>
        <li style={li}>Adres: <span style={fill}>[doldurulacak]</span></li>
        <li style={li}>Vergi No / T.C. Kimlik No: <span style={fill}>[doldurulacak]</span></li>
        <li style={li}>E-posta: <span style={fill}>[doldurulacak]</span></li>
      </ul>

      <h2 style={h2}>2. İşlenen Kişisel Veri Kategorileri</h2>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}><b>Kimlik ve iletişim:</b> Ad-soyad/işletme adı, e-posta, telefon numarası</li>
        <li style={li}><b>Görsel/işitsel veri:</b> Profil fotoğrafı, tanıtım videosu, portföy fotoğraf/videoları</li>
        <li style={li}><b>Mesleki bilgi:</b> Sertifikalar, CV, iş deneyimi açıklaması</li>
        <li style={li}><b>Konum verisi:</b> Şehir/semt bilgisi; "Konumumu Kullan" özelliğinde GPS konumu (cihaz izniyle)</li>
        <li style={li}><b>İşlem güvenliği:</b> Şikayet/rapor, engelleme kayıtları, hesap zaman damgaları</li>
        <li style={li}><b>Müşteri işlem verisi:</b> Mesajlar, değerlendirme/yorum metinleri, favoriler</li>
        <li style={li}><b>Abonelik bilgisi:</b> Seçilen plan, faturalama döngüsü (kart bilgisi bizde saklanmaz, ödeme sağlayıcı üzerinden işlenir)</li>
      </ul>

      <h2 style={h2}>3. İşlenme Amaçları</h2>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}>Hizmet sağlayıcı ile hizmet arayan kullanıcıları buluşturmak</li>
        <li style={li}>Hesap oluşturma, kimlik doğrulama ve profil yönetimi</li>
        <li style={li}>Mesajlaşma altyapısının çalışması</li>
        <li style={li}>Değerlendirme sisteminin işletilmesi, sahte değerlendirmelerin önlenmesi</li>
        <li style={li}>Kullanıcı güvenliği: şikayet/engelleme, yapay zeka destekli şüpheli içerik ön kontrolü</li>
        <li style={li}>Abonelik ve ücretli ek ürünlerin yönetimi</li>
        <li style={li}>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2 style={h2}>4. Kişisel Verilerin Aktarıldığı Taraflar</h2>
      <p style={p}>Hizmetin sunulabilmesi için verileriniz aşağıdaki hizmet sağlayıcılarla (veri işleyenlerle) paylaşılır:</p>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}><b>Supabase Inc.</b> — veritabanı ve depolama altyapısı</li>
        <li style={li}><b>Anthropic PBC (Claude AI)</b> — fotoğraf/içerik uygunluk kontrolü, arama, yazım yardımı gibi özellikler için ilgili içerik işlenmek üzere gönderilir. <span style={fill}>Yurt dışı</span> yerleşiktir.</li>
        <li style={li}><span style={fill}>[PayTR]</span> — abonelik ödemelerinin işlenmesi</li>
        <li style={li}><span style={fill}>[Netgsm]</span> — telefon doğrulama SMS'i</li>
        <li style={li}>Yetkili kamu kurum ve kuruluşları — yasal bir talep olması halinde</li>
      </ul>

      <h2 style={h2}>5. Hukuki Sebep</h2>
      <p style={p}>Sözleşmenin kurulması/ifası (KVKK md. 5/2-c), açık rızanız (md. 5/1), hukuki yükümlülük (md. 5/2-ç) ve meşru menfaat (md. 5/2-f) hukuki sebeplerine dayanılarak.</p>

      <h2 style={h2}>6. Haklarınız (KVKK md. 11)</h2>
      <p style={p}>
        Kişisel verinizin işlenip işlenmediğini öğrenme, bilgi talep etme, aktarıldığı üçüncü kişileri bilme,
        düzeltme/silme talep etme, itiraz etme ve zararın giderilmesini isteme haklarına sahipsiniz.
        Başvurularınızı <span style={fill}>[e-posta adresi]</span> üzerinden iletebilirsiniz.
      </p>
    </LegalPageLayout>
  );
}
