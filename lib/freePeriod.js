// "Ücretsiz lansman" dönemi (ilk karar 2026-09-21: 20 Aralık 2026; 2026-10-16: 1 Ocak 2027'ye uzatıldı). Bu tarihe kadar yeni plan/paket
// satın alımı kapalı (Planlar sayfası mat), mevcut tüm hesaplar ücretsiz deneme/abonelikle
// açık. Tarih geçince satış kendiliğinden yeniden açılır; fiyatlar kitle geldikçe yeniden
// konuşulacak. Bir sonraki adım için bu dosyaya bakın.
export const FREE_PERIOD_UNTIL_ISO = "2027-01-01T20:00:00Z";

export function isFreePeriod(now = Date.now()) {
  return now < new Date(FREE_PERIOD_UNTIL_ISO).getTime();
}
