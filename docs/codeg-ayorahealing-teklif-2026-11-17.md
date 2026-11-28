# Ayora Healing — Mobil Uygulama Teklifi (taslak)

> **İç not (müşteriye gitmez):** Rakamlar Claude'un piyasa tahminidir, kurucu onaylamadan gönderilmez. His yüklemeleri netleşti (2026-11-17): müşteri yazılı metin olarak verecek, uygulamada metin kütüphanesi olarak gösterilecek; fiyat değişmedi. 

### İç not — ayorahealing.com'dan öğrenilenler (2026-11-17)
- **Kim:** Hamide Değirmenci — ilkokul öğretmeni, ThetaHealing danışmanı. Tek kişilik, küçük işletme.
- **Ne satıyor:** Atölyeler (Manifest 2.500 TL, Dönüşüm 3.000 TL, Arınma 2.250 TL), bire bir danışmanlık, doğal taş ve tütsü mağazası (4 ürün, 150–1.222 TL), kamplar (meditasyon/yoga/nefes, tarih yok), doğal taş rehberi blogu (3 yazı).
- **Altyapı:** Wix. Randevu ("Hemen Yer Ayırt") ve mağaza/sepet Wix'te zaten çalışıyor → uygulamada **yeniden yapılmamalı**, uygulama bunlara bağlantı vermeli.
- **Sitede eksikler:** Alt bilgideki Facebook/Instagram linkleri Wix'in kendi hesaplarına, TikTok linki yelp.com'a gidiyor (şablondan kalma). Atölye açıklamaları hâlâ "Hizmetlerinizi anlatmak için bu alanı kullanın." yazıyor. → Küçük bir site düzeltmesi olarak ayrıca önerilebilir.
- **Fiyat yorumu:** Atölye fiyatlarıyla 260–420 bin TL'lik bir uygulama bu işletme için ağır olabilir. Bu yüzden aşağıya düşük maliyetli **Başlangıç paketi** eklendi; önce o önerilmeli, A/B büyüme adımı olarak durmalı.
- **Dil riski:** Sitede "doğanın enerjisi ve şifası", "taşların frekansına uyumlanma" dili var. Uygulama ve mağaza metinlerinde bu dil yumuşatılmalı (ThetaHealing/şifa iddiası mağaza reddi sebebi olabilir).

**Aile fiyatı (kuzen, 2026-11-17):** Başlangıç paketi **75.000 TL + KDV** (170 saat × 400 TL = 68.000 + araç 4.500 + risk 2.500). Alt sınır ~60.000 TL; altı zarar. Atölye modülü **+65.000 TL + KDV** (150 saat × 400 = 60.000 + araç 3.000 + risk 2.000) → ikisi birlikte **140.000 TL + KDV**. Pano (vision board) sonradan eklendi (2026-11-21, ~15 saat): kurucu kararıyla **ek ücret yok**, Başlangıç 75.000 TL'ye dahil. 2026-11-22: ajan önerileriyle eklenen defter özellikleri (kilit + yedek, hatırlatma, nazik sayaç, takvimden geçmişi açma, ay başı "Niyetlerine geri bak"; ~27–36 saat) de **ek ücretsiz** dahil; süre 5 → ~6 hafta.

**Her şey dahil maliyet (2026-11-22, kur 45 varsayımı, ~10 haftalık iş):** emek ~392 saat (367 iş + 10 ücretsiz hata ayı + 15 mağaza red/revizyon payı). Nakit: Claude aboneliği (200 $/ay varsayımı, 2,5 ay) ≈ 22.500 TL; Expo EAS ≈ 2.150 TL; Supabase Pro gerekirse ≈ 2.800 TL; video barındırma testi ≈ 450 TL → ≈ 28.000 TL. Gelir 140.000 − 28.000 = 112.000 TL kâr → %25 kurumlar vergisi ≈ 28.000 → net ≈ 84.000 TL → saat başı ≈ 215 TL. Vergi oranı muhasebeciyle teyit edilmeli; Apple/Google hesapları Hamide'nin. Defterde duygu kelimeleri kaldırıldı; "Birlikte bakalım" = Hamide'nin soru havuzu (yapay zekâ yok). Öneri: iki aşama — önce Başlangıç yayına çıksın, atölye modülü hemen arkasından (ödeme de bölünmüş olur).

