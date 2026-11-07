// İki fiyat rehberi (2026-11-07): mali müşavir ücretleri (resmî asgari tarife) ve direksiyon dersi ücretleri.
// Bionluk'un hiç olmadığı alanlar (bkz. docs/bionluk-arastirmasi-2026-11-07.md). Kurallar Tr9/Tr10 ile aynı:
// her rakamın kaynağı bağlantılı; İşinn fiyat vermez; rakip hizmet pazaryeri verisi yok; kaynaklar arası
// çelişkiler yan yana gösterilir. Psikolog ve diyetisyen rehberleri yazılmadı: bulunan kaynaklar yöntemi belirsiz
// tahminler ya da eski haberlerdi; sağlık alanında zayıf kaynakla fiyat yazılmaz.
const NOTE = `<p><em>Bu sayfadaki rakamlar bağlantısı verilen kaynaklarda yayımlanan tutarlardır; İşinn'in belirlediği ya da garanti ettiği fiyatlar değildir. Fiyatlar değişebilir; kesin ücreti hizmet verenle konuşarak öğren.</em></p>`;
const LEGAL = `<p><em>Bu sayfa genel bilgilendirme amaçlıdır, hukuki ya da mali tavsiye değildir. Güncel ve kesin bilgi için resmî metne, ilgili meslek odasına ya da kurumlara başvur.</em></p>`;

const a = (href, text) => `<a href="${href}" rel="nofollow noopener" target="_blank">${text}</a>`;

const TURMOB_PDF = a("https://www.turmob.org.tr/arsiv/mbs/resmigazete/33110-2026-SMMMUCRET-TARIFESI.pdf", "2026 asgari ücret tarifesi, Resmî Gazete 17 Aralık 2025, sayı 33110");
const MALIAJANDA = a("https://maliajanda.com/blog/smmm-asgari-ucret-tarifesi-2026", "Mali Ajanda, 2026 tarife özeti");
const ELEMAN_SMMM = a("https://www.eleman.net/is-rehberi/maaslar-ve-ucretler/muhasebeci-ucretleri-tarifesi-h16293", "eleman.net, Temmuz 2026");
const CNNTURK_SMMM = a("https://www.cnnturk.com/ekonomi/serbest-muhasebecilik-2026-ucret-tarifesi-belli-oldu-2373148", "CNN Türk, 17 Aralık 2025");

const ELEMAN_DIREKSIYON = a("https://www.eleman.net/is-rehberi/maaslar-ve-ucretler/surus-direksiyon-ders-ucretleri-ne-kadar-h20799", "eleman.net, Nisan 2026");
const SOZCU_EHLIYET = a("https://www.sozcu.com.tr/b-sinifi-ehliyet-almanin-faturasi-agirlasti-iste-cebinizden-cikacak-yeni-tutar-p327076", "Sözcü, Haziran 2026");
const MTSK_YONETMELIK = a("https://www.muhasebenews.com/?p=66773", "MTSK Yönetmeliği değişikliği, Resmî Gazete 12 Eylül 2019");

