// SEO stratejisi dokümanı madde 4 (İçerik Stratejisi) — arama niyeti henüz
// "hizmet ara" aşamasında olmayan ama ileride müşteri/sağlayıcı olacak
// kişileri çeken rehber içerikleri. Gerçek, kısa ama işe yarar rehberler —
// dolgu/lorem ipsum yok. Yeni bir rehber eklerken sadece bu diziye bir kayıt
// eklemek yeterli, app/rehber/[slug]/page.js otomatik render eder.
import { REHBER_POSTS_EN, REHBER_META_EN } from "./rehberContentEn.js";
import { REHBER_POSTS_EN2, REHBER_META_EN2 } from "./rehberContentEn2.js";
import { REHBER_POSTS_TR2, REHBER_META_TR2 } from "./rehberContentTr2.js";
import { REHBER_POSTS_TR3, REHBER_META_TR3 } from "./rehberContentTr3.js";
import { REHBER_POSTS_TR4, REHBER_META_TR4 } from "./rehberContentTr4.js";
import { REHBER_POSTS_TR5, REHBER_META_TR5 } from "./rehberContentTr5.js";
import { REHBER_POSTS_TR6, REHBER_META_TR6 } from "./rehberContentTr6.js";
import { REHBER_POSTS_TR7, REHBER_META_TR7 } from "./rehberContentTr7.js";
import { REHBER_POSTS_TR8, REHBER_META_TR8 } from "./rehberContentTr8.js";
import { REHBER_POSTS_TR9, REHBER_META_TR9 } from "./rehberContentTr9.js";
import { REHBER_POSTS_TR10, REHBER_META_TR10 } from "./rehberContentTr10.js";
import { REHBER_POSTS_TR11, REHBER_META_TR11 } from "./rehberContentTr11.js";
import { REHBER_POSTS_TR12, REHBER_META_TR12 } from "./rehberContentTr12.js";

