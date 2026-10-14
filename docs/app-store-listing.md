# İşinn — App Store Connect listeleme bilgileri

Bu dosya App Store Connect'e elle girilecek her şeyi tek yerde toplar. Gizli bilgi
(şifre, API anahtarı, demo hesap şifresi) buraya yazılmaz.

## Durum (14.10.2026)

- [x] Uygulama kaydı açıldı (`com.isinn.app`), Codemagic `ios-release` iş akışı kuruldu
- [x] Build 1 (1.0) yüklendi
- [ ] Build 2: Codemagic'te `ios-release` çalıştır. İş akışı derleme numarasını TestFlight'taki son numara + 1
      olarak kendisi verir (projedeki `CURRENT_PROJECT_VERSION = 2` yalnızca yerel Xcode derlemesi için).
- [ ] Apple Developer > Identifiers > `com.isinn.app`: yalnızca **Push Notifications** ve **Associated Domains**
      açık kalsın. "Communication Notifications" gibi kodda karşılığı olmayan yetenekleri kapat; Codemagic profili
      bir sonraki derlemede yeniden üretir.
- [ ] Aşağıdaki metinleri App Store Connect'e gir
- [ ] Ekran görüntüleri (6,9 inç iPhone, aşağıya bak)
- [ ] Demo hesap aç, bilgilerini yalnızca App Review alanına yaz
- [ ] TestFlight'ta build 2'yi iPhone'da dene (giriş, mesaj, bildirim izni, vitrin bağlantısı, hesap silme)
- [ ] "İncelemeye Gönder"

## 1. Uygulama Bilgileri (App Information)

| Alan | Değer |
|---|---|
| Ad (en çok 30) | `İşinn: Hizmet Vitrini` |
| Alt başlık (en çok 30) | `Yakındaki hizmetleri keşfet` |
| Birincil kategori | İş (Business) |
| İkincil kategori | Yaşam Tarzı (Lifestyle) |
| Birincil dil | Türkçe |
| Gizlilik Politikası URL | https://www.isinn.com.tr/gizlilik-politikasi |
| İçerik hakları | Üçüncü taraf içerik: Evet (kullanıcıların yüklediği vitrin fotoğrafları/videoları); haklar kullanım şartlarıyla kullanıcıdan alınır |

## 2. Sürüm sayfası (1.0)

**Tanıtım metni** (en çok 170, sürüm göndermeden de değiştirilebilir):

```
Becerini hizmet vitrinine dönüştür, yakınındaki hizmet verenleri bul. İşinn komisyon almaz; kazandığın işten pay vermezsin.
```

**Açıklama** (en çok 4000):

```
İşinn, becerilerini fark edip bir hizmet vitrinine dönüştürmene ve Türkiye'de yakınındaki ya da uzaktan hizmet verenleri bulmana yardım eden bir hizmet keşif platformudur.

HİZMET ARIYORSAN
• Vitrinleri kategoriye, şehre ve sana yakınlığa göre keşfet
• Fotoğraf, video ve değerlendirmelerle hizmet verenleri tanı
• Doğrudan mesaj at, ihtiyacını anlat
• Hizmet talebi oluştur, sana uygun vitrinler önerilsin
• Aramalarını kaydet, yeni vitrin çıktığında haber al

HİZMET VERİYORSAN
• Yeteneğini Farket aracıyla yazdıklarından hizmet fikirleri ve hazır bir vitrin taslağı al
• Fotoğraflı, videolu vitrinini dakikalar içinde yayınla; şirket kurman gerekmez
• Mesajlara ve sana uygun hizmet taleplerine anında bildirimle dön
• Komisyon yok: kazandığın işten İşinn'e pay vermezsin

GÜVEN VE GÜVENLİK
• "Doğrulandı" rozeti telefon numarasının SMS ile doğrulandığını gösterir
• Rahatsız eden kullanıcıyı engelleyebilir, vitrin, ilan ya da kişiyi tek dokunuşla bildirebilirsin
• Mesaj, vitrin ve ilan metinleri topluluk kurallarına göre otomatik denetlenir
• Hesabını uygulama içinden silebilirsin

İşinn ne yapmaz: ödemeye aracılık etmez, ürün satmaz, işe alım/personel arama sitesi değildir, iş ya da kazanç garantisi vermez.

Bazı özellikler (yazım yardımı, akıllı arama, fotoğraf uygunluk kontrolü) yapay zekâ ile çalışır ve ilk kullanımda onayın istenir.
```

