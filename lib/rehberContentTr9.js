// İki "ne kadar? 2026" fiyat rehberi (2026-11-05): web sitesi yaptırma ve sosyal medya yönetimi.
// Kurallar: her rakamın kaynağı metinde bağlantılı (2025-2026 tarihli ajans/meslek blogları);
// İşinn kendi fiyat vermez, aralıklar "kaynaklarda görülen" diye sunulur; rakip pazaryeri verisi kullanılmadı;
// kaynaklar arası farklar yan yana gösterildi. Fiyatlar değişebilir uyarısı her yazıda var.
const NOTE = `<p><em>Bu sayfadaki rakamlar bağlantısı verilen kaynaklarda yayımlanan aralıklardır; İşinn'in belirlediği ya da garanti ettiği fiyatlar değildir. Fiyatlar hızla değişebilir; kesin ücreti hizmet verenle konuşarak öğren.</em></p>`;

const KAREKOD = `<a href="https://www.karekod.org/blog/web-site-fiyati/" rel="nofollow noopener" target="_blank">Karekod, Mayıs 2026</a>`;
const BRAVERY_WEB = `<a href="https://braverytechnology.com/tr/web-sitesi-fiyatlari/" rel="nofollow noopener" target="_blank">Bravery Technology, Nisan 2026</a>`;
const BRAVERY_SM = `<a href="https://braverytechnology.com/tr/sosyal-medya-yonetimi-fiyatlari/" rel="nofollow noopener" target="_blank">Bravery Technology, Nisan 2026</a>`;
const MESLEKMAAS = `<a href="https://meslekmaas.com/sosyal-medya-uzmani-maaslari/" rel="nofollow noopener" target="_blank">meslekmaas.com, Kasım 2025</a>`;
const KONTENTINO = `<a href="https://www.kontentino.com/tr/blog/kucuk-isletmeler-icin-sosyal-medya-paketleri-fiyatlandirma-rehberi/" rel="nofollow noopener" target="_blank">Kontentino, Mayıs 2026</a>`;

