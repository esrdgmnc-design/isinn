// 90 günlük "herkese ücretsiz" dönem (karar: 2026-09-21). Bu tarihe kadar yeni plan/paket
// satın alımı kapalı (Planlar sayfası mat), mevcut tüm hesaplar ücretsiz deneme/abonelikle
// açık. Tarih geçince satış kendiliğinden yeniden açılır; fiyatlar kitle geldikçe yeniden
// konuşulacak. Bir sonraki adım için bu dosyaya bakın.
export const FREE_PERIOD_UNTIL_ISO = "2026-12-20T20:00:00Z";

export function isFreePeriod(now = Date.now()) {
  return now < new Date(FREE_PERIOD_UNTIL_ISO).getTime();
}
