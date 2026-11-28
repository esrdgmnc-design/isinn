# Anthropic ile KVKK standart sözleşmesi: e-posta taslağı ve ek bilgileri

**Hazırlayan notu (2026-10-17):** Bu belge avukat incelemesi için taslaktır, hukuki görüş değildir. Köşeli parantez içindeki [ ] alanlar ve "TEYİT" işaretli maddeler avukat ve/veya Anthropic tarafından doğrulanmalıdır. Bu dosya özel belgedir, git'e eklenmez.

---

## 1. Durum özeti (avukat için)

- **Veri sorumlusu:** Code G Teknoloji ve Ticaret Limited Şirketi (marka: İşinn, www.isinn.com.tr)
- **Alıcı:** Anthropic, PBC (ABD). Claude API'yi ticari koşullarla kullanıyoruz.
- **Anthropic'in rolü:** API kullanımında **veri işleyen** olduğu değerlendiriliyor. Anthropic'in ticari koşulları ve DPA'sı da bu yönde. TEYİT
- **Hukuki dayanak ihtiyacı:** KVKK m.9 (7499 s. Kanun ile 2024 değişikliği). ABD için yeterlilik kararı yok. Aktarım düzenli olduğu için açık rıza (arızi aktarım) dayanağı uygun görünmüyor.
- **Önerilen yol:** Kurul'un yayımladığı **standart sözleşme, "Veri Sorumlusundan Veri İşleyene" (VS → Vİ) modülü**. Metin değiştirilmeden, yalnızca ekleri doldurularak imzalanır. İmzadan sonra **5 iş günü içinde Kurul'a bildirim** yapılır. TEYİT: güncel şablon ve bildirim usulü
- **Anthropic'in mevcut belgeleri:** Anthropic'in DPA'sı (AB Standart Sözleşme Maddeleri ile) var. Ancak KVKK standart sözleşmesinin yerine geçmiyor. Bu yüzden Anthropic'ten KVKK şablonunu imzalamasını talep ediyoruz.
- **Şu an canlıda Anthropic'e veri gönderen özellikler:** Aşağıda, Ek bölümünde listelendi. "Ne arıyorsun?" eşleştirmesi bu sözleşme tamamlanana kadar kapalı tutuluyor.

---

## 2. Anthropic'e gönderilecek e-posta (İngilizce)

