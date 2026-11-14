// Teknoloji rehberi (2026-11-14). Kurucu: "insanlar sıradan algılıyor, teknik yüksekliğimizi vurgula".
// Kurallar: yalnızca koddaki gerçek davranış (bkz. app/teknoloji/page.js yorumları); kullanıcı sayısı, "en iyi",
// "doğrulanmış" ya da garanti iddiası yok; rakip adı yok; fiyat yok.
export const REHBER_POSTS_TR13 = [
  {
    slug: "yapay-zeka-ile-hizmet-veren-nasil-bulunur",
    title: "Yapay Zekâ ile Doğru Hizmet Veren Nasıl Bulunur?",
    seoTitle: "Yapay Zekâ ile Hizmet Veren Nasıl Bulunur?",
    description: "Kategori menülerinde kaybolmadan, ihtiyacını kendi cümlenle yazarak uzman bulmak: yapay zekâ eşleştirmesi nasıl çalışır, neye dikkat edilir, kişisel bilgin nasıl korunur.",
    category: "genel",
    bodyHtml: `
      <p>Klasik hizmet sitelerinde önce doğru kategoriyi bulman gerekir: “özel ders” mi, “LGS hazırlık” mı, “matematik öğretmeni” mi? Yapay zekâ ile eşleştirmede bu adım ortadan kalkar. İhtiyacını kendi cümlenle yazarsın, sistem ne aradığını ve nerede aradığını kendisi çıkarır. Bu rehber, bu yöntemin nasıl çalıştığını ve en iyi sonucu nasıl alacağını anlatıyor.</p>
      <h2>1. İhtiyacını bir arkadaşına anlatır gibi yaz</h2>
      <p>Anahtar kelime değil, durum yaz. “Matematik öğretmeni” yerine “Kızım 8. sınıfta, LGS'ye hazırlanıyor, geometride zorlanıyor, Kadıköy'de haftada iki ders” yazdığında yapay zekâ şunları ayırır:</p>
      <ul>
        <li><strong>Ne:</strong> matematik özel dersi, LGS düzeyi, geometri ağırlıklı</li>
        <li><strong>Nerede:</strong> İstanbul, yüz yüze</li>
        <li><strong>Nasıl:</strong> düzenli, haftada iki ders</li>
      </ul>
      <p>Ne kadar somut yazarsan sıralama o kadar isabetli olur.</p>
      <h2>2. Yapay zekâ ne yapar, ne yapmaz?</h2>
      <p>İşinn'de yapay zekâ yalnızca iki iş yapar: yazdığından niyeti çıkarır ve uygun vitrinleri sıralar. Ardından sunucu her öneriyi kurallarla yeniden denetler. Örneğin yüz yüze bir işte, uzaktan çalışmayan başka ildeki bir aday listeye giremez; model ne derse desin bu kural geçerlidir. Ücretli öne çıkarma da eşleştirme sıralamasına girmez.</p>
      <p>Yapay zekâ kimseyi senin yerine seçmez ve kalite garantisi vermez. Son karar, vitrinleri inceleyip mesajlaştıktan sonra senindir.</p>
      <h2>3. Önerilen vitrinleri nasıl değerlendirirsin?</h2>
      <ul>
        <li><strong>Yapılmış işler:</strong> vitrindeki fotoğraf ve videolar, çalışma bağlantıları.</li>
        <li><strong>İki taraflı onaylı yorumlar:</strong> “İki taraf da onayladı” etiketi, işin hem hizmet alan hem hizmet veren tarafından tamamlandı diye işaretlendiğini gösterir.</li>
        <li><strong>Paylaşılan belgeler:</strong> sertifika ve belgeler hizmet verenin beyanıdır; İşinn bunları doğrulamaz, gerekirse ilgili kurumdan kendin teyit et.</li>
        <li><strong>İlk mesaj:</strong> kapsamı, tarihi ve ücreti yazılı netleştir.</li>
      </ul>
      <h2>4. Kişisel bilgin nasıl korunur?</h2>
      <p>Yapay zekâ ile çalışan bir sistemde en önemli soru, yazdığın metnin nereye gittiğidir. İşinn'de:</p>
      <ul>
        <li>Telefon, e-posta, T.C. kimlik numarası ve IBAN, yapay zekâya gönderilmeden metinden otomatik silinir.</li>
        <li>Eşleştirmede yazdığın metin saklanmaz; yalnızca kategori ve il gibi istatistik bilgiler kaydedilir.</li>
        <li>Sağlık şikâyeti içeren metinler yapay zekâya hiç gönderilmez, kurallarla eşleştirilir.</li>
      </ul>
      <p>Yine de metne adını, adresini ya da çocuğunun okul adını yazmana gerek yok; ihtiyacı anlatmak yeterli.</p>
      <h2>5. Aradığını bulamazsan</h2>
      <p>Uygun vitrin çıkmazsa ihtiyacını bir talep olarak bırakabilirsin; uygun hizmet verenler sana ulaşır. Aramanı kaydedersen, sonradan uyan yeni bir vitrin açıldığında bildirim alırsın.</p>
      <h2>Yapay zekâ asistanından da arayabilirsin</h2>
      <p>Claude ya da ChatGPT kullanıyorsan İşinn'i asistana bağlayıp “İstanbul'da LGS matematik öğretmeni bul” diyebilirsin; sonuçlar İşinn vitrinlerinden, bağlantılarıyla gelir. Kurulum: <a href="/yapay-zeka-araci">İşinn yapay zekâ aracı</a>. İşinn'in arkasındaki tüm teknoloji için: <a href="/teknoloji">İşinn teknolojisi</a>.</p>
      <p><em>İşinn bir hizmet keşif platformudur; kullanıcılar arasındaki ödemeye aracılık etmez ve hizmet kalitesini garanti etmez. Anlaşmayı taraflar kendi aralarında yapar.</em></p>
    `,
    ctaText: "Yapay zekâ ile uzman bul",
    ctaHref: "/?view=needMatch",
    faq: [
      { q: "Yapay zekâ ile hizmet veren nasıl bulunur?", a: "İhtiyacını anahtar kelime yerine durum olarak, kendi cümlenle yaz: ne, nerede, nasıl. Yapay zekâ niyeti çıkarır ve uygun vitrinleri sıralar; sen vitrinleri inceleyip mesajlaşarak karar verirsin." },
      { q: "İşinn'de yapay zekâya yazdığım metin saklanıyor mu?", a: "Hayır. Eşleştirme metni saklanmaz; telefon, e-posta, T.C. kimlik numarası ve IBAN yapay zekâya gitmeden silinir. Sağlık şikâyeti içeren metinler yapay zekâya hiç gönderilmez." },
      { q: "Para veren hizmet verenler eşleştirmede öne çıkıyor mu?", a: "Hayır. Yapay zekâ eşleştirmesinde ücretli öne çıkarma sıralamaya dahil edilmez." },
    ],
  },
];

export const REHBER_META_TR13 = {
  "yapay-zeka-ile-hizmet-veren-nasil-bulunur": {
    published: "2026-11-14", updated: "2026-11-14",
    shortAnswer: "İhtiyacını kendi cümlenle, ne-nerede-nasıl bilgisiyle yaz. Yapay zekâ niyeti çıkarıp uygun vitrinleri sıralar, sunucu sonuçları kurallarla denetler; karar senindir. İşinn'de kişisel bilgiler yapay zekâya gitmeden silinir ve eşleştirme metni saklanmaz.",
  },
};
