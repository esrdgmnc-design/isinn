# Code G rehber serisi — plan ve ilk 3 taslak (2026-11-13, ONAY BEKLİYOR)

Amaç: Alıcıya yakın aramalarda (model kodu, uygulama, sertifika) Code G'yi bulunur kılmak; savunma ve hidrojen mühendislerine teknik yetkinlik göstermek.
Kurallar: marka adı yok (seri numaraları sitede zaten kullanılıyor), "yetkili satıcı/distribütör" yok, fiyat yok, uydurma vaka yok, yalnızca katalog verisi + genel mühendislik bilgisi. Her yazı "Teklif için gereken bilgiler" yazısına ve ilgili ürün sayfasına bağlanır.

## Seri planı

### A. Hidrojen serisi (öncelik 1)
Yayında: hidrojen merkezi (501), araçlar (525), dolum istasyonu (526), gevrekleşme (527), yakıt hücresi test tezgâhı (528).
Yeni:
1. **Hidrojen basınç düşürme paneli nedir?** (taslak aşağıda — A1)
2. 350 bar ve 700 bar: hidrojen tank basınçları ve regülatör seçimine etkisi
3. Hidrojen hattında filtre: neden regülatörden önce gelir?
4. Hidrojen sisteminde uzaktan kapatma: solenoid vana ile regülatör birlikte nasıl çalışır?
5. Elektronik (elektropnömatik) basınç kontrolü nedir, hidrojen testlerinde ne zaman gerekir?

### B. Savunma ve havacılık serisi (öncelik 2 — teknik yetkinlik)
1. **Yer destek ekipmanlarında (GSE) yüksek basınç azot regülasyonu** (taslak aşağıda — B1)
2. Oksijen servisi için temizlik: CGA 4.1 ve ASTM G93 ne anlatır?
3. Tasarım kanıt (proof) basıncı, patlama basıncı ve çalışma basıncı farkı
4. Piston algılamalı ve diyafram algılamalı regülatör: hangisi ne zaman?
5. Tahliyeli (venting) ve tahliyesiz regülatör farkı
6. Savunma tedarikinde belgeler: 3.1 malzeme sertifikası, uygunluk belgesi (CoC), PMI, menşe (mevcut /tedarik-ve-belgeler/ sayfasına bağlanır)
7. Askerî dalış ve yaşam destek sistemlerinde yüksek basınç regülasyonu (44-4000 verisiyle)

### C. Model kodu ve bakım serisi (alıcı niyeti en yüksek)
1. **Basınç regülatörü model kodu nasıl okunur? 44-1100 örneği** (taslak aşağıda — C1)
2. Aynı yazı biçiminde: 26-1700, 20-1200, 54-2200, 44-4000 model kodları
3. Regülatör bakımı: hangi parçalar aşınır, tamir kiti ne zaman gerekir?
4. Regülatör çıkış basıncı yavaşça yükseliyor (creep): nedenleri ve kontrol listesi
5. Contalar (O-ring) için malzeme seçimi: Buna-N, Viton, üretan (CO₂)
6. **Regülatör debi grafiği (akış eğrisi) nasıl okunur?** (taslak aşağıda — C6)

---

# C1 — Basınç Regülatörü Model Kodu Nasıl Okunur? 44-1100 Örneği

- **Önerilen adres:** /basinc-regulatoru-model-kodu-nasil-okunur/
- **Yoast başlığı:** Regülatör Model Kodu Nasıl Okunur? 44-1100 Örneği | Code G
- **Meta açıklama:** 44-1166-24 ne anlama gelir? Yüksek basınç regülatörü model kodundaki gövde malzemesi, çıkış basıncı aralığı, bağlantı ve seçenek hanelerini örnekle okuyun.
- **İç bağlantılar:** /products/44-1100/ (seri sayfası; gerçek slug kontrol edilecek) · /basinc-regulatoru-teklif-icin-gereken-bilgiler/ · /tedarik-ve-belgeler/ · /kataloglar-ve-teknik-dokumanlar/

---