**Anahtar kelimeler** (en çok 100; bu liste 84 karakter / 92 bayt; fiyat çağrıştıran "komisyonsuz" gibi kelimeler kullanılmaz, iki ölçüye de sığar; virgülle, boşluksuz; ad ve alt başlıktaki kelimeleri tekrar etmeye gerek yok):

```
usta,freelance,yerel,ilan,tamir,temizlik,özel ders,fotoğrafçı,danışman,şehir,portföy
```

| Alan | Değer |
|---|---|
| Destek URL | https://www.isinn.com.tr/hakkimizda (sayfanın altında e-posta ve telefon görünür; Apple destek adresinde çalışan bir iletişim yolu ister) |
| Pazarlama URL | https://www.isinn.com.tr |
| Telif hakkı | `2026 Esra Güneş` (bireysel geliştirici hesabı; şirket adı geçmez) |
| Sürüm | 1.0 |

## 3. Ekran görüntüleri

- Büyük iPhone yuvası (6,9 inç): **1320 × 2868, 1290 × 2796 ya da 1260 × 2736** (dikey). Küçük iPhone yuvaları
  bu görüntülerden otomatik ölçeklenir. Uygulama yalnızca iPhone olduğundan iPad görüntüsü gerekmez.
- JPG ya da PNG; şeffaflık (alfa kanalı) olmamalı.
- 1–10 adet (3 ve üzeri önerilir). Önerilen sıra: ana sayfa/keşfet → kategori listesi → vitrin detayı → mesajlaşma →
  Yeteneğini Farket → vitrin oluşturma.