**Atölye modülü masrafı (150 saat):** hesap/giriş 25, Supabase + satın alma kayıtları 20, uygulama içi satın alma (RevenueCat, iOS + Android ürünleri) 35, korumalı video/ses oynatıcı (Bunny Stream, imzalı bağlantı) 30, atölye listesi/detay/kilit ekranı 20, ek test 15, satın alma için mağaza incelemesi 5 = 150 saat. Ticari: 150 × 750 = 112.500 + araç 6.000 + risk 11.500 = **130.000 TL + KDV**. Yönetim paneli dahil değil: kayıtları biz yüklüyoruz (bakımda). Karşılığında: portfolyo/referans izni, uygulamada "Code G Teknoloji tarafından geliştirildi" satırı, kapsam yazılı ve 2 revizyon turuyla sınırlı.

**Başlangıç paketi masrafı (170 saat):** içerik uygulamaya gömülü, hesap/sunucu yok, defter yalnızca telefonda → oynatıcı 60, olumlama+bildirim 20, defter (cihazda) 20, his yüklemeleri (metin kütüphanesi) 10, siteye bağlantılar 5, arayüz 15, test 20, mağaza yayını 15, yönetim 5 = 170 saat × 750 = 127.500 + araç 4.500 + risk 8.000 = **140.000 TL + KDV**

### İç not — fiyatın arkasındaki masraf dökümü (müşteriye gitmez)
Varsayım: saat ücreti 750 TL, kur 1 USD ≈ 45 TL.

**Paket A (310 saat)**
| Kalem | Saat |
|---|---|
| Arayüz kurgusu | 30 |
| Oynatıcı, arka planda çalma, internetsiz dinleme | 70 |
| Olumlama + bildirim | 25 |
| Niyet–şükür defteri | 35 |
| His yüklemeleri (metin kütüphanesi) | 20 |
| Hesap/giriş, hesap silme | 25 |
| Supabase, güvenlik kuralları, KVKK sayfası | 30 |
| Test (iOS + Android cihazlar) | 35 |
| Mağaza yayını, metinler, ekran görüntüleri | 20 |
| Proje yönetimi, toplantılar | 20 |
| **Toplam emek: 310 saat × 750** | **232.500 TL** |
| Araçlar (Expo EAS, Figma, test hesapları, 3 ay) | 7.500 TL |
| Risk payı (~%8; mağaza reddi, revizyon) | 20.000 TL |
| **Paket A** | **260.000 TL + KDV** |

**Paket B (Paket A + 190 saat = 500 saat)**
| Ek kalem | Saat |
|---|---|
| Yönetim paneli (web) | 70 |
| Abonelik / uygulama içi satın alma | 45 |
| İstatistik | 15 |
| Özel arayüz tasarımı (Figma) | 40 |
| Ek test | 20 |
| **Toplam emek: 500 saat × 750** | **375.000 TL** |
| Araçlar (4 ay) | 12.000 TL |
| Risk payı | 33.000 TL |
| **Paket B** | **420.000 TL + KDV** |

**Bakım (aylık):** ~20 saat × 750 = 15.000 TL (8 saat değişiklik + izleme, işletim sistemi uyumu) + 3.000 TL araç = **18.000 TL + KDV**

**Müşterinin işletme giderleri (yaklaşık)**
| Kalem | Tutar |
|---|---|
| Apple Developer | 99 USD/yıl (≈ 4.500 TL) |
| Google Play | 25 USD bir kez (≈ 1.100 TL) |
| Supabase | Başlangıçta 0 TL; büyüyünce Pro 25 USD/ay (≈ 1.100 TL) |
| Bildirimler (Apple/Google) | Ücretsiz |
| Alan adı (gizlilik politikası sayfası için) | ≈ 500 TL/yıl |
| **İlk yıl toplam** | **≈ 6.000 – 20.000 TL** |

---

## Bölüm 1 — Netleştirme soruları (müşteriye gönderilecek)

Merhaba, uygulamanızı doğru fiyatlayabilmek için birkaç sorumuz var:

**İçerik**
1. Meditasyon ve frekans sesleri hazır mı? Kaç adet ile başlayacağız (ör. 20 meditasyon, 15 frekans)? Seslerin kullanım hakkı sizde mi?
2. Yeni içerikleri (ses, olumlama) yayından sonra siz mi ekleyeceksiniz? Öyleyse bir yönetim paneli gerekir.
3. Olumlamalar yazılı mı, sesli mi olacak? Günlük bildirimle gönderilmesini ister misiniz?

**His yüklemeleri** *(yazılı metinleri siz vereceksiniz)*
4. İlk sürümde kaç his yüklemesi metni olacak? Kategorilere ayrılacak mı (ör. bolluk, sevgi, güven)? Kullanıcı favorilerine ekleyebilsin mi?