Elinizdeki regülatörün yenisini ya da yedeğini bulmak istediğinizde en değerli bilgi, gövde veya etiket üzerindeki model kodudur. Bu kod rastgele bir seri numarası değildir; regülatörün malzemesini, çıkış basıncı aralığını, bağlantısını ve varsa özel seçeneklerini tek satırda anlatır. Bu yazıda 44-1100 serisi üzerinden bir model kodunu hane hane okuyoruz.

## 44-1100 serisi kısaca

44-1100 serisi, yüksek basınçlı ve düşük debili uygulamalar için tasarlanmış, piston algılamalı ve tahliyeli (venting) bir basınç düşürücü regülatördür.

- **En yüksek giriş basıncı:** paslanmaz çelik gövdede 690 bar, pirinç gövdede 414 bar
- **Çıkış basıncı aralıkları:** 0–34,5 / 0–55,2 / 0,69–103 / 1,0–172 / 1,7–276 / 3,4–414 bar
- **Debi katsayısı:** Cv = 0,06
- **Çalışma sıcaklığı:** −40 °C ile 75 °C arası
- **Sızdırmazlık:** kabarcık sızdırmaz (bubble-tight)
- **Temizlik:** CGA 4.1 ve ASTM G93

Tipik kullanım alanları yer destek ekipmanları, uçak şarj arabaları, basınç panelleri, Ar-Ge laboratuvarları ve kalibrasyon donanımlarıdır.

## Model kodunun yapısı

44-1100 serisinde bir model kodu şu parçalardan oluşur:

**44-11 | A | B – C | D | (seçenek)**

| Hane | Ne anlatır? | Değerler |
|---|---|---|
| 44-11 | Temel seri | 44-1100 serisi |
| A | Gövde malzemesi | 1 = Pirinç (en fazla 414 bar giriş) · 2 = 303 paslanmaz çelik (en fazla 690 bar giriş) · 6 = 316 paslanmaz çelik (en fazla 690 bar giriş) |
| B | Çıkış basıncı aralığı | 1 = 0–34,5 bar · 2 = 0–55,2 bar · 3 = 0,69–103 bar · 4 = 1,0–172 bar · 5 = 1,7–276 bar · 6 = 3,4–414 bar |
| C | Bağlantı tipi | 2 = NPTF (dişi konik boru dişi) |
| D | Bağlantı ölçüsü | 4 = 1/4" |
| Seçenek | Özel değişiklik | boş = yok · -001 = tahliyesiz, Viton conta · -002 = tahliyesiz, filtresiz · -150 = üretan conta (CO₂ servisi) |

## Örnek 1: 44-1166-24

- **44-11:** 44-1100 serisi
- **6:** 316 paslanmaz çelik gövde (690 bara kadar giriş)
- **6:** çıkış basıncı aralığı 3,4–414 bar
- **2:** NPTF bağlantı
- **4:** 1/4" bağlantı ölçüsü
- Seçenek eki yok: standart, tahliyeli model

Yani bu regülatör, 690 bara kadar bir kaynaktan gelen gazı 3,4–414 bar arasında ayarlanabilen bir çıkış basıncına düşüren, 316 paslanmaz çelik gövdeli bir modeldir.

## Örnek 2: 44-1115-24

- **1:** pirinç gövde (en fazla 414 bar giriş)
- **5:** çıkış basıncı aralığı 1,7–276 bar
- **24:** 1/4" NPTF bağlantı

Aynı seri, aynı bağlantı; ancak malzeme ve basınç aralığı farklı. İki kod arasındaki tek bir hane farkı, regülatörün bağlanabileceği en yüksek giriş basıncını 690 bardan 414 bara indirir. Bu yüzden yedek alırken kodun tamamını vermek önemlidir.

## Seçenek eki neden önemli?

Kodun sonundaki ek çoğu zaman gözden kaçar ama uygulamayı doğrudan etkiler:

- **-001 / -002 (tahliyesiz):** Standart model, çıkış basıncı düşürüldüğünde fazla gazı ortama tahliye eder. Tahliyesiz modeller bunu yapmaz. Yanıcı ya da tehlikeli gazlarda tahliyenin nereye yapılacağı tasarım sırasında düşünülmelidir.
- **-150 (üretan conta):** CO₂ servisi için. Standart Buna-N conta yerine üretan kullanılır.

