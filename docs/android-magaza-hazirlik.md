# İşinn Android — Google Play hazırlığı (2026-10-15)

Taslaktır; kararlar kurucuya aittir. Şifre, anahtar dosyası ve JSON anahtarı BURAYA YAZMA.
Bu belge üç uzman ajanın raporu (derleme, Play kuralları, mağaza metni) ve yapılan kod değişiklikleriyle hazırlandı.
Play politika tarihleri ve bazı davranışlar bu oturumda internetten doğrulanmadı: "DOĞRULA" işaretlilere Play Console'da bak.
Android derlemesi bu bilgisayarda denenmedi (JDK/Android Studio yok); ilk derleme Codemagic'te olacak.

## 1. Kodda yapılanlar
- Android kabuğu `IsinnApp-Android` kullanıcı ajanıyla tanınır (`capacitor.config.json`, `lib/nativeApp.js`).
- Android'de de gizli: Google ile giriş (Google gömülü WebView'ı engeller), Planlar/fiyat/ödeme yüzeyleri (Play Faturalandırma), destek asistanının plan ve fiyat bilgisi.
- Android'de de açık: yapay zekâ onay ekranı, karşılama ekranı, açılış perdesi, içerik filtresi, şikâyet/engelle.
- "Konumumu kullan" düğmesi Android'de gizli (izin eklemeyip Play izin beyanından kaçınmak için; şehir elle seçilir).
- Yeteneğini Farket önerilerinde "Bu öneriyi bildir" (olay kaydı olarak düşer, `talent_output_reported`).
- Yeni sayfa `/hesap-silme` (Veri güvenliği formundaki web bağlantısı); Gizlilik Politikası'ndan bağlandı.
- `android/app/build.gradle`: `versionCode` Codemagic `BUILD_NUMBER`'dan, imza `CM_KEYSTORE_*` değişkenlerinden; `allowBackup=false`.
- `codemagic.yaml`: `android-release` akışı (imzalı AAB). Otomatik yayın bölümü yorum satırı.
- Görseller: `ekran_goruntuleri/play_store/` (5 telefon ekranı 1080x2400, `ikon_512.png`, `one_cikan_grafik_1024x500.png`).

## 2. Kurucunun sırayla yapacakları
1. Play Console hesabı KİŞİSEL hesap çıktı (2026-10-15, Hesap Kimliği 4950170735960059927). Kurulumu tamamla: (a) Play Console mobil uygulamasıyla GERÇEK bir Android telefonda giriş yap (cihaz doğrulaması), (b) iletişim telefonunu doğrula ve kimlik belgesini yükle (Google onaylar). Bitmeden yayın olmaz.
2. Console > Uygulama oluştur: ad, Türkçe, Uygulama, Ücretsiz, beyanlar.
3. Yükleme anahtarı: Codemagic > Teams > Code signing identities > Android keystores (referans adı `isinn_upload_keystore`). Dosya ve şifreleri parola yöneticisi + çevrimdışı ikinci kopyaya yedekle.
4. Codemagic'te `android-release` akışını çalıştır, `.aab` dosyasını indir.
5. Console > Dahili test'e `.aab`'yi elle yükle, kendini test kullanıcısı yap, gerçek Android telefona kur. Dene: giriş (Google yok), fotoğraf/video yükleme, mesaj, geri tuşu, üst/alt çubuk, çevrimdışı ekran.
6. Mağaza girişi: metinler (aşağıda), 5 ekran görüntüsü + ikon + öne çıkan grafik.
7. Politika formları: Veri güvenliği, İçerik derecelendirme, Hedef kitle (yalnızca 18+), Reklam yok, Gizlilik URL, Hesap silme URL (`https://www.isinn.com.tr/hesap-silme`), Uygulama erişimi (demo hesap), UGC, yapay zekâ beyanı.
8. İlk yüklemeden sonra "App signing key certificate" SHA-256'yı kopyala (herkese açık, gizli değil) → bana ver, `assetlinks.json` hazırlanır (v1.1).
9. Üretim: kademeli yayın %5-10 ile başla, Android vitals'ı izle.

