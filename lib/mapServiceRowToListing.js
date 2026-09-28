// components/IsinnApp.jsx'ten taşındı (2026-09-28) — bu saf fonksiyonlar hem
// o "use client" dosyasında hem de sunucu bileşenlerinde (app/page.js, ana
// sayfanın realListings başlangıç durumunu gerçek veriyle doldurmak için)
// kullanılıyor. Bir server component "use client" işaretli bir dosyadan
// isimli bir fonksiyon import etmeye çalışınca Next.js onu çağrılabilir bir
// fonksiyon değil, bir client-reference nesnesine çeviriyor (build hatası:
// "TypeError: object is not a function") — bu yüzden paylaşılan, "use client"
// İÇERMEYEN bu dosyaya taşındı.
export const FALLBACK_LISTING_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600";

export function formatPriceLabel(price, priceType) {
  if (price == null) return priceType === "hourly" ? "Fiyat belirtilmemiş/saat" : "Fiyat belirtilmemiş";
  const formatted = Number(price).toLocaleString("tr-TR");
  if (priceType === "hourly") return `${formatted}₺/saat`;
  if (priceType === "quote") return "Teklif alın";
  return `${formatted}₺'den`;
}

export function mapServiceRowToListing(row) {
  const profile = row.profiles;
  const category = row.categories;
  // Görünecek isim artık vitrine özel (services.display_name) — eskiden
  // profiles.business_name'i paylaşıyordu, bu da bir vitrinde ismini
  // değiştirince diğer tüm vitrinlerin de adını sessizce değiştiriyordu (gerçek
  // bir hataydı). display_name boşsa (henüz ayarlanmamış eski vitrinler) eski
  // paylaşılan isme düşülüyor.
  const provider = (row.display_name && row.display_name.trim()) || (profile?.business_name && profile.business_name.trim()) || profile?.full_name || "Sağlayıcı";
  return {
    id: row.id,
    dbId: row.id,
    isReal: true,
    category: category?.slug || "",
    categoryDbId: row.category_id,
    customCategoryLabel: row.custom_category_label || "", // bkz. CUSTOM_CATEGORY_ID
    mode: row.is_remote ? "remote" : "local",
    title: row.title,
    provider,
    providerId: row.provider_id,
    city: row.is_remote ? "Uzaktan" : (row.city || "Belirtilmemiş"),
    price: formatPriceLabel(row.price, row.price_type),
    rating: 0,
    reviewCount: 0,
    img: (Array.isArray(row.images) && row.images[0]) || FALLBACK_LISTING_IMG,
    desc: row.description || "",
    level: "new",
    // "Doğrulanmış" değil bilerek — kimse belgeyi incelemedi/onaylamadı, sadece
    // en az bir sertifika yüklendiğini dürüstçe belirtiyoruz (bkz.
    // vitrin_media.sql'deki sync_service_has_certificates — artık vitrin bazlı,
    // bir vitrindeki belge başka vitrini etkilemiyor).
    verified: row.has_certificates ? ["Belge Paylaştı"] : [],
    // Meslek odası/lisans/sicil no — sağlayıcının kendi yazdığı serbest metin,
    // DOĞRULANMADI (bkz. professional_credential.sql). ListingDetail bunu ayrı,
    // açıkça "sağlayıcı beyanı" etiketiyle gösteriyor — verified rozetiyle
    // karıştırılmasın diye bilerek ayrı bir alan.
    professionalCredential: row.professional_credential || "",
    // GERÇEK HATA (2026-09-15, kullanıcının "vitrinime giren kişi videomu
    // göremiyor" şikayetiyle bulundu — bir önceki "yükleniyor" göstergesi
    // yeterli değildi, gecikme hâlâ kötü bir ilk izlenimdi): ana select zaten
    // "*" ile video_intro_url'i getiriyordu, ama mapServiceRowToListing onu
    // hiç taşımıyordu — ListingDetail bu yüzden AYRI bir sorguyla, gecikmeli
    // olarak çekmek zorunda kalıyordu. Artık video, vitrin listesi ilk
    // yüklendiği anda (ana sayfa/arama/karusel) zaten elde — detay sayfası
    // açılır açılmaz, hiç beklemeden gösterilebiliyor.
    videoIntroUrl: row.video_intro_url || null,
    videoIntroName: row.video_intro_name || null,
    // Eskiden burada her zaman "evde" sabitlenmişti — sağlayıcının formda
    // ne seçtiğine hiç bakılmıyordu (alan zaten kaydedilmiyordu). Artık
    // gerçek services.home_service_type okunuyor, yoksa (eski satırlar için)
    // eski varsayılana düşülüyor.
    homeService: row.is_remote ? undefined : (row.home_service_type || "evde"),
    // Örnek (demo) vitrin — açıklaması "DEMO VİTRİN" ile başlıyorsa. Ayrı bir kolon
    // yok (migration gerektirmesin); kartlarda ve detayda görünür rozet gösteriliyor.
    isDemo: /^s*DEMO V[İI]TR[İI]N/i.test(row.description || ""),
    isBoosted: false, // fetchListings, aktif Öne Çıkarma Paketi'ne göre bunu güncelliyor
    // Değerlendirmeler bu vitrinle diğer vitrinler arasında birleşik mi
    // gösterilsin (varsayılan) yoksa sadece bu vitrine mi özel — vitrin
    // sahibinin kararı (bkz. OwnerVitrinPanel, vitrin_media.sql).
    shareProfileReviews: row.share_profile_reviews ?? true,
  };
}
