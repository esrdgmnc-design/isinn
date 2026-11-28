# İşinn — ChatGPT uygulama dizini başvurusu (29 Ekim 2026)

Paket hazır: `docs/chatgpt-uygulama/isinn/` (plugin.json + mcp.json + logo). Yalnızca **demo video bağlantısı** eksik.
Kaynak: [Gönderim adımları](https://developers.openai.com/apps-sdk/deploy/submission), [Gönderim kuralları](https://developers.openai.com/apps-sdk/app-submission-guidelines).

## Senin yapacakların (sırayla)
1. **OpenAI Platform hesabı** (platform.openai.com) — kuruluş sahibi sen olmalısın.
2. **Doğrulama:** Ayarlar → Organization → doğrulama. Dizinde "CODE G LTD" adıyla görünmek için **işletme doğrulaması** (şirket belgeleri istenebilir); bireysel doğrulama da mümkün ama o zaman adın görünür.
3. **Developer Mode'da dene:** ChatGPT → Ayarlar → Apps/Connectors → Gelişmiş → Developer Mode'u aç → yeni uygulama ekle → adres: `https://www.isinn.com.tr/api/mcp`, kimlik doğrulama: yok.
4. **Demo video:** Developer Mode'dayken 1–2 dakikalık ekran kaydı: "İstanbul'da matematik özel dersi veren öğretmen bul" → sonuçlar → bir vitrinin ayrıntısı. Videoyu YouTube'a "liste dışı" yükle; bağlantıyı bana ver, pakete eklerim.
5. **Alan adı doğrulaması:** Başvuru ekranı bir kod (token) verecek. Bana gönder; `isinn.com.tr/.well-known/openai-apps-challenge` adresine koyup canlıya alırım (5 dk).
6. **Yükleme:** Plugins sayfası → Upload new plugin → paket ZIP'i (ben hazırlarım) → MCPs → Connect → tarama → Submit for review → politika onay kutuları. Sonuç e-postayla gelir; onaylanınca **Publish plugin**.

## Benim hazırladıklarım
- Görünen ad: **İşinn** · Alt başlık: "Türkiye'de hizmet veren bul"
- Uzun açıklama (TR), 3 örnek istem, 5 olumlu + 3 olumsuz test senaryosu
- Gizlilik, kullanım şartları, destek bağlantıları (mevcut sayfalar)
- Araçlar kurallara uygun: salt okuma, `readOnlyHint/destructiveHint/openWorldHint` açıkça belirtildi, kişisel veri istemiyor, telefon/e-posta döndürmüyor, ödeme/abonelik yok
- Kategori şimdilik "Lifestyle"; yüklerken açılır listede en yakın seçenek seçilecek

## Bilinmeyenler
- İnceleme süresi açıklanmamış.
- Türkiye'deki ChatGPT kullanıcılarına görünürlük ve kaç kişinin kullanacağı belirsiz; çağrıları `events` tablosunda `mcp_tool_call` olarak sayıyoruz (29 Ekim'deki ilk kayıtlar test).
- Uzun açıklama Türkçe; İngilizce çeviri istenirse eklerim.