Karar gerekenler: destek e-postası Play'de herkese açık görünür (hangisi?); iOS ve Android'de geliştirici kimliği tutarlılığı (iOS ve Play ikisi de kişisel hesap); 20 Aralık sonrası Android'de ödeme (Play Faturalandırma ya da ücretsiz kalma).

## 3. Mağaza metinleri (Türkçe, yapıştırmaya hazır)
**Ad (27):** İşinn: Uzman Bul, Vitrin Aç
**Kısa açıklama (69):** Yakınındaki hizmet verenleri keşfet, vitrinini aç. İşin gücün burada.
A/B alternatifleri (2. haftada dene): "Hizmet verenleri keşfet, kendi vitrinini aç. Komisyon yok, doğrudan mesajlaş." · "Özel ders, bakım, el emeği, çeviri... Yeteneğini keşfet, işini kur."

**Tam açıklama:**

İşinn: İşin gücün burada.

İşinn, Türkiye genelinde hizmet verenlerle bu hizmetlere ihtiyacı olanları buluşturan bir hizmet keşif platformudur. Özel ders, çocuk bakımında yardım, ev yemeği, el işi atölye hizmetleri, çeviri, tasarım, danışmanlık, yaşlılar için telefon ve teknoloji desteği gibi pek çok alanda kendi vitrinini aç ya da ihtiyacın olan uzmanı bul.

Yeteneğini keşfet, işini kur.

HİZMET ARIYORSAN
• Kategori, şehir ve anahtar kelimeyle uzman ara
• Vitrinlerdeki fotoğraf ve videolu çalışma örneklerini incele
• Uygun bulduğun kişiye uygulama içinden doğrudan yaz
• Ne istediğini anlat, hizmet verenlerden teklif al

HİZMET VERİYORSAN
• Şirket kurmana gerek kalmadan birkaç dakikada kendi vitrinini aç
• Çalışmalarını fotoğraf ve videoyla sergile
• Portföy, web sitesi ya da LinkedIn bağlantını ekle
• "Yeteneğini Farket" ile becerilerinden hizmet fikirleri ve vitrin taslağı al. Yapay zekâ önerir, son kararı sen verirsin.
• Mesajlarını tek yerden yönet

KİMLER İÇİN
Evinden hizmet vermek isteyen anneler, becerisini görünür kılmak isteyen ev hanımları, ders ve destek hizmeti veren öğrenciler ve genç yetenekler, serbest çalışan tasarımcı, çevirmen, danışman ve eğitmenler.

NASIL ÇALIŞIR
İşinn komisyon almaz, ödemeye aracılık etmez. Anlaşma ve ödeme, taraflar arasında yapılır. İşinn bir hizmet keşif platformudur; kimseye müşteri ya da kazanç sözü verilmez.

GÜVENLİK
Kullanıcıları uygulama içinden şikâyet edebilir ve engelleyebilirsin. Hesabını istediğin an uygulamadan silebilirsin. Hizmeti görmeden ön ödeme, kapora ya da IBAN gönderme.

Kullanım Şartları: isinn.com.tr/kullanim-sartlari
Gizlilik: isinn.com.tr/gizlilik-politikasi


**Sürüm notları 1.0 (342):**
İşinn'in ilk sürümü yayında.
• Kategori, şehir ve anahtar kelimeyle hizmet verenleri ara
• Kendi hizmet vitrinini aç, fotoğraf ve videolarla çalışmalarını göster
• Uygulama içinden doğrudan mesajlaş
• "Yeteneğini Farket" ile hizmet fikirleri al (yapay zekâ önerir, son kararı sen verirsin)
• Şikâyet et, engelle, hesabını uygulama içinden sil

**Kategori:** İş (Business), ikincil yok. **Etiketler:** hizmet, freelance (varsa).

