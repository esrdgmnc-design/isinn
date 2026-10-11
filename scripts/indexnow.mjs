// IndexNow: Bing, Yandex, Naver ve Seznam'a "bu adresler yeni/güncel" bildirir (Google IndexNow'u desteklemez; onun için Search Console kullanılır).
// Kullanım: INDEXNOW_KEY=<anahtar> node scripts/indexnow.mjs [sitemap-adresi]
// Anahtar dosyası https://www.isinn.com.tr/<anahtar>.txt adresinde yayında olmalı (public/ altındaki dosya). Anahtar gizli değildir.
const HOST = "www.isinn.com.tr";
const KEY = process.env.INDEXNOW_KEY;
if (!KEY || !/^[a-f0-9]{16,128}$/i.test(KEY)) { console.log("INDEXNOW_KEY gerekli (public/<anahtar>.txt dosyasının adı)."); process.exit(1); }
const sitemap = process.argv[2] || `https://${HOST}/sitemap.xml`;
const xml = await (await fetch(sitemap)).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(`https://${HOST}`));
if (!urlList.length) { console.log("Site haritasında adres bulunamadı."); process.exit(1); }
const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} adres gönderildi, yanıt ${res.status} (200/202 = kabul edildi, 403 = anahtar dosyası doğrulanamadı, 422 = adres/anahtar uyuşmuyor, 429 = çok sık)`);
