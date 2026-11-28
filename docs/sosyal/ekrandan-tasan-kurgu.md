# "Ekrandan taşan yetenek" — kurgu (31 Ekim 2026)

**Tek cümle:** Her türlü yetenek İşinn'de hak ettiği vitrinde durur.
**Ton:** Temiz, sakin, premium. Kamera hiç oynamaz, müzik yumuşak, geçişler sessiz çapraz geçiş.
**Kapsayıcılık:** Dört farklı dünya — el emeği, sağlık, eğitim, mühendislik; farklı yaş ve cinsiyetlerden gerçek vitrin sahipleri.

## Sahne düzeni (her sahne ~4 sn, toplam ~20 sn, 9:16)
Aynı masa, aynı dizüstü, aynı ışık. Ekranda **İşinn'in gerçek vitrin sayfası** (gerçek ekran kaydı). Ekrandan tek bir nesne yavaşça masaya taşar. Altta tek satır, büyük ve net yazı.

| # | Vitrin | Ekrandan taşan nesne | Alt yazı |
|---|---|---|---|
| 1 | Ören Bayan Hatice — Dikiş ve Örgü Atölyesi (Tarsus) | Yün yumağı yuvarlanır, ip masada çözülür | **El emeği** |
| 2 | Fzt. İlayda Irmak Demir — Fizyoterapi (Ümraniye) | Egzersiz bandı ekrandan uzanıp masaya serilir | **Sağlık** |
| 3 | Azra — Fen ve Matematik Özel Dersi (İstanbul, 9c872185) | Sayılar ve matematik işaretleri (0–9, +, =, π, √) ekrandan dökülüp masada yığılır | **Eğitim** |
| 4 | Code G Technology — Mühendislik | Küçük bir basınç göstergesi masaya oturur | **Mühendislik** |
| 5 | Kapanış: ekranda İşinn ana sayfası | — | **Yeteneğin ne olursa olsun, hak ettiği vitrinde.** / isinn.com.tr |

Yazı yok: fiyat, "ücretsiz", komisyon, rakam. Yalnızca beş kısa ifade.

## Üretim yöntemi
1. Tek bir "masada dizüstü" başlangıç görseli (sıcak ışık, ahşap masa, sade duvar).
2. Her sahne için başlangıç karesi: o görselin ekranına vitrinin gerçek ekran görüntüsü perspektifle yerleştirilir.
3. Video modeli (Seedance 2.5) yalnızca "nesne ekrandan taşar" hareketini üretir; kamera sabit.
4. Kurgu: kamera sabit olduğu için ekran alanının üstüne **gerçek ekran kaydı** yeniden yerleştirilir → model ekrandaki yazıları bozsa bile izleyici gerçek arayüzü görür.
5. Alt yazılar, çapraz geçişler, telifsiz ambient müzik (Content ID kaydı olmayan) eklenir.

**31 Ekim güncellemesi (1. sahne taslağı):** Üstüne ayrı ekran kaydı yapıştırmak yerine gerçek ekran görüntüsü (2x çözünürlük, fiyat satırları gizli) başlangıç fotoğrafının içine işlendi (GPT Image 2.5, ~2,75 kredi). Böylece ekran sahneyle aynı ışıkta ve çözünürlükte; yapıştırma farkı yok. Seedance taslağında ekran sabit kaldı. Dosyalar: `ekrandan-tasan/` (baslangic-1.png, sahne1-taslak.mp4, sahne1-onizleme.mp4). 480p taslakta ekran yazıları bulanık; 1080p son hâlde netleşir.

**31 Ekim, sahne 2–4:** İlayda (53f5b0b4), Adem (a8d77561, matematik), Code G (97e603c3, akış/basınç) ekranları alındı; "Fiyat belirtilmemiş" de gizlendi. Başlangıç kareleri `baslangic-2/3/4.png` (1. sahne referans verilerek aynı masa/ışık). Video taslakları Higgsfield "grace period günlük üretim sınırı" yüzünden gönderilemedi (kredi düşmedi, bakiye 301,58). Kredisiz akış önizlemesi: `akis-onizleme.mp4`. Not: Adem'in kapağı güneş gözlüklü selfie; kurucu Eğitim sahnesi için **Azra**'yı seçti (31 Ekim), nesne: **dökülen sayılar**. `azra-ekran.png` hazır ve Higgsfield'a yüklü (media c7b0bb7a-9413-4408-b8cc-e0543315956e); başlangıç karesi sınır yüzünden üretilemedi.

