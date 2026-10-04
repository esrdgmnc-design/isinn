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
      <p>Önce hangi beceriyle başlayacağına karar ver, sonra bunu anlatan basit bir vitrin oluştur: birkaç fotoğraf/örnek iş, net bir fiyat aralığı, hangi bölgede/nasıl çalıştığın. İşinn'de bir vitrin açmak birkaç dakika sürer, komisyon alınmaz — kazancının tamamı sana kalır. 20 Aralık 2026'ya kadar tüm özellikler ücretsiz.</p>
    `,
    ctaText: "Becerini bir vitrine dönüştür, ücretsiz başla",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "Evde oturarak en kolay nasıl ek gelir elde edilir?", a: "Zaten sahip olduğun bir beceriyi (temizlik, ders verme, el işi, tasarım gibi) doğrudan yerel bir hizmete çevirmek, anket/reklam izleme gibi düşük getirili yöntemlerden çok daha sürdürülebilir bir gelir yolu." },
      { q: "Freelance iş bulmak için nereden başlanır?", a: "Önce hangi beceride gerçekten iyi olduğuna karar ver, sonra bunu somut örneklerle (portföy, fiyat, çalışma şekli) anlatan bir vitrin/profil oluştur — doğrudan yerel/hedef kitleye ulaşmak, kalabalık genel platformlarda sıraya girmekten daha hızlı sonuç verir." },
      { q: "Ek gelir için hangi beceri en çok talep görüyor?", a: "Temizlik ve çocuk/yaşlı bakımı gibi düzenli tekrar eden ihtiyaçlar en istikrarlı geliri sağlar; özel ders ve el işi/tasarım gibi alanlar ise daha yüksek birim fiyatla ama daha az sıklıkla çalışmayı mümkün kılar." },
      { q: "Yapay zeka ile video/web tasarımı becerimi nasıl gelire çevirebilirim?", a: "Bunu Instagram'da paylaşıp beğeni beklemek yerine, düzgün bir web sitesi ya da tanıtım videosuna ihtiyacı olan küçük işletmelere doğrudan ulaşabileceğin bir vitrine dönüştürebilirsin — çoğu küçük işletmenin bunu kendi başına yapacak vakti ya da bilgisi yok." },
    ],
  },
  {
    slug: "birkac-bin-takipci-ile-yerel-isletmelerden-sponsorluk",
    title: "Birkaç Bin Takipçin Var mı? Yerel İşletmelerden Nasıl Sponsorluk Alırsın",
    description: "Ünlü olmana gerek yok — birkaç bin gerçek, etkileşimli takipçi, senin şehrindeki bir işletme için ulusal bir reklamdan daha değerli olabilir.",
    category: "sosyal-medya",
    bodyHtml: `
      <p>Çoğu kişi "influencer olmak" için yüz binlerce takipçi gerektiğini düşünüyor, oysa gerçek durum farklı: <strong>yerel bir işletme için senin 2-3 bin takipçin, ulusal bir hesabın 200 bin takipçisinden daha değerli olabilir</strong> — çünkü senin takipçilerinin büyük kısmı muhtemelen aynı şehirde, hatta aynı mahallede. Bir kafe, kuaför ya da el işi satıcısı için bu, tam olarak ulaşmak istediği kitle demek.</p>
      <h2>Neden yerel işletmeler küçük hesapları tercih eder?</h2>
      <ul>
        <li><strong>Bütçe:</strong> Büyük hesaplar tek gönderi için binlerce lira isterken, küçük/orta ölçekli bir işletme bunu karşılayamaz — senin fiyatın onun bütçesine uyar.</li>
        <li><strong>Hedef kitle örtüşmesi:</strong> Ulusal bir hesabın takipçisinin %90'ı o işletmeye hiç gidemeyecek kadar uzakta. Seninkiler gidebilir.</li>
        <li><strong>Samimiyet:</strong> Küçük hesaplarda etkileşim oranı genelde daha yüksek — takipçiler seni "reklam panosu" değil, tanıdığı biri gibi görüyor.</li>
      </ul>
      <h2>Nasıl teklif hazırlarsın?</h2>
      <p>İlk teklifini büyük bir ücretle değil, düşük riskli bir teklifle başlat: "ürün/hizmet karşılığında 1 gönderi" gibi. İşe yaradığını gördükten sonra küçük bir ücret eklemeye geçebilirsin. Yanında basit bir "medya kartı" bulundur: takipçi sayın, ortalama etkileşim oranın, takipçilerinin yaşadığı şehir/ilçe (Instagram/TikTok'un kendi istatistiklerinden alınabilir).</p>
      <h2>Hangi işletmelere gidersin?</h2>
      <p>En kolay "evet" aldığın yer, zaten senin gerçekten kullandığın/beğendiğin yerel işletmelerdir — kendi mahallendeki bir kafe, kuaför, kişisel eğitmen ya da el işi satıcısı. Soğuk bir markaya değil, sıcak bir ilişkiye teklif götürüyorsun.</p>
      <h2>Bunu sürdürülebilir bir gelire nasıl çevirirsin?</h2>
      <p>Tek seferlik anlaşmalar yerine, bir vitrin oluşturup "yerel işletme tanıtımı" hizmeti olarak sunmak, işletmelerin seni tekrar tekrar bulmasını sağlar — tek tek DM atmak yerine, onlar sana ulaşır. İşinn'de bir vitrin açmak birkaç dakika sürer, komisyon alınmaz.</p>
      <h2>Ya teknoloji/tasarımda iyiysen?</h2>
      <video src="/videos/dijital-tasarim-ilham.mp4" autoplay loop muted playsinline style="width:100%;border-radius:16px;margin:20px 0;display:block;"></video>
      <p>Bugün pek çok kişi yapay zeka araçlarıyla etkileyici videolar üretebiliyor, göz alıcı web siteleri tasarlayabiliyor — ama bunu sergileyecek bir yer genelde sadece Instagram'dan ibaret kalıyor. Oysa bu tam olarak bir işe dönüşebilecek bir beceri: küçük işletmelerin çoğunun ne düzgün bir web sitesi ne de dikkat çekici bir tanıtım videosu var, ve bunu kendi başlarına yapacak vakitleri/bilgileri yok.</p>
      <p>Yazılım geliştirme, web tasarımı, video düzenleme ya da AI destekli içerik üretimi konusunda elin yatkınsa, bunu Instagram'da paylaşıp beğeni beklemek yerine, doğrudan ihtiyacı olan işletmelere ulaşabileceğin bir vitrine dönüştürebilirsin.</p>
    `,
    ctaText: "Sosyal medya tanıtım hizmeti vitrinini oluştur, ücretsiz başla",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "Kaç takipçiyle yerel işletmelerden sponsorluk alınır?", a: "Kesin bir eşik yok — birkaç bin gerçek, etkileşimli takipçi bile yeterli olabilir, özellikle takipçilerin çoğu aynı şehirde/mahaldeyse. Büyük hesaplardan çok, hedef kitle örtüşmesi önemli." },
      { q: "Yerel bir işletmeye ilk teklif nasıl sunulur?", a: "Yüksek bir ücretle başlamak yerine, ürün/hizmet karşılığında tek bir gönderi gibi düşük riskli bir teklifle başlamak, işe yaradığını gördükten sonra küçük bir ücrete geçmek daha gerçekçi bir yoldur." },
      { q: "Mikro influencer ücretini nasıl belirler?", a: "Takipçi sayısı, ortalama etkileşim oranı ve takipçilerin yaşadığı bölge gibi bilgileri içeren basit bir 'medya kartı' hazırlamak, hem teklifi somutlaştırır hem de fiyatı gerekçelendirmeyi kolaylaştırır." },
    ],
  },
  {
    slug: "ev-tadilatinda-usta-secerken-nelere-dikkat-edilmeli",
    title: "Ev Tadilatında Usta Seçerken Nelere Dikkat Edilmeli?",
    description: "Tadilat ustası seçerken fiyat teklifi, malzeme, süre ve garanti konusunda nelere dikkat etmeli — pratik bir kontrol listesi.",
    category: "tadilat",
    bodyHtml: `
      <p>Tadilat işlerinde en çok anlaşmazlık, işe başlamadan önce net konuşulmayan üç şeyden çıkar: malzeme kim tarafından temin ediliyor, süre ne kadar ve fiyat neyi kapsıyor. Bunları görüşmenin başında netleştirmek, iş bittikten sonra yaşanan "bu da mı dahil değildi" tartışmalarının önüne geçer.</p>
      <h2>Fiyat teklifi neyi kapsamalı?</h2>
      <p>Sadece "işçilik" mi yoksa "işçilik + malzeme" mi olduğu baştan netleşmeli. Malzeme ayrıysa, hangi kalitede/markada malzeme kullanılacağı da konuşulmalı — aksi halde ustanın seçtiği malzeme beklenenden düşük kalitede çıkabilir.</p>
      <h2>Süre ve ödeme planı</h2>
      <p>Büyük işlerde (mutfak/banyo yenileme gibi) tamamı peşin ödemek yerine, işin aşamalarına bağlı bir ödeme planı (ör. başlangıçta bir kısmı, iş bitince kalanı) her iki taraf için de daha güvenli bir yöntemdir. Tahmini bitiş tarihinin de baştan konuşulması, gecikme durumunda neyin "normal" neyin "gecikme" sayılacağını netleştirir.</p>
      <p>İşinn'de her usta kendi vitrininde geçmiş işlerinden fotoğraflar paylaşır — bir teklif almadan önce bu portföyü incelemek, ustanın gerçekten benzer işler yapıp yapmadığını görmenin en hızlı yoludur.</p>
    `,
    ctaText: "Bulunduğun şehirde güvenilir bir usta bul",
    ctaHref: "/kategori/tadilat",
    faq: [
      { q: "Tadilat fiyat teklifi alırken nelere dikkat etmeli?", a: "Teklifin işçilik mi yoksa işçilik+malzeme mi olduğunu, malzeme kalitesini ve varsa ek/ekstra iş ücretlerini baştan netleştirmek gerekir." },
      { q: "Tadilat işinde ödeme nasıl planlanmalı?", a: "Büyük işlerde tamamını peşin ödemek yerine, işin aşamalarına bağlı (başta bir kısım, bitince kalan) bir ödeme planı her iki taraf için de daha güvenlidir." },
    ],
  },
  {
    slug: "cocuk-bakicisi-secerken-sorulmasi-gereken-sorular",
    title: "Çocuk Bakıcısı Seçerken Sorulması Gereken Sorular",
    description: "Çocuk bakıcısı görüşmesinde deneyim, ilk yardım bilgisi ve referans dışında sorulması gereken pratik sorular.",
    category: "bakici",
    bodyHtml: `
      <p>Bir çocuk bakıcısıyla ilk görüşmede "deneyimin var mı" sorusu tek başına yeterli değil — asıl fark yaratan, günlük rutine ve acil durumlara nasıl yaklaştığı. Aşağıdaki sorular, görüşmeyi genel bir sohbetten somut bir değerlendirmeye çevirir.</p>
      <h2>Günlük rutin ve iletişim</h2>
      <p>"Çocuk ağladığında/inatlaştığında ne yaparsın?" gibi somut bir senaryo sorusu, hazır bir cevaptan çok daha fazla şey anlatır. Gün içinde ebeveynle nasıl iletişim kuracağı (fotoğraf/mesaj sıklığı gibi) de baştan netleşmeli — beklenti farkı sonradan güven sorununa dönüşebilir.</p>
      <h2>Acil durum bilgisi</h2>
      <p>Temel ilk yardım bilgisi olup olmadığı, daha önce benzer yaşta bir çocukla çalışıp çalışmadığı ve acil bir durumda kimi arayacağını bilip bilmediği mutlaka sorulmalı. Deneme süreci olmadan uzun vadeli bir anlaşma yapmak yerine, ilk birkaç günü kısa bir deneme süresi olarak planlamak, hem çocuğun hem bakıcının birbirine uyup uymadığını görmek için daha sağlıklı bir yöntemdir.</p>
      <p>İşinn'de bakıcılar telefon doğrulamasıyla platformda yer alır; vitrinlerinde deneyim alanlarını (bebek, okul öncesi, özel gereksinim gibi) ve varsa geçmiş aile yorumlarını görebilirsin.</p>
    `,
    ctaText: "Bulunduğun şehirde güvenilir bir bakıcı bul",
    ctaHref: "/kategori/bakici",
    faq: [
      { q: "Çocuk bakıcısı görüşmesinde en önemli soru nedir?", a: "Genel deneyim sorusundan çok, 'çocuk ağladığında/inatlaştığında ne yaparsın' gibi somut bir senaryo sorusu, bakıcının gerçek yaklaşımını gösterir." },
      { q: "Çocuk bakıcısıyla çalışmaya nasıl başlanmalı?", a: "Uzun vadeli bir anlaşma yapmadan önce birkaç günlük kısa bir deneme süresi, çocuk ve bakıcının birbirine uyup uymadığını görmek için daha sağlıklı bir yöntemdir." },
    ],
  },
];

export function findRehberPost(slug) {
  return REHBER_POSTS.find((p) => p.slug === slug) || null;
}
