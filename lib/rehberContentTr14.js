// Mimarlık rehberleri (2026-11-22). Kurucu: "mimarlar için rehber yazı yaz" + "mimar arayanları siteye çekmenin
// yolunu bul". Biri mimar arayana (arama talebi: "mimar nasıl seçilir", "iç mimar mı mimar mı"), biri mimar ve iç
// mimarlara (vitrin hazırlama). Kurallar: fiyat rakamı yok (ücret için yalnızca hesap mantığı ve resmî kaynağa
// yönlendirme); İşinn'de kaç mimar olduğu, "en iyi", "doğrulanmış" gibi iddialar yok; yasal atıflar genel bilgi
// düzeyinde.
const LEGAL = `<p><em>Bu sayfa genel bilgilendirme amaçlıdır, hukuki tavsiye değildir. Ruhsat ve kat mülkiyeti konularında belediyene, ilgili meslek odasına ya da bir avukata danış.</em></p>`;

export const REHBER_POSTS_TR14 = [
  {
    slug: "mimar-ve-ic-mimar-nasil-secilir",
    title: "Mimar ya da İç Mimar Nasıl Seçilir? Görüşmeden Önce Bilmen Gerekenler",
    seoTitle: "Mimar ya da İç Mimar Nasıl Seçilir?",
    description: "Ev, ofis ya da dükkân projen için mimar mı iç mimar mı gerekir, nasıl seçilir, ilk görüşmede ne sorulur, sözleşmeye ne yazılır: adım adım rehber.",
    category: "tadilat",
    bodyHtml: `
      <p>Bir evi baştan tasarlatmak, dairenin içini yeniletmek ya da bir dükkânı açılışa hazırlamak… Hepsinde ilk soru aynı: kiminle çalışacağım? Yanlış kişiyle geçen aylar hem bütçeyi hem sabrı tüketir. Bu rehber doğru uzmanı seçmen ve ilk görüşmeye hazırlıklı girmen için.</p>

      <h2>1. Önce şunu netleştir: mimar mı, iç mimar mı?</h2>
      <ul>
        <li><strong>Mimar:</strong> Yapının kendisini tasarlar: yeni bina, ek kat, cephe, yapının kütlesi ve plan şeması. Yapı ruhsatı için belediyeye verilen mimari proje, meslek odasına kayıtlı bir mimar tarafından hazırlanır.</li>
        <li><strong>İç mimar:</strong> Mevcut bir yapının içini tasarlar: mekân düzeni, mutfak ve banyo, aydınlatma, malzeme ve renk, mobilya ve dolap çizimleri. Daire, ofis, kafe, mağaza yenilemelerinde genellikle aradığın kişi iç mimardır.</li>
        <li><strong>Taşıyıcı sisteme dokunuluyorsa:</strong> Duvar kaldırma, kolon ya da kirişte değişiklik gibi işlerde mutlaka bir inşaat mühendisinin statik değerlendirmesi gerekir. İyi bir mimar ya da iç mimar bunu sana kendisi söyler.</li>
      </ul>

      <h2>2. Portfolyoya değil, sana benzeyen projeye bak</h2>
      <p>Etkileyici görseller herkeste var. Asıl soru: bu kişi senin projene benzer bir işi daha önce yapmış mı? Küçük bir dairenin akıllıca kullanılması ile büyük bir villanın tasarımı farklı beceriler ister. Vitrininde ya da portfolyosunda şunlara bak:</p>
      <ul>
        <li>Senin bütçene ve ölçeğine yakın projeler</li>
        <li>Yalnızca 3B görsel değil, <strong>bitmiş uygulama fotoğrafları</strong></li>
        <li>Plan ve çizim örnekleri: işi kâğıtta nasıl çözdüğü</li>
        <li>Önceki müşterilerin yorumları</li>
      </ul>

      <h2>3. İlk görüşmeden önce kısa bir not hazırla</h2>
      <p>Uzmanın sana doğru yaklaşımı önerebilmesi için şunları yazılı olarak götür:</p>
      <ul>
        <li>Mekânın yaklaşık metrekaresi ve varsa mevcut plan ya da fotoğraflar</li>
        <li>Mekânda kim yaşayacak ya da çalışacak, nasıl kullanılacak</li>
        <li>Beğendiğin birkaç örnek görsel (Pinterest, Instagram kaydettiklerin)</li>
        <li>Kabaca bir bütçe aralığı ve hedef tarih</li>
      </ul>

      <h2>4. İlk görüşmede sorulacak sorular</h2>
      <ul>
        <li>Hizmete neler dahil: konsept, 3B görsel, uygulama çizimleri, malzeme listesi, şantiye takibi?</li>
        <li>Kaç revizyon hakkım var?</li>
        <li>Hangi dosyaları teslim alacağım (PDF, DWG, görseller)?</li>
        <li>Uygulamayı kim yapacak; usta ve firma önerisi veriyor musunuz, takibini yapıyor musunuz?</li>
        <li>Takvim nasıl ilerleyecek, hangi aşamada hangi kararı vermem gerekecek?</li>
        <li>Ödeme aşamalara göre mi bölünüyor?</li>
      </ul>

      <h2>5. Ücret nasıl belirlenir?</h2>
      <p>Mimari proje ücretleri meslek odalarının belirlediği esaslara göre, yapının yaklaşık maliyeti üzerinden hesaplanır. Yapı yaklaşık birim maliyetlerinin nasıl kullanıldığını <a href="/rehber/insaat-maliyeti-m2-2026">inşaat maliyeti rehberinde</a> anlattık. İç mimarlıkta ücret çoğu zaman metrekare, proje ya da aşama bazında konuşulur. Hangi yöntem olursa olsun, kapsamı yazılı netleştirmeden fiyatları karşılaştırma: biri yalnızca konsept çizer, diğeri şantiyeyi de takip eder.</p>

      <h2>6. Sözleşmeye mutlaka yazılması gerekenler</h2>
      <ul>
        <li>Kapsam: yapılacak ve <strong>yapılmayacak</strong> işler</li>
        <li>Teslim edilecek çizim ve dosyalar, revizyon sayısı</li>
        <li>Takvim ve aşamalara bağlı ödeme planı</li>
        <li>Uygulama sırasında ek iş çıkarsa nasıl fiyatlanacağı</li>
      </ul>

      <h2>7. Apartmanda tadilat yapıyorsan</h2>
      <p>Bağımsız bölümün içindeki değişiklikler bile binanın ortak yerlerini, cephesini ya da taşıyıcı sistemini etkileyebilir. Bu tür değişikliklerde Kat Mülkiyeti Kanunu kat maliklerinin rızasını arar; ruhsat gerektiren işlerde de belediyenin onayı gerekir. Başlamadan önce yöneticiyle konuşmak ve uzmanına bu konuyu sormak, sonradan çıkacak anlaşmazlıkları önler.</p>

      <h2>İşinn'de nasıl bulunur?</h2>
      <p>İşinn'de mimar ve iç mimarlar vitrinlerinde çalışmalarını, yöntemlerini ve belgelerini gösterir. Meslek odası sicil bilgisini paylaşan uzmanların vitrininde bu bilgi görünür; istersen ilgili odanın kendi kanalından kontrol edebilirsin. Beğendiğin uzmana doğrudan mesaj atarsın; anlaşmayı aranızda yaparsınız. <a href="/kategori/ic-mimarlik">İç mimarlık vitrinlerine</a> ya da <a href="/kategori/muhendis">mühendis ve mimar vitrinlerine</a> göz at. Aradığını bulamazsan bir talep bırak, uygun uzmanlar sana yazsın.</p>
      ${LEGAL}
    `,
    ctaText: "Mimar ve iç mimarları keşfet",
    ctaHref: "/kategori/ic-mimarlik",
    faq: [
      { q: "Daire tadilatı için mimar mı iç mimar mı gerekir?", a: "Dairenin içini yeniden düzenleyeceksen (mutfak, banyo, aydınlatma, malzeme, mobilya) genellikle iç mimar aradığın kişidir. Yapının dış kabuğunu, kütlesini değiştiren ya da ruhsat gerektiren işlerde mimar gerekir. Taşıyıcı sisteme dokunulacaksa inşaat mühendisinin statik değerlendirmesi şarttır." },
      { q: "Mimarla ilk görüşmede ne sorulmalı?", a: "Hizmete nelerin dahil olduğu (konsept, 3B görsel, uygulama çizimleri, şantiye takibi), revizyon sayısı, teslim edilecek dosyalar, uygulamayı kimin yapacağı, takvim ve ödemenin aşamalara nasıl bölündüğü sorulmalı." },
      { q: "Mimarın meslek odasına kayıtlı olup olmadığını nasıl anlarım?", a: "Uzmandan oda sicil numarasını iste ve ilgili meslek odasının (Mimarlar Odası ya da İç Mimarlar Odası) kendi kanalından kontrol et. İşinn'de sicil bilgisini paylaşan uzmanların vitrininde bu bilgi görünür." },
      { q: "Mimari proje ücreti nasıl hesaplanır?", a: "Mimari proje ücretleri meslek odalarının belirlediği esaslara göre, yapının yaklaşık maliyeti üzerinden hesaplanır. İç mimarlıkta ücret çoğu zaman metrekare, proje ya da aşama bazında konuşulur. Fiyat karşılaştırmadan önce kapsamı yazılı netleştirmek gerekir." },
    ],
  },
  {
    slug: "mimar-ve-ic-mimar-icin-musteri-getiren-vitrin",
    title: "Mimar ve İç Mimarlar İçin: Müşteri Getiren Bir Vitrin Nasıl Hazırlanır?",
    seoTitle: "Mimar ve İç Mimar İçin Müşteri Getiren Vitrin",
    description: "Mimar ve iç mimarlar için portfolyo ve vitrin rehberi: hangi projeleri göstermeli, açıklamaya ne yazmalı, güven nasıl kurulur, ilk mesaja nasıl dönülür.",
    category: "genel",
    bodyHtml: `
      <p>Mimarlıkta müşteri seni çoğu zaman tek bir soruyla seçer: “Benim projemi bu kişi çözer mi?” İyi bir vitrin bu sorunun cevabını, sen daha konuşmadan verir. Bu rehber, mimar ve iç mimarların vitrinlerini müşterinin gözüyle kurmaları için.</p>

      <h2>1. Az ama doğru proje göster</h2>
      <p>Her şeyi koymak yerine, bulunmak istediğin işe benzeyen projeleri seç. Küçük daire yenilemeleri yapmak istiyorsan, onları öne al. Her projede şu sırayı dene:</p>
      <ul>
        <li>Önce ve sonra fotoğrafı (varsa)</li>
        <li>Bir plan ya da çizim: problemi nasıl çözdüğünü gösterir</li>
        <li>3B görsel ile <strong>bitmiş uygulama fotoğrafı</strong> yan yana; müşteri en çok gerçekleşmiş işe güvenir</li>
        <li>Tek cümlelik hikâye: “65 m²'lik dairede mutfağı salona açıp depolama alanını iki katına çıkardık.”</li>
      </ul>

      <h2>2. Kapak fotoğrafını özenle seç</h2>
      <p>Aramada seni ilk gösteren şey kapaktır. En güçlü, gün ışığında çekilmiş, düzgün kadrajlı bir uygulama fotoğrafı kullan. Logo ya da yazılı afiş yerine işinin kendisi en iyi kapaktır.</p>

      <h2>3. Açıklamada ne yaptığını müşterinin diliyle anlat</h2>
      <ul>
        <li>Hangi işleri alıyorsun: konut, ofis, mağaza, kafe; yeni yapı mı, yenileme mi?</li>
        <li>Hizmete neler dahil: konsept, 3B görsel, uygulama çizimleri, malzeme listesi, şantiye takibi</li>
        <li>Nasıl çalışıyorsun: ilk görüşmeden teslime kadar adımlar</li>
        <li>Hangi şehirlerde çalışıyorsun, uzaktan proje alıyor musun?</li>
      </ul>
      <p>“Modern ve fonksiyonel tasarımlar” gibi herkesin yazdığı cümleler yerine somut ol: “Küçük metrekareli dairelerde depolama ve ışık çözümleri.”</p>

      <h2>4. Güveni belgelerle kur</h2>
      <p>İşinn vitrininde meslek odası sicil bilgini, diplomanı ve sertifikalarını ekleyebilirsin. Ruhsatlı bir meslekte sicil bilgisinin görünmesi müşteriye güven verir. CV'ni ve kullandığın programları (AutoCAD, Revit, SketchUp, 3ds Max gibi) da yazmayı unutma; teknik çizim ya da görselleştirme işi arayanlar bu kelimelerle arar.</p>

      <h2>5. Çalışma bağlantını ekle</h2>
      <p>Behance, Instagram ya da kendi siten varsa vitrinine çalışma bağlantısı olarak ekle. Müşteri daha fazlasını görmek isterse tek tıkla ulaşır.</p>

      <h2>6. İlk mesaja hızlı ve soruyla dön</h2>
      <p>Mesaj atan kişiye ilk yanıtta fiyat söylemek yerine iki üç kısa soru sor: metrekare, mekânın şu anki hâli, beklenen tarih. Bu hem profesyonel görünür hem doğru teklif vermeni sağlar. İş bitince müşterinden vitrinine yorum bırakmasını iste; bir sonraki müşteri için en güçlü kanıt odur.</p>

      <h2>Vitrinini aç</h2>
      <p>İşinn'de vitrin açmak birkaç dakika sürer. Müşteriler seni kategori sayfalarında ve aramada bulur, doğrudan sana yazar. Vitrinin hazır olduğunda QR'lı broşür ve Instagram için vitrin bağlantını da kullanabilirsin.</p>
    `,
    ctaText: "Vitrinini aç",
    ctaHref: "/hizmet-ver",
    faq: [
      { q: "Mimar vitrininde kaç proje olmalı?", a: "Sayıdan çok uygunluk önemli. Bulunmak istediğin işe benzeyen birkaç güçlü projeyi; plan, 3B görsel ve bitmiş uygulama fotoğrafıyla göstermek, ilgisiz çok sayıda görselden daha etkilidir." },
      { q: "Mimar vitrinine meslek odası sicil numarası eklenmeli mi?", a: "Ruhsatlı bir meslekte sicil bilgisinin görünmesi güven verir. İşinn vitrininde oda ve sicil bilgini ekleyebilirsin; ziyaretçi isterse ilgili odanın kendi kanalından kontrol eder." },
      { q: "İç mimar ilk mesaja nasıl dönmeli?", a: "İlk yanıtta fiyat yerine metrekare, mekânın mevcut durumu ve hedef tarih gibi iki üç kısa soru sormak hem profesyonel görünür hem doğru teklif vermeni sağlar." },
    ],
  },
];