## 4. Form taslakları (Console'da doğrula)
**Veri güvenliği.** Aktarımda şifreleme: evet (HTTPS). Silme talebi: evet + URL.
- Kişisel bilgi: e-posta, ad, kullanıcı kimliği, telefon (hesap yönetimi, uygulama işlevi, dolandırıcılık önleme).
- Fotoğraf/video: profil ve portföy. Mesajlar: uygulama içi mesajlar.
- Dosyalar ve belgeler: sertifika/CV (isteğe bağlı).
- Uygulama etkinliği: arama geçmişi, etkileşimler, kullanıcı içeriği (analitik, uygulama işlevi).
- Finansal/satın alma: eski ödeme kayıtları duruyorsa beyan et; kart bilgisi toplanmıyor (PayTR).
- Konum: izin eklenmediği için toplanmıyor; profildeki elle şehir bilgisinin kategorisi DOĞRULA.
- Paylaşım: Supabase, Resend, Netgsm, Vercel adına işleyen hizmet sağlayıcıdır; Anthropic'e (yapay zekâ) giden metin/fotoğraf için muhafazakâr davran ve "paylaşıldı (uygulama işlevi)" işaretlemeyi düşün.
- Reklam yok, takip yok.

**İçerik derecelendirme (IARC).** Şiddet/cinsellik/küfür/kumar/uyuşturucu: kendi içeriğinde Hayır. Kullanıcı etkileşimi ve kullanıcı içeriği: Evet. Konum paylaşımı: Hayır. Dijital satın alma: Hayır (Android'de plan gizli). iOS'taki 18+ ile tutarlı.

**Diğer:** hedef kitle yalnızca 18 ve üzeri (çocuk görseli koyma); reklam: Hayır; AD_ID izni: birleşik manifestte olmadığını doğrula; haber/sağlık/finans/devlet: Hayır; uygulama erişimi: SMS OTP incelemeciye ulaşmaz, iOS'takine benzer ön doğrulanmış demo hesap ve talimat ver.

**Test kanalı (KİŞİSEL hesap):** Kişisel hesaplarda üretime çıkmadan önce kapalı testte en az 12 test kullanıcısı 14 gün kesintisiz kabul etmiş (katılmış) olmalı. Test kullanıcıları Gmail hesabı olan tanıdıklar olabilir. Kesin koşulu ve sayacı Console > Üretim erişimi bölümünde DOĞRULA. Bu yüzden ilk iş kapalı testi başlatmak: yayın tarihi buna bağlı.

## 5. Bilinen riskler ve ertelenenler
- **Plan/ödeme (Play Faturalandırma):** Android'de gizli. 20 Aralık 2026 sonrası seçenekler: Play Faturalandırma entegrasyonu (WebView'da zor), Android'de ücretsiz kalma, hukuk danışmanlığı. Aralıktan önce karar ver.
- **Push (Android):** bu sürümde yok (FCM + google-services.json + sunucu gönderici gerekir). v1.1.
- **Derin bağlantı / assetlinks.json:** v1.1 (App signing SHA-256 gerekir).
- **Kenardan kenara (Android 15/16):** üst/alt çubuk boşlukları CSS ile eklendi, gerçek cihazda doğrulanmadı.
- **Kullanım Şartları:** şikâyet yanıt süresi taahhüdü (24 saat), §6 ücretlendirme ve §2 "pazaryeri" dili avukat incelemesine uygun gözden geçirilmeli. Gizlilik politikasındaki saklama süreleri somutlaştırılmalı (hukuki metin).
- **`/destek` ve `/hesap-silme`:** iOS bireysel hesabı nedeniyle `/destek` şirket bilgisi taşımıyor; `/hesap-silme` yalnızca uygulama adı ve iletişim e-postasını gösteriyor.
- "Bu öneriyi bildir" olay günlüğüne yazar (destek bileti açmaz); yönetim panelinde ayrıca izlenmesi gerekir.
