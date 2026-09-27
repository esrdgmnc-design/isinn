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
    faq: [
      { q: "80 m² bir daire için temizlik kaç saat sürer?", a: "Standart (haftalık/iki haftalık) temizlikte 3-4 saat, taşınma sonrası genel temizlikte bu sürenin 1.5-2 katı hesaplanmalı." },
      { q: "Temizlikçiye saatlik mi sabit fiyat mı ödenir?", a: "Düzenli temizlikte saatlik ücret, tek seferlik (taşınma sonrası, yıllık genel temizlik gibi) işlerde sabit paket fiyatı daha adil sonuç verir." },
    ],
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
    faq: [
      { q: "Özel ders öğretmeni seçerken en önemli kriter nedir?", a: "Diploma tek başına yetmez — mümkünse tek seferlik bir deneme dersiyle başlamak, öğretmenin çocukla nasıl bir iletişim kuracağını en iyi gösteren şeydir." },
      { q: "Öğretmenle hedef nasıl netleştirilir?", a: "\"Matematikte iyileşsin\" yerine \"kesirler ve oran-orantıda net kaybı var\" gibi somut bir hedef belirlemek, öğretmenin doğru bir çalışma planı kurmasını sağlar." },
    ],
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
    faq: [
      { q: "LGS hazırlığına nasıl başlanır?", a: "İlk adım konu tekrarı değil, bir deneme sınavıyla mevcut durumu görmektir — hangi konularda gerçek eksik, hangisi dikkatsizlik olduğunu ayırt etmeden kurulan plan kör atış olur." },
      { q: "LGS'de özel ders ne zaman fark yaratır?", a: "Genel tekrarda grup dersi yeterli olabilir; belirli bir konuda tıkanma varsa bire bir özel ders, öğretmenin tam olarak nerede takıldığını görüp müdahale etmesini sağladığı için daha hızlı sonuç verir." },
    ],
  },
  {
    slug: "ek-gelir-ve-freelance-is-yollari",
    title: "Ek Gelir ve Freelance İş: Becerinle Kazanmanın Yolları",
    description: "Evden ek gelir elde etmenin ya da freelance iş bulmanın en gerçekçi yolu: zaten bildiğin bir beceriyi, güvenilir bir vitrinle görünür kılmak.",
    category: "genel",
    bodyHtml: `
      <p>"Ek gelir" araması yapan çoğu kişi anket doldurma ya da reklam izleme gibi düşük getirili, sermayesiz görünen ama aslında zaman kaybettiren işlere yönlendiriliyor. Oysa elinde zaten bir <strong>beceri</strong> varsa (temizlik, çocuk bakımı, ders verme, el işi, tasarım, yazılım) en hızlı ve sürdürülebilir ek gelir yolu bu beceriyi doğrudan hizmete çevirmek — freelance platformlarda sıraya girmek ya da komisyonlu aracılara bağımlı kalmak yerine, doğrudan yerel müşteriyle buluşmak.</p>
      <h2>Hangi beceriyle nereden başlanır?</h2>
      <ul>
        <li><strong>Ev/ofis temizliği:</strong> Sermaye gerektirmez, talep her zaman var. Düzenli (haftalık) müşteri bulunca gelir öngörülebilir hale gelir.</li>
        <li><strong>Çocuk/yaşlı bakımı, oyun ablası-ağabeyi:</strong> Özellikle öğrenciler ve esnek zamanı olanlar için, boş saatleri gelire çevirmenin en doğal yolu.</li>
        <li><strong>Özel ders:</strong> Bir konuda gerçekten iyiysen (dil, matematik, enstrüman) tek bir öğrenciyle bile düzenli bir gelir kurulabilir.</li>
        <li><strong>El işi, nail art, tasarım:</strong> Ürettiğin bir şey varsa, portföyünü gösterecek bir vitrin satıştan daha fazlasını sağlar — güven de inşa eder.</li>
        <li><strong>Yazılım, çeviri, dijital işler:</strong> Klasik "freelance" tanımına en yakın alan; burada asıl fark, iş başına komisyon kesen aracılar yerine doğrudan teklif verebileceğin bir kanal bulmakta.</li>
      </ul>
      <h2>Freelance ile "hizmet vermek" farklı mı?</h2>
      <p>Hayır — ikisi de aynı şeyin farklı adları: birikimini/zamanını bir karşılık için sunmak. Fark, nasıl müşteri bulduğunda. Klasik freelance platformlarında genelde iş başına ücret kesilir ve rekabet küresel/çok kalabalıktır. Yerel bir hizmet olarak sunduğunda (özellikle temizlik, bakım, ders gibi fiziksel/yerel işlerde) rekabet küçülür, güven daha kolay kurulur çünkü müşteri seninle aynı şehirde, hatta aynı mahalledeki.</p>
      <h2>Nasıl başlanır?</h2>
      <p>Önce hangi beceriyle başlayacağına karar ver, sonra bunu anlatan basit bir vitrin oluştur: birkaç fotoğraf/örnek iş, net bir fiyat aralığı, hangi bölgede/nasıl çalıştığın. İşinn'de bir vitrin açmak birkaç dakika sürer, komisyon alınmaz — kazancının tamamı sana kalır. Şu an ilk 3 ay tüm özellikler ücretsiz.</p>
    `,
    ctaText: "Becerini bir vitrine dönüştür, ücretsiz başla",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "Evde oturarak en kolay nasıl ek gelir elde edilir?", a: "Zaten sahip olduğun bir beceriyi (temizlik, ders verme, el işi, tasarım gibi) doğrudan yerel bir hizmete çevirmek, anket/reklam izleme gibi düşük getirili yöntemlerden çok daha sürdürülebilir bir gelir yolu." },
      { q: "Freelance iş bulmak için nereden başlanır?", a: "Önce hangi beceride gerçekten iyi olduğuna karar ver, sonra bunu somut örneklerle (portföy, fiyat, çalışma şekli) anlatan bir vitrin/profil oluştur — doğrudan yerel/hedef kitleye ulaşmak, kalabalık genel platformlarda sıraya girmekten daha hızlı sonuç verir." },
      { q: "Ek gelir için hangi beceri en çok talep görüyor?", a: "Temizlik ve çocuk/yaşlı bakımı gibi düzenli tekrar eden ihtiyaçlar en istikrarlı geliri sağlar; özel ders ve el işi/tasarım gibi alanlar ise daha yüksek birim fiyatla ama daha az sıklıkla çalışmayı mümkün kılar." },
    ],
  },
];

export function findRehberPost(slug) {
  return REHBER_POSTS.find((p) => p.slug === slug) || null;
}