export const REHBER_POSTS_TR11 = [
  {
    slug: "mali-musavir-ucretleri-2026",
    title: "Mali Müşavir Ücretleri 2026: Resmî Asgari Tarife",
    description: "2026 resmî tarifeye göre büyük illerde aylık muhasebe ücreti işletme defterinde 1.145 TL, serbest meslekte 1.773 TL, limited şirkette 3.606 TL'den başlıyor.",
    category: "genel",
    bodyHtml: `
      <p>Mali müşavir (SMMM) ücretlerinin diğer hizmetlerden önemli bir farkı var: alt sınırı resmî olarak belirleniyor. TÜRMOB ile Hazine ve Maliye Bakanlığı her yıl bir <strong>asgari ücret tarifesi</strong> yayımlıyor. 2026 tarifesi 17 Aralık 2025 tarihli Resmî Gazete'de yayımlandı ve 1 Ocak 2026'da yürürlüğe girdi (${TURMOB_PDF}). Tarife bir taban fiyat; mali müşavir iş yüküne göre daha yüksek ücret isteyebilir, ama bunun altına inmemesi gerekir.</p>
      <h2>Aylık defter tutma ücretleri (1. grup iller)</h2>
      <p>Tarife illeri dört gruba ayırıyor; en yüksek ücretler 1. grupta. Çalışanı olmayan, hizmet sektöründeki işletmeler için 1. grup aylık asgari tutarlar şöyle (KDV dahil) (${MALIAJANDA}; ${ELEMAN_SMMM}):</p>
      <ul>
        <li><strong>İşletme defteri (şahıs, hizmet):</strong> 1.145 TL</li>
        <li><strong>Serbest meslek kazanç defteri</strong> (doktor, avukat, mimar, mühendis, danışman gibi serbest meslek sahipleri): 1.773 TL</li>
        <li><strong>Bilanço esası şahıs işletmesi:</strong> 3.091 TL</li>
        <li><strong>Limited şirket:</strong> 3.606 TL</li>
        <li><strong>Anonim şirket:</strong> 5.123 TL</li>
      </ul>
      <p>Aynı kalemler diğer il gruplarında daha düşük; örneğin serbest meslek kazanç defteri 4. grupta 1.345 TL, limited şirket 2.719 TL (${MALIAJANDA}). Haberlere göre tarifedeki defter tutma bedelleri işletmenin türüne ve büyüklüğüne göre 515 TL ile 11.734 TL arasında değişiyor (${CNNTURK_SMMM}).</p>
      <h2>Diğer kalemler</h2>
      <ul>
        <li><strong>Yıllık gelir vergisi ya da kurumlar vergisi beyannamesi:</strong> 3.864 TL (1. grup)</li>
        <li><strong>Kuruluş işlemleri:</strong> çalışanı olmayan şahıs işletmesi 1.288 TL, limited şirket 5.209 TL, anonim şirket 6.440 TL (1. grup)</li>
        <li><strong>Arızi danışmanlık, saat başı:</strong> büroda 2.347 TL, işletmede 3.291 TL</li>
      </ul>
      <p>Kaynak: ${MALIAJANDA}. Haberlere göre kuruluş işlemleri için ödenebilecek en yüksek tutar 14.597 TL (${CNNTURK_SMMM}).</p>
      <h2>Ücreti neler artırır?</h2>
      <ul>
        <li><strong>Çalışan sayısı:</strong> tarifedeki tutarlar çalışanı olmayan işletmeler için; çalışan varsa her biri için ek ücret uygulanıyor.</li>
        <li><strong>Sektör:</strong> imalat ve inşaat gibi işlerde ücretler hizmet sektöründen yüksek; örneğin işletme defteri imalat-inşaatta 1.631 TL (${ELEMAN_SMMM}).</li>
        <li><strong>İş hacmi:</strong> fatura sayısı, e-defter, ithalat-ihracat ve birden fazla KDV oranı iş yükünü artırır. Büyük şehirlerde mali müşavirler çoğu zaman tarifenin üzerinde fiyat verir.</li>
        <li><strong>Şehir:</strong> eleman.net'e göre İstanbul gibi büyükşehirlerde il katsayısı nedeniyle ücretler yüzde 35'e kadar artabiliyor (${ELEMAN_SMMM}).</li>
      </ul>
      <h2>İndirimler</h2>
      <p>Kaynaklara göre nüfusu 50.000'in altındaki ilçelerde maktu ücretler yüzde 25 indirimli uygulanabiliyor. Engelli müşteriler için ilk iki yıl yüzde 25 indirim uygulanabiliyor (${ELEMAN_SMMM}). Kendi durumuna uyup uymadığını mali müşavirine sor.</p>
      <h2>Serbest çalışan biri için ne anlama geliyor?</h2>
      <p>Freelance çalışan biri şirket kurmadan serbest meslek kazanç defteri tutuyorsa, büyük illerde aylık asgari muhasebe ücreti 1.773 TL. Yıllık beyanname ayrıca ücretlendirilebilir. Henüz vergi mükellefi olup olmaman gerektiğini düşünüyorsan önce <a href="/rehber/sirket-kurmadan-hizmet-sunmak">şirket kurmadan hizmet sunmak</a> rehberine bakabilirsin.</p>
      <h2>Mali müşavirle anlaşırken sorulacaklar</h2>
      <ul>
        <li>Aylık ücrete hangi işler dahil: defter, beyannameler, bordro?</li>
        <li>Yıllık beyanname ve kuruluş ayrıca ücretlendiriliyor mu?</li>
        <li>Belgeleri nasıl ve ne zaman göndermen gerekiyor?</li>
        <li>e-Fatura, e-Arşiv ve e-Defter işlemlerini kim yürütecek?</li>
        <li>Yazılı bir hizmet sözleşmesi yapılacak mı?</li>
      </ul>
      <p>İşinn'de mali müşavir ve muhasebe hizmeti verenlerin vitrinlerine bakıp doğrudan mesajla fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
      ${LEGAL}
    `,
    ctaText: "Muhasebe hizmeti verenleri keşfet",
    ctaHref: "/kategori/muhasebe",
    faq: [
      { q: "2026'da mali müşavir aylık ücreti ne kadar?", a: "2026 resmî asgari tarifesine göre 1. grup illerde, çalışanı olmayan hizmet işletmeleri için aylık asgari ücret işletme defterinde 1.145 TL, serbest meslek kazanç defterinde 1.773 TL, limited şirkette 3.606 TL, anonim şirkette 5.123 TL (KDV dahil). Mali müşavir iş yüküne göre daha yüksek ücret isteyebilir." },
      { q: "Mali müşavir asgari ücretin altında çalışabilir mi?", a: "Tarife, mali müşavirlerin uygulaması gereken asgari ücretleri belirliyor; yani bir taban fiyat. Ücret bunun üzerinde serbestçe belirlenebilir. Küçük ilçeler ve engelli müşteriler için tarifede belirli indirimler var." },
      { q: "Freelancer'ın muhasebe ücreti ne kadar?", a: "Şirket kurmadan serbest meslek kazanç defteri tutan biri için 2026'da 1. grup illerde aylık asgari ücret 1.773 TL, 4. grup illerde 1.345 TL (KDV dahil). Yıllık beyanname ayrıca ücretlendirilebilir." },
    ],
  },
  {
    slug: "direksiyon-dersi-ucretleri-2026",
    title: "Direksiyon Dersi Ücretleri 2026: Saatlik Ders ve Kurs",
    description: "2026 kaynaklarına göre saatlik direksiyon dersi 2.000–4.000 TL, sürücü kursu paketi 13.000–30.000 TL. Sınav ücretleri ve ehliyeti olanlar için kurs seçeneği.",
    category: "genel",
    bodyHtml: `
      <p>"Direksiyon dersi ne kadar?" sorusunun iki farklı anlamı var: ehliyet almak için sürücü kursuna yazılmak, ya da ehliyeti olduğu halde araç kullanmaya güvenemeyen birinin pratik yapması. İkisinin de ücretleri farklı. Aşağıda 2026'da yayımlanmış iki kaynaktaki rakamları yan yana koyduk.</p>
      <h2>Saatlik direksiyon dersi</h2>
      <p>eleman.net'in Nisan 2026 tarihli rehberine göre (${ELEMAN_DIREKSIYON}):</p>
      <ul>
        <li><strong>1 saatlik direksiyon dersi:</strong> 2.000–4.000 TL; bazı kurslarda özel ders daha pahalı olabiliyor</li>
        <li><strong>5–10 saatlik paket:</strong> 2.500–6.000 TL; kaynak bu aralığı "eski ortalama" olarak niteliyor ve güncel fiyatların daha yüksek olabileceğini yazıyor</li>
      </ul>
      <p>Saatlik ücret ile paket fiyatı arasındaki fark büyük; paketin kaç saat ve hangi araçla olduğunu mutlaka sor.</p>
      <h2>Sürücü kursu ve ehliyet toplam maliyeti</h2>
      <ul>
        <li><strong>Sürücü kursu paketi</strong> (teorik eğitim, belirli sayıda direksiyon dersi ve sınav başvuruları): ortalama 13.000–26.000 TL, bazı şehirlerde 20.000–30.000 TL (${ELEMAN_DIREKSIYON})</li>
        <li><strong>Sözcü'nün Haziran 2026 hesabı:</strong> kurs taban ücreti 25.000 TL; e-sınav 1.250 TL, direksiyon sınavı 2.800 TL, sağlık raporu 312 TL, biyometrik fotoğraf 500 TL, ehliyet harcı 9.456,44 TL, değerli kâğıt bedeli 2.366 TL, vakıf payı 595 TL; toplam 42.279,44 TL (${SOZCU_EHLIYET})</li>
      </ul>
      <p>Direksiyon sınav ücreti konusunda kaynaklar uyuşmuyor: eleman.net 6.000 TL, Sözcü 2.800 TL yazıyor. eleman.net'e göre direksiyon sınavında kalan aday 2 saat zorunlu telafi dersi alıyor ve bu, kursa göre toplam 5.000–6.000 TL'yi bulabiliyor (${ELEMAN_DIREKSIYON}). Kesin tutarları kayıt olacağın kurstan yazılı olarak iste.</p>
      <h2>Ehliyetin var ama araç kullanamıyorsan</h2>
      <p>Ehliyeti yıllar önce alıp hiç araç kullanmamış ya da kullanmaya çekinen çok kişi var. 2019'da yapılan yönetmelik değişikliğine göre sürücü belgesi olup kendini araç kullanmada yeterli görmeyen kişiler, sürücü kurslarına sürücü belgeleriyle kayıt olabiliyor; bu kişilere trafik adabı dersi ve ihtiyaç duydukları kadar direksiyon eğitimi veriliyor (${MTSK_YONETMELIK}). Yani yalnızca pratik eksiğini kapatmak için de kursa başvurabilirsin.</p>
      <h2>Ücreti neler belirler?</h2>
      <ul>
        <li><strong>Şehir:</strong> büyükşehirlerde ücretler daha yüksek.</li>
        <li><strong>Araç:</strong> otomatik vites araçla ders bazı kurslarda farklı ücretlendirilebilir.</li>
        <li><strong>Ders süresi ve saati:</strong> akşam ve hafta sonu dersleri, ders süresinin 45 dakika mı 60 dakika mı olduğu.</li>
        <li><strong>Paket içeriği:</strong> kaç saat direksiyon dersi, kaç sınav hakkı ve hangi harçların dahil olduğu.</li>
      </ul>
      <h2>Kursa yazılmadan önce sorulacaklar</h2>
      <ul>
        <li>Paket fiyatına kaç saat direksiyon dersi dahil?</li>
        <li>Sınav ücretleri ve harçlar fiyata dahil mi, ayrı mı ödenecek?</li>
        <li>Sınavda kalırsam telafi dersi ve yeni sınav ne kadar?</li>
        <li>Ek ders saat ücreti ne kadar?</li>
        <li>Dersler hangi saatlerde ve hangi araçla yapılıyor?</li>
      </ul>
      <p>İşinn'de direksiyon eğitmenlerinin vitrinlerine bakıp doğrudan mesajla bilgi alabilirsin. Ehliyet almak için verilen eğitim, Millî Eğitim Bakanlığı'na bağlı sürücü kurslarında yapılır; görüştüğün kişinin hangi kurs bünyesinde çalıştığını sormayı unutma. İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
      ${LEGAL}
    `,
    ctaText: "Direksiyon eğitmenlerini keşfet",
    ctaHref: "/kategori/direksiyon-egitmeni",
    faq: [
      { q: "2026'da 1 saatlik direksiyon dersi ne kadar?", a: "eleman.net'in Nisan 2026 rehberine göre 1 saatlik direksiyon dersi 2.000–4.000 TL; bazı kurslarda özel ders daha pahalı olabiliyor. Şehir, araç ve ders saati fiyatı etkiler." },
      { q: "2026'da B sınıfı ehliyet toplam kaça mal oluyor?", a: "Sözcü'nün Haziran 2026 hesabına göre kurs taban ücreti 25.000 TL ile birlikte sınav ücretleri, sağlık raporu, fotoğraf, harç ve değerli kâğıt bedeliyle toplam 42.279,44 TL. Kurs ücretleri ile sınav ücreti kaynağa ve ile göre değişiyor." },
      { q: "Ehliyetim var ama araç kullanamıyorum, kursa gidebilir miyim?", a: "Evet. 2019'daki yönetmelik değişikliğine göre sürücü belgesi olup kendini yeterli görmeyen kişiler sürücü kurslarına belgeleriyle kayıt olabiliyor; trafik adabı dersi ve ihtiyaç kadar direksiyon eğitimi alabiliyor." },
    ],
  },
];

export const REHBER_META_TR11 = {
  "mali-musavir-ucretleri-2026": {
    published: "2026-11-07", updated: "2026-11-07",
    shortAnswer: "2026 resmî asgari tarifesine göre 1. grup illerde aylık muhasebe ücreti işletme defterinde 1.145 TL, serbest meslek kazanç defterinde 1.773 TL, limited şirkette 3.606 TL, anonim şirkette 5.123 TL'den başlıyor (KDV dahil, çalışanı olmayan hizmet işletmeleri). Bu tutarlar taban fiyattır; mali müşavir daha yüksek ücret isteyebilir.",
  },
  "direksiyon-dersi-ucretleri-2026": {
    published: "2026-11-07", updated: "2026-11-07",
    shortAnswer: "2026 kaynaklarına göre 1 saatlik direksiyon dersi 2.000–4.000 TL, sürücü kursu paketi 13.000–30.000 TL. Sınav ücretleri ve harçlarla B sınıfı ehliyetin toplam maliyeti bir hesapta 42.279 TL. Ehliyeti olup araç kullanamayanlar da sürücü kurslarına kayıt olabiliyor.",
  },
};
