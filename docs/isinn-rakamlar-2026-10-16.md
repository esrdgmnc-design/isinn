# İşinn: tüm rakamlar (2026-10-16, ham veri: kurucu çevresi ve test dahil)

Kaynak: canlı Supabase veritabanı (yalnızca okuma). Ayrıntı: `ekran_goruntuleri/tum_rakamlar_2026-10-16.json`.
**Başvuruda kullanırken** her rakamın yanına "kurucu çevresi ve test dahil" notu eklenmeli. Bağımsız ve organik kısmı ayrı ölçülmüyor.

## Düzeltmeler (önceki söylediklerim)
- **Gelir 0 TL değil.** 3 başarılı ödeme var, toplam **1.447 TL** (13-14 Eylül, ücretsiz dönem kararından önce). Bunun 649 TL'si kurucu hesabının kendi Pro satın alması; 798 TL (Pro 649 + haftalık öne çıkarma 149) başka bir hesaptan (bulutyudum). Pro fiyatı o gün 649 TL'ymiş, şimdi 399 TL.
- **İki taraflı onaylı iş 0 değil, 1.** O iş: müşteri tarafı kurucu hesabı, hizmeti veren başka hesap (JAAS vitrini). Müşteri onayı bugün (16 Ekim) 11:54 UTC'de verilmiş. Yani **bağımsız bir müşteri onayı değil.**
- "Aktif ilan" 5 (20 değildi).

## Kullanıcılar
| | |
|---|---|
| Kayıtlı hesap | **46** (41 e-posta, 5 Google) |
| E-postası doğrulanmış | 41 |
| Son 7 gün / 14 gün / 30 gün yeni kayıt | 10 / 12 / 32 |
| Son 14 günde giriş yapan | 15 |
| Profil kaydı | 40 (hepsi "müşteri" tipi kayıtlı) |
| Telefonu doğrulanmış | 23 |
| Profil fotoğrafı / biyografi / şehir dolu | 15 / 18 / 24 |
| Şehirler | İstanbul 12, Mersin 6, Bursa 2, Adana 2, Konya 1, İzmir 1 |
| Yönetici | 1 |
Kayıt günleri: 5 Eylül'den bugüne; en yoğun günler 29 Eylül (7 kayıt), 15 Ekim (6 kayıt). Son iki haftadaki artış büyük ölçüde Android test kullanıcılarından.

## Vitrinler ve portföy
| | |
|---|---|
| Vitrin toplam | 31 (**27 gerçek**, 4 demo) |
| Aktif gerçek vitrin | 27 (pasif 0) |
| Vitrini olan hesap | 19 |
| Fotoğraflı / videolu | 27 / 5 |
| Çalışma bağlantısı / sertifika beyanı | 2 / 1 |
| Fiyat türü | 22 sabit, 5 saatlik |
| Kullanılan kategori | 12 (toplam 68 kategori var) |
| Kategoriler | Öğretmen 10, Diğer 4, Oyun Ablası 2, Yazılım 2, Yoga ve Yaşam Koçu 2, Nailart, Makyaj, Sanal Asistan, Nakliye, Tadilat 1'er |
| Son 14 günde açılan | 3 |
| Portföy öğesi | 34 (30 fotoğraf, 4 video) |

## İşler ve mesajlar
| | |
|---|---|
| "Hizmet Arıyorum" ilanı | 6 (**5 aktif**, 1 pasif test), 3 farklı sahip |
| Vitrinden başlayan görüşme | 14, **8 farklı müşteri hesabından** |
| Durum | 8 "tamamlandı", 6 "görüşülüyor" |
| İki taraflı onaylı iş | **1** (müşteri kurucu hesabı, bağımsız değil) |
| Yalnız hizmet verenin / yalnız müşterinin onayladığı | 4 / 1 |
| Mesaj | 30, 14 konuşmada, 8 farklı hesaptan |
| İki tarafın da yazdığı konuşma | 6 |
| Konuşma başına mesaj | 2,1 (son 14 günde 7 mesaj) |

## Yorumlar
3 yorum, ortalama **5,0** (hepsi 5 yıldız), **2'si fotoğraflı** (1 onaylı, 1 onay gerekmiyor), hizmet verenin yanıtladığı 0, "iki taraflı onaylı" etiketli 0.

## Etkileşim
- Favori: 27 (26 vitrin, 1 ilan).
- Arama: 147 arama, **68'i sonuç bulamamış (%46)**, son 14 günde 47. En çok aranan: danışman 13, yazılım 12, öğretmen 11, temizlik 8, hareketli 8, ders 6, web 5.
- Bildirim: 51 (yeni mesaj 26, vitrin favorilendi 16, iş teslim 7, medya onayı 1, yapay zekâ eşleşmesi 1). Kayıtlı push/e-posta gönderimi 0.
- Destek: 7 bilet (5 açık, 2 reddedildi). Kullanıcı şikayeti 1 (reddedildi).

## Üyelik ve ödeme
| | |
|---|---|
| Abonelik | 38: 34 deneme (standart), 4 aktif (pro) |
| Ek paket | 4 |
| Sipariş | 5: **3 başarılı**, 2 başarısız |
| Başarılı toplam | **1.447 TL** (kurucu hesabı 649 TL + bir başka hesap 798 TL) |

## Yapay zekâ kullanımı (hepsi son 14 gün)
39 çağrı, hepsi başarılı. Yeteneğini Farket 15, arama genişletme 11, ürün önerisi 3, destek sohbeti 3, ilan metni 3, açılış mesajı 2, teklif açılış mesajı 1, ilan yazma 1. Toplam 81.375 girdi ve 11.737 çıktı token, ortalama yanıt 7,2 sn.

## Trafik (21 Eylül'den beri takip)
| | |
|---|---|
| Olay | 2.199 (589'u, %27, iç trafik işaretli) |
| Oturum | 453, iç trafik hariç **376** |
| Son 14 gün oturum (iç hariç) | 243 |
| Son 7 gün oturum (iç hariç) | 186 |
| Girişli hesap | 18 |
| Sayfa görüntüleme | 1.175 (son 7 gün 322, son 14 gün 437; 12 Ekim zirvesi 138) |
| Önemli olaylar | uygulama açılışı 1.573, vitrin görüntüleme 138, Yeteneğini Farket sayfası 116, arama 85, Yeteneğini Farket gönderimi 28, vitrin oluşturma 11, kayıt gönderimi 10, mesaj gönderimi 16, ilan oluşturma 2 |

## Mağaza durumu (veritabanı dışı)
Android: Google Play kapalı testte, 12+ kayıtlı test kullanıcısı (liste 18 adres), 14 günlük sayım sürüyor. iOS: App Store incelemesinde. Web: yayında.
