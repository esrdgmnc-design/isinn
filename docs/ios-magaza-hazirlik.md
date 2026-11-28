# İşinn iOS — mağaza hazırlığı (2026-10-12)

Bu dosya taslaktır; karar sende. Şifre ve gizli bilgi YAZMA, yalnızca App Store Connect alanlarına gir.

## 1. Mağaza kaydı
- Ad (en fazla 30): `İşinn: Uzman Bul, Vitrin Aç`
- Alt başlık (en fazla 30): `Freelance hizmet, komisyonsuz` (29 karakter; ajan önerisi, "vitrin" sözcüğü adda zaten var). Ana sayfa ve Hakkımızda metinleri değişmez; "iş bulma", "iş ilanı" ifadeleri mağazada KULLANILMAZ.
- Anahtar kelimeler (en fazla 100): `danışman,mentör,eğitmen,tasarımcı,yazılımcı,çevirmen,yakınımda,portföy,usta,özel ders,bakıcı,serbest` (100 karakter; "freelance" alt başlıkta olduğu için çıkarıldı; arama hacmini App Store Connect > Search Ads önerilerinden doğrula)
- Kategori: birincil Business, ikincil Lifestyle (Shopping ve Jobs seçme)
- Yaş derecelendirmesi: Kullanım Şartları 18+ diyor → 18+ seç. Mesajlaşma ve kullanıcı içeriği sorularına "Evet" de, diğerlerine "Yok".
- Gizlilik politikası URL: https://www.isinn.com.tr/gizlilik-politikasi
- Pazarlama URL: https://www.isinn.com.tr
- Destek URL: ayrı sayfa yok; iletişim bilgisi görünen bir sayfa gerekir (geçici: /hakkimizda, görünür iletişim bilgisi olduğunu doğrula)
- Uygulama yalnızca iPhone için derlenir (Xcode'da hedef cihaz ailesi = iPhone), iPad ekran görüntüsü gerekmez

### Tanıtım metni (incelemesiz değişebilir)
İşinn'de hizmet verenler kendi vitrinini açar, arayanlar şehre ve kategoriye göre uzmanları bulup doğrudan mesajlaşır. Komisyon almıyoruz, ürün satmıyoruz. Şu an ücretsiz.

### Açıklama
İşinn, Türkiye genelinde hizmet verenlerle onlara ihtiyacı olanları buluşturan bir hizmet keşif platformudur.

Doğru uzmanı bul. Yeteneğini sergile.

ARIYORSAN
• Kategori, şehir ve anahtar kelimeyle uzmanları ara
• Vitrinleri, fotoğraf ve videolu çalışma örneklerini incele
• Uygun gördüğün kişiye uygulama içinden doğrudan yaz

HİZMET VERİYORSAN
• Birkaç dakikada kendi hizmet vitrinini aç
• "Yeteneğini Farket" ile becerilerinden hizmet fikirleri ve vitrin taslağı al (yapay zekâ önerir, son kararı sen verirsin)
• Çalışma bağlantını (portföy, LinkedIn, web sitesi) ekle

NASIL ÇALIŞIR
İşinn komisyon almaz, ödemeye aracılık etmez, ürün satmaz. Anlaşma ve ödeme taraflar arasındadır. İşinn bir işe alım ya da personel arama sitesi değildir; ilan ekranı, ihtiyacını anlatıp hizmet verenlerden teklif almak içindir. Hiçbir müşteri ya da kazanç garantisi verilmez.

GÜVENLİK
Kullanıcıları şikayet edebilir, engelleyebilirsin. Hesabını uygulama içinden silebilirsin. Hizmeti görmeden ön ödeme, kapora ya da IBAN gönderme.

Kullanım Şartları: isinn.com.tr/kullanim-sartlari · Gizlilik: isinn.com.tr/gizlilik-politikasi

İşinn, Code G Teknoloji ve Ticaret Ltd. Şti. ürünüdür.

### Yenilikler (1.0)
İşinn'in ilk sürümü: hizmet vitrini aç, uzmanları şehir ve kategoriye göre ara, doğrudan mesajlaş.
(Ajanın taslağında geri bildirim e-postası da vardı; hangi e-postayı herkese açık yazacağına sen karar ver.)

## 2. İnceleme notları (App Review Information → Notes, İngilizce)
İşinn is a Turkish service discovery platform. Providers open a service showcase; visitors search by category/city and message them directly. It takes no commission, does not process payments between users and sells no products. It is not a recruitment or job-search site. The "post a request" screen (named "İş İlanı Ver" in Turkish) lets a customer describe a service they need, such as a plumber, and providers can send offers.

Browsing and search work without an account. Messaging and creating a showcase need email plus phone verification (SMS via Netgsm). Because an SMS code cannot reach the reviewer, we provide pre-verified demo accounts (credentials in the App Review fields), so email and phone checks are already complete.

Payments are disabled: the platform is free for all users until 1 Jan 2027. No in-app purchase is offered, and plan/pricing screens are hidden in the iOS app. Google sign-in is hidden in the iOS app.

User-generated content safeguards: Block and Report are available in the chat screen, and showcases can be reported from the showcase page; photos are screened automatically (videos are reviewed by staff); Terms of Use and Privacy Policy are linked. Account deletion: Profile > "Hesabımı sil" (type SİL to confirm).

Some features send user-provided text/photos to an AI provider (Anthropic) to check photos and suggest service ideas; this is described in the Privacy Policy.

## 3. Demo hesapları (Sen yapacaksın)
1. Sitede iki hesap aç: biri hizmet veren (vitrinli), biri müşteri. E-postalarını onayla.
2. Telefon doğrulaması SMS ile yapılıyor, inceleyici alamaz. Bu iki hesabın `profiles.phone_verified` değerini sen doğrulayıp işaretleyeceksin (SQL ile; yapmamı istersen hesapların e-postasını söyle, şifrelerini söyleme).
3. Hizmet veren hesabının vitrinine "DEMO" etiketi / gerçek olmayan örnek içerik koy; uydurma yorum ve rakam kullanma.
4. Kullanıcı adı ve şifreyi yalnızca App Store Connect → App Review Information → Sign-in required alanlarına yaz.
5. Kısa bir ekran kaydı ekle: şikâyet, engelleme ve hesap silme akışı.

## 4. Ekran görüntüleri (gerçek uygulamadan)
Boyut: 1320x2868 (6,9 inç) tek set yeter. Uydurma içerik kullanma, DEMO etiketi görünür kalsın.
1. Ana sayfa ve arama kartı — "Doğru uzmanı bul"
2. Kategori/şehir sonuç listesi — "Şehrine ve ihtiyacına göre ara"
3. Vitrin detayı (foto/video, çalışma bağlantısı) — "Çalışmaları görerek karar ver"
4. Mesajlaşma ekranı — "Doğrudan yaz, komisyon yok"
5. Yeteneğini Farket sonucu — "Yeteneğini sergile"

## 5. App Privacy (App Store Connect → Uygulama Gizliliği)
Takip (tracking): Hayır. Reklam SDK'sı yok.
Toplanan veri, kullanıcıya bağlı: cihaz kimliği (bildirim anahtarı), e-posta, ad, telefon, fotoğraf/video, mesajlar ve vitrin metni (kullanıcı içeriği), kullanıcı kimliği, ürün etkileşimi (analitik), şehir (kaba konum).
Konum: "Konumumu kullan" yalnızca tarayıcıda en yakın şehri bulur, sunucuya gitmez; Apple tanımına göre konum toplanmıyor. Profilde elle yazılan şehir konum değil, iletişim/diğer olarak değerlendirilir. Arama metinleri kimliksiz kaydediliyor: Arama Geçmişi (kullanıcıya bağlı değil, analitik).
Satın alım geçmişi: eski ödeme kayıtları duruyorsa beyan et.
Not: `ios/App/App/PrivacyInfo.xcprivacy` bu beyanla uyumlu yazıldı; formda da aynısını işaretle.

## 6. Gönderim öncesi durum
Yapıldı (kodda): iOS'ta Google ve Planlar gizli, yapay zekâ onay ekranı, içerik filtresi (mesaj, vitrin, ilan), hesap silmede dosya temizliği, push bildirimi ve derin bağlantı altyapısı (kurulum: docs/ios-bildirim-kurulum.md).
Kalan: Kullanım Şartları'na "bildirimler 24 saat içinde incelenir" taahhüdü (hukuki metin, karar sende), demo hesaplar, ekran görüntüleri,
Mac'te derleme ve iPhone'da elle deneme (giriş, fotoğraf yükleme, mesaj, şikâyet/engelle, hesap silme).
Not: Apple "sadece web sitesi" (4.2) konusunda öznel; bildirim ve derin bağlantı bunu güçlendirir, kabul garantisi vermez.
