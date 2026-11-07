// Beş "ne kadar? 2026" fiyat rehberi (2026-11-07): ev temizliği, çocuk/yaşlı bakıcısı, ürün fotoğrafı, video kurgu,
// boya badana. Kurallar (Tr9 ile aynı): her rakamın kaynağı metinde bağlantılı; İşinn kendi fiyat vermez; rakip hizmet
// pazaryeri verisi kullanılmadı (haber, maaş siteleri, hizmet verenlerin kendi tarifeleri, birim fiyat siteleri);
// kaynaklar arası farklar yan yana gösterilir. Hizmet verenlerin kendi tarifeleri "örnek tarife" diye sunulur.
const NOTE = `<p><em>Bu sayfadaki rakamlar bağlantısı verilen kaynaklarda yayımlanan aralıklardır; İşinn'in belirlediği ya da garanti ettiği fiyatlar değildir. Fiyatlar hızla değişebilir; kesin ücreti hizmet verenle konuşarak öğren.</em></p>`;
const LEGAL = `<p><em>Sigorta ve çalıştırma kuralları hakkındaki bilgiler genel bilgilendirme amaçlıdır, hukuki ya da mali tavsiye değildir. Kendi durumun için SGK'ya ya da bir mali müşavire danış.</em></p>`;

const a = (href, text) => `<a href="${href}" rel="nofollow noopener" target="_blank">${text}</a>`;

// Ev temizliği
const NTV = a("https://www.ntv.com.tr/turkiye/galeri-gundelikci-ucreti-6-bin-liraya-kadar-cikti-daire-buyuklugune-gore-de-degisiyor-1713761", "NTV, 27 Şubat 2026");
const HALKTV_TEMIZLIK = a("https://halktv.com.tr/ekonomi/gunlugu-6-bin-liraya-cikti-ek-islerle-de-biner-biner-artiyor-1011538h", "Halk TV, 27 Şubat 2026");
const HALKTV_SGK = a("https://halktv.com.tr/ekonomi/gundelikci-ve-bakici-sigortasi-nasil-yapilir-iste-tum-detaylar-1030877h", "Halk TV, 20 Mayıs 2026");
// Bakıcı
const ELEMAN_COCUK = a("https://www.eleman.net/meslek/cocuk-bakicisi-bebek-bakicisi/maas", "eleman.net, 2026 verisi");
const ELEMAN_YATILI = a("https://www.eleman.net/meslek/yatili-bakici/maas", "eleman.net, 2026 verisi");
const MILLIGAZETE = a("https://www.milligazete.com.tr/2026-bakici-ucretleri-ne-kadar-cocuk-bakicisi-kac-tl-yasli-bakicisi-maasi-ne-yatili-bakici-kac-para", "Milli Gazete, 4 Kasım 2026");
// Ürün fotoğrafı
const FOTOPARK = a("https://studyofotopark.com/urun-fotograf-cekimi-fiyatlari/", "Stüdyo Fotopark tarifesi, İstanbul, 2026");
const IZMIRURUN = a("https://izmiruruncekimi.com/", "İzmir Ürün Çekimi tarifesi, 2026");
const ERPIN = a("https://erpin.com.tr/urun-fotograf-cekimi", "Erpin Studio tarifesi, Ağustos 2026");
// Video kurgu
const MOOW = a("https://www.moowmedya.com.tr/video-produksiyon-fiyatlarimiz/", "Moow Medya tarifesi, Ocak 2026");
const MEDYOGRAFYA = a("https://medyografya.com.tr/video-cekimi-fiyatlari", "Medyografya, Ağustos 2026");
// Boya badana
const YAPIARENASI = a("https://yapiarenasi.com/insaat-iscilik-birim-fiyatlari", "Yapı Arenası, Kasım 2026");
const DEKMAR = a("https://dek-mar.com.tr/blog/boya-badana-fiyatlari", "Dek-Mar, 2026");

