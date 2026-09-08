import LegalPageLayout from "../../components/LegalPageLayout";

const h2 = { fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", marginTop: "1.75rem", marginBottom: "0.5rem" };
const p = { marginBottom: "0.75rem" };
const li = { marginBottom: "0.35rem" };
const note = { background: "#FFFBEB", border: "1px solid #F0E4C4", borderRadius: "0.75rem", padding: "0.9rem 1rem", fontSize: "0.8rem", color: "#92600A", marginBottom: "1.5rem" };
const fill = { color: "#9C4A3C", fontWeight: 700 };

export default function MesafeliSatisPage() {
  return (
    <LegalPageLayout title="Mesafeli Satış Sözleşmesi" updatedLabel="Taslak — henüz yürürlükte değil">
      <div style={note}>
        Bu metin taslaktır. Bir avukat tarafından, özellikle 6502 sayılı Tüketicinin Korunması Hakkında
        Kanun ve Mesafeli Sözleşmeler Yönetmeliği'ne uygunluk açısından, henüz onaylanmadı.
      </div>

      <h2 style={h2}>1. Taraflar</h2>
      <p style={p}>
        <b>Satıcı:</b> Code G Teknoloji ve Ticaret Limited Şirketi (Şişli, İstanbul — "İşinn", "Satıcı"), vergi
        no 2111455428, esra.gunes@codegtechnology.com.
      </p>
      <p style={p}>
        <b>Alıcı:</b> İşinn üzerinden ücretli üyelik (Standart Üyelik, Pro Üyelik) veya ek ürün (Öne Çıkarma
        Paketi) satın alan kullanıcı.
      </p>

      <h2 style={h2}>2. Sözleşmenin Konusu</h2>
      <p style={p}>
        İşbu sözleşme, Alıcı'nın İşinn platformu (isinn.com.tr) üzerinden elektronik ortamda sipariş verdiği,
        aşağıda nitelikleri ve satış fiyatı belirtilen dijital hizmetin satışı ve ifasına ilişkin olarak
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri
        gereğince tarafların hak ve yükümlülüklerini düzenler.
      </p>

      <h2 style={h2}>3. Hizmetin Niteliği ve İfa Şekli — Teslimat/Kargo</h2>
      <p style={p}>
        İşinn'de satılan tüm ürünler (Standart/Pro Üyelik, Öne Çıkarma Paketi) <b>dijital hizmetlerdir</b> —
        fiziksel bir ürün gönderimi, kargo veya teslimat söz konusu değildir. Satın alma onaylandığı anda
        hizmet elektronik ortamda, hesabınıza tanımlanarak <b>anında devreye girer</b> (örn. vitrin hakkının
        açılması, öne çıkarma rozetinin aktifleşmesi).
      </p>
      <p style={p}>
        <b>Önemli:</b> İşinn, hizmet arayan ile hizmet sunan kullanıcıları buluşturan bir aracı pazaryeridir.
        Kullanıcılar arasında görüşülüp anlaşılan (temizlik, tadilat, bakım vb.) hizmetler bu sözleşmenin
        konusu değildir — İşinn bu hizmetlerin satıcısı, tarafı ya da teslimatçısı değildir (bkz.{" "}
        <a href="/kullanim-sartlari" style={{ color: "#2563EB" }}>Kullanım Şartları</a> md. 2).
      </p>

      <h2 style={h2}>4. Fiyat ve Ödeme</h2>
      <p style={p}>
        Güncel fiyatlar <a href="/" style={{ color: "#2563EB" }}>Planlar</a> sayfasında KDV dahil olarak
        gösterilir. Ödeme, PayTR altyapısı üzerinden kredi/banka kartıyla alınır — kart bilgileri İşinn
        sunucularına hiç ulaşmaz. Abonelikler seçilen döngüye (aylık/yıllık) göre otomatik yenilenir; iptal
        edilmediği sürece bir sonraki dönem için tekrar tahsilat yapılır.
      </p>

      <h2 style={h2}>5. Cayma Hakkı</h2>
      <p style={p}>
        Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca, elektronik ortamda anında ifa edilen
        hizmetlere ilişkin sözleşmelerde, Alıcı hizmetin ifasının başlamasına (yani satın alma anına) onay
        vermişse cayma hakkını kullanamaz. Buna rağmen İşinn, ilk defa Pro/Standart Üyelik alan kullanıcılara{" "}
        <span style={fill}>[iade politikası netleşene kadar burada tutarlı bir taahhüt yazılmalı]</span> bir
        memnuniyet garantisi sunabilir — güncel koşullar için{" "}
        <a href="/iptal-iade-kosullari" style={{ color: "#2563EB" }}>İptal, İade ve Geri Ödeme Koşulları</a>{" "}
        sayfasına bakınız.
      </p>

      <h2 style={h2}>6. Uyuşmazlıkların Çözümü</h2>
      <p style={p}>
        İşbu sözleşmeden doğan uyuşmazlıklarda, T.C. Ticaret Bakanlığınca ilan edilen değere kadar Alıcı'nın
        yerleşim yerindeki Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda ise Tüketici
        Mahkemeleri yetkilidir.{" "}
        <span style={fill}>[Yetkili mahkeme/hakem heyeti maddesi avukatla kesinleştirilmelidir.]</span>
      </p>

      <h2 style={h2}>İletişim</h2>
      <p style={p}>Sorularınız için: esra.gunes@codegtechnology.com · 0536 460 36 82</p>
    </LegalPageLayout>
  );
}
