// Kategori sayfaları için elle yazılmış açıklama metinleri (2026-10-23, SEO ajanı önerisi):
// kategori sayfalarında yalnızca tek cümlelik otomatik giriş vardı ve Google bu sayfaları
// "ince" bulup dizine almıyordu. Şablon değil, her kategori için ayrı yazıldı; yalnızca
// beyaz yaka/uzaktan çalışılan kategorilerle başlandı. Rakam, garanti ya da "doğrulanmış"
// gibi iddia içermez. Yeni kategori eklerken aynı kural: genel bilgi + seçerken nelere bakılır.
const CATEGORY_INTROS = {
  yazilim: {
    heading: "Yazılım freelancer'ı seçerken",
    paragraphs: [
      "Yazılım kategorisinde web sitesi, mobil uygulama, otomasyon betikleri, veri işleri ve mevcut bir sistemin bakımı gibi işler için çalışan freelance geliştiricileri bulursun. Çoğu iş uzaktan yürütülür; bu yüzden geliştiricinin yaşadığı şehirden çok, kullandığı teknolojiler ve benzer işlerdeki deneyimi önemlidir.",
      "Seçim yaparken vitrindeki çalışma örneklerine ve varsa canlı bağlantılara bak, işin kapsamını yazılı bir brief ile paylaş ve teslimi aşamalara böl. Kaynak kodun, alan adının ve sunucu erişimlerinin kimde kalacağını işe başlamadan konuş. Küçük, kapsamı net işler için freelancer; birden çok uzmanlık ve uzun süreli destek gereken işler için ekip ya da ajans daha uygun olabilir.",
    ],
  },
  tasarim: {
    heading: "Tasarımcı seçerken",
    paragraphs: [
      "Tasarım kategorisinde logo ve kurumsal kimlik, sosyal medya görselleri, afiş ve broşür, sunum, ambalaj ve arayüz tasarımı gibi işler yapan tasarımcıları bulursun. İşlerin büyük kısmı uzaktan, dosya paylaşımı ve mesajlaşmayla yürür.",
      "Portfolyoda farklı sektörlere yapılmış işler ve tasarımların gerçek kullanımdaki hâli (tabela, ambalaj, telefon ekranı) iyi bir ipucudur. İşe başlamadan kaç taslak sunulacağını, kaç düzeltme turunun fiyata dahil olduğunu, teslim edilecek dosya biçimlerini (ör. vektör dosya) ve kullanım haklarını yazılı konuş. Beğendiğin örnekleri ve beğenmediklerini paylaşmak, ilk taslağın hedefe yakın olmasını sağlar.",
    ],
  },
  "sosyal-medya": {
    heading: "Sosyal medya uzmanı seçerken",
    paragraphs: [
      "Bu kategoride hesap yönetimi, içerik planı, gönderi ve kısa video hazırlama, topluluk yönetimi ve reklam kurulumu gibi hizmetler veren sosyal medya uzmanlarını bulursun. Hizmetler genellikle aylık paket ya da proje bazında sunulur.",
      "Seçerken uzmanın yönettiği hesaplardan örneklere, senin sektörüne benzer işlere ve iletişim düzenine bak. Paketin içinde ayda kaç gönderi, hangi formatlar, kaç revizyon ve hangi raporların olduğunu netleştir. Takipçi ya da satış artışı garantisi veren tekliflere temkinli yaklaş; hesabın şifre ve yönetici erişimlerinin sende kalmasına dikkat et.",
    ],
  },
  dijital: {
    heading: "Dijital pazarlama uzmanı seçerken",
    paragraphs: [
      "Dijital pazarlama kategorisinde arama motoru optimizasyonu, Google ve sosyal medya reklamları, e-posta pazarlaması, içerik stratejisi ve ölçümleme gibi işler yapan uzmanları bulursun. Bu işler çoğunlukla uzaktan ve düzenli raporlamayla yürütülür.",
      "Başlamadan önce hedefini (ör. daha fazla teklif talebi, randevu ya da web sitesi ziyareti) ve bütçeni netleştir. Uzmandan önceki çalışmalarında neyi nasıl ölçtüğünü anlatmasını iste. Reklam bütçesinin hizmet bedelinden ayrı olduğunu, reklam ve analiz hesaplarının senin adına açılmasını ve raporların hangi sıklıkla paylaşılacağını yazılı konuş.",
    ],
  },
  danismanlik: {
    heading: "Danışman ya da mentor seçerken",
    paragraphs: [
      "Danışmanlık ve mentorluk kategorisinde iş geliştirme, kariyer, girişimcilik, süreç iyileştirme ve belirli bir alanda deneyim aktarımı gibi konularda birebir destek veren uzmanları bulursun. Görüşmeler çoğunlukla çevrim içi yapılır; tek seferlik oturum ya da birkaç haftalık program olarak sunulabilir.",
      "Seçerken danışmanın deneyiminin senin sorununla ne kadar örtüştüğüne bak ve ilk görüşmede ne elde etmek istediğini açıkça söyle. Oturum süresi, görüşme sayısı, aradaki yazışmaların kapsamı ve ücretlendirme baştan belli olmalı. Hukuki, mali ya da sağlıkla ilgili konularda yetkili meslek mensubuna danışmak gerekir.",
    ],
  },
  ogretmen: {
    heading: "Özel ders öğretmeni seçerken",
    paragraphs: [
      "Bu kategoride ilkokuldan üniversiteye okul derslerine, LGS ve YKS hazırlığına, yabancı dile ve yetişkinlere yönelik derslere destek veren öğretmenleri bulursun. Dersler yüz yüze ya da çevrim içi yapılabilir; vitrinde hangi düzeylere ve hangi şekilde ders verildiği yazar.",
      "Seçerken öğretmenin deneyimine, ders verdiği seviyelere ve öğrenciyle iletişim tarzına bak. Mümkünse ilk dersi tanışma ve seviye belirleme dersi olarak planla. Ders süresi, haftalık ders sayısı, ödev ve geri bildirim düzeni, iptal ve erteleme kuralları baştan konuşulmalı. Çocuğun dersine ailenin nasıl dahil olacağını da netleştirmek işe yarar.",
    ],
  },
  ceviri: {
    heading: "Çevirmen seçerken",
    paragraphs: [
      "Çeviri kategorisinde belge, web sitesi, akademik metin, teknik doküman, altyazı ve pazarlama metni gibi işler için çalışan çevirmenleri bulursun. İşler büyük ölçüde uzaktan yürür; önemli olan dil çifti ve konu alanındaki deneyimdir.",
      "Metnin türüne uygun deneyimi olan çevirmeni seç ve gerekirse kısa bir örnek çeviri iste. Teslim süresini, kelime ya da sayfa başı ücretlendirmeyi, terim listesi kullanılıp kullanılmayacağını ve son okumayı kimin yapacağını konuş. Resmî kurumlara verilecek belgelerde yeminli ya da noter onaylı çeviri gerekebilir; bunu ilgili kurumdan teyit et.",
    ],
  },
  "icerik-yazarligi": {
    heading: "İçerik yazarı seçerken",
    paragraphs: [
      "İçerik yazarlığı kategorisinde blog yazısı, web sitesi metni, ürün ve hizmet açıklaması, e-bülten ve sosyal medya metni gibi işler yapan yazarları bulursun. Çoğu iş uzaktan, yazılı brief ve taslak paylaşımıyla ilerler.",
      "Yazarın daha önce yayımlanmış metinlerine ve senin sektörüne yakın örneklerine bak. Hedef okuru, metnin amacını, uzunluğu, anahtar kelimeleri ve marka dilini brief'te yaz. Kaç düzeltme turunun dahil olduğunu, metnin özgün olacağını ve yayın haklarının teslimle birlikte sana geçeceğini işe başlamadan konuş.",
    ],
  },
  "video-duzenleme": {
    heading: "Video editörü seçerken",
    paragraphs: [
      "Video düzenleme kategorisinde kısa video ve reels kurgusu, YouTube videosu, tanıtım filmi, altyazı ve basit animasyon gibi işler yapan editörleri bulursun. Ham görüntüler bulut klasörüyle paylaşılır, iş uzaktan yürür.",
      "Editörün önceki işlerinde tempo, ses ve altyazı kalitesine bak. Videonun yayınlanacağı platformu, süresini, en-boy oranını, müzik kullanımını ve teslim biçimini baştan belirt. Kullanılan müzik ve görsellerin lisansının kimde olduğunu, kaç düzeltme turunun dahil olduğunu ve proje dosyalarının teslim edilip edilmeyeceğini yazılı konuş.",
    ],
  },
  muhasebe: {
    heading: "Muhasebeci ya da mali müşavir seçerken",
    paragraphs: [
      "Bu kategoride defter tutma, beyanname, şirket kuruluşu, serbest meslek ve şahıs şirketi işlemleri gibi konularda hizmet veren muhasebe ve mali müşavirlik uzmanlarını bulursun. Görüşmelerin ve belge paylaşımının bir kısmı çevrim içi yapılabilir.",
      "Mali müşavirlik yasal yetki gerektiren bir meslektir; çalışacağın kişinin meslek unvanını ve oda kaydını sor. Aylık ücrete hangi işlerin dahil olduğunu, belge teslim tarihlerini ve iletişim kanalını netleştir. Vergi ve mevzuat konularında güncel bilgi için Gelir İdaresi Başkanlığı'nın resmî kaynaklarını da takip edebilirsin.",
    ],
  },
  diyetisyen: {
    heading: "Diyetisyen seçerken",
    paragraphs: [
      "Bu kategoride beslenme danışmanlığı, kilo yönetimi, sporcu beslenmesi ve özel durumlara yönelik beslenme planı gibi konularda hizmet veren diyetisyenleri bulursun. Görüşmeler yüz yüze ya da çevrim içi yapılabilir.",
      "Diyetisyenlik, beslenme ve diyetetik eğitimi gerektiren bir meslektir; çalışacağın kişiye mesleki unvanını ve eğitimini sormak yerinde olur. İlk görüşmede takip sıklığını, ölçümlerin nasıl yapılacağını ve görüşmeler arasında iletişimin nasıl sürdürüleceğini netleştir. Kısa sürede kesin sonuç vaat eden programlara temkinli yaklaş; bir sağlık sorunun varsa hekiminle de görüş.",
    ],
  },
  psikolog: {
    heading: "Psikolog ya da aile danışmanı seçerken",
    paragraphs: [
      "Bu kategoride bireysel danışmanlık, çift ve aile danışmanlığı, ebeveynlik desteği gibi alanlarda hizmet veren psikologları ve danışmanları bulursun. Görüşmeler yüz yüze ya da çevrim içi yapılabilir.",
      "Psikolog, klinik psikolog ve aile danışmanı gibi unvanlar farklı eğitimler gerektirir; çalışacağın kişiye unvanını, eğitimini ve hangi konularda çalıştığını sormak önemlidir. Seans süresi, sıklığı, ücret ve iptal koşulları baştan konuşulmalı. Acil bir durumda ya da kendine veya başkasına zarar verme düşüncesi varsa 112 Acil Çağrı Merkezi'ni ara.",
    ],
  },
  "profesyonel-fotograf": {
    heading: "Fotoğrafçı seçerken",
    paragraphs: [
      "Bu kategoride ürün, portre, etkinlik, düğün, mekân ve kurumsal fotoğraf çekimi yapan fotoğrafçıları bulursun. Bazı fotoğrafçılar çekimin yanında düzenleme (rötuş) hizmeti de sunar.",
      "Fotoğrafçının portfolyosunda senin istediğin türde çekimler olup olmadığına bak; ürün fotoğrafı ile düğün fotoğrafı farklı deneyim ister. Çekim süresini, teslim edilecek fotoğraf sayısını, düzenleme kapsamını, teslim süresini ve fotoğrafların kullanım haklarını yazılı konuş. Mekân, ulaşım ve ekipman masraflarının fiyata dahil olup olmadığını da sor.",
    ],
  },
  "sanal-asistan": {
    heading: "Sanal asistan seçerken",
    paragraphs: [
      "Sanal asistan kategorisinde e-posta ve takvim yönetimi, veri girişi, müşteri yazışmaları, sosyal medya planlama ve araştırma gibi idari işleri uzaktan yürüten kişileri bulursun. Çalışma genellikle saatlik ya da aylık paket şeklinde düzenlenir.",
      "Başlamadan önce hangi işleri devredeceğini bir liste hâlinde yaz ve hangi araçları kullandığını paylaş. Hesaplarına erişim gerekiyorsa şifre paylaşmak yerine yetki verme özelliklerini kullan, erişimleri iş bitince kapat. Çalışma saatleri, yanıt süresi, raporlama ve gizlilik konularını yazılı olarak netleştir.",
    ],
  },
  seslendirme: {
    heading: "Seslendirme sanatçısı seçerken",
    paragraphs: [
      "Seslendirme kategorisinde reklam, tanıtım filmi, e-öğrenme, sesli kitap, telefon karşılama mesajı ve video anlatımı gibi işler için ses veren kişileri bulursun. Kayıtlar çoğunlukla sanatçının kendi stüdyosunda yapılır ve dosya olarak teslim edilir.",
      "Önceki kayıtlarından örnek dinle ve metninin tonuna uygun sesi seç. Metnin uzunluğunu, teslim edilecek dosya biçimini, düzeltme sayısını ve telaffuzu önemli kelimeleri baştan paylaş. Kaydın nerede ve ne kadar süre kullanılacağı (ör. internet, televizyon, radyo) ücreti etkileyebilir; kullanım haklarını yazılı konuş.",
    ],
  },
};