Eki olan bir regülatörü eksiz bir modelle değiştirmek, sistemin davranışını değiştirebilir.

## Kod okunamıyorsa ne yapmalı?

Etiket silinmiş ya da kod eksikse, doğru regülatörü bulmak için şu bilgiler genellikle yeterlidir:

1. Akışkan (azot, hava, hidrojen, oksijen, CO₂…)
2. En yüksek giriş basıncı
3. İstenen çıkış basıncı aralığı
4. Gereken debi
5. Bağlantı tipi ve ölçüsü
6. Gövde malzemesi (pirinç / paslanmaz) ve varsa temizlik gereksinimi

Ayrıntılı liste için: [Basınç regülatörü teklifi için gereken bilgiler](/basinc-regulatoru-teklif-icin-gereken-bilgiler/).

## Teklif ve teknik destek

Model kodunu ya da yukarıdaki bilgileri bize iletirseniz uygun regülatörü, gerekiyorsa yedek parça ve belgeleriyle birlikte tekliflendiririz. Seri veri sayfasını [Kataloglar ve Teknik Dokümanlar](/kataloglar-ve-teknik-dokumanlar/) sayfasından indirebilirsiniz.

[Teklif iste →](/contact/)

---

# B1 — Yer Destek Ekipmanlarında (GSE) Yüksek Basınç Azot Regülasyonu

- **Önerilen adres:** /yer-destek-ekipmanlarinda-yuksek-basinc-azot-regulasyonu/
- **Yoast başlığı:** Yer Destek Ekipmanlarında (GSE) Yüksek Basınç Azot Regülasyonu | Code G
- **Meta açıklama:** Azot şarj arabaları ve yer destek ekipmanlarında regülatör seçimi: giriş basıncı, piston algılama, tahliye, temizlik ve kanıt basıncı neden önemlidir?
- **İç bağlantılar:** /basinc-regulatoru-model-kodu-nasil-okunur/ · /tek-kademeli-ve-iki-kademeli-regulator-farki/ · /basinc-regulatoru-ile-emniyet-ventili-farki/ · /tedarik-ve-belgeler/

---

Havacılıkta yer destek ekipmanları (GSE), uçak ve helikopterlerin bakımında kullanılan yüksek basınçlı gazı sağlar. Lastikler, iniş takımı amortisörleri ve hidrolik akümülatörlerin ön dolumu gibi işlerde genellikle kuru azot kullanılır. Azot, yüksek basınçlı tüplerden ya da tüp demetlerinden gelir; bakım yapılan bileşen ise çok daha düşük ve hassas bir basınç ister. Bu farkı güvenli şekilde kapatan bileşen basınç regülatörüdür.

## Azot şarj arabası nasıl çalışır?

Tipik bir azot şarj arabasında akış şöyledir:

1. **Kaynak:** yüksek basınçlı azot tüpü veya tüp demeti
2. **Basınç düşürme:** bir veya iki kademeli regülatör
3. **Ölçüm ve kontrol:** manometreler, gerekirse ince ayar vanası
4. **Koruma:** aşırı basınca karşı emniyet ventili
5. **Bağlantı:** bakım yapılan bileşene giden hortum ve uç

Burada regülatörden beklenen iki şey vardır: tüp basıncı düştükçe çıkışı sabit tutmak ve operatörün istediği değeri hassas şekilde ayarlayabilmesi.

## Regülatör seçerken dikkat edilecekler

**1. Giriş basıncı ve gövde malzemesi**
Kaynak basıncı, regülatörün izin verilen en yüksek giriş basıncının altında olmalıdır. Örneğin 44-1100 serisinde paslanmaz çelik gövde 690 bara, pirinç gövde 414 bara kadar giriş kabul eder. Yüksek basınçlı tüp demetlerinde paslanmaz gövde tercih edilir.