export const REHBER_POSTS_TR10 = [
  {
    slug: "ev-temizligi-ucretleri-2026",
    title: "Ev Temizliği Ücretleri 2026: Günlük 2.000–6.000 TL",
    description: "Haberlere göre 2026'da gündelik ev temizliği 1+1 için 2.000 TL'den başlıyor, 3+1 için 6.000 TL'yi buluyor. Ütü, yemek gibi ek işler ve sigorta kuralları.",
    category: "genel",
    bodyHtml: `
      <p>"Gündelikçi ne kadar alıyor?" sorusunun cevabı evin büyüklüğüne, ne kadar ayrıntılı temizlik istendiğine, ek işlere ve şehre göre değişiyor. Resmî bir tarife yok. Aşağıda 2026'da yayımlanmış haberlerdeki rakamları ve gündelik çalışan biriyle anlaşırken bilmen gereken sigorta kuralını bir araya getirdik.</p>
      <h2>Daire büyüklüğüne göre günlük ücret</h2>
      <p>Şubat 2026 tarihli iki habere göre gündelik ev temizliğinde rakamlar şöyle (${NTV}; ${HALKTV_TEMIZLIK}):</p>
      <ul>
        <li><strong>Stüdyo ve 1+1:</strong> ayrıntılı temizlik 2.000 TL'den başlıyor</li>
        <li><strong>2+1:</strong> eşya yoğunluğuna ve temizliğin ayrıntısına göre 4.000 TL'ye kadar çıkıyor</li>
        <li><strong>3+1:</strong> kapsamlı temizlik 6.000 TL'yi buluyor</li>
      </ul>
      <p>Halk TV'nin haberine göre bir önceki yılın haziranında benzer büyüklükteki evler için günlük 3.000 TL konuşuluyordu; gündelik çalışanlar 3.000 TL'nin altına çalışmadıklarını, üst sınırın 3.500–4.000 TL olduğunu söylüyordu (${HALKTV_TEMIZLIK}). Yani ücretler bir yıldan kısa sürede belirgin şekilde arttı.</p>
      <h2>Ek işler ücreti artırıyor</h2>
      <p>Haberlere göre ütü ve yemek gibi işler istenirse günlük ücrete 1.000 TL'ye kadar ekleniyor. Halı, koltuk ya da duvar silme gibi kalemler de ayrı ayrı ücrete yansıyor, ancak haberlerde bunlar için tutar verilmemiş (${NTV}; ${HALKTV_TEMIZLIK}). Bu yüzden ilk görüşmede yapılacak işleri tek tek konuşmak, gün sonunda sürpriz yaşamamanın en kolay yolu.</p>
      <h2>Fiyatı neler belirler?</h2>
      <ul>
        <li><strong>Evin büyüklüğü ve oda sayısı:</strong> 1+1 ile 3+1 arasında ücret neredeyse üç katına çıkıyor.</li>
        <li><strong>Banyo sayısı ve eşya yoğunluğu:</strong> temizlenecek yüzey arttıkça süre uzuyor.</li>
        <li><strong>Temizliğin türü:</strong> haftalık düzenli temizlik ile taşınma sonrası ya da tadilat sonrası ayrıntılı temizlik aynı şey değil.</li>
        <li><strong>Ek işler:</strong> ütü, yemek, cam, balkon, dolap içi.</li>
        <li><strong>Sıklık ve yer:</strong> haftada bir gelen biriyle birkaç gün gelen biri arasında günlük ücret değişebiliyor; büyükşehirlerde ve bazı semtlerde ücretler daha yüksek.</li>
      </ul>
      <p>Ne kadar süreceğini tahmin etmek için <a href="/rehber/ev-temizligi-kac-saat-surer">ev temizliği kaç saat sürer</a> rehberine bakabilirsin.</p>
      <h2>Sigorta: ayda 10 günden az çalışanlar</h2>
      <p>Evinde gündelik temizlik yapan birini çalıştıran kişi, ayda 10 günden az çalışma için de SGK'ya bildirim yapmakla yükümlü. Halk TV'nin Mayıs 2026 tarihli haberine göre kurallar şöyle (${HALKTV_SGK}):</p>
      <ul>
        <li>Ayda 10 günden az çalışmada yalnızca iş kazası ve meslek hastalığı sigortası uygulanıyor.</li>
        <li>Çalıştıran kişi günlük asgari ücretin yüzde 2'sini prim olarak ödüyor; 2026'da bu tutar <strong>günlük 22,02 TL</strong>.</li>
        <li>Bildirim e-Devlet'teki "Ev Hizmetlerinde 10 Günden Az Sigortalı Çalıştırılacaklara İlişkin Başvuru Formu" ile ya da SGK'ya doğrudan yapılabiliyor; en geç çalışılan ayın son günü.</li>
        <li>Bu kural evde çalıştıranın gerçek kişi olduğu durum için geçerli. Bir şirketin gönderdiği temizlik personeli bu kapsamda değil.</li>
      </ul>
      <p>Ayda 10 gün ve daha fazla çalışma için kurallar farklı. Bu durumda SGK'dan ya da bir mali müşavirden bilgi al.</p>
      <h2>Anlaşmadan önce konuşulacaklar</h2>
      <ul>
        <li>Ücret günlük mü, saatlik mi? Kaç saat çalışılacak?</li>
        <li>Hangi odalar ve hangi işler dahil? Ütü, cam, balkon, dolap içi ayrı mı?</li>
        <li>Temizlik malzemelerini kim alacak?</li>
        <li>Yol ücreti ayrıca ödenecek mi?</li>
        <li>İptal ya da gün değişikliği nasıl yapılacak?</li>
      </ul>
      <p>İşinn'de ev temizliği hizmeti verenlerin vitrinlerine bakıp doğrudan mesajla fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
      ${LEGAL}
    `,
    ctaText: "Temizlik hizmeti verenleri keşfet",
    ctaHref: "/kategori/temizlik",
    faq: [
      { q: "2026'da gündelikçi ücreti ne kadar?", a: "Şubat 2026 tarihli haberlere göre stüdyo ve 1+1 evlerde ayrıntılı temizlik 2.000 TL'den başlıyor, 2+1'de 4.000 TL'ye, 3+1'de 6.000 TL'ye kadar çıkıyor. Ütü ve yemek gibi ek işler için 1.000 TL'ye kadar ek ücret istenebiliyor." },
      { q: "Haftada bir gelen gündelikçiye sigorta yapmak zorunlu mu?", a: "Evet. Ayda 10 günden az çalışma için de bildirim gerekiyor. Bu durumda yalnızca iş kazası ve meslek hastalığı sigortası uygulanıyor; 2026'da çalıştıranın ödediği prim günlük 22,02 TL. Bildirim e-Devlet üzerinden yapılabiliyor." },
      { q: "Ev temizliği ücretini ne artırır?", a: "Oda ve banyo sayısı, eşya yoğunluğu, temizliğin ayrıntısı (taşınma ya da tadilat sonrası gibi), ütü, yemek, cam gibi ek işler ve şehir. Bu yüzden ilk görüşmede yapılacak işleri tek tek konuşmak gerekir." },
    ],
  },
  {
    slug: "cocuk-ve-yasli-bakicisi-ucretleri-2026",
    title: "Bakıcı Ücretleri 2026: Çocuk ve Yaşlı Bakıcısı Maaşları",
    description: "2026 kaynaklarına göre çocuk bakıcısı aylık ortalama 42.100 TL; İstanbul'da gündüzlü 35.000–50.000 TL, yatılı yaşlı bakıcısı 80.000 TL'ye kadar. Kaynaklar yan yana.",
    category: "genel",
    bodyHtml: `
      <p>Bakıcı ücreti; çocuk mu yaşlı mı bakılacağına, bakıcının gündüzlü mü yatılı mı çalışacağına, şehre ve deneyime göre değişiyor. Resmî bir tarife yok. Aşağıda 2026 tarihli maaş verilerini ve haberleri yan yana koyduk. Kaynakların yöntemleri farklı olduğu için rakamlar birebir tutmuyor; ikisini de gösteriyoruz.</p>
      <h2>Çocuk ve bebek bakıcısı</h2>
      <ul>
        <li><strong>Türkiye geneli, 2026:</strong> en düşük 33.800 TL, ortalama 42.100 TL, en yüksek 65.900 TL (${ELEMAN_COCUK})</li>
        <li><strong>İstanbul, gündüzlü:</strong> 35.000–50.000 TL; haberde aktarılan platform ortalaması 43.000 TL. Bebek bakımı için gündüzlü tekliflerin sık 50.000–55.000 TL olduğu yazıyor (${MILLIGAZETE})</li>
        <li><strong>İstanbul, yatılı:</strong> 45.000–60.000 TL; aktarılan ortalama 55.000 TL (${MILLIGAZETE})</li>
      </ul>
      <p>Aynı habere göre gündüzlü çocuk bakıcısı için aktarılan ortalamalar Ankara'da 39.000 TL, İzmir'de 38.500 TL, Bursa'da 39.500 TL; yatılı için Ankara'da 53.000 TL, İzmir'de 55.500 TL, Bursa'da 54.000 TL (${MILLIGAZETE}).</p>
      <h2>Yaşlı bakıcısı</h2>
      <ul>
        <li><strong>İstanbul, gündüzlü:</strong> 45.000–65.000 TL (${MILLIGAZETE})</li>
        <li><strong>İstanbul, yatılı:</strong> 60.000–80.000 TL (${MILLIGAZETE})</li>
        <li><strong>Yatılı bakıcı, Türkiye geneli, 2026:</strong> en düşük 33.200 TL, ortalama 40.200 TL, en yüksek 62.900 TL (${ELEMAN_YATILI})</li>
      </ul>
      <p>İki kaynak arasındaki fark büyük. eleman.net Türkiye geneli için ilan ve maaş verisinden hesaplıyor; haberdeki rakamlar ise büyük şehirlerdeki iş ilanlarına ve tahminlere dayanıyor. Milli Gazete de rakamların resmî bir tarife değil, yaklaşık piyasa aralıkları olduğunu belirtiyor.</p>
      <h2>Ücreti neler belirler?</h2>
      <ul>
        <li><strong>Gündüzlü mü yatılı mı:</strong> yatılı çalışma her iki kaynakta da daha yüksek ücretli.</li>
        <li><strong>Bakımın türü:</strong> yatağa bağlı ya da özel bakım gereken bir yaşlı, hareketli bir yaşlıdan farklı bir iş yükü demek. Bebek bakımı da çoğu zaman daha yüksek ücretle konuşuluyor.</li>
        <li><strong>Çalışma saati ve hafta tatili:</strong> günde kaç saat, haftada kaç gün, hafta sonu ve gece nöbeti var mı?</li>
        <li><strong>Ek işler:</strong> yemek, temizlik, ütü ya da birden fazla çocuk.</li>
        <li><strong>Şehir ve deneyim:</strong> İstanbul'da ücretler diğer büyükşehirlerden yüksek.</li>
      </ul>
      <h2>Maaşın dışında kalan giderler</h2>
      <p>Milli Gazete'nin haberine göre sigorta, yol ve diğer çalışma giderleri maaşın üstüne ekleniyor; yabancı uyruklu bakıcılarda çalışma izni ve diğer yükümlülükler de toplam maliyeti etkiliyor (${MILLIGAZETE}). Ayda 10 günden az çalışan biri için bile SGK bildirimi gerekiyor; bu durumda 2026'da çalıştıranın ödediği iş kazası primi günlük 22,02 TL (${HALKTV_SGK}). Ayda 10 gün ve daha fazla çalışma (gündüzlü ya da yatılı tam zamanlı bakıcılar) için kurallar farklı; bunun için SGK'dan ya da bir mali müşavirden bilgi al.</p>
      <h2>Görüşmeye nasıl hazırlanılır?</h2>
      <p>Ücreti konuşmadan önce işin kapsamını yazılı hale getirmek pazarlığı kolaylaştırır: kimin bakılacağı, günlük rutin, saatler, izin günleri ve ek işler. Görüşmede soracağın sorular için <a href="/rehber/cocuk-bakicisi-secerken-sorulmasi-gereken-sorular">çocuk bakıcısı seçerken sorulacak sorular</a> ve <a href="/rehber/yasli-bakicisi-ile-gorusmede-sorulacak-sorular">yaşlı bakıcısıyla görüşmede sorulacak sorular</a> rehberlerine bakabilirsin.</p>
      <ul>
        <li>Ücret net mi, sigorta ve yol dahil mi?</li>
        <li>Günlük çalışma saati, hafta tatili ve yıllık izin nasıl olacak?</li>
        <li>Yatılı ise kalacağı oda ve izin günleri belli mi?</li>
        <li>Deneme süresi olacak mı, ayrılık durumunda ne kadar önceden haber verilecek?</li>
      </ul>
      <p>İşinn'de bakıcıların vitrinlerine bakıp doğrudan mesajla görüşebilirsin; İşinn komisyon almaz, ödemeye aracılık etmez ve hizmet verenler hakkında garanti vermez.</p>
      ${NOTE}
      ${LEGAL}
    `,
    ctaText: "Bakıcıları keşfet",
    ctaHref: "/kategori/bakici",
    faq: [
      { q: "2026'da çocuk bakıcısı maaşı ne kadar?", a: "eleman.net'in 2026 verisine göre çocuk ve bebek bakıcısı aylık ortalama 42.100 TL (en düşük 33.800, en yüksek 65.900 TL). Kasım 2026 tarihli bir habere göre İstanbul'da gündüzlü çocuk bakıcısı 35.000–50.000 TL, yatılı 45.000–60.000 TL." },
      { q: "Yatılı yaşlı bakıcısı ne kadar alıyor?", a: "Kasım 2026 tarihli bir habere göre İstanbul'da yatılı yaşlı bakıcısı ücretleri 60.000–80.000 TL, gündüzlü 45.000–65.000 TL. eleman.net'in Türkiye geneli yatılı bakıcı ortalaması ise 40.200 TL." },
      { q: "Bakıcı maaşına sigorta dahil mi?", a: "Genellikle konuşulan rakam maaştır; sigorta ve yol gibi giderler üstüne eklenir. Ayda 10 günden az çalışmada bile SGK bildirimi gerekir. Tam zamanlı bakıcı için yükümlülükleri SGK'dan ya da bir mali müşavirden öğren." },
    ],
  },
  {
    slug: "urun-fotografi-cekimi-fiyatlari-2026",
    title: "Ürün Fotoğrafı Çekimi Fiyatları 2026: Ürün Başı 250–1.500 TL",
    description: "Stüdyo tarifelerine göre 2026'da beyaz fonda ürün başı 325–999 TL, mankenli 799–1.499 TL. Adet indirimi, KDV, dekupe ve ürün türüne göre farklar.",
    category: "genel",
    bodyHtml: `
      <p>E-ticaret ya da sosyal medya için ürün fotoğrafı çektirirken fiyat genellikle ürün başına ya da poz başına veriliyor. Fiyatı; çekimin türü (beyaz fon, mankenli, konsept), ürün adedi, ürünün ne kadar zor çekildiği ve rötuşun kapsamı belirliyor. Aşağıda 2026'da yayımlanmış üç stüdyo tarifesini yan yana koyduk. Bunlar o stüdyoların kendi fiyatları; piyasanın tamamını temsil etmiyor ama aralığı görmek için iyi bir başlangıç.</p>
      <h2>Beyaz fon (e-ticaret) çekimi</h2>
      <ul>
        <li><strong>İstanbul:</strong> 15–50 adette ürün başı 999 TL, 51–150 adette 599 TL; takı 51–100 adette 999 TL. Fiyatlara yüzde 20 KDV ekleniyor; dekupe, renk düzeltme ve temel rötuş dahil (${FOTOPARK})</li>
        <li><strong>İzmir:</strong> 5–50 adette ürün başı 775 TL + KDV'den başlıyor, 150–300 adette 325 TL + KDV'ye kadar düşüyor; dekupe ve renk düzeltme dahil (${IZMIRURUN})</li>
      </ul>
      <h2>Mankenli ve konsept çekim</h2>
      <p>Ürünün bir modelle ya da bir ortam içinde (konsept) çekilmesi daha fazla hazırlık istiyor (${FOTOPARK}):</p>
      <ul>
        <li><strong>Mankenli:</strong> 15–50 adette ürün başı 1.499 TL, 51–150 adette 999 TL, 151–300 adette 799 TL</li>
        <li><strong>Konsept:</strong> 15–50 adette ürün başı 999 TL, 51–150 adette 899 TL, 151–300 adette 599 TL</li>
      </ul>
      <h2>Ürün türüne göre poz fiyatları</h2>
      <p>Bir başka stüdyo fiyatı ürün türüne ve poz sayısına göre veriyor; fiyatlara KDV dahil değil (${ERPIN}). Tek poz için örnekler:</p>
      <ul>
        <li><strong>Çanta:</strong> 250 TL; <strong>ayakkabı:</strong> 350 TL</li>
        <li><strong>Tişört (hayalet manken):</strong> 450 TL; <strong>elbise, ceket:</strong> 600 TL</li>
        <li><strong>Kozmetik, paketli gıda:</strong> 450 TL; <strong>parfüm, cam şişe, elektronik:</strong> 650 TL</li>
        <li><strong>Saat, mücevher, yansımalı metal ve cam:</strong> 800 TL</li>
        <li><strong>Yemek ve menü:</strong> 1.000 TL</li>
      </ul>
      <p>Aynı tarifede poz sayısı arttıkça poz başı fiyat düşüyor; örneğin ayakkabıda 4 poz toplam 1.100 TL. Dekupe ve rötuş bu stüdyoda ayrı ücretli (tek poz 350 TL) (${ERPIN}).</p>
      <h2>Fiyatı neler belirler?</h2>
      <ul>
        <li><strong>Adet:</strong> üç tarifede de ürün sayısı arttıkça birim fiyat belirgin şekilde düşüyor.</li>
        <li><strong>Ürünün yüzeyi:</strong> parlak, yansıtan ya da şeffaf ürünler (saat, mücevher, cam şişe) ışık düzeni istediği için daha pahalı.</li>
        <li><strong>Poz sayısı:</strong> ön, arka, yan ve detay çekimleri ayrı poz sayılıyor.</li>
        <li><strong>Rötuş:</strong> arka plan temizleme ve renk düzeltme bazı stüdyolarda dahil, bazılarında ayrı. İleri rötuş genellikle ayrı teklif.</li>
        <li><strong>KDV:</strong> incelediğimiz üç tarifede de fiyatlara KDV dahil değil.</li>
      </ul>
      <h2>Teklif alırken sorulacaklar</h2>
      <ul>
        <li>Fiyat ürün başı mı, poz başı mı? Bir üründe kaç poz var?</li>
        <li>Dekupe ve renk düzeltme dahil mi?</li>
        <li>Teslim edilen dosyaların boyutu ve biçimi pazar yerlerinin istediği ölçülere uygun mu?</li>
        <li>Ürünlerin stüdyoya gönderimi ve geri dönüşü kimin sorumluluğunda?</li>
        <li>Fotoğrafları hangi mecralarda kullanabilirsin?</li>
      </ul>
      <p>İşinn'de fotoğrafçıların vitrinlerine bakıp çalışmalarını görebilir, doğrudan mesajla fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez. İşinn ürün satışı yapılan bir yer değildir; burada ürün fotoğrafı gibi hizmetleri veren kişileri bulursun.</p>
      ${NOTE}
    `,
    ctaText: "Fotoğrafçıları keşfet",
    ctaHref: "/kategori/profesyonel-fotograf",
    faq: [
      { q: "Ürün fotoğrafı çekimi ürün başı kaç TL?", a: "2026'da yayımlanan stüdyo tarifelerine göre beyaz fonda ürün başı yaklaşık 325–999 TL, mankenli çekimde 799–1.499 TL. Ürün türüne göre poz başı fiyat veren bir stüdyoda tek poz çanta için 250 TL, saat ve mücevher için 800 TL. Fiyatlara genellikle KDV eklenir." },
      { q: "Ürün fotoğrafında adet arttıkça fiyat düşer mi?", a: "Evet. İncelenen tarifelerde 15–50 adette 999 TL olan beyaz fon fiyatı 51–150 adette 599 TL'ye; başka bir stüdyoda 5–50 adette 775 TL olan fiyat 150–300 adette 325 TL'ye iniyor." },
      { q: "Dekupe fiyata dahil mi?", a: "Stüdyoya göre değişiyor. İncelenen üç tarifeden ikisinde dekupe ve renk düzeltme dahil, birinde ayrı ücretli (tek poz 350 TL). Teklif alırken mutlaka sor." },
    ],
  },
  {
    slug: "video-kurgu-ucretleri-2026",
    title: "Video Kurgu Ücretleri 2026: Dakika ve Gün Başı Fiyatlar",
    description: "2026 kaynaklarına göre 1 dakikalık basit kurgu 1.000 TL, efektli kurgu 3.000 TL; serbest kurgucunun gün ücreti 4.000–12.000 TL. Fiyatı ne belirler, neler sorulmalı.",
    category: "genel",
    bodyHtml: `
      <p>Video kurgu (montaj) fiyatı genellikle üç şekilde veriliyor: bitmiş videonun dakikası başına, kurgucunun çalıştığı gün başına ya da proje başına. Hangisinin uygun olduğu işin türüne bağlı. Aşağıda 2026'da yayımlanmış bir ajans tarifesini ve bir prodüksiyon fiyat rehberini yan yana koyduk.</p>
      <h2>Dakika başına kurgu</h2>
      <p>Bir prodüksiyon şirketinin Ocak 2026 tarihli tarifesi şöyle (${MOOW}):</p>
      <ul>
        <li><strong>1 dakikalık basit montaj:</strong> 1.000 TL; renk ve görüntü düzeltme, basit kesimler. Her ek dakika +500 TL</li>
        <li><strong>1 dakikalık zengin montaj:</strong> 3.000 TL; ek görüntüler, efekt ve seslerle. Her ek dakika +3.000 TL</li>
        <li><strong>Etkinlik videosu montajı:</strong> en fazla 1 saatlik video, tek kamera, 8.000 TL; her ek kamera +4.000 TL</li>
      </ul>
      <p>Aynı tarifeye göre en kısa teslim süresi bir hafta; acil teslimde toplam ücrete yüzde 50 ekleniyor (${MOOW}).</p>
      <h2>Gün başına kurgu</h2>
      <p>Medyografya'nın Ağustos 2026 tarihli fiyat rehberinde serbest çalışan bir kurgucunun (montaj, renk ve ses karışımı) gün ücreti 4.000–12.000 TL olarak geçiyor. Aynı rehbere göre kurumsal işlerde kurgu süresi iki ile dört hafta arasında değişebiliyor; grafik ve animasyon miktarı ile versiyon sayısı fiyatı artırıyor (${MEDYOGRAFYA}).</p>
      <h2>Çekim ve kurgu birlikte</h2>
      <p>Çekim de isteniyorsa fiyat kurgunun çok üstüne çıkıyor. Medyografya'nın aralıklarına göre (${MEDYOGRAFYA}):</p>
      <ul>
        <li><strong>Tek kameraman, yarım gün, basit kurgu:</strong> 15.000–35.000 TL</li>
        <li><strong>Sosyal medya içerik paketi</strong> (8–12 adet 15–30 saniyelik video, 1 gün çekim): 25.000–60.000 TL</li>
        <li><strong>Ürün tanıtım videosu</strong> (30–60 saniye): 20.000–60.000 TL</li>
        <li><strong>Kurumsal tanıtım filmi</strong> (2–3 dakika): 50.000–150.000 TL</li>
      </ul>
      <p>Rehber, bu rakamların liste fiyatı değil, Ağustos 2026'da gözlemlenen aralıklar olduğunu belirtiyor.</p>
      <h2>Fiyatı neler belirler?</h2>
      <ul>
        <li><strong>Ham görüntünün miktarı:</strong> 10 dakikalık bir video için saatlerce görüntü izlemek gerekebilir; bitmiş süre kısa olsa da iş uzun sürebilir.</li>
        <li><strong>Efekt, grafik ve altyazı:</strong> hareketli yazı, logo animasyonu ve altyazı ek iş.</li>
        <li><strong>Renk ve ses:</strong> renk düzeltme ve ses temizliği ayrı uzmanlık.</li>
        <li><strong>Müzik:</strong> lisanslı müzik gerekiyorsa ücreti ayrıca konuşulmalı.</li>
        <li><strong>Revizyon sayısı ve teslim süresi:</strong> acil işler ve çok sayıda değişiklik fiyatı artırır.</li>
        <li><strong>Biçim sayısı:</strong> aynı videonun dikey (Reels), yatay ve kare versiyonları ayrı iş sayılabilir.</li>
      </ul>
      <h2>Teklif alırken sorulacaklar</h2>
      <ul>
        <li>Fiyat bitmiş dakika başına mı, gün başına mı, proje başına mı?</li>
        <li>Kaç revizyon hakkı var? (Bunun için <a href="/rehber/freelance-iste-revizyon-hakki-kac-olmali">revizyon hakkı</a> rehberine bakabilirsin.)</li>
        <li>Altyazı, müzik ve renk düzeltme dahil mi?</li>
        <li>Hangi biçimlerde teslim edilecek (dikey, yatay)?</li>
        <li>Proje dosyaları ve ham görüntüler teslim edilecek mi?</li>
      </ul>
      <p>İşinn'de video kurgu yapanların vitrinlerinde çalışma örneklerini izleyip doğrudan mesajla fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Video kurgu yapanları keşfet",
    ctaHref: "/kategori/video-duzenleme",
    faq: [
      { q: "1 dakikalık video kurgu kaç TL?", a: "Ocak 2026 tarihli bir prodüksiyon tarifesine göre 1 dakikalık basit montaj 1.000 TL (her ek dakika +500 TL), efekt ve seslerle zenginleştirilmiş montaj 3.000 TL (her ek dakika +3.000 TL)." },
      { q: "Kurgucunun günlük ücreti ne kadar?", a: "Ağustos 2026 tarihli bir prodüksiyon fiyat rehberine göre serbest çalışan bir kurgucunun montaj, renk ve ses karışımı dahil gün ücreti 4.000–12.000 TL." },
      { q: "Video kurgu fiyatını ne artırır?", a: "Ham görüntü miktarı, efekt ve grafik, altyazı, renk ve ses düzeltme, lisanslı müzik, revizyon sayısı, acil teslim ve aynı videonun farklı biçimlerde (dikey, yatay) hazırlanması." },
    ],
  },
  {
    slug: "boya-badana-fiyatlari-2026",
    title: "Boya Badana Fiyatları 2026: m² İşçilik ve 2+1 Daire",
    description: "2026 kaynaklarına göre iç cephe boya işçiliği m² başı 60–180 TL, malzeme dahil 110–280 TL; 2+1 daire anahtar teslim 28.000–45.000 TL. Fiyatı ne değiştirir?",
    category: "genel",
    bodyHtml: `
      <p>Boya badana fiyatı ya metrekare başına ya da daire için toplam olarak veriliyor. Önemli ayrım şu: verilen fiyat yalnızca işçilik mi, yoksa boya ve malzeme de dahil mi? Aşağıda 2026'da yayımlanmış iki kaynaktaki aralıkları yan yana koyduk.</p>
      <h2>Metrekare başına fiyatlar</h2>
      <p>Bir boya uygulama firmasının 2026 Türkiye geneli için verdiği aralıklar (${DEKMAR}):</p>
      <ul>
        <li><strong>İç cephe, standart plastik boya:</strong> yalnız işçilik 60–110 TL/m², malzeme dahil 110–180 TL/m²</li>
        <li><strong>İç cephe, silikonlu ya da saten boya:</strong> yalnız işçilik 80–130 TL/m², malzeme dahil 180–280 TL/m²</li>
        <li><strong>Tavan:</strong> yalnız işçilik 50–90 TL/m², malzeme dahil 90–150 TL/m²</li>
        <li><strong>Dış cephe:</strong> yalnız işçilik 90–150 TL/m², malzeme dahil 150–260 TL/m²</li>
        <li><strong>Saten alçı (boya öncesi):</strong> 120–220 TL/m²</li>
        <li><strong>Kapı ve pervaz boyama:</strong> adet başı 500–1.200 TL</li>
      </ul>
      <p>İnşaat işçilik fiyatlarını derleyen Yapı Arenası, Kasım 2026'da iç cephe boya işçiliği (astar ve iki kat) için piyasa aralığını 80–180 TL/m², tavan boyası işçiliği için 70–130 TL/m² olarak veriyor. Aynı sayfaya göre büyükşehirlerde fiyatlar üst banda yakın (${YAPIARENASI}).</p>
      <p>Not: Yapı Arenası'nda resmî birim fiyatlar da yer alıyor (iç cephe boya için 259,30 TL/m²). Bunlar kamu ihaleleri için hazırlanan, malzeme ve yüklenici kârı dahil analiz fiyatları; ev boyatırken pazarlık rakamı olarak kullanılmaları doğru olmaz (${YAPIARENASI}).</p>
      <h2>Daire tipine göre toplam fiyat</h2>
      <p>Aynı firmanın boş daire ve orta segment boya için verdiği anahtar teslim (malzeme ve işçilik dahil) aralıklar (${DEKMAR}):</p>
      <ul>
        <li><strong>1+1 (yaklaşık 50–60 m²):</strong> 18.000–28.000 TL</li>
        <li><strong>2+1 (yaklaşık 85–100 m²):</strong> 28.000–45.000 TL</li>
        <li><strong>3+1 (yaklaşık 110–130 m²):</strong> 40.000–65.000 TL</li>
        <li><strong>4+1 (yaklaşık 150–170 m²):</strong> 55.000–90.000 TL</li>
      </ul>
      <p>Kaynağa göre eşyalı dairelerde fiyat genellikle yüzde 10–20 artıyor (${DEKMAR}).</p>
      <h2>Boyanacak alan nasıl hesaplanır?</h2>
      <p>Usta fiyatı dairenin taban alanına değil, boyanacak duvar ve tavan yüzeyine göre verir. Dek-Mar'a göre kabaca bir tahmin için dairenin net alanını 2,5–3 ile çarpabilirsin: 100 m²'lik bir daire yaklaşık 250–300 m² boyanacak yüzey demek (${DEKMAR}). Bu yüzden m² fiyatıyla daire fiyatını karşılaştırırken hangi alanın kastedildiğini sor.</p>
      <h2>Fiyatı neler değiştirir?</h2>
      <ul>
        <li><strong>Yüzey hazırlığı:</strong> eski boyanın kazınması, çatlak doldurma, zımpara ve astar işçiliği artırır. Nemli ya da dökülen duvar daha pahalıya boyanır.</li>
        <li><strong>Kat sayısı:</strong> koyu rengin üstüne açık renk çoğu zaman 3–4 kat ister; aynı tonu tazelemek genellikle 2 katla biter.</li>
        <li><strong>Tavan ve detaylar:</strong> tavan çoğu zaman ayrı kalemdir; kapı, pervaz ve pencere kenarları ek işçilik getirir.</li>
        <li><strong>Boyanın markası ve türü:</strong> kaynağa göre boya segmenti m² fiyatına yüzde 20–30 yansıyabilir.</li>
        <li><strong>Boş ya da eşyalı daire</strong> ve <strong>şehir</strong> (${DEKMAR}).</li>
      </ul>
      <h2>Teklif alırken sorulacaklar</h2>
      <ul>
        <li>Fiyat yalnızca işçilik mi, boya ve malzeme dahil mi? Hangi marka ve tür boya kullanılacak?</li>
        <li>Tavan, kapı ve pervazlar dahil mi?</li>
        <li>Alçı, macun ve çatlak onarımı fiyata dahil mi?</li>
        <li>Kaç kat boya yapılacak?</li>
        <li>Eşyaların korunması ve iş sonu temizlik kimde?</li>
        <li>İş kaç gün sürecek?</li>
      </ul>
      <p>Usta seçerken dikkat edilecekler için <a href="/rehber/ev-tadilatinda-usta-secerken-nelere-dikkat-edilmeli">ev tadilatında usta seçimi</a> rehberine bakabilirsin. İşinn'de boya badana ustalarının vitrinlerine bakıp doğrudan mesajla keşif ve fiyat isteyebilirsin; İşinn komisyon almaz ve ödemeye aracılık etmez.</p>
      ${NOTE}
    `,
    ctaText: "Boya badana ustalarını keşfet",
    ctaHref: "/kategori/boya-badana",
    faq: [
      { q: "2026'da boya badana m² fiyatı ne kadar?", a: "2026 kaynaklarına göre iç cephe boya işçiliği m² başına yaklaşık 60–180 TL; boya ve malzeme dahil standart plastik boyada 110–180 TL, silikonlu ya da saten boyada 180–280 TL. Büyükşehirlerde fiyatlar üst banda yakın." },
      { q: "2+1 ev boyatmak kaç para?", a: "Bir boya firmasının 2026 aralığına göre boş bir 2+1 dairenin (yaklaşık 85–100 m²) malzeme ve işçilik dahil anahtar teslim boyası 28.000–45.000 TL. Eşyalı dairede fiyat genellikle yüzde 10–20 artıyor." },
      { q: "Boyanacak alan nasıl hesaplanır?", a: "Usta fiyatı taban alanına değil duvar ve tavan yüzeyine göre verir. Kaba tahmin için dairenin net alanı 2,5–3 ile çarpılabilir; 100 m²'lik daire yaklaşık 250–300 m² boyanacak yüzey demektir." },
    ],
  },
];

export const REHBER_META_TR10 = {
  "ev-temizligi-ucretleri-2026": {
    published: "2026-11-07", updated: "2026-11-07",
    shortAnswer: "Şubat 2026 tarihli haberlere göre gündelik ev temizliği stüdyo ve 1+1 evlerde 2.000 TL'den başlıyor, 2+1'de 4.000 TL'ye, 3+1'de 6.000 TL'ye kadar çıkıyor. Ütü ve yemek gibi ek işler için 1.000 TL'ye kadar ek ücret istenebiliyor. Ayda 10 günden az çalışma için de SGK bildirimi gerekiyor.",
  },
  "cocuk-ve-yasli-bakicisi-ucretleri-2026": {
    published: "2026-11-07", updated: "2026-11-07",
    shortAnswer: "2026 verilerine göre çocuk bakıcısı aylık ortalama 42.100 TL. İstanbul'da gündüzlü çocuk bakıcısı 35.000–50.000 TL, yatılı 45.000–60.000 TL; yaşlı bakıcısı gündüzlü 45.000–65.000 TL, yatılı 60.000–80.000 TL. Sigorta ve yol giderleri genellikle maaşa dahil değildir.",
  },
  "urun-fotografi-cekimi-fiyatlari-2026": {
    published: "2026-11-07", updated: "2026-11-07",
    shortAnswer: "2026 stüdyo tarifelerine göre beyaz fonda ürün başı yaklaşık 325–999 TL, mankenli çekimde 799–1.499 TL. Ürün türüne göre tek poz çanta 250 TL, saat ve mücevher 800 TL. Adet arttıkça birim fiyat düşer; fiyatlara genellikle KDV eklenir.",
  },
  "video-kurgu-ucretleri-2026": {
    published: "2026-11-07", updated: "2026-11-07",
    shortAnswer: "2026 kaynaklarına göre 1 dakikalık basit video kurgu 1.000 TL, efekt ve seslerle zenginleştirilmiş kurgu 3.000 TL; serbest çalışan bir kurgucunun gün ücreti 4.000–12.000 TL. Çekim de istenirse sosyal medya içerik paketleri 25.000–60.000 TL bandında.",
  },
  "boya-badana-fiyatlari-2026": {
    published: "2026-11-07", updated: "2026-11-07",
    shortAnswer: "2026 kaynaklarına göre iç cephe boya işçiliği m² başına 60–180 TL, malzeme dahil 110–280 TL. Boş bir 2+1 dairenin malzeme ve işçilik dahil boyası 28.000–45.000 TL; eşyalı dairede yüzde 10–20 artıyor.",
  },
};
