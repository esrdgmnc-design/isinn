# ChatGPT'den gelen ziyaretçiler: analiz (17 Kasım 2026)

Kaynak: İşinn veritabanındaki `events` (21 Eylül'den beri 4.620 olay), `search_queries`, `profiles`, `services` ve `jobs` tabloları.

## Önce sınır
ChatGPT, kullanıcının yazdığı soruyu bize **iletmiyor**. Bir siteye link verdiğinde adresin sonuna yalnızca `utm_source=chatgpt.com` ekliyor. Bu yüzden "hangi soruyla geldiler" sorusuna doğrudan cevap veremeyiz. Onun yerine, gelen kişilerin sitede ne aradığına, neye baktığına ve ne yaptığına bakarak niyeti çıkardım.

## 1. ChatGPT cevaplarındaki linklerden gelenler
- **Sayı:** İlk ziyaret 26 Ekim'de. O günden bu yana 29 oturum gelmiş, Kasım'da artış var.
- **Hemen çıkanlar:** 29 oturumun 17'si yalnızca sayfayı açıp çıkmış.

### Sitede ne aradılar
| Arama | Sonuç | Not |
|---|---|---|
| Logo Desing | 0 | Yazım hatası; "Tasarım" kategorisinde vitrinler var |
| Video editör | 0 | "Video Düzenleme" kategorisi var, ama arama eşleştiremedi |
| gemi inşa | 0 | Böyle bir vitrin yok |
| rhino | 2 | 3B modelleme programı |
| autocad | 1 | |
| Ressam | 0 | "Resim ve Sanat Atölyesi" kategorisinde vitrin var, ama arama eşleştiremedi |

**En önemli bulgu:** 7 aramanın 5'i sonuçsuz kalmış. Bunların 3'ünde aslında uygun vitrin vardı: logo, video editör, ressam. Arama, eş anlamlıları ve yazım hatalarını tanımadığı için sonuç çıkmadı.

### Hangi vitrinlere baktılar
- **Mühendislik ve mimarlık (3 kez):** Mobil uygulama, mimari tasarım ve AutoCAD, mühendislik danışmanlığı.
- **Resim (2 kez):** Ölçüye özel el yapımı tablo.
- **Tek bakılanlar:** ThetaHealing (Ayorahealing), video editör, yapay zekâ destekli web tasarım.

### Ne yaptılar
- **Hizmet verenlerin karşılama sayfası:** 4 kez açılmış.
- **Kayıt ve vitrin:** 5 kişi giriş yapmış ya da kayıt olmuş, bunlardan 3'ü vitrin açmış:
  - mahdis negin: Mimari tasarım, AutoCAD, 3D (Mühendis). Ayrıca 2 iş ilanı verdi.
  - Elvan Karakaya: Sosyal medya uzmanı (Dijital Pazarlama).
  - Nisa Selin Polat: İç mimari proje ve çizim eğitimleri (İç Mimarlık).
- **Kayıt olup vitrin açmayanlar:** 2 kişi.

**Sonuç:** ChatGPT bize ağırlıkla **hizmet verenleri** getiriyor, özellikle tasarım, mimarlık ve mühendislik alanından. Hizmet arayanlar da geliyor, ama aradıklarını bulamadan çıkıyorlar.

## 2. ChatGPT ve Claude içindeki İşinn uygulaması
- **Toplam:** 29 Ekim'den bu yana 209 çağrı var.
- **Çoğu gerçek kullanıcı değil:**
  - **Bizim testlerimiz:** 29–31 Ekim'deki toplu denemeler, 4 ve 16 Kasım'da Code G, Esra Güneş, Hamide ve Ayora aramaları, bugünkü "matematik özel ders" ve "kurye" denemeleri.
  - **Otomatik kontroller:** Düzenli saatlerde boş sorguyla yapılan "kategorileri listele → ara → vitrin aç" üçlüleri. Büyük olasılıkla uygulama dizinlerinin ya da inceleme sistemlerinin denetimleri.
  - **İnceleme denemeleri:** "japan", "東京", "Tokyo", "running shoes", "guide" gibi İşinn'le ilgisi olmayan aramalar. Uygulamayı inceleyenlerin yaptığı denemeler olmalı.
- **Kullanıcıya benzeyen aramalar:** Örneğin "fizyoterapist bel ağrısı, Ümraniye" ve Eskişehir'de sosyal medya aramaları. Ama bunlar da kurucu testlerinin olduğu günlere denk geliyor.
- **Neden ayıramıyoruz:** Araç, çağrının kimden ve hangi uygulamadan geldiğini kaydetmiyor. Bu yüzden gerçek kullanıcıyı testten kesin ayıramıyoruz.

## Öneriler (en kolaydan)
1. **Aramaya eş anlamlılar:** "editör" → Video Düzenleme, "ressam" → Resim, "logo design / desing" → Tasarım gibi. Sonuçsuz kalan aramaların yarısı böylece çözülür.
2. **Testleri işaretlemek:** Yapay zekâ aracı çağrılarına "hangi uygulamadan geldi" bilgisini ve bizim testlerimiz için bir işaret eklemek. Böylece gerçek ChatGPT kullanıcılarını sayabiliriz.
3. **Hizmet verenler için:** ChatGPT'den hizmet veren geldiği için bu kişileri hedefleyen sayfaları güçlendirmek: "hizmet ver" sayfası, mimar ve mühendis vitrini rehberleri.
