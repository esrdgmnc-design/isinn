# Taranmış plandan CAD dosyası aracı — detaylı plan (3 Kasım 2026)

Kaynak: iki uzman ajan (pazar araştırması + yapay zekâ mühendisi), web kontrollü. "(tahmin)" ve "doğrulanmadı" işaretleri korunmuştur.

## 1. Ürün tek cümlede
Taranmış ya da fotoğrafı çekilmiş kat planını (PDF/JPG/PNG/TIFF) yükle; 60 saniyede **ölçekli, katmanlı (duvar / kapı-pencere / yazı / ölçü), düzenlenebilir DXF** indir. AutoCAD, BricsCAD, LibreCAD doğrudan açar. DWG çıktısı, ödeyen kullanıcı çıkınca eklenir.

**İlk hedef kitle:** Tadilat ve iç mimarlık firmaları, müteahhitler, emlak/tesis yönetimi (eski kâğıt planlardan mevcut durum çizimi).

**Kapsam dışı (baştan reddedilir):** Elle çizilmiş eskizler, açılı ve gölgeli fotoğraflar, yoğun uygulama projeleri, kesit/görünüş, makine parçası ve CNC (ikinci aşamaya kalabilir).

## 2. Avantajlar
1. **Gerçek ve ölçülebilir talep.** "pdf to dwg" ayda yaklaşık 27 bin arama alıyor (Semrush). Tüm küme dil varyantlarıyla ayda 80-150 bin (tahmin).
2. **Büyük fiyat farkı.**
   - Bugün elle yeniden çizim pafta başına 40-200 $, Hindistan'a dış kaynakta 10-40 $, 1-3 gün bekleme.
   - Scan2CAD ayda 89 $.
   - Bizim fiyatımız pafta başına 9 $ ya da ayda 29 $ (40 pafta).
3. **Global ve dilden bağımsız.** Plan bir çizim; çıktı her ülkede aynı.
4. **Satış gerektirmez.** Kullanıcı arayarak bulur, ilk paftayı ücretsiz dener, kendisi öder.
5. **Mevcut çözümler kötü.**
   - AutoCAD'in kendi aracı yalnızca vektör PDF'i açar, taranmış PDF resim olarak kalır.
   - Genel çeviriciler ölçek ve katman vermez.
   - Forumlarda yaygın görüş: "taranmışı baştan çizmek daha hızlı."
