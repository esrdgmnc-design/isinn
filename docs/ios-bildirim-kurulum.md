# iOS bildirim ve bağlantı kurulumu (Esra yapar, sırlar sohbete/repoya yazılmaz)

Kod hazır ve yayında (iOS dışında hiçbir şeyi etkilemez). Bildirimin çalışması için aşağıdaki sırayla yapılacaklar var.

## 1. Supabase: tablo (SQL Editor'de çalıştır)
`supabase/push_tokens_2026_10_12.sql` dosyasının içeriğini yapıştırıp çalıştır. (Cihaz anahtarı tablosu + `notifications.push_sent_at` kolonu.)

## 2. Apple: bildirim anahtarı (.p8)
1. developer.apple.com → Certificates, Identifiers & Profiles → Keys → `+`
2. Ad: `isinn-apns`, "Apple Push Notifications service (APNs)" kutusunu işaretle → Continue → Register → Download.
   `.p8` dosyası yalnızca BİR KEZ iner. Parola yöneticisine koy. Repoya ya da sohbete koyma.
3. Key ID (10 karakter) aynı sayfada. Team ID: developer.apple.com → Membership details.

## 3. Vercel ortam değişkenleri (Production, "Sensitive" aç)
- `APNS_KEY_ID` = Key ID
- `APNS_TEAM_ID` = Team ID
- `APNS_BUNDLE_ID` = `com.isinn.app`
- `APNS_PRIVATE_KEY_B64` = .p8 dosyasının base64'ü. PowerShell'de ekrana yazdırmadan panoya al:
  `[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\yol\AuthKey_XXXX.p8")) | Set-Clipboard`
- `PUSH_WEBHOOK_SECRET` = rastgele uzun bir metin (en az 32 karakter)
Sonra Vercel'de yeniden dağıt (Redeploy).

## 4. Supabase webhook
Dashboard → Database → Webhooks → Create: tablo `notifications`, olay `INSERT`, tür HTTP Request, `POST`,
URL `https://www.isinn.com.tr/api/push/send`, başlık `Authorization: Bearer <PUSH_WEBHOOK_SECRET'in aynısı>`.

## 5. Universal Link (vitrin bağlantıları uygulamada açılsın)
Team ID'yi bana yaz (gizli değil, herkese açık dosyaya girecek). Ben `public/.well-known/apple-app-site-association`
dosyasını eklerim. Şablon:
`{"applinks":{"details":[{"appIDs":["TEAMID.com.isinn.app"],"components":[{"/":"/reset-password*","exclude":true},{"/":"/api/*","exclude":true},{"/":"/odeme*","exclude":true},{"/":"/"},{"/":"/vitrin/*"},{"/":"/kategori/*"},{"/":"/sehir/*"},{"/":"/rehber/*"}]}]}}`

## 6. Mac'te Xcode
App hedefi → Signing & Capabilities: Team'i seç. "Push Notifications" ve "Associated Domains" listede görünmeli
(kod tarafında `App.entitlements` hazır; görünmezse `+ Capability` ile ekle). iPhone'da Bildirim izni, ilk mesajı
gönderdikten sonra sorulur.

## Neler bağlı
- Push gelen bildirim türleri: yeni mesaj, yeni ilan eşleşmesi, ilan için önerilen vitrinler, kayıtlı arama, teslim, medya onay/ret, vitrin metni değişikliği.
- Bağlı olmayanlar: favori (gürültü), yönetici bildirimleri, abonelik/ödeme hatırlatmaları (iOS'ta Planlar gizli).
- Kilit ekranında mesaj metni görünmez, sabit kısa başlıklar kullanılır. Günde en çok 4 bildirim.
- Çıkış yapınca bu cihazın kaydı silinir.
