# İşinn — Claude bağlayıcı dizini başvurusu (31 Ekim 2026)

Portal: https://claude.ai/directory/manage → **Submit new** → **MCP connector**. Ücretli Claude planı gerekir, ayrı ücret yok.
Kaynak: https://claude.com/docs/connectors/building/submission · https://claude.com/docs/connectors/building/review-criteria
Gönderim otomatik taranır, varsayılan olarak "Community" bağlayıcı olarak listelenir.

## Hazır olanlar
- Sunucu: https://www.isinn.com.tr/api/mcp (HTTPS, Streamable HTTP, kimlik doğrulama yok)
- 3 araç, hepsinde `title` + `readOnlyHint: true` + `destructiveHint: false`
- Belge: https://www.isinn.com.tr/yapay-zeka-araci (TR + EN)
- Gizlilik: https://www.isinn.com.tr/gizlilik-politikasi
- İkon: `docs/chatgpt-uygulama/isinn/assets/logo.webp` (512×512; portal PNG isterse dönüştürülür)

## Portal adımları ve cevaplar

**1. Connection:** `https://www.isinn.com.tr/api/mcp` — tek URL.

**2. Tools:** Otomatik gelir: search_vitrins, get_vitrin, list_categories (hepsi read-only).

**3. Listing**
- Server name: `İşinn`
- One-liner (≤200): `Search public listings of service providers in Turkey — tutors, designers, translators, movers, pilates instructors, physiotherapists and more.`
- Description (≤2000):
  > İşinn is a service discovery platform in Turkey where people publish listings ("vitrin") for the services they offer. This connector lets Claude search those public listings.
  >
  > Ask for a service and, optionally, a city or district — for example "find a math tutor in Istanbul for LGS" or "a pilates studio in Sarıyer" — and Claude returns matching listings with the provider's display name, category, location, the provider's stated price and a link to the listing. You can open one listing for its full description or list the categories that currently have active listings. Providers who work remotely appear for every city.
  >
  > The connector is read-only and returns only information already shown publicly on listing pages. It never returns phone numbers, e-mail addresses or account data. Contact with a provider happens on the listing page. İşinn does not handle payments between users and does not guarantee service quality; prices are stated by providers. Listing content is in Turkish.
- Categories: Local / Lifestyle (portalda en yakın seçenekler; en fazla 5)
- Documentation URL: https://www.isinn.com.tr/yapay-zeka-araci
- Privacy policy URL: https://www.isinn.com.tr/gizlilik-politikasi
- Support contact: esra.gunes@codegtechnology.com
- URL slug: `isinn` (yayından sonra değişmez)

**4. Use cases:** Finding a private tutor, designer, translator, mover, fitness or health-care professional in Turkey; checking a provider's listing details. Users need nothing before connecting (no account). Reads data only.

**5. Company:** CODE G LTD (Code G Teknoloji ve Ticaret Limited Şirketi) · https://www.isinn.com.tr · birincil iletişim: Esra Güneş, esra.gunes@codegtechnology.com

**6. Authentication:** No authentication.

**7. Data handling:** Own first-party API (İşinn's own database). No personal health data handled by the tools (listings may describe health services such as physiotherapy, but no patient data). No sponsored content.

**8. Test & launch:** No account needed. Add `https://www.isinn.com.tr/api/mcp` as a custom connector, then try: "İstanbul'da matematik özel dersi veren öğretmen bul", "Sarıyer'de pilates", "Online İngilizce dersi", then ask for details of the first result (get_vitrin), and "İşinn'de hangi kategoriler var?" (list_categories). Every tool was run by us as a custom connector in Claude and via direct JSON-RPC calls.

**9. Compliance:** 7 onay kutusu (dizin kuralları, birinci taraf API, finansal işlem yok, AI medya üretimi yok, prompt injection yok, sohbet verisi toplama yok, herkese açık belge). Hepsine uyuyoruz.

**10. Review and submit:** Kurucu son kontrolü yapıp gönderir.

## Claude testi (31 Ekim 2026): TAMAM
İşinn kurucunun Claude hesabına özel bağlayıcı olarak eklendi (giriş yok). Tek sohbette üç araç da çalıştı: list_categories (22 kategori), search_vitrins (İstanbul matematik), get_vitrin (Azra). Claude'un fark ettiği sıralama sorunu (matematik aramasına İngilizce dersler karışıyordu) düzeltildi ve canlıda.

## (Eski not) Gönderimden önce kalan iş
Portaldaki 8. adım "her aracı Claude'da özel bağlayıcı olarak denedim" onayı istiyor. ChatGPT'de denendi; Claude'da da İşinn'i özel bağlayıcı olarak ekleyip üç aracı birer kez çalıştırmak gerekiyor.
