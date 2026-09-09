import LegalPageLayout from "../../components/LegalPageLayout";

const h2 = { fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", marginTop: "1.75rem", marginBottom: "0.5rem" };
const p = { marginBottom: "0.75rem" };
const li = { marginBottom: "0.35rem" };

export default function IptalIadePage() {
  return (
    <LegalPageLayout title="İptal, İade ve Geri Ödeme Koşulları" updatedLabel="Son güncelleme: 09.09.2026">
      <h2 style={h2}>1. Ücretsiz Deneme</h2>
      <p style={p}>
        Standart Üyelik, kart bilgisi istemeden başlayan bir ücretsiz deneme süresiyle gelir (güncel süre{" "}
        <a href="/" style={{ color: "#2563EB" }}>Planlar</a> sayfasında belirtilir). Deneme süresince hiçbir
        ücret tahsil edilmez; deneme bitmeden istediğiniz zaman, ücretsiz ve gerekçesiz şekilde vazgeçebilirsiniz.
      </p>

      <h2 style={h2}>2. Abonelik İptali</h2>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}>Standart/Pro Üyelik ve Öne Çıkarma Paketi, profil sayfanızdan istediğiniz zaman iptal edilebilir.</li>
        <li style={li}>İptal, <b>mevcut faturalama döneminin sonunda</b> geçerli olur — o döneme kadar hizmete erişiminiz devam eder, kalan gün için orantılı iade yapılmaz.</li>
        <li style={li}>İptal sonrası bir sonraki dönem için otomatik tahsilat yapılmaz.</li>
      </ul>

      <h2 style={h2}>3. Geri Ödeme (İade)</h2>
      <p style={p}>
        Mesafeli Sözleşmeler Yönetmeliği'nin elektronik ortamda anında ifa edilen hizmetlere ilişkin istisnası
        gereği (bkz. <a href="/mesafeli-satis-sozlesmesi" style={{ color: "#2563EB" }}>Mesafeli Satış
        Sözleşmesi</a> md. 5), satın alma onaylanıp hizmet devreye girdikten sonra yasal bir cayma hakkı
        bulunmamaktadır. Buna rağmen:
      </p>
      <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
        <li style={li}>Yanlışlıkla yapılan veya mükerrer (aynı ürünün iki kez) tahsilatlarda tam iade yapılır.</li>
        <li style={li}>
          Teknik bir arıza nedeniyle satın aldığınız hizmeti (örn. Öne Çıkarma Paketi'nin aktifleşmemesi)
          kullanamadıysanız, sorunu bildirdiğiniz andan itibaren <b>3 iş günü</b> içinde tam iade veya sorunun
          giderilmesi tarafımızca sağlanır.
        </li>
        <li style={li}>
          Bunların dışındaki iade talepleri, İşinn'in kendi takdirine bağlı olarak tek seferlik bir iyi niyet
          iadesi olarak değerlendirilebilir; bu bir hak değil, işletmenin isteğe bağlı bir uygulamasıdır.
        </li>
      </ul>

      <h2 style={h2}>4. İade Süresi ve Yöntemi</h2>
      <p style={p}>
        Onaylanan iadeler, ödemenin yapıldığı karta, PayTR altyapısı üzerinden ve bankanızın işlem sürelerine
        bağlı olarak genellikle <b>7-14 iş günü</b> içinde yansır. İşinn nakit veya farklı bir yönteme iade
        yapmaz.
      </p>

      <h2 style={h2}>5. Kullanıcılar Arası Hizmet Ödemeleri</h2>
      <p style={p}>
        Bu sayfa yalnızca İşinn'e yapılan üyelik/ek ürün ödemelerini kapsar. Bir hizmet sağlayıcıya (temizlikçi,
        tadilatçı, öğretmen vb.) doğrudan yaptığınız ödemeler İşinn'in tarafı olmadığı, platform dışında
        gerçekleşen ödemelerdir — bu ödemelerin iadesi tamamen taraflar arasındaki anlaşmaya bağlıdır, İşinn
        aracılık etmez (bkz. <a href="/kullanim-sartlari" style={{ color: "#2563EB" }}>Kullanım Şartları</a> md. 2).
      </p>

      <h2 style={h2}>İletişim</h2>
      <p style={p}>İade talepleriniz için: esra.gunes@codegtechnology.com · 0536 460 36 82</p>
    </LegalPageLayout>
  );
}