**2. Çıkış basıncı aralığı**
Çıkış aralığı, ihtiyaç duyulan değeri ortada kalacak şekilde seçilmelidir. Aralığın en altında veya en üstünde çalışmak hassasiyeti düşürür. Bu nedenle aynı seride birden fazla çıkış aralığı bulunur.

**3. Piston algılama**
Çok yüksek basınçlarda piston algılamalı regülatörler, diyaframlı tasarımlara göre daha dayanıklı ve güvenli bir çözümdür. Hassasiyetten bir miktar ödün verilir, ama yüzlerce barlık basınçlarda dayanım önceliklidir.

**4. Tahliye (venting)**
Operatör çıkış basıncını düşürdüğünde, tahliyeli regülatör hattaki fazla gazı boşaltır ve çıkış yeni değere iner. Tahliyesiz bir regülatörde ise basınç hatta hapsolur. GSE uygulamalarında tahliyeli modeller, ayarın hızlı ve güvenli değiştirilmesini sağlar.

**5. Düşük ayar torku ve büyük el topuzu**
Saha koşullarında, eldivenle çalışan bir teknisyenin ayarı kolayca yapabilmesi önemlidir. Düşük çalıştırma torku ve büyük el topuzu bu yüzden bir konfor değil, güvenlik konusudur.

**6. Sıcaklık aralığı**
Ekipman apronda kışın dondurucu soğukta, yazın güneş altında çalışır. Regülatörün çalışma sıcaklığı aralığı (örneğin −40 °C ile 75 °C) saha koşullarını karşılamalıdır.

## Temizlik ve kanıt basıncı

**Temizlik:** Aynı arabada oksijen de kullanılabiliyorsa ya da müşteri şartnamesi istiyorsa, regülatörün CGA 4.1 ve ASTM G93 gibi temizlik standartlarına göre temizlenmiş olması gerekir. Yağ ve partikül kalıntısı, yüksek basınçlı oksijende tutuşma riski yaratır.

**Kanıt (proof) basıncı:** Tasarım kanıt basıncı, regülatörün kalıcı hasar görmeden dayanabildiği test basıncıdır. 44-1100 serisinde bu değer, en yüksek giriş basıncının %150'sidir. Bu değer bir çalışma basıncı değildir; güvenlik payını gösterir.

## Bakım ve sökülebilir valf modülü

Sahada çalışan ekipmanda arıza süresi önemlidir. Valf grubunun bir modül hâlinde sökülebildiği tasarımlar, onarımın regülatörü tamamen sökmeden yapılmasını sağlar. Ayrıca regülatörden önce bir filtre kullanmak, valf oturma yüzeyine partikül girmesini ve sızıntıyı önler.

## Belgeler

Savunma ve havacılık tedarikinde regülatörle birlikte genellikle malzeme sertifikası (3.1), uygunluk belgesi ve temizlik beyanı istenir. Hangi belgelerin sağlanabildiğini [Tedarik ve Belgeler](/tedarik-ve-belgeler/) sayfasında anlattık.

## Teknik destek

Yer destek ekipmanı, test standı ya da basınç paneli için regülatör seçiminde akışkan, giriş ve çıkış basıncı, debi ve bağlantı bilgilerini paylaşırsanız uygun seriyi birlikte belirleyebiliriz.

[Teklif iste →](/contact/)

---

# A1 — Hidrojen Basınç Düşürme Paneli Nedir? Araç ve Otobüs Uygulamaları

- **Önerilen adres:** /hidrojen-basinc-dusurme-paneli/
- **Yoast başlığı:** Hidrojen Basınç Düşürme Paneli Nedir? Bileşenler ve Tasarım | Code G
- **Meta açıklama:** Hidrojenli otobüs ve araçlarda basınç düşürme paneli: ön filtre, regülatör, solenoid vana, test basıncı ve panel için regülatör seçimi.
- **İç bağlantılar:** /hidrojen-basinc-regulatorleri/ · /hidrojenli-araclarda-basinc-regulatoru/ · /hidrojen-gevreklesmesi-ve-malzeme-secimi/ · /basinc-regulatoru-ile-emniyet-ventili-farki/ · /tedarik-ve-belgeler/

