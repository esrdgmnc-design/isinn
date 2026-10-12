// İki yeni Türkçe rehber (2026-10-12): vitrin açıklaması yazımı ve freelancer'la çalışmadan önce brief. Kurallar: kazanç/müşteri vaadi yok,
// fiyat rakamı yok, hukuki/vergi tavsiyesi yok, "güvenilir/doğrulanmış" ifadesi yok. İşinn hakkında yalnızca doğrulanmış bilgiler:
// komisyon yok, ödemeye aracılık yok, yapay zekâ vitrin metni/fikir önerir.
export const REHBER_POSTS_TR4 = [
  {
    slug: "hizmet-vitrini-aciklamasi-nasil-yazilir",
    title: "Hizmet Vitrini Açıklaması Nasıl Yazılır? İlk Cümle, Kapsam ve Sınırlar",
    description: "Vitrin açıklamanda neyi, kimin için, nerede yaptığını nasıl yazarsın? İlk cümle formülü, kapsam ve sınır yazımı, kaçınılacak ifadeler ve kopyalanabilir bir şablon.",
    category: "genel",
    bodyHtml: `
      <p>Vitrin açıklaması, ziyaretçinin “bu kişi benim işimi yapabilir mi?” sorusuna verdiğin yazılı cevaptır. Çoğu açıklama kendini anlatmakla başlar; oysa okuyan önce kendi ihtiyacının karşılanıp karşılanmadığını arar. Bu yazı, açıklamayı okuyanın sorularına göre kurmanın basit bir yolunu anlatıyor.</p>
      <h2>1. İlk cümle: kim için, ne, nerede</h2>
      <p>Arama sonuçlarında ve vitrin kartında çoğu zaman yalnızca ilk cümle görünür. Bu yüzden ilk cümleye üç şeyi sığdır: hizmetin ne olduğu, kime sunduğun ve hangi şehir ya da çevrimiçi olup olmadığı. Örnek yapı: “İstanbul'da, lise öğrencilerine yüz yüze ve çevrimiçi matematik özel dersi veriyorum.” Burada unvan, slogan ya da sıfat yok; yalnızca bilgi var.</p>
      <h2>2. Kapsamı yaz</h2>
      <p>İkinci paragrafta neleri yaptığını madde madde listele. Okuyan, listeden kendi ihtiyacını bulabilmeli. Aynı şekilde neleri yapmadığını da bir cümleyle söyle: “Elektrik tesisatı değişikliği yapmıyorum, yalnızca arıza tespiti ve priz-anahtar değişimi.” Sınır yazmak güveni azaltmaz, tersine yanlış beklentiyle gelen mesajları azaltır.</p>
      <h2>3. Nasıl çalıştığını anlat</h2>
      <p>İlk görüşme nasıl olur, iş ne kadar sürede başlar, teslim ya da ders nasıl ilerler? Hizmet süreci kısa bir akış olarak yazıldığında ziyaretçinin ilk mesajı da netleşir. Kesin süre veremiyorsan “işin kapsamına göre konuşuruz” demek yalan söylemekten iyidir.</p>
      <h2>4. Yazmaman gerekenler</h2>
      <ul>
        <li><strong>Sahip olmadığın unvan, belge ya da referans.</strong> İleride sorulduğunda geri alamazsın.</li>
        <li><strong>Garanti ve kesin sonuç:</strong> “Sınavı kesin kazandırırım”, “kilo vermeni garanti ederim” gibi ifadeler hem gerçekçi değil hem de ziyaretçide şüphe uyandırır.</li>
        <li><strong>“En iyi”, “bir numara” gibi karşılaştırmalar.</strong> Kanıtlayamadığın üstünlük iddiası yerine yaptığın somut bir işi anlat.</li>
        <li><strong>Ödeme bilgisi:</strong> IBAN, kart ya da kapora talebi vitrin açıklamasında yer almamalı; ödemeyi iki taraf görüşmede kendi aralarında belirler.</li>
        <li><strong>Başkasının metni ve fotoğrafı.</strong> Çalışma örneklerin sana ait olsun ya da paylaşma izni alınmış olsun.</li>
      </ul>
      <h2>5. Kanıtı metne bağla</h2>
      <p>“Deneyimliyim” yerine “5 yıldır … yapıyorum, şu türde işler yaptım” yaz. Çalışma örneklerini ve varsa tanıtım videonu açıklamada kısaca an: “Aşağıdaki fotoğraflar kendi yaptığım çalışmalardır.” Web siten ya da sosyal medya hesabın varsa vitrine çalışma bağlantısı olarak ekleyebilirsin.</p>
      <h2>Kopyala, doldur: açıklama şablonu</h2>
      <ul>
        <li><strong>1. cümle:</strong> [Şehir/çevrimiçi] için [kime] [ne hizmeti] veriyorum.</li>
        <li><strong>Neler yapıyorum:</strong> 3-5 madde.</li>
        <li><strong>Neleri yapmıyorum:</strong> 1-2 madde.</li>
        <li><strong>Nasıl çalışıyoruz:</strong> ilk görüşme, süre, teslim ya da ders düzeni.</li>
        <li><strong>Kanıt:</strong> kaç yıl, hangi tür işler, örnekler hangi fotoğraflar.</li>
      </ul>
      <p>Ne yazacağından emin değilsen İşinn'deki <a href="/yetenegini-farket">Yeteneğini Farket</a> aracı, yazdığın becerilerden hizmet fikirleri ve hazır bir vitrin taslağı önerir. Öneriler başlangıç noktasıdır, garanti değildir; son metni sen düzenlersin. Fiyat konusunda <a href="/rehber/hizmet-fiyati-nasil-belirlenir-saatlik-sabit-teklif">hizmet fiyatı nasıl belirlenir</a> rehberine bakabilirsin. İşinn komisyon almaz ve kullanıcılar arasındaki ödemeye aracılık etmez; müşteri bulma sonucu kesin değildir.</p>
    `,
    ctaText: "Vitrinini oluştur",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "Vitrin açıklaması ne kadar uzun olmalı?", a: "Kesin bir sınır yok. İlk cümle tek başına anlaşılır olmalı; devamında kapsam, süreç ve kanıt için birkaç kısa paragraf ya da madde yeterlidir. Ziyaretçinin ihtiyaç duyduğu bilgiyi hızlı bulması uzunluktan daha önemlidir." },
      { q: "Açıklamaya telefon numarası ya da IBAN yazabilir miyim?", a: "IBAN ve ödeme talebini açıklamaya yazmamanı öneririz. İletişim ve ödeme konuşmasını platform içindeki mesajlaşmada yapmak daha rahat ve izlenebilir bir yoldur." },
      { q: "Garanti vermeden nasıl ikna edici yazarım?", a: "Somut bilgiyle: kaç yıl yaptığını, hangi türde işler yaptığını, neyi nasıl teslim ettiğini ve çalışma örneklerini yaz. Sonuç vaadi yerine süreci ve kapsamı anlatmak daha inandırıcıdır." },
      { q: "Başlangıçta hiç örneğim yoksa ne yazmalıyım?", a: "Sahip olmadığın referans ya da deneyimi uydurma. Neyi yapabildiğini, nasıl çalıştığını ve ilk müşterin için net bir kapsamla başlayabileceğini dürüstçe yaz. Küçük bir ilk işle örnek biriktirmeye başlayabilirsin." },
    ],
  },
  {
    slug: "freelancer-ile-calismadan-once-brief-nasil-hazirlanir",
    title: "Freelancer ile Çalışmadan Önce Brief Nasıl Hazırlanır? Kapsam, Teslim ve Revizyon",
    description: "Bir hizmet verenle çalışmadan önce yazılı bir brief hazırlamak: amaç, kapsam, teslim, süre, revizyon ve ödeme düzeni için soru listesi ve kopyalanabilir şablon.",
    category: "genel",
    bodyHtml: `
      <p>Bir hizmet verenle anlaşırken en çok yaşanan sorun, iki tarafın aynı cümleden farklı şeyler anlamasıdır. “Logo tasarımı” bir kişi için tek bir dosya, başka biri için marka kılavuzudur. Bunu önlemenin en ucuz yolu, çalışmaya başlamadan önce kısa bir yazılı brief hazırlamak.</p>
      <h2>1. Amacı tek cümleyle yaz</h2>
      <p>“Ne istiyorum” değil, “bunu ne için istiyorum” diye başla: “Küçük işletmem için Instagram'da kullanacağım logo.” Amaç net olunca hizmet veren, nereye ne kadar emek koyacağını anlar.</p>
      <h2>2. Kapsamı sınırla</h2>
      <p>Neler iş kapsamında, neler dışında? Kaç ürün, kaç sayfa, kaç dakikalık video, hangi dosya formatları? Kapsamın dışında kalan bir şey sonradan istenirse ek iş sayılır mı, bunu baştan konuşmak sonradan gelecek tartışmayı azaltır.</p>
      <h2>3. Teslimi ve takvimi belirle</h2>
      <p>Ne zaman, hangi biçimde teslim edilecek? Ara teslim var mı? Tarihi olabildiğince somut yaz, “en kısa sürede” yerine tarih ya da gün sayısı kullan. Hizmet veren de kendi takvimine göre bir tarih önerebilir; ikinizin de yazılı onayladığı tarih esas olsun.</p>
      <h2>4. Revizyon ve geri bildirim</h2>
      <p>Kaç düzeltme turu var? Geri bildirim hangi kanaldan ve ne kadar sürede verilecek? Revizyon sınırı olmayan işler hem sana hem hizmet verene belirsizlik yaratır. Küçük düzeltme ile baştan yeniden iş istemek arasındaki farkı örnekle yaz.</p>
      <h2>5. Ödeme düzenini kendi aranızda konuş</h2>
      <p>İşinn kullanıcılar arasındaki ödemeye aracılık etmez; ödeme şekli ve zamanı iki tarafın anlaşmasıdır. Genel bir önlem olarak hizmeti ya da işin bir kısmını görmeden büyük bir ön ödeme göndermemeni öneririz; iş aşamalara bölünüyorsa her aşamanın karşılığını yazılı olarak konuşabilirsin. Vergi ve fatura konularında resmî kaynaklara ya da bir mali müşavire danış.</p>
      <h2>6. Kullanım hakları ve gizlilik</h2>
      <p>Teslim edilen işi nerede, nasıl kullanabileceksin, hizmet veren çalışmayı kendi portföyünde gösterebilir mi? Paylaşacağın belgeler gizliyse bunu da yaz. Hukuki ayrıntı gereken işlerde bir uzmana danışmak en doğrusu; bu yazı tavsiye değildir.</p>
      <h2>Kopyala, doldur: brief şablonu</h2>
      <ul>
        <li><strong>Amaç:</strong> …</li>
        <li><strong>Kapsam (dahil):</strong> …</li>
        <li><strong>Kapsam dışı:</strong> …</li>
        <li><strong>Teslim biçimi ve tarihi:</strong> …</li>
        <li><strong>Revizyon sayısı ve geri bildirim süresi:</strong> …</li>
        <li><strong>Ödeme düzeni (kendi aranızda):</strong> …</li>
        <li><strong>Kullanım hakları ve gizlilik:</strong> …</li>
      </ul>
      <p>Brief'i ilk mesajda ya da ilk görüşmeden hemen sonra yazılı olarak paylaş ve karşı tarafın “anladım, şöyle yapıyoruz” demesini bekle. Ne yazacağından emin değilsen <a href="/rehber/musteriye-ilk-mesaj-ve-yazili-anlasma-sablonlari">ilk mesaj ve yazılı anlaşma şablonları</a> yazımıza bakabilirsin. İşinn komisyon almaz; hizmet veren ve müşteri anlaşmasını kendi aralarında yapar.</p>
    `,
    ctaText: "Hizmet verenleri keşfet",
    ctaHref: "/",
    faq: [
      { q: "Brief ne kadar uzun olmalı?", a: "Bir sayfayı geçmesine gerek yok. Amaç, kapsam, teslim, revizyon ve ödeme düzeni gibi başlıklara birer iki cümle yeterlidir. Önemli olan iki tarafın aynı şeyi anladığını yazılı olarak görmesidir." },
      { q: "Brief'i yazdıktan sonra değişiklik yapabilir miyim?", a: "Evet, ama değişikliği yazılı olarak ve iki taraf da onaylayarak yapmak sonradan çıkacak anlaşmazlığı azaltır. Kapsam büyüyorsa süre ve ücretin de konuşulması gerekebilir." },
      { q: "Ön ödeme istenirse ne yapmalıyım?", a: "Ödeme düzeni iki tarafın anlaşmasıdır; İşinn ödemeye aracılık etmez. Hizmeti ya da işin bir kısmını görmeden büyük bir tutar göndermemeni, işi aşamalara bölüp her aşamanın karşılığını yazılı konuşmanı öneririz. Şüpheli bir istek gelirse kullanıcıyı şikayet edebilirsin." },
      { q: "Hizmet verenin portföyümde işimi göstermesine izin vermeli miyim?", a: "Bu iki tarafın konuşacağı bir konu. Brief'e kullanım hakları ve portföyde gösterme iznini yazarsan sonradan belirsizlik olmaz. Gizli bilgi içeren işlerde izin vermeme hakkın vardır." },
    ],
  },
];

export const REHBER_META_TR4 = {
  "hizmet-vitrini-aciklamasi-nasil-yazilir": {
    published: "2026-10-12", updated: "2026-10-12",
    shortAnswer: "Vitrin açıklamasını ilk cümlede hizmeti, kime sunduğunu ve nerede yaptığını yazarak başlat; sonra kapsamı, sınırları, nasıl çalıştığını ve kanıtı (somut işler, örnekler) ekle. Sahip olmadığın unvan ya da garanti verme, ödeme bilgisi yazma. Sonuç ya da müşteri bulma kesin değildir.",
  },
  "freelancer-ile-calismadan-once-brief-nasil-hazirlanir": {
    published: "2026-10-12", updated: "2026-10-12",
    shortAnswer: "Çalışmadan önce amaç, kapsam (dahil ve dışı), teslim biçimi ve tarihi, revizyon sayısı, ödeme düzeni ve kullanım haklarını bir sayfalık yazılı brief'te topla ve karşı tarafın onayını bekle. Ödeme iki tarafın anlaşmasıdır; İşinn aracılık etmez. Bu yazı hukuki ya da mali tavsiye değildir.",
  },
};
