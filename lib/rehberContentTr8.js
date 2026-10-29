// Beş "ne kadar? 2026" fiyat rehberi (2026-10-29): Google otomatik tamamlamada "2026", "ne kadar", "fiyatları"
// kalıpları güçlü çıkan, İşinn'de vitrini olan hizmetler. Kurallar: her rakamın kaynağı metinde bağlantılı;
// İşinn kendi fiyat vermez, aralıklar "kaynaklarda görülen" diye sunulur; rakip pazaryeri verisi kullanılmadı;
// resmî metinle teyit edilmeyen rakamlar (ör. MEB Temmuz 2026 ek ders) yazılmadı. Fiyatlar değişebilir uyarısı her yazıda var.
const NOTE = `<p><em>Bu sayfadaki rakamlar bağlantısı verilen kaynaklarda yayımlanan aralıklardır; İşinn'in belirlediği ya da garanti ettiği fiyatlar değildir. Fiyatlar hızla değişebilir; kesin ücreti hizmet verenle konuşarak öğren.</em></p>`;

export const REHBER_POSTS_TR8 = [
  {
    slug: "ozel-ders-ucretleri-2026",
    title: "Özel Ders Ücretleri 2026: Saatlik Ücret Ne Kadar, Neye Göre Değişir?",
    description: "2026'da özel ders saat ücretleri: ilkokul, ortaokul, LGS, YKS, matematik ve İngilizce için kaynaklarda görülen aralıklar, online ile yüz yüze farkı ve ücreti belirleyen etkenler.",
    category: "egitim",
    bodyHtml: `
      <p>"Bir saat özel ders ne kadar?" sorusunun tek bir cevabı yok: ücret dersin türüne, kademeye, öğretmenin deneyimine ve dersin online mı yüz yüze mi olduğuna göre değişiyor. Aşağıda 2025–2026'da yayımlanmış kaynaklardaki aralıkları ve ücreti belirleyen etkenleri derledik.</p>
      <h2>Kaynaklarda görülen saatlik aralıklar</h2>
      <p>İki ayrı kaynak aynı kademeler için oldukça farklı rakamlar veriyor; bu yüzden ikisini yan yana gösteriyoruz.</p>
      <ul>
        <li><strong>İlkokul:</strong> 650–1.000 TL (<a href="https://www.eleman.net/is-rehberi/maaslar-ve-ucretler/ozel-ders-ucretleri-h14676" rel="nofollow noopener" target="_blank">eleman.net, Eylül 2025</a>); 300–600 TL (<a href="https://www.ogretmenbulun.com.tr/blog/ozel-ders-ucreti-ne-kadar" rel="nofollow noopener" target="_blank">ogretmenbulun</a>)</li>
        <li><strong>Ortaokul:</strong> 400–800 TL (ogretmenbulun)</li>
        <li><strong>LGS hazırlık:</strong> 1.000–2.000 TL ve üzeri, YKS ile birlikte (eleman.net); 600–1.000 TL (ogretmenbulun)</li>
        <li><strong>YKS hazırlık:</strong> 1.000–2.000 TL ve üzeri (eleman.net); 700–1.200 TL (ogretmenbulun)</li>
        <li><strong>Lise matematik:</strong> 750–1.500 TL (eleman.net); matematik genel 500–1.000 TL (ogretmenbulun)</li>
        <li><strong>Genel İngilizce:</strong> 1.500–2.000 TL (eleman.net); 400–850 TL (ogretmenbulun)</li>
      </ul>
      <h2>Online mı, yüz yüze mi?</h2>
      <p>ogretmenbulun'un verdiği aralıklara göre online bireysel ders 350–900 TL, yüz yüze bireysel ders 450–1.200 TL, online grup dersi 200–500 TL civarında. Online ders yol süresi olmadığı için genellikle biraz daha uygun oluyor. Büyükşehirlerde yüz yüze dersin daha pahalı olduğu sık söyleniyor, ancak İstanbul için ayrı bir rakam veren güvenilir bir kaynak bulamadık.</p>
      <h2>Bir referans: okullardaki ek ders ücreti</h2>
      <p>Devlet okullarında öğretmene ödenen ek ders ücreti özel ders fiyatı değildir, ama kıyas için bir fikir verir: Ocak 2026 itibarıyla lisans mezunu öğretmen için gündüz ek ders saat ücreti brüt 167,31 TL olarak açıklandı (<a href="https://www.eleman.net/is-rehberi/maaslar-ve-ucretler/2025-ek-ders-ucreti-h6198" rel="nofollow noopener" target="_blank">eleman.net</a>). Bu rakam memur maaş katsayısıyla dönemsel olarak değişir.</p>
      <h2>Ücreti belirleyen etkenler</h2>
      <ul>
        <li><strong>Ders:</strong> Matematik, fizik gibi sayısal dersler ve sınav hazırlığı genellikle daha yüksek ücretlidir.</li>
        <li><strong>Kademe ve hedef:</strong> LGS ve YKS hazırlığı, ilkokul desteğinden pahalıdır.</li>
        <li><strong>Öğretmenin deneyimi:</strong> Yıllarca sınav hazırlatmış bir öğretmenle üniversite öğrencisi arasında fark olur.</li>
        <li><strong>Birebir ya da grup:</strong> Grup dersinde kişi başı ücret düşer.</li>
        <li><strong>Konum ve ulaşım:</strong> Öğretmenin eve gelmesi yol süresini de fiyata ekler.</li>
        <li><strong>Dönem:</strong> Sınavlara yaklaştıkça talep artar.</li>
      </ul>
      <h2>Ücreti konuşurken sorulacaklar</h2>
      <ul>
        <li>Ders süresi kaç dakika (40, 50, 60)?</li>
        <li>Paket alınırsa ders başı ücret değişiyor mu?</li>
        <li>İptal ya da erteleme nasıl oluyor?</li>
        <li>Ödev, deneme sınavı takibi ücrete dahil mi?</li>
      </ul>
      <p>Öğretmen seçerken yalnızca fiyata değil uyuma da bak; bunun için <a href="/rehber/iyi-ozel-ders-ogretmeni-nasil-secilir">iyi özel ders öğretmeni nasıl seçilir</a> rehberine göz atabilirsin. İşinn'de öğretmenlerin vitrinlerini inceleyip ücretini doğrudan mesajla sorabilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Özel ders veren öğretmenleri keşfet",
    ctaHref: "/kategori/ogretmen",
    faq: [
      { q: "1 saat özel ders ücreti ne kadar 2026?", a: "Kaynaklara göre kademeye ve derse bağlı olarak geniş bir aralık var: ilkokulda yaklaşık 300–1.000 TL, LGS ve YKS hazırlığında 600–2.000 TL ve üzeri görülüyor. Kesin ücret öğretmenin deneyimine, dersin online ya da yüz yüze olmasına göre değişir." },
      { q: "Online özel ders daha mı ucuz?", a: "Genellikle evet. ogretmenbulun'un verdiği aralıklarda online bireysel ders 350–900 TL, yüz yüze bireysel ders 450–1.200 TL civarında; yol süresi olmadığı için online ders biraz daha uygun olabiliyor." },
      { q: "Özel ders ücretini kim belirliyor?", a: "Ücreti öğretmen belirler ve veliyle ya da öğrenciyle anlaşarak netleştirir. Resmî bir özel ders tarifesi yoktur." },
    ],
  },
  {
    slug: "pilates-fiyatlari-istanbul-2026",
    title: "Pilates Fiyatları 2026 İstanbul: Reformer, Mat ve Özel Ders Ücretleri",
    description: "İstanbul'da 2026 pilates ücretleri: reformer grup dersi, mat pilates ve birebir özel ders için kaynaklarda görülen seans ve paket fiyatları, ücreti belirleyen etkenler.",
    category: "genel",
    bodyHtml: `
      <p>Pilates ücretleri dersin türüne (reformer mi, mat mı), kaç kişiyle yapıldığına ve paket büyüklüğüne göre epey değişiyor. Aşağıda İstanbul için 2026'da yayımlanmış kaynaklardaki aralıkları topladık.</p>
      <h2>Seans başı aralıklar</h2>
      <ul>
        <li><strong>Reformer grup dersi:</strong> 350–700 TL (<a href="https://www.pilatesrehberi.com/istanbul/fiyatlar" rel="nofollow noopener" target="_blank">pilatesrehberi.com, Mayıs 2026</a>). Bir stüdyonun kendi listesinde 400–650 TL (<a href="https://www.nordenpilates.com/reformer-pilates-fiyatlari-grup-ve-single-ders-fiyatlari-2026-guncel" rel="nofollow noopener" target="_blank">Norden Pilates</a>).</li>
        <li><strong>Mat pilates grup dersi:</strong> 150–450 TL (pilatesrehberi.com).</li>
        <li><strong>Birebir özel ders:</strong> 600–1.800 TL (pilatesrehberi.com); bir stüdyo listesinde 1.500–2.500 TL (Norden Pilates).</li>
      </ul>
      <h2>Paketler</h2>
      <p>Çoğu stüdyo 8–12 derslik paketlerde ders başı ücreti düşürüyor; pilatesrehberi.com bu indirimin %15–25 civarında olabildiğini, haftada iki derse aylık yaklaşık 3.000–7.000 TL ödendiğini belirtiyor. Bir stüdyonun 8 derslik paketi 4.800–6.500 TL aralığında (Norden Pilates).</p>
      <h2>Ücreti belirleyen etkenler</h2>
      <ul>
        <li><strong>Reformer ya da mat:</strong> Aletli (reformer) dersler daha pahalıdır.</li>
        <li><strong>Kişi sayısı:</strong> Birebir, düet (iki kişi) ve grup dersi arasında belirgin fark olur.</li>
        <li><strong>Paket büyüklüğü:</strong> Tek ders en pahalısıdır.</li>
        <li><strong>İlçe ve stüdyo:</strong> Stüdyonun konumu ve olanakları fiyata yansır.</li>
        <li><strong>Eğitmen:</strong> Sertifika ve deneyim.</li>
        <li><strong>Evde ders:</strong> Eğitmenin eve gelmesi ayrıca fiyatlandırılabilir.</li>
      </ul>
      <h2>Başlamadan önce sorulacaklar</h2>
      <ul>
        <li>Deneme dersi var mı?</li>
        <li>Paket kaç hafta içinde kullanılmalı, dondurma mümkün mü?</li>
        <li>Grup kaç kişilik?</li>
        <li>Sağlık durumum (bel, boyun, hamilelik vb.) için uygun mu? Bu konuda önce hekimine danış.</li>
      </ul>
      <p>İşinn'de pilates ve spor eğitmenlerinin vitrinlerine bakıp ücreti ve programı doğrudan mesajla sorabilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Pilates ve spor eğitmenlerini keşfet",
    ctaHref: "/kategori/spor-egitmeni",
    faq: [
      { q: "İstanbul'da reformer pilates dersi ne kadar 2026?", a: "pilatesrehberi.com'un Mayıs 2026 verisine göre reformer grup dersi seans başı yaklaşık 350–700 TL; birebir özel ders 600–1.800 TL aralığında. Stüdyoya ve pakete göre değişir." },
      { q: "Pilates paketi almak daha mı ucuz?", a: "Genellikle evet. 8–12 derslik paketlerde ders başı ücret %15–25 civarında düşebiliyor; ancak paketin kullanım süresini ve dondurma koşullarını baştan sor." },
      { q: "Mat pilates ile reformer pilates fiyatı neden farklı?", a: "Reformer aletli bir derstir; stüdyonun alet yatırımı ve grupların küçük olması nedeniyle mat pilatese göre daha pahalıdır." },
    ],
  },
  {
    slug: "evden-eve-nakliyat-fiyatlari-2026",
    title: "Evden Eve Nakliyat Fiyatları 2026: 1+1, 2+1, 3+1 Taşıma Ücretleri",
    description: "2026'da şehir içi evden eve nakliyat ücretleri: ev tipine göre kaynaklarda görülen aralıklar, asansör, paketleme ve kat gibi fiyatı değiştiren etkenler, teklif alırken sorulacaklar.",
    category: "genel",
    bodyHtml: `
      <p>Ev taşıma ücreti en çok eşya miktarına, kata ve paketleme hizmetine göre değişiyor. Aşağıdaki aralıklar şehir içi taşıma içindir ve bir kaynağın son 90 günlük teklif istatistiklerine dayanıyor.</p>
      <h2>Ev tipine göre şehir içi aralıklar</h2>
      <p><a href="https://www.karekod.org/blog/nakliye-fiyatlari/" rel="nofollow noopener" target="_blank">karekod.org (Eylül 2026)</a> verilerine göre:</p>
      <ul>
        <li><strong>1+1:</strong> 13.000–35.000 TL (İstanbul'da 14.000–40.000 TL)</li>
        <li><strong>2+1:</strong> 18.000–55.000 TL (İstanbul'da 19.000–55.000 TL)</li>
        <li><strong>3+1:</strong> 22.000–65.500 TL (İstanbul'da 23.000–65.500 TL)</li>
        <li><strong>4+1:</strong> 30.000–85.000 TL ve üzeri</li>
      </ul>
      <p>Aralıkların bu kadar geniş olması normal: aynı 2+1 evde eşya miktarı, kat ve paketleme ihtiyacı fiyatı birkaç kat değiştirebiliyor. Mersin gibi iller için bağımsız ve il bazında güncel bir kaynak bulamadık; en sağlıklısı birkaç firmadan yerinde ya da görüntülü keşifle teklif almak.</p>
      <h2>Bazı illerde üst sınır var</h2>
      <p>Deprem bölgesindeki bazı illerde (Hatay, Şanlıurfa, Malatya, Kahramanmaraş) ev taşıma ücretine azami sınır getirildiği bildirildi (<a href="https://www.cumhuriyet.com.tr/ekonomi/hatay-sanliurfa-malatya-ve-kahramanmarasta-ev-tasima-ucretine-azami-sinir-getirildi-2053056" rel="nofollow noopener" target="_blank">Cumhuriyet</a>). Bu illerde taşınıyorsan güncel sınırı valilik ya da ticaret il müdürlüğü duyurularından kontrol et.</p>
      <h2>Fiyatı değiştiren etkenler</h2>
      <ul>
        <li><strong>Eşya hacmi:</strong> Oda sayısından çok eşya miktarı belirleyicidir.</li>
        <li><strong>Kat ve asansör:</strong> Bina asansörü yoksa dış cephe asansörü gerekebilir.</li>
        <li><strong>Paketleme:</strong> Ambalajlamayı firma mı yapacak, sen mi?</li>
        <li><strong>Söküm-montaj:</strong> Dolap, yatak, avize gibi işler.</li>
        <li><strong>Araç yanaşması:</strong> Kamyonun binaya yaklaşamaması işçiliği artırır.</li>
        <li><strong>Tarih:</strong> Yaz ayları, hafta sonları ve ay sonları yoğundur.</li>
        <li><strong>Özel eşya:</strong> Piyano, kasa, büyük akvaryum gibi.</li>
      </ul>
      <h2>Teklif alırken sorulacaklar</h2>
      <ul>
        <li>Fiyata paketleme, söküm-montaj ve asansör dahil mi?</li>
        <li>Sigorta var mı, hasar olursa süreç nasıl işliyor?</li>
        <li>Fiyat yazılı ve sabit mi, yoksa taşıma günü değişebilir mi?</li>
        <li>Kaç kişilik ekip ve hangi araç gelecek?</li>
      </ul>
      <p>İşinn'de nakliye hizmeti veren kişilerin vitrinlerini inceleyip teklifi doğrudan mesajla isteyebilirsin. İşinn komisyon almaz ve ödemeye aracılık etmez; taşımadan önce büyük bir ön ödeme göndermemeye dikkat et.</p>
      ${NOTE}
    `,
    ctaText: "Nakliye hizmeti verenleri keşfet",
    ctaHref: "/kategori/nakliye",
    faq: [
      { q: "2+1 ev taşıma ne kadar 2026?", a: "karekod.org'un Eylül 2026 verilerine göre şehir içi 2+1 ev taşıma genelde 18.000–55.000 TL, İstanbul'da 19.000–55.000 TL aralığında. Eşya miktarı, kat ve paketleme fiyatı belirgin şekilde değiştirir." },
      { q: "Nakliyat fiyatını en çok ne etkiler?", a: "Eşya hacmi, kat ve asansör durumu, paketleme ile söküm-montaj hizmeti, aracın binaya yanaşıp yanaşamaması ve taşıma tarihi." },
      { q: "Nakliyeciye ön ödeme yapmalı mıyım?", a: "Taşıma yapılmadan büyük bir ön ödeme göndermemek, fiyatı ve kapsamı yazılı olarak almak en güvenli yoldur." },
    ],
  },
  {
    slug: "ceviri-ucretleri-2026",
    title: "Çeviri Ücretleri 2026: Sayfa Başı Tercüme, Yeminli ve Noter Onaylı Çeviri",
    description: "2026 çeviri ve tercüme ücretleri: noter çeviri tarifesi, yeminli tercüme ve serbest çevirmen sayfa ücretleri için kaynaklarda görülen rakamlar ve fiyatı belirleyen etkenler.",
    category: "genel",
    bodyHtml: `
      <p>Çeviri ücreti dil çiftine, metnin alanına ve belgenin resmî onay gerektirip gerektirmediğine göre değişir. Bu alanda resmî bir rakam yalnızca noter çevirisi için var; serbest çevirmen ücretleri için kaynaklar birbirinden farklı rakamlar veriyor.</p>
      <h2>Noter çeviri ücreti (resmî tarife)</h2>
      <p>Noterin yaptığı ya da yaptırdığı çeviride 2026 ücreti sayfa başına 667,67 TL olarak yayımlandı; 10 satır ve altındaki sayfalarda bunun yarısı alınıyor (<a href="https://www.eleman.net/is-rehberi/pratik-bilgiler/noter-ucretleri-noter-vekalet-ucretleri-h5463" rel="nofollow noopener" target="_blank">eleman.net</a>, <a href="https://www.sigortam.net/noter-ucretleri" rel="nofollow noopener" target="_blank">sigortam.net</a>). Bu, noterin kendi işlem ücretidir; yeminli tercümanın çeviri ücreti ayrıca konuşulur.</p>
      <h2>Yeminli ve serbest çevirmen ücretleri</h2>
      <p>Serbest çevirmen ücretleri için resmî ya da dernek tarifesi bulamadık. Bloglarda ve haberlerde görülen rakamlar geniş bir aralıkta: standart metinlerde sayfa başı birkaç yüz TL, hukuk ve tıp gibi uzmanlık metinlerinde bunun birkaç katı (<a href="https://meslekmaas.com/tercuman-maaslari/" rel="nofollow noopener" target="_blank">meslekmaas</a>). Bazı çevirmenler sayfa yerine 1.000 karakter üzerinden fiyat verir. Kitap çevirisinde ise ücret çoğu zaman telif oranı üzerinden belirlenir (<a href="https://bianet.org/4/11/282611-yasalara-gore-cevirmen-de-eser-sahibi" rel="nofollow noopener" target="_blank">bianet, ÇevBir</a>).</p>
      <h2>Fiyatı belirleyen etkenler</h2>
      <ul>
        <li><strong>Dil çifti:</strong> Yaygın dillerde (İngilizce) çevirmen sayısı çok olduğu için fiyatlar daha uygundur.</li>
        <li><strong>Alan:</strong> Hukuk, tıp, teknik metinler uzmanlık ister.</li>
        <li><strong>Onay:</strong> Yeminli tercüme ve noter onayı ek maliyettir.</li>
        <li><strong>Süre:</strong> Acil teslim genellikle ek ücretlidir.</li>
        <li><strong>Hacim:</strong> Sayfa ya da karakter sayısı; büyük işlerde indirim konuşulabilir.</li>
        <li><strong>Biçim:</strong> Taranmış PDF, tablo ya da sayfa düzeni gerektiren dosyalar.</li>
      </ul>
      <h2>Fiyat isterken çevirmene gönder</h2>
      <ul>
        <li>Metnin kendisi ya da bir örnek sayfası,</li>
        <li>Hangi dile çevrileceği ve nerede kullanılacağı (resmî kurum, yayın, iç kullanım),</li>
        <li>Yeminli ya da noter onayı gerekip gerekmediği,</li>
        <li>Teslim tarihi.</li>
      </ul>
      <p>İşinn'de çeviri hizmeti verenlerin vitrinlerini inceleyip metnini göndererek doğrudan fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Çevirmenleri keşfet",
    ctaHref: "/kategori/ceviri",
    faq: [
      { q: "Noter çeviri ücreti ne kadar 2026?", a: "Yayımlanan 2026 tarifesine göre noterin yaptığı ya da yaptırdığı çeviride sayfa başı 667,67 TL; 10 satır ve altındaki sayfalarda yarısı alınır. Güncel tutarı notere sorarak teyit et." },
      { q: "Yeminli tercüme ile noter onaylı tercüme aynı şey mi?", a: "Hayır. Yeminli tercüman, notere yemin etmiş çevirmendir ve çeviriyi kendi imzasıyla onaylar; noter onayı ise bu imzanın noter tarafından tasdik edilmesidir. Resmî kurumlar çoğu zaman ikisini birlikte ister." },
      { q: "Çeviri ücreti nasıl hesaplanır?", a: "Çoğu çevirmen sayfa ya da 1.000 karakter başına ücret verir; dil çifti, metnin alanı, onay ihtiyacı ve teslim süresi fiyatı değiştirir." },
    ],
  },
  {
    slug: "logo-tasarim-fiyatlari-2026",
    title: "Logo Tasarım Fiyatları 2026: Freelance Tasarımcı mı, Ajans mı?",
    description: "2026 logo tasarım ücretleri: yeni başlayan ve deneyimli freelance tasarımcı ile ajans fiyatları için kaynaklarda görülen aralıklar, kurumsal kimlik paketi ve fiyatı belirleyen etkenler.",
    category: "genel",
    bodyHtml: `
      <p>Logo tasarımı birkaç bin liradan on binlerce liraya kadar uzanabiliyor. Fark çoğu zaman tasarımcının deneyiminden, sürecin derinliğinden ve teslim edilen dosyalardan geliyor. Aşağıda 2026 için yayımlanmış rehberlerdeki aralıkları derledik; bu alanda resmî ya da meslek odası tarifesi yok.</p>
      <h2>Kaynaklarda görülen aralıklar</h2>
      <p><a href="https://yaparim.com/blog/grafik-tasarim-hizmetleri/logo-tasarim-fiyatlari-2026" rel="nofollow noopener" target="_blank">yaparim.com</a>'un 2026 rehberine göre:</p>
      <ul>
        <li><strong>Yeni başlayan tasarımcı:</strong> 1.000–3.000 TL</li>
        <li><strong>Deneyimli freelance tasarımcı:</strong> 3.000–10.000 TL</li>
        <li><strong>Butik ajans:</strong> 10.000–25.000 TL</li>
        <li><strong>Kurumsal ajans:</strong> 25.000–100.000 TL ve üzeri</li>
      </ul>
      <p>Başka bir rehber logo için 2.000–25.000 TL, logo ile birlikte kartvizit, renk ve yazı tipi kurallarını içeren kurumsal kimlik paketi için 10.000–50.000 TL aralığı veriyor (<a href="https://websitesifiyatlari.tr/marka-tasarim/marka-tasarim-fiyatlari-2026-rehber/" rel="nofollow noopener" target="_blank">websitesifiyatlari.tr</a>).</p>
      <h2>Yapay zekâ ile logo yapmak yeterli mi?</h2>
      <p>Yapay zekâ araçlarıyla hızlıca logo fikri üretmek mümkün; fikir aşaması için işe yarar. Ama gerçek kullanım için genellikle şunlar gerekir: her boyutta bozulmayan vektör dosya, farklı zeminlerde çalışan renk varyasyonları, küçük boyutta okunabilirlik ve başka bir markaya benzemediğinden emin olmak. Bu işler çoğu zaman bir tasarımcının elinden geçmeyi gerektirir.</p>
      <h2>Fiyatı belirleyen etkenler</h2>
      <ul>
        <li><strong>Deneyim ve portfolyo:</strong> Benzer sektörde iş yapmış olmak.</li>
        <li><strong>Kapsam:</strong> Yalnızca logo mu, kurumsal kimlik paketi mi?</li>
        <li><strong>Taslak ve düzeltme sayısı:</strong> Kaç yön gösterilecek, kaç tur düzeltme dahil?</li>
        <li><strong>Teslim dosyaları:</strong> Vektör dosya, renk kodları, kullanım kılavuzu.</li>
        <li><strong>Haklar:</strong> Kullanım hakları ve yazı tipi lisansı.</li>
        <li><strong>Vergi:</strong> Fiyatın KDV dahil mi hariç mi olduğu.</li>
      </ul>
      <p>Tasarımcı seçerken nelere bakacağını <a href="/rehber/logo-tasarimcisi-secerken-nelere-dikkat-edilmeli">logo tasarımcısı seçerken nelere dikkat edilmeli</a> rehberinde anlattık. İşinn'de tasarımcıların vitrinlerindeki işlere bakıp fiyatı doğrudan mesajla sorabilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Tasarımcıları keşfet",
    ctaHref: "/kategori/tasarim",
    faq: [
      { q: "Logo tasarımı ne kadar 2026?", a: "2026 rehberlerine göre yeni başlayan tasarımcılarda yaklaşık 1.000–3.000 TL, deneyimli freelance tasarımcılarda 3.000–10.000 TL, ajanslarda 10.000 TL'den başlayıp çok daha yükseğe çıkabiliyor. Kapsam ve teslim dosyaları fiyatı belirler." },
      { q: "Kurumsal kimlik ile logo arasındaki fark ne?", a: "Logo tek bir işarettir; kurumsal kimlik ise logoyla birlikte renkleri, yazı tiplerini, kartvizit ve sosyal medya gibi kullanım kurallarını içeren bir pakettir. Bu yüzden daha pahalıdır." },
      { q: "Logo tasarımında hangi dosyaları istemeliyim?", a: "Vektör dosya (SVG, AI ya da PDF), şeffaf zeminli PNG, farklı zeminler için renk varyasyonları ve renk kodları ile yazı tipi bilgisi." },
    ],
  },
];