const REHBER_POSTS_TR = [
  {
    slug: "ev-temizligi-kac-saat-surer",
    title: "Ev Temizliği İçin Kaç Saat Hesaplanmalı?",
    description: "Daire büyüklüğüne göre ev temizliği ne kadar sürer, temizlikçiye saatlik mi paket mi ödeme yapılır — pratik bir rehber.",
    category: "temizlik",
    bodyHtml: `
      <p>Ev temizliği süresi en çok üç şeye bağlı: metrekare, kirlilik seviyesi ve kaç kişinin çalıştığı. Aşağıdaki süreler ölçüm ya da kaynaklı veri değil, İşinn'in yaklaşık tahminleridir; tek bir temizlikçi için, standart (haftalık/iki haftalık) bir temizlik varsayımıyla verilmiştir — "genel temizlik" (taşınma sonrası, inşaat sonrası) bunun 1.5-2 katı sürebilir.</p>
      <ul>
        <li><strong>1+1 / 50-60 m²:</strong> yaklaşık 2-2.5 saat</li>
        <li><strong>2+1 / 80-100 m²:</strong> yaklaşık 3-4 saat</li>
        <li><strong>3+1 / 120-140 m²:</strong> yaklaşık 4-5.5 saat</li>
        <li><strong>4+1 ve üzeri:</strong> yaklaşık 6+ saat, çoğu zaman iki kişi daha uygun olabilir</li>
      </ul>
      <p>Balkon, cam silme, fırın/buzdolabı içi gibi "ekstra" işler bu sürelere dahil değildir — temizlikçiyle görüşürken hangi işlerin standart pakete dahil olduğunu netleştirmek, sonradan yaşanan "bunu da yapman gerekiyordu" tartışmalarının önüne geçer.</p>
      <h2>Saatlik mi, paket mi?</h2>
      <p>Düzenli (haftalık/iki haftalık) temizlikte saatlik ücretlendirme daha adil olur — her seferinde aynı süre sürer. Taşınma sonrası ya da yılda bir yapılan "genel temizlik" gibi tek seferlik işlerde ise sabit paket fiyatı, süre belirsiz olduğu için her iki taraf için de daha öngörülebilirdir.</p>
      <p>İşinn'de her temizlikçi kendi fiyatlandırma tercihini (saatlik ya da sabit) vitrininde belirtir, böylece görüşmeye başlamadan önce hangi modelle çalıştığını görebilirsin. Güncel günlük ücret aralıkları için <a href="/rehber/ev-temizligi-ucretleri-2026">ev temizliği ücretleri 2026</a> rehberine bakabilirsin.</p>
      <h2>Süreyi uzatan durumlar</h2>
      <p>Aynı büyüklükteki iki ev çok farklı sürelerde temizlenebilir. Süreyi en çok etkileyen durumlar şunlar:</p>
      <ul>
        <li><strong>Banyo sayısı:</strong> banyo ve tuvaletler evin en çok emek isteyen kısmıdır. İki banyolu bir 2+1, tek banyolu bir 3+1'e yakın sürebilir.</li>
        <li><strong>Eşya yoğunluğu:</strong> raflar, vitrinler, biblolar ve dağınık yüzeyler toz alma süresini uzatır. Temizlikten önce ortalığı toplamak süreyi kısaltır.</li>
        <li><strong>Son temizlikten bu yana geçen süre:</strong> haftalık temizlenen bir ev ile bir aydır temizlenmemiş bir ev aynı sürede bitmez.</li>
        <li><strong>Evcil hayvan ve küçük çocuk:</strong> tüy, oyuncak ve lekeler ek süre ister.</li>
        <li><strong>Mutfak:</strong> yağlanmış ocak davlumbazı, fırın içi ve dolap içleri tek başına bir saati bulabilir.</li>
      </ul>
      <h2>Ekstra işler için kabaca ne kadar ayırmalı?</h2>
      <p>Aşağıdakiler de ölçüm değil, İşinn'in yaklaşık tahminleridir; evin durumuna göre çok değişebilir:</p>
      <ul>
        <li><strong>Cam silme (içten ve dıştan):</strong> pencere sayısına göre 1–2 saat</li>
        <li><strong>Fırın ve buzdolabı içi:</strong> her biri için yaklaşık yarım saat ile bir saat arası</li>
        <li><strong>Balkon:</strong> büyüklüğüne ve kirine göre yarım saat ile bir saat arası</li>
        <li><strong>Ütü:</strong> çamaşır miktarına bağlı; görüşmede ayrıca konuşulmalı</li>
      </ul>
      <p>Bu işler istenecekse temizlikçiye önceden söylemek hem doğru süreyi planlamasını hem de ücreti baştan netleştirmeyi sağlar.</p>
      <h2>Düzenli temizlikte sıklık nasıl seçilir?</h2>
      <p>Haftada bir yapılan temizlikte ev hiç ağır kirlenmediği için her seans daha kısa sürer. İki haftada bir temizlikte her seans biraz daha uzun tutulmalıdır. Ayda bir temizlik ise çoğu zaman "genel temizlik"e yaklaşır. Toplam bütçeyi hesaplarken yalnızca seans başı ücrete değil, aylık toplam saate bakmak daha doğru bir karşılaştırma sağlar.</p>
      <h2>İlk görüşmede netleştirilecekler</h2>
      <ul>
        <li>Kaç saat çalışılacak, ücret saatlik mi günlük mü?</li>
        <li>Hangi odalar ve hangi işler dahil?</li>
        <li>Temizlik malzemelerini kim alacak?</li>
        <li>Süre aşılırsa ne olacak: iş yarım mı kalacak, ek ücret mi ödenecek?</li>
      </ul>
      <p>Evinde gündelik çalışan biri için ayda 10 günden az çalışmada da SGK bildirimi gerekiyor; ayrıntılar <a href="/rehber/ev-temizligi-ucretleri-2026">ev temizliği ücretleri</a> rehberinde.</p>
    `,
    ctaText: "İstanbul'da (ya da bulunduğun şehirde) bir temizlikçi bul",
    ctaHref: "/kategori/temizlik",
    faq: [
      { q: "80 m² bir daire için temizlik kaç saat sürer?", a: "Yaklaşık bir tahmin olarak standart (haftalık/iki haftalık) temizlikte 3-4 saat, taşınma sonrası genel temizlikte bu sürenin 1.5-2 katı hesaplanabilir; kesin süre kirlilik seviyesine ve çalışan kişi sayısına göre değişir." },
      { q: "Temizlikçiye saatlik mi sabit fiyat mı ödenir?", a: "Düzenli temizlikte saatlik ücret, tek seferlik (taşınma sonrası, yıllık genel temizlik gibi) işlerde sabit paket fiyatı daha adil sonuç verir." },
      { q: "Ev temizliği süresini en çok ne uzatır?", a: "Banyo sayısı, eşya yoğunluğu, son temizlikten bu yana geçen süre, evcil hayvan ve mutfaktaki yağlı yüzeyler. Cam, fırın içi ve balkon gibi ekstra işler de ayrıca süre ister." },
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
      <p>En ucuz öğretmen, sık öğretmen değiştirmeye (ve her seferinde sıfırdan başlamaya) yol açarsa uzun vadede daha pahalıya gelir. Fiyatı, deneme dersindeki gözlemlerinle birlikte değerlendir. Saatlik ücretlerin neye göre değiştiğini görmek için <a href="/rehber/ozel-ders-ucretleri-2026">özel ders ücretleri 2026</a> rehberine bakabilirsin.</p>
      <h2>5. Ders planını ve ölçmeyi sor</h2>
      <p>İyi bir öğretmen ilk derslerde öğrencinin nerede olduğunu görmek için kısa bir değerlendirme yapar ve buna göre bir plan çıkarır. Görüşmede "İlk ay ne yapacağız, ilerlemeyi nasıl ölçeceğiz?" diye sormak, öğretmenin yöntemini anlamanın en kolay yoludur. Cevap "her derste kitaptan devam ederiz" gibi belirsizse, hedefe göre plan yapıp yapmadığını bir kez daha sor.</p>
      <h2>6. Yüz yüze mi, online mı?</h2>
      <p>İki biçimin de avantajı var. Yüz yüze ders, dikkati kolay dağılan küçük yaştaki çocuklar için çoğu zaman daha uygun. Online ders ise yol süresini ortadan kaldırır ve şehrinde bulamadığın bir öğretmenle çalışmanı sağlar. Online derste şunlara dikkat et: öğretmen ekranda yazı yazabiliyor mu, ödevleri nasıl kontrol ediyor, bağlantı koptuğunda ne yapılıyor?</p>
      <h2>7. Deneyimi doğru yerde ara</h2>
      <p>Yıllarca lise öğrencilerine ders vermiş biri, ilkokul öğrencisiyle çalışırken zorlanabilir; tersi de geçerli. Bu yüzden genel deneyimden çok, <strong>senin çocuğunun yaşına ve hedefine yakın</strong> öğrencilerle çalışıp çalışmadığını sor. LGS, YKS ya da dil sınavı gibi belirli bir sınava hazırlık için o sınavın soru tarzını bilen bir öğretmen fark yaratır.</p>
      <h2>8. Kuralları baştan konuş</h2>
      <ul>
        <li>Ders iptali ne kadar önceden bildirilmeli, iptal edilen ders ücretlendiriliyor mu?</li>
        <li>Ücret ders başına mı, aylık paket mi?</li>
        <li>Ödev veriliyor mu, ders dışında soru sorulabiliyor mu?</li>
        <li>Veliye ne sıklıkla bilgi veriliyor?</li>
      </ul>
      <p>Bu kurallar yazılı olarak (bir mesaj olarak bile) kayda geçerse, ilerleyen haftalarda yaşanabilecek yanlış anlamaların önüne geçilir.</p>
      <h2>Ne zaman öğretmen değiştirmeli?</h2>
      <p>Birkaç hafta sonra hâlâ bir plan görmüyorsan, çocuk derslerden sürekli isteksiz çıkıyorsa ya da iletişimde verilen sözler tutulmuyorsa, bunu önce öğretmenle açıkça konuşmak gerekir. Konuşmaya rağmen değişmiyorsa öğretmen değiştirmek, kötü giden bir düzeni aylarca sürdürmekten daha iyidir.</p>
      <p>Öğretmen tarafındaysan ve ders vermek için neler gerektiğini merak ediyorsan <a href="/rehber/ozel-ders-vermek-icin-ne-gerekir">özel ders vermek için ne gerekir</a> rehberine bakabilirsin.</p>
    `,
    ctaText: "Bölgende özel ders öğretmenlerini incele",
    ctaHref: "/kategori/ogretmen",
    faq: [
      { q: "Özel ders öğretmeni seçerken en önemli kriter nedir?", a: "Diploma tek başına yetmez — mümkünse tek seferlik bir deneme dersiyle başlamak, öğretmenin çocukla nasıl bir iletişim kuracağını en iyi gösteren şeydir." },
      { q: "Öğretmenle hedef nasıl netleştirilir?", a: "\"Matematikte iyileşsin\" yerine \"kesirler ve oran-orantıda net kaybı var\" gibi somut bir hedef belirlemek, öğretmenin doğru bir çalışma planı kurmasını sağlar." },
      { q: "Online özel ders mi, yüz yüze mi daha iyi?", a: "Küçük yaştaki ve dikkati kolay dağılan çocuklar için yüz yüze ders çoğu zaman daha uygun; online ders ise yol süresini kaldırır ve şehrinde olmayan bir öğretmenle çalışmayı sağlar. Online derste öğretmenin ekrana yazı yazabilmesi ve ödev kontrolü önemlidir." },
      { q: "Özel ders öğretmeni ne zaman değiştirilmeli?", a: "Birkaç hafta sonra hâlâ bir plan yoksa, çocuk derslerden sürekli isteksiz çıkıyorsa ya da verilen sözler tutulmuyorsa önce öğretmenle konuşmak, değişmezse öğretmen değiştirmek gerekir." },
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
      <h2>Sınavın yapısını bilerek plan kur</h2>
      <p>Plan yapmadan önce sınavın nasıl olduğunu bilmek gerekir. 2026 LGS'yi anlatan haberlere göre sınav iki oturumdan oluşuyor (<a href="https://www.takvim.com.tr/egitim/10-soruda-lgs-rehberi-yeni-soru-formati-nasil-puanlama-sistemi-degisti-mi-6395171" rel="nofollow noopener" target="_blank">Takvim, 2026</a>):</p>
      <ul>
        <li><strong>Sözel bölüm:</strong> Türkçe, T.C. İnkılap Tarihi ve Atatürkçülük, Din Kültürü ve Ahlak Bilgisi ve yabancı dilden toplam 50 soru, 75 dakika</li>
        <li><strong>Sayısal bölüm:</strong> Matematik ve Fen Bilimlerinden toplam 40 soru, 80 dakika</li>
        <li><strong>Puanlama:</strong> her testte 3 yanlış 1 doğruyu götürüyor</li>
      </ul>
      <p>Kesin bilgi her yıl Millî Eğitim Bakanlığı'nın yayımladığı LGS kılavuzunda yer alır; tarih ve ayrıntılar için kılavuzu kontrol et. Bu yapıdan çıkan iki pratik sonuç var: yanlış cevap net kaybettirdiği için "emin değilsen boş bırakma" alışkanlığını denemelerde çalışmak gerekir; ve sayısal bölümde soru başına süre daha uzun olduğu için matematik ve fen denemeleri mutlaka süre tutularak çözülmelidir.</p>
      <h2>Haftalık plan örneği</h2>
      <p>Aşağıdaki örnek okul günlerinde düzenli çalışabilen bir öğrenci için kabaca bir çerçevedir; her çocuğun temposu farklıdır, okuldan gelen yorgunluğa göre uyarlanmalıdır:</p>
      <ul>
        <li><strong>Hafta içi her gün:</strong> bir eksik konuya odaklı kısa çalışma ve o konudan soru çözümü</li>
        <li><strong>Haftada iki gün:</strong> paragraf ve okuma çalışması (Türkçe her dersin sorularını anlamayı etkiler)</li>
        <li><strong>Hafta sonu:</strong> bir deneme sınavı ve ertesi gün o denemenin yanlış analizi</li>
        <li><strong>Haftada bir gün:</strong> tamamen dinlenme</li>
      </ul>
      <h2>Yanlış analizi nasıl yapılır?</h2>
      <p>Deneme çözmek tek başına yetmez; asıl öğrenme yanlışların incelenmesinde olur. Her yanlış için üç soru sorulabilir: Konuyu bilmiyor muydum? Biliyordum ama soruyu yanlış mı okudum? Süre mi yetmedi? Birinci gruptaki yanlışlar konu çalışmasına, ikinci gruptakiler dikkat ve okuma çalışmasına, üçüncü gruptakiler süre tutarak soru çözmeye yönlendirilir. Bu ayrımı bir deftere yazmak, birkaç hafta sonra hangi tür hatanın azaldığını görmeyi sağlar.</p>
      <h2>Motivasyon ve dinlenme</h2>
      <p>Uzun bir hazırlık sürecinde en büyük risk tükenmektir. Uyku düzeni, düzenli dinlenme günü ve küçük hedeflerin kutlanması, fazladan çalışılan birkaç saatten daha çok işe yarayabilir. Denemelerde netler dalgalanabilir; tek bir kötü denemeye göre plan değiştirmek yerine birkaç haftanın ortalamasına bakmak daha sağlıklıdır.</p>
      <h2>Özel ders öğretmeni seçerken</h2>
      <p>LGS için öğretmen arıyorsan, sınavın yeni nesil (okuduğunu anlama ve yorum gerektiren) soru tarzını bilen ve deneme sonuçlarına göre plan yapan birini seçmek önemli. Seçim için <a href="/rehber/iyi-ozel-ders-ogretmeni-nasil-secilir">iyi bir özel ders öğretmeni nasıl seçilir</a>, ücretler için <a href="/rehber/ozel-ders-ucretleri-2026">özel ders ücretleri 2026</a> rehberlerine bakabilirsin. LGS'ye hazırlatan öğretmenlerin vitrinleri <a href="/ozel-ders/lgs">LGS özel ders</a> sayfasında.</p>
    `,
    ctaText: "LGS'ye yönelik özel ders öğretmeni bul",
    ctaHref: "/kategori/ogretmen",
    faq: [
      { q: "LGS hazırlığına nasıl başlanır?", a: "İlk adım konu tekrarı değil, bir deneme sınavıyla mevcut durumu görmektir — hangi konularda gerçek eksik, hangisi dikkatsizlik olduğunu ayırt etmeden kurulan plan kör atış olur." },
      { q: "LGS'de özel ders ne zaman fark yaratır?", a: "Genel tekrarda grup dersi yeterli olabilir; belirli bir konuda tıkanma varsa bire bir özel ders, öğretmenin tam olarak nerede takıldığını görüp müdahale etmesini sağladığı için daha hızlı sonuç verir." },
      { q: "LGS kaç soru ve kaç dakika?", a: "2026 LGS'yi anlatan haberlere göre sınav 90 sorudan oluşuyor: sözel bölümde 50 soru için 75 dakika, sayısal bölümde 40 soru için 80 dakika veriliyor. Her testte 3 yanlış 1 doğruyu götürüyor. Kesin bilgi için MEB'in o yılki kılavuzuna bakılmalı." },
      { q: "LGS denemesinden sonra yanlış analizi nasıl yapılır?", a: "Her yanlışı üç gruba ayır: konuyu bilmemek, soruyu yanlış okumak, süre yetmemesi. Birinci grup konu çalışmasına, ikinci grup okuma ve dikkat çalışmasına, üçüncü grup süre tutarak soru çözmeye yönlendirilir." },
    ],
  },
  {
    slug: "ek-gelir-ve-freelance-is-yollari",
    title: "Ek Gelir ve Freelance İş: Becerinle Kazanmanın Yolları",
    description: "Evden ek gelir elde etmenin ya da freelance iş bulmanın en gerçekçi yolu: zaten bildiğin bir beceriyi, net bir vitrinle görünür kılmak.",
    category: "genel",
    bodyHtml: `
      <p>"Ek gelir" araması yapan çoğu kişi anket doldurma ya da reklam izleme gibi düşük getirili, sermayesiz görünen ama aslında zaman kaybettiren işlere yönlendiriliyor. Oysa elinde zaten bir <strong>beceri</strong> varsa (temizlik, çocuk bakımı, ders verme, el işi, tasarım, yazılım) denemeye değer yollardan biri bu beceriyi doğrudan hizmete çevirmek — doğrudan yerel müşteriyle buluşmak. Bunun gelir getireceğinin garantisi yoktur; sonuç becerine, bölgene ve ayırdığın zamana göre değişir.</p>
      <h2>Hangi beceriyle nereden başlanır?</h2>
      <ul>
        <li><strong>Ev/ofis temizliği:</strong> Çoğu zaman büyük bir sermaye gerektirmez. Düzenli (haftalık) bir müşterin olursa çalışma takvimin daha öngörülebilir olur.</li>
        <li><strong>Çocuk/yaşlı bakımı, oyun ablası-ağabeyi:</strong> Özellikle öğrenciler ve esnek zamanı olanlar için, boş saatleri gelire çevirmenin en doğal yolu.</li>
        <li><strong>Özel ders:</strong> Bir konuda gerçekten iyiysen (dil, matematik, enstrüman) tek bir öğrenciyle bile düzenli bir gelir kurulabilir.</li>
        <li><strong>El işi, nail art, tasarım:</strong> Ürettiğin bir şey varsa, portföyünü gösterecek bir vitrin satıştan daha fazlasını sağlar — güven de inşa eder.</li>
        <li><strong>Yazılım, çeviri, dijital işler:</strong> Klasik "freelance" tanımına en yakın alan; burada asıl fark, iş başına komisyon kesen aracılar yerine doğrudan teklif verebileceğin bir kanal bulmakta.</li>
      </ul>
      <h2>Freelance ile "hizmet vermek" farklı mı?</h2>
      <p>Hayır — ikisi de aynı şeyin farklı adları: birikimini/zamanını bir karşılık için sunmak. Fark, nasıl müşteri bulduğunda. Bazı freelance platformları iş başına ücret keser ve müşteri çok farklı yerlerden gelebilir. Yerel bir hizmet olarak sunduğunda (özellikle temizlik, bakım, ders gibi fiziksel/yerel işlerde) müşteri seninle aynı şehirde, hatta mahallede olabilir; bu da yüz yüze güven kurmayı kolaylaştırabilir.</p>
      <h2>Nasıl başlanır?</h2>
      <p>Önce hangi beceriyle başlayacağına karar ver, sonra bunu anlatan basit bir vitrin oluştur: birkaç fotoğraf/örnek iş, net bir fiyat aralığı, hangi bölgede/nasıl çalıştığın. İşinn'de bir vitrin açmak birkaç dakika sürer ve işinden komisyon alınmaz; hizmet verenler sabit üyelik ücreti öder, ancak üyelik 1 Ocak 2027'ye kadar ücretsizdir.</p>
    `,
    ctaText: "Becerini bir vitrine dönüştür, ücretsiz başla",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "Evde oturarak en kolay nasıl ek gelir elde edilir?", a: "Zaten sahip olduğun bir beceriyi (temizlik, ders verme, el işi, tasarım gibi) doğrudan yerel bir hizmete çevirmek, anket/reklam izleme gibi düşük getirili yöntemlerden çok daha sürdürülebilir bir gelir yolu." },
      { q: "Freelance iş bulmak için nereden başlanır?", a: "Önce hangi beceride gerçekten iyi olduğuna karar ver, sonra bunu somut örneklerle (portföy, fiyat, çalışma şekli) anlatan bir vitrin/profil oluştur — doğrudan yerel/hedef kitleye ulaşmak, kalabalık genel platformlarda sıraya girmekten daha hızlı sonuç verir." },
      { q: "Ek gelir için hangi beceriyle başlamalıyım?", a: "Hangi becerinin daha çok talep gördüğüne dair kesin bir veri veremeyiz; bunun yerine gerçekten iyi yaptığın ve düzenli ayırabileceğin zamana uyan bir beceriyle başlamak daha sağlıklıdır. Emin değilsen Yeteneğini Farket aracı fikir üretmene yardım eder." },
      { q: "Yapay zeka ile video/web tasarımı becerimi nasıl gelire çevirebilirim?", a: "Bunu Instagram'da paylaşıp beğeni beklemek yerine, düzgün bir web sitesi ya da tanıtım videosuna ihtiyacı olan küçük işletmelere doğrudan ulaşabileceğin bir vitrine dönüştürebilirsin — çoğu küçük işletmenin bunu kendi başına yapacak vakti ya da bilgisi yok." },
    ],
  },
  {
    slug: "birkac-bin-takipci-ile-yerel-isletmelerden-sponsorluk",
    seoTitle: "Az Takipçiyle Yerel İşletmelerden Sponsorluk Nasıl Alınır?",
    title: "Birkaç Bin Takipçin Var mı? Yerel İşletmelerden Nasıl Sponsorluk Alırsın",
    description: "Ünlü olmana gerek yok — birkaç bin gerçek, etkileşimli takipçi, senin şehrindeki bir işletme için ulusal bir reklamdan daha değerli olabilir.",
    category: "sosyal-medya",
    bodyHtml: `
      <p>Çoğu kişi "influencer olmak" için yüz binlerce takipçi gerektiğini düşünüyor, oysa gerçek durum farklı: <strong>yerel bir işletme için senin 2-3 bin takipçin, ulusal bir hesabın 200 bin takipçisinden daha değerli olabilir</strong> — çünkü senin takipçilerinin büyük kısmı muhtemelen aynı şehirde, hatta aynı mahallede. Bir kafe, kuaför ya da el işi satıcısı için bu, tam olarak ulaşmak istediği kitle demek.</p>
      <h2>Neden yerel işletmeler küçük hesapları tercih eder?</h2>
      <ul>
        <li><strong>Bütçe:</strong> Büyük hesaplar tek gönderi için binlerce lira isterken, küçük/orta ölçekli bir işletme bunu karşılayamaz — senin fiyatın onun bütçesine uyar.</li>
        <li><strong>Hedef kitle örtüşmesi:</strong> Ulusal bir hesabın takipçilerinin çoğu o işletmeye gidemeyecek kadar uzakta olabilir. Senin takipçilerinin ise bir kısmı aynı şehirde yaşıyor olabilir.</li>
        <li><strong>Samimiyet:</strong> Küçük hesaplarda takipçiler seni "reklam panosu" gibi değil, tanıdığı biri gibi görebilir; bu, etkileşimin daha güçlü olmasına yardımcı olabilir (garantisi yok, hesabına göre değişir).</li>
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
      <h2>Kaç teklif almalı, nasıl karşılaştırmalı?</h2>
      <p>En az iki üç ustadan teklif almak, fiyatın makul olup olmadığını görmenin en kolay yolu. Ama teklifleri yalnızca toplam rakama göre karşılaştırmak yanıltıcı olabilir. Bir teklif ucuz görünüp malzemeyi, söküm ve moloz atımını ya da iş sonu temizliğini dışarıda bırakıyor olabilir. Karşılaştırma yaparken her teklifte şu kalemlerin olup olmadığına bak:</p>
      <ul>
        <li>Söküm ve moloz atımı</li>
        <li>Malzeme (marka ve model yazılı mı?)</li>
        <li>İşçilik</li>
        <li>Ek işler (alçı, tesisat yenileme, elektrik)</li>
        <li>İş sonu temizlik</li>
      </ul>
      <p>Boya işlerinde güncel m² fiyatları için <a href="/rehber/boya-badana-fiyatlari-2026">boya badana fiyatları 2026</a> rehberine bakabilirsin.</p>
      <h2>Keşif neden önemli?</h2>
      <p>Telefonda ya da fotoğrafla verilen fiyat çoğu zaman tahmindir. Ustanın evi yerinde görmesi (keşif), duvarın durumu, tesisatın yaşı ya da ölçüler gibi fiyatı değiştiren şeyleri baştan ortaya çıkarır. Keşif sonrası verilen teklifin yazılı olması, işin ortasında "bunu görmemiştim" diye yapılan ek fiyat taleplerini azaltır.</p>
      <h2>Yazılı anlaşmada neler olmalı?</h2>
      <p>Küçük işlerde bile, yapılacak işi ve fiyatı yazılı hale getirmek (bir mesaj olarak bile) işe yarar. Büyük işlerde şu maddelerin yazılı olması önerilir:</p>
      <ul>
        <li>Yapılacak işlerin listesi ve kullanılacak malzemeler</li>
        <li>Toplam fiyat ve ödeme aşamaları</li>
        <li>Başlangıç ve tahmini bitiş tarihi</li>
        <li>Ek iş çıkarsa nasıl onaylanacağı (yazılı onay olmadan ek iş yapılmaması)</li>
        <li>İş bittikten sonra çıkan sorunlarda ustanın ne yapacağı</li>
      </ul>
      <p>Örnek anlaşma maddeleri için <a href="/rehber/musteriye-ilk-mesaj-ve-yazili-anlasma-sablonlari">yazılı anlaşma şablonları</a> rehberine bakabilirsin. Bu bilgiler genel öneridir, hukuki tavsiye değildir.</p>
      <h2>İş sürerken nelere dikkat etmeli?</h2>
      <p>Uzun süren işlerde her aşama bittiğinde (örneğin tesisat kapatılmadan önce) kısa bir kontrol yapmak, sonradan duvarı kırmak zorunda kalmaktan iyidir. Fotoğraf çekmek hem ilerlemeyi takip etmeyi hem de ileride tesisatın nereden geçtiğini bilmeyi sağlar. Apartmanda yapılan işlerde yönetimin çalışma saatleri ve gürültü kuralları baştan öğrenilmeli; komşulara önceden haber vermek de sorunları azaltır.</p>
      <h2>Uyarı işaretleri</h2>
      <ul>
        <li>Keşif yapmadan kesin fiyat veren ama sonra sürekli ek isteyen tutum</li>
        <li>İşin tamamı için peşin ödeme istenmesi</li>
        <li>Benzer işlerden örnek gösterememe</li>
        <li>Yazılı hiçbir şey vermek istememe</li>
      </ul>
    `,
    ctaText: "Bulunduğun şehirde bir usta bul",
    ctaHref: "/kategori/tadilat",
    faq: [
      { q: "Tadilat fiyat teklifi alırken nelere dikkat etmeli?", a: "Teklifin işçilik mi yoksa işçilik+malzeme mi olduğunu, malzeme kalitesini ve varsa ek/ekstra iş ücretlerini baştan netleştirmek gerekir." },
      { q: "Tadilat işinde ödeme nasıl planlanmalı?", a: "Büyük işlerde tamamını peşin ödemek yerine, işin aşamalarına bağlı (başta bir kısım, bitince kalan) bir ödeme planı her iki taraf için de daha güvenlidir." },
      { q: "Tadilat için kaç teklif alınmalı?", a: "En az iki üç teklif almak fiyatın makul olup olmadığını gösterir. Karşılaştırırken yalnızca toplam rakama değil; söküm, moloz, malzeme markası, ek işler ve iş sonu temizliğin dahil olup olmadığına bakmak gerekir." },
      { q: "Keşifsiz verilen tadilat fiyatına güvenilir mi?", a: "Telefonda ya da fotoğrafla verilen fiyat çoğu zaman tahmindir. Ustanın yerinde keşif yapıp yazılı teklif vermesi, işin ortasında çıkan ek fiyat taleplerini azaltır." },
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
      <h2>Deneyim ve geçmiş</h2>
      <ul>
        <li>Daha önce hangi yaşlarda çocuklarla çalıştın? En uzun süre kaç yıl aynı ailenin yanında kaldın?</li>
        <li>Önceki ailelerden biriyle konuşabilir miyim? (Referansla konuşurken "Ayrılma nedeni neydi?" diye sormak işe yarar.)</li>
        <li>Bebek bakımı, okul öncesi ya da özel gereksinimli bir çocukla deneyimin var mı?</li>
      </ul>
      <h2>Günlük işleyiş</h2>
      <ul>
        <li>Bir gününü nasıl planlarsın? Uyku, yemek ve oyun saatlerine nasıl uyarsın?</li>
        <li>Ekran süresi konusunda nasıl davranırsın? (Ailenin kurallarını söyleyip nasıl uygulayacağını sor.)</li>
        <li>Çocukla dışarı çıkar mısın, parka ya da okula götürüp getirebilir misin?</li>
        <li>Yemek hazırlar mısın? Alerji ya da özel beslenme konusunda deneyimin var mı?</li>
      </ul>
      <h2>Disiplin ve sınırlar</h2>
      <p>"Çocuk vurduğunda ya da kardeşini ittiğinde ne yaparsın?" gibi bir soru, bakıcının sınır koyma yaklaşımını gösterir. Ailenin ceza ve ödül konusundaki kurallarını açıkça anlatıp bakıcının bunlarla uyumlu olup olmadığını konuşmak gerekir. Bakıcının ailenin yaklaşımından çok farklı davranması, çocuk için kafa karıştırıcı olabilir.</p>
      <h2>Çalışma koşulları</h2>
      <ul>
        <li>Çalışma saatleri, hafta tatili ve fazla mesai</li>
        <li>Ücret, sigorta ve yol giderleri</li>
        <li>Hastalık ya da izin durumunda ne olacağı</li>
        <li>Yatılı çalışmada kalacağı oda ve izin günleri</li>
      </ul>
      <p>Güncel bakıcı ücretleri ve sigorta konusundaki temel bilgiler için <a href="/rehber/cocuk-ve-yasli-bakicisi-ucretleri-2026">bakıcı ücretleri 2026</a> rehberine bakabilirsin.</p>
      <h2>Görüşme sırasında dikkat edilecekler</h2>
      <p>Mümkünse görüşmenin bir kısmını çocuk da oradayken yap. Bakıcının çocukla nasıl tanıştığı, ona nasıl hitap ettiği, çocuğun ilgisini çekip çekmediği, sorulara verilen cevaplardan daha çok şey anlatabilir. Görüşmeden sonra çocuğun ne hissettiğini sormak da iyi bir işaret verir.</p>
      <p>İşinn'de bakıcıların vitrinlerinde deneyim alanlarını (bebek, okul öncesi, özel gereksinim gibi) ve varsa geçmiş aile yorumlarını görebilirsin. İşinn hizmet verenler hakkında garanti vermez; görüşme, referans ve deneme süresi kararın senin elinde olduğu adımlardır.</p>
    `,
    ctaText: "Bulunduğun şehirde bir bakıcı bul",
    ctaHref: "/kategori/bakici",
    faq: [
      { q: "Çocuk bakıcısı görüşmesinde en önemli soru nedir?", a: "Genel deneyim sorusundan çok, 'çocuk ağladığında/inatlaştığında ne yaparsın' gibi somut bir senaryo sorusu, bakıcının gerçek yaklaşımını gösterir." },
      { q: "Çocuk bakıcısıyla çalışmaya nasıl başlanmalı?", a: "Uzun vadeli bir anlaşma yapmadan önce birkaç günlük kısa bir deneme süresi, çocuk ve bakıcının birbirine uyup uymadığını görmek için daha sağlıklı bir yöntemdir." },
      { q: "Bakıcının referansı nasıl kontrol edilir?", a: "Önceki ailelerden biriyle konuşmak ve 'Ne kadar süre çalıştı, neden ayrıldı, nelerde çok iyiydi?' gibi somut sorular sormak en pratik yoldur." },
      { q: "Görüşmede çocuk da bulunmalı mı?", a: "Mümkünse görüşmenin bir kısmında çocuğun da olması iyi olur. Bakıcının çocukla nasıl tanıştığı ve iletişim kurduğu, sorulara verdiği cevaplardan daha çok şey gösterebilir." },
    ],
  },
  {
    slug: "evden-ders-ve-atolye-vermek",
    title: "Evden Ders ve Atölye Vermek: Nereden Başlanır?",
    description: "Bir konuyu iyi biliyorsan ders ya da küçük bir atölye olarak sunabilirsin. Konu seçimi, ilk denemeler ve vitrin hazırlama için adım adım, iddiasız bir rehber.",
    category: "genel",
    bodyHtml: `
      <p>Bir şeyi iyi yapmak ile onu başkasına anlatabilmek farklı beceriler — ama ikincisi öğrenilebilir. Örgü, resim, dikiş, bir dil, bir enstrüman, bir ders konusu ya da bir hobi: anlatabildiğin her şey, ders ya da küçük bir atölye olarak bir <strong>hizmete</strong> dönüşebilir. Bu rehber, kazanç vaat etmeden, ilk adımları netleştirmeye yardım eder.</p>
      <h2>1. Konunu daralt</h2>
      <p>"Resim dersi veriyorum" yerine "yetişkinler için başlangıç seviyesinde suluboya" gibi dar bir tanım, kime hitap ettiğini ve ne öğreteceğini hemen anlatır. Kimin, hangi seviyede, neyi öğreneceğini tek cümlede yazabiliyorsan konu hazırdır.</p>
      <h2>2. Biçimi seç: bire bir mi, küçük grup mu?</h2>
      <ul>
        <li><strong>Bire bir ders:</strong> Kişiye göre ilerler, hazırlığı kolaydır; saat ve mekân seçimi esnektir (evde, öğrencinin evinde ya da uzaktan).</li>
        <li><strong>Küçük grup atölyesi:</strong> Birkaç kişiyle tek oturumluk bir çalışma; mekân, süre ve kaç kişi alacağın baştan netleşmeli.</li>
      </ul>
      <h2>3. Önce yakın çevrede dene</h2>
      <p>Tanıdığın bir iki kişiyle deneme dersi yapmak, anlatım tarzını ve süreyi test etmenin en az riskli yoludur. Deneme sonrası "hangi kısım zor geldi, hangisi fazla uzundu" diye sormak, vitrin metnini yazarken işine yarar.</p>
      <h2>4. Vitrinini hazırla</h2>
      <p>İyi bir vitrinde şunlar bulunur: kime hitap ettiğin, dersin nasıl işlediği (süre, yer, kişi sayısı), kendi yaptığın örnek çalışmalardan birkaç fotoğraf ve nerede çalıştığın. Yalnızca gerçekten sahip olduğun bilgi ve belgeleri yaz; olmayan bir sertifika ya da deneyim yazmak hem yanıltıcıdır hem de güveni bozar.</p>
      <h2>Dikkat edilecekler</h2>
      <ul>
        <li>Çocuklara ders verecekseniz veli ile ders saatleri, yeri ve iletişim konusunda baştan net anlaşın.</li>
        <li>Belge, ruhsat ya da mesleki yeterlilik gerektiren alanlarda (ör. sağlık, hukuk) ilgili mevzuata uymak sana aittir.</li>
        <li>İşinn kullanıcılar arasındaki ödemeye aracılık etmez; ücret ve iptal koşullarını ders başlamadan yazılı netleştirmek iki taraf için de rahatlık sağlar.</li>
      </ul>
      <p>Hangi konuyu anlatabileceğinden emin değilsen, <a href="/yetenegini-farket">Yeteneğini Farket</a> aracı anlattığın becerilerden birkaç hizmet fikri ve hazır bir vitrin taslağı önerir; öneriler garanti değil, başlangıç noktasıdır.</p>
    `,
    ctaText: "Ders ya da atölye vitrinini oluştur",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "Evden ders vermeye nereden başlanır?", a: "Önce konuyu daralt (kime, hangi seviyede, neyi öğreteceğini tek cümleyle yaz), sonra tanıdığın bir iki kişiyle deneme dersi yap ve ondan sonra vitrinini hazırla." },
      { q: "Ders vermek için diploma ya da sertifika şart mı?", a: "Her alan için aynı değil. Belge ya da yeterlilik gerektiren alanlarda ilgili mevzuata uymak gerekir; gerektirmeyenlerde de sahip olmadığın bir belgeyi ya da deneyimi asla yazma." },
      { q: "Bire bir ders mi, grup atölyesi mi daha uygun?", a: "Bire bir ders hazırlığı kolaydır ve kişiye göre ilerler; küçük grup atölyesinde ise mekân, süre ve kişi sayısını baştan netleştirmen gerekir. Önce bire bir deneyip sonra gruba geçmek yaygın bir yoldur." },
    ],
  },
  {
    slug: "sirket-kurmadan-hizmet-sunmak",
    title: "Şirket Kurmadan Hizmet Sunabilir misin? Bilmen Gerekenler",
    description: "Evden ya da yerel olarak hizmet sunmak için şirket kurmak şart mı? İşinn'de vitrin açmak, vergi ve belge konusunda nereye bakman gerektiği — genel bir bilgilendirme.",
    category: "genel",
    bodyHtml: `
      <p><strong>Önemli not:</strong> Bu yazı genel bir bilgilendirmedir; yasal, vergisel ya da mali tavsiye değildir. Vergi ve belge yükümlülükleri kişinin durumuna, yaptığı işe ve kazancına göre değişir.</p>
      <h2>İşinn'de vitrin açmak için şirket gerekir mi?</h2>
      <p>Hayır. İşinn'de bireysel olarak vitrin açabilir, hizmetini tanıtabilir ve müşterilerle doğrudan görüşebilirsin. İşinn, hizmetlerin keşfini kolaylaştıran bir platformdur; kullanıcılar arasındaki ödemeye aracılık etmez ve komisyon almaz. Ücret, ödeme şekli ve belge düzeni senin ve müşterin arasındadır.</p>
      <h2>Peki vergi ve yasal yükümlülükler?</h2>
      <p>Hizmet karşılığında düzenli kazanç elde etmek, vergi mevzuatı açısından bir değerlendirme gerektirebilir. Hangi durumda kayıt, bildirim ya da fatura/makbuz düzenlemek gerektiği; işin türüne, kazancın düzenli olup olmamasına ve tutarına göre değişir. Bu konuda doğru bilgiye şuradan ulaşabilirsin:</p>
      <ul>
        <li><strong>Gelir İdaresi Başkanlığı (GİB)</strong> resmi internet sitesi ve çağrı merkezi.</li>
        <li><strong>Bir mali müşavir</strong> — kendi durumuna özel, güncel mevzuata göre yönlendirir.</li>
        <li>Mesleki belge gerektiren alanlarda ilgili <strong>meslek odası ya da kurum</strong>.</li>
      </ul>
      <p>GİB'in güncel rehberlerine ve duyurularına <a href="https://www.gib.gov.tr" rel="noopener">gib.gov.tr</a> adresinden ulaşabilirsin. Mevzuat ve tutarlar sık değiştiği için bu yazıda rakam vermiyoruz.</p>
      <h2>Sık konuşulan seçenekler (genel çerçeve)</h2>
      <p>Türkiye'de hizmet veren kişilerin karşılaştığı başlıca yapılar aşağıdadır. Hangisinin sana uyduğu, işinin türüne ve kazancına bağlıdır; karar vermeden önce mutlaka güncel resmî bilgiye ve bir mali müşavire başvur.</p>
      <ul>
        <li><strong>Serbest meslek kaydı:</strong> Bilgi ve uzmanlığa dayanan işlerde (ör. tasarım, yazılım, çeviri, danışmanlık) sık başvurulan bir yoldur. Bu yapıda hizmet karşılığında genellikle serbest meslek makbuzu düzenlenir.</li>
        <li><strong>Şahıs şirketi:</strong> Tek kişinin kendi adına kurduğu işletmedir. Kuruluşu görece basittir; ticari faaliyet içeren işlerde tercih edilebilir.</li>
        <li><strong>Sermaye şirketi (ör. limited şirket):</strong> Birden çok ortak, büyük ölçekli işler ya da kurumsal müşterilerin beklentisi söz konusu olduğunda değerlendirilir; kuruluşu ve yükümlülükleri daha kapsamlıdır.</li>
        <li><strong>Muafiyet ve istisnalar:</strong> Bazı küçük ve belirli faaliyetler için mevzuatta muafiyet ya da istisna düzenlemeleri bulunabilir. Bunların kapsamı dardır ve şartları değişebilir; kendi durumuna uyup uymadığını GİB'den ya da bir mali müşavirden teyit et.</li>
      </ul>
      <h2>Yurt dışından müşterin varsa</h2>
      <p>Yurt dışındaki bir müşteriye uzaktan hizmet veriyorsan ödeme alma yöntemi, belge düzenleme ve vergilendirme konuları ayrıca değerlendirilir. Ödeme platformlarının kuralları ve bankaların istediği belgeler de farklılık gösterebilir. Bu konuda da bir mali müşavire danışmak, sonradan doğabilecek sorunları önler.</p>
      <h2>Müşteriyle yazılı anlaşma her durumda işe yarar</h2>
      <p>Hangi yapıyı seçersen seç, işe başlamadan kapsamı, teslim tarihini, ücreti, ödeme zamanını, düzeltme sayısını ve iptal koşullarını yazılı olarak netleştirmek iki tarafı da korur. Kısa bir mesajlaşma bile, hiç yazılı kayıt olmamasından iyidir. Hazır metinler için <a href="/rehber/musteriye-ilk-mesaj-ve-yazili-anlasma-sablonlari">ilk mesaj ve yazılı anlaşma şablonlarına</a> bakabilirsin.</p>
      <h2>Başlamadan önce kendine sorabileceğin sorular</h2>
      <ul>
        <li>Yaptığım iş belge, ruhsat ya da izin gerektiriyor mu?</li>
        <li>Düzenli mi çalışacağım, yoksa arada bir mi? Bu, yükümlülüğümü nasıl etkiler?</li>
        <li>Müşteriyle ücret, iptal ve belge konusunu baştan yazılı netleştirdim mi?</li>
      </ul>
      <h2>Vitrini yayınlamak başlangıç, karar değil</h2>
      <p>Vitrinini hazırlayıp önce yakın çevrenin tepkisini görmek, işin gerçekten sana uyup uymadığını anlamanın düşük riskli bir yoludur. Yalnızca gerçekten sunabileceğin hizmeti ve sahip olduğun bilgileri yazman yeter.</p>
    `,
    ctaText: "Vitrinini oluştur",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "İşinn'de vitrin açmak için şirket kurmak gerekir mi?", a: "Hayır, bireysel olarak vitrin açabilirsin. Vergi ve belge yükümlülüklerin ise durumuna göre değişir; kesin bilgi için Gelir İdaresi Başkanlığı'nın resmi kaynaklarına ve bir mali müşavire danış." },
      { q: "İşinn ödemeleri yönetiyor mu?", a: "Hayır. İşinn kullanıcılar arasındaki ödemeye aracılık etmez ve komisyon almaz; ücret ve ödeme şekli senin ve müşterin arasındadır." },
      { q: "Belge gerektiren bir mesleğim varsa ne yapmalıyım?", a: "Belge, ruhsat ya da izin gerektiren alanlarda ilgili mevzuata uymak sana aittir. Emin değilsen önce ilgili meslek odasına ya da kuruma sor." },
    ],
  },
  {
    slug: "calisan-anneler-icin-esnek-hizmet-fikirleri",
    title: "Çalışan Anneler İçin Evden ve Esnek Saatli Hizmet Fikirleri",
    description: "Zamanı sınırlı olanlar için akşam, hafta sonu ya da uzaktan sunulabilecek hizmet türleri ve ilk adımı küçük tutmanın yolları. Kazanç vaadi içermeyen, pratik bir rehber.",
    category: "genel",
    bodyHtml: `
      <p>Mesai, ev ve çocuk arasında sınırlı bir zamanın var ve yine de bir beceriyi hizmete çevirmek istiyorsun. Burada önemli olan, <strong>ne kadar zaman ayırabileceğini baştan netleştirmek</strong> ve ilk adımı küçük tutmak. Aşağıdakiler garanti değil; esnek saatlere uyabilecek hizmet türlerine örnekler.</p>
      <h2>Akşam ya da hafta sonu yapılabilecek hizmetler</h2>
      <ul>
        <li><strong>Ödev ve ders desteği:</strong> Hafta içi akşam ya da hafta sonu, belirli bir konuda küçük öğrencilere destek.</li>
        <li><strong>Atölye ya da kısa eğitim:</strong> Hafta sonu tek oturumluk, küçük gruplu bir çalışma (örgü, resim, dikiş, bir dil pratiği gibi).</li>
        <li><strong>Etkinlik ve parti organizasyonu:</strong> Çocuk doğum günleri gibi planlaması önceden yapılabilen işler.</li>
      </ul>
      <h2>Uzaktan yürütülebilen hizmetler</h2>
      <ul>
        <li><strong>Yazı ve çeviri:</strong> Önceden anlaşılan teslim tarihine göre, kendi saatinde.</li>
        <li><strong>Sanal asistanlık:</strong> Takvim, randevu ya da e-posta düzeni gibi küçük işler.</li>
        <li><strong>Tasarım ve içerik hazırlama:</strong> Küçük işletmelerin görsel ya da metin ihtiyaçları.</li>
      </ul>
      <h2>İlk adımı küçük tut</h2>
      <ol>
        <li>Haftada kaç saat ayırabileceğini dürüstçe yaz; ona sığmayacak bir iş vaat etme.</li>
        <li>Tek bir hizmetle başla; vitrinde net bir çalışma saati ve bölge belirt.</li>
        <li>Tanıdığın bir iki kişiyle deneyip geri bildirim al, sonra vitrinini ona göre düzelt.</li>
      </ol>
      <p>Ne sunabileceğinden emin değilsen <a href="/yetenegini-farket">Yeteneğini Farket</a> aracı, haftalık süreni ve çalışma tercihini (evden/uzaktan, yüz yüze ya da fark etmez) de hesaba katarak anlattığın becerilerden 1-2 hizmet fikri önerir. Aracı denemek için üyelik gerekmez.</p>
      <p>Bir not: Belge, ruhsat ya da mesleki yeterlilik gerektiren alanlarda ilgili mevzuata uymak sana aittir; İşinn kullanıcılar arasındaki ödemeye aracılık etmez.</p>
    `,
    ctaText: "Becerinden hizmet fikirleri al",
    ctaHref: "/yetenegini-farket",
    faq: [
      { q: "Zamanım çok kısıtlıysa hangi hizmetle başlamalıyım?", a: "Önce haftada kaç saat ayırabileceğini netleştir. Önceden planlanabilen (akşam dersi, hafta sonu atölyesi) ya da uzaktan, kendi saatinde yürütülebilen hizmetler esnek takvime daha kolay uyar." },
      { q: "Ne sunabileceğimi bilmiyorum, nereden başlarım?", a: "Yeteneğini Farket aracı, anlattığın becerilerden 1-2 hizmet fikri ve hazır bir vitrin taslağı önerir. Öneriler garanti değil, başlangıç noktasıdır; aracı denemek için üyelik gerekmez." },
      { q: "Vitrin açmak için ne kadar zaman ayırmam gerekir?", a: "Vitrin hazırlamak birkaç dakika sürer. Asıl zaman, müşterilerle görüşmeye ve hizmeti vermeye ayıracağın süredir; bunu baştan sınırlayıp vitrinde açıkça yazman iki taraf için de rahatlık sağlar." },
    ],
  },
  {
    slug: "gencler-icin-teknolojik-hizmet-fikirleri",
    seoTitle: "Öğrenciyim, Ne İş Yapabilirim? Dijital Hizmet Fikirleri",
    title: "Öğrenciyim, Ne İş Yapabilirim? Dijital Becerilerle Hizmet Fikirleri",
    description: "Telefonla ürün fotoğrafçılığı, kısa video düzenleme, Canva tasarımı, teknoloji desteği: genç yetişkinlerin dijital becerileriyle sunabileceği hizmet fikirleri ve ilk adımlar. Kazanç vaadi içermez.",
    category: "genel",
    bodyHtml: `
      <p>Telefonu iyi kullanmak, video kesmek, bir tasarım uygulamasında rahat olmak ya da bilgisayarla arası iyi olmak: gençlerin “hobi” saydığı pek çok beceri, çevredeki küçük işletmelerin ve ailelerin gerçekten ihtiyaç duyduğu bir <strong>hizmete</strong> dönüşebilir. Aşağıdakiler garanti ya da kazanç vaadi değil; denemeye değer fikirler ve ilk adımlar.</p>
      <p><strong>Yaş notu:</strong> İşinn'i kullanmak için 18 yaşından büyük olmak gerekir. 18 yaşın altındaysan çalışmaya ilişkin yasal sınırlar vardır; bu yazıdaki fikirleri önce aile içinde ve gönüllü projelerde denemek, becerini geliştirmenin güvenli yoludur. Emin olmadığın konuda ailene ve resmi kaynaklara danış.</p>
      <h2>1. Telefonla ürün fotoğrafçılığı</h2>
      <p>Küçük işletmelerin (pastane, butik, kuaför, el işi atölyesi gibi) kendi ürünlerinin düzgün fotoğraflarına ihtiyacı vardır. Sen bu işletmeler için <strong>fotoğraf çekme hizmeti</strong> sunarsın; ürünü satmak işletmenin işidir.</p>
      <ul>
        <li><strong>Gerekenler:</strong> Telefon kamerası, doğal ışık (pencere kenarı), sade bir fon (beyaz karton ya da kumaş), telefon sehpası.</li>
        <li><strong>Küçük ipuçları:</strong> Işığı yandan al, flaştan kaçın, ürünü aynı fonda ve aynı açıyla çek, ışık ve renk düzeltmesini ücretsiz bir uygulamada yap.</li>
        <li><strong>Vitrin için:</strong> Önce / sonra örnekleri, aynı ürünün sade fonlu ve ortamlı çekimi, çekim süresi ve kaç fotoğraf teslim ettiğin.</li>
      </ul>
      <h2>2. Kısa video çekimi ve düzenleme</h2>
      <p>İşletmelerin sosyal medya için kısa tanıtım videolarına ihtiyacı olabilir. Telefonla çekim, altyazı ve basit kurgu, tek başına bir hizmet olarak sunulabilir.</p>
      <h2>3. Canva ile tasarım: afiş, menü, sosyal medya görselleri</h2>
      <p>Hazır şablonlarla bile tutarlı bir görünüm hazırlamak, tasarım bilmeyen birçok işletmeye zaman kazandırır. Önce kendi çevrendeki iki üç kişi için örnek bir set hazırlayıp vitrinine koyabilirsin.</p>
      <h2>4. Teknoloji desteği</h2>
      <ul>
        <li>Yaşça büyük yakınlarına telefon, uygulama ve internet bankacılığının güvenli kullanımı konusunda sabırla destek olmak.</li>
        <li>Bilgisayar ya da telefon kurulumu, yedekleme, hesap güvenliği gibi temel konularda yardım.</li>
        <li>Yeni başlayanlara temel bilgisayar, Excel ya da kodlamaya giriş dersi.</li>
      </ul>
      <p><strong>Önemli:</strong> Müşterinin şifrelerini, bankacılık bilgilerini ya da özel verilerini asla isteme ve saklama; bu hem güveni zedeler hem de hukuki risk doğurur.</p>
      <h2>İlk adımı küçük tut</h2>
      <ol>
        <li>Bu fikirlerden yalnızca birini seç ve haftada kaç saat ayırabileceğini netleştir.</li>
        <li>Tanıdığın bir iki kişi ya da küçük işletme için ücretsiz deneme çalışması yap; izin alarak örnek çalışmalarını portfolyona koy.</li>
        <li>Fiyat, teslim süresi ve revize hakkını baştan yazılı belirle; belirsizlik tartışmanın en yaygın sebebidir.</li>
      </ol>
      <p>Hangi beceriyi hizmete çevirebileceğinden emin değilsen <a href="/yetenegini-farket">Yeteneğini Farket</a> aracı, anlattığın becerilerden fikirler ve hazır bir vitrin taslağı önerir; öneriler başlangıç noktasıdır, garanti değildir. İşinn kullanıcılar arasındaki ödemeye aracılık etmez; ücret ve belge/vergi düzeni için resmi kaynaklara (ör. Gelir İdaresi Başkanlığı) ve bir mali müşavire danışmanı öneririz. Bu yazı tavsiye değildir.</p>
    `,
    ctaText: "Becerinden hizmet fikirleri al",
    ctaHref: "/yetenegini-farket",
    faq: [
      { q: "Telefonla ürün fotoğrafçılığı hizmeti nasıl sunulur?", a: "Küçük işletmelerin ürünlerini doğal ışıkta, sade bir fonda ve tutarlı açılarla çekip düzenleyerek teslim edersin. Vitrinde örnek çekimlerini, teslim süreni ve kaç fotoğraf verdiğini yazman yeterli." },
      { q: "18 yaşından küçükler İşinn'de vitrin açabilir mi?", a: "Hayır, İşinn'i kullanmak için 18 yaşından büyük olmak gerekir. Daha genç olanlar becerilerini önce aile içinde ve gönüllü projelerle geliştirebilir; çalışmaya ilişkin yasal sınırlar için aileye ve resmi kaynaklara danışmak gerekir." },
      { q: "Başlamak için pahalı ekipman gerekir mi?", a: "Genellikle hayır. İyi bir telefon, doğal ışık ve sade bir fonla başlanabilir. Önce elindekiyle deneyip, gerçekten ihtiyaç duyarsan ekipman almak daha sağlıklıdır." },
      { q: "Bu yazıdaki fikirler kazanç garantisi verir mi?", a: "Hayır. Kazanç; müşteri bulmana, fiyatına ve ayırdığın zamana göre değişir ve bu yazı hiçbir gelir vaadi içermez. Vergi ve belge konusunda resmi kaynaklara ve bir mali müşavire danış." },
    ],
  },
  {
    slug: "becerilerimi-nasil-degerlendirebilirim",
    title: "Becerilerimi Nasıl Hizmete Çeviririm? 3 Soruda Cevap",
    description: "Becerini hizmete çevirmek için üç soru: bunu kim ister, nerede ve ne kadar sürede yaparım, ilk örneğimi nasıl gösteririm? Örneklerle adım adım rehber. Kazanç vaadi içermez.",
    category: "genel",
    bodyHtml: `
      <p>Nereden başlayacağını bilmiyorsan: cevap genellikle sıfırdan bir yetenek aramak değil, <strong>zaten yaptığın şeyleri başkasının ihtiyacıyla eşleştirmektir</strong>. Bu rehber, bunu üç soruyla yapmanı sağlar. Kazanç ya da talep vaadi içermez; amaç, ilk adımı netleştirmek.</p>
      <h2>Adım 1: Yaptığın şeyleri listele</h2>
      <p>Mükemmel olması gerekmez. Son bir ayda neleri yaptığını, hangi işlerde başkalarının sana danıştığını ya da yardım istediğini yaz. “Bunu herkes yapar” diye elediğin şeyler çoğu zaman listenin en değerli kısmıdır: tarif vermek, çocuğa ödevinde yardım etmek, dolap düzenlemek, telefonda bir ayar bulmak gibi.</p>
      <h2>Adım 2: Üç soruyla değerlendir</h2>
      <ol>
        <li><strong>Bunu kim ister?</strong> Çevrende bu işe ihtiyaç duyan somut biri var mı? Bir komşu, bir veli, küçük bir işletme sahibi… Bir isim ve bir durum düşünebiliyorsan beceri hizmete dönüşebilir.</li>
        <li><strong>Nerede ve ne kadar sürede yaparım?</strong> Haftada kaç saat ayırabileceğini, evden mi yüz yüze mi çalışmak istediğini ve ilk deneme için kaç lira bütçe ayırabileceğini baştan belirle. Bütçen yoksa “sıfır bütçe” de geçerli bir cevap; sadece ona göre bir iş seç.</li>
        <li><strong>İlk örneğimi nasıl gösteririm?</strong> Daha önce yaptığın bir iş, bir fotoğraf ya da iki cümlelik bir anlatım yeter. Olmayan bir deneyimi ya da belgeyi yazma; “yeni başlıyorum” demek yanlış bir iddiadan iyidir.</li>
      </ol>
      <h2>Örnekler (varsayımsal kişiler)</h2>
      <p>Aşağıdakiler gerçek kişi ya da başarı hikâyesi değil; üç soruyu nasıl uygulayabileceğini gösteren örneklerdir.</p>
      <ul>
        <li><strong>“Akşamları 2 saatim var, düzenliyimdir.”</strong> Kim ister: küçük işletmeler takvim ve randevu düzeni için. Nerede: evden, uzaktan. İlk örnek: kendi haftalık planlama şablonu. Fikir: uzaktan takvim ve randevu düzeni (sanal asistanlık).</li>
        <li><strong>“Çocuklarla vakit geçirmeyi seviyorum, haftada 6 saatim var.”</strong> Kim ister: yakın çevredeki veliler. Nerede: yüz yüze. İlk örnek: yaptırabildiğin üç etkinlik fikri. Fikir: oyun ve etkinlik desteği ya da belirli saatlerde çocuk bakımı.</li>
        <li><strong>“Dikiş ve örgü yapıyorum, bütçem yok.”</strong> Kim ister: kıyafetini düzelttirmek ya da özel bir iş yaptırmak isteyenler. Nerede: evden. İlk örnek: yaptığın işlerin fotoğrafı. Fikir: onarım ve düzeltme hizmeti ya da küçük grup atölyesi. (İşinn'de ürün satışı yapılmaz; beceriyi hizmet olarak sunarsın.)</li>
      </ul>
      <h2>Adım 3: Bir fikri seç, küçük başla</h2>
      <p>Hepsini aynı anda denemek gerekmez. Bir fikir seç, bir hafta boyunca yalnızca onu düşün: kimle konuşacaksın, hangi örneği hazırlayacaksın? Sonra <a href="/rehber/ilk-vitrinini-nasil-hazirlarsin">ilk vitrinini hazırla</a>.</p>
      <p>Bu üç soruyu kendi başına cevaplamak zor geliyorsa <a href="/yetenegini-farket">Yeteneğini Farket</a> aracı yazdıklarından 1-2 hizmet fikri ve hazır bir vitrin taslağı önerir. Öneriler garanti değil, başlangıç noktasıdır; araca yazdıklarından başka bilgi eklemez.</p>
    `,
    ctaText: "Becerinden hizmet fikirleri al",
    ctaHref: "/yetenegini-farket",
    faq: [
      { q: "Becerilerimi nasıl değerlendirebilirim?", a: "Yaptığın şeyleri listele, sonra üç soruyla değerlendir: Bunu kim ister? Nerede ve ne kadar sürede yaparım? İlk örneğimi nasıl gösteririm? Üçüne de somut cevap verebiliyorsan beceri bir hizmete dönüşebilir." },
      { q: "Hiçbir yeteneğim yok gibi hissediyorum, ne yapmalıyım?", a: "Gündelik yaptığın şeyleri (tarif vermek, çocuğa ödevinde yardım etmek, düzenlemek, telefonda bir sorunu çözmek) yazmakla başla. Başkalarının sana ne için danıştığına bak; çoğu zaman beceri oradadır." },
      { q: "Nereden başlayacağımı bilmiyorum, hızlı bir yol var mı?", a: "Kesin bir cevap yok; ama Yeteneğini Farket aracı yazdıklarından 1-2 hizmet fikri ve hazır bir vitrin taslağı önerir. Öneriler garanti değildir, bir başlangıç noktasıdır." },
      { q: "Bütçem yoksa başlayabilir miyim?", a: "Evet. Bütçeni araca ya da kendine baştan söyle; sıfır bütçeyle başlanabilecek işler (ders, uzaktan destek, çocuk etkinlikleri, onarım gibi) seç ve ekipman gerektirenleri sonraya bırak." },
    ],
  },
  {
    slug: "ilk-vitrinini-nasil-hazirlarsin",
    seoTitle: "İlk Hizmet Vitrinini Nasıl Hazırlarsın? Adım Adım Rehber",
    title: "İlk Hizmet Vitrinini Nasıl Hazırlarsın? Başlık, Açıklama ve Fotoğraf Rehberi",
    description: "Becerini hizmete çevirdin, şimdi ilk vitrinini yaz: iyi bir başlık, dürüst bir açıklama, doğru fotoğraflar ve net bir çalışma düzeni. Önce/sonra örnekleriyle adım adım rehber.",
    category: "genel",
    bodyHtml: `
      <p>İyi bir vitrin, işini abartmadan <strong>kim için, ne yaptığını, nasıl çalıştığını</strong> anlatan bir vitrindir. Bu rehberde başlık, açıklama, fotoğraf ve çalışma düzeni için örnekler var. Henüz ne sunacağından emin değilsen önce <a href="/rehber/becerilerimi-nasil-degerlendirebilirim">becerilerini değerlendir</a> ya da <a href="/yetenegini-farket">Yeteneğini Farket</a> aracından bir taslak al.</p>
      <h2>1. Başlık: kim için, ne yapıyorsun?</h2>
      <p>Başlık kısa ve somut olsun. Genel bir başlık kimseyi çekmez; hedefi ve hizmeti söyleyen başlık hemen anlaşılır.</p>
      <ul>
        <li><strong>Zayıf:</strong> “Her türlü iş yapılır”, “Hizmet veriyorum”.</li>
        <li><strong>Daha iyi:</strong> “İlkokul çocukları için ödev ve etkinlik desteği”, “Evde dikiş onarımı ve paça düzeltme”, “Küçük işletmeler için telefonla ürün fotoğrafı çekimi”.</li>
      </ul>
      <h2>2. Açıklama: ne, nerede, nasıl, ne zaman?</h2>
      <p>İki üç cümle yeter; şu dört bilgi bulunsun: ne yaptığın, hangi bölgede ya da uzaktan çalıştığın, nasıl çalıştığın (süre, kişi sayısı) ve hangi gün-saatlerde müsait olduğun.</p>
      <p><em>Örnek:</em> “İlkokul çağındaki çocuklar için hafta içi akşamları evlerinde ödev desteği ve oyun etkinliği yapıyorum. Ataşehir ve çevresinde çalışıyorum. Bir seans yaklaşık bir saat sürer.” (Burada bölge, süre ve gün senin kendi bilgilerin olmalı; örneği olduğu gibi kopyalama.)</p>
      <h2>3. Yazma: yapmaman gerekenler</h2>
      <ul>
        <li>Sahip olmadığın sertifika, diploma ya da deneyim süresini yazma.</li>
        <li>“Garanti”, “en iyi”, “%100 memnuniyet” gibi ölçülemeyen iddialardan kaçın.</li>
        <li>Lisans ya da belge gerektiren işlerde (sağlık, hukuk gibi) mevzuata uygun hareket et.</li>
        <li>Ürün satışına yönlendirme yapma: İşinn hizmetlerin keşfi içindir; mağaza, sepet ya da kargo yoktur.</li>
      </ul>
      <h2>4. Fotoğraf: kendi işini göster</h2>
      <ul>
        <li>Kendi yaptığın işten ya da çalışma ortamından net, aydınlık fotoğraflar kullan.</li>
        <li>Tanınabilir çocuk yüzü içeren fotoğraf yükleme; çocukların fotoğrafları platformda kabul edilmez.</li>
        <li>İnternetten bulduğun ya da başkasına ait fotoğrafı kullanma.</li>
      </ul>
      <h2>5. Çalışma düzeni ve iletişim</h2>
      <p>Haftada kaç saat ayırabildiğini ve hangi günler müsait olduğunu açıkça yaz. İşinn kullanıcılar arasındaki ödemeye aracılık etmez; ücret, iptal ve ödeme şeklini görüşmenin başında netleştir.</p>
      <h2>6. Yayınla, sonra geliştir</h2>
      <p>İlk vitrin mükemmel olmak zorunda değil. Yayınladıktan sonra aldığın sorulara göre açıklamayı güncelle. Taslağı sıfırdan yazmak zor geliyorsa Yeteneğini Farket aracı yazdıklarına dayanarak bir başlık ve açıklama taslağı hazırlar; yayınlamadan önce her cümleyi kontrol edip sana ait olmayan her şeyi düzeltmen gerekir.</p>
    `,
    ctaText: "İlk vitrinini oluştur",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "İyi bir hizmet vitrini başlığı nasıl yazılır?", a: "Kim için ne yaptığını söyleyen kısa ve somut bir başlık yaz. “Her türlü iş yapılır” yerine “İlkokul çocukları için ödev ve etkinlik desteği” gibi hedefi ve hizmeti belirten bir başlık daha anlaşılırdır." },
      { q: "Vitrin açıklamasında neler bulunmalı?", a: "Ne yaptığın, hangi bölgede ya da uzaktan çalıştığın, nasıl çalıştığın (süre, kişi sayısı) ve hangi günlerde müsait olduğun. İki üç cümle yeterlidir; olmayan bir deneyim ya da sertifika yazma." },
      { q: "Vitrinde hangi fotoğrafları kullanabilirim?", a: "Kendi yaptığın işten ya da çalışma ortamından aydınlık, net fotoğraflar. Tanınabilir çocuk yüzü içeren fotoğraflar ve başkasına ait görseller kullanılamaz." },
      { q: "Ücretimi vitrinde yazmak zorunda mıyım?", a: "Fiyat bilgisi vitrinin netliğini artırabilir, ama ödemeler kullanıcılar arasında yapılır ve İşinn buna aracılık etmez; ücret ve iptal koşullarını görüşmenin başında netleştir." },
    ],
  },
];

// Türkçe yazılar + İngilizce (lang: "en") yazılar tek listede; sitemap, llms.txt ve sayfalar bunu kullanır.
export const REHBER_POSTS = [...REHBER_POSTS_TR, ...REHBER_POSTS_TR2, ...REHBER_POSTS_TR3, ...REHBER_POSTS_TR4, ...REHBER_POSTS_TR5, ...REHBER_POSTS_TR6, ...REHBER_POSTS_TR7, ...REHBER_POSTS_TR8, ...REHBER_POSTS_TR9, ...REHBER_POSTS_TR10, ...REHBER_POSTS_TR11, ...REHBER_POSTS_TR12, ...REHBER_POSTS_EN, ...REHBER_POSTS_EN2];

// Aynı yazının Türkçe ve İngilizce hali (hreflang için; app/rehber/[slug]/page.js alternates.languages).
const REHBER_TRANSLATION_PAIRS = [
  ["freelance-iste-revizyon-hakki-kac-olmali", "freelance-revisions-how-many-should-you-include"],
  ["freelancer-ile-calismadan-once-sorulacak-sorular", "questions-to-ask-a-freelancer-before-hiring"],
  ["freelancer-ile-calismadan-once-brief-nasil-hazirlanir", "how-to-write-a-freelance-project-brief"],
];
export function rehberTranslations(slug) {
  const pair = REHBER_TRANSLATION_PAIRS.find((p) => p.includes(slug));
  return pair ? { tr: pair[0], en: pair[1] } : null;
}

export function findRehberPost(slug) {
  return REHBER_POSTS.find((p) => p.slug === slug) || null;
}

// Yayın/güncelleme tarihleri ve (varsa) 40-60 kelimelik "kısa cevap" — yapay zekâ özetleri
// ve arama sonuçları için alıntılanabilir giriş. Yazıyı içerik olarak değiştirdiğinde
// "updated" tarihini güncelle (sitemap lastmod ve Article şeması buradan okur).
const DEFAULT_DATES = { published: "2026-09-21", updated: "2026-09-21" };
export const REHBER_META = {
  ...REHBER_META_EN,
  ...REHBER_META_EN2,
  ...REHBER_META_TR2,
  ...REHBER_META_TR3,
  ...REHBER_META_TR4,
  ...REHBER_META_TR5,
  ...REHBER_META_TR6,
  ...REHBER_META_TR7,
  ...REHBER_META_TR8,
  ...REHBER_META_TR9,
  ...REHBER_META_TR10,
  ...REHBER_META_TR11,
  ...REHBER_META_TR12,
  "ek-gelir-ve-freelance-is-yollari": { updated: "2026-10-04" },
  // 2026-11-07: kısa kalan beş eski rehber genişletildi.
  "ev-temizligi-kac-saat-surer": { published: "2026-09-21", updated: "2026-11-07" },
  "iyi-ozel-ders-ogretmeni-nasil-secilir": { published: "2026-09-21", updated: "2026-11-07" },
  "lgs-hazirlik-sureci-nasil-planlanir": { published: "2026-09-21", updated: "2026-11-07" },
  "ev-tadilatinda-usta-secerken-nelere-dikkat-edilmeli": { published: "2026-09-21", updated: "2026-11-07" },
  "cocuk-bakicisi-secerken-sorulmasi-gereken-sorular": { published: "2026-09-21", updated: "2026-11-07" },
  "evden-ders-ve-atolye-vermek": {
    published: "2026-10-04", updated: "2026-10-04",
    shortAnswer: "Evden ders ya da atölye vermek için önce konunu dar tanımla (kime, hangi seviyede, ne öğreteceğini tek cümleyle yaz), tanıdığın iki üç kişiyle deneme dersi yap, sonra vitrinini hazırla. Belge gerektiren alanlarda mevzuata uymak sana aittir; kazanç garantisi yoktur.",
  },
  "sirket-kurmadan-hizmet-sunmak": {
    published: "2026-10-04", updated: "2026-10-23",
    shortAnswer: "İşinn'de vitrin açmak için şirket kurmak gerekmez; bireysel olarak hizmetini tanıtabilirsin. Vergi ve belge yükümlülükleri işin türüne ve kazancına göre değişir: kesin bilgi için Gelir İdaresi Başkanlığı'nın resmi kaynaklarına ve bir mali müşavire danış. Bu yazı yasal ya da mali tavsiye değildir.",
  },
  "calisan-anneler-icin-esnek-hizmet-fikirleri": {
    published: "2026-10-04", updated: "2026-10-04",
    shortAnswer: "Zamanı kısıtlı olanlar için akşam ya da hafta sonu planlanabilen (ödev desteği, atölye, etkinlik planlama) ve uzaktan yürütülebilen (yazı, çeviri, sanal asistanlık) hizmetler uygundur. Önce haftada kaç saat ayırabileceğini yaz, tek hizmetle başla; öneriler garanti değildir.",
  },
  "gencler-icin-teknolojik-hizmet-fikirleri": {
    published: "2026-10-04", updated: "2026-10-04",
    shortAnswer: "Telefonla ürün fotoğrafçılığı, kısa video düzenleme, Canva ile tasarım ve teknoloji desteği, gençlerin dijital becerileriyle sunabileceği hizmet örnekleridir. İşinn'i kullanmak için 18 yaşından büyük olmak gerekir; yazıdaki fikirler kazanç vaadi içermez.",
  },
  "becerilerimi-nasil-degerlendirebilirim": {
    published: "2026-10-04", updated: "2026-10-04",
    shortAnswer: "Becerini hizmete çevirip çeviremeyeceğini üç soruyla değerlendirebilirsin: Bunu kim ister? Nerede ve ne kadar sürede yaparım? İlk örneğimi nasıl gösteririm? Üçüne de somut cevap verebiliyorsan beceri bir hizmete dönüşebilir; sonucun garantisi yoktur.",
  },
  "ilk-vitrinini-nasil-hazirlarsin": {
    published: "2026-10-04", updated: "2026-10-04",
    shortAnswer: "İyi bir ilk vitrin; kim için ne yaptığını söyleyen kısa bir başlık, ne-nerede-nasıl-ne zaman bilgisini veren iki üç cümlelik bir açıklama, kendi işinden net fotoğraflar ve açık bir çalışma düzeni içerir. Sahip olmadığın belge, deneyim ya da garanti yazma.",
  },
};
export function rehberMeta(post) {
  return { ...DEFAULT_DATES, ...(REHBER_META[post.slug] || {}) };
}
