// SEO stratejisi dokümanı madde 4 (İçerik Stratejisi) — arama niyeti henüz
// "hizmet ara" aşamasında olmayan ama ileride müşteri/sağlayıcı olacak
// kişileri çeken rehber içerikleri. Gerçek, kısa ama işe yarar rehberler —
// dolgu/lorem ipsum yok. Yeni bir rehber eklerken sadece bu diziye bir kayıt
// eklemek yeterli, app/rehber/[slug]/page.js otomatik render eder.
export const REHBER_POSTS = [
  {
    slug: "ev-temizligi-kac-saat-surer",
    title: "Ev Temizliği İçin Kaç Saat Hesaplanmalı?",
    description: "Daire büyüklüğüne göre ev temizliği ne kadar sürer, temizlikçiye saatlik mi paket mi ödeme yapılır — pratik bir rehber.",
    category: "temizlik",
    bodyHtml: `
      <p>Ev temizliği süresi en çok üç şeye bağlı: metrekare, kirlilik seviyesi ve kaç kişinin çalıştığı. Aşağıdaki rakamlar tek bir temizlikçi için, standart (haftalık/iki haftalık) bir temizlik varsayımıyla verilmiştir — "genel temizlik" (taşınma sonrası, inşaat sonrası) bunun 1.5-2 katı sürebilir.</p>
      <ul>
        <li><strong>1+1 / 50-60 m²:</strong> 2-2.5 saat</li>
        <li><strong>2+1 / 80-100 m²:</strong> 3-4 saat</li>
        <li><strong>3+1 / 120-140 m²:</strong> 4-5.5 saat</li>
        <li><strong>4+1 ve üzeri:</strong> 6+ saat, genelde iki kişi önerilir</li>
      </ul>
      <p>Balkon, cam silme, fırın/buzdolabı içi gibi "ekstra" işler bu sürelere dahil değildir — temizlikçiyle görüşürken hangi işlerin standart pakete dahil olduğunu netleştirmek, sonradan yaşanan "bunu da yapman gerekiyordu" tartışmalarının önüne geçer.</p>
      <h2>Saatlik mi, paket mi?</h2>
      <p>Düzenli (haftalık/iki haftalık) temizlikte saatlik ücretlendirme daha adil olur — her seferinde aynı süre sürer. Taşınma sonrası ya da yılda bir yapılan "genel temizlik" gibi tek seferlik işlerde ise sabit paket fiyatı, süre belirsiz olduğu için her iki taraf için de daha öngörülebilirdir.</p>
      <p>İşinn'de her temizlikçi kendi fiyatlandırma tercihini (saatlik ya da sabit) vitrininde belirtir, böylece görüşmeye başlamadan önce hangi modelle çalıştığını görebilirsin.</p>
    `,
    ctaText: "İstanbul'da (ya da bulunduğun şehirde) güvenilir bir temizlikçi bul",
    ctaHref: "/kategori/temizlik",
  },
  {
    slug: "iyi-ozel-ders-ogretmeni-nasil-secilir",
    title: "İyi Bir Özel Ders Öğretmeni Nasıl Seçilir?",
    description: "Özel ders öğretmeni seçerken diplomaya bakmak yetmez — deneme dersi, iletişim tarzı ve hedef netliği gibi gerçekten fark yaratan kriterler.",
    category: "ogretmen",
    bodyHtml: `
      <p>"En iyi öğretmen" diye bir şey yok — "senin çocuğuna en uygun öğretmen" var. Seçim yaparken sırasıyla şunlara bakmak işe yarar:</p>
      <h2>1. Deneme dersi iste</h2>
      <p>Diploma ya da yıllar içindeki deneyim, öğretmenin senin çocuğunla nasıl bir kimya kuracağını göstermez. Mümkünse tek seferlik, düşük riskli bir deneme dersiyle başlayın — çocuğun dersten nasıl çıktığına (yorgun/bunalmış mı, meraklı mı) bakmak, uzun bir CV'den daha fazla şey söyler.</p>
      <h2>2. Hedefi net söyle</h2>
      <p>"Matematikte iyileşsin" çok genel bir hedef. "LGS'ye 4 ay kaldı, kesirler ve oran-orantı konusunda net kaybı var" gibi net bir hedef, öğretmenin doğru bir plan kurmasını sağlar — ilk görüşmede bu netliği sağlayan aileler genelde daha hızlı sonuç alır.</p>
      <h2>3. İletişim sıklığını konuş</h2>
      <p>Her ders sonrası kısa bir geri bildirim mi bekliyorsun, yoksa haftalık bir özet mi yeterli? Bunu baştan netleştirmemek, ilerleyen haftalarda en sık yaşanan memnuniyetsizlik sebebi.</p>
      <h2>4. Fiyat tek kriter olmasın</h2>
      <p>En ucuz öğretmen, sık öğretmen değiştirmeye (ve her seferinde sıfırdan başlamaya) yol açarsa uzun vadede daha pahalıya gelir. Fiyatı, deneme dersindeki gözlemlerinle birlikte değerlendir.</p>
    `,
    ctaText: "Bölgende özel ders öğretmenlerini incele",
    ctaHref: "/kategori/ogretmen",
  },
  {
    slug: "lgs-hazirlik-sureci-nasil-planlanir",
    title: "LGS Hazırlık Süreci Nasıl Planlanır?",
    description: "LGS'ye kalan süreye göre gerçekçi bir çalışma planı nasıl kurulur — konuya girmeden önce yapılması gereken tek şey.",
    category: "ogretmen",
    bodyHtml: `
      <p>LGS hazırlığında en sık yapılan hata, hemen konu tekrarına başlamak. Oysa ilk adım her zaman aynı: <strong>bir deneme sınavıyla mevcut durumu net olarak görmek.</strong> Hangi konularda gerçek eksik var, hangisi sadece dikkatsizlik — bu ayrım olmadan kurulan her plan kör atış olur.</p>
      <h2>Kalan süreye göre plan</h2>
      <ul>
        <li><strong>6+ ay:</strong> Konu eksiklerine odaklan, haftada 2-3 deneme yeterli. Bu dönemde hız değil, doğru anlama önemli.</li>
        <li><strong>3-6 ay:</strong> Konu tekrarı + haftalık deneme dengesi. Yanlış yapılan konular tekrar edilir, doğru yapılanlara az zaman ayrılır.</li>
        <li><strong>0-3 ay:</strong> Artık yeni konu öğrenme değil, hız ve dikkat çalışması dönemi — sık deneme, süre tutarak çözme, yanlış analizi.</li>
      </ul>
      <h2>Özel ders ne zaman fark yaratır?</h2>
      <p>Genel tekrar için grup dersleri yeterli olabilir, ama "belirli bir konuda tıkanma" durumunda bire bir özel ders çok daha hızlı sonuç verir — çünkü öğretmen doğrudan o çocuğun hangi adımda takıldığını görüp müdahale edebilir. Süreç ilerledikçe (son 2-3 ay) haftalık bire bir bir "eksik giderme" seansı, genel bir kurs paketinden daha verimli olabilir.</p>
      <h2>Aile için tek bir öneri</h2>
      <p>Sonuçtan (net sayısı) çok sürece (o hafta planlanan çalışma yapıldı mı) odaklanmak, hem çocuğun motivasyonunu hem de ailenin stresini azaltır.</p>
    `,
    ctaText: "LGS'ye yönelik özel ders öğretmeni bul",
    ctaHref: "/kategori/ogretmen",
  },
];

export function findRehberPost(slug) {
  return REHBER_POSTS.find((p) => p.slug === slug) || null;
}