**Kime:** privacy@anthropic.com (TEYİT: Anthropic'in güncel gizlilik/DPA iletişim adresi; ticari müşteri ise hesap yöneticisi de eklenebilir)
**Konu:** Request to execute the Turkish KVKK Standard Contract (Controller-to-Processor) – Code G Teknoloji / İşinn

> Dear Anthropic Privacy Team,
>
> We are Code G Teknoloji ve Ticaret Limited Şirketi, a company established in Türkiye that operates the service-discovery platform İşinn (www.isinn.com.tr). We use the Claude API under Anthropic's Commercial Terms of Service to power several features of our platform.
>
> Under Article 9 of the Turkish Personal Data Protection Law No. 6698 ("KVKK"), as amended in 2024, transfers of personal data from Türkiye to a country without an adequacy decision require appropriate safeguards. The most practical safeguard is the **Standard Contract** published by the Turkish Personal Data Protection Authority (KVKK Kurulu). The contract must be executed **without modification**, and the data exporter must notify the Authority within five business days of signing.
>
> We understand that Anthropic acts as a **data processor** for API customers and that Anthropic's Data Processing Addendum incorporates the EU Standard Contractual Clauses. However, the Turkish Authority does not accept the EU SCCs in place of its own Standard Contract.
>
> We would therefore like to ask:
>
> 1. Whether Anthropic is willing to execute the KVKK Standard Contract, **Module: Data Controller to Data Processor**, with us as data exporter and Anthropic, PBC as data importer. We will prepare the annexes (description of the transfer, categories of data, technical and organisational measures) and can send the completed draft for your review.
> 2. If Anthropic has already executed this Standard Contract with other Turkish customers, whether a pre-filled version or a standard process is available.
> 3. Confirmation of the current data retention period for API inputs and outputs under our account, and confirmation that API data is not used for model training.
> 4. The list of sub-processors that may process our API data, and the locations of processing.
>
> For reference:
> - Data exporter: Code G Teknoloji ve Ticaret Limited Şirketi, Esentepe Mah. Ecza Sok. Pol Center Sitesi C Blok No:4/6, Şişli/İstanbul, Türkiye. Tax ID (VKN): 2111455428, MERSİS: 0211145542800001
> - Contact: Esra Güneş, esra.gunes@codegtechnology.com
> - Anthropic account / organisation ID: [ORGANISATION ID]
>
> Thank you in advance. We look forward to your reply.
>
> Best regards,
> Esra Güneş
> Code G Teknoloji ve Ticaret Limited Şirketi

---

## 3. Sözleşme ekleri için doldurulacak bilgiler (Türkçe taslak)

### Ek 1: Taraflar
| | Veri ihracatçısı (veri sorumlusu) | Veri ithalatçısı (veri işleyen) |
|---|---|---|
| Unvan | Code G Teknoloji ve Ticaret Limited Şirketi | Anthropic, PBC |
| Adres | Esentepe Mah. Ecza Sok. Pol Center Sitesi C Blok No:4/6, Şişli/İstanbul | [Anthropic adresi, TEYİT] |
| Vergi / MERSİS | VKN 2111455428 / MERSİS 0211145542800001 | — |
| İrtibat | Esra Güneş, esra.gunes@codegtechnology.com | [Anthropic irtibat] |
| VERBİS kaydı | [VERBİS kayıt durumu, TEYİT: yükümlülük eşiği] | — |

### Ek 2: Aktarımın açıklaması
**Veri sahibi grupları:** Sitenin ziyaretçileri, hizmet arayan kullanıcılar, hizmet veren (vitrin sahibi) kullanıcılar.

**Aktarılan veri ve amaç, özellik bazında:**

| Özellik | Gönderilen içerik | Amaç | Durum |
|---|---|---|---|
| Destek Asistanı (`/api/claude`) | Kullanıcının yazdığı destek mesajları | Soruya yanıt üretmek | Canlıda |
| Yeteneğini Keşfet (`/api/talent`) | Kullanıcının "yapmayı sevdiğim şey" metni | Hizmet ve vitrin fikri önermek | Canlıda |
| İş eşleştirme (`lib/jobMatchRun.js`) | Talep metni + vitrin başlık ve açıklamaları (sağlayıcı adları gönderilmez) | Talebe uygun vitrinleri sıralamak | Canlıda |
| Fotoğraf kontrolü (`/api/listing-photo-check`) | Vitrine yüklenen fotoğraf (küçültülmüş) | Uygunsuz içerik denetimi | Canlıda |
| Değerlendirme medyası kontrolü (`/api/review-media`) | Yoruma eklenen fotoğraf | Uygunsuz içerik denetimi | Canlıda |
| "Ne arıyorsun?" eşleştirmesi (`/api/need-match`) | Ziyaretçinin ihtiyaç metni | Uygun vitrinleri önermek | **Kapalı** (sözleşme bekleniyor) |

**Veri kategorileri:**
- Kullanıcının serbest yazdığı metinler. Gönderimden önce telefon, e-posta, TC kimlik no ve IBAN gibi doğrudan tanımlayıcılar otomatik olarak maskeleniyor (`lib/piiScrub.js`). Serbest metin olduğu için başka kişisel bilgiler arızi olarak yer alabilir.
- Fotoğraflar: Yüklenen görsellerde kişilerin yüzü ya da görüntüsü bulunabilir.
- **Özel nitelikli veri:** Amaçlanmıyor. "Ne arıyorsun?" sağlıkla ilgili metinleri yapay zekâya hiç göndermiyor. Diğer serbest metin alanlarında kullanıcı kendiliğinden yazabilir. TEYİT: Avukat bu riskin nasıl ele alınacağını değerlendirmeli.

**Aktarım sıklığı:** Sürekli. Kullanıcı özelliği her kullandığında gerçekleşir.

**Saklama süresi (ithalatçı tarafı):** Anthropic'in ticari koşullarına göre API girdileri ve çıktıları sınırlı süre saklanır ve model eğitiminde kullanılmaz. TEYİT: Kesin süreyi Anthropic yazılı olarak bildirmeli (e-postadaki 3. soru).

**Saklama (ihracatçı tarafı):**
- "Ne arıyorsun?" metni saklanmaz. Yalnızca tekrar eden sorgular için tek yönlü özet (hash) ile kısa süreli önbellek tutulur.
- Diğer özelliklerin kayıt ve saklama süreleri İşinn'in kendi veri envanterine göre belirlenmeli. [Avukat ile netleştirilecek]

### Ek 3: Teknik ve idari tedbirler (İşinn tarafı)
- Aktarım yalnızca TLS ile şifreli API bağlantısı üzerinden yapılır.
- Gönderimden önce doğrudan tanımlayıcılar otomatik olarak maskelenir.
- Gerekli olmayan veriler gönderilmez (veri en aza indirme). Örneğin iş eşleştirmede sağlayıcı adları gönderilmez, fotoğraflar küçültülerek gönderilir.
- Kötüye kullanıma karşı IP başına istek sınırı ve günlük kullanım tavanı uygulanır.
- API anahtarları yalnızca sunucuda tutulur, tarayıcıya gönderilmez.
- Kullanıcılar KVKK Aydınlatma Metni ve Gizlilik Politikası'nda yapay zekâ kullanımı ve yurt dışı aktarım hakkında bilgilendirilir. iOS uygulamasında yapay zekâ özellikleri ilk kullanımda ayrıca onay penceresi gösterir. Web sitesinde böyle bir pencere yok.

---

## 4. Avukata sorulacaklar
1. VS → Vİ modülü doğru mu? Anthropic'in rolü (veri işleyen) KVKK açısından nasıl değerlendirilir?
2. Anthropic şablonu imzalamayı reddederse ne olur? Alternatif yol var mı (örneğin taahhütname ile Kurul izni)? Bu süreçte canlıdaki yapay zekâ özellikleri için risk nasıl yönetilmeli?
3. Kurul'a bildirimin usulü ve süresi nedir (5 iş günü)? Bildirim yapılmazsa yaptırım nedir?
4. Fotoğraf kontrolü (yüz içerebilir) ve serbest metinlerde kendiliğinden yazılabilecek özel nitelikli veriler için ek tedbir gerekir mi?
5. Aydınlatma metnindeki yurt dışı aktarım bölümü sözleşme imzalanınca nasıl güncellenmeli? (Kodda bu konuda bir not var: `app/kvkk-aydinlatma-metni/page.js`)
6. VERBİS kayıt yükümlülüğü bizim için doğuyor mu?