**Atölye kayıtları**
4b. İlk etapta kaç atölye kaydı satışa çıkacak, her biri yaklaşık kaç dakika? Kayıtlarda başka katılımcılar görünüyor ya da konuşuyor mu?
4c. Atölye başına fiyat düşündünüz mü? (Mağazalar sabit fiyat basamakları kullanır, ör. 499 / 999 / 1.499 TL.)

**Defter**
4d. "Birlikte bakalım" için niyet ve şükür konusunda 20–30'ar soru yazabilir misiniz? Uygulama her gün farklı birini gösterecek.

**Defter ve hesap**
5. Niyet–şükür defteri yalnızca kullanıcının kendisine mi açık olacak? Telefon değişince notlar kaybolmasın diye bulut yedeği istiyor musunuz?
6. Giriş yöntemi: e-posta, Google, Apple ile giriş?

**Gelir modeli**
7. Uygulama ücretsiz mi, abonelikli mi, yoksa bazı içerikler ücretli mi? (Abonelikte App Store/Google Play %15–30 kesinti alır.)

**Marka ve yayın**
8. Sitenizdeki logo ve renkleri uygulamada kullanabilir miyiz? Uygulamadan randevu ve mağaza için mevcut sitenize yönlendirmemiz uygun mu?
9. Apple ve Google geliştirici hesaplarınız var mı? Yoksa şirketiniz adına açılması gerekir (Apple için D-U-N-S numarası 2–4 hafta sürebilir).
10. Yalnızca Türkçe mi, başka dil de olacak mı?
11. Hedeflediğiniz bir yayın tarihi var mı?

---

## Bölüm 2 — Fiyat ve süre teklifi

**Kime:** Ayora Healing
**Kimden:** Code G Teknoloji — Esra Güneş, esra.gunes@codegtechnology.com
**Tarih:** 17 Kasım 2026 · **Geçerlilik:** 30 gün

### Teknik yaklaşım
- Tek kod tabanıyla **iOS + Android** (React Native / Expo).
- Arka plan: Supabase (hesap, veritabanı, ses dosyası depolama).
- Sesler arka planda ve ekran kilitliyken çalar; indirilip internetsiz dinlenebilir.

### Başlangıç paketi (önerilen ilk adım)
Uygulamayı en düşük maliyetle yayına almak için:
- Meditasyon ve frekans oynatıcı (arka planda çalma, zamanlayıcı, internetsiz dinleme); sesler uygulamanın içinde gelir
- Günün olumlaması + günlük bildirim
- His yüklemeleri: sizin yazdığınız metinler, kategorilere ayrılmış, favorilere eklenebilir
- Niyet–şükür defteri (yalnızca kullanıcının telefonunda saklanır, hesap gerekmez): haftalık takvim, geçmiş kayıtlar ve "Birlikte bakalım" — sizin yazdığınız soru havuzundan her gün farklı bir düşünme sorusu (yapay zekâ yok, ek maliyet yok)
- Pano (vision board): kullanıcı kendi fotoğraflarını ve sözlerini ekleyerek panosunu hazırlar; yalnızca telefonunda saklanır
- Defter kilidi (Face ID / PIN) ve kullanıcının isteğiyle yedek dosyası; sabah niyet / akşam şükür hatırlatması; "bu ay X gün yazdın" sayacı; her ayın 1'inde "Niyetlerine geri bak" (gerçekleşti / sürüyor / bıraktım)
- "Randevu Al", "Mağaza", "Kamplar" butonları mevcut web sitenize yönlendirir (randevu ve satış sistemi yeniden yapılmaz)
- App Store ve Google Play yayını, gizlilik metni

Sınır: Yeni içerik eklemek için uygulama güncellemesi gerekir; telefon değişince defter notları taşınmaz. İleride Paket A/B'ye yükseltilebilir, yapılan iş boşa gitmez.

**Süre:** 6 hafta · **Ücret:** 140.000 TL + KDV · Sunucu gideri yok.

### Ek modül — Ücretli atölye kayıtları
Atölyelerinizin Zoom kayıtlarını uygulamada satabilmeniz için:
- **Atölyeler bölümü:** Her atölye için kapak, açıklama, süre ve fiyat; ücret ödenmemişse kilitli görünür
- **Satın alma:** Kullanıcı atölyeyi uygulama içinden bir kez satın alır, kilit açılır ve kayıt hesabında kalıcı olur (telefon değişse de)
- **İzleme/dinleme:** Video olarak izleme ya da yalnızca ses olarak dinleme (ekran kapalıyken de çalar)
- **Koruma:** Kayıtlar korumalı akışla gelir; bağlantı kopyalanıp paylaşılamaz
- **Hesap:** Satın alınanları korumak için e-posta / Apple / Google ile giriş (yalnızca atölye almak isteyene sorulur)
- **Yeni atölye ekleme:** Kaydı bize gönderirsiniz, en geç 2 iş günü içinde uygulamaya ekleriz (bakım kapsamında). İleride kendiniz yüklemek isterseniz yönetim paneli Paket B'de var.