- Görüntüler **iOS uygulamasının kendisinden** alınmalı (Planlar ve satın alma ekranları iOS'ta gizli; web'den
  alınan ekranda fiyat/plan görünürse inceleme 3.1.1'den reddedebilir).
- En kolay yol: Mac'te Xcode Simulator'da "iPhone 16 Pro Max" (ya da 17 Pro Max) ile uygulamayı aç, `Cmd+S`.

## 4. Yaş derecelendirmesi

Anketteki yanıtlar (hepsi "Yok" dışında):

Her soruyu ayrı ve dürüst yanıtla:

- **Kullanıcı tarafından oluşturulan içerik**: Evet (vitrin, yorum, fotoğraf/video)
- **Mesajlaşma ve sohbet**: Evet (kullanıcılar arası mesajlaşma)
- **Sosyal medya**: Hayır (takip/akış yok)
- **Reklam**: Hayır
- **Sınırsız web erişimi**: Hayır (uygulama yalnızca isinn.com.tr'yi açar)
- Şiddet, cinsellik, kumar, alkol/uyuşturucu, korku: Yok
- Anket büyük ihtimalle 4+ hesaplar. Son adımdaki **"Override to Higher Age Rating" (daha yüksek yaşa geçersiz kıl)**
  ile **18+** seç. Kullanım şartları 18 yaş sınırı koyduğu için Apple bunu zorunlu tutuyor.

## 5. Uygulama Gizliliği (App Privacy)

`ios/App/App/PrivacyInfo.xcprivacy` ile birebir aynı olmalı.

- **İzleme (tracking)**: Hayır. Reklam yok, veri satışı yok.
- Toplanan veriler (hepsi **Uygulama İşlevselliği** amacıyla, hiçbiri izleme için değil):

| Veri türü | Kimliğe bağlı mı |
|---|---|
| İletişim Bilgisi > Ad | Evet |
| İletişim Bilgisi > E-posta adresi | Evet |
| İletişim Bilgisi > Telefon numarası | Evet |
| Kullanıcı İçeriği > Fotoğraflar veya Videolar | Evet |
| Kullanıcı İçeriği > Diğer Kullanıcı İçeriği (mesajlar, yorumlar, vitrin metni) | Evet |
| Tanımlayıcılar > Kullanıcı Kimliği | Evet |
| Tanımlayıcılar > Cihaz Kimliği (bildirim anahtarı) | Evet |
| Kullanım Verisi > Ürün Etkileşimi | Evet |
| Arama Geçmişi (kayıtlı aramalar hesaba bağlı) | Evet |

- **Konum: toplanmıyor** (yalnızca cihazda en yakın şehri bulmak için kullanılır, sunucuya gönderilmez; kodda doğrulandı).
- Çökme/teşhis SDK'sı yok, Teşhis bölümü boş kalır.
- Ödeme bilgisi: iOS uygulamasında toplanmıyor (satın alma ekranları gizli).

## 6. App Review bilgileri

- **Giriş gerekli**: Evet. Demo hesabı aç (e-posta + şifre ile; Google girişi iOS'ta gizli olduğu için
  "Apple ile Giriş" zorunluluğu yok). İçinde en az bir yayında vitrin ve bir mesaj konuşması olsun ki
  inceleyen kişi özellikleri görebilsin. Telefon/SMS doğrulaması istemeyen bir hesap olsun (inceleyen kişi
  SMS alamaz). E-posta/şifreyi yalnızca App Store Connect'teki alana yaz.
- **İletişim**: Esra Güneş; e-posta ve telefon olarak Apple Developer hesabındaki kişisel bilgiler.
- **Notlar** (İngilizce, inceleme ekibi için):

```
İşinn is a local service discovery marketplace in Turkey. Service providers publish a "showcase" (vitrin) with photos/videos; people looking for a service browse by category, city or proximity and contact providers through in-app messaging.

Native features in the iOS app:
- Push notifications for new messages, matching service requests, saved searches and moderation results (APNs).
- Universal Links: isinn.com.tr showcase, category and city links open in the app.
- Camera, microphone and photo library for showcase photos and intro videos.
- Offline screen when there is no connection.

User-generated content safeguards (Guideline 1.2):
- Users can block other users and report users, showcases and service requests from the profile, showcase and message screens.
- Messages, showcase and request texts are filtered for objectionable content before they are posted; reports are reviewed by the admin team.

Account deletion: Profile > "Hesabımı sil" > type SİL to confirm (deletes profile, showcases, messages, reviews and uploaded files).

AI features (writing help, smart search, photo suitability check) use Anthropic Claude. The app asks for explicit consent before any content is sent.

Payments: İşinn does not take commission and does not process payments between users. There are no digital purchases in the iOS app; paid membership screens are hidden on iOS.

Demo account credentials are provided in the Sign-In Information fields.
```

## 7. Diğer sorular

- **Şifreleme (Export Compliance)**: Info.plist'te `ITSAppUsesNonExemptEncryption = false` var, ayrıca soru sorulmaz.
- **Reklam tanımlayıcısı (IDFA)**: Kullanılmıyor.
- **Fiyat**: Ücretsiz.
- **Satılacak ülkeler**: Yalnızca **Türkiye**. AB ülkeleri seçilirse Dijital Hizmetler Yasası gereği "tacir" beyanı
  istenir ve bireysel hesapta adresin, telefonun ve e-postan AB mağazasında herkese açık görünür.
- **Uygulama Gizliliği**: Yanıtları girdikten sonra sağ üstte **Yayınla (Publish)** demeyi unutma.
- **İçerik hakları** (Uygulama Bilgileri): Yanıtlanması zorunlu, 1. bölümdeki yanıt.
- **Sürüm yayını**: "Onaydan sonra elle yayınla" seçmek ilk sürüm için daha güvenli.

## İnceleme riskleri

- **4.2 Asgari işlevsellik** (web sitesini saran uygulamalar): En sık red sebebi. Notlarda native özellikleri
  (bildirim, Universal Link, kamera, çevrimdışı ekran) açıkça saydık. Red gelirse yanıt olarak bu özelliklerin
  ekran kaydını gönder.
- **3.1.1 Uygulama içi satın alma**: iOS'ta plan, fiyat, ödeme bağlantısı görünmemeli. TestFlight'ta profil,
  asistan ve ayarlar ekranlarını bu gözle bir kez daha gez.
- **5.1.1(v) Hesap silme**: Uygulama içinden yapılabiliyor; demo hesapla denenebilir olduğundan emin ol
  (inceleyen kişi demo hesabı silerse yenisini açman gerekir).