6. **Düşük işletme maliyeti.** Dönüşüm başına yaklaşık 0,02-0,06 $. Sadece CPU yeterli, sunucu ayda 10-40 $.
7. **Makine öğrenmesi araştırmacısı gerekmez.** Klasik görüntü işleme, hazır OCR ve küçük bir kapı/pencere modeli yeterli.
8. **Kalıcı avantaj birikir.** Kullanıcıların editördeki düzeltmeleri zamanla en değerli eğitim verisine dönüşür.
9. **Yatırımcı hikâyesi var.** İnşaat ve gayrimenkul çizimlerinin dijitalleşmesi para çeken bir alan (ör. Mach9 34 M$ aldı; o LiDAR'dan çiziyor, kâğıttan değil).

## 3. Dezavantajlar ve riskler
| Risk | Etkisi | Önlem |
|---|---|---|
| "pdf to dwg" aramalarının çoğu **vektör PDF** için ve o iş bedava çözülüyor; gerçek taranmış dosya talebi trafiğin %20-35'i (tahmin) | Trafik beklenenden az olur | Vektör PDF'i de ücretsiz çevir (trafiği yakala), parayı taranmış dosyadan al |
| **Kalite beklentisi**: kullanıcı "tek tıkla mükemmel" bekler | İade, kötü yorum | Ürünün kalbi tarayıcıdaki düzeltme editörü (alta orijinal, üste vektör, şüpheli çizgiler kırmızı); "taslak" etiketi |
| **Yeni yapay zekâ rakipleri** (FloorAI, Archivinci, Maket.ai, SUAPP) | Pencere daralıyor | Fark ölçek doğruluğu + katmanlar + kapalı duvar çizgileri (alan hesabı) ile kazanılmalı; önce rakiplere aynı 5 planı yükleyip açığı ölç |
| **DWG lisansı**: ODA ücretsiz sürümü ticari kullanıma kapalı, ücretli üyelik yıllık binlerce $; LibreDWG'nin DWG yazması deneysel | Bozuk dosya ya da hukuki sorun | v1'de yalnızca DXF; DWG talep kanıtlanınca Autodesk'in bulut servisiyle (kullandıkça öde) |
| **Ölçek hatası** sessizce tüm çizimi bozar | Usta yanlış malzeme alır | Ölçek kalibrasyonu zorunlu adım (bilinen bir uzunluk girilir), DXF'e birim yazılır, "kontrol et" uyarısı |
| **Yeni teknik yığın**: OpenCV/Python, Vercel'de rahat çalışmaz | Kurulum yükü | Ayrı Python işçisi (FastAPI + Docker; Hetzner/Fly.io/Railway), kuyruk ve dosyalar Supabase'te |
| **Gizlilik**: projelerde ada/parsel ve adres var (KVKK/GDPR) | Hukuki risk | Dosyalar 24 saatte silinir, yapay zekâya yalnızca kırpılmış görsel gider, gizlilik metni |
| **SEO yavaş**: yeni alan adı aylarca az trafik alır | İlk 3 ay düşük gelir | Format başına açılış sayfaları (jpg/png/pdf/tiff → dxf/dwg), önce/sonra galerisi, CAD forumlarında gerçek yardım cevapları |
| **Kendiliğinden yayılma zayıf**: profesyoneller çıktıyı paylaşmaz | Büyüme sadece aramaya bağlı | Ücretsiz çıktıda küçük "made with" notu; ekip içi paylaşım bağlantısı |
| **Ödeme altyapısı**: Stripe Türkiye'deki şirketlere açık değil (doğrulanmalı) | Yurt dışından tahsilat zor | Paddle ya da Lemon Squeezy gibi "kayıtlı satıcı" hizmetleri (Türkiye uygunluğu doğrulanmalı) |
| **Alan bilgisi**: kurucu CAD kullanıcısı değil | Kalite testi zor | Test için bir mimar/çizer danışman (5 gerçek kullanıcıyla düzeltme süresi ölçülmeli) |
| **Kapsam kayması**: eskiz, fotoğraf ve CNC talepleri gelir | Kalite düşer | Baştan net "yalnızca taranmış plan" çerçevesi |

## 4. Aşamalı plan

### Aşama 0 — Doğrulama (2-3 gün, ücretsiz)
- Google Keyword Planner'da 7 sorgunun gerçek hacmi: pdf to dwg, jpg to dwg, image to dxf, png to dxf, pdf to dxf online, floor plan to cad, scanned drawing to autocad. (Kurucunun Google Ads hesabı gerekir.)
- Kamuya açık 5 taranmış plan, FloorAI, Archivinci ve Scan2CAD denemesine yüklenir; çıktılar karşılaştırılır.
- **Karar:** Rakipler zaten iyi sonuç veriyorsa dur.

### Aşama 1 — Yapılabilirlik testi (2 hafta)
- **Hafta 1:**
  - Ön işleme (eğiklik, gürültü, eşikleme).
  - Orta hat çıkarma (iskeletleştirme), düzeltme (0/90°'ye çekme, uç kaynatma).
  - ezdxf ile DXF.
  - Sentetik veride ölçüm (FloorPlanCAD, CubiCasa5k, ROBIN; açık DXF'ler bozularak test verisi üretilir).
- **Hafta 2:**
  - 30-50 gerçek belediye proje taraması.
  - OCR (PaddleOCR) ve ölçek.
  - Üst üste bindirerek inceleme.
  - 5 gerçek kullanıcıyla düzeltme süresi ölçümü.
- **Geçme eşikleri:**
  - Gerçek taramada çizgi bulma ≥ %80.
  - Sahte çizgi ≤ %10.
  - Ölçek hatası ±%1 (kalibrasyonla).
  - Ölçü OCR ≥ %90.
  - Kapı/pencere tespiti mAP50 ≥ 0,8.
  - Düzeltme süresi < 5 dk/pafta.
- **Durma kuralı:** Çizgi bulma < %75 ya da düzeltme > 10 dk ise dur.

### Aşama 2 — Ürün (4 hafta)
- Yükleme, işleme kuyruğu ve ilerleme göstergesi.
- Tarayıcı editörü (Konva/Fabric): çizgi sil/ekle/sürükle, katman değiştir, ölçek kalibre et.
- DXF dışa aktarma (katmanlı, birimli).
- Hesap, kredi ve ödeme.
- İlk pafta kayıtsız ve ücretsiz (önizleme ya da filigran).
- Arayüz **İngilizce öncelikli**, sonra diğer diller. (Ajanın önerdiği "Türkçe arayüz farkı" global hedefle çeliştiği için alınmadı.)

### Aşama 3 — Yayın (2 hafta)
- Format başına açılış sayfaları ve önce/sonra galerisi.
- Product Hunt.
- CAD forumlarında ve r/AutoCAD'de gerçek yardım cevapları.
- Ölçüm: ziyaret → ücretsiz dönüşüm → ödeme hunisi.

## 5. Fiyat
- İlk pafta ücretsiz.
- Tek pafta 9 $; 10 pafta 49 $; aylık 29 $ (40 pafta).
- İsteğe bağlı "insan kontrolü" 25-35 $. Bu Fiverr'ın altında; ileride bir çizer ağıyla verilebilir.

## 6. 90 gün hedefleri ve durma kuralları
- **Organik trafik:** 3. ayda ayda 1.500-4.000 ziyaret.
- **Ücretsiz dönüşüm:** ziyaretçilerin %8-12'si, ayda 150-400.
- **Ödeyen kullanıcı:** 3. ay sonunda 15-40 kişi, aylık 300-1.200 $ gelir.
- **Durma kuralları:**
  - Ücretsiz çıktıların %50'sinden fazlası "kullanılamaz" geri bildirimi alırsa önce kaliteye dön.
  - 90. günde 15 ödeyenin altında kalınırsa yeniden değerlendir.

## 7. Maliyet tahmini (ilk 3 ay)
- **Sunucu:** ayda 10-40 $.
- **Alan adı:** ~15 $/yıl.
- **Model eğitimi:** kiralık GPU, birkaç saat, < 20 $.
- **Dönüşüm başına:** 0,02-0,06 $.
- **DWG (sonra):** Autodesk bulut servisi kullandıkça öde.
- **ODA üyeliği:** yıllık binlerce $; şimdilik gerek yok.

## 8. Kurucunun kararları
1. Aşama 0'ı başlatmak (Keyword Planner için Google Ads hesabına giriş kurucuda).
2. Ürün adı ve alan adı.
3. Test için bir mimar/çizer danışman.
4. İşinn ile zaman paylaşımı (haftada kaç gün).
5. Ödeme altyapısı (Paddle / Lemon Squeezy; Türkiye uygunluğu kontrol edilecek).

## Kaynaklar
- [Semrush – pdf to dwg](https://zh.semrush.com/website/cadsofttools.com/overview)
- [Autodesk forum – PDFIMPORT yalnızca vektör](https://forums.autodesk.com/t5/autocad-forum/convert-pdf-to-cad/m-p/7651579)
- [Fiverr örnek](https://fiverr.com/dilmina_sampath/redraw-pdf-hand-sketch-or-image-into-autocad-dwg)
- [cadmore – CAD dönüşüm maliyeti](https://cadmore.com/blog/cad-conversion-cost)
- [IndiaMART](https://m.indiamart.com/impcat/cad-conversion.html)
- [Scan2CAD fiyat](https://www.scan2cad.com/pricing/)
- [Autodesk Raster Design](https://www-int.autodesk.com/eu/products/autocad/included-toolsets/autocad-raster-design)
- [ZWVectorization](https://www.zwsoft.com/product/application/zwsoft-developed/zwvectorization-tool)
- [CADTutor](https://www.cadtutor.net/forum/topic/30900-to-convert-pdf-to-dwg/)
- [sourcecad](https://sourcecad.com/blog/pdf-to-dwg/)
- [FloorAI](https://hunted.space/product/floorai)
- [Archivinci](https://www.archivinci.com/floor-plan-maker)
- [Maket](https://maket.ai/post/ai-floorplan-recognizer-upload-an-existing-plan-get-right-to-editing)
- [SUAPP](https://suapp.ai/blog/article-43-1.html)
- [SketchDXF](https://sketch-to-cad.onrender.com/support)
- [Mach9](https://app.dealroom.co/news/note/mach9-raises-34m-for-ai-drafting-software-after-pivot-from-mapping)
- [DII](https://bouncewatch.com/company/dii)