**Bilmeniz gerekenler**
- Uygulama içindeki dijital içerik satışlarında Apple ve Google ödemeyi kendi sistemleri üzerinden almayı zorunlu tutar ve **%15 komisyon** keser (küçük işletme programı; Apple için başvuru gerekir). Örnek: 1.000 TL'lik atölyeden size yaklaşık 850 TL kalır (vergiler hariç).
- Zoom kaydında başka katılımcıların yüzü, adı ya da sesi varsa satıştan önce **yazılı izinleri alınmalı** veya kayıt yalnızca sizi gösterecek şekilde kesilmeli (KVKK).

**Süre:** +4 hafta · **Ücret:** 130.000 TL + KDV
**Aylık işletme gideri:** video barındırma ~5–15 USD (izlenme arttıkça artar), satın alma altyapısı (RevenueCat) aylık 2.500 USD gelire kadar ücretsiz, Supabase 0–25 USD.

### Paket A — Temel
| Özellik | İçerik |
|---|---|
| Meditasyon & frekans | Kategoriler, oynatıcı, arka planda çalma, uyku zamanlayıcı, favoriler, indirip internetsiz dinleme |
| Olumlamalar | Günün olumlaması kartı, günlük bildirim, favoriler |
| Niyet–şükür defteri | Günlük niyet ve şükür kayıtları, takvim görünümü, bulut yedeği, kullanıcıya özel (yalnızca kendisi görür) |
| His yüklemeleri | Sizin yazdığınız metinler; kategoriler, okuma ekranı, favoriler |
| Hesap | E-posta + Apple + Google ile giriş, hesap silme |
| Yayın | App Store ve Google Play'e yükleme, mağaza metinleri, KVKK aydınlatma metni ve gizlilik politikası sayfası |

İçerikler (sesler, olumlamalar) ilk yüklemede tarafımızca sisteme girilir. Sonradan değişiklik → destek kapsamında.

**Süre:** 8 hafta · **Ücret:** 260.000 TL + KDV

### Paket B — Genişletilmiş (Paket A + aşağıdakiler)
- **Yönetim paneli (web):** Yeni meditasyon/frekans/olumlama ekleme, kategori düzenleme, bildirim gönderme
- **Abonelik:** Uygulama içi satın alma (aylık/yıllık), ücretsiz/ücretli içerik ayrımı, deneme süresi
- **Basit istatistik:** Kullanıcı sayısı, en çok dinlenen içerikler
- **Arayüz tasarımı:** Marka kimliğine göre özel ekran tasarımları (Figma)

**Süre:** 12 hafta · **Ücret:** 420.000 TL + KDV

### Bakım ve destek (yayın sonrası, isteğe bağlı)
- İlk **1 ay hata düzeltme ücretsiz.**
- Sonrasında aylık **18.000 TL + KDV:** işletim sistemi güncellemelerine uyum, hata düzeltme, ayda 8 saate kadar küçük değişiklik ve içerik girişi.

### Müşteriye ait üçüncü taraf giderleri (fiyata dahil değil)
- Apple Developer: 99 USD/yıl · Google Play: 25 USD (bir kez)
- Sunucu/depolama (Supabase): başlangıçta 0–25 USD/ay, kullanıcı ve ses arşivi büyüdükçe artar
- Abonelik varsa mağaza kesintisi: %15–30

### Ödeme planı
- %40 sözleşme imzasında
- %30 test sürümü teslim edildiğinde
- %30 mağazada yayına alındığında

### Teslim ve haklar
- Kaynak kod ve tüm hesaplar son ödemeyle birlikte müşteriye devredilir.
- Mağaza hesapları müşterinin şirketi adına açılır.
- Kapsam dışı yeni özellikler ayrıca fiyatlandırılır.

### Önemli not: mağaza kuralları
App Store ve Google Play, sağlık iddiası içeren uygulamaları reddedebilir. Bu nedenle uygulama ve mağaza metinlerinde "tedavi eder", "şifa verir", "hastalığı iyileştirir" gibi ifadeler yerine **"rahatlama, farkındalık, iç huzur"** dili kullanılacaktır. Uygulama tıbbi bir hizmet olarak sunulmaz; ilgili bilgilendirme metni eklenir.
