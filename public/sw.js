// İşinn PWA/TWA service worker — Play Store'un Android paketi (AAB) üretimi
// için gerekli (bkz. Play Console/PWABuilder süreci notları). Bilerek MİNİMAL:
// bu bir hizmet pazaryeri, fiyat/ilan gibi veriler her zaman TAZE olmalı —
// agresif bir önbellekleme stratejisi eski/yanlış fiyat göstermek gibi gerçek
// bir riske yol açar. Sadece statik ikonları ve basit bir "çevrimdışı" sayfayı
// önbelleğe alıyor, geri kalan HER İSTEK doğrudan ağa gidiyor (pass-through) —
// bu, "installability" (yüklenebilirlik) kontrolü için yeterli, veri
// tazeliğinden ödün vermiyor.
const CACHE_NAME = "isinn-shell-v1";
const PRECACHE_URLS = [
  "/offline.html",
  "/icons/icon-192.webp",
  "/icons/icon-512.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Sadece sayfa navigasyonlarında (HTML) ağ başarısız olursa çevrimdışı
  // sayfasına düş — API/veri isteklerine hiç dokunma, her zaman ağa gitsinler.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html"))
    );
  }
});