export const REHBER_META_TR8 = {
  "ozel-ders-ucretleri-2026": {
    published: "2026-10-29", updated: "2026-10-29",
    shortAnswer: "2026'da özel ders saat ücreti kademe ve derse göre değişiyor: kaynaklarda ilkokul için yaklaşık 300–1.000 TL, LGS ve YKS hazırlığı için 600–2.000 TL ve üzeri aralıklar görülüyor. Online ders yüz yüzeye göre genellikle biraz daha uygun. Kesin ücreti öğretmen belirler.",
  },
  "pilates-fiyatlari-istanbul-2026": {
    published: "2026-10-29", updated: "2026-10-29",
    shortAnswer: "İstanbul'da 2026'da reformer grup dersi seans başı yaklaşık 350–700 TL, mat pilates 150–450 TL, birebir özel ders 600–1.800 TL ve üzeri. 8–12 derslik paketlerde ders başı ücret %15–25 civarında düşebiliyor (pilatesrehberi.com, Mayıs 2026).",
  },
  "evden-eve-nakliyat-fiyatlari-2026": {
    published: "2026-10-29", updated: "2026-10-29",
    shortAnswer: "2026'da şehir içi ev taşıma kaynaklara göre 1+1 için yaklaşık 13.000–35.000 TL, 2+1 için 18.000–55.000 TL, 3+1 için 22.000–65.500 TL. Eşya miktarı, kat, asansör ve paketleme fiyatı belirgin şekilde değiştirir.",
  },
  "ceviri-ucretleri-2026": {
    published: "2026-10-29", updated: "2026-10-29",
    shortAnswer: "2026'da noterin yaptığı ya da yaptırdığı çeviride sayfa başı ücret 667,67 TL olarak yayımlandı. Serbest ve yeminli çevirmen ücretleri için resmî tarife yok; dil çifti, metnin alanı, onay ihtiyacı ve teslim süresine göre değişiyor.",
  },
  "logo-tasarim-fiyatlari-2026": {
    published: "2026-10-29", updated: "2026-10-29",
    shortAnswer: "2026 rehberlerine göre logo tasarımı yeni başlayan tasarımcıda yaklaşık 1.000–3.000 TL, deneyimli freelance tasarımcıda 3.000–10.000 TL, ajanslarda 10.000 TL ve üzeri. Kurumsal kimlik paketleri daha pahalıdır.",
  },
};