export const REHBER_POSTS_TR9 = [
  {
    slug: "web-sitesi-yaptirma-fiyatlari-2026",
    title: "Web Sitesi Yaptırma Fiyatları 2026: Kurumsal 8.000–200.000 TL",
    description: "Kaynaklarda kurumsal site 8.000–200.000 TL, e-ticaret sitesi 15.000–750.000 TL ve üzeri. Freelance-ajans, hazır tema-özel yazılım farkı ve yıllık giderler.",
    category: "genel",
    bodyHtml: `
      <p>"Web sitesi yaptırmak ne kadar?" sorusunun tek cevabı yok. Fiyat sitenin türüne, tasarımın hazır mı özel mi olduğuna, işi kimin yaptığına ve sonradan ne kadar bakım gerektiğine göre değişiyor. Aşağıda 2026'da yayımlanmış iki ajans kaynağındaki aralıkları yan yana koyduk. İki kaynak da kendi tahminini veriyor; rakamlar birbirini tutmadığında ikisini de gösteriyoruz.</p>
      <h2>Tanıtım ve kurumsal site</h2>
      <p>Tek sayfalık bir tanıtım sitesi en basit seçenek. Birkaç sayfalık kurumsal site (hakkımızda, hizmetler, iletişim gibi) onun bir üstü.</p>
      <ul>
        <li><strong>Tek sayfa tanıtım (landing page):</strong> 10.000–22.000 TL (${KAREKOD})</li>
        <li><strong>Kurumsal site:</strong> 17.000–67.000 TL; daha kapsamlı "profesyonel şirket sitesi" 37.000–122.000 TL (${KAREKOD})</li>
        <li><strong>Kurumsal site, düzeylere göre:</strong> başlangıç 8.000–25.000 TL, profesyonel 25.000–75.000 TL, premium 75.000–200.000 TL; çok büyük kurumsal projeler 200.000 TL'nin üzerine çıkabiliyor (${BRAVERY_WEB})</li>
      </ul>
      <p>Karekod'a göre çok dilli yapı, müşteri yönetim sistemi (CRM) bağlantısı ve teknik SEO altyapısı fiyatı belirgin şekilde artırıyor.</p>
      <h2>E-ticaret sitesi</h2>
      <p>E-ticaret sitesi ürün yönetimi, ödeme ve kargo bağlantıları gerektirdiği için daha pahalı.</p>
      <ul>
        <li><strong>E-ticaret sitesi:</strong> 47.000–352.000 TL; WordPress tabanlı WooCommerce ile 37.000–182.000 TL (${KAREKOD})</li>
        <li><strong>Ölçeğe göre:</strong> mikro 15.000–40.000 TL, küçük 40.000–100.000 TL, orta 100.000–250.000 TL, büyük 250.000–750.000 TL ve üzeri (${BRAVERY_WEB})</li>
      </ul>
      <h2>Hazır tema mı, özel yazılım mı?</h2>
      <p>Hazır tema, önceden tasarlanmış bir şablonun senin içeriğinle uyarlanmasıdır. Özel yazılım ise her şeyin baştan senin ihtiyacına göre yazılmasıdır. Fark büyük:</p>
      <ul>
        <li><strong>Hazır tema ile site:</strong> 8.000–25.000 TL; özgün tasarım 40.000 TL'den başlıyor (${BRAVERY_WEB})</li>
        <li><strong>Özel yazılım:</strong> orta ölçekli projeler 150.000–400.000 TL, büyük projeler 500.000 TL'nin üzerinde (${BRAVERY_WEB}); özel yazılım web projesi 102.000 TL'den başlayıp 2.000.000 TL'yi aşabiliyor (${KAREKOD})</li>
        <li><strong>Hazır site kurucu platformlar</strong> (Wix, Squarespace gibi): aylık 500–3.000 TL (${BRAVERY_WEB})</li>
      </ul>
      <p>Küçük bir işletme için çoğu zaman hazır tema yeterli olur. Özel yazılım, hazır sistemlerin karşılamadığı bir iş akışın varsa anlam kazanır.</p>
      <h2>Freelance ile ajans arasındaki fiyat farkı</h2>
      <p>Bravery Technology'nin tablosunda freelancer'la yaptırılan site 5.000–30.000 TL, ajansla yaptırılan site 25.000–200.000 TL ve üzeri görünüyor. Aynı kaynak, freelancer fiyatlarının ajansa göre yüzde 30–50 daha düşük olabildiğini yazıyor (${BRAVERY_WEB}). Karekod freelance ile ajansı karşılaştırıyor ama rakam vermiyor.</p>
      <p>Fiyat tek ölçüt değil. Kiminle çalışacağına karar verirken iletişim, süreklilik ve bakım da önemli; bunun için <a href="/rehber/web-sitesi-freelancer-mi-ajans-mi">web sitesi için freelancer mı, ajans mı</a> rehberine bakabilirsin.</p>
      <h2>Her yıl ödenen giderler</h2>
      <p>Site bitince masraf bitmiyor. Alan adı ve barındırma (hosting) her yıl yenileniyor; bakım da çoğu zaman aylık ödeniyor.</p>
      <ul>
        <li><strong>Alan adı:</strong> yıllık 500–2.500 TL (${KAREKOD}); .com.tr için 150–300 TL, .com için 200–500 TL (${BRAVERY_WEB})</li>
        <li><strong>Hosting:</strong> yıllık 3.000–50.000 TL (${KAREKOD}); paylaşımlı hosting yıllık 2.000–5.000 TL, VPS yıllık 6.000–18.000 TL (${BRAVERY_WEB})</li>
        <li><strong>Teknik bakım:</strong> aylık 2.000–25.000 TL (${KAREKOD}); aylık bakım anlaşması 1.500–5.000 TL (${BRAVERY_WEB})</li>
      </ul>
      <p>Alan adı fiyatları arasındaki fark büyük. Uzantıya ve firmaya göre değiştiği için kayıt yaptıracağın firmanın güncel fiyatına bak.</p>
      <h2>Fiyatı ne artırır?</h2>
      <p>İki kaynakta da fiyatı yükselten etkenler benzer. Sayfa sayısı arttıkça iş uzar. Özgün tasarım, hazır temaya göre daha fazla emek ister. Çok dilli site her dil için ayrı içerik ve kontrol demektir. Rezervasyon, üyelik, ödeme ya da muhasebe programı gibi bağlantılar ek yazılım gerektirir. Metinleri ve fotoğrafları senin vermen süreyi kısaltır; hizmet verenin hazırlaması ise ayrı bir iştir.</p>
      <h2>Teklif alırken sorulacaklar</h2>
      <ul>
        <li>Kaç sayfa ve hangi bölümler fiyata dahil?</li>
        <li>Hazır tema mı kullanılacak, özel tasarım mı?</li>
        <li>Metinleri ve görselleri kim hazırlayacak?</li>
        <li>Alan adı, hosting ve ilk yıl bakımı fiyata dahil mi?</li>
        <li>Alan adı ve yönetim erişimleri kimin adına olacak?</li>
        <li>Kaç revizyon hakkı var?</li>
      </ul>
      <p>İşinn'de web sitesi yapan freelancer'ların ve ekiplerin vitrinlerine bakıp doğrudan mesajla fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Web sitesi yapanları keşfet",
    ctaHref: "/kategori/yazilim",
    faq: [
      { q: "2026'da kurumsal web sitesi yaptırmak ne kadar?", a: "Kaynaklara göre kurumsal site yaklaşık 8.000 TL'den başlıyor. Karekod 17.000–67.000 TL, kapsamlı şirket siteleri için 37.000–122.000 TL veriyor; Bravery Technology başlangıçtan premium düzeye 8.000–200.000 TL aralığı gösteriyor. Sayfa sayısı, tasarım ve entegrasyonlar fiyatı belirler." },
      { q: "E-ticaret sitesi kaç para?", a: "Kaynaklarda e-ticaret sitesi küçük projelerde 15.000–40.000 TL'den başlıyor; Karekod genel aralığı 47.000–352.000 TL, Bravery Technology büyük projeler için 250.000–750.000 TL ve üzeri veriyor. Ürün sayısı, ödeme ve kargo bağlantıları fiyatı artırır." },
      { q: "Web sitesinin yıllık gideri ne kadar?", a: "Alan adı, hosting ve bakım ayrıca ödenir. Kaynaklarda alan adı yıllık yaklaşık 150–2.500 TL, paylaşımlı hosting yıllık 2.000–5.000 TL, bakım ise aylık 1.500 TL'den başlayan aralıklarda görülüyor." },
    ],
  },
  {
    slug: "sosyal-medya-yonetimi-ucretleri-2026",
    title: "Sosyal Medya Yönetimi Ücretleri 2026: Aylık 5.000–200.000 TL",
    description: "Kaynaklarda aylık sosyal medya yönetimi freelance 5.000–50.000 TL, ajans 20.000–200.000 TL ve üzeri. Paket içeriği, reklam bütçesi, freelance-ajans farkı.",
    category: "genel",
    bodyHtml: `
      <p>Sosyal medya yönetimi genellikle aylık ücretle yapılır. Ücret; kaç platformda hesap yönetileceğine, ayda kaç paylaşım hazırlanacağına, video olup olmadığına ve işi kimin yaptığına göre değişiyor. Aşağıda 2025–2026'da yayımlanmış kaynaklardaki aralıkları yan yana koyduk.</p>
      <h2>Kaynaklarda görülen aylık ücretler</h2>
      <p>Bravery Technology, hizmet verene göre şu aylık aralıkları veriyor (${BRAVERY_SM}):</p>
      <ul>
        <li><strong>Yeni başlayan freelancer:</strong> 5.000–12.000 TL (1–2 platform, temel içerik)</li>
        <li><strong>Deneyimli freelancer:</strong> 12.000–25.000 TL (2–3 platform, strateji ve içerik)</li>
        <li><strong>Butik ajans:</strong> 20.000–45.000 TL (3–4 platform, strateji, içerik ve reklam yönetimi)</li>
        <li><strong>Orta ölçekli ajans:</strong> 40.000–80.000 TL (tüm platformlar)</li>
        <li><strong>Büyük ajans:</strong> 80.000–200.000 TL ve üzeri</li>
      </ul>
      <p>Meslek ve maaş rehberi meslekmaas.com ise freelance çalışan bir sosyal medya uzmanının müşteri başına aylık ücretini şöyle veriyor (${MESLEKMAAS}):</p>
      <ul>
        <li><strong>KOBİ:</strong> 15.000–25.000 TL (içerik üretimi, temel reklam yönetimi ve raporlama)</li>
        <li><strong>Orta ölçekli şirket:</strong> 25.000–50.000 TL (haftada 5 içerik, reklam yönetimi ve detaylı raporlama)</li>
      </ul>
      <p>İki kaynağın freelance rakamları birbirine yakın değil: biri 5.000 TL'den başlıyor, diğeri KOBİ için 15.000 TL'den. Fark büyük ölçüde paketin kapsamından geliyor.</p>
      <h2>Platforma göre ücretler</h2>
      <p>Tek bir platform için aylık ücretler (${BRAVERY_SM}):</p>
      <ul>
        <li><strong>Instagram:</strong> 8.000–30.000 TL; Reels videoları dahilse yüzde 30–50 artıyor</li>
        <li><strong>TikTok:</strong> 12.000–35.000 TL</li>
        <li><strong>Facebook:</strong> 6.000–20.000 TL</li>
        <li><strong>LinkedIn:</strong> 6.000–18.000 TL</li>
        <li><strong>X (Twitter):</strong> 5.000–15.000 TL</li>
      </ul>
      <p>Aynı kaynağa göre birden fazla platform birlikte alındığında yüzde 15–25 indirim yapılabiliyor.</p>
      <h2>Freelance ile ajans arasındaki fark</h2>
      <p>Bravery Technology'nin örneğinde ayda 20 paylaşım, haftada 2 Reels, yorum ve mesajlara yanıt (topluluk yönetimi) ve aylık rapor içeren bir iş, reklam hariç, freelancer'da 15.000–25.000 TL, ajansta 35.000–65.000 TL tutuyor. Kaynak, aynı kapsam için ajansa freelancer'ın yaklaşık 2–3 katı ödenebileceğini yazıyor (${BRAVERY_SM}).</p>
      <p>Ajans genellikle tasarımcı, video ekibi ve reklam uzmanını bir arada sunar. Freelancer'la çalışırken işi yapan kişiyle doğrudan konuşursun. Görüşmeye hazırlıklı gitmek için <a href="/rehber/freelancer-ile-calismadan-once-sorulacak-sorular">freelancer'a sorulacak sorular</a> rehberine bakabilirsin.</p>
      <h2>Reklam bütçesi ayrıca ödenir</h2>
      <p>Aylık yönetim ücreti, Instagram ya da TikTok'ta reklam vermenin parası değildir. Bravery Technology'ye göre reklam bütçesi platforma ayrıca ödeniyor. Reklamları yöneten kişi ya da ajans bunun için ayrı ücret alabiliyor: reklam bütçesinin yüzde 15–25'i ya da aylık 5.000–20.000 TL sabit tutar (${BRAVERY_SM}). Teklif alırken "Bu fiyata reklam harcaması dahil mi?" diye mutlaka sor.</p>
      <h2>Paketlerde genellikle ne olur?</h2>
      <p>Kontentino'nun küçük işletmeler için yazdığı rehberde (fiyatlar avro cinsinden, Türkiye'ye özel değil) paketlerin kapsamı şöyle anlatılıyor (${KONTENTINO}):</p>
      <ul>
        <li><strong>Temel paket:</strong> ayda 8–12 paylaşım, 1–2 platform, şablon tasarımlar, zamanlama ve basit aylık rapor</li>
        <li><strong>Orta paket:</strong> ayda 15–25 paylaşım, 2–3 platform, markaya özel içerik, onaylı içerik takvimi, sınırlı topluluk yönetimi ve aylık rapor</li>
        <li><strong>Kapsamlı paket:</strong> ayda 30'dan fazla paylaşım, 3–5 platform, içerik stratejisi, fotoğraf ya da video yönetimi, aktif topluluk yönetimi ve reklam kampanyası desteği</li>
      </ul>
      <h2>Fiyatı ne artırır?</h2>
      <p>Kaynaklarda öne çıkan etkenler şunlar: yönetilen platform sayısı, aylık paylaşım adedi, video ve Reels üretimi, yorum ve mesajlara yanıt verilmesi, reklam yönetimi ve raporun ayrıntısı. Fotoğraf ya da video çekimi için yerinde çalışma gerekiyorsa bu da ücrete eklenir. Bu yüzden iki teklifi karşılaştırırken yalnızca toplam fiyata değil, pakette ne olduğuna bak. Düşük fiyatlı bir paket, ayda birkaç şablon paylaşımdan ibaret olabilir.</p>
      <h2>Teklif alırken sorulacaklar</h2>
      <ul>
        <li>Ayda kaç paylaşım, kaç hikâye, kaç video var?</li>
        <li>Fotoğraf ve video çekimi fiyata dahil mi?</li>
        <li>Yorum ve mesajlara kim yanıt veriyor?</li>
        <li>Reklam yönetimi dahil mi, reklam bütçesi ayrı mı?</li>
        <li>Rapor ne sıklıkta geliyor?</li>
        <li>Hesapların şifreleri ve yönetici yetkisi kimde kalacak?</li>
      </ul>
      <p>İşinn'de sosyal medya hizmeti verenlerin vitrinlerine bakıp doğrudan mesajla fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Sosyal medya hizmeti verenleri keşfet",
    ctaHref: "/kategori/sosyal-medya",
    faq: [
      { q: "Sosyal medya yönetimi aylık ne kadar 2026?", a: "Kaynaklara göre aylık ücret freelancer'da yaklaşık 5.000–25.000 TL, KOBİ ve orta ölçekli şirket işlerinde 15.000–50.000 TL; ajanslarda 20.000 TL'den başlayıp büyük ajanslarda 200.000 TL'yi aşabiliyor. Platform sayısı, paylaşım adedi ve video fiyatı belirler." },
      { q: "Reklam bütçesi sosyal medya ücretine dahil mi?", a: "Genellikle hayır. Reklam bütçesi platforma ayrıca ödenir. Reklamları yöneten kişi ya da ajans bunun için ayrıca ücret alabilir; bir kaynakta bu ücret reklam bütçesinin yüzde 15–25'i ya da aylık 5.000–20.000 TL olarak geçiyor." },
      { q: "Sadece Instagram yönetimi ne kadar?", a: "Bravery Technology'nin 2026 rehberine göre yalnızca Instagram yönetimi aylık 8.000–30.000 TL; Reels videoları da hazırlanıyorsa fiyat yüzde 30–50 artabiliyor." },
    ],
  },
];

export const REHBER_META_TR9 = {
  "web-sitesi-yaptirma-fiyatlari-2026": {
    published: "2026-11-05", updated: "2026-11-05",
    shortAnswer: "2026 kaynaklarına göre tek sayfa tanıtım sitesi yaklaşık 10.000–22.000 TL, kurumsal site 8.000–200.000 TL, e-ticaret sitesi 15.000 TL'den başlayıp 750.000 TL'yi aşabiliyor. Hazır tema özel yazılımdan çok daha ucuz. Alan adı, hosting ve bakım her yıl ayrıca ödenir.",
  },
  "sosyal-medya-yonetimi-ucretleri-2026": {
    published: "2026-11-05", updated: "2026-11-05",
    shortAnswer: "2025–2026 kaynaklarına göre aylık sosyal medya yönetimi freelancer'da yaklaşık 5.000–50.000 TL, ajansta 20.000–200.000 TL ve üzeri. Platform sayısı, paylaşım adedi ve video fiyatı belirler. Reklam bütçesi genellikle ücrete dahil değildir, platforma ayrıca ödenir.",
  },
};
