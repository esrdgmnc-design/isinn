# İşinn: kurgu ve teknik özellikler özeti (2026-10-16)

Bu belge kod tabanı, veritabanı ve proje notlarından derlendi. Rakamlar 2026-10-16 tarihli ham üretim verisidir (kurucu çevresi ve test dahil).

## 1. Kurgu (ne, kim için, nasıl)
**Ne:** İşinn, yakındaki hizmet verenleri (özel ders, bakım, tasarım, yazılım, atölye vb.) keşfetmeyi sağlayan, **komisyonsuz** bir yerel hizmet keşif platformu. Bir iş ilanı sitesi değildir: hizmet verenler "vitrin" açar, arayanlar vitrinleri bulur ya da "Hizmet Arıyorum" ilanı verir.
**Ödeme:** Ödeme ve anlaşma taraflar arasındadır. İşinn ödemeye aracılık etmez, komisyon almaz.
**Kuruluş hikâyesi:** Çalışan anneler, evden kazanç düşünen ve şirket kurmadan görünür olmak isteyen kadınlar, okurken gelire ihtiyacı olan gençler. Güncel tanıtım ağırlığı şimdilik beyaz yaka hizmetlerde.
**Ana akış:**
1. Hizmet veren kayıt olur (e-posta + telefon), "Yeteneğini Farket" ile ne yapabileceğini keşfeder, **vitrin** açar: fotoğraf/video, açıklama, fiyat ya da teklif usulü, kendi beyanı olan sertifika (doğrulanmış denmez).
2. Arayan vitrinleri arar (kategori, şehir, harita) ya da "Hizmet Arıyorum" ilanı verir; yapay zekâ ilanı uygun vitrinlerle eşleştirir.
3. Taraflar uygulama içinde mesajlaşır.
4. İş bitince taraflardan biri "tamamlandı" der, **diğer taraf onaylar ya da itiraz eder** (iki taraflı onay).
5. Müşteri fotoğraflı değerlendirme yazar. Yorumda "hizmeti aldığını beyan etti" ile "iki taraf da onayladı" ayrı etiketlenir.
**Kuzey yıldızı metriği:** iki taraflı onaylı iş.

## 2. Özellikler
**Keşif ve arama:** 68 kategori, kategori ve şehir sayfaları, arama, harita görünümü, favoriler, kayıtlı aramalar (yeni eşleşmede bildirim), vitrin detay sayfası, paylaşım.
**Vitrin yönetimi:** fotoğraf ve video yükleme, kapak fotoğrafı yapay zekâ kontrolü, çalışma bağlantısı (güvenli link kuralları), öne çıkarma, vitrin sınırı (plana göre), sağlayıcı yanıtı yorumlara.
**Yapay zekâ:** Yeteneğini Farket (kısa sorulardan hizmet önerisi, ürün satışına yönlendirmeyi engelleyen filtre, kişisel bilgi temizleme), ilan-vitrin eşleştirme ve en iyi 3 bildirimi, açılış mesajı taslağı, fotoğraf moderasyonu. Yapay zekâ çağrıları sunucudan geçer ve hız sınırlıdır. Mağaza uygulamasında ilk kullanımda yapay zekâ onayı istenir.
**İş akışı:** Hizmet Arıyorum ilanları, teklif verme, mesajlaşma (bildirimli), **iki taraflı onay + itiraz** (uyarı penceresi, zorlayıcı değil), fotoğraflı yorum (sağlayıcı onayı gereken yorum medyası dahil).
**Güven ve güvenlik:** içerik filtresi, kullanıcı engelleme ve şikayet, ilan şikayeti, içerik bayrakları, destek biletleri, yönetici panelleri (rapor, moderasyon, panel, kullanıcı/ilan şikayetleri), telefon doğrulama (SMS), hesap silme (uygulama içinden), KVKK ve hukuki metinler.
**Gelir modeli:** Standart üyelik 159 TL/ay (2 vitrin), Pro 399 TL/ay (3 vitrin), ek paketler: Öne Çıkarma, Ek Vitrin, Haftalık Öne Çıkarma. **1 Ocak 2027'ye kadar herkese ücretsiz dönem**; ödeme PayTR ile, kayıtlı kartla yenileme ve günlük otomatik kontrol (deneme bitişi, uyarı, vitrin kapatma). Mağaza uygulamalarında fiyat ve plan ekranları gizlidir.
**İçerik ve görünürlük (SEO/AEO):** sunucu tarafında oluşturulan ana sayfa, site haritası, yapılandırılmış veri, çok sayıda rehber sayfası, rozet sayfası, yapay zekâ arama botları için açıklama dosyaları.
**Mobil:** Capacitor ile iOS ve Android uygulama kabuğu, açılış ve karşılama ekranı, iOS bildirimleri (APNs), mağaza kabuğuna özel arayüz kuralları.
**Çok dilli:** Türkçe ve İngilizce arayüz.

## 3. Teknik yapı
Next.js 14 (App Router) + React 18, Supabase (Postgres, kimlik doğrulama, depolama, satır düzeyinde yetki), Vercel (yayın ve günlük zamanlanmış görev), Capacitor 8 (iOS/Android), PayTR (ödeme), Resend (e-posta), Netgsm (SMS), Anthropic Claude (yapay zekâ özellikleri), Codemagic (mobil derleme), kendi olay ve sayfa görüntüleme takibi, birim testleri.
**Veritabanı:** vitrinler, iş kayıtları, mesajlar, yorumlar ve yorum medyası, abonelikler ve paketler, bildirimler, kayıtlı aramalar, şikayetler, destek biletleri, yapay zekâ günlükleri.

## 4. Durum (dürüst özet)
| Konu | Durum |
|---|---|
| Web | Yayında (isinn.com.tr) |
| iOS | App Store incelemesinde (bekliyor) |
| Android | Google Play kapalı testte, 12 kişi şartı sağlandı, 14 gün sayımı sürüyor (tahmini bitiş 30 Ekim) |
| İki taraflı onay + itiraz penceresi | Yayında (8ada1d2) |
| "Daha önce çalıştım" düğmesi kaldırma | Hazır, commit edilmedi |
| Android bildirimleri (FCM), uygulama bağlantı doğrulaması | Yapılmadı |
| Randevu sistemi | Ertelendi |
| Gelir | 3 başarılı ödeme, toplam 1.447 TL (13-14 Eylül, ücretsiz dönem kararından önce; 649 TL kurucu hesabı); sonrası 1 Ocak'a kadar yeni satış kapalı |

## 5. Rakamlar
Tüm rakamlar ve düzeltmeler: [isinn-rakamlar-2026-10-16.md](isinn-rakamlar-2026-10-16.md). Özet: 46 hesap, 27 gerçek vitrin, 5 aktif ilan, 14 vitrin görüşmesi (8 farklı hesaptan), 30 mesaj, 3 yorum (2 fotoğraflı), 1 iki taraflı onaylı iş (müşteri tarafı kurucu hesabı, bağımsız değil), 3 başarılı ödeme 1.447 TL. Hepsi kurucu çevresi ve test dahil.