export const REHBER_META_TR14 = {
  "mimar-ve-ic-mimar-nasil-secilir": {
    published: "2026-11-22", updated: "2026-11-22",
    shortAnswer: "Önce ihtiyacını netleştir: yapının kendisi için mimar, mevcut mekânın içi için iç mimar; taşıyıcı sisteme dokunulacaksa inşaat mühendisi de gerekir. Portfolyoda sana benzeyen projelere ve bitmiş uygulama fotoğraflarına bak. İlk görüşmede kapsamı, revizyon sayısını, teslim dosyalarını, takvimi ve ödeme aşamalarını sor; hepsini sözleşmeye yaz. Meslek odası sicilini ilgili odadan kontrol edebilirsin.",
  },
  "mimar-ve-ic-mimar-icin-musteri-getiren-vitrin": {
    published: "2026-11-22", updated: "2026-11-22",
    shortAnswer: "Bulunmak istediğin işe benzeyen birkaç projeyi plan, 3B görsel ve bitmiş uygulama fotoğrafıyla göster; kapakta en güçlü uygulama fotoğrafını kullan. Açıklamada hangi işleri aldığını, hizmete neyin dahil olduğunu ve nasıl çalıştığını somut yaz. Meslek odası sicilini, belgelerini ve kullandığın programları ekle. İlk mesaja fiyat yerine kısa sorularla dön, iş bitince yorum iste.",
  },
};
