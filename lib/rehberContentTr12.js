// Firma tarafına yönelik üç mühendislik rehberi (2026-11-11). Kurucu isteği: savunma, otomotiv ve havacılık
// ekipleri proje bazlı uzman arasın ya da talep bıraksın. Kurallar: firma adı ve logo kullanılmaz; İşinn'de
// kaç mühendis olduğu ya da "en iyi" gibi iddialar yok; fiyat rakamı yok (kaynaksız rakam yazılmaz). Yasal
// atıflar (FSEK, GVK) genel bilgi düzeyinde; gizlilik dereceli işler için firmanın kendi güvenlik birimine yönlendirilir.
const LEGAL = `<p><em>Bu sayfa genel bilgilendirme amaçlıdır, hukuki ya da mali tavsiye değildir. Sözleşme ve vergi konularında avukatına ya da mali müşavirine danış.</em></p>`;

export const REHBER_POSTS_TR12 = [
  {
    slug: "proje-bazli-freelance-muhendis-nasil-bulunur",
    title: "Firmalar İçin Proje Bazlı Freelance Mühendis Nasıl Bulunur?",
    seoTitle: "Proje Bazlı Freelance Mühendis Nasıl Bulunur?",
    description: "Tasarım, analiz ya da dokümantasyon işi için kadro açmadan mühendis bulmak: kapsam, gizlilik, fikrî haklar, ödeme ve teslim adımları.",
    category: "genel",
    bodyHtml: `
      <p>Bir projede birkaç aylık tasarım, analiz ya da dokümantasyon yükü doğduğunda her zaman yeni kadro açmak gerekmez. Mekanik tasarım, CAD çizim, sonlu elemanlar analizi, akış analizi, gömülü yazılım, test planı ya da teknik doküman gibi işler, kapsamı net tanımlandığında proje bazlı çalışan bir mühendisle yürütülebilir. Bu rehber, firmanın bu süreci adım adım nasıl kurabileceğini anlatıyor.</p>
      <h2>1. Önce işi kadro işinden ayır</h2>
      <p>Dışarıya verilecek iş, ürünün çekirdek bilgisini taşımayan, sınırları çizilebilen bir parça olmalı. İyi adaylar: bir alt montajın tasarımı, mevcut çizimlerin standarda uygun hale getirilmesi, belirli bir parçanın dayanım analizi, test düzeneği tasarımı, teknik doküman ve kullanım kılavuzu. Ürün mimarisi, müşteri ilişkisi ya da uzun vadeli bakım gerektiren işler çoğu zaman ekip içinde kalmalı.</p>
      <h2>2. Kapsamı yazılı ve ölçülebilir tanımla</h2>
      <ul>
        <li><strong>Teslim edilecekler:</strong> hangi dosyalar, hangi biçimde (ör. STEP, DWG, yerel CAD dosyası, analiz raporu).</li>
        <li><strong>Kabul ölçütü:</strong> işin "bitti" sayılması için ne gerekiyor (ör. belirli bir yük altında emniyet katsayısı, standarda uygun çizim, test raporu).</li>
        <li><strong>Girdiler:</strong> firmanın sağlayacağı modeller, şartnameler, yazılım lisansları.</li>
        <li><strong>Takvim:</strong> ara teslimler ve son teslim tarihi.</li>
      </ul>
      <p>Ayrıntılı bir iş tanımı için <a href="/rehber/muhendislik-isi-icin-teknik-is-tanimi-nasil-yazilir">mühendislik işi için teknik iş tanımı nasıl yazılır</a> rehberine bakabilirsin.</p>
      <h2>3. Gizlilik ve fikrî hakları baştan çöz</h2>
      <p>Paylaşılacak bilgi için yazılı bir gizlilik sözleşmesi imzala ve yalnızca işin gerektirdiği kadar bilgi paylaş. Fikrî haklar konusunda önemli bir ayrım var: Fikir ve Sanat Eserleri Kanunu'na göre çalışanın işi gereği ürettiği eserler üzerindeki haklar kural olarak işverene aittir (madde 18); ama proje bazlı çalışan bir freelancer çalışan değildir. Bu yüzden tasarım ve yazılım üzerindeki mali hakların firmaya geçtiği, sözleşmede yazılı olarak ve haklar tek tek sayılarak belirtilmelidir (madde 52).</p>
      <p><strong>Gizlilik dereceli işler:</strong> Savunma alanında gizlilik dereceli bilgiye erişim gerektiren işlerde, Milli Savunma Bakanlığı'nın sanayi güvenliği kuralları kapsamında kişi ve tesis güvenlik belgesi gibi şartlar aranır. Bu tür işler açık bir platformda paylaşılmamalı; ayrıntıyı firmanın güvenlik biriminden öğren. İhracat kontrolüne tabi teknik verilerde de aynı dikkat gerekir.</p>
      <h2>4. Adayları çalışmalarıyla değerlendir</h2>
      <p>Mühendislikte CV satırından çok, yapılmış iş anlatır: çizim örnekleri, analiz raporlarından gizli bilgi içermeyen kesitler, kullanılan yazılımlar ve benzer ölçekteki projeler. İlk görüşmede adaya küçük, ücretli bir deneme işi vermek iki taraf için de riski azaltır.</p>
      <h2>5. Ödeme modelini işe göre seç</h2>
      <ul>
        <li><strong>Sabit fiyat ve aşamalı ödeme:</strong> kapsamı net işler için. Her ara teslim kabul edildiğinde ilgili aşama ödenir.</li>
        <li><strong>Saatlik ya da günlük:</strong> kapsamı belirsiz, keşif gerektiren işler için. Haftalık saat tavanı koymak bütçeyi korur.</li>
      </ul>
      <p>Şirket kurmadan serbest meslek kazancı elde eden bir mühendis serbest meslek makbuzu düzenler; firma ödeme yaparken gelir vergisi stopajını keser. Brüt ve net tutarı görmek için <a href="/araclar/serbest-meslek-makbuzu-hesaplama">serbest meslek makbuzu hesaplama</a> aracını kullanabilirsin.</p>
      <h2>6. İletişim ve teslim düzenini kur</h2>
      <p>Haftalık kısa bir durum toplantısı, tek bir dosya paylaşım alanı ve sürüm adlandırma kuralı çoğu sorunu baştan önler. Revizyon sayısını ve kapsam dışı isteklerin nasıl fiyatlanacağını sözleşmeye yaz.</p>
      <h2>İşinn'de nasıl ilerlenir?</h2>
      <p>İşinn'de mühendisler vitrin açıp yaptıkları işleri sergiliyor. İki yol var: <a href="/kategori/muhendis">mühendis vitrinlerine</a> göz atıp doğrudan mesaj atabilir ya da ihtiyacını tek bir talep olarak yazıp uygun uzmanların sana ulaşmasını bekleyebilirsin. Anlaşmayı taraflar kendi aralarında yapar.</p>
      ${LEGAL}
    `,
    ctaText: "Talep bırak",
    ctaHref: "/talep",
    faq: [
      { q: "Freelance mühendisin yaptığı tasarımın hakları kime ait olur?", a: "Çalışanın işi gereği ürettiği eserlerde haklar kural olarak işverene geçer; freelancer ise çalışan değildir. Bu yüzden mali hakların firmaya geçtiği sözleşmede yazılı olarak ve haklar tek tek sayılarak belirtilmelidir (FSEK madde 52)." },
      { q: "Proje bazlı mühendise ödeme nasıl yapılır?", a: "Şirketi olmayan serbest çalışan bir mühendis serbest meslek makbuzu düzenler, firma ödeme sırasında gelir vergisi stopajını keser. Şirketi olan mühendis ise fatura keser." },
      { q: "Gizlilik dereceli savunma projelerinde freelance mühendisle çalışılabilir mi?", a: "Gizlilik dereceli bilgiye erişim gereken işlerde sanayi güvenliği kuralları kapsamında kişi ve tesis güvenlik belgesi gibi şartlar aranır. Bu tür işlerin koşullarını firmanın güvenlik biriminden öğrenmek gerekir; açık platformlarda paylaşılmamalıdır." },
    ],
  },
  {
    slug: "muhendislikte-dis-kaynak-hangi-isler-disariya-verilir",
    title: "Mühendislikte Dış Kaynak: Hangi İşler Dışarıya Verilir, Hangileri Verilmez?",
    seoTitle: "Mühendislikte Dış Kaynak: Hangi İşler Dışarıya Verilir?",
    description: "CAD çizim, analiz, test ve dokümantasyon gibi işlerin dış kaynağa uygunluğu; freelancer, mühendislik firması ve kadro arasında seçim.",
    category: "genel",
    bodyHtml: `
      <p>Otomotiv, savunma, havacılık ve makine sektörlerinde proje yükü dalgalıdır: bir dönem tasarım ekibi yetişemez, başka bir dönem iş azalır. Dış kaynak kullanmak bu dalgalanmayı yönetmenin yollarından biri. Doğru işi doğru kişiye vermek ise maliyetten daha önemlidir.</p>
      <h2>Dışarıya verilmeye uygun işler</h2>
      <ul>
        <li><strong>CAD çizim ve modelleme:</strong> eskizden 3B modele, mevcut çizimlerin güncellenmesi, imalat resimleri.</li>
        <li><strong>Analiz:</strong> sonlu elemanlar (dayanım, titreşim, ısıl), akış analizi; girdileri ve kabul ölçütü net olduğunda.</li>
        <li><strong>Teknik dokümantasyon:</strong> kullanım ve bakım kılavuzları, teknik şartname taslakları, çeviri.</li>
        <li><strong>Test düzeneği ve fikstür tasarımı:</strong> ürünün çekirdeğine dokunmayan yardımcı tasarımlar.</li>
        <li><strong>Gömülü yazılım ve otomasyon parçaları:</strong> arayüzü tanımlanmış modüller, PLC programları, test yazılımları.</li>
        <li><strong>Prototip ve tersine mühendislik:</strong> ölçüm, modelleme ve küçük seri prototip desteği.</li>
      </ul>
      <h2>Ekipte kalması gereken işler</h2>
      <ul>
        <li>Ürün mimarisi ve temel tasarım kararları</li>
        <li>Firmanın rekabet avantajı olan süreç ve formüller</li>
        <li>Gizlilik dereceli ya da ihracat kontrolüne tabi bilgiler</li>
        <li>Uzun vadeli bakım ve müşteri sorumluluğu gerektiren sistemler</li>
      </ul>
      <h2>Freelancer, mühendislik firması ya da kadro?</h2>
      <ul>
        <li><strong>Freelance mühendis:</strong> kapsamı net, tek uzmanlık gerektiren, birkaç hafta ile birkaç ay süren işler için hızlı ve esnek.</li>
        <li><strong>Mühendislik firması:</strong> birden çok disiplin, belgelendirme ya da kurumsal sorumluluk gereken büyük işler için.</li>
        <li><strong>Kadro:</strong> sürekli, çekirdek ve gizli işler için.</li>
      </ul>
      <p>Pek çok firma bu üçünü birlikte kullanır: çekirdek ekip mimariyi yönetir, yoğun dönemlerde freelancer'lar belirli paketleri üstlenir.</p>
      <h2>Riskleri azaltmak için</h2>
      <ul>
        <li>Gizlilik sözleşmesini iş paylaşılmadan önce imzala; bilgiyi işin gerektirdiği kadar paylaş.</li>
        <li>Fikrî hakların devrini sözleşmede yazılı ve tek tek belirt.</li>
        <li>İşi ara teslimlere böl, her teslimde kabul ölçütüne göre kontrol et.</li>
        <li>Dosya biçimlerini, yazılım sürümlerini ve adlandırma kurallarını baştan belirle.</li>
      </ul>
      <p>Adım adım süreç için <a href="/rehber/proje-bazli-freelance-muhendis-nasil-bulunur">proje bazlı freelance mühendis nasıl bulunur</a> rehberine bakabilirsin.</p>
      ${LEGAL}
    `,
    ctaText: "Mühendis vitrinlerini gör",
    ctaHref: "/kategori/muhendis",
    faq: [
      { q: "Mühendislikte hangi işler dış kaynağa verilebilir?", a: "Kapsamı ve kabul ölçütü net olan, ürünün çekirdek bilgisini taşımayan işler: CAD çizim ve modelleme, sonlu elemanlar ya da akış analizi, teknik dokümantasyon, test düzeneği tasarımı, arayüzü tanımlı yazılım modülleri." },
      { q: "Freelance mühendis mi, mühendislik firması mı?", a: "Tek uzmanlık gerektiren, kapsamı net, birkaç hafta ile birkaç ay süren işlerde freelance mühendis esneklik sağlar. Birden çok disiplin, belgelendirme ya da kurumsal sorumluluk gereken büyük işlerde mühendislik firması daha uygundur." },
    ],
  },
  {
    slug: "muhendislik-isi-icin-teknik-is-tanimi-nasil-yazilir",
    title: "Mühendislik İşi İçin Teknik İş Tanımı Nasıl Yazılır?",
    seoTitle: "Mühendislik İçin Teknik İş Tanımı Nasıl Yazılır?",
    description: "Freelance mühendise iş verirken iş tanımında olması gerekenler: amaç, girdiler, standartlar, dosya biçimleri, kabul ölçütü ve takvim.",
    category: "genel",
    bodyHtml: `
      <p>İyi yazılmış bir iş tanımı, doğru teklifi almanın ve sonradan "bunu kastetmemiştim" tartışmasını önlemenin en kısa yoludur. Mühendislik işlerinde iş tanımı genel bir brief'ten daha teknik olmalı. Aşağıdaki başlıkları doldurman yeterli.</p>
      <h2>1. Amaç ve bağlam</h2>
      <p>Parça ya da sistem ne işe yarıyor, hangi ürünün parçası, hangi ortamda çalışacak? Gizli bilgi vermeden, mühendisin doğru varsayım yapmasına yetecek kadar bağlam ver.</p>
      <h2>2. Kapsam: ne yapılacak, ne yapılmayacak</h2>
      <p>Yapılacak işleri madde madde yaz; kapsam dışı olanları da ayrıca belirt (ör. "imalat resmi dahil, montaj talimatı dahil değil").</p>
      <h2>3. Girdiler</h2>
      <ul>
        <li>Mevcut modeller, çizimler, ölçümler</li>
        <li>Yükler, sınır koşulları, çalışma sıcaklığı gibi tasarım verileri</li>
        <li>Malzeme ve imalat yöntemi kısıtları</li>
        <li>Firmanın sağlayacağı yazılım lisansları ya da erişimler</li>
      </ul>
      <h2>4. Standartlar</h2>
      <p>Çizim ve tolerans için hangi standardın kullanılacağını yaz: örneğin genel toleranslar için ISO 2768, geometrik toleranslar için ISO GPS ya da ASME Y14.5. Sektörünün ya da müşterinin kendi standardı varsa onu ekle.</p>
      <h2>5. Teslim edilecekler ve dosya biçimleri</h2>
      <ul>
        <li>3B model: yerel CAD dosyası ve nötr biçim (ör. STEP)</li>
        <li>2B çizim: PDF ve DWG/DXF</li>
        <li>Analiz: yöntem, varsayımlar ve sonuçları içeren rapor</li>
        <li>Yazılım: kaynak kod, derleme talimatı, test sonuçları</li>
      </ul>
      <h2>6. Kabul ölçütü</h2>
      <p>İşin ne zaman "kabul edildi" sayılacağını ölçülebilir yaz: hedef emniyet katsayısı, ağırlık sınırı, standarda uygunluk, belirli testlerin geçilmesi. Kabul ölçütü olmayan iş, bitmeyen iştir.</p>
      <h2>7. Takvim, revizyon ve iletişim</h2>
      <p>Ara teslim tarihlerini, kaç revizyon turunun dahil olduğunu, kapsam dışı isteklerin nasıl fiyatlanacağını ve haftalık iletişim düzenini belirt.</p>
      <h2>8. Gizlilik ve haklar</h2>
      <p>Gizlilik sözleşmesi gerekiyorsa bunu iş tanımında söyle. Tasarım ve yazılım üzerindeki hakların firmaya geçeceğini sözleşmede yazılı olarak belirt. Gizlilik dereceli bilgi içeren işleri açık platformlarda paylaşma.</p>
      <h2>Kısa iş tanımı örneği</h2>
      <p><em>"Mevcut bir taşıyıcı braketin ağırlığını yüzde 15 azaltacak yeniden tasarım. Girdi: STEP model, yük durumları ve malzeme kısıtı. Teslim: yerel CAD ve STEP model, ISO 2768-m'ye göre imalat resmi, dayanım analizi raporu. Kabul: verilen yüklerde emniyet katsayısı en az 2. Süre: 3 hafta, 1. hafta sonunda konsept sunumu. İki revizyon turu dahil."</em></p>
      <p>Bu iş tanımını İşinn'de doğrudan talep olarak yazabilirsin; uygun mühendisler sana ulaşır.</p>
      ${LEGAL}
    `,
    ctaText: "Talep bırak",
    ctaHref: "/talep",
    faq: [
      { q: "Mühendislik iş tanımında neler olmalı?", a: "Amaç ve bağlam, yapılacak ve yapılmayacak işler, girdiler, uygulanacak standartlar, teslim edilecek dosyalar ve biçimleri, ölçülebilir kabul ölçütü, takvim ve revizyon sayısı, gizlilik ve fikrî haklar." },
      { q: "Freelance mühendisten hangi dosya biçimleri istenmeli?", a: "3B modelde yerel CAD dosyası ile birlikte STEP gibi nötr bir biçim, 2B çizimde PDF ve DWG/DXF, analizde yöntem ve varsayımları içeren rapor, yazılımda kaynak kod ve derleme talimatı." },
    ],
  },
];