---

Hidrojenli otobüs, kamyon ve araçlarda yakıt, yüksek basınçlı tüplerde taşınır. Yakıt hücresi ya da motor ise hidrojeni çok daha düşük ve sabit bir basınçta ister. Tüpler ile yakıt hücresi arasında basıncı düşüren, filtreleyen ve gerektiğinde akışı uzaktan kesen bileşenler çoğu zaman tek bir panelde toplanır. Bu panele **basınç düşürme paneli** (let-down panel) denir.

## Panelde neler bulunur?

**1. Ön filtre**
Tüpten ve dolum hattından gelebilecek partiküller, regülatörün valf oturma yüzeyine zarar verip sızıntıya yol açabilir. Bu yüzden filtre her zaman regülatörden önce gelir.

**2. Basınç regülatörü**
Panelin kalbidir. Tüp basıncını yakıt sisteminin istediği seviyeye düşürür ve tüp boşaldıkça çıkışı sabit tutar. Basınç farkı büyükse iki kademeli düşürme tercih edilir. (Bkz. [Hidrojenli araçlarda basınç regülatörü](/hidrojenli-araclarda-basinc-regulatoru/).)

**3. Solenoid vanalar**
Aracın bilgisayarı ya da sürücü, bir arıza veya kaza durumunda hidrojen akışını uzaktan kesebilmelidir. Solenoid vanalar bu kapatma görevini üstlenir. Panel hem elle hem de araç bilgisayarından kontrol edilebilecek şekilde tasarlanabilir.

**4. Manometre ve basınç transmitterleri**
Basıncın hem yerinde okunması hem de araç bilgisayarına aktarılması için kullanılır.

**5. Emniyet elemanları**
Regülatör arızalanırsa aşağı akıştaki düşük basınçlı bileşenleri korumak için emniyet ventili veya basınç tahliye elemanı gerekir. (Bkz. [Basınç regülatörü ile emniyet ventili farkı](/basinc-regulatoru-ile-emniyet-ventili-farki/).)

## Çalışma basıncı ve test basıncı

Panel, çalışma basıncının üzerinde bir test basıncında denenir. Örneğin çalışma basıncı 300 bara kadar olan bir panel, yaklaşık 415 bar test basıncıyla tasarlanabilir. Test basıncı, panelin güvenlik payını gösterir; panel o basınçta sürekli çalıştırılmaz.

## Tasarımda nelere dikkat edilir?

**Yer:** Otobüslerde panel genellikle tüplere yakın, çoğu zaman tavandaki motor bölmesinde ya da tüp grubunun yanında konumlanır. Mevcut boşluğa sığması, tasarımın ilk kısıtıdır.

**Malzeme:** Hidrojen gevrekleşmesine karşı hidrojen uyumluluğu bilinen malzemeler, örneğin uygun kalitede östenitik paslanmaz çelik, seçilmelidir. (Bkz. [Hidrojen gevrekleşmesi ve malzeme seçimi](/hidrojen-gevreklesmesi-ve-malzeme-secimi/).)

**Sızdırmazlık:** Hidrojen çok küçük bir moleküldür. Bağlantı sayısını azaltmak ve sızdırmazlık elemanlarını hidrojene göre seçmek, panelin en önemli tasarım kararlarındandır.

**Titreşim ve sıcaklık:** Araç üstündeki panel, sürekli titreşim ve geniş sıcaklık aralığına dayanmalıdır.

## Panel için regülatör seçerken hangi bilgiler gerekir?

Panel tasarlayan ekiplerin regülatör seçiminde genellikle şu bilgileri netleştirmesi gerekir:

1. En yüksek tüp (giriş) basıncı
2. İstenen çıkış basıncı ve kabul edilebilir sapma
3. En yüksek debi ihtiyacı
4. Tek mi iki kademeli mi düşürme yapılacağı
5. Çalışma sıcaklığı aralığı
6. Bağlantı tipi ve ölçüsü
7. İstenen belgeler (malzeme sertifikası, test raporu, temizlik beyanı)

## Hazır panel seçeneği

