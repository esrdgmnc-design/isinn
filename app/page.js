import HomeClient from "../components/HomeClient";
import { faqJsonLd } from "../lib/faqJsonLd";
import { supabase } from "../lib/supabaseClient";
import { SEO_CATEGORIES } from "../lib/seoTaxonomy";
import { mapServiceRowToListing } from "../lib/mapServiceRowToListing";

// Ana sayfa artık sunucu bileşeni: kanonik adres "/" (parametreli ?vitrin=… gibi URL'ler
// ayrı sayfa sayılmasın) ve SSS şeması yalnızca burada.
export const metadata = {
  title: "Ne İş Yapabilirim? Becerinden Hizmet Vitrini | İşinn",
  description: "Becerilerini yaz, yapay zekâ 1-2 hizmet fikri ve hazır vitrin taslağı önersin. Denemek için üyelik gerekmez, komisyon yok. Hizmet bulmak da burada.",
  alternates: { canonical: "/" },
};

// SEO denetiminde bulunan en kritik sorun: <HomeClient/> tamamen "use client"
// ve gerçek içeriği (kategoriler, vitrinler) useEffect+Supabase ile istemci
// tarafında çekiyor — Google'ın/AI botlarının ilk HTML'inde H1 dahil hiçbir
// gerçek metin yoktu. IsinnApp.jsx'in karmaşık, elle ayarlanmış durum
// yönetimine (boost/puan/seededDailyShuffle mantığı) dokunmadan, düşük riskli
// bir çözüm: gerçek verilerle dolu bir "Popüler Kategoriler / Yeni Eklenen
// Vitrinler" keşif bölümü için veri burada (sunucuda) çekilip prop olarak
// HomeClient → IsinnApp → HomeView'a taşınıyor, JSX'in kendisi HomeView'ın
// içinde (sadece view==="home" iken) render ediliyor — böylece SPA başka bir
// view'a (ör. yönetim paneli) geçtiğinde bu blok da gerçekten kayboluyor
// (2026-09-28'de fark edilen bir hatanın düzeltmesi: önceden bu JSX burada,
// <HomeClient/>'ın dışında koşulsuz render ediliyordu).
async function getDiscoveryData() {
  // "*" ile fetchListings'in (IsinnApp.jsx) kendi seçimiyle aynı — bu, aşağıda
  // mapServiceRowToListing'e eksiksiz, gerçek şekilli satırlar veriyor (ayrıca
  // GERÇEK BUG DÜZELTMESİ, 2026-09-28: bu satırların işlenmiş hali artık
  // realListings'in başlangıç durumunu da besliyor — bkz. Page() içindeki not).
  const { data } = await supabase
    .from("services")
    .select("*, profiles(business_name, full_name), categories(name, slug)")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(300);

  const indexable = (data || []).filter((row) => {
    const d = (row.description || "").trim();
    return !d.startsWith("DEMO VİTRİN") && d.length >= 40;
  });

  const countByCategorySlug = {};
  for (const row of indexable) {
    const slug = row.categories?.slug;
    if (!slug) continue;
    countByCategorySlug[slug] = (countByCategorySlug[slug] || 0) + 1;
  }
  const popularCategories = SEO_CATEGORIES
    .map((c) => ({ ...c, count: countByCategorySlug[c.slug] || 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const recentListings = indexable.slice(0, 8);

  // GERÇEK BUG (2026-09-28, kullanıcı "bir yapay zeka aracı sitemi neden
  // göremiyor, yükleniyor hatası alıyor" diye fark etti): realListings state'i
  // IsinnApp.jsx'te [] ile başlıyor, gerçek veri sadece mount-sonrası bir
  // useEffect'te (fetchListings) çekiliyordu — JS çalıştırmayan hiçbir araç
  // (AI arama botları dahil) bu efekti hiç tetiklemediği için ham HTML'de ana
  // vitrin ızgarası sonsuza kadar "Vitrinler yükleniyor..." gösteriyordu.
  // Aynı satırları mapServiceRowToListing'den geçirip ilk render'ı (SSR dahil)
  // gerçek veriyle başlatıyoruz — fetchListings() mount sonrası bunu güncel/tam
  // listeyle (rating, boost vb. ile zenginleştirilmiş) sessizce değiştiriyor.
  const initialListings = indexable.map(mapServiceRowToListing);

  return { popularCategories, recentListings, initialListings };
}

// Ana sayfa build anında dondurulmasın: yeni vitrinler en geç 1 saat içinde yansır.
export const revalidate = 3600;

export default async function Page() {
  const { popularCategories, recentListings, initialListings } = await getDiscoveryData();

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeClient
        discoveryPopularCategories={popularCategories}
        discoveryRecentListings={recentListings}
        initialListings={initialListings}
      />
    </>
  );
}