**Sınır kalkınca sıra (~53 kredi):** (1) Azra başlangıç karesi (2,75; referans: azra ekranı + 1. sahne karesi e107d1ad); (2) Seedance taslakları 480p, 5 sn, 9:16, sessiz (3×15): İlayda 517de5f9 → turkuaz egzersiz bandı; Azra → mat beyaz/pastel 3B rakamlar ve işaretler (0–9, +, =, π, √) ekrandan yumuşakça dökülüp masada küçük bir yığın olur, ₺ veya fiyat gibi okunan dizi yok; Code G 8bb116e3 → basınç göstergesi.

**31 Ekim, Eğitim sahnesi ücretsiz yolla yapıldı:** `sahne3-sayilar.mp4` (5 sn, 1080x1920). Kaynak `sayilar.html`: baslangic-1.png arka plan + Azra ekranı satır satır ekran dörtgenine yerleştirilip fotoğraftaki ekran beyazına uydurulur; Three.js ile 44 rakam/işaret (Segoe UI Bold, pastel + marka mavisi) ekran düzleminden kırpılarak çıkar, masaya düşer. Kamera fotoğrafa uydurulmuş: y 0,40 m, z 1,54 m, 10° aşağı, fov 29. Kareler headless Chrome + CDP ile `renderAt(t)` çağrılarak alındı. Kare karıştırma (tmix) hızlı nesnelerde hayalet bıraktı, kullanılmadı.

**31 Ekim, düzeltme + Mühendislik:** Kaynak artık `sahne.html?s=sayilar|gosterge` (sayilar.html'in yerini aldı). Rakamlar: yalnızca alttakinin ağırlık merkezi üstüne düşen rakam onun üstünde durur, kenara çarpan kayar → havada asılı rakam yok. Gösterge: paslanmaz gövde, 0–10 bar kadran (canvas dokusu), pirinç bağlantı, RoomEnvironment yansıması; Code G ekranından itilir, masaya iner, ibre sallanıp oturur. Çıktılar: `sahne3-sayilar.mp4`, `sahne4-gosterge.mp4`.

**31 Ekim, kurucu değerlendirmesi:** Kodla yapılan sahneler (sayılar, gösterge) "amatör duruyor". Kod yolu yedek olarak kalır; yayın kalitesi için nesne hareketleri Higgsfield/Seedance ile üretilecek. Not: ana sayfa ekranında "Komisyon yok", "1 Ocak 2027'ye kadar ücretsiz", "Ücretsiz talep oluştur" var; reklam karesinde bunlar gizlenmeli (cdp-shot2 denemesi henüz doğrulanmadı).

## Maliyet (Seedance 2.5, 18 Ekim deneyimine göre; kesin rakam ilk denemede görülür)
- Taslak 480p: ~15 kredi / sahne
- 1080p'ye çevirme: ~80 kredi / sahne
- Dört sahne: taslaklar ~60 + son hâller ~320 = **~380 kredi**. Mevcut bakiye **327,58** → dördü birden sığmaz.
- Öneri: önce **yalnızca 1. sahnenin taslağı (~15 kredi)**; beğenirsen kalan taslaklar, sonra en iyi üçünün 1080p hâli (~300).
- Başlangıç görseli için ya ücretsiz lisanslı stok fotoğraf (indirme onayı gerekir) ya da görsel modeli (birkaç kredi).

## İzinler
Hatice (anne), İlayda (profilini onayladı, video için ayrıca sorulmalı), Adem Güneş (sorulmalı), Code G (kendi şirketin). Paylaşmadan önce her birine videonun son hâli gösterilir.