Paneli kendiniz kurmak yerine hazır olarak da tedarik edebilirsiniz. Bu durumda panel, üretici tarafından şu adımlarla hazırlanır:

1. Yerleşim ve basınç gereksinimlerinizin alınması
2. Panelin iki boyutlu tasarımı ve sizin onayınız
3. Bileşen seçimi ve montaj
4. Gönderimden önce dayanım (proof) ve fonksiyon testleri
5. Test raporları ve malzeme belgeleriyle birlikte teslim

## Teknik destek

Hidrojenli araç, otobüs ya da test sistemi için ister yalnızca basınç regülatörü, ister test edilmiş hazır bir panel gereksin; yukarıdaki bilgileri ve yerleşim ölçülerini paylaşırsanız uygun çözümü belgeleriyle birlikte tekliflendirebiliriz.

[Teklif iste →](/contact/)

---

# C6 — Basınç Regülatörü Debi Grafiği (Akış Eğrisi) Nasıl Okunur?

- **Önerilen adres:** /basinc-regulatoru-debi-grafigi-nasil-okunur/
- **Yoast başlığı:** Regülatör Debi Grafiği Nasıl Okunur? Droop, Lock-up, SCFM | Code G
- **Meta açıklama:** Regülatör veri sayfasındaki akış eğrisini adım adım okuyun: ayar basıncı, droop (basınç düşmesi), lock-up, giriş basıncı etkisi ve SCFM–SLPM dönüşümü.
- **İç bağlantılar:** /basinc-regulatoru-model-kodu-nasil-okunur/ · /cv-degeri-nedir-nasil-hesaplanir/ · /tek-kademeli-ve-iki-kademeli-regulator-farki/ · /dom-yuklu-ve-yay-yuklu-regulator-farki/ (gerçek slug kontrol edilecek) · /basinc-regulatoru-teklif-icin-gereken-bilgiler/ · /kataloglar-ve-teknik-dokumanlar/

---

Regülatör veri sayfalarında hemen her zaman bir ya da birkaç grafik bulunur. Bu grafikler, regülatörün katalogdaki "en yüksek basınç" değerlerinden çok daha fazlasını anlatır: debi arttıkça çıkış basıncının ne kadar düştüğünü, akış durduğunda ne olduğunu ve regülatörün uygulamanıza yetip yetmeyeceğini. Bu yazıda bir akış eğrisini adım adım okuyoruz.

## Grafikte ne var?

**Dikey eksen: çıkış basıncı (P2).** Genellikle psig ve köşeli parantez içinde bar olarak verilir.

**Yatay eksen: debi.** Gazlarda çoğunlukla SCFM (dakikada standart fit küp) ve köşeli parantez içinde SLPM (dakikada standart litre) kullanılır. 1 SCFM yaklaşık 28,3 SLPM'dir.

**Grafik başlığındaki bilgiler:**
- **Model numarası:** Grafiğin hangi modele ait olduğu (örneğin 44-1115-24). Aynı seride farklı basınç aralıklarının eğrileri farklıdır.
- **P1 (giriş basıncı):** Ölçümün yapıldığı giriş basıncı. Bir grafikte birden fazla P1 için eğri olabilir.
- **Test gazı:** Eğriler genellikle azotla çizilir.

**Eğriler:** Her eğri, belirli bir ayar basıncı ve giriş basıncı için çıkış basıncının debiyle nasıl değiştiğini gösterir.

## Adım adım okuma

**1. Uygulamanıza en yakın eğriyi bulun.**
Önce giriş basıncınıza (P1), sonra istediğiniz çıkış basıncına en yakın eğriyi seçin.

**2. Eğrinin başlangıç noktası: ayar basıncı.**
Eğri, debinin sıfıra yakın olduğu sol tarafta başlar. Bu nokta, regülatörün ayarlandığı basınçtır.

**3. Eğri sağa doğru iner: droop.**
Debi arttıkça çıkış basıncı ayar değerinin biraz altına iner. Ayar basıncı ile akış sırasındaki basınç arasındaki bu farka **droop** (basınç düşmesi) denir. Örneğin 6,9 bara ayarlanmış bir regülatör, akış başladığında 6,6 bar verebilir. Eğri ne kadar yataysa regülatör o kadar iyi kontrol ediyor demektir.

