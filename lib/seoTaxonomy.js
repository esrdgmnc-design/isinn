// Kategori/şehir SEO landing sayfaları (app/kategori, app/sehir) için sadece
// isim/slug verisi — components/IsinnApp.jsx'teki CATEGORIES/CITIES ile aynı
// slug'ları kullanır (o dosya "use client" olduğu için sunucu sayfalarından
// içe aktarılamıyor, bilerek burada küçük, ikon içermeyen bir kopyası
// tutuluyor — IsinnApp.jsx'te bir kategori/şehir eklenip/çıkarılırsa burası
// da güncellenmeli).
export const SEO_CATEGORIES = [
  { slug: "temizlik", name: "Temizlik" },
  { slug: "nakliye", name: "Nakliye" },
  { slug: "tadilat", name: "Tadilat" },
  { slug: "cilingir", name: "Çilingir" },
  { slug: "ogretmen", name: "Öğretmen" },
  { slug: "egitmen", name: "Eğitmen" },
  { slug: "bakici", name: "Bakıcı" },
  { slug: "hasta-bakici", name: "Hasta Bakıcı" },
  { slug: "hemsire", name: "Hemşire" },
  { slug: "fizyoterapist", name: "Fizyoterapist" },
  { slug: "yoga-koc", name: "Yoga & Meditasyon / Yaşam Koçu" },
  { slug: "spor-egitmeni", name: "Spor Eğitmeni" },
  { slug: "tirnakci", name: "Nailart" },
  { slug: "makyaj", name: "Makyaj" },
  { slug: "bakim", name: "Bakım" },
  { slug: "terzi", name: "Terzi" },
  { slug: "yemek", name: "Yemek" },
  { slug: "muhendis", name: "Mühendis" },
  { slug: "tasarim", name: "Tasarım" },
  { slug: "yazilim", name: "Yazılım" },
  { slug: "sosyal-medya", name: "Sosyal Medya Uzmanı" },
  { slug: "dijital", name: "Dijital Pazarlama" },
  { slug: "diyetisyen", name: "Diyetisyen" },
  { slug: "psikolog", name: "Psikolog / Aile Danışmanı" },
  { slug: "logusa-bakicisi", name: "Loğusa Bakıcısı" },
  { slug: "emzirme-danismani", name: "Emzirme Danışmanı" },
  { slug: "elektrikci", name: "Elektrikçi" },
  { slug: "su-tesisatcisi", name: "Su Tesisatçısı" },
  { slug: "hali-yikama", name: "Halı & Koltuk Yıkama" },
  { slug: "etkinlik-organizatoru", name: "Doğum Günü / Etkinlik Organizatörü" },
  { slug: "bahce-bakim", name: "Bahçe / Bakım" },
  { slug: "profesyonel-fotograf", name: "Profesyonel Fotoğraf" },
  { slug: "boya-badana", name: "Boya & Badana" },
  { slug: "klima-beyaz-esya", name: "Klima & Beyaz Eşya Servisi" },
  { slug: "kuafor-berber", name: "Kuaför / Berber" },
  { slug: "evcil-hayvan", name: "Evcil Hayvan Bakımı" },
  { slug: "muzik-egitmeni", name: "Müzik Eğitmeni" },
  { slug: "muhasebe", name: "Muhasebe / Mali Müşavir" },
  { slug: "ceviri", name: "Çeviri" },
  { slug: "icerik-yazarligi", name: "İçerik Yazarlığı" },
  { slug: "video-duzenleme", name: "Video Düzenleme" },
  { slug: "seslendirme", name: "Seslendirme" },
  { slug: "sanal-asistan", name: "Sanal Asistan" },
  { slug: "oyun-ablasi", name: "Oyun Ablası / Ağabeyi" },
  { slug: "ic-mimarlik", name: "İç Mimarlık / Dekorasyon" },
  { slug: "moda-tekstil-tasarim", name: "Moda & Tekstil Tasarımı" },
  { slug: "teknik-servis", name: "Bilgisayar & Telefon Teknik Servisi" },
  { slug: "oto-tamir", name: "Oto Tamiri / Araç Bakımı" },
  { slug: "bocek-ilaclama", name: "Böcek İlaçlama (Haşere Kontrolü)" },
  { slug: "veteriner", name: "Veteriner" },
  { slug: "avukat", name: "Avukat / Hukuki Danışmanlık" },
  // IsinnApp.jsx'teki CATEGORIES ızgarasında bilerek gösterilmiyor (kullanıcı
  // "diğer" seçip serbest metin yazdığında düşen bir yakalama kategorisi,
  // bkz. supabase/custom_category_requests.sql) ama gerçek services satırları
  // buraya bağlanabiliyor — landing sayfasının 404 vermemesi için burada da var.
  { slug: "diger", name: "Diğer" },
];