export const REHBER_META_TR12 = {
  "proje-bazli-freelance-muhendis-nasil-bulunur": {
    published: "2026-11-11", updated: "2026-11-11",
    shortAnswer: "Önce dışarıya verilecek işi ürünün çekirdeğinden ayır, kapsamı teslim edilecekler ve kabul ölçütüyle yazılı tanımla. Gizlilik sözleşmesi imzala ve fikrî hakların devrini sözleşmede tek tek belirt (FSEK md. 52). Adayları yaptıkları işlerle değerlendir, ödemeyi aşamalara böl.",
  },
  "muhendislikte-dis-kaynak-hangi-isler-disariya-verilir": {
    published: "2026-11-11", updated: "2026-11-11",
    shortAnswer: "Kapsamı ve kabul ölçütü net, çekirdek bilgi taşımayan işler dış kaynağa uygundur: CAD çizim, sonlu elemanlar ya da akış analizi, teknik dokümantasyon, test düzeneği tasarımı, arayüzü tanımlı yazılım modülleri. Ürün mimarisi, gizli ve ihracat kontrolüne tabi bilgiler ekipte kalmalıdır.",
  },
  "muhendislik-isi-icin-teknik-is-tanimi-nasil-yazilir": {
    published: "2026-11-11", updated: "2026-11-11",
    shortAnswer: "Mühendislik iş tanımında amaç, kapsam (dahil olan ve olmayan), girdiler, standartlar (ör. ISO 2768, ASME Y14.5), teslim dosyaları ve biçimleri (yerel CAD + STEP, PDF + DWG), ölçülebilir kabul ölçütü, takvim, revizyon sayısı ve gizlilik ile fikrî haklar yer almalıdır.",
  },
};