**4. Eğrinin sert düştüğü yer: kapasite sınırı.**
Belirli bir debiden sonra eğri hızla aşağı kıvrılır. Bu bölge, regülatörün o koşullarda verebileceği debinin sınırına geldiğini gösterir. Uygulamanızın gerektirdiği debi, eğrinin bu sert düşüş bölgesinden belirgin şekilde solda kalmalıdır.

**5. İhtiyacınız olan debide basıncı okuyun.**
Yatay eksende gereken debiyi bulun, yukarı çıkıp eğriyle kesiştiği noktadan sola giderek çıkış basıncını okuyun. Bu değer, sisteminizin akış sırasında göreceği gerçek basınçtır. Sisteminiz için kabul edilebilir mi, buna göre karar verin.

## Grafikte görünmeyen iki kavram

**Lock-up (kilitlenme basıncı).**
Akış durduğunda regülatör valfi kapanır; ancak kapanırken çıkış basıncı ayar değerinin biraz üzerine çıkar. Örneğin 6,9 bara ayarlı bir regülatörde çıkış, akış kesildiğinde 7,1 bara yükselebilir. Bu fark, aşağı akıştaki hassas bileşenler için hesaba katılmalıdır.

**Giriş basıncı etkisi (supply pressure effect).**
Tüp boşaldıkça giriş basıncı düşer. Dengelenmemiş (unbalanced) valf yapısındaki regülatörlerde bu değişim çıkış basıncını da etkiler. Grafikte farklı P1 değerleri için çizilmiş eğrileri karşılaştırarak bu etkiyi görebilirsiniz. Tüp basıncının geniş aralıkta değiştiği uygulamalarda iki kademeli regülatör bu etkiyi büyük ölçüde azaltır. (Bkz. [Tek ve iki kademeli regülatör farkı](/tek-kademeli-ve-iki-kademeli-regulator-farki/).)

## Azot dışındaki gazlar için

Eğriler azotla çizildiği için başka bir gazda debi farklı olur. Yaklaşık bir dönüşüm için, gazlarda debi gazın özgül ağırlığının kareköküyle ters orantılı kabul edilir:

**Q(gaz) ≈ Q(azot) × √(SG azot / SG gaz)**

Havaya göre özgül ağırlık azotta yaklaşık 0,97, hidrojende yaklaşık 0,07'dir. Bu yüzden aynı koşullarda hidrojen debisi, azot debisinin yaklaşık 3,7 katı çıkar. Bu bir ön seçim hesabıdır; kesin seçim için uygulama koşullarıyla birlikte değerlendirme yapılmalıdır. Debi katsayısı ile hesap için: [Cv değeri nedir, nasıl hesaplanır?](/cv-degeri-nedir-nasil-hesaplanir/)

## Sık yapılan hatalar

- **Yalnızca en yüksek basınca bakmak:** Katalogda 690 bar yazması, regülatörün sizin debinizde istediğiniz basıncı vereceği anlamına gelmez.
- **Yanlış eğriyi okumak:** Farklı giriş basınçları veya farklı modeller için çizilmiş eğriler birbirine karıştırılmamalıdır.
- **Kapasite sınırına çok yakın seçim:** Eğrinin sert düştüğü bölgede çalışan bir regülatör, küçük debi artışlarında basıncı tutamaz.
- **Gaz farkını hesaba katmamak:** Azot eğrisini doğrudan hidrojen ya da helyum için kullanmak hatalı sonuç verir.

## Teknik destek

Veri sayfalarını [Kataloglar ve Teknik Dokümanlar](/kataloglar-ve-teknik-dokumanlar/) sayfasından indirebilirsiniz. Akışkan, giriş ve çıkış basıncı ile gereken debiyi paylaşırsanız grafikleri sizin için yorumlayıp uygun regülatörü birlikte belirleyebiliriz.

[Teklif iste →](/contact/)