export function getCategoryLongIntro(slug) {
  return CATEGORY_INTROS[slug] || null;
}

// Kategori + şehir sayfaları için (2026-10-29): yalnızca arzın gerçekten dolu olduğu kombinasyonlar. Örnek alanlar
// o sayfadaki gerçek vitrinlerden; rakam ve garanti yok. SSS, sayfanın genel SSS'sine eklenir (FAQPage şeması dahil).
const CATEGORY_CITY_INTROS = {
  "ogretmen/istanbul": {
    heading: "İstanbul'da özel ders öğretmeni seçerken",
    paragraphs: [
      "Bu sayfada İstanbul'da yüz yüze ders veren öğretmenlerin vitrinlerini bulursun: matematik ve fen, LGS'ye yönelik Türkçe ve genel hazırlık, liselere hazırlık koçluğu ve İngilizce gibi alanlarda. Bazı öğretmenler belirli ilçelerde ders verir; ilçe, ulaşım ve dersin nerede yapılacağı vitrinde ya da ilk mesajda netleşir. Online ders arıyorsan özel ders öğretmenleri kategorisinin tamamına bakabilirsin.",
      "İlk mesajında öğrencinin sınıfını, zorlandığı konuları, haftada kaç ders düşündüğünü ve dersin evde mi başka bir yerde mi yapılacağını yaz; öğretmen buna göre uygunluğunu ve ders planını söyler. Birkaç öğretmene yazıp yanıtlarını karşılaştırmak hem uyumu hem de ders saatlerini görmeyi kolaylaştırır. Ücret ve ödeme öğretmenle aranızda kararlaştırılır.",
    ],
    faq: [
      {
        q: "İlk özel derste ne yapılır?",
        a: "İlk dersi tanışma ve seviye belirleme dersi olarak planlamak işe yarar: öğrencinin eksik konuları, hedefi (ör. LGS) ve çalışma düzeni konuşulur, sonraki derslerin planı buna göre yapılır. Bunu ilk mesajda öğretmene sorabilirsin.",
      },
      {
        q: "Öğretmene ilk mesajda ne yazmalıyım?",
        a: "Öğrencinin sınıfını, ders almak istediği konuyu, hedefini, haftalık ders sayısını, uygun gün ve saatleri ve dersin İstanbul'un hangi ilçesinde yapılacağını yazman, öğretmenin hızlı ve net yanıt vermesini sağlar.",
      },
    ],
  },
};

export function getCategoryCityLongIntro(slug, citySlug) {
  return CATEGORY_CITY_INTROS[`${slug}/${citySlug}`] || null;
}
