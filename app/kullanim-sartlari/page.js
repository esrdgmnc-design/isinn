import LegalPageLayout from "../../components/LegalPageLayout";

const h2 = { fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", marginTop: "1.75rem", marginBottom: "0.5rem" };
const p = { marginBottom: "0.75rem" };
const li = { marginBottom: "0.35rem" };
const ul = { listStyle: "disc", paddingLeft: "1.25rem" };

export default function KullanimSartlariPage() {
  return (
    <LegalPageLayout title="Kullanım Şartları" updatedLabel="Son güncelleme: 11.09.2026 — avukat incelemesinden geçmiştir">
      <h2 style={h2}>1. Taraflar ve Kabul</h2>
      <p style={p}>
        Bu Kullanım Şartları, İşinn platformunu ("Platform") kullanan tüm kullanıcılar ile Code G Teknoloji ve
        Ticaret Limited Şirketi (Şişli, İstanbul — "İşinn") arasındaki ilişkiyi düzenler. Platforma kayıt
        olarak bu şartları kabul etmiş sayılırsınız.
      </p>

      <h2 style={h2}>2. Platformun Niteliği — Önemli</h2>
      <p style={p}><b>İşinn bir aracı pazaryeridir, hizmetin tarafı değildir.</b> Hizmet arayan ile hizmet sunan kullanıcıları buluşturur; aralarındaki iş ilişkisinin, fiyatlandırmanın, işin yapılma şeklinin ve ödemenin tarafı değildir.</p>
      <ul style={ul}>
        <li style={li}><b>İşinn, kullanıcılar arasındaki ödemeye aracılık etmez, komisyon almaz.</b> Ödeme tamamen platform dışında gerçekleşir.</li>
        <li style={li}>İşinn, sağlayıcıların sunduğu hizmetin kalitesini garanti etmez, anlaşmazlıklarda taraf olmaz.</li>
        <li style={li}>"Belge paylaşıldı" rozeti bir belge yüklendiğini gösterir; İşinn bu belgelerin doğruluğunu doğrulamaz.</li>
      </ul>

      <h2 style={h2}>3. Hesap ve Uygunluk</h2>
      <ul style={ul}>
        <li style={li}>Platformu kullanmak için <b>18 yaşından büyük</b> olmanız gerekir.</li>
        <li style={li}>Doğru, güncel bilgiler girmekle yükümlüsünüz.</li>
        <li style={li}>Bir hesap yalnızca bir kişiye/işletmeye aittir; hesap güvenliğinden siz sorumlusunuz.</li>
      </ul>

      <h2 style={h2}>4. Yasak Kullanımlar</h2>
      <p style={p}>Aşağıdakiler kesinlikle yasaktır ve hesabın askıya alınmasına/kapatılmasına yol açar:</p>
      <ul style={ul}>
        <li style={li}>Sahte profil oluşturmak, başka birini taklit etmek</li>
        <li style={li}>Reşit olmayanları içeren herhangi bir görsel/video paylaşmak — bu tür içerik hiçbir koşulda onaylanmaz, tespit edilirse anında kaldırılır</li>
        <li style={li}>Taciz, tehdit, dolandırıcılık girişimi</li>
        <li style={li}>Platformu ilan edilenden farklı bir amaçla (spam, reklam, veri toplama) kullanmak</li>
        <li style={li}>Sahte değerlendirme bırakmak veya bırakılmasını talep etmek</li>
      </ul>

      <h2 style={h2}>5. Değerlendirme Sistemi</h2>
      <p style={p}>Değerlendirmeler yalnızca gerçekleşmiş, karşı tarafça "hizmeti aldım" olarak onaylanmış işler için bırakılabilir. Değerlendirmeler herkese açıktır; sağlayıcılar kendi vitrinlerine gelen değerlendirmelere herkese açık bir yanıt yazabilir.</p>

      <h2 style={h2}>6. Ücretlendirme</h2>
      <ul style={ul}>
        <li style={li}>Standart ve Pro üyelik ücretleri, seçtiğiniz plana göre aylık/yıllık tahsil edilir.</li>
        <li style={li}>İstediğiniz zaman iptal edebilirsiniz; iptal, mevcut faturalama döneminin sonunda geçerli olur.</li>
        <li style={li}>Ücretler kazandığınız gelirden bağımsızdır — İşinn işlemlerinizden komisyon <b>almaz</b>.</li>
        <li style={li}>Satın alma, iptal ve iade koşullarının detayı için: <a href="/mesafeli-satis-sozlesmesi" style={{ color: "#2563EB" }}>Mesafeli Satış Sözleşmesi</a> ve <a href="/iptal-iade-kosullari" style={{ color: "#2563EB" }}>İptal, İade ve Geri Ödeme Koşulları</a>.</li>
      </ul>

      <h2 style={h2}>7. Fikri Mülkiyet</h2>
      <p style={p}>Platforma yüklediğiniz içeriğin telif hakkı size aittir. Bu içeriğin İşinn üzerinde görüntülenmesi için bize gerekli lisansı vermiş olursunuz.</p>

      <h2 style={h2}>8. Sorumluluğun Sınırlandırılması</h2>
      <p style={p}>
        İşinn, kullanıcılar arasındaki hizmet ilişkisinden, ödemeden, hizmet kalitesinden veya kullanıcılar
        arası anlaşmazlıklardan doğan zararlardan sorumlu tutulamaz. Bu sınırlama; İşinn'in kastından veya
        ağır kusurundan kaynaklanan zararlar ile 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili
        mevzuatın emredici hükümleri saklı kalmak kaydıyla uygulanır.
      </p>

      <h2 style={h2}>9. Hesap Kapatma</h2>
      <p style={p}>İşinn, bu şartları ihlal eden hesapları önceden bildirimde bulunmaksızın askıya alabilir veya kapatabilir. Kullanıcı, hesabını dilediği zaman kapatabilir.</p>

      <h2 style={h2}>10. Değişiklikler</h2>
      <p style={p}>Bu şartlar zaman zaman güncellenebilir; önemli değişikliklerde kullanıcılar bilgilendirilir.</p>

      <h2 style={h2}>11. Uygulanacak Hukuk ve Yetkili Mercii</h2>
      <p style={p}>
        Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda, T.C. Ticaret Bakanlığınca ilan
        edilen parasal sınırlar dahilinde tüketicinin yerleşim yerindeki Tüketici Hakem Heyetleri veya Tüketici
        Mahkemeleri; bu sınırın üzerindeki veya tüketici sıfatı taşımayan uyuşmazlıklarda İstanbul (Çağlayan)
        Mahkemeleri ve İcra Daireleri yetkilidir.
      </p>

      <h2 style={h2}>İletişim</h2>
      <p style={p}>Sorularınız için: <b>esra.gunes@codegtechnology.com</b> · 0536 460 36 82</p>
    </LegalPageLayout>
  );
}