// Sadece Türkiye illeri — IsinnApp.jsx'teki CITIES'in yurt dışı kısmı SEO
// landing sayfaları için hedeflenmiyor (İşinn şu an yalnızca Türkiye pazarına
// odaklı).
export const SEO_CITIES = [
  { slug: "adana", name: "Adana" }, { slug: "adiyaman", name: "Adıyaman" },
  { slug: "afyonkarahisar", name: "Afyonkarahisar" }, { slug: "agri", name: "Ağrı" },
  { slug: "aksaray", name: "Aksaray" }, { slug: "amasya", name: "Amasya" },
  { slug: "ankara", name: "Ankara" }, { slug: "antalya", name: "Antalya" },
  { slug: "ardahan", name: "Ardahan" }, { slug: "artvin", name: "Artvin" },
  { slug: "aydin", name: "Aydın" }, { slug: "balikesir", name: "Balıkesir" },
  { slug: "bartin", name: "Bartın" }, { slug: "batman", name: "Batman" },
  { slug: "bayburt", name: "Bayburt" }, { slug: "bilecik", name: "Bilecik" },
  { slug: "bingol", name: "Bingöl" }, { slug: "bitlis", name: "Bitlis" },
  { slug: "bolu", name: "Bolu" }, { slug: "burdur", name: "Burdur" },
  { slug: "bursa", name: "Bursa" }, { slug: "canakkale", name: "Çanakkale" },
  { slug: "cankiri", name: "Çankırı" }, { slug: "corum", name: "Çorum" },
  { slug: "denizli", name: "Denizli" }, { slug: "diyarbakir", name: "Diyarbakır" },
  { slug: "duzce", name: "Düzce" }, { slug: "edirne", name: "Edirne" },
  { slug: "elazig", name: "Elazığ" }, { slug: "erzincan", name: "Erzincan" },
  { slug: "erzurum", name: "Erzurum" }, { slug: "eskisehir", name: "Eskişehir" },
  { slug: "gaziantep", name: "Gaziantep" }, { slug: "giresun", name: "Giresun" },
  { slug: "gumushane", name: "Gümüşhane" }, { slug: "hakkari", name: "Hakkari" },
  { slug: "hatay", name: "Hatay" }, { slug: "igdir", name: "Iğdır" },
  { slug: "isparta", name: "Isparta" }, { slug: "istanbul", name: "İstanbul" },
  { slug: "izmir", name: "İzmir" }, { slug: "kahramanmaras", name: "Kahramanmaraş" },
  { slug: "karabuk", name: "Karabük" }, { slug: "karaman", name: "Karaman" },
  { slug: "kars", name: "Kars" }, { slug: "kastamonu", name: "Kastamonu" },
  { slug: "kayseri", name: "Kayseri" }, { slug: "kirikkale", name: "Kırıkkale" },
  { slug: "kirklareli", name: "Kırklareli" }, { slug: "kirsehir", name: "Kırşehir" },
  { slug: "kilis", name: "Kilis" }, { slug: "kocaeli", name: "Kocaeli" },
  { slug: "konya", name: "Konya" }, { slug: "kutahya", name: "Kütahya" },
  { slug: "malatya", name: "Malatya" }, { slug: "manisa", name: "Manisa" },
  { slug: "mardin", name: "Mardin" }, { slug: "mersin", name: "Mersin" },
  { slug: "mugla", name: "Muğla" }, { slug: "mus", name: "Muş" },
  { slug: "nevsehir", name: "Nevşehir" }, { slug: "nigde", name: "Niğde" },
  { slug: "ordu", name: "Ordu" }, { slug: "osmaniye", name: "Osmaniye" },
  { slug: "rize", name: "Rize" }, { slug: "sakarya", name: "Sakarya" },
  { slug: "samsun", name: "Samsun" }, { slug: "siirt", name: "Siirt" },
  { slug: "sinop", name: "Sinop" }, { slug: "sivas", name: "Sivas" },
  { slug: "sanliurfa", name: "Şanlıurfa" }, { slug: "sirnak", name: "Şırnak" },
  { slug: "tekirdag", name: "Tekirdağ" }, { slug: "tokat", name: "Tokat" },
  { slug: "trabzon", name: "Trabzon" }, { slug: "tunceli", name: "Tunceli" },
  { slug: "usak", name: "Uşak" }, { slug: "van", name: "Van" },
  { slug: "yalova", name: "Yalova" }, { slug: "yozgat", name: "Yozgat" },
  { slug: "zonguldak", name: "Zonguldak" },
];

// services.city serbest metin ("İlçe, İl" ya da sadece "İl") — son virgülden
// sonraki (ya da tek) parça, IsinnApp.jsx'teki deriveCityIdFromLabel ile aynı
// mantık. Landing sayfalarında bir vitrinin hangi ile ait olduğunu bulmak için.
export function matchesCitySlug(cityLabel, citySlug) {
  if (!cityLabel) return false;
  const parts = cityLabel.split(",");
  const provinceName = parts[parts.length - 1].trim().toLocaleLowerCase("tr-TR");
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) return false;
  return provinceName === city.name.toLocaleLowerCase("tr-TR");
}
