"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, MapPin, Star, Heart, PlayCircle, ChevronLeft, ChevronRight,
  Wrench, Truck, Monitor, Paintbrush, Code2, Sparkles, ThumbsUp,
  X, Send, Menu, Map as MapIcon, Check, MessageCircle, Clock, Key,
  GraduationCap, Baby, Megaphone, HardHat, Palette, Users, Grid3x3,
  ShieldCheck, BadgeCheck, Award, ArrowLeft, HeartPulse, Syringe, Activity, Wand2, Droplet, Home, Briefcase,
  Scissors, Shirt, Salad, Brain, HeartHandshake, Milk, Zap, Droplets, SprayCan, PartyPopper, Eye, Flower2,
  ChefHat, Flower, Sprout, Camera, MoreHorizontal, Dumbbell, Unlock,
  LifeBuoy, Bot, Loader2, AlertCircle, Inbox,
  UploadCloud, FileText, Trash2
} from "lucide-react";

// ---------------------------------------------------------------
// Design tokens
// Ink:      #1B2B24   (near-black green, primary text/dark surfaces)
// Sand:     #EFE8D8   (warm background, not the generic cream default)
// Ochre:    #C2872B   (accent — CTAs, price, stars)
// Moss:     #3F7D5C   (local / "yerinde" tag)
// Denim:    #3A5BA0   (remote / "uzaktan" tag)
// Line:     #D9D0BA   (hairline borders on sand)
// ---------------------------------------------------------------

const CATEGORIES = [
  { id: "temizlik", name: "Temizlik", mode: "local", icon: Sparkles },
  { id: "nakliye", name: "Nakliye", mode: "local", icon: Truck },
  { id: "tadilat", name: "Tadilat", mode: "local", icon: Wrench },
  { id: "cilingir", name: "Çilingir", mode: "local", icon: Key },
  { id: "ogretmen", name: "Öğretmen", mode: "both", icon: GraduationCap },
  { id: "bakici", name: "Bakıcı", mode: "local", icon: Baby },
  { id: "hasta-bakici", name: "Hasta Bakıcı", mode: "local", icon: HeartPulse },
  { id: "hemsire", name: "Hemşire", mode: "local", icon: Syringe },
  { id: "fizyoterapist", name: "Fizyoterapist", mode: "local", icon: Activity },
  { id: "yoga-koc", name: "Yoga & Meditasyon / Yaşam Koçu", mode: "both", icon: Flower },
  { id: "spor-egitmeni", name: "Spor Eğitmeni", mode: "both", icon: Dumbbell },
  { id: "tirnakci", name: "Nailart", mode: "local", icon: Palette },
  { id: "makyaj", name: "Makyaj", mode: "local", icon: Wand2 },
  { id: "bakim", name: "Bakım", mode: "local", icon: Flower2 },
  { id: "terzi", name: "Terzi", mode: "local", icon: Shirt },
  { id: "yemek", name: "Yemek", mode: "local", icon: ChefHat },
  { id: "muhendis", name: "Mühendis", mode: "both", icon: HardHat },
  { id: "tasarim", name: "Tasarım", mode: "remote", icon: Paintbrush },
  { id: "yazilim", name: "Yazılım", mode: "remote", icon: Code2 },
  { id: "sosyal-medya", name: "Sosyal Medya Uzmanı", mode: "remote", icon: Megaphone },
  { id: "dijital", name: "Dijital Pazarlama", mode: "remote", icon: Monitor },
  { id: "diyetisyen", name: "Diyetisyen", mode: "both", icon: Salad },
  { id: "psikolog", name: "Psikolog / Aile Danışmanı", mode: "both", icon: Brain },
  { id: "logusa-bakicisi", name: "Loğusa Bakıcısı", mode: "local", icon: HeartHandshake },
  { id: "emzirme-danismani", name: "Emzirme Danışmanı", mode: "both", icon: Milk },
  { id: "elektrikci", name: "Elektrikçi", mode: "local", icon: Zap },
  { id: "su-tesisatcisi", name: "Su Tesisatçısı", mode: "local", icon: Droplets },
  { id: "hali-yikama", name: "Halı & Koltuk Yıkama", mode: "local", icon: SprayCan },
  { id: "etkinlik-organizatoru", name: "Doğum Günü / Etkinlik Organizatörü", mode: "local", icon: PartyPopper },
  { id: "bahce-bakim", name: "Bahçe / Bakım", mode: "local", icon: Sprout },
  { id: "profesyonel-fotograf", name: "Profesyonel Fotoğraf", mode: "local", icon: Camera },
];

const PARENT_CATEGORIES = [
  { id: "ev-hizmetleri", name: "Ev Hizmetleri", icon: Home, categoryIds: ["temizlik", "nakliye", "tadilat", "cilingir", "terzi", "elektrikci", "su-tesisatcisi", "hali-yikama", "yemek"] },
  { id: "guzellik-bakim", name: "Güzellik & Bakım", icon: Wand2, categoryIds: ["tirnakci", "makyaj", "bakim"] },
  { id: "saglik", name: "Sağlık", icon: HeartPulse, categoryIds: ["hasta-bakici", "hemsire", "fizyoterapist", "diyetisyen", "psikolog", "yoga-koc", "spor-egitmeni"] },
  { id: "egitim-aile", name: "Eğitim & Aile", icon: GraduationCap, categoryIds: ["ogretmen", "bakici", "logusa-bakicisi", "emzirme-danismani", "etkinlik-organizatoru"] },
  { id: "profesyonel", name: "Profesyonel Hizmetler", icon: Briefcase, categoryIds: ["tasarim", "yazilim", "dijital"] },
  { id: "diger", name: "Diğer", icon: MoreHorizontal, categoryIds: ["bahce-bakim", "muhendis", "sosyal-medya", "profesyonel-fotograf"] },
];

const LEVEL_META = {
  "top-rated": { label: "Top Rated", color: "#C2872B" },
  "level-2": { label: "Level 2", color: "#6B4FA0" },
  "level-1": { label: "Level 1", color: "#3A5BA0" },
  "new": { label: "Yeni Satıcı", color: "#8A8368" },
};

const LISTINGS = [
  {
    id: 1, category: "tadilat", mode: "local", title: "Mutfak Tadilatı ve Dolap Montajı",
    provider: "Hakan Y.", city: "Kadıköy, İstanbul", price: "8.500₺'den", rating: 4.9, reviewCount: 47,
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600",
    desc: "15 yıllık tecrübe ile anahtar teslim mutfak tadilatı, dolap montajı ve tezgah kaplama işleri yapıyorum. İstanbul Anadolu yakası hizmet veriyorum.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Usta Belgesi"],
    homeService: "evde",
  },
  {
    id: 2, category: "yazilim", mode: "remote", title: "React & Node.js ile Web Uygulaması Geliştirme",
    provider: "Elif K.", city: "Uzaktan", price: "450₺/saat", rating: 5.0, reviewCount: 132,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
    desc: "5 yıllık full-stack deneyim. E-ticaret, SaaS ve mobil uyumlu web uygulamaları geliştiriyorum. Figma tasarımdan canlıya kadar tüm süreç.",
    level: "top-rated", verified: ["Kimlik Doğrulandı", "Ödeme Doğrulandı"],
  },
  {
    id: 3, category: "nakliye", mode: "local", title: "Evden Eve Nakliyat ve Asansörlü Taşıma",
    provider: "Murat Nakliyat", city: "Ankara (Tüm İlçeler)", price: "3.200₺'den", rating: 4.7, reviewCount: 89,
    img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600",
    desc: "Sigortalı, özenli evden eve nakliyat hizmeti. Asansörlü taşıma, eşya paketleme ve montaj dahil.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "K1 Taşıma Yetki Belgesi", "Sigortalı"],
    homeService: "evde",
  },
  {
    id: 4, category: "tasarim", mode: "remote", title: "Marka Kimliği ve Logo Tasarımı",
    provider: "Zeynep D.", city: "Uzaktan", price: "2.800₺'den", rating: 4.9, reviewCount: 61,
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600",
    desc: "Kurumsal kimlik, logo ve marka rehberi tasarımı. 3 revizyon hakkı, tüm dosya formatları dahil teslim.",
    level: "level-2", verified: ["Kimlik Doğrulandı"],
  },
  {
    id: 5, category: "temizlik", mode: "local", title: "Ofis ve Ev Derin Temizlik Hizmeti",
    provider: "TemizPark Ekibi", city: "İzmir (Konak, Bornova)", price: "900₺'den", rating: 4.8, reviewCount: 210,
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
    desc: "Profesyonel ekipman ile ev ve ofisler için derin temizlik. Cam, halı yıkama ve genel temizlik paketleri.",
    level: "top-rated", verified: ["Kimlik Doğrulandı", "Şirket Kaydı", "Sigortalı Ekip"],
    homeService: "evde",
  },
  {
    id: 6, category: "dijital", mode: "remote", title: "Instagram & Meta Reklam Yönetimi",
    provider: "Can B.", city: "Uzaktan", price: "3.500₺/ay", rating: 4.6, reviewCount: 38,
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600",
    desc: "Sosyal medya hesap yönetimi, içerik üretimi ve performans reklamcılığı. Aylık raporlama dahil.",
    level: "level-1", verified: ["Kimlik Doğrulandı"],
  },
  {
    id: 7, category: "cilingir", mode: "local", title: "7/24 Acil Kapı ve Çelik Kasa Açma",
    provider: "Ortaköy Anahtar Usta", city: "Ortaköy, İstanbul", price: "450₺'den", rating: 4.8, reviewCount: 96,
    img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=600",
    desc: "Ortaköy ve çevresine 15 dakikada ulaşım. Kapı açma, kilit değişimi, oto çilingir ve çelik kasa hizmeti. 7/24 hizmet veriyorum.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Esnaf Odası Kaydı"],
    homeService: "evde",
  },
  {
    id: 8, category: "cilingir", mode: "local", title: "Kapı Kilidi Değişimi ve Güvenlik Sistemleri",
    provider: "Barış Çilingir", city: "Ortaköy, İstanbul", price: "500₺'den", rating: 4.6, reviewCount: 54,
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600",
    desc: "Çelik kapı kilidi montajı, kartlı geçiş sistemleri ve site güvenlik kilit değişimi. Ortaköy, Beşiktaş, Kuruçeşme bölgesine hizmet.",
    level: "level-1", verified: ["Kimlik Doğrulandı"],
    homeService: "evde",
  },
  {
    id: 9, category: "cilingir", mode: "local", title: "Oto Çilingir - Araç İçi Kalan Anahtar",
    provider: "Hızlı Çilingir Servisi", city: "Ortaköy, İstanbul", price: "400₺'den", rating: 4.9, reviewCount: 71,
    img: "https://images.unsplash.com/photo-1632823469850-1b7b1e8b7d4a?w=600",
    desc: "Araç içinde kalan anahtar, immobilizer kopyalama ve kontak açma hizmeti. Ortalama 10-15 dakikada olay yerine ulaşım.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Esnaf Odası Kaydı"],
    homeService: "evde",
  },
  {
    id: 10, category: "ogretmen", mode: "local", title: "İlkokul ve Ortaokul Matematik Özel Ders",
    provider: "Deniz Aydın", city: "Çankaya, Ankara / Online", price: "350₺/saat", rating: 4.9, reviewCount: 58,
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600",
    desc: "10 yıllık matematik öğretmenliği deneyimi. LGS ve okul müfredatına yönelik birebir ders, evde veya online yapılabilir.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Diploma Doğrulandı"],
    videoIntro: { thumbnail: "https://images.pexels.com/videos/5198159/pexels-photo-5198159.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200", duration: "0:52", videoUrl: "https://videos.pexels.com/video-files/5198159/5198159-uhd_2560_1440_25fps.mp4" },
    backgroundChecks: [
      { label: "Kimlik Doğrulama", date: "Ocak 2026", note: "T.C. kimlik bilgileri resmi belge ile eşleştirildi." },
      { label: "Diploma Doğrulama", date: "Ocak 2026", note: "Üniversite mezuniyet belgesi YÖK sistemi üzerinden teyit edildi." },
      { label: "Sabıka Kaydı Sorgusu", date: "Aralık 2025", note: "Adli sicil kaydı temiz çıktı, e-Devlet üzerinden doğrulandı." },
    ],
    references: [
      { name: "Burcu A.", relation: "1 çocuk annesi", quote: "Oğlum matematikten korkardı, Deniz Hoca ile artık severek çalışıyor." },
      { name: "Tolga M.", relation: "2 çocuk babası", quote: "Sabırlı ve düzenli, her hafta ilerlemeyi bize de raporluyor." },
    ],
    homeService: "esnek",
  },
  {
    id: 11, category: "bakici", mode: "local", title: "Deneyimli Bebek ve Çocuk Bakıcısı",
    provider: "Fatma H.", city: "Beşiktaş, İstanbul", price: "300₺/gün", rating: 4.8, reviewCount: 43,
    img: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600",
    desc: "0-6 yaş bebek/çocuk bakımı konusunda 8 yıllık deneyim. İlk yardım sertifikalı, referanslarım mevcut.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Sabıka Kaydı Temiz", "İlk Yardım Sertifikası"],
    videoIntro: { thumbnail: "https://images.pexels.com/videos/7491802/pexels-photo-7491802.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200", duration: "0:41", videoUrl: "https://videos.pexels.com/video-files/7491802/7491802-uhd_1440_2732_25fps.mp4" },
    backgroundChecks: [
      { label: "Kimlik Doğrulama", date: "Şubat 2026", note: "T.C. kimlik bilgileri resmi belge ile eşleştirildi." },
      { label: "Sabıka Kaydı Sorgusu", date: "Şubat 2026", note: "Adli sicil kaydı temiz çıktı, e-Devlet üzerinden doğrulandı." },
      { label: "İlk Yardım Sertifikası", date: "Kasım 2025", note: "Kızılay onaylı ilk yardım eğitimi, sertifika geçerlilik tarihi kontrol edildi." },
      { label: "Referans Kontrolü", date: "Şubat 2026", note: "Son 2 aileyle telefonla görüşülüp iş geçmişi teyit edildi." },
    ],
    references: [
      { name: "Elif K.", relation: "2 çocuk annesi", quote: "Kızımla harika vakit geçiriyor, tamamen güveniyorum. Bir yıldır bizimle çalışıyor." },
      { name: "Merve S.", relation: "1 çocuk annesi", quote: "Çok sabırlı ve şefkatli, oğlum onu görünce çok mutlu oluyor." },
      { name: "Aylin D.", relation: "İkiz anne", quote: "İkizlerimle tek başına baş edebiliyor, gerçekten deneyimli." },
    ],
    homeService: "evde",
  },
  {
    id: 12, category: "sosyal-medya", mode: "remote", title: "Instagram & TikTok İçerik Üretimi ve Yönetimi",
    provider: "Buse K.", city: "Uzaktan", price: "4.200₺/ay", rating: 4.7, reviewCount: 29,
    img: "https://images.unsplash.com/photo-1611162616805-6a0f0e5f3c8f?w=600",
    desc: "Marka için içerik takvimi, reels çekimi ve topluluk yönetimi. Aylık performans raporlaması dahil.",
    level: "level-1", verified: ["Kimlik Doğrulandı"],
  },
  {
    id: 13, category: "muhendis", mode: "local", title: "İnşaat Statik Proje ve Mühendislik Hizmeti",
    provider: "Emre Y. İnşaat Müh.", city: "Bornova, İzmir / Online", price: "6.000₺'den", rating: 4.9, reviewCount: 22,
    img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600",
    desc: "Statik proje çizimi, zemin etüdü değerlendirmesi ve yapı denetim danışmanlığı. Yerinde keşif veya uzaktan proje teslimi.",
    level: "new", verified: ["Kimlik Doğrulandı", "Diploma Doğrulandı", "Oda Sicil Belgesi"],
    homeService: "esnek",
  },
  {
    id: 14, category: "hasta-bakici", mode: "local", title: "Yatalak ve Yaşlı Hasta Bakımı",
    provider: "Songül T.", city: "Üsküdar, İstanbul", price: "350₺/gün", rating: 4.9, reviewCount: 67,
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
    desc: "12 yıllık hasta bakım deneyimi, yatalak hasta bakımı, ilaç takibi ve günlük hijyen desteği. Gece nöbeti de alabilirim.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Hasta Bakıcı Sertifikası", "Sabıka Kaydı Temiz"],
    homeService: "evde",
  },
  {
    id: 15, category: "hemsire", mode: "local", title: "Evde Serum, Enjeksiyon ve Pansuman Hizmeti",
    provider: "Hemşire Aylin K.", city: "Çankaya, Ankara", price: "300₺'den", rating: 5.0, reviewCount: 84,
    img: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=600",
    desc: "Lisanslı hemşire, evde serum takma, enjeksiyon, pansuman ve tansiyon/şeker takibi hizmeti veriyorum. 7/24 acil çağrı mevcut.",
    level: "top-rated", verified: ["Kimlik Doğrulandı", "Hemşirelik Lisansı", "Sağlık Bakanlığı Kaydı"],
    homeService: "evde",
  },
  {
    id: 16, category: "fizyoterapist", mode: "local", title: "Evde Fizik Tedavi ve Rehabilitasyon",
    provider: "Fzt. Kerem A.", city: "Konak, İzmir", price: "500₺/seans", rating: 4.8, reviewCount: 39,
    img: "https://images.unsplash.com/photo-1567168539593-59673ababaee?w=600",
    desc: "Ameliyat sonrası rehabilitasyon, ortopedik fizik tedavi ve manuel terapi. Evde seans imkanı, egzersiz programı dahil.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Fizyoterapi Diploması", "Oda Sicil Belgesi"],
    homeService: "evde",
  },
  {
    id: 17, category: "makyaj", mode: "local", title: "Davet ve Gelin Makyajı",
    provider: "Melis Makyaj Atölyesi", city: "Beşiktaş, İstanbul", price: "1.200₺'den", rating: 4.9, reviewCount: 76,
    img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600",
    desc: "Gelin, nişan ve davet makyajı yapıyorum. Prova dahil, kalıcı ürünler kullanıyorum. Adresinize gelebilirim.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Makyaj Sertifikası"],
    homeService: "evde",
  },
  {
    id: 18, category: "bakim", mode: "local", title: "Cilt Bakımı, Ağda ve Kaş Tasarımı Bir Arada",
    provider: "Dermo Güzellik Merkezi", city: "Konak, İzmir", price: "650₺'den", rating: 4.8, reviewCount: 52,
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600",
    desc: "Cilt tipine özel bakım, akne tedavisi, ağda ve kaş tasarımı hizmetlerinin hepsini tek seansta halledebiliyoruz. Cihazlı analiz ile başlıyoruz, uzman kadromuz eşliğinde. Detaylar için mesaj atabilirsin.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Estetisyen Diploması"],
    homeService: "mekanda",
  },
  {
    id: 19, category: "bakim", mode: "local", title: "Saç, Kaş ve Cilt Bakımı — Tek Randevuda",
    provider: "Studio Reyhan", city: "Kadıköy, İstanbul", price: "500₺'den", rating: 4.9, reviewCount: 118,
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
    desc: "Saç kesimi, boya, keratin bakım, kaş tasarımı ve ağda hizmeti veriyorum — ihtiyacına göre birini ya da hepsini aynı randevuda yapabiliriz. Randevulu çalışıyorum, çocuklu müşterilerim için oyun köşemiz var.",
    level: "top-rated", verified: ["Kimlik Doğrulandı", "Kuaförlük Ustalık Belgesi"],
    homeService: "mekanda",
  },
  {
    id: 20, category: "terzi", mode: "local", title: "Kıyafet Tadilatı ve Dikim Hizmeti",
    provider: "Terzi Necla Hanım", city: "Çankaya, Ankara", price: "150₺'den", rating: 4.8, reviewCount: 64,
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
    desc: "Paça, kol boyu kısaltma, fermuar değişimi ve özel dikim işleri. Aynı gün teslim seçeneği mevcut, mahalledeki dükkanıma kolayca uğrayabilirsiniz.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Esnaf Odası Kaydı"],
    homeService: "mekanda",
  },
  {
    id: 21, category: "diyetisyen", mode: "local", title: "Doğum Sonrası ve Çocuk Beslenmesi Danışmanlığı",
    provider: "Dyt. Ceren Yıldız", city: "Beşiktaş, İstanbul / Online", price: "600₺/seans", rating: 4.9, reviewCount: 71,
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
    desc: "Doğum sonrası beslenme, emzirme dönemi diyeti ve çocuklar için sağlıklı beslenme planı hazırlıyorum. İlk görüşme ücretsiz.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Diyetisyenlik Lisansı"],
    homeService: "esnek",
  },
  {
    id: 22, category: "psikolog", mode: "local", title: "Doğum Sonrası Depresyon ve Aile Danışmanlığı",
    provider: "Psk. Selin Arslan", city: "Çankaya, Ankara / Online", price: "750₺/seans", rating: 5.0, reviewCount: 48,
    img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600",
    desc: "Doğum sonrası depresyon, ebeveynlik kaygısı ve aile içi iletişim konularında bireysel terapi. Gizlilik esastır, online seans da mümkün.",
    level: "top-rated", verified: ["Kimlik Doğrulandı", "Klinik Psikoloji Diploması", "Ruhsatlı Terapist"],
    homeService: "esnek",
  },
  {
    id: 23, category: "logusa-bakicisi", mode: "local", title: "Loğusa Bakımı ve Doğum Sonrası Destek",
    provider: "Hemşire Gül T.", city: "Üsküdar, İstanbul", price: "400₺/gün", rating: 4.9, reviewCount: 56,
    img: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600",
    desc: "Doğum sonrası ilk 40 gün anne ve bebek bakımı, emzirme desteği ve ev içi destek. Hemşirelik geçmişim var, gece nöbeti de alabilirim.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Hemşirelik Lisansı", "Loğusa Bakım Sertifikası"],
    homeService: "evde",
  },
  {
    id: 24, category: "emzirme-danismani", mode: "local", title: "Emzirme ve Anne Sütü Danışmanlığı",
    provider: "IBCLC Deniz K.", city: "Kadıköy, İstanbul / Online", price: "500₺/seans", rating: 5.0, reviewCount: 33,
    img: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=600",
    desc: "Uluslararası sertifikalı emzirme danışmanıyım. Emzirme zorlukları, süt yetersizliği ve doğru pozisyon konusunda evde destek veriyorum.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "IBCLC Sertifikası"],
    homeService: "evde",
  },
  {
    id: 25, category: "elektrikci", mode: "local", title: "Ev ve Ofis Elektrik Tesisatı Onarımı",
    provider: "Elektrikçi Hasan Usta", city: "Bornova, İzmir", price: "350₺'den", rating: 4.7, reviewCount: 88,
    img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    desc: "Sigorta arızası, priz/anahtar değişimi, aydınlatma montajı. Çocuklu evlerde güvenlik kontrolü de yapıyorum, sigortalı çalışıyorum.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Elektrik Ustalık Belgesi"],
    homeService: "evde",
  },
  {
    id: 26, category: "su-tesisatcisi", mode: "local", title: "Su Kaçağı Tespiti ve Tesisat Tamiri",
    provider: "Tesisatçı Murat", city: "Maltepe, İstanbul", price: "400₺'den", rating: 4.6, reviewCount: 102,
    img: "https://images.unsplash.com/photo-1607472829122-63c2b7c4b1b7?w=600",
    desc: "Su kaçağı tespiti, gider tıkanıklığı açma, batarya ve rezervuar tamiri. 7/24 acil çağrı hattım var.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Tesisatçılık Ustalık Belgesi"],
    homeService: "evde",
  },
  {
    id: 27, category: "hali-yikama", mode: "local", title: "Evde Halı ve Koltuk Yıkama Hizmeti",
    provider: "TemizPark Halı Yıkama", city: "Konak, İzmir", price: "80₺/m²'den", rating: 4.8, reviewCount: 145,
    img: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600",
    desc: "Yerinde halı ve koltuk yıkama, aynı gün kurutma. Bebek/çocuk dostu, kimyasal içermeyen deterjan kullanıyoruz.",
    level: "top-rated", verified: ["Kimlik Doğrulandı", "Şirket Kaydı"],
    homeService: "evde",
  },
  {
    id: 28, category: "etkinlik-organizatoru", mode: "local", title: "Çocuk Doğum Günü Parti Organizasyonu",
    provider: "Renkli Partiler Ekibi", city: "Şişli, İstanbul", price: "3.500₺'den", rating: 4.9, reviewCount: 61,
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
    desc: "Tema kurulumu, animasyon, pasta ve ikramlar dahil anahtar teslim doğum günü organizasyonu. Evinizde veya mekanda düzenleyebiliriz.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Şirket Kaydı"],
    homeService: "esnek",
  },
  {
    id: 29, category: "bakim", mode: "local", title: "Kirpik Lifting, Kaş Tasarımı ve Ağda",
    provider: "Brow Studio Zeynep", city: "Kadıköy, İstanbul", price: "600₺'den", rating: 4.9, reviewCount: 93,
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600",
    desc: "Kirpik lifting, laminasyon, kaş tasarımı ve ağda hizmeti — birini ya da birkaçını birlikte yaptırabilirsin. Hijyenik tek kullanımlık malzemeler, randevu sistemiyle çalışıyorum.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Estetisyen Sertifikası"],
    homeService: "mekanda",
  },
  {
    id: 30, category: "bakim", mode: "local", title: "Evde Masaj, Spa ve Cilt Bakımı Paketi",
    provider: "Huzur Masaj Stüdyosu", city: "Çankaya, Ankara", price: "700₺/seans", rating: 4.8, reviewCount: 47,
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600",
    desc: "İsveç masajı, doğum sonrası rahatlatıcı masaj, aromaterapi ve cilt bakımını tek pakette sunuyorum. Evinize gelip kendi ortamınızda hizmet veriyorum.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Masaj Terapisti Sertifikası"],
    homeService: "evde",
  },
  {
    id: 31, category: "yemek", mode: "local", title: "Ev Yemeği ve Haftalık Yemek Hazırlama",
    provider: "Elif'in Mutfağı", city: "Üsküdar, İstanbul", price: "800₺/hafta'dan", rating: 4.9, reviewCount: 87,
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
    desc: "Ev yemeği, bebek/çocuk beslenmesine uygun tarifler ve haftalık yemek hazırlama hizmeti veriyorum. Evinizde pişirebilir ya da hazır götürebilirim, alerjen bilgisi paylaşırım.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Hijyen Sertifikası"],
    homeService: "evde",
  },
  {
    id: 32, category: "yoga-koc", mode: "local", title: "Doğum Sonrası Yoga ve Yaşam Koçluğu",
    provider: "Ayşe Nur — Yoga & Yaşam Koçu", city: "Kadıköy, İstanbul / Online", price: "450₺/seans", rating: 4.9, reviewCount: 62,
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    desc: "Doğum sonrası toparlanma yogası, meditasyon ve ebeveynlik döneminde yaşam koçluğu veriyorum. Evinizde birebir ya da online grup dersleri mevcut.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Yoga Eğitmenliği Sertifikası"],
    homeService: "esnek",
  },
  {
    id: 33, category: "bahce-bakim", mode: "local", title: "Bahçe Düzenleme ve Bitki Bakımı",
    provider: "Yeşil Bahçe Ekibi", city: "Beykoz, İstanbul", price: "500₺'den", rating: 4.7, reviewCount: 41,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
    desc: "Çim biçme, budama, bitki dikimi ve düzenli bahçe bakım aboneliği sunuyoruz. Balkon/teras bitki bakımı da yapıyoruz, çocuk güvenli ürünler kullanıyoruz.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Esnaf Odası Kaydı"],
    homeService: "evde",
  },
  {
    id: 34, category: "profesyonel-fotograf", mode: "local", title: "Yeni Doğan ve Aile Fotoğrafçılığı",
    provider: "Cansu Kaya Fotoğrafçılık", city: "Şişli, İstanbul", price: "2.500₺'den", rating: 5.0, reviewCount: 78,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    desc: "Yeni doğan, aile ve doğum günü fotoğraf çekimi yapıyorum. Evinize gelip çocuğunuzun stresli olmadığı bir ortamda çekim yapabiliriz, tüm fotoğraflar düzenlenmiş teslim edilir.",
    level: "top-rated", verified: ["Kimlik Doğrulandı", "Şirket Kaydı"],
    homeService: "evde",
  },
  {
    id: 35, category: "spor-egitmeni", mode: "local", title: "Doğum Sonrası Toparlanma ve Kişisel Antrenörlük",
    provider: "Buğra Fit — Kişisel Antrenör", city: "Beşiktaş, İstanbul / Online", price: "500₺/seans", rating: 4.8, reviewCount: 56,
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    desc: "Doğum sonrası toparlanma programı, ev egzersizleri ve online takip hizmeti veriyorum. Evinize gelip ekipmansız antrenman planı da hazırlayabilirim.",
    level: "level-2", verified: ["Kimlik Doğrulandı", "Spor Eğitmenliği Sertifikası"],
    homeService: "esnek",
  },
  {
    id: 36, category: "yoga-koc", mode: "local", title: "Nefes Terapisi ve Bilinçli Nefes Seansları",
    provider: "Yudum Bulut — Nefes Terapisti", city: "Beşiktaş, İstanbul / Online", price: "500₺/seans", rating: 4.9, reviewCount: 34,
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    desc: "Kaygı, stres ve doğum sonrası toparlanma için nefes terapisi seansları veriyorum. Evinizde birebir ya da online yapılabilir, ilk seans tanışma amaçlıdır.",
    level: "level-1", verified: ["Kimlik Doğrulandı", "Nefes Terapisi Sertifikası"],
    homeService: "esnek",
  },
];

const CITIES = [
  // Türkiye — tüm iller
  { id: "adana", name: "Adana", country: "Türkiye", region: "Türkiye", lat: 37.0000, lng: 35.3213 },
  { id: "adiyaman", name: "Adıyaman", country: "Türkiye", region: "Türkiye", lat: 37.7648, lng: 38.2786 },
  { id: "afyonkarahisar", name: "Afyonkarahisar", country: "Türkiye", region: "Türkiye", lat: 38.7507, lng: 30.5567 },
  { id: "agri", name: "Ağrı", country: "Türkiye", region: "Türkiye", lat: 39.7191, lng: 43.0503 },
  { id: "aksaray", name: "Aksaray", country: "Türkiye", region: "Türkiye", lat: 38.3687, lng: 34.0360 },
  { id: "amasya", name: "Amasya", country: "Türkiye", region: "Türkiye", lat: 40.6499, lng: 35.8353 },
  { id: "ankara", name: "Ankara", country: "Türkiye", region: "Türkiye", lat: 39.9334, lng: 32.8597 },
  { id: "antalya", name: "Antalya", country: "Türkiye", region: "Türkiye", lat: 36.8969, lng: 30.7133 },
  { id: "ardahan", name: "Ardahan", country: "Türkiye", region: "Türkiye", lat: 41.1105, lng: 42.7022 },
  { id: "artvin", name: "Artvin", country: "Türkiye", region: "Türkiye", lat: 41.1828, lng: 41.8183 },
  { id: "aydin", name: "Aydın", country: "Türkiye", region: "Türkiye", lat: 37.8560, lng: 27.8416 },
  { id: "balikesir", name: "Balıkesir", country: "Türkiye", region: "Türkiye", lat: 39.6484, lng: 27.8826 },
  { id: "bartin", name: "Bartın", country: "Türkiye", region: "Türkiye", lat: 41.5811, lng: 32.4610 },
  { id: "batman", name: "Batman", country: "Türkiye", region: "Türkiye", lat: 37.8812, lng: 41.1351 },
  { id: "bayburt", name: "Bayburt", country: "Türkiye", region: "Türkiye", lat: 40.2552, lng: 40.2249 },
  { id: "bilecik", name: "Bilecik", country: "Türkiye", region: "Türkiye", lat: 40.1451, lng: 29.9798 },
  { id: "bingol", name: "Bingöl", country: "Türkiye", region: "Türkiye", lat: 38.8855, lng: 40.4966 },
  { id: "bitlis", name: "Bitlis", country: "Türkiye", region: "Türkiye", lat: 38.4006, lng: 42.1095 },
  { id: "bolu", name: "Bolu", country: "Türkiye", region: "Türkiye", lat: 40.7392, lng: 31.6089 },
  { id: "burdur", name: "Burdur", country: "Türkiye", region: "Türkiye", lat: 37.7203, lng: 30.2908 },
  { id: "bursa", name: "Bursa", country: "Türkiye", region: "Türkiye", lat: 40.1826, lng: 29.0669 },
  { id: "canakkale", name: "Çanakkale", country: "Türkiye", region: "Türkiye", lat: 40.1553, lng: 26.4142 },
  { id: "cankiri", name: "Çankırı", country: "Türkiye", region: "Türkiye", lat: 40.6013, lng: 33.6134 },
  { id: "corum", name: "Çorum", country: "Türkiye", region: "Türkiye", lat: 40.5506, lng: 34.9556 },
  { id: "denizli", name: "Denizli", country: "Türkiye", region: "Türkiye", lat: 37.7765, lng: 29.0864 },
  { id: "diyarbakir", name: "Diyarbakır", country: "Türkiye", region: "Türkiye", lat: 37.9144, lng: 40.2306 },
  { id: "duzce", name: "Düzce", country: "Türkiye", region: "Türkiye", lat: 40.8438, lng: 31.1565 },
  { id: "edirne", name: "Edirne", country: "Türkiye", region: "Türkiye", lat: 41.6771, lng: 26.5557 },
  { id: "elazig", name: "Elazığ", country: "Türkiye", region: "Türkiye", lat: 38.6810, lng: 39.2264 },
  { id: "erzincan", name: "Erzincan", country: "Türkiye", region: "Türkiye", lat: 39.7500, lng: 39.5000 },
  { id: "erzurum", name: "Erzurum", country: "Türkiye", region: "Türkiye", lat: 39.9000, lng: 41.2700 },
  { id: "eskisehir", name: "Eskişehir", country: "Türkiye", region: "Türkiye", lat: 39.7767, lng: 30.5206 },
  { id: "gaziantep", name: "Gaziantep", country: "Türkiye", region: "Türkiye", lat: 37.0662, lng: 37.3833 },
  { id: "giresun", name: "Giresun", country: "Türkiye", region: "Türkiye", lat: 40.9128, lng: 38.3895 },
  { id: "gumushane", name: "Gümüşhane", country: "Türkiye", region: "Türkiye", lat: 40.4386, lng: 39.5086 },
  { id: "hakkari", name: "Hakkari", country: "Türkiye", region: "Türkiye", lat: 37.5744, lng: 43.7408 },
  { id: "hatay", name: "Hatay", country: "Türkiye", region: "Türkiye", lat: 36.4018, lng: 36.3498 },
  { id: "igdir", name: "Iğdır", country: "Türkiye", region: "Türkiye", lat: 39.9167, lng: 44.0333 },
  { id: "isparta", name: "Isparta", country: "Türkiye", region: "Türkiye", lat: 37.7648, lng: 30.5566 },
  { id: "istanbul", name: "İstanbul", country: "Türkiye", region: "Türkiye", lat: 41.0082, lng: 28.9784 },
  { id: "izmir", name: "İzmir", country: "Türkiye", region: "Türkiye", lat: 38.4237, lng: 27.1428 },
  { id: "kahramanmaras", name: "Kahramanmaraş", country: "Türkiye", region: "Türkiye", lat: 37.5753, lng: 36.9228 },
  { id: "karabuk", name: "Karabük", country: "Türkiye", region: "Türkiye", lat: 41.2061, lng: 32.6204 },
  { id: "karaman", name: "Karaman", country: "Türkiye", region: "Türkiye", lat: 37.1759, lng: 33.2287 },
  { id: "kars", name: "Kars", country: "Türkiye", region: "Türkiye", lat: 40.6167, lng: 43.1000 },
  { id: "kastamonu", name: "Kastamonu", country: "Türkiye", region: "Türkiye", lat: 41.3887, lng: 33.7827 },
  { id: "kayseri", name: "Kayseri", country: "Türkiye", region: "Türkiye", lat: 38.7312, lng: 35.4787 },
  { id: "kirikkale", name: "Kırıkkale", country: "Türkiye", region: "Türkiye", lat: 39.8468, lng: 33.5153 },
  { id: "kirklareli", name: "Kırklareli", country: "Türkiye", region: "Türkiye", lat: 41.7333, lng: 27.2167 },
  { id: "kirsehir", name: "Kırşehir", country: "Türkiye", region: "Türkiye", lat: 39.1425, lng: 34.1709 },
  { id: "kilis", name: "Kilis", country: "Türkiye", region: "Türkiye", lat: 36.7184, lng: 37.1212 },
  { id: "kocaeli", name: "Kocaeli", country: "Türkiye", region: "Türkiye", lat: 40.8533, lng: 29.8815 },
  { id: "konya", name: "Konya", country: "Türkiye", region: "Türkiye", lat: 37.8746, lng: 32.4932 },
  { id: "kutahya", name: "Kütahya", country: "Türkiye", region: "Türkiye", lat: 39.4167, lng: 29.9833 },
  { id: "malatya", name: "Malatya", country: "Türkiye", region: "Türkiye", lat: 38.3552, lng: 38.3095 },
  { id: "manisa", name: "Manisa", country: "Türkiye", region: "Türkiye", lat: 38.6191, lng: 27.4289 },
  { id: "mardin", name: "Mardin", country: "Türkiye", region: "Türkiye", lat: 37.3212, lng: 40.7245 },
  { id: "mersin", name: "Mersin", country: "Türkiye", region: "Türkiye", lat: 36.8000, lng: 34.6333 },
  { id: "mugla", name: "Muğla", country: "Türkiye", region: "Türkiye", lat: 37.2153, lng: 28.3636 },
  { id: "mus", name: "Muş", country: "Türkiye", region: "Türkiye", lat: 38.9462, lng: 41.7539 },
  { id: "nevsehir", name: "Nevşehir", country: "Türkiye", region: "Türkiye", lat: 38.6939, lng: 34.6857 },
  { id: "nigde", name: "Niğde", country: "Türkiye", region: "Türkiye", lat: 37.9667, lng: 34.6833 },
  { id: "ordu", name: "Ordu", country: "Türkiye", region: "Türkiye", lat: 40.9839, lng: 37.8764 },
  { id: "osmaniye", name: "Osmaniye", country: "Türkiye", region: "Türkiye", lat: 37.0742, lng: 36.2478 },
  { id: "rize", name: "Rize", country: "Türkiye", region: "Türkiye", lat: 41.0201, lng: 40.5234 },
  { id: "sakarya", name: "Sakarya", country: "Türkiye", region: "Türkiye", lat: 40.6940, lng: 30.4358 },
  { id: "samsun", name: "Samsun", country: "Türkiye", region: "Türkiye", lat: 41.2867, lng: 36.3300 },
  { id: "siirt", name: "Siirt", country: "Türkiye", region: "Türkiye", lat: 37.9333, lng: 41.9500 },
  { id: "sinop", name: "Sinop", country: "Türkiye", region: "Türkiye", lat: 42.0231, lng: 35.1531 },
  { id: "sivas", name: "Sivas", country: "Türkiye", region: "Türkiye", lat: 39.7477, lng: 37.0179 },
  { id: "sanliurfa", name: "Şanlıurfa", country: "Türkiye", region: "Türkiye", lat: 37.1591, lng: 38.7969 },
  { id: "sirnak", name: "Şırnak", country: "Türkiye", region: "Türkiye", lat: 37.4187, lng: 42.4918 },
  { id: "tekirdag", name: "Tekirdağ", country: "Türkiye", region: "Türkiye", lat: 40.9833, lng: 27.5167 },
  { id: "tokat", name: "Tokat", country: "Türkiye", region: "Türkiye", lat: 40.3167, lng: 36.5500 },
  { id: "trabzon", name: "Trabzon", country: "Türkiye", region: "Türkiye", lat: 41.0027, lng: 39.7168 },
  { id: "tunceli", name: "Tunceli", country: "Türkiye", region: "Türkiye", lat: 39.3074, lng: 39.4388 },
  { id: "usak", name: "Uşak", country: "Türkiye", region: "Türkiye", lat: 38.6823, lng: 29.4082 },
  { id: "van", name: "Van", country: "Türkiye", region: "Türkiye", lat: 38.4891, lng: 43.4089 },
  { id: "yalova", name: "Yalova", country: "Türkiye", region: "Türkiye", lat: 40.6500, lng: 29.2667 },
  { id: "yozgat", name: "Yozgat", country: "Türkiye", region: "Türkiye", lat: 39.8181, lng: 34.8147 },
  { id: "zonguldak", name: "Zonguldak", country: "Türkiye", region: "Türkiye", lat: 41.4564, lng: 31.7987 },
  // Hindistan
  { id: "mumbai", name: "Mumbai", country: "Hindistan", region: "Hindistan", lat: 19.0760, lng: 72.8777 },
  { id: "delhi", name: "Delhi", country: "Hindistan", region: "Hindistan", lat: 28.7041, lng: 77.1025 },
  { id: "bangalore", name: "Bangalore", country: "Hindistan", region: "Hindistan", lat: 12.9716, lng: 77.5946 },
  { id: "hyderabad", name: "Hyderabad", country: "Hindistan", region: "Hindistan", lat: 17.3850, lng: 78.4867 },
  { id: "chennai", name: "Chennai", country: "Hindistan", region: "Hindistan", lat: 13.0827, lng: 80.2707 },
  // Avrupa (Türkiye dışı)
  { id: "london", name: "Londra", country: "Birleşik Krallık", region: "Avrupa", lat: 51.5072, lng: -0.1276 },
  { id: "berlin", name: "Berlin", country: "Almanya", region: "Avrupa", lat: 52.5200, lng: 13.4050 },
  { id: "paris", name: "Paris", country: "Fransa", region: "Avrupa", lat: 48.8566, lng: 2.3522 },
  { id: "amsterdam", name: "Amsterdam", country: "Hollanda", region: "Avrupa", lat: 52.3676, lng: 4.9041 },
  // Kuzey Amerika
  { id: "newyork", name: "New York", country: "ABD", region: "Kuzey Amerika", lat: 40.7128, lng: -74.0060 },
  { id: "losangeles", name: "Los Angeles", country: "ABD", region: "Kuzey Amerika", lat: 34.0522, lng: -118.2437 },
  { id: "toronto", name: "Toronto", country: "Kanada", region: "Kuzey Amerika", lat: 43.6532, lng: -79.3832 },
  // Orta Doğu
  { id: "dubai", name: "Dubai", country: "BAE", region: "Orta Doğu", lat: 25.2048, lng: 55.2708 },
  // Asya-Pasifik
  { id: "tokyo", name: "Tokyo", country: "Japonya", region: "Asya-Pasifik", lat: 35.6762, lng: 139.6503 },
  { id: "sydney", name: "Sidney", country: "Avustralya", region: "Asya-Pasifik", lat: -33.8688, lng: 151.2093 },
];

// Real approximate lat/lng per provider (used for genuine distance calculation)
// x/y are separate — stylized screen-position percentages for the visual map card of each city.
const LOCAL_PROVIDERS = [
  // İstanbul
  { id: 1, name: "Hakan Y.", category: "tadilat", homeService: "evde", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 42, y: 38, rating: 4.9, price: "8.500₺'den", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200" },
  { id: 2, name: "TemizPark Ekibi", category: "temizlik", homeService: "evde", city: "istanbul", district: "Üsküdar", lat: 41.0225, lng: 29.0163, x: 58, y: 30, rating: 4.8, price: "900₺'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  { id: 3, name: "Murat Nakliyat", category: "nakliye", homeService: "evde", city: "istanbul", district: "Beşiktaş", lat: 41.0422, lng: 29.0083, x: 30, y: 55, rating: 4.7, price: "3.200₺'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  { id: 4, name: "Selin Temizlik", category: "temizlik", homeService: "evde", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 48, y: 62, rating: 4.9, price: "800₺'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  { id: 5, name: "Kaya Tadilat", category: "tadilat", homeService: "evde", city: "istanbul", district: "Bakırköy", lat: 40.9819, lng: 28.8772, x: 20, y: 70, rating: 4.6, price: "6.000₺'den", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200" },
  { id: 6, name: "Hızlı Nakliyat", category: "nakliye", homeService: "evde", city: "istanbul", district: "Maltepe", lat: 40.9354, lng: 29.1553, x: 68, y: 66, rating: 4.5, price: "2.900₺'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  { id: 7, name: "Pak Temizlik", category: "temizlik", homeService: "evde", city: "istanbul", district: "Kartal", lat: 40.9061, lng: 29.1897, x: 75, y: 45, rating: 4.7, price: "850₺'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  { id: 8, name: "Ortaköy Anahtar Usta", category: "cilingir", homeService: "evde", city: "istanbul", district: "Ortaköy", lat: 41.0553, lng: 29.0272, x: 36, y: 44, rating: 4.8, price: "450₺'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  { id: 9, name: "Barış Çilingir", category: "cilingir", homeService: "evde", city: "istanbul", district: "Ortaköy", lat: 41.0489, lng: 29.0219, x: 40, y: 47, rating: 4.6, price: "500₺'den", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200" },
  { id: 10, name: "Hızlı Çilingir Servisi", category: "cilingir", homeService: "evde", city: "istanbul", district: "Ortaköy", lat: 41.0577, lng: 29.0339, x: 33, y: 41, rating: 4.9, price: "400₺'den", img: "https://images.unsplash.com/photo-1632823469850-1b7b1e8b7d4a?w=200" },
  // Ankara
  { id: 11, name: "Başkent Nakliyat", category: "nakliye", homeService: "evde", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 45, y: 55, rating: 4.7, price: "2.800₺'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  { id: 12, name: "Ankara Anahtarcı", category: "cilingir", homeService: "evde", city: "ankara", district: "Kızılay", lat: 39.9208, lng: 32.8541, x: 40, y: 45, rating: 4.8, price: "400₺'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  { id: 13, name: "Parlak Temizlik", category: "temizlik", homeService: "evde", city: "ankara", district: "Keçiören", lat: 39.9836, lng: 32.8628, x: 50, y: 20, rating: 4.6, price: "750₺'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  { id: 14, name: "Duran Usta Tadilat", category: "tadilat", homeService: "evde", city: "ankara", district: "Etimesgut", lat: 39.9500, lng: 32.6683, x: 15, y: 35, rating: 4.9, price: "5.500₺'den", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200" },
  // İzmir
  { id: 15, name: "Ege Nakliyat", category: "nakliye", homeService: "evde", city: "izmir", district: "Bornova", lat: 38.4691, lng: 27.2170, x: 65, y: 35, rating: 4.7, price: "3.000₺'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  { id: 16, name: "Konak Çilingir", category: "cilingir", homeService: "evde", city: "izmir", district: "Konak", lat: 38.4192, lng: 27.1287, x: 35, y: 55, rating: 4.9, price: "420₺'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  { id: 17, name: "Deniz Temizlik", category: "temizlik", homeService: "evde", city: "izmir", district: "Karşıyaka", lat: 38.4614, lng: 27.1128, x: 30, y: 20, rating: 4.8, price: "800₺'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  // Bursa
  { id: 18, name: "Uludağ Tadilat", category: "tadilat", homeService: "evde", city: "bursa", district: "Osmangazi", lat: 40.1885, lng: 29.0610, x: 45, y: 45, rating: 4.6, price: "5.000₺'den", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200" },
  { id: 19, name: "Bursa Nakliyat Ekibi", category: "nakliye", homeService: "evde", city: "bursa", district: "Nilüfer", lat: 40.2138, lng: 28.9903, x: 25, y: 35, rating: 4.7, price: "2.700₺'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  // Antalya
  { id: 20, name: "Akdeniz Temizlik", category: "temizlik", homeService: "evde", city: "antalya", district: "Muratpaşa", lat: 36.8841, lng: 30.7056, x: 50, y: 55, rating: 4.8, price: "780₺'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  { id: 21, name: "Antalya Çilingir 7/24", category: "cilingir", homeService: "evde", city: "antalya", district: "Konyaaltı", lat: 36.8611, lng: 30.6339, x: 20, y: 60, rating: 4.9, price: "450₺'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  // London
  { id: 22, name: "City Locksmiths", category: "cilingir", homeService: "evde", city: "london", district: "Camden", lat: 51.5390, lng: -0.1426, x: 45, y: 30, rating: 4.8, price: "£45'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  { id: 23, name: "Thames Removals", category: "nakliye", homeService: "evde", city: "london", district: "Greenwich", lat: 51.4826, lng: -0.0077, x: 65, y: 60, rating: 4.6, price: "£180'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  // Berlin
  { id: 24, name: "Berlin Reinigung", category: "temizlik", homeService: "evde", city: "berlin", district: "Kreuzberg", lat: 52.4996, lng: 13.4033, x: 40, y: 55, rating: 4.7, price: "€25'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  { id: 25, name: "Schnell Schlüsseldienst", category: "cilingir", homeService: "evde", city: "berlin", district: "Mitte", lat: 52.5170, lng: 13.3888, x: 45, y: 40, rating: 4.9, price: "€40'dan", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  // Paris
  { id: 26, name: "Serrurier Paris", category: "cilingir", homeService: "evde", city: "paris", district: "Le Marais", lat: 48.8606, lng: 2.3622, x: 50, y: 45, rating: 4.7, price: "€50'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  // Amsterdam
  { id: 27, name: "Amsterdam Verhuizers", category: "nakliye", homeService: "evde", city: "amsterdam", district: "Jordaan", lat: 52.3745, lng: 4.8809, x: 40, y: 40, rating: 4.6, price: "€150'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  // New York
  { id: 28, name: "Manhattan Locksmith 24/7", category: "cilingir", homeService: "evde", city: "newyork", district: "Midtown", lat: 40.7549, lng: -73.9840, x: 50, y: 35, rating: 4.8, price: "$60'dan", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  { id: 29, name: "Brooklyn Movers Co.", category: "nakliye", homeService: "evde", city: "newyork", district: "Brooklyn", lat: 40.6782, lng: -73.9442, x: 65, y: 65, rating: 4.5, price: "$220'dan", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  { id: 30, name: "Sparkle NYC Cleaning", category: "temizlik", homeService: "evde", city: "newyork", district: "Queens", lat: 40.7282, lng: -73.7949, x: 75, y: 30, rating: 4.7, price: "$80'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  // Los Angeles
  { id: 31, name: "LA Handyman Pro", category: "tadilat", homeService: "evde", city: "losangeles", district: "Venice", lat: 33.9850, lng: -118.4695, x: 25, y: 60, rating: 4.6, price: "$95'den", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200" },
  // Toronto
  { id: 32, name: "Toronto Cleaning Crew", category: "temizlik", homeService: "evde", city: "toronto", district: "Downtown", lat: 43.6511, lng: -79.3838, x: 50, y: 50, rating: 4.7, price: "CA$70'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  // Dubai
  { id: 33, name: "Dubai Express Movers", category: "nakliye", homeService: "evde", city: "dubai", district: "Marina", lat: 25.0805, lng: 55.1403, x: 30, y: 60, rating: 4.8, price: "550 AED'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  { id: 34, name: "Al Fahim Locksmith", category: "cilingir", homeService: "evde", city: "dubai", district: "Deira", lat: 25.2697, lng: 55.3095, x: 65, y: 30, rating: 4.7, price: "150 AED'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  // Tokyo
  { id: 35, name: "Tokyo Kagi Service", category: "cilingir", homeService: "evde", city: "tokyo", district: "Shibuya", lat: 35.6580, lng: 139.7016, x: 40, y: 55, rating: 4.9, price: "¥6.000'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  // Sydney
  { id: 36, name: "Sydney Harbour Cleaners", category: "temizlik", homeService: "evde", city: "sydney", district: "Bondi", lat: -33.8908, lng: 151.2743, x: 60, y: 55, rating: 4.6, price: "AU$90'dan", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  // Mumbai
  { id: 37, name: "Mumbai Quick Locksmith", category: "cilingir", homeService: "evde", city: "mumbai", district: "Andheri", lat: 19.1197, lng: 72.8468, x: 35, y: 40, rating: 4.7, price: "₹500'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  { id: 38, name: "Shree Packers & Movers", category: "nakliye", homeService: "evde", city: "mumbai", district: "Bandra", lat: 19.0596, lng: 72.8295, x: 45, y: 55, rating: 4.6, price: "₹3.500'den", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=200" },
  // Delhi
  { id: 39, name: "Delhi Deep Clean Services", category: "temizlik", homeService: "evde", city: "delhi", district: "Saket", lat: 28.5244, lng: 77.2066, x: 50, y: 60, rating: 4.8, price: "₹800'den", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200" },
  { id: 40, name: "Capital Renovation Works", category: "tadilat", homeService: "evde", city: "delhi", district: "Dwarka", lat: 28.5921, lng: 77.0460, x: 25, y: 45, rating: 4.5, price: "₹15.000'den", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200" },
  // Bangalore
  { id: 41, name: "Bangalore 24x7 Locksmith", category: "cilingir", homeService: "evde", city: "bangalore", district: "Koramangala", lat: 12.9352, lng: 77.6245, x: 55, y: 60, rating: 4.9, price: "₹450'den", img: "https://images.unsplash.com/photo-1622037022824-0c71d511ad76?w=200" },
  // Öğretmen
  { id: 42, name: "Deniz Aydın", category: "ogretmen", homeService: "esnek", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 47, y: 58, rating: 4.9, price: "350₺/saat", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200" },
  { id: 43, name: "İstanbul Özel Ders Merkezi", category: "ogretmen", homeService: "esnek", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 50, y: 60, rating: 4.7, price: "320₺/saat", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200" },
  { id: 44, name: "Ege Akademi Özel Ders", category: "ogretmen", homeService: "esnek", city: "izmir", district: "Bornova", lat: 38.4691, lng: 27.2170, x: 67, y: 37, rating: 4.8, price: "300₺/saat", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200" },
  // Bakıcı
  { id: 45, name: "Fatma H.", category: "bakici", homeService: "evde", city: "istanbul", district: "Beşiktaş", lat: 41.0422, lng: 29.0083, x: 32, y: 53, rating: 4.8, price: "300₺/gün", img: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=200" },
  { id: 46, name: "Güvenilir Bakıcılık Hizmeti", category: "bakici", homeService: "evde", city: "ankara", district: "Yenimahalle", lat: 39.9700, lng: 32.7900, x: 30, y: 25, rating: 4.6, price: "280₺/gün", img: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=200" },
  // Mühendis
  { id: 47, name: "Emre Y. İnşaat Müh.", category: "muhendis", homeService: "esnek", city: "izmir", district: "Bornova", lat: 38.4691, lng: 27.2170, x: 67, y: 37, rating: 4.9, price: "6.000₺'den", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200" },
  { id: 48, name: "Yılmaz Mühendislik", category: "muhendis", homeService: "esnek", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 42, y: 38, rating: 4.7, price: "5.500₺'den", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200" },
  // Hasta Bakıcı
  { id: 49, name: "Songül T.", category: "hasta-bakici", homeService: "evde", city: "istanbul", district: "Üsküdar", lat: 41.0225, lng: 29.0163, x: 58, y: 30, rating: 4.9, price: "350₺/gün", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200" },
  { id: 50, name: "Nazan Bakım Hizmetleri", category: "hasta-bakici", homeService: "evde", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 47, y: 58, rating: 4.7, price: "380₺/gün", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200" },
  // Hemşire
  { id: 51, name: "Hemşire Aylin K.", category: "hemsire", homeService: "evde", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 44, y: 55, rating: 5.0, price: "300₺'den", img: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=200" },
  { id: 52, name: "Hemşire Onur D.", category: "hemsire", homeService: "evde", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 45, y: 40, rating: 4.8, price: "280₺'den", img: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=200" },
  // Fizyoterapist
  { id: 53, name: "Fzt. Kerem A.", category: "fizyoterapist", homeService: "evde", city: "izmir", district: "Konak", lat: 38.4192, lng: 27.1287, x: 38, y: 58, rating: 4.8, price: "500₺/seans", img: "https://images.unsplash.com/photo-1567168539593-59673ababaee?w=200" },
  { id: 54, name: "Fzt. Selin B.", category: "fizyoterapist", homeService: "evde", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 51, y: 63, rating: 4.9, price: "450₺/seans", img: "https://images.unsplash.com/photo-1567168539593-59673ababaee?w=200" },
  // Makyaj
  { id: 55, name: "Melis Makyaj Atölyesi", category: "makyaj", homeService: "evde", city: "istanbul", district: "Beşiktaş", lat: 41.0422, lng: 29.0083, x: 30, y: 52, rating: 4.9, price: "1.200₺'den", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200" },
  { id: 56, name: "Naz Güzellik", category: "makyaj", homeService: "evde", city: "ankara", district: "Kızılay", lat: 39.9208, lng: 32.8541, x: 40, y: 45, rating: 5.0, price: "1.400₺'den", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200" },
  // Cilt Bakımı
  { id: 57, name: "Dermo Güzellik Merkezi", category: "bakim", homeService: "mekanda", city: "izmir", district: "Konak", lat: 38.4192, lng: 27.1287, x: 35, y: 55, rating: 4.8, price: "650₺'den", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200" },
  { id: 58, name: "Glow Skin Studio", category: "bakim", homeService: "mekanda", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 43, y: 39, rating: 4.6, price: "580₺'den", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200" },
  // Kuaför
  { id: 59, name: "Studio Reyhan", category: "bakim", homeService: "mekanda", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 46, y: 42, rating: 4.9, price: "500₺'den", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200" },
  { id: 60, name: "Berrak Kuaför", category: "bakim", homeService: "mekanda", city: "ankara", district: "Kızılay", lat: 39.9208, lng: 32.8541, x: 42, y: 47, rating: 4.7, price: "420₺'den", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200" },
  { id: 61, name: "Hair Lounge", category: "bakim", homeService: "mekanda", city: "izmir", district: "Alsancak", lat: 38.4380, lng: 27.1428, x: 40, y: 45, rating: 4.8, price: "550₺'den", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200" },
  { id: 62, name: "Şişli Saç Tasarım", category: "bakim", homeService: "mekanda", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 52, y: 61, rating: 4.6, price: "480₺'den", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200" },
  // Terzi
  { id: 63, name: "Terzi Necla Hanım", category: "terzi", homeService: "mekanda", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 45, y: 56, rating: 4.8, price: "150₺'den", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200" },
  { id: 64, name: "Moda Terzi Atölyesi", category: "terzi", homeService: "mekanda", city: "istanbul", district: "Beşiktaş", lat: 41.0422, lng: 29.0083, x: 33, y: 54, rating: 4.6, price: "180₺'den", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200" },
  { id: 65, name: "Hızlı Tadilat Terzi", category: "terzi", homeService: "mekanda", city: "izmir", district: "Konak", lat: 38.4192, lng: 27.1287, x: 37, y: 57, rating: 4.5, price: "130₺'den", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200" },
  // Diyetisyen
  { id: 66, name: "Dyt. Ceren Yıldız", category: "diyetisyen", homeService: "esnek", city: "istanbul", district: "Beşiktaş", lat: 41.0422, lng: 29.0083, x: 31, y: 51, rating: 4.9, price: "600₺'den", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200" },
  { id: 67, name: "Beslenme Kliniği", category: "diyetisyen", homeService: "esnek", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 46, y: 57, rating: 4.8, price: "650₺'den", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200" },
  // Psikolog
  { id: 68, name: "Psk. Selin Arslan", category: "psikolog", homeService: "esnek", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 43, y: 60, rating: 5.0, price: "750₺'den", img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=200" },
  { id: 69, name: "Yaşam Terapi Merkezi", category: "psikolog", homeService: "esnek", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 54, y: 58, rating: 4.9, price: "800₺'den", img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=200" },
  // Loğusa Bakıcısı
  { id: 70, name: "Hemşire Gül T.", category: "logusa-bakicisi", homeService: "evde", city: "istanbul", district: "Üsküdar", lat: 41.0225, lng: 29.0163, x: 60, y: 28, rating: 4.9, price: "400₺/gün", img: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=200" },
  // Emzirme Danışmanı
  { id: 71, name: "IBCLC Deniz K.", category: "emzirme-danismani", homeService: "evde", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 44, y: 36, rating: 5.0, price: "500₺'den", img: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=200" },
  // Elektrikçi
  { id: 72, name: "Elektrikçi Hasan Usta", category: "elektrikci", homeService: "evde", city: "izmir", district: "Bornova", lat: 38.4691, lng: 27.2170, x: 70, y: 33, rating: 4.7, price: "350₺'den", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200" },
  { id: 73, name: "Güven Elektrik", category: "elektrikci", homeService: "evde", city: "istanbul", district: "Kartal", lat: 40.9061, lng: 29.1897, x: 77, y: 47, rating: 4.9, price: "400₺'den", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200" },
  // Su Tesisatçısı
  { id: 74, name: "Tesisatçı Murat", category: "su-tesisatcisi", homeService: "evde", city: "istanbul", district: "Maltepe", lat: 40.9354, lng: 29.1553, x: 66, y: 64, rating: 4.6, price: "400₺'den", img: "https://images.unsplash.com/photo-1607472829122-63c2b7c4b1b7?w=200" },
  { id: 75, name: "Anadolu Tesisat", category: "su-tesisatcisi", homeService: "evde", city: "ankara", district: "Etimesgut", lat: 39.9500, lng: 32.6683, x: 17, y: 33, rating: 4.8, price: "450₺'den", img: "https://images.unsplash.com/photo-1607472829122-63c2b7c4b1b7?w=200" },
  // Halı & Koltuk Yıkama
  { id: 76, name: "TemizPark Halı Yıkama", category: "hali-yikama", homeService: "evde", city: "izmir", district: "Konak", lat: 38.4192, lng: 27.1287, x: 33, y: 52, rating: 4.8, price: "80₺/m²'den", img: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200" },
  { id: 77, name: "Işıl Halı Yıkama", category: "hali-yikama", homeService: "evde", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 49, y: 60, rating: 4.6, price: "65₺/m²'den", img: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200" },
  // Doğum Günü / Etkinlik Organizatörü
  { id: 78, name: "Renkli Partiler Ekibi", category: "etkinlik-organizatoru", homeService: "esnek", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 47, y: 65, rating: 4.9, price: "3.500₺'den", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200" },
  // Kaş & Kirpik
  { id: 79, name: "Brow Studio Zeynep", category: "bakim", homeService: "mekanda", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 48, y: 34, rating: 4.9, price: "600₺'den", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200" },
  { id: 80, name: "Lash & Brow Bar", category: "bakim", homeService: "mekanda", city: "izmir", district: "Alsancak", lat: 38.4380, lng: 27.1428, x: 43, y: 42, rating: 4.7, price: "550₺'den", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200" },
  // Masaj & Spa
  { id: 81, name: "Huzur Masaj Stüdyosu", category: "bakim", homeService: "mekanda", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 40, y: 62, rating: 4.8, price: "700₺'den", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200" },
  // Yemek
  { id: 82, name: "Elif'in Mutfağı", category: "yemek", homeService: "evde", city: "istanbul", district: "Üsküdar", lat: 41.0225, lng: 29.0163, x: 55, y: 25, rating: 4.9, price: "800₺/hafta'dan", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200" },
  { id: 83, name: "Ev Sofrası Catering", category: "yemek", homeService: "evde", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 48, y: 52, rating: 4.7, price: "950₺/hafta'dan", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200" },
  // Yoga & Meditasyon / Yaşam Koçu
  { id: 84, name: "Ayşe Nur — Yoga & Yaşam Koçu", category: "yoga-koc", homeService: "esnek", city: "istanbul", district: "Kadıköy", lat: 40.9833, lng: 29.0333, x: 41, y: 33, rating: 4.9, price: "450₺'den", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200" },
  { id: 85, name: "Huzur Yoga Stüdyosu", category: "yoga-koc", homeService: "esnek", city: "izmir", district: "Alsancak", lat: 38.4380, lng: 27.1428, x: 45, y: 48, rating: 4.8, price: "400₺'den", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200" },
  { id: 92, name: "Yudum Bulut — Nefes Terapisti", category: "yoga-koc", homeService: "esnek", city: "istanbul", district: "Beşiktaş", lat: 41.0422, lng: 29.0083, x: 36, y: 58, rating: 4.9, price: "500₺/seans", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200" },
  // Bahçe / Bakım
  { id: 86, name: "Yeşil Bahçe Ekibi", category: "bahce-bakim", homeService: "evde", city: "istanbul", district: "Beykoz", lat: 41.1250, lng: 29.0958, x: 60, y: 15, rating: 4.7, price: "500₺'den", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200" },
  { id: 87, name: "Bahçıvan Kemal", category: "bahce-bakim", homeService: "evde", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 38, y: 64, rating: 4.5, price: "400₺'den", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200" },
  // Profesyonel Fotoğraf
  { id: 88, name: "Cansu Kaya Fotoğrafçılık", category: "profesyonel-fotograf", homeService: "evde", city: "istanbul", district: "Şişli", lat: 41.0602, lng: 28.9877, x: 50, y: 63, rating: 5.0, price: "2.500₺'den", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200" },
  { id: 89, name: "Foto Stüdyo Aile", category: "profesyonel-fotograf", homeService: "evde", city: "izmir", district: "Konak", lat: 38.4192, lng: 27.1287, x: 39, y: 60, rating: 4.7, price: "1.800₺'den", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200" },
  // Spor Eğitmeni
  { id: 90, name: "Buğra Fit — Kişisel Antrenör", category: "spor-egitmeni", homeService: "esnek", city: "istanbul", district: "Beşiktaş", lat: 41.0422, lng: 29.0083, x: 34, y: 56, rating: 4.8, price: "500₺'den", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200" },
  { id: 91, name: "Form Stüdyo", category: "spor-egitmeni", homeService: "esnek", city: "ankara", district: "Çankaya", lat: 39.9179, lng: 32.8627, x: 42, y: 59, rating: 4.9, price: "550₺'den", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200" },
];

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const LOCAL_ONLY_CATEGORIES = CATEGORIES.filter((c) => c.mode === "local" || c.mode === "both");

const OFFER_POOLS = {
  bakici: [
    { name: "Ayşe T.", initials: "AT", price: "280₺/gün", priceValue: 280, time: "8 dk önce", minutesAgo: 8, rating: 4.9, message: "5 yıldır çocuk gelişimi alanında çalışıyorum, oyun temelli aktivitelerle vaktini değerlendiririm. Referanslarım mevcut." },
    { name: "Zehra K.", initials: "ZK", price: "300₺/gün", priceValue: 300, time: "15 dk önce", minutesAgo: 15, rating: 4.8, message: "Anaokulu öğretmenliği geçmişim var. Sabah 9 - akşam 6 arası müsaitim, hafta içi/sonu fark etmez." },
    { name: "Melis Y.", initials: "MY", price: "260₺/gün", priceValue: 260, time: "22 dk önce", minutesAgo: 22, rating: 4.7, message: "Üniversite öğrencisiyim, esnek saatlerde uygunum. İlk yardım sertifikam var, çocuklarla aram çok iyi." },
    { name: "Nur Bakım Hizmetleri", initials: "NB", price: "320₺/gün", priceValue: 320, time: "35 dk önce", minutesAgo: 35, rating: 4.9, message: "Kurumsal bakıcılık hizmeti veriyoruz, sigortalı personel ve referans kontrolü yapılmış ekip." },
    { name: "Elif D.", initials: "ED", price: "270₺/gün", priceValue: 270, time: "1 saat önce", minutesAgo: 60, rating: 4.6, message: "Psikoloji bölümü son sınıf öğrencisiyim, çocuk gelişimi dersleri aldım. Haftalık düzenli çalışabilirim." },
    { name: "Aile Yanında Bakım", initials: "AY", price: "290₺/gün", priceValue: 290, time: "1 saat önce", minutesAgo: 65, rating: 4.8, message: "7 yıllık tecrübe, 2-8 yaş arası çocuklarla oyun ve eğitim odaklı vakit geçiriyoruz." },
    { name: "Sema A.", initials: "SA", price: "250₺/gün", priceValue: 250, time: "2 saat önce", minutesAgo: 120, rating: 4.5, message: "Part-time uygun, öğretmenlik okuyorum. Referans verebilirim, deneme günü de yapabiliriz." },
  ],
  tadilat: [
    { name: "Hakan Y.", initials: "HY", price: "7.800₺", priceValue: 7800, time: "12 dk önce", minutesAgo: 12, rating: 4.9, message: "Merhaba, fotoğrafları inceledim. Malzeme dahil 7.800₺'ye 3 günde teslim ederim. Referanslarımı profilimden görebilirsiniz." },
    { name: "Kaya Tadilat", initials: "KT", price: "6.500₺", priceValue: 6500, time: "40 dk önce", minutesAgo: 40, rating: 4.6, message: "İşi yerinde görmem lazım ama tahmini 6.500₺ civarı. Yarın öğleden sonra uygun olur mu?" },
    { name: "Onur Usta", initials: "OU", price: "9.200₺", priceValue: 9200, time: "1 saat önce", minutesAgo: 60, rating: 5.0, message: "20 yıllık ustayım, kaliteli malzeme kullanıyorum. Fiyatım biraz yüksek ama garantili iş çıkarıyorum." },
    { name: "Serdar Yapı", initials: "SY", price: "7.200₺", priceValue: 7200, time: "2 saat önce", minutesAgo: 120, rating: 4.7, message: "Ekip olarak çalışıyoruz, işi 2 günde bitiririz. Öncesinde ücretsiz keşif yapabiliriz." },
  ],
  tirnakci: [
    { name: "Naz Nail Art", initials: "NN", price: "450₺", priceValue: 450, time: "5 dk önce", minutesAgo: 5, rating: 5.0, message: "Gel manikür + istediğin tasarım dahil. Bu hafta cuma/cumartesi müsaitlik var, DM'den saat ayarlayalım." },
    { name: "Ela Beauty", initials: "EB", price: "380₺", priceValue: 380, time: "18 dk önce", minutesAgo: 18, rating: 4.8, message: "Minimal ve chrome tasarımlarda uzmanım. Referans fotoğraflarımı profilimde görebilirsin." },
    { name: "Cilalı Stüdyo", initials: "CS", price: "500₺", priceValue: 500, time: "30 dk önce", minutesAgo: 30, rating: 4.9, message: "3D nail art ve baby boomer tasarım yapıyoruz, ürünlerimiz hijyenik ambalajlı ve tek kullanımlık." },
    { name: "Buse Tırnak Sanatı", initials: "BT", price: "420₺", priceValue: 420, time: "1 saat önce", minutesAgo: 60, rating: 4.7, message: "Evimde stüdyo ortamında çalışıyorum, sakin bir ortamda rahat işlem yapabiliriz." },
    { name: "Glow Nails", initials: "GN", price: "460₺", priceValue: 460, time: "1 saat önce", minutesAgo: 62, rating: 4.9, message: "Ombre ve French tasarımlarda deneyimliyim, kalıcılık garantisi veriyorum." },
  ],
  generic: [
    { name: "Can B.", initials: "CB", price: "850₺", priceValue: 850, time: "10 dk önce", minutesAgo: 10, rating: 4.7, message: "İlanını gördüm, detayları konuşabilir miyiz? Deneyimliyim ve referans verebilirim." },
    { name: "Selin K.", initials: "SK", price: "700₺", priceValue: 700, time: "25 dk önce", minutesAgo: 25, rating: 4.8, message: "Bu alanda birkaç yıldır çalışıyorum, uygun bir zamanda görüşelim isterim." },
    { name: "Profesyonel Ekip", initials: "PE", price: "1.100₺", priceValue: 1100, time: "45 dk önce", minutesAgo: 45, rating: 4.6, message: "Ekibimizle bu tür işleri sıkça yapıyoruz, portföyümüzü paylaşabiliriz." },
    { name: "Murat D.", initials: "MD", price: "650₺", priceValue: 650, time: "1 saat önce", minutesAgo: 60, rating: 4.5, message: "Merhaba, ihtiyacını daha net anlamak isterim, mesaj atabilir misin?" },
    { name: "Aylin T.", initials: "AT", price: "780₺", priceValue: 780, time: "2 saat önce", minutesAgo: 120, rating: 4.9, message: "Bu konuda deneyimliyim, kısa sürede tamamlayabilirim." },
  ],
  temizlik: [
    { name: "TemizPark Ekibi", initials: "TP", price: "900₺", priceValue: 900, time: "9 dk önce", minutesAgo: 9, rating: 4.8, message: "Ekip halinde geliyoruz, malzemeler bizde. Bugün öğleden sonra da müsaitlik var." },
    { name: "Selin Temizlik", initials: "ST", price: "800₺", priceValue: 800, time: "20 dk önce", minutesAgo: 20, rating: 4.9, message: "Cam ve derin temizlik dahil paket sunuyorum. Referanslarım profilimde mevcut." },
    { name: "Pak Temizlik", initials: "PK", price: "1.050₺", priceValue: 1050, time: "38 dk önce", minutesAgo: 38, rating: 4.7, message: "Profesyonel ekipmanla çalışıyoruz, halı yıkama da dahil edebiliriz." },
    { name: "Parlak Ev Bakım", initials: "PE", price: "750₺", priceValue: 750, time: "1 saat önce", minutesAgo: 55, rating: 4.6, message: "Haftalık düzenli anlaşma yaparsak fiyatta indirim yapabilirim." },
    { name: "Deniz Temizlik", initials: "DT", price: "870₺", priceValue: 870, time: "1 saat önce", minutesAgo: 70, rating: 4.8, message: "Bugün için uygunum, 2 kişilik ekiple 2-3 saatte biter." },
  ],
  nakliye: [
    { name: "Murat Nakliyat", initials: "MN", price: "3.200₺", priceValue: 3200, time: "14 dk önce", minutesAgo: 14, rating: 4.7, message: "Sigortalı taşıma yapıyoruz, asansörlü araç mevcut. Paketleme de dahil edebiliriz." },
    { name: "Hızlı Nakliyat", initials: "HN", price: "2.900₺", priceValue: 2900, time: "27 dk önce", minutesAgo: 27, rating: 4.5, message: "Bugün akşam müsaitim, ekip 3 kişi. Montaj-demontaj hizmeti de veriyoruz." },
    { name: "Güven Evden Eve", initials: "GE", price: "3.600₺", priceValue: 3600, time: "50 dk önce", minutesAgo: 50, rating: 4.9, message: "20 yıllık firma, tam sigortalı. Ücretsiz keşif yapıp kesin fiyat veririz." },
    { name: "Ekspres Taşımacılık", initials: "ET", price: "2.750₺", priceValue: 2750, time: "1 saat önce", minutesAgo: 65, rating: 4.4, message: "Uygun fiyat garantisi veriyoruz, hafta içi indirimli çalışıyoruz." },
  ],
  cilingir: [
    { name: "Ortaköy Anahtar Usta", initials: "OA", price: "450₺", priceValue: 450, time: "4 dk önce", minutesAgo: 4, rating: 4.8, message: "15 dakikada adresinize ulaşabilirim, kapı açma + kilit kontrolü dahil." },
    { name: "Hızlı Çilingir Servisi", initials: "HC", price: "400₺", priceValue: 400, time: "9 dk önce", minutesAgo: 9, rating: 4.9, message: "7/24 hizmet veriyorum, şu an yakınınızdayım, 10 dakikada gelirim." },
    { name: "Barış Çilingir", initials: "BC", price: "500₺", priceValue: 500, time: "16 dk önce", minutesAgo: 16, rating: 4.6, message: "Kilit değişimi de gerekiyorsa uygun fiyata yapabilirim, yanımda stok var." },
    { name: "Güvenlik Kilit Sistemleri", initials: "GK", price: "480₺", priceValue: 480, time: "25 dk önce", minutesAgo: 25, rating: 4.7, message: "Çelik kapı ve site girişlerinde uzmanız, faturalı hizmet veriyoruz." },
  ],
  ogretmen: [
    { name: "Deniz Aydın", initials: "DA", price: "350₺/saat", priceValue: 350, time: "11 dk önce", minutesAgo: 11, rating: 4.9, message: "10 yıllık matematik öğretmeniyim, LGS'ye hazırlık konusunda deneyimliyim. İlk ders tanışma amaçlı indirimli." },
    { name: "İstanbul Özel Ders Merkezi", initials: "İÖ", price: "320₺/saat", priceValue: 320, time: "24 dk önce", minutesAgo: 24, rating: 4.7, message: "Alanında uzman öğretmen kadromuzla birebir veya grup ders imkanı sunuyoruz." },
    { name: "Ege Akademi", initials: "EA", price: "300₺/saat", priceValue: 300, time: "40 dk önce", minutesAgo: 40, rating: 4.8, message: "Online veya yüz yüze esnek program, deneme dersi ücretsiz." },
    { name: "Can Hoca", initials: "CH", price: "280₺/saat", priceValue: 280, time: "55 dk önce", minutesAgo: 55, rating: 4.6, message: "Üniversite öğrencisiyim, alanımda başarılıyım. Uygun fiyata düzenli ders verebilirim." },
  ],
  muhendis: [
    { name: "Emre Y. İnşaat Müh.", initials: "EY", price: "6.000₺", priceValue: 6000, time: "18 dk önce", minutesAgo: 18, rating: 4.9, message: "Statik proje ve zemin etüdü değerlendirmesi dahil, 5 iş günü teslim." },
    { name: "Yılmaz Mühendislik", initials: "YM", price: "5.500₺", priceValue: 5500, time: "33 dk önce", minutesAgo: 33, rating: 4.7, message: "Yerinde keşif yapıp kesin teklif veririz, proje çizimleri dahildir." },
    { name: "Duran Usta Tadilat", initials: "DU", price: "5.800₺", priceValue: 5800, time: "50 dk önce", minutesAgo: 50, rating: 4.9, message: "Yapı denetim danışmanlığı da verebiliriz, referans projelerimiz mevcut." },
  ],
  tasarim: [
    { name: "Zeynep D.", initials: "ZD", price: "2.800₺", priceValue: 2800, time: "7 dk önce", minutesAgo: 7, rating: 4.9, message: "Marka kimliği + logo paketi, 3 revizyon hakkı dahil. Portföyümü paylaşabilirim." },
    { name: "Onur Grafik", initials: "OG", price: "2.200₺", priceValue: 2200, time: "19 dk önce", minutesAgo: 19, rating: 4.6, message: "Minimal ve modern tasarım tarzım var, 4 gün içinde teslim ederim." },
    { name: "Pixel Studio", initials: "PS", price: "3.500₺", priceValue: 3500, time: "35 dk önce", minutesAgo: 35, rating: 5.0, message: "Kurumsal kimlik kılavuzu dahil tam paket sunuyoruz, ekip çalışması." },
  ],
  yazilim: [
    { name: "Elif K.", initials: "EK", price: "450₺/saat", priceValue: 450, time: "6 dk önce", minutesAgo: 6, rating: 5.0, message: "React & Node.js ile 5 yıllık deneyimim var, benzer bir projeyi geçen ay tamamladım." },
    { name: "Kaan Yazılım", initials: "KY", price: "380₺/saat", priceValue: 380, time: "21 dk önce", minutesAgo: 21, rating: 4.7, message: "Full-stack geliştirici, API entegrasyonu ve veritabanı tasarımı dahil çalışıyorum." },
    { name: "Code Atölyesi", initials: "CA", price: "500₺/saat", priceValue: 500, time: "40 dk önce", minutesAgo: 40, rating: 4.9, message: "3 kişilik ekibiz, sprint bazlı çalışıp düzenli demo sunuyoruz." },
    { name: "Berk S.", initials: "BS", price: "320₺/saat", priceValue: 320, time: "1 saat önce", minutesAgo: 58, rating: 4.5, message: "Freelance olarak çalışıyorum, esnek saatlerde iletişimde kalabilirim." },
  ],
  "hasta-bakici": [
    { name: "Songül T.", initials: "ST", price: "350₺/gün", priceValue: 350, time: "9 dk önce", minutesAgo: 9, rating: 4.9, message: "12 yıllık deneyimim var, gece nöbeti de alabilirim. İlaç takibi konusunda titizim." },
    { name: "Nazan Bakım Hizmetleri", initials: "NB", price: "380₺/gün", priceValue: 380, time: "20 dk önce", minutesAgo: 20, rating: 4.7, message: "Kurumsal ekip olarak çalışıyoruz, sigortalı ve referans kontrollü personel sağlıyoruz." },
    { name: "Yasemin K.", initials: "YK", price: "320₺/gün", priceValue: 320, time: "35 dk önce", minutesAgo: 35, rating: 4.6, message: "Hasta bakıcılık sertifikam var, yatalak hasta deneyimim mevcut." },
  ],
  hemsire: [
    { name: "Hemşire Aylin K.", initials: "AK", price: "300₺", priceValue: 300, time: "6 dk önce", minutesAgo: 6, rating: 5.0, message: "Lisanslıyım, 15 dakikada adresinize ulaşabilirim. Serum ve enjeksiyon konusunda deneyimliyim." },
    { name: "Hemşire Onur D.", initials: "OD", price: "280₺", priceValue: 280, time: "18 dk önce", minutesAgo: 18, rating: 4.8, message: "Evde sağlık hizmetleri konusunda 8 yıllık tecrübem var, acil çağrılara da bakabilirim." },
    { name: "SağlıkEv Hemşirelik", initials: "SE", price: "340₺", priceValue: 340, time: "40 dk önce", minutesAgo: 40, rating: 4.9, message: "7/24 hizmet veren bir ekibiz, tüm hemşirelerimiz lisanslı ve sigortalı." },
  ],
  fizyoterapist: [
    { name: "Fzt. Kerem A.", initials: "KA", price: "500₺/seans", priceValue: 500, time: "14 dk önce", minutesAgo: 14, rating: 4.8, message: "Ameliyat sonrası rehabilitasyon konusunda uzmanım, evde seans yapabilirim." },
    { name: "Fzt. Selin B.", initials: "SB", price: "450₺/seans", priceValue: 450, time: "28 dk önce", minutesAgo: 28, rating: 4.9, message: "Manuel terapi ve egzersiz programı dahil paket sunuyorum, ilk seansta değerlendirme yaparım." },
    { name: "Fizyo Merkez Ekibi", initials: "FM", price: "480₺/seans", priceValue: 480, time: "50 dk önce", minutesAgo: 50, rating: 4.7, message: "3 fizyoterapistten oluşan ekibiz, uygun saatlere göre eşleştirme yapıyoruz." },
  ],
  makyaj: [
    { name: "Melis Makyaj Atölyesi", initials: "MM", price: "1.200₺", priceValue: 1200, time: "7 dk önce", minutesAgo: 7, rating: 4.9, message: "Prova dahil paket sunuyorum, adresinize gelebilirim. Portföyümü DM'den paylaşabilirim." },
    { name: "Ela Beauty", initials: "EB", price: "950₺", priceValue: 950, time: "20 dk önce", minutesAgo: 20, rating: 4.7, message: "Doğal ve kalıcı makyaj konusunda uzmanım, ürünlerim hassas ciltlere uygun." },
    { name: "Naz Güzellik", initials: "NG", price: "1.400₺", priceValue: 1400, time: "35 dk önce", minutesAgo: 35, rating: 5.0, message: "Saç + makyaj paketi de sunuyorum, davet öncesi prova ücretsiz." },
  ],
  bakim: [
    { name: "Dermo Güzellik Merkezi", initials: "DG", price: "650₺", priceValue: 650, time: "11 dk önce", minutesAgo: 11, rating: 4.8, message: "Cihazlı cilt analizi ile başlıyoruz, cilt tipine özel bakım planı çıkarıyoruz. Ağda ve kaş tasarımı da ekleyebiliriz." },
    { name: "Studio Reyhan", initials: "SR", price: "500₺", priceValue: 500, time: "8 dk önce", minutesAgo: 8, rating: 4.9, message: "Saç, kaş ve cilt bakımından hangisini istersen aynı randevuda halledebiliriz. Çocuklu misafirler için oyun köşemiz de mevcut." },
    { name: "Brow Studio Zeynep", initials: "BZ", price: "600₺", priceValue: 600, time: "16 dk önce", minutesAgo: 16, rating: 4.9, message: "Kirpik lifting, kaş tasarımı ve ağda bir arada yapılabilir. Hijyenik tek kullanımlık malzemeler kullanıyorum." },
    { name: "Huzur Masaj Stüdyosu", initials: "HM", price: "700₺", priceValue: 700, time: "23 dk önce", minutesAgo: 23, rating: 4.8, message: "Masaj, cilt bakımı ve aromaterapiyi tek pakette sunuyorum, evinize gelebilirim." },
    { name: "Glow Skin Studio", initials: "GS", price: "580₺", priceValue: 580, time: "34 dk önce", minutesAgo: 34, rating: 4.6, message: "Akne/leke tedavisi ve genel cilt bakımında deneyimliyim, ilk seansta ücretsiz analiz yapıyorum." },
  ],
  terzi: [
    { name: "Terzi Necla Hanım", initials: "TN", price: "150₺", priceValue: 150, time: "13 dk önce", minutesAgo: 13, rating: 4.8, message: "Aynı gün teslim yapabilirim, dükkanım mahallenizde, kolayca uğrayabilirsiniz." },
    { name: "Moda Terzi Atölyesi", initials: "MT", price: "180₺", priceValue: 180, time: "26 dk önce", minutesAgo: 26, rating: 4.6, message: "Özel dikim ve tadilat işlerinde 15 yıllık deneyimim var, prova imkanı sunuyorum." },
    { name: "Hızlı Tadilat Terzi", initials: "HT", price: "130₺", priceValue: 130, time: "42 dk önce", minutesAgo: 42, rating: 4.5, message: "Paça/kol kısaltma gibi basit işlerde 1 saatte teslim edebiliyorum." },
  ],
  yemek: [
    { name: "Elif'in Mutfağı", initials: "EM", price: "800₺/hafta", priceValue: 800, time: "9 dk önce", minutesAgo: 9, rating: 4.9, message: "Bebek/çocuk beslenmesine uygun tarifler hazırlayabilirim, alerjen bilgisini paylaşırım." },
    { name: "Ev Sofrası Catering", initials: "ES", price: "950₺/hafta", priceValue: 950, time: "21 dk önce", minutesAgo: 21, rating: 4.7, message: "Haftalık menü planı çıkarıp evinizde pişiriyoruz, dondurucuya uygun paketleme de yapabiliriz." },
    { name: "Anne Eli Değmiş", initials: "AE", price: "700₺/hafta", priceValue: 700, time: "37 dk önce", minutesAgo: 37, rating: 4.8, message: "Ev yemekleri konusunda 12 yıllık deneyimim var, özel diyet taleplerine göre de hazırlarım." },
  ],
  "yoga-koc": [
    { name: "Ayşe Nur — Yoga & Yaşam Koçu", initials: "AN", price: "450₺", priceValue: 450, time: "10 dk önce", minutesAgo: 10, rating: 4.9, message: "Doğum sonrası toparlanma yogası ve meditasyon konusunda uzmanım, evinizde birebir ders verebilirim." },
    { name: "Zen Yaşam Koçluğu", initials: "ZY", price: "500₺", priceValue: 500, time: "22 dk önce", minutesAgo: 22, rating: 4.7, message: "Online grup dersleri ve bireysel yaşam koçluğu seansları sunuyorum, ilk seans tanışma amaçlı." },
    { name: "Huzur Yoga Stüdyosu", initials: "HY", price: "400₺", priceValue: 400, time: "36 dk önce", minutesAgo: 36, rating: 4.8, message: "Anne-bebek yogası dahil çeşitli programlarımız var, esnek saatlerde ders açabiliriz." },
  ],
  "bahce-bakim": [
    { name: "Yeşil Bahçe Ekibi", initials: "YB", price: "500₺", priceValue: 500, time: "12 dk önce", minutesAgo: 12, rating: 4.7, message: "Çocuk güvenli ürünler kullanıyoruz, düzenli bakım aboneliği de sunabiliriz." },
    { name: "Bahçıvan Kemal", initials: "BK", price: "400₺", priceValue: 400, time: "25 dk önce", minutesAgo: 25, rating: 4.5, message: "Çim biçme ve budama konusunda deneyimliyim, bugün için uygunum." },
    { name: "Yeşillik Peyzaj", initials: "YP", price: "650₺", priceValue: 650, time: "40 dk önce", minutesAgo: 40, rating: 4.8, message: "Balkon ve teras bitkilendirme konusunda uzmanız, tasarım önerisi de sunuyoruz." },
  ],
  "profesyonel-fotograf": [
    { name: "Cansu Kaya Fotoğrafçılık", initials: "CK", price: "2.500₺", priceValue: 2500, time: "8 dk önce", minutesAgo: 8, rating: 5.0, message: "Evinize gelip çocuğunuzun rahat olduğu bir ortamda çekim yapabiliriz, tüm kareler düzenlenmiş teslim edilir." },
    { name: "Foto Stüdyo Aile", initials: "FA", price: "1.800₺", priceValue: 1800, time: "19 dk önce", minutesAgo: 19, rating: 4.7, message: "Doğum günü ve aile çekimlerinde deneyimliyim, dijital albüm de dahil paket sunuyorum." },
    { name: "Işıl Görsel", initials: "IG", price: "2.200₺", priceValue: 2200, time: "31 dk önce", minutesAgo: 31, rating: 4.8, message: "Yeni doğan fotoğrafçılığında uzmanım, bebeğin uyku saatine göre planlama yapıyoruz." },
  ],
  "spor-egitmeni": [
    { name: "Buğra Fit — Kişisel Antrenör", initials: "BF", price: "500₺", priceValue: 500, time: "9 dk önce", minutesAgo: 9, rating: 4.8, message: "Doğum sonrası toparlanma programında deneyimliyim, evinize gelip ekipmansız antrenman planı hazırlayabilirim." },
    { name: "Zeynep PT", initials: "ZP", price: "450₺", priceValue: 450, time: "20 dk önce", minutesAgo: 20, rating: 4.7, message: "Online takip ve haftalık program desteği sunuyorum, ilk seans değerlendirme amaçlı." },
    { name: "Form Stüdyo", initials: "FS", price: "550₺", priceValue: 550, time: "34 dk önce", minutesAgo: 34, rating: 4.9, message: "3 eğitmenden oluşan ekibiz, evde veya stüdyoda esnek saatlerde çalışabiliriz." },
  ],
  diyetisyen: [
    { name: "Dyt. Ceren Yıldız", initials: "CY", price: "600₺", priceValue: 600, time: "9 dk önce", minutesAgo: 9, rating: 4.9, message: "İlk görüşme ücretsiz, doğum sonrası ve emzirme dönemi beslenmesinde deneyimliyim." },
    { name: "Dyt. Onur Bey", initials: "OB", price: "500₺", priceValue: 500, time: "20 dk önce", minutesAgo: 20, rating: 4.6, message: "Çocuk beslenmesi konusunda uzmanım, aile için toplu paket de sunuyorum." },
    { name: "Beslenme Kliniği", initials: "BK", price: "650₺", priceValue: 650, time: "35 dk önce", minutesAgo: 35, rating: 4.8, message: "3 diyetisyenden oluşan ekibiz, online takip uygulamamız da mevcut." },
  ],
  psikolog: [
    { name: "Psk. Selin Arslan", initials: "SA", price: "750₺", priceValue: 750, time: "6 dk önce", minutesAgo: 6, rating: 5.0, message: "Doğum sonrası depresyon konusunda uzmanım, gizlilik esastır, online seans da yapabiliriz." },
    { name: "Psk. Barış Ünal", initials: "BU", price: "650₺", priceValue: 650, time: "19 dk önce", minutesAgo: 19, rating: 4.7, message: "Aile danışmanlığı ve ebeveynlik kaygısı konusunda deneyimliyim." },
    { name: "Yaşam Terapi Merkezi", initials: "YT", price: "800₺", priceValue: 800, time: "33 dk önce", minutesAgo: 33, rating: 4.9, message: "Klinik ekibimizde doğum sonrası sürece özel uzmanlaşmış terapistler var." },
  ],
  "logusa-bakicisi": [
    { name: "Hemşire Gül T.", initials: "GT", price: "400₺/gün", priceValue: 400, time: "8 dk önce", minutesAgo: 8, rating: 4.9, message: "Hemşirelik geçmişim var, gece nöbeti de alabilirim. İlk 40 gün deneyimim geniş." },
    { name: "Loğusa Destek Ekibi", initials: "LD", price: "450₺/gün", priceValue: 450, time: "17 dk önce", minutesAgo: 17, rating: 4.8, message: "Anne ve bebek bakımı konusunda uzman ekibiz, referanslarımızı paylaşabiliriz." },
    { name: "Sevgi H.", initials: "SH", price: "380₺/gün", priceValue: 380, time: "29 dk önce", minutesAgo: 29, rating: 4.6, message: "10 yıllık loğusa bakım deneyimim var, sabırlı ve titiz çalışırım." },
  ],
  "emzirme-danismani": [
    { name: "IBCLC Deniz K.", initials: "DK", price: "500₺", priceValue: 500, time: "10 dk önce", minutesAgo: 10, rating: 5.0, message: "Uluslararası sertifikalıyım, evde destek verebilirim, ilk seans değerlendirme amaçlıdır." },
    { name: "IBCLC Pınar Ş.", initials: "PS", price: "450₺", priceValue: 450, time: "24 dk önce", minutesAgo: 24, rating: 4.8, message: "Süt yetersizliği ve pozisyon sorunlarında deneyimliyim, online destek de sunuyorum." },
  ],
  elektrikci: [
    { name: "Elektrikçi Hasan Usta", initials: "HU", price: "350₺", priceValue: 350, time: "7 dk önce", minutesAgo: 7, rating: 4.7, message: "Sigortalı çalışıyorum, çocuklu evlerde güvenlik kontrolü de yapıyorum." },
    { name: "Hızlı Elektrik Servisi", initials: "HE", price: "300₺", priceValue: 300, time: "16 dk önce", minutesAgo: 16, rating: 4.5, message: "Bugün için müsaitim, 30 dakikada adresinize ulaşabilirim." },
    { name: "Güven Elektrik", initials: "GE", price: "400₺", priceValue: 400, time: "31 dk önce", minutesAgo: 31, rating: 4.9, message: "20 yıllık ustayım, faturalı ve garantili işçilik sunuyorum." },
  ],
  "su-tesisatcisi": [
    { name: "Tesisatçı Murat", initials: "TM", price: "400₺", priceValue: 400, time: "5 dk önce", minutesAgo: 5, rating: 4.6, message: "7/24 acil çağrı hattım var, su kaçağı tespitinde kameralı cihaz kullanıyorum." },
    { name: "Su Tesisat Ekspres", initials: "SE", price: "350₺", priceValue: 350, time: "14 dk önce", minutesAgo: 14, rating: 4.7, message: "Gider tıkanıklığı ve batarya tamiri konusunda hızlı çözüm sunuyorum." },
    { name: "Anadolu Tesisat", initials: "AT", price: "450₺", priceValue: 450, time: "27 dk önce", minutesAgo: 27, rating: 4.8, message: "Kombiden musluğa her türlü tesisat işini yapıyoruz, faturalı hizmet." },
  ],
  "hali-yikama": [
    { name: "TemizPark Halı Yıkama", initials: "TP", price: "80₺/m²", priceValue: 80, time: "11 dk önce", minutesAgo: 11, rating: 4.8, message: "Bebek/çocuk dostu, kimyasal içermeyen deterjan kullanıyoruz, aynı gün kurutma." },
    { name: "Işıl Halı Yıkama", initials: "IH", price: "65₺/m²", priceValue: 65, time: "23 dk önce", minutesAgo: 23, rating: 4.6, message: "Evde yerinde yıkama yapıyoruz, koltuk yıkama da dahil paket sunabiliriz." },
    { name: "Anadolu Halı Yıkama", initials: "AH", price: "90₺/m²", priceValue: 90, time: "40 dk önce", minutesAgo: 40, rating: 4.9, message: "20 yıllık tesisimiz var, isteyen fabrikaya da bırakabilir." },
  ],
  "etkinlik-organizatoru": [
    { name: "Renkli Partiler Ekibi", initials: "RP", price: "3.500₺", priceValue: 3500, time: "9 dk önce", minutesAgo: 9, rating: 4.9, message: "Tema kurulumu, animasyon ve ikramlar dahil anahtar teslim organizasyon sunuyoruz." },
    { name: "Küçük Şölen", initials: "KS", price: "2.800₺", priceValue: 2800, time: "22 dk önce", minutesAgo: 22, rating: 4.7, message: "Evde küçük ölçekli, samimi doğum günü organizasyonları konusunda uzmanız." },
    { name: "Parti Zamanı", initials: "PZ", price: "4.200₺", priceValue: 4200, time: "38 dk önce", minutesAgo: 38, rating: 4.8, message: "Mekan + animasyon + pasta dahil tam paket, fotoğrafçı da ekleyebiliriz." },
  ],
  "sosyal-medya": [
    { name: "Buse K.", initials: "BK", price: "4.200₺/ay", priceValue: 4200, time: "10 dk önce", minutesAgo: 10, rating: 4.7, message: "İçerik takvimi + reels çekimi + topluluk yönetimi dahil, aylık rapor sunarım." },
    { name: "Can B.", initials: "CB", price: "3.500₺/ay", priceValue: 3500, time: "22 dk önce", minutesAgo: 22, rating: 4.6, message: "Meta reklam yönetimi konusunda uzmanım, performans odaklı çalışırım." },
    { name: "Sosyal Atölye", initials: "SA", price: "5.000₺/ay", priceValue: 5000, time: "45 dk önce", minutesAgo: 45, rating: 4.9, message: "3 kişilik ajans ekibiyiz, çekim + kurgu + yönetim tek pakette." },
  ],
  dijital: [
    { name: "Can B.", initials: "CB", price: "3.500₺/ay", priceValue: 3500, time: "13 dk önce", minutesAgo: 13, rating: 4.6, message: "Instagram ve Meta reklam yönetimi, aylık performans raporlaması dahil." },
    { name: "Growth Ajans", initials: "GA", price: "4.800₺/ay", priceValue: 4800, time: "28 dk önce", minutesAgo: 28, rating: 4.8, message: "SEO + reklam yönetimi birlikte sunuyoruz, ilk ay ücretsiz denetim." },
    { name: "Merve P.", initials: "MP", price: "2.900₺/ay", priceValue: 2900, time: "50 dk önce", minutesAgo: 50, rating: 4.5, message: "Küçük işletmelere özel uygun fiyatlı paketlerim var." },
  ],
};

function getOffersForCategory(categoryId) {
  const pool = OFFER_POOLS[categoryId] || OFFER_POOLS.generic;
  return pool.map((o, i) => ({ id: i + 1, status: "pending", ...o }));
}

const NAIL_ARTISTS = [
  {
    id: 1, name: "Naz Nail Art", handle: "@naznailart", city: "Kadıköy, İstanbul", rating: 4.9, followers: "12.4K", avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200",
    portfolio: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400",
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400",
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400",
    ],
  },
  {
    id: 2, name: "Ela Beauty", handle: "@elabeauty.nails", city: "Beşiktaş, İstanbul", rating: 4.8, followers: "8.1K", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
    portfolio: [
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400",
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400",
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400",
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    ],
  },
  {
    id: 3, name: "Cilalı Stüdyo", handle: "@cilalistudyo", city: "Çankaya, Ankara", rating: 4.9, followers: "15.7K", avatar: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200",
    portfolio: [
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400",
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400",
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400",
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
    ],
  },
  {
    id: 4, name: "Glow Nails", handle: "@glownails.izmir", city: "Bornova, İzmir", rating: 4.7, followers: "5.9K", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    portfolio: [
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400",
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400",
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400",
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400",
    ],
  },
];

const REVIEWS = [
  {
    id: 1, name: "Elif K.", initials: "EK", value: 5, verified: true, time: "2 gün önce",
    comment: "Mutfak tadilatı gerçekten harika oldu, zamanında teslim etti. Kesinlikle tavsiye ederim.",
    helpful: 12,
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300" },
      { type: "image", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300" },
      { type: "video", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300" },
      { type: "image", url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300" },
      { type: "image", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300" },
    ],
  },
  {
    id: 2, name: "Serkan T.", initials: "ST", value: 4, verified: true, time: "1 hafta önce",
    comment: "İşçilik güzeldi ama biraz gecikme oldu. Yine de sonuçtan memnun kaldım.",
    helpful: 4,
    media: [],
  },
  {
    id: 3, name: "Ayşe M.", initials: "AM", value: 5, verified: true, time: "2 hafta önce",
    comment: "İkinci kez çalıştım, yine çok profesyoneldi. Fiyat/performans olarak da gayet iyi.",
    helpful: 8,
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=300" },
    ],
  },
];

function Stars({ value, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(value) ? "#C2872B" : "none"}
          stroke={i <= Math.round(value) ? "#C2872B" : "#B8AF95"}
        />
      ))}
    </div>
  );
}

function ModeTag({ mode }) {
  const isLocal = mode === "local";
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-full tracking-wide"
      style={{
        background: isLocal ? "rgba(63,125,92,0.12)" : "rgba(58,91,160,0.12)",
        color: isLocal ? "#3F7D5C" : "#3A5BA0",
      }}
    >
      {isLocal ? "Yerinde" : "Uzaktan"}
    </span>
  );
}

function LevelBadge({ level, size = "sm" }) {
  const meta = LEVEL_META[level] || LEVEL_META["new"];
  const isTop = level === "top-rated";
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full ${size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-1"}`}
      style={{ background: `${meta.color}1F`, color: meta.color }}
    >
      {isTop && <Award size={size === "sm" ? 10 : 12} />}
      {meta.label}
    </span>
  );
}

function VerifiedBadges({ items, compact }) {
  if (!items || items.length === 0) return null;
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: "#3F7D5C" }}>
        <ShieldCheck size={12} /> Doğrulanmış
      </span>
    );
  }
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "#3D3B30" }}>
          <BadgeCheck size={14} style={{ color: "#3F7D5C" }} />
          {item}
        </div>
      ))}
    </div>
  );
}

function HomeServiceBadge({ value, size = "sm" }) {
  if (!value) return null;
  const meta = {
    evde: { label: "Evinize Gelir", icon: Home, color: "#3F7D5C" },
    mekanda: { label: "Mekanına Gidilir", icon: MapPin, color: "#3A5BA0" },
    esnek: { label: "Evde veya Mekanda", icon: Check, color: "#C2872B" },
  }[value];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-1"}`}
      style={{ background: `${meta.color}1F`, color: meta.color }}
    >
      <Icon size={size === "sm" ? 10 : 12} />
      {meta.label}
    </span>
  );
}

function Header({ onNav, onSearch, pendingCount }) {
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b" style={{ background: "rgba(255,255,255,0.85)", borderColor: "#EAEAEA" }}>
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4">
        <button onClick={() => onNav("home")} className="font-sans text-xl font-black tracking-tight shrink-0" style={{ color: "#0F1115" }}>
          İşinn<span style={{ color: "#2563EB" }}>.</span>
        </button>
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5" style={{ color: "#9CA3AF" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) onSearch(q); }}
            placeholder="Hizmet veya iş ara... örn. çilingir"
            className="w-full pl-9 pr-3 py-2.5 rounded-full text-sm outline-none border-2 transition-colors focus:border-current"
            style={{ borderColor: "#F0F0F0", background: "#F7F7F8", color: "#0F1115" }}
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onNav("messages")}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
            style={{ background: "#F7F7F8", color: "#0F1115" }}
          >
            <MessageCircle size={16} />
          </button>
          <button
            onClick={() => onNav("pricing")}
            className="text-sm font-semibold px-3.5 py-2 rounded-full hidden sm:flex items-center gap-1.5 transition-colors"
            style={{ background: "#F7F7F8", color: "#0F1115" }}
          >
            <Award size={15} /> Planlar
          </button>
          <button
            onClick={() => onNav("map")}
            className="text-sm font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 hidden sm:flex"
            style={{ background: "#F7F7F8", color: "#0F1115" }}
          >
            <MapIcon size={15} /> Haritada Gör
          </button>
          <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-full" style={{ background: "#F7F7F8" }}>
            <button
              onClick={() => onNav("createListing")}
              className="text-sm font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
            >
              <Sparkles size={15} /> Hizmet Ekle
            </button>
            <button
              onClick={() => onNav("post")}
              className="text-sm font-bold px-3.5 py-2 rounded-full text-white"
              style={{ background: "#0F1115" }}
            >
              İlan Ver
            </button>
          </div>
          <button
            onClick={() => onNav("profile")}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}
          >
            SK
            {pendingCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "#EF4444" }}
              >
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
          <Menu size={20} className="sm:hidden" style={{ color: "#1B2B24" }} />
        </div>
      </div>
    </header>
  );
}

const JOB_POSTINGS = [
  {
    id: 1, category: "bakici", posterName: "Selin K.", district: "Zekeriyaköy, İstanbul",
    title: "İngilizce Konuşan Oyun Ablası Aranıyor",
    schedule: "Haftada 2 gün, günde 1 saat", budget: "300₺/saat", postedTime: "1 saat önce", offerCount: 4,
  },
  {
    id: 2, category: "temizlik", posterName: "Merve A.", district: "Kadıköy, İstanbul",
    title: "Haftalık Ev Temizliği İçin Güvenilir Biri Aranıyor",
    schedule: "Haftada 1 gün, 3-4 saat", budget: "900₺", postedTime: "2 saat önce", offerCount: 7,
  },
  {
    id: 3, category: "hasta-bakici", posterName: "Burak T.", district: "Çankaya, Ankara",
    title: "Yaşlı Annem İçin Gündüz Bakıcısı Aranıyor",
    schedule: "Hafta içi her gün, 08:00-17:00", budget: "380₺/gün", postedTime: "3 saat önce", offerCount: 3,
  },
  {
    id: 4, category: "bakici", posterName: "Ece D.", district: "Beşiktaş, İstanbul",
    title: "3 Aylık Bebeğim İçin Gece Bakıcısı Lazım",
    schedule: "Haftada 3 gece, 22:00-07:00", budget: "450₺/gece", postedTime: "5 saat önce", offerCount: 6,
  },
  {
    id: 5, category: "ogretmen", posterName: "Aylin S.", district: "Üsküdar, İstanbul",
    title: "İlkokul 3. Sınıf İçin Haftalık İngilizce Dersi",
    schedule: "Haftada 1 gün, 1 saat", budget: "300₺/ders", postedTime: "6 saat önce", offerCount: 5,
  },
  {
    id: 6, category: "bahce-bakim", posterName: "Onur K.", district: "Karşıyaka, İzmir",
    title: "Haftalık Bahçe ve Çim Bakımı Aranıyor",
    schedule: "Haftada 1 gün, 2 saat", budget: "450₺", postedTime: "8 saat önce", offerCount: 2,
  },
];

const ROTATING_WORDS = ["çilingire", "temizlikçiye", "hemşireye", "bakıcıya", "tırnakçıya", "fizyoterapiste"];

const CATEGORY_TILE_COLORS = ["#2563EB", "#14B8A6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#3B82F6", "#F97316"];

const FEATURED_PROFILE_CARDS = [
  { listingId: 11, bg: "#1F3A2E", specialties: ["0-6 Yaş Bakım", "İlk Yardım Sertifikalı", "Ev İçi Destek"] },
  { listingId: 19, bg: "#3D2B1F", specialties: ["Saç Kesimi & Boya", "Kaş Tasarımı", "Çocuklu Aileler İçin Uygun"] },
  { listingId: 25, bg: "#C9A9A0", specialties: ["Sigorta Arızası", "Priz & Anahtar", "Güvenlik Kontrolü"] },
  { listingId: 21, bg: "#1B3B3A", specialties: ["Doğum Sonrası Beslenme", "Emzirme Dönemi Diyeti", "Çocuk Beslenmesi"] },
];

function HomeView({ onSelectListing, onNav, filter, setFilter, onSearch, onApplyJob, userListings }) {
  const [heroQ, setHeroQ] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [showRemote, setShowRemote] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const toggleFavorite = (id) => setFavorites((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const allListings = [...(userListings || []), ...LISTINGS];
  const featured = LISTINGS.filter((l) => l.level === "top-rated");
  const filtered =
    filter === "all" ? allListings :
    filter === "home" ? allListings.filter((l) => l.mode === "local" && (l.homeService === "evde" || l.homeService === "esnek")) :
    allListings.filter((l) => l.mode === filter);

  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length), 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (featured.length === 0) return;
    const t = setInterval(() => setFeaturedIndex((i) => (i + 1) % featured.length), 4500);
    return () => clearInterval(t);
  }, [featured.length]);

  return (
    <div>
      <section className="px-5 pt-16 pb-24 relative overflow-hidden" style={{ background: "radial-gradient(ellipse at top left, #16321F 0%, #0F1115 55%, #0F1115 100%)" }}>
        <div
          className="absolute -top-24 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ background: "#2563EB" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-25"
          style={{ background: "#8B5CF6" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: "#F59E0B" }}
        />
        <div className="max-w-6xl mx-auto relative">
          <h1 className="font-sans text-5xl md:text-7xl font-black leading-[0.98] max-w-3xl tracking-tight" style={{ color: "#FFFFFF" }}>
            İhtiyacın olan şeyi<br />
            <span className="inline-block relative">
              <span
                key={wordIndex}
                className="inline-block animate-[fadeSlide_0.4s_ease] bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #2563EB, #60A5FA)" }}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </span>{" "}
            anlat!
          </h1>
          <style>{`@keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <p className="mt-5 max-w-md text-base" style={{ color: "#B8BCC4" }}>
            Mahallendeki ustadan güvenilir bakıcıya, bugün ihtiyacın olan kişi 5 dakikada teklif göndersin.
          </p>
          <div className="mt-9 flex items-center gap-2 max-w-lg bg-white rounded-full p-1.5 pl-4 shadow-2xl">
            <Search size={16} style={{ color: "#9CA3AF" }} />
            <input
              value={heroQ}
              onChange={(e) => setHeroQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && heroQ.trim()) onSearch(heroQ); }}
              placeholder="Örn. çilingir, mutfak tadilatı, logo tasarımı..."
              className="flex-1 text-sm outline-none py-1.5"
              style={{ color: "#0F1115" }}
            />
            <button
              onClick={() => heroQ.trim() && onSearch(heroQ)}
              className="text-sm font-bold px-6 py-3 rounded-full text-white hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
            >
              Ara
            </button>
          </div>
          <div className="flex gap-5 mt-8 flex-wrap">
            {[["12.400+", "Sağlayıcı"], ["38.000+", "Tamamlanan iş"], ["4.8 ★", "Ortalama puan"]].map(([val, label]) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span className="font-sans text-xl font-black" style={{ color: "#FFFFFF" }}>{val}</span>
                <span className="text-xs font-medium" style={{ color: "#7A7F8A" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="h-12" style={{ background: "linear-gradient(180deg, #0F1115 0%, #FFFFFF 100%)" }} />

      <section className="max-w-6xl mx-auto px-5 -mt-8 relative">
        <div className="rounded-2xl p-1.5 flex gap-1 w-fit shadow-lg" style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}>
          {[["all", "Tümü"], ["home", "🏠 Evimde"], ["local", "Yerinde"], ["remote", "Uzaktan"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="text-sm px-4 py-2 rounded-xl font-bold transition-all"
              style={filter === key ? { background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", color: "#FFFFFF" } : { color: "#6B7280" }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 mt-10">
        <div className="rounded-3xl p-7 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F1115 0%, #1A1D23 60%, #16321F 100%)" }}>
          <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-20" style={{ background: "#8B5CF6" }} />
          <p className="text-xs tracking-[0.2em] uppercase font-bold mb-1.5 relative" style={{ color: "#2563EB" }}>Nasıl Çalışıyoruz</p>
          <h2 className="font-sans text-2xl font-black mb-6 relative" style={{ color: "#FFFFFF" }}>Kontrol tamamen sende</h2>
          <div className="grid sm:grid-cols-3 gap-5 relative">
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}>
                <Unlock size={17} className="text-white" />
              </div>
              <p className="text-sm font-bold mb-1.5" style={{ color: "#FFFFFF" }}>Herkesi gör, sen seç</p>
              <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                Haritadaki <span className="font-semibold" style={{ color: "#E5E7EB" }}>tüm sağlayıcıları</span> özgürce keşfet, profillerini incele, istediğine doğrudan ulaş.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}>
                <Megaphone size={17} className="text-white" />
              </div>
              <p className="text-sm font-bold mb-1.5" style={{ color: "#FFFFFF" }}>Açık ilan panosu</p>
              <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                İlanını ver, ilgilenen herkes teklif versin. Gelen tüm teklifleri fiyata, puana ve zamana göre karşılaştırıp kararı sen ver.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
                <ShieldCheck size={17} className="text-white" />
              </div>
              <p className="text-sm font-bold mb-1.5" style={{ color: "#FFFFFF" }}>Gerçek güven, görünür güven</p>
              <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                Video tanıtım, arka plan kontrolü detayı ve diğer ebeveynlerden referanslar — kimi eve aldığını gerçekten bilerek karar ver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 mt-12">
          <h2 className="font-sans text-2xl font-black mb-4" style={{ color: "#0F1115" }}>Öne Çıkan Sağlayıcılar ⭐</h2>
          {(() => {
            const p = featured[featuredIndex];
            return (
              <button
                onClick={() => onSelectListing(p)}
                className="w-full text-left rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition-shadow shadow-md"
                style={{ border: "1px solid #F0F0F0", background: "#FFFFFF" }}
              >
                <div className="sm:w-64 h-44 sm:h-auto shrink-0 relative overflow-hidden">
                  <img src={p.img} alt="" className="w-full h-full object-cover" />
                  <span
                    className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1"
                    style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
                  >
                    <Award size={11} /> Top Rated
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <ModeTag mode={p.mode} />
                    {p.homeService && <HomeServiceBadge value={p.homeService} />}
                  </div>
                  <p className="font-sans text-lg font-bold mb-1" style={{ color: "#0F1115" }}>{p.title}</p>
                  <p className="text-xs mb-2" style={{ color: "#9CA3AF" }}>{p.provider} · {p.city}</p>
                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#6B7280" }}>{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Stars value={p.rating} size={13} />
                      <span className="text-xs font-bold" style={{ color: "#0F1115" }}>{p.rating}</span>
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>({p.reviewCount} değerlendirme)</span>
                    </div>
                    <span className="text-sm font-black" style={{ color: "#F59E0B" }}>{p.price}</span>
                  </div>
                </div>
              </button>
            );
          })()}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setFeaturedIndex(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === featuredIndex ? "18px" : "6px",
                  height: "6px",
                  background: i === featuredIndex ? "#2563EB" : "#E5E7EB",
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-5 mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>Aranıyor 📢</h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Başkalarının verdiği ilanlar — belki tam sana göre bir iş var</p>
          </div>
          <button onClick={() => onNav("post")} className="text-xs font-bold px-3.5 py-2 rounded-full shrink-0" style={{ background: "#F7F7F8", color: "#0F1115" }}>
            Sen de ilan ver
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5" style={{ scrollbarWidth: "thin" }}>
          {JOB_POSTINGS.map((job) => {
            const cat = CATEGORIES.find((c) => c.id === job.category);
            const Icon = cat?.icon;
            return (
              <div
                key={job.id}
                className="rounded-2xl p-4 shrink-0 shadow-sm hover:shadow-md transition-shadow"
                style={{ border: "1px solid #F0F0F0", background: "#FFFFFF", width: "260px" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {Icon && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #FFF3E0, #FFE8CC)" }}>
                      <Icon size={13} style={{ color: "#F59E0B" }} />
                    </div>
                  )}
                  <span className="text-[11px] font-semibold" style={{ color: "#9CA3AF" }}>{cat?.name} · {job.postedTime}</span>
                </div>
                <p className="text-sm font-bold leading-snug mb-1.5" style={{ color: "#0F1115" }}>{job.title}</p>
                <p className="text-xs mb-0.5" style={{ color: "#6B7280" }}>📍 {job.district}</p>
                <p className="text-xs mb-3" style={{ color: "#6B7280" }}>🕐 {job.schedule}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black" style={{ color: "#F59E0B" }}>{job.budget}</span>
                  <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>{job.offerCount} teklif var</span>
                </div>
                <button
                  onClick={() => onApplyJob(job)}
                  className="w-full mt-3 py-2 rounded-full text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
                >
                  Teklif Ver
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 mt-12 space-y-9">
        <h2 className="font-sans text-2xl font-black -mb-2" style={{ color: "#0F1115" }}>Ne arıyorsun? 👀</h2>
        {PARENT_CATEGORIES.filter((g) => g.id !== "profesyonel").map((group) => {
          const GroupIcon = group.icon;
          const groupCategories = group.categoryIds
            .map((id) => CATEGORIES.find((c) => c.id === id))
            .filter(Boolean);
          return (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-3">
                <GroupIcon size={16} style={{ color: "#1D4ED8" }} />
                <h3 className="text-sm font-bold tracking-wide" style={{ color: "#374151" }}>{group.name}</h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {groupCategories.map((c, i) => {
                  const Icon = c.icon;
                  const tileColor = CATEGORY_TILE_COLORS[i % CATEGORY_TILE_COLORS.length];
                  return (
                    <button
                      key={c.id}
                      onClick={() => (c.id === "tirnakci" ? onNav("nailart") : onSearch(c.name))}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg"
                      style={{ background: "#FFFFFF", border: "1px solid #F5F5F5" }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: `${tileColor}18` }}
                      >
                        <Icon size={20} style={{ color: tileColor }} />
                      </div>
                      <span className="text-xs font-semibold text-center" style={{ color: "#0F1115" }}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {!showRemote ? (
          <button
            onClick={() => setShowRemote(true)}
            className="text-xs font-bold flex items-center gap-1"
            style={{ color: "#1D4ED8" }}
          >
            + Uzaktan hizmetleri de göster
          </button>
        ) : (
          (() => {
            const group = PARENT_CATEGORIES.find((g) => g.id === "profesyonel");
            const GroupIcon = group.icon;
            const groupCategories = group.categoryIds.map((id) => CATEGORIES.find((c) => c.id === id)).filter(Boolean);
            return (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GroupIcon size={16} style={{ color: "#1D4ED8" }} />
                  <h3 className="text-sm font-bold tracking-wide" style={{ color: "#374151" }}>{group.name}</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#EFF6FF", color: "#3B82F6" }}>Uzaktan</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {groupCategories.map((c, i) => {
                    const Icon = c.icon;
                    const tileColor = CATEGORY_TILE_COLORS[i % CATEGORY_TILE_COLORS.length];
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSearch(c.name)}
                        className="flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg"
                        style={{ background: "#FFFFFF", border: "1px solid #F5F5F5" }}
                      >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${tileColor}18` }}>
                          <Icon size={20} style={{ color: tileColor }} />
                        </div>
                        <span className="text-xs font-semibold text-center" style={{ color: "#0F1115" }}>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()
        )}
      </section>

      <section className="max-w-6xl mx-auto px-5 mt-12 pb-16">
        <h2 className="font-sans text-2xl font-black mb-1" style={{ color: "#0F1115" }}>Öne çıkan profiller</h2>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>Doğrulanmış sağlayıcıların gerçek uzmanlıkları</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_PROFILE_CARDS.map((card) => {
            const l = LISTINGS.find((x) => x.id === card.listingId);
            if (!l) return null;
            return (
              <button
                key={l.id}
                onClick={() => onSelectListing(l)}
                className="text-left rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all group shadow-sm hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden" style={{ background: card.bg }}>
                  <img src={l.img} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-300" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(l.id); }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart size={13} style={{ color: "#EF4444" }} fill={favorites.has(l.id) ? "#EF4444" : "none"} />
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
                      {l.provider.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <LevelBadge level={l.level} />
                  </div>
                </div>
                <div className="pt-3">
                  <p className="text-sm font-black mb-0.5 truncate" style={{ color: "#0F1115" }}>{l.provider}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Stars value={l.rating} size={11} />
                    <span className="text-[11px]" style={{ color: "#9CA3AF" }}>{l.rating} ({l.reviewCount})</span>
                  </div>
                  <div className="space-y-0.5">
                    {card.specialties.map((s) => (
                      <p key={s} className="text-xs" style={{ color: "#6B7280" }}>{s}</p>
                    ))}
                  </div>
                  <span className="text-xs font-black inline-block mt-2" style={{ color: "#F59E0B" }}>{l.price}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MediaLightbox({ media, index, onClose, onNav }) {
  const item = media[index];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(27,43,36,0.92)" }}>
      <button onClick={onClose} className="absolute top-5 right-5 text-white"><X size={24} /></button>
      {index > 0 && (
        <button onClick={() => onNav(index - 1)} className="absolute left-5 text-white"><ChevronLeft size={28} /></button>
      )}
      <div className="max-w-lg w-full rounded-xl overflow-hidden relative">
        {item.type === "video" ? (
          <video key={item.url} controls autoPlay playsInline className="w-full max-h-[70vh] bg-black">
            <source src={item.url} />
          </video>
        ) : (
          <img src={item.url} alt="" className="w-full max-h-[70vh] object-contain bg-black" />
        )}
      </div>
      {index < media.length - 1 && (
        <button onClick={() => onNav(index + 1)} className="absolute right-5 text-white"><ChevronRight size={28} /></button>
      )}
    </div>
  );
}

function ReviewCard({ review, onOpenMedia }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);
  return (
    <div className="py-4 border-b last:border-0" style={{ borderColor: "#D9D0BA" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ background: "#3A5BA0" }}>
            {review.initials}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{review.name}</p>
            <p className="text-[11px]" style={{ color: "#8A8368" }}>{review.verified ? "Onaylı iş" : "Yorum"} · {review.time}</p>
          </div>
        </div>
        <Stars value={review.value} />
      </div>
      <p className="text-sm leading-relaxed mb-3" style={{ color: "#3D3B30" }}>{review.comment}</p>
      {review.media.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.media.slice(0, 4).map((m, i) => (
            <button
              key={i}
              onClick={() => onOpenMedia(review.media, i)}
              className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0"
            >
              <img src={m.url} alt="" className="w-full h-full object-cover" style={m.type === "video" ? { filter: "brightness(0.6)" } : {}} />
              {m.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={18} className="text-white" />
                </div>
              )}
              {i === 3 && review.media.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-white text-sm font-medium">+{review.media.length - 4}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => { if (!voted) { setHelpful(helpful + 1); setVoted(true); } }}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
        style={{ borderColor: voted ? "#C2872B" : "#D9D0BA", color: voted ? "#C2872B" : "#5C5744" }}
      >
        <ThumbsUp size={12} />
        Faydalı buldum · {helpful}
      </button>
    </div>
  );
}

function ListingDetail({ listing, onBack, onContact, userReviews, onAddReview, onSubmitPendingMedia, onSubmitStaffReview }) {
  const [lightbox, setLightbox] = useState(null); // { media, index }
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewValue, setReviewValue] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMediaFile, setReviewMediaFile] = useState(null); // { url, name, type, dataUrl, mimeType }
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(null); // 'auto' | 'pending' | 'rejected' | 'child'
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const myReviews = (userReviews || []).filter((r) => r.listingId === listing.id);
  const allReviews = [...myReviews, ...REVIEWS];
  const avg = (allReviews.reduce((s, r) => s + r.value, 0) / allReviews.length).toFixed(1);

  const checkReviewMedia = async (mediaType, dataUrl, mimeType) => {
    // Video: Claude'un vision API'si video işleyemiyor. Sessizce yanlış çalışmak
    // yerine dürüst davranıyoruz — video her zaman incelemeye alınır, otomatik
    // yayınlanmaz. (Gerçek üründe video için kare çıkarma + ayrı bir kontrol
    // eklenmeli.)
    if (mediaType === "video") {
      return { appropriate: true, showsIdentifiableAdult: true, showsIdentifiableChild: false, autoRequiresReview: true };
    }
    try {
      const base64 = dataUrl.split(",")[1];
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 200,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
              { type: "text", text: `Bu görsel bir hizmet yorumuna eklenecek. Üç şeyi değerlendir:
1. "appropriate": Görsel genel olarak uygun mu? Çıplaklık/cinsel içerik, şiddet, nefret sembolü veya platformla tamamen alakasız içerik varsa false ver. Şüphede kalırsan false ver.
2. "showsIdentifiableAdult": Tanınabilir bir yetişkin insan yüzü var mı? Sadece iş çıktısını (temizlenmiş oda, yapılmış tırnak tasarımı vb.) gösteren, kimse görünmeyen görseller false sayılır.
3. "showsIdentifiableChild": Tanınabilir bir çocuk yüzü var mı (18 yaş altı görünen biri)? Emin olamazsan true ver (güvenli taraf).

SADECE şu JSON formatında yanıt ver: {"appropriate": true/false, "showsIdentifiableAdult": true/false, "showsIdentifiableChild": true/false}` },
            ],
          }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      return {
        appropriate: parsed.appropriate !== false,
        showsIdentifiableAdult: !!parsed.showsIdentifiableAdult,
        showsIdentifiableChild: !!parsed.showsIdentifiableChild,
        autoRequiresReview: false,
      };
    } catch (err) {
      // fail-safe: kontrol başarısız olursa incelemeye al, otomatik yayınlama
      return { appropriate: true, showsIdentifiableAdult: true, showsIdentifiableChild: false, autoRequiresReview: true };
    }
  };

  const handleReviewMedia = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video/") ? "video" : "image";
    const reader = new FileReader();
    reader.onload = () => setReviewMediaFile({ url, name: file.name, type, dataUrl: reader.result, mimeType: file.type });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    const reviewId = Date.now();
    const name = reviewName.trim() || "Misafir Kullanıcı";
    let media = [];
    let resultMessage = "auto";

    if (reviewMediaFile) {
      const check = await checkReviewMedia(reviewMediaFile.type, reviewMediaFile.dataUrl, reviewMediaFile.mimeType);
      if (!mountedRef.current) return; // sayfadan ayrılmışsa state güncelleme

      if (!check.appropriate) {
        // Uygunsuz içerik: asla yayınlanmaz, onay sürecine bile girmez.
        resultMessage = "rejected";
      } else if (check.showsIdentifiableChild) {
        // Çocuk yüzü: mutlak kural, kimse onaylayamaz, hiç yayınlanmaz.
        resultMessage = "child";
      } else if (check.autoRequiresReview) {
        // Video: AI hiç kontrol edemedi. Sağlayıcıya değil, önce platform
        // personeline (içerik güvenliği) gider — sağlayıcı taraflı olabilir.
        onSubmitStaffReview({
          id: Date.now() + 1,
          reviewId,
          listingId: listing.id,
          listingTitle: listing.title,
          providerName: listing.provider,
          reviewerName: name,
          mediaUrl: reviewMediaFile.url,
          mediaType: reviewMediaFile.type,
          submittedAt: "az önce",
        });
        resultMessage = "staff-review";
      } else if (check.showsIdentifiableAdult) {
        // Fotoğraf, AI tarafından genel güvenlik açısından zaten onaylandı —
        // kalan tek soru sağlayıcının kendi rızası, bu yüzden doğrudan ona gider.
        onSubmitPendingMedia({
          id: Date.now() + 1,
          reviewId,
          listingId: listing.id,
          listingTitle: listing.title,
          reviewerName: name,
          mediaUrl: reviewMediaFile.url,
          mediaType: reviewMediaFile.type,
          submittedAt: "az önce",
          isVideo: false,
        });
        resultMessage = "pending";
      } else {
        media = [{ type: reviewMediaFile.type, url: reviewMediaFile.url }];
      }
    }

    onAddReview({
      id: reviewId, listingId: listing.id, name, initials: name.split(" ").map((w) => w[0]).join("").slice(0, 2) || "MK",
      value: reviewValue, verified: false, time: "az önce", comment: reviewComment.trim(), helpful: 0, media,
    });

    if (!mountedRef.current) return;
    setReviewSubmitting(false);
    setReviewSubmitted(resultMessage);
    setReviewComment("");
    setReviewMediaFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>

      <div className="rounded-xl overflow-hidden mb-6">
        <img src={listing.img} alt="" className="w-full h-72 object-cover" />
      </div>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <ModeTag mode={listing.mode} />
            {listing.homeService && <HomeServiceBadge value={listing.homeService} size="md" />}
          </div>
          <h1 className="font-serif text-2xl mt-2.5 mb-2" style={{ color: "#1B2B24" }}>{listing.title}</h1>
          <div className="flex items-center gap-3 text-sm mb-4" style={{ color: "#5C5744" }}>
            <span className="flex items-center gap-1"><MapPin size={14} />{listing.city}</span>
            <span className="flex items-center gap-1"><Stars value={listing.rating} size={13} />{listing.rating} ({listing.reviewCount} değerlendirme)</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#3D3B30" }}>{listing.desc}</p>
        </div>

        <div className="rounded-xl border p-5 w-full sm:w-64 shrink-0" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ background: "#1B2B24" }}>
              {listing.provider.split(" ").map((w) => w[0]).join("").slice(0,2)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{listing.provider}</p>
                <LevelBadge level={listing.level} />
              </div>
              <p className="text-[11px]" style={{ color: "#8A8368" }}>Ortalama yanıt: 2 saat</p>
            </div>
          </div>
          {listing.verified && listing.verified.length > 0 && (
            <div className="mb-4 pb-4 border-b" style={{ borderColor: "#D9D0BA" }}>
              <VerifiedBadges items={listing.verified} />
            </div>
          )}
          <p className="text-lg font-medium mb-4" style={{ color: "#C2872B" }}>{listing.price}</p>
          <button onClick={onContact} className="w-full py-2.5 rounded-full text-sm font-medium text-white mb-2" style={{ background: "#C2872B" }}>
            İletişime Geç
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="w-full py-2.5 rounded-full text-sm font-medium border flex items-center justify-center gap-1.5"
            style={isFavorited ? { borderColor: "#9C4A3C", color: "#9C4A3C", background: "rgba(156,74,60,0.06)" } : { borderColor: "#D9D0BA", color: "#1B2B24" }}
          >
            <Heart size={14} fill={isFavorited ? "#9C4A3C" : "none"} />
            {isFavorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          </button>
        </div>
      </div>

      {(listing.videoIntro || listing.backgroundChecks || listing.references) && (
        <div className="mt-10 pt-8 border-t" style={{ borderColor: "#D9D0BA" }}>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} style={{ color: "#3F7D5C" }} />
            <h2 className="font-serif text-xl" style={{ color: "#1B2B24" }}>Güven Merkezi</h2>
          </div>
          <p className="text-xs mb-5" style={{ color: "#8A8368" }}>
            Bu sağlayıcı için gerçekleştirdiğimiz doğrulamalar ve tanıtımı
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {listing.videoIntro && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#5C5744" }}>Video Tanıtım</p>
                {listing.videoIntro.videoUrl ? (
                  <video
                    controls
                    playsInline
                    poster={listing.videoIntro.thumbnail}
                    className="w-full rounded-xl bg-black"
                    style={{ maxHeight: "280px", objectFit: "cover" }}
                  >
                    <source src={listing.videoIntro.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={listing.videoIntro.thumbnail} alt="" className="w-full h-52 object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(27,43,36,0.3)" }}>
                      <PlayCircle size={40} className="text-white" />
                    </div>
                    <span className="absolute bottom-2 right-2 text-[11px] font-medium px-1.5 py-0.5 rounded text-white" style={{ background: "rgba(0,0,0,0.6)" }}>
                      {listing.videoIntro.duration}
                    </span>
                  </div>
                )}
              </div>
            )}

            {listing.backgroundChecks && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#5C5744" }}>Güvenlik Kontrolleri</p>
                <div className="space-y-2.5">
                  {listing.backgroundChecks.map((check, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <BadgeCheck size={15} style={{ color: "#3F7D5C" }} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium" style={{ color: "#1B2B24" }}>{check.label} <span className="font-normal" style={{ color: "#8A8368" }}>· {check.date}</span></p>
                        <p style={{ color: "#5C5744" }}>{check.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {listing.references && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#5C5744" }}>Diğer Ebeveynlerden Referanslar</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {listing.references.map((ref, i) => (
                  <div key={i} className="rounded-xl border p-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
                    <p className="text-xs leading-relaxed mb-2 italic" style={{ color: "#3D3B30" }}>"{ref.quote}"</p>
                    <p className="text-[11px] font-medium" style={{ color: "#5C5744" }}>{ref.name} · {ref.relation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 pt-8 border-t" style={{ borderColor: "#D9D0BA" }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl" style={{ color: "#1B2B24" }}>Değerlendirmeler</h2>
            <span className="text-sm" style={{ color: "#5C5744" }}>{avg} ortalama · {allReviews.length} yorum</span>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-xs font-bold px-3.5 py-2 rounded-full text-white"
            style={{ background: "#2563EB" }}
          >
            Değerlendirme Yaz
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>Fotoğraf ve video içeren yorumlar önce gösterilir</p>

        {showReviewForm && (
          <div className="rounded-xl border p-4 mb-5" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            {reviewSubmitted ? (
              <div className="text-center py-4">
                {(reviewSubmitted === "rejected" || reviewSubmitted === "child") ? (
                  <AlertCircle size={22} style={{ color: "#9C4A3C" }} className="mx-auto mb-2" />
                ) : (
                  <Check size={22} style={{ color: "#3F7D5C" }} className="mx-auto mb-2" />
                )}
                <p className="text-sm font-medium mb-1" style={{ color: "#1B2B24" }}>
                  {reviewSubmitted === "rejected" ? "Yorumun yayınlandı, görsel eklenemedi"
                    : reviewSubmitted === "child" ? "Yorumun yayınlandı, görsel eklenemedi"
                    : "Yorumun yayınlandı!"}
                </p>
                {reviewSubmitted === "pending" && (
                  <p className="text-xs" style={{ color: "#8A8368" }}>Eklediğin görsel, sağlayıcının kimliğini içerebileceği için önce onayına sunuldu — onaylarsa görünür olacak.</p>
                )}
                {reviewSubmitted === "staff-review" && (
                  <p className="text-xs" style={{ color: "#8A8368" }}>Eklediğin video, AI tarafından otomatik kontrol edilemediği için önce platform ekibinin incelemesine gönderildi, ardından sağlayıcının onayına sunulacak.</p>
                )}
                {reviewSubmitted === "rejected" && (
                  <p className="text-xs" style={{ color: "#8A8368" }}>Eklediğin görsel platform kurallarına uygun görünmediği için paylaşılamadı.</p>
                )}
                {reviewSubmitted === "child" && (
                  <p className="text-xs" style={{ color: "#8A8368" }}>Görselde bir çocuğun yüzü tespit edildi, gizlilik nedeniyle bu tür görseller hiçbir şekilde paylaşılamıyor.</p>
                )}
                <button onClick={() => { setShowReviewForm(false); setReviewSubmitted(null); }} className="text-xs font-medium mt-2" style={{ color: "#2563EB" }}>Kapat</button>
              </div>
            ) : (
              <>
                <input
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Adın (isteğe bağlı)"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-2.5"
                  style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
                />
                <div className="flex gap-1 mb-2.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setReviewValue(n)}>
                      <Star size={20} fill={n <= reviewValue ? "#C2872B" : "none"} stroke={n <= reviewValue ? "#C2872B" : "#B8AF95"} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Deneyimini anlat..."
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none mb-2.5"
                  style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
                />
                <div className="flex items-center gap-2 mb-3">
                  {reviewMediaFile && (
                    reviewMediaFile.type === "video" ? (
                      <video src={reviewMediaFile.url} muted className="w-14 h-14 rounded-lg object-cover" />
                    ) : (
                      <img src={reviewMediaFile.url} alt="" className="w-14 h-14 rounded-lg object-cover" />
                    )
                  )}
                  <label className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer" style={{ borderColor: "#D9D0BA", color: "#5C5744" }}>
                    <Camera size={13} />
                    {reviewMediaFile ? "Değiştir" : "Fotoğraf/Video Ekle"}
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={handleReviewMedia} />
                  </label>
                </div>
                <p className="text-[11px] mb-3" style={{ color: "#8A8368" }}>
                  Eklediğin görsel sağlayıcının kendisini gösteriyorsa, yayınlanmadan önce sağlayıcının onayına sunulur. Yazılı yorumun her zaman anında yayınlanır.
                </p>
                <button
                  onClick={submitReview}
                  disabled={!reviewComment.trim() || reviewSubmitting}
                  className="w-full py-2.5 rounded-full text-sm font-bold text-white"
                  style={{ background: "#2563EB", opacity: reviewSubmitting ? 0.6 : 1 }}
                >
                  {reviewSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
                </button>
              </>
            )}
          </div>
        )}

        <div>
          {allReviews.map((r) => (
            <ReviewCard key={r.id} review={r} onOpenMedia={(media, index) => setLightbox({ media, index })} />
          ))}
        </div>
      </div>

      {lightbox && (
        <MediaLightbox
          media={lightbox.media}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox({ ...lightbox, index: i })}
        />
      )}
    </div>
  );
}

function MapView({ onBack, onSelectProvider }) {
  const [mapQuery, setMapQuery] = useState("");
  const [homeOnly, setHomeOnly] = useState(false);
  const [active, setActive] = useState(null);
  const [cityId, setCityId] = useState("istanbul");
  const [userLoc, setUserLoc] = useState(null); // { lat, lng }
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | granted | denied

  const city = CITIES.find((c) => c.id === cityId);
  const catColor = {
    temizlik: "#3F7D5C", nakliye: "#3A5BA0", tadilat: "#C2872B", cilingir: "#9C4A3C", ogretmen: "#6B4FA0",
    bakici: "#C25B8E", muhendis: "#2E6B6B", "hasta-bakici": "#D14D4D", hemsire: "#2196A6", fizyoterapist: "#4C8C4A",
    makyaj: "#B8548C", bakim: "#5B9BA8", terzi: "#7A6B8F", yemek: "#B5762E",
    diyetisyen: "#5C9C4A", psikolog: "#7B5FA8", "logusa-bakicisi": "#D1706B", "emzirme-danismani": "#4A9C8C",
    elektrikci: "#D1A23B", "su-tesisatcisi": "#3A7CA5", "hali-yikama": "#6B8E4E", "etkinlik-organizatoru": "#D16BA5",
    "yoga-koc": "#8FA65C", "bahce-bakim": "#5C8A3F", "profesyonel-fotograf": "#6B5B95", "spor-egitmeni": "#B85450",
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { setLocStatus("denied"); return; }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude });
        setLocStatus("granted");
        // Auto-select the nearest city to the user's real position
        const nearest = CITIES.reduce((best, c) => {
          const d = distanceKm(latitude, longitude, c.lat, c.lng);
          return d < best.d ? { id: c.id, d } : best;
        }, { id: CITIES[0].id, d: Infinity });
        setCityId(nearest.id);
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  let list = cityId === "all" ? LOCAL_PROVIDERS : LOCAL_PROVIDERS.filter((p) => p.city === cityId);
  if (mapQuery.trim()) {
    const q = mapQuery.trim().toLocaleLowerCase("tr-TR");
    list = list.filter((p) => {
      const catName = CATEGORIES.find((c) => c.id === p.category)?.name || "";
      return p.name.toLocaleLowerCase("tr-TR").includes(q) || catName.toLocaleLowerCase("tr-TR").includes(q);
    });
  }
  if (homeOnly) list = list.filter((p) => p.homeService === "evde" || p.homeService === "esnek");

  const withDistance = list.map((p) => ({
    ...p,
    distance: userLoc ? distanceKm(userLoc.lat, userLoc.lng, p.lat, p.lng) : null,
  }));
  const sorted = userLoc ? [...withDistance].sort((a, b) => a.distance - b.distance) : withDistance;

  return (
    <div className="max-w-6xl mx-auto px-5 py-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <h1 className="font-serif text-2xl" style={{ color: "#1B2B24" }}>Dünya Genelinde Hizmet Sağlayanlar</h1>
        <button
          onClick={useMyLocation}
          className="text-xs font-medium px-3.5 py-2 rounded-full flex items-center gap-1.5"
          style={{ background: locStatus === "granted" ? "#3F7D5C" : "#C2872B", color: "white" }}
        >
          <MapPin size={13} />
          {locStatus === "loading" ? "Konum alınıyor..." : locStatus === "granted" ? "Konumun kullanılıyor" : "Konumumu Kullan"}
        </button>
      </div>

      {locStatus === "denied" && (
        <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>
          Konum izni alınamadı. Aşağıdan şehir seçerek manuel olarak arayabilirsin.
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} style={{ color: "#8A8368" }} />
        <select
          value={cityId}
          onChange={(e) => { setCityId(e.target.value); setActive(null); }}
          className="text-sm font-medium px-3 py-2 rounded-lg border outline-none"
          style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
        >
          {["Türkiye", "Hindistan", "Avrupa", "Kuzey Amerika", "Orta Doğu", "Asya-Pasifik"].map((region) => (
            <optgroup key={region} label={region}>
              {CITIES.filter((c) => c.region === region).map((c) => (
                <option key={c.id} value={c.id}>{c.name}, {c.country}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {userLoc && (
          <span className="text-[11px]" style={{ color: "#3F7D5C" }}>· sana en yakın şehir otomatik seçildi</span>
        )}
      </div>

      <div className="mb-4">
        <div className="relative mb-2.5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
          <input
            value={mapQuery}
            onChange={(e) => setMapQuery(e.target.value)}
            placeholder="Ara... örn. nefes terapisti, çilingir, kuaför"
            className="w-full pl-10 pr-3 py-2.5 rounded-full border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
          {mapQuery && (
            <button onClick={() => setMapQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: "#8A8368" }} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium" style={{ color: "#8A8368" }}>Sık aranan:</span>
          {["Çilingir", "Temizlik", "Bakıcı", "Kuaför", "Hemşire", "Yoga & Meditasyon"].map((term) => (
            <button
              key={term}
              onClick={() => setMapQuery(term)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border"
              style={mapQuery === term ? { background: "#EFE8D8", color: "#1B2B24", borderColor: "#1B2B24" } : { borderColor: "#D9D0BA", color: "#8A8368" }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-4">
        {/* Stylized map area — one grid per selected city */}
        <div
          className="relative rounded-2xl overflow-hidden border h-[480px]"
          style={{
            borderColor: "#D9D0BA",
            background: "#E4DCC5",
            backgroundImage:
              "linear-gradient(rgba(217,208,186,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(217,208,186,0.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        >
          <div className="absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.85)", color: "#5C5744" }}>
            {city?.name} · {sorted.length} sağlayıcı listeleniyor
          </div>
          {sorted.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center z-10 hover:z-20"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white transition-transform"
                style={{ background: catColor[p.category], transform: active?.id === p.id ? "scale(1.15)" : "scale(1)" }}
              >
                <MapPin size={15} fill="white" />
              </div>
              <span
                className="mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm"
                style={
                  active?.id === p.id
                    ? { background: catColor[p.category], color: "white" }
                    : { background: "white", color: "#1B2B24" }
                }
              >
                {p.price}
              </span>
            </button>
          ))}
        </div>

        {/* Side panel: active pin detail or list, sorted by real distance when location is known */}
        <div className="rounded-2xl border p-4 h-[480px] overflow-y-auto" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
          {active ? (
            <div>
              <button onClick={() => setActive(null)} className="text-xs mb-3" style={{ color: "#8A8368" }}>← Listeye dön</button>
              <img src={active.img} alt="" className="w-full h-28 object-cover rounded-lg mb-3" />
              <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{active.name}</p>
              <p className="text-xs mb-2" style={{ color: "#8A8368" }}>{active.district}, {city?.name}</p>
              <div className="flex items-center gap-1 mb-1">
                <Stars value={active.rating} size={12} />
                <span className="text-xs" style={{ color: "#5C5744" }}>{active.rating}</span>
              </div>
              {active.distance != null && (
                <p className="text-xs mb-2" style={{ color: "#3F7D5C" }}>Senden yaklaşık {active.distance.toFixed(1)} km uzakta</p>
              )}
              <p className="text-sm font-medium mb-3 mt-2" style={{ color: "#C2872B" }}>{active.price}</p>
              <button
                onClick={() => onSelectProvider(active)}
                className="w-full py-2 rounded-full text-sm font-medium text-white"
                style={{ background: "#C2872B" }}
              >
                Profili Gör
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-medium mb-2" style={{ color: "#8A8368" }}>
                {userLoc ? "Sana en yakın sağlayıcılar" : "Haritadaki sağlayıcılar"}
              </p>
              {sorted.length === 0 && (
                <p className="text-xs" style={{ color: "#8A8368" }}>Bu şehir ve kategori için sağlayıcı bulunamadı.</p>
              )}
              {sorted.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/5 text-left"
                >
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white" style={{ background: catColor[p.category] }}>
                    <MapPin size={14} fill="white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate" style={{ color: "#1B2B24" }}>{p.name}</p>
                    <p className="text-[11px] truncate" style={{ color: "#8A8368" }}>{p.district} · {p.price}</p>
                  </div>
                  {p.distance != null && (
                    <span className="text-[11px] font-medium shrink-0" style={{ color: "#3F7D5C" }}>{p.distance.toFixed(1)} km</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: "#8A8368" }}>
        Not: Şehir içi harita konumları stilize gösterimdir, ama mesafeler ("Konumumu Kullan" ile) tarayıcının gerçek GPS konumundan hesaplanır. Gerçek üründe pin konumları da Google Maps/Mapbox ile gerçek koordinatlarda gösterilecek.
      </p>
    </div>
  );
}

function OffersView({ onBack, job }) {
  const [offers, setOffers] = useState(() => getOffersForCategory(job?.categoryId));
  const [sortBy, setSortBy] = useState("price"); // price | rating | recent
  const respond = (id, status) => setOffers(offers.map((o) => (o.id === id ? { ...o, status } : o)));
  const jobTitle = job?.title || "iş ilanın";

  const cheapest = Math.min(...offers.map((o) => o.priceValue));
  const topRated = Math.max(...offers.map((o) => o.rating));

  const sorted = [...offers].sort((a, b) => {
    if (sortBy === "price") return a.priceValue - b.priceValue;
    if (sortBy === "rating") return b.rating - a.rating;
    return a.minutesAgo - b.minutesAgo;
  });

  const SortHeader = ({ label, value }) => (
    <button
      onClick={() => setSortBy(value)}
      className="flex items-center gap-1 text-xs font-medium"
      style={{ color: sortBy === value ? "#C2872B" : "#8A8368" }}
    >
      {label}
      {sortBy === value && <ChevronRight size={12} className="rotate-90" />}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>Gelen Teklifler</h1>
      <p className="text-sm mb-2" style={{ color: "#5C5744" }}>"{jobTitle}" ilanına {offers.length} teklif geldi — karşılaştırıp seçebilirsin</p>
      {job?.homeServicePref && (
        <p className="text-xs mb-5 flex items-center gap-1" style={{ color: "#3F7D5C" }}>
          <Home size={12} />
          {job.homeServicePref === "evde" ? "Evine gelebilecek sağlayıcılar önceliklendirildi" : job.homeServicePref === "mekanda" ? "Mekana gidebileceğini belirttin" : "Konum tercihin: fark etmez"}
        </p>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#D9D0BA" }}>
        {/* Table header with sort controls */}
        <div
          className="hidden sm:grid text-xs font-medium px-4 py-2.5"
          style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr 1.6fr", background: "#E4DCC5", color: "#5C5744" }}
        >
          <span>Sağlayıcı</span>
          <SortHeader label="Puan" value="rating" />
          <SortHeader label="Fiyat" value="price" />
          <SortHeader label="Zaman" value="recent" />
          <span>Mesaj</span>
          <span>İşlem</span>
        </div>

        <div className="divide-y" style={{ borderColor: "#D9D0BA" }}>
          {sorted.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_2fr_1.6fr] gap-2 sm:gap-3 px-4 py-3 items-center"
              style={{ background: "#F8F4E9" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium text-white shrink-0" style={{ background: "#1B2B24" }}>{o.initials}</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#1B2B24" }}>{o.name}</p>
                  {o.priceValue === cheapest && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full inline-block mt-0.5" style={{ background: "rgba(63,125,92,0.15)", color: "#3F7D5C" }}>En uygun fiyat</span>
                  )}
                  {o.rating === topRated && o.priceValue !== cheapest && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full inline-block mt-0.5" style={{ background: "rgba(194,135,43,0.15)", color: "#C2872B" }}>En yüksek puan</span>
                  )}
                </div>
              </div>

              <div className="flex sm:block items-center gap-1 text-xs" style={{ color: "#5C5744" }}>
                <span className="sm:hidden" style={{ color: "#8A8368" }}>Puan: </span>
                <span className="flex items-center gap-1"><Star size={11} fill="#C2872B" stroke="#C2872B" />{o.rating}</span>
              </div>

              <div className="text-sm font-medium" style={{ color: "#C2872B" }}>
                <span className="sm:hidden text-xs font-normal" style={{ color: "#8A8368" }}>Fiyat: </span>
                {o.price}
              </div>

              <div className="flex items-center gap-1 text-xs" style={{ color: "#8A8368" }}>
                <Clock size={11} />{o.time}
              </div>

              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#3D3B30" }}>{o.message}</p>

              {o.status === "pending" ? (
                <div className="flex gap-1.5">
                  <button onClick={() => respond(o.id, "accepted")} className="flex-1 py-1.5 rounded-full text-[11px] font-medium text-white flex items-center justify-center gap-1" style={{ background: "#3F7D5C" }}>
                    <Check size={11} /> Kabul
                  </button>
                  <button className="p-1.5 rounded-full border flex items-center justify-center" style={{ borderColor: "#D9D0BA", color: "#1B2B24" }}>
                    <MessageCircle size={12} />
                  </button>
                  <button onClick={() => respond(o.id, "declined")} className="p-1.5 rounded-full border" style={{ borderColor: "#D9D0BA", color: "#8A8368" }}>
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div
                  className="text-[11px] font-medium px-2 py-1.5 rounded-lg text-center"
                  style={o.status === "accepted"
                    ? { background: "rgba(63,125,92,0.12)", color: "#3F7D5C" }
                    : { background: "rgba(0,0,0,0.05)", color: "#8A8368" }}
                >
                  {o.status === "accepted" ? "Kabul edildi" : "Reddedildi"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: "#8A8368" }}>
        Sıralamayı değiştirmek için tablo başlığındaki Puan, Fiyat veya Zaman'a tıkla.
      </p>
    </div>
  );
}

function SearchResultsView({ query, onBack, onSelectListing, userListings }) {
  const [homeOnly, setHomeOnly] = useState(false);
  const q = query.trim().toLocaleLowerCase("tr-TR");
  const results = [...(userListings || []), ...LISTINGS].filter((l) => {
    const haystack = [l.title, l.provider, l.city, CATEGORIES.find((c) => c.id === l.category)?.name || ""]
      .join(" ")
      .toLocaleLowerCase("tr-TR");
    const matchesQuery = q.length === 0 || haystack.includes(q);
    const matchesHome = !homeOnly || l.homeService === "evde" || l.homeService === "esnek";
    return matchesQuery && matchesHome;
  });

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>"{query}" için {results.length} sonuç</h1>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-sm" style={{ color: "#5C5744" }}>Başlık, hizmet sağlayan ve bölgeye göre eşleşenler</p>
        <button
          onClick={() => setHomeOnly(!homeOnly)}
          className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border"
          style={homeOnly ? { background: "#3F7D5C", color: "white", borderColor: "#3F7D5C" } : { borderColor: "#D9D0BA", color: "#5C5744" }}
        >
          <Home size={13} />
          Sadece evime gelsin
        </button>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
          <p className="text-sm" style={{ color: "#5C5744" }}>Bu aramayla eşleşen bir sonuç bulunamadı. Farklı bir kelime dene, ya da bir iş ilanı vererek uygun kişilerin sana ulaşmasını sağla.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((l) => (
            <button
              key={l.id}
              onClick={() => onSelectListing(l)}
              className="text-left rounded-xl overflow-hidden border hover:shadow-md transition-shadow group"
              style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={l.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2"><ModeTag mode={l.mode} /></div>
              </div>
              <div className="p-3.5">
                <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "#1B2B24" }}>{l.title}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <p className="text-xs" style={{ color: "#8A8368" }}>{l.provider} · {l.city}</p>
                  <LevelBadge level={l.level} />
                </div>
                {l.homeService && <div className="mt-1.5"><HomeServiceBadge value={l.homeService} /></div>}
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1">
                    <Stars value={l.rating} size={12} />
                    <span className="text-xs" style={{ color: "#5C5744" }}>({l.reviewCount})</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#C2872B" }}>{l.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function PostJobView({ onBack, onSubmitted, onViewOffers, onMatchAI }) {
  const [mode, setMode] = useState("local");
  const [step, setStep] = useState("form"); // form | success
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [desc, setDesc] = useState("");
  const [cityId, setCityId] = useState("istanbul");
  const [district, setDistrict] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [urgency, setUrgency] = useState("today"); // now | today | flexible
  const [homeServicePref, setHomeServicePref] = useState("evde"); // evde | mekanda | esnek
  const [photos, setPhotos] = useState([]); // { url, name }
  const [error, setError] = useState("");

  const availableCategories = CATEGORIES.filter((c) => c.mode === mode || c.mode === "both");
  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId);
  const cityName = CITIES.find((c) => c.id === cityId)?.name;

  // Live-feeling estimate: how many providers in this category/city could respond
  const nearbyCount = categoryId
    ? LOCAL_PROVIDERS.filter((p) => p.category === categoryId && (mode === "remote" || p.city === cityId)).length
    : 0;

  const handlePhotoAdd = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - photos.length);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, { url, name: file.name }].slice(0, 3));
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) { setError("Bir başlık yazmalısın."); return; }
    if (!categoryId) { setError("Bir kategori seçmelisin."); return; }
    if (!desc.trim()) { setError("İşin ne olduğunu kısaca anlat."); return; }
    setError("");
    setStep("success");
  };

  if (step === "success") {
    const eta = urgency === "now" ? "10-15 dakika" : urgency === "today" ? "birkaç saat" : "1-2 gün";
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(63,125,92,0.12)" }}>
          <Send size={22} style={{ color: "#3F7D5C" }} />
        </div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>"{title}" ilanı yayında</h2>
        <p className="text-sm mb-1" style={{ color: "#5C5744" }}>
          {selectedCategory?.name} kategorisinde{mode === "local" ? ` ${cityName}'de` : ""} {nearbyCount > 0 ? `${nearbyCount} sağlayıcıya` : "uygun sağlayıcılara"} bildirim gönderildi.
        </p>
        <p className="text-xs mb-6" style={{ color: "#8A8368" }}>İlk teklifin genelde {eta} içinde gelmesini bekleyebilirsin.</p>
        <button
          onClick={() => onMatchAI({ title, categoryId, desc, cityId, mode, urgency, homeServicePref })}
          className="w-full mb-3 py-3 rounded-full text-sm font-medium text-white flex items-center justify-center gap-2"
          style={{ background: "#2FBF71" }}
        >
          <Sparkles size={15} /> Yapay Zeka ile En Uygun Kişileri Bul
        </button>
        <div className="flex gap-2 justify-center">
          <button onClick={() => onViewOffers({ title, categoryId, homeServicePref })} className="px-5 py-2.5 rounded-full text-sm font-medium text-white" style={{ background: "#C2872B" }}>Teklifleri Gör</button>
          <button onClick={onSubmitted} className="px-5 py-2.5 rounded-full text-sm font-medium border" style={{ borderColor: "#D9D0BA", color: "#1B2B24" }}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>İş İlanı Ver</h1>
      <p className="text-sm mb-6" style={{ color: "#5C5744" }}>İhtiyacını anlat, uygun kişiler sana anlık teklif göndersin.</p>

      <div className="flex gap-2 mb-6">
        {[["local", "Yerinde iş"], ["remote", "Uzaktan iş"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setMode(key); setCategoryId(""); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
            style={mode === key ? { background: "#1B2B24", color: "#EFE8D8", borderColor: "#1B2B24" } : { borderColor: "#D9D0BA", color: "#5C5744" }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Başlık</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn. 2+1 daire boyama işi"
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          >
            <option value="">Kategori seç...</option>
            {PARENT_CATEGORIES.map((group) => {
              const opts = availableCategories.filter((c) => group.categoryIds.includes(c.id));
              if (opts.length === 0) return null;
              return (
                <optgroup key={group.id} label={group.name}>
                  {opts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              );
            })}
          </select>
          {categoryId && (
            <p className="text-xs mt-1.5" style={{ color: "#3F7D5C" }}>
              {mode === "local"
                ? `${cityName}'de bu kategoride ${nearbyCount} kayıtlı sağlayıcı var`
                : `Bu kategoride ${nearbyCount > 0 ? nearbyCount : "çok sayıda"} uzaktan çalışan sağlayıcı var`}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Ne zaman ihtiyacın var?</label>
          <div className="flex gap-2">
            {[["now", "Hemen / Acil"], ["today", "Bugün"], ["flexible", "Esnek"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setUrgency(key)}
                className="flex-1 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1"
                style={urgency === key
                  ? { background: key === "now" ? "#9C4A3C" : "#1B2B24", color: "#EFE8D8", borderColor: "transparent" }
                  : { borderColor: "#D9D0BA", color: "#5C5744" }}
              >
                {key === "now" && <Clock size={12} />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === "local" && (
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Nerede yapılsın?</label>
            <div className="flex gap-2">
              {[["evde", "Evime gelsin"], ["mekanda", "Mekana giderim"], ["esnek", "Fark etmez"]].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setHomeServicePref(key)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1"
                  style={homeServicePref === key
                    ? { background: "#3F7D5C", color: "#EFE8D8", borderColor: "transparent" }
                    : { borderColor: "#D9D0BA", color: "#5C5744" }}
                >
                  {key === "evde" && <Home size={12} />}
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: "#8A8368" }}>
              "Evime gelsin" seçersen, sadece evde hizmet veren sağlayıcılardan teklif gelir.
            </p>
          </div>
        )}

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Açıklama</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="İşin detaylarını yaz..."
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none resize-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Fotoğraf ekle (opsiyonel, en fazla 3)</label>
          <div className="flex gap-2 flex-wrap">
            {photos.map((p, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                <img src={p.url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <label
                className="w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer"
                style={{ borderColor: "#D9D0BA", color: "#8A8368" }}
              >
                <span className="text-lg leading-none">+</span>
                <span className="text-[9px]">Ekle</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoAdd} />
              </label>
            )}
          </div>
        </div>

        {mode === "local" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Şehir</label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
              >
                {["Türkiye", "Hindistan", "Avrupa", "Kuzey Amerika", "Orta Doğu", "Asya-Pasifik"].map((region) => (
                  <optgroup key={region} label={region}>
                    {CITIES.filter((c) => c.region === region).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Semt / Bölge</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Örn. Kadıköy"
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Min. Bütçe</label>
            <input
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="₺"
              inputMode="numeric"
              className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Max. Bütçe</label>
            <input
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="₺"
              inputMode="numeric"
              className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
            />
          </div>
        </div>

        {error && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{error}</p>
        )}

        <button onClick={handleSubmit} className="w-full py-3 rounded-full text-sm font-medium text-white mt-2" style={{ background: "#C2872B" }}>
          İlanı Yayınla
        </button>
      </div>
    </div>
  );
}

function AIMatchView({ job, onBack, onSelectListing }) {
  const [status, setStatus] = useState("loading"); // loading | done | error
  const [matches, setMatches] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const category = CATEGORIES.find((c) => c.id === job?.categoryId);
  const cityName = CITIES.find((c) => c.id === job?.cityId)?.name;

  // Build the candidate pool: real listings in this category (+ nearby-in-mode local providers as extra context)
  const candidates = LISTINGS.filter((l) => {
    const matchesCategory = l.categoryId === job?.categoryId || l.category === job?.categoryId;
    if (!matchesCategory) return false;
    if (!job?.homeServicePref || job.homeServicePref === "esnek") return true;
    if (!l.homeService) return true; // no data for this listing, don't exclude it
    if (job.homeServicePref === "evde") return l.homeService === "evde" || l.homeService === "esnek";
    if (job.homeServicePref === "mekanda") return l.homeService === "mekanda" || l.homeService === "esnek";
    return true;
  });

  useEffect(() => {
    let cancelled = false;

    async function runMatch() {
      if (!job || candidates.length === 0) {
        setStatus("error");
        setErrorMsg("Bu kategoride karşılaştırılacak yeterli sağlayıcı profili bulunamadı.");
        return;
      }
      setStatus("loading");
      try {
        const candidateList = candidates
          .map((c, i) => `${i + 1}. ${c.provider} — ${c.title}. Açıklama: ${c.desc} Fiyat: ${c.price}. Puan: ${c.rating} (${c.reviewCount} değerlendirme). Konum: ${c.city}.`)
          .join("\n");

        const prompt = `Sen bir hizmet pazaryerinde iş eşleştirme motorusun. Aşağıda bir müşterinin ilanı ve aday hizmet sağlayıcıların profilleri var. Her adayı bu ilana ne kadar uygun olduğuna göre 0-100 arası bir "matchScore" ile puanla ve Türkçe, kısa (en fazla 20 kelime) bir "reason" (neden uygun olduğu) yaz. Sadece en iyi 3 adayı, en yüksek puandan en düşüğe sırala.

İLAN:
Başlık: ${job.title}
Kategori: ${category?.name || job.categoryId}
Açıklama: ${job.desc}
Aciliyet: ${job.urgency === "now" ? "Hemen/Acil" : job.urgency === "today" ? "Bugün" : "Esnek"}
Konum tercihi: ${job.homeServicePref === "evde" ? "Sağlayıcı eve gelmeli" : job.homeServicePref === "mekanda" ? "Müşteri sağlayıcının mekanına gidebilir" : "Fark etmez"}
${job.mode === "local" ? `Şehir: ${cityName}` : "Uzaktan iş"}

ADAYLAR:
${candidateList}

SADECE şu JSON formatında yanıt ver, başka hiçbir metin ekleme:
[{"name": "aday adı", "matchScore": 92, "reason": "kısa gerekçe"}]`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await response.json();
        const text = (data.content || []).map((b) => b.text || "").join("\n");
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        if (cancelled) return;
        setMatches(parsed);
        setStatus("done");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg("Eşleştirme sırasında bir sorun oluştu. Tekrar deneyebilirsin.");
      }
    }

    runMatch();
    return () => { cancelled = true; };
  }, [job?.title, job?.categoryId]);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={20} style={{ color: "#2FBF71" }} />
        <h1 className="font-serif text-2xl" style={{ color: "#1B2B24" }}>Yapay Zeka Eşleştirmesi</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#5C5744" }}>"{job?.title}" ilanın, kategorideki gerçek profillerle canlı olarak karşılaştırılıyor.</p>

      {status === "loading" && (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
          <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#2FBF71", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "#5C5744" }}>İlanın analiz ediliyor, en uygun profiller belirleniyor...</p>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border p-6 text-center" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
          <p className="text-sm" style={{ color: "#9C4A3C" }}>{errorMsg}</p>
        </div>
      )}

      {status === "done" && (
        <div className="space-y-3">
          {matches.map((m, i) => {
            const listing = candidates.find((c) => c.provider === m.name);
            return (
              <button
                key={i}
                onClick={() => listing && onSelectListing(listing)}
                disabled={!listing}
                className="w-full text-left rounded-xl border p-4 hover:shadow-md transition-shadow"
                style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: i === 0 ? "#2FBF71" : "#1B2B24" }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{m.name}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(47,191,113,0.15)", color: "#2FBF71" }}
                  >
                    %{m.matchScore} uyum
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#5C5744" }}>{m.reason}</p>
                {listing && <p className="text-xs font-medium mt-2" style={{ color: "#C2872B" }}>{listing.price}</p>}
              </button>
            );
          })}
          <p className="text-xs mt-2" style={{ color: "#8A8368" }}>
            Bu eşleştirme gerçek zamanlı olarak Claude tarafından, ilanının içeriğine göre üretildi.
          </p>
        </div>
      )}
    </div>
  );
}

function NailArtView({ onBack, onContact }) {
  const [openProfile, setOpenProfile] = useState(null); // artist object
  const [lightbox, setLightbox] = useState(null); // { media, index }

  if (openProfile) {
    const media = openProfile.portfolio.map((url) => ({ type: "image", url }));
    return (
      <div className="max-w-2xl mx-auto px-5 py-8">
        <button onClick={() => setOpenProfile(null)} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
          <ChevronLeft size={16} /> Geri
        </button>
        <div className="flex items-center gap-4 mb-2">
          <img src={openProfile.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="font-serif text-lg" style={{ color: "#1B2B24" }}>{openProfile.name}</p>
            <p className="text-xs" style={{ color: "#8A8368" }}>{openProfile.handle} · {openProfile.city}</p>
            <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "#5C5744" }}>
              <span className="flex items-center gap-1"><Stars value={openProfile.rating} size={11} />{openProfile.rating}</span>
              <span className="flex items-center gap-1"><Users size={11} />{openProfile.followers} takipçi</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onContact({ name: openProfile.name, listingTitle: "Nail Art Hizmeti" })}
          className="w-full py-2.5 rounded-full text-sm font-medium text-white my-4"
          style={{ background: "#C2872B" }}
        >
          İletişime Geç
        </button>
        <div className="grid grid-cols-3 gap-1">
          {openProfile.portfolio.map((url, i) => (
            <button key={i} onClick={() => setLightbox({ media, index: i })} className="aspect-square overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
            </button>
          ))}
        </div>
        {lightbox && (
          <MediaLightbox
            media={lightbox.media}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
            onNav={(i) => setLightbox({ ...lightbox, index: i })}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <Grid3x3 size={20} style={{ color: "#1B2B24" }} />
        <h1 className="font-serif text-2xl" style={{ color: "#1B2B24" }}>Tırnakçı & Nail Art</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#5C5744" }}>Portföylerine bakıp beğendiğin tasarıma sahip kişiyi seç</p>

      <div className="space-y-6">
        {NAIL_ARTISTS.map((artist) => (
          <div key={artist.id} className="rounded-xl border overflow-hidden" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            <button onClick={() => setOpenProfile(artist)} className="w-full flex items-center gap-3 p-3.5 text-left">
              <img src={artist.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{artist.name}</p>
                <p className="text-xs" style={{ color: "#8A8368" }}>{artist.handle} · {artist.city}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Stars value={artist.rating} size={11} />
                  <span className="text-xs" style={{ color: "#5C5744" }}>{artist.rating}</span>
                </div>
                <p className="text-[11px]" style={{ color: "#8A8368" }}>{artist.followers} takipçi</p>
              </div>
            </button>
            <div className="grid grid-cols-3 gap-0.5">
              {artist.portfolio.slice(0, 6).map((url, i) => (
                <button
                  key={i}
                  onClick={() => setOpenProfile(artist)}
                  className="relative aspect-square overflow-hidden"
                >
                  <img src={url} alt="" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const INITIAL_CONVERSATIONS = [
  { id: 1, name: "Hakan Y.", initials: "HY", lastMessage: "Tabii, yarın 14:00 uygun mu?", time: "10:24", unread: 0, listingTitle: "Mutfak Tadilatı ve Dolap Montajı" },
  { id: 2, name: "TemizPark Ekibi", initials: "TP", lastMessage: "Fiyat teklifimizi ilettik, inceleyebilirsiniz.", time: "Dün", unread: 2, listingTitle: "Ofis ve Ev Derin Temizlik Hizmeti" },
  { id: 3, name: "Elif K.", initials: "EK", lastMessage: "Proje dosyalarını paylaştım 👍", time: "Dün", unread: 0, listingTitle: "React & Node.js ile Web Uygulaması Geliştirme" },
];

const INITIAL_THREADS = {
  1: [
    { id: 1, sender: "them", text: "Merhaba, ilanınızı gördüm. Mutfak ölçüleri hakkında biraz bilgi alabilir miyim?", time: "09:40" },
    { id: 2, sender: "me", text: "Merhaba, 3x4 metre bir mutfak, L şeklinde dolap düşünüyorum.", time: "09:52" },
    { id: 3, sender: "them", text: "Anladım, yarın yerinde keşif yapabilirim.", time: "10:10" },
    { id: 4, sender: "them", text: "Tabii, yarın 14:00 uygun mu?", time: "10:24" },
  ],
  2: [
    { id: 1, sender: "them", text: "Merhaba, temizlik talebinizi aldık.", time: "Dün 15:02" },
    { id: 2, sender: "them", text: "Fiyat teklifimizi ilettik, inceleyebilirsiniz.", time: "Dün 15:03" },
  ],
  3: [
    { id: 1, sender: "me", text: "Merhaba, projeye ne zaman başlayabiliriz?", time: "Dün 11:00" },
    { id: 2, sender: "them", text: "Bu hafta başlayabilirim, örnek dosyaları gönderiyorum.", time: "Dün 11:20" },
    { id: 3, sender: "them", text: "Proje dosyalarını paylaştım 👍", time: "Dün 11:22" },
  ],
};

const AUTO_REPLIES = [
  "Merhaba, ilanınızı inceledim, birazdan dönüş yapacağım.",
  "Teşekkürler, detayları değerlendirip size yazacağım.",
  "Uygun bir zaman ayarlayalım, ne zaman müsaitsiniz?",
  "Elbette, fiyat teklifimi birazdan iletiyorum.",
];

function MessagesView({ onBack, initialContact }) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!initialContact) return;
    setConversations((prev) => {
      const existing = prev.find((c) => c.name === initialContact.name);
      if (existing) {
        setActiveId(existing.id);
        return prev;
      }
      const newId = Math.max(...prev.map((c) => c.id), 0) + 1;
      setThreads((t) => ({ ...t, [newId]: [] }));
      setActiveId(newId);
      return [
        { id: newId, name: initialContact.name, initials: initialContact.name.split(" ").map((w) => w[0]).join("").slice(0, 2), lastMessage: "Yeni sohbet", time: "Şimdi", unread: 0, listingTitle: initialContact.listingTitle },
        ...prev,
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContact?.name]);

  const active = conversations.find((c) => c.id === activeId);
  const activeMessages = threads[activeId] || [];

  const sendMessage = () => {
    if (!input.trim() || !activeId) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const msg = { id: (threads[activeId]?.length || 0) + 1, sender: "me", text: input.trim(), time: timeStr };
    setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] || []), msg] }));
    setConversations((cs) => cs.map((c) => (c.id === activeId ? { ...c, lastMessage: msg.text, time: timeStr } : c)));
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const replyMsg = { id: (threads[activeId]?.length || 0) + 2, sender: "them", text: reply, time: timeStr };
      setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] || []), msg, replyMsg] }));
      setConversations((cs) => cs.map((c) => (c.id === activeId ? { ...c, lastMessage: reply, time: timeStr } : c)));
      setTyping(false);
    }, 1400);
  };

  if (activeId && active) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
        <button onClick={() => setActiveId(null)} className="flex items-center gap-1 text-sm mb-3 shrink-0" style={{ color: "#5C5744" }}>
          <ArrowLeft size={16} /> Sohbetler
        </button>
        <div className="flex items-center gap-2.5 pb-3 border-b mb-3 shrink-0" style={{ borderColor: "#D9D0BA" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ background: "#1B2B24" }}>{active.initials}</div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{active.name}</p>
            <p className="text-[11px]" style={{ color: "#8A8368" }}>{active.listingTitle}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {activeMessages.length === 0 && (
            <p className="text-xs text-center mt-8" style={{ color: "#8A8368" }}>Henüz mesaj yok, ilk mesajı sen gönder.</p>
          )}
          {activeMessages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[75%] rounded-2xl px-3.5 py-2 text-sm"
                style={m.sender === "me"
                  ? { background: "#2FBF71", color: "#0F1F19", borderBottomRightRadius: 4 }
                  : { background: "#F8F4E9", color: "#1B2B24", border: "1px solid #D9D0BA", borderBottomLeftRadius: 4 }}
              >
                {m.text}
                <p className="text-[10px] mt-1 opacity-60">{m.time}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-3.5 py-2 text-xs" style={{ background: "#F8F4E9", border: "1px solid #D9D0BA", color: "#8A8368" }}>
                yazıyor...
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-3 mt-2 border-t shrink-0" style={{ borderColor: "#D9D0BA" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Mesaj yaz..."
            className="flex-1 px-3.5 py-2.5 rounded-full border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
          <button onClick={sendMessage} className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "#2FBF71" }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-6" style={{ color: "#1B2B24" }}>Mesajlar</h1>
      <div className="space-y-1">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 text-left"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium text-white shrink-0 relative" style={{ background: "#1B2B24" }}>
              {c.initials}
              {c.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "#9C4A3C" }}>
                  {c.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{c.name}</p>
                <span className="text-[11px]" style={{ color: "#8A8368" }}>{c.time}</span>
              </div>
              <p className="text-xs truncate" style={{ color: c.unread > 0 ? "#1B2B24" : "#8A8368" }}>{c.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const PLANS = [
  {
    id: "standart", name: "Standart Üyelik", priceMonthly: 159, priceYearly: 1749, trialMonths: 1, currency: "₺",
    tagline: "Herkes için tek, basit plan",
    features: [
      "Sınırsız aktif ilan", "Tam profil sayfası (video, sertifika, CV)", "Mesajlaşma + bildirimler",
      "AI eşleştirmede yer alma", "Harita ve arama görünürlüğü",
    ],
    notIncluded: [],
    badge: null, highlight: false,
  },
];

const BOOST_PACKAGE = {
  id: "one-cikarma", name: "Öne Çıkarma Paketi", priceMonthly: 459, currency: "₺",
  tagline: "Standart Üyeliğe ek, isteğe bağlı",
  features: [
    "Öne çıkan sağlayıcı rozeti", "Haritada ve aramada üstte görünme",
    "AI eşleştirmede öncelik", "Pazar Analizi'ne erişim (talep trendleri)", "Destek asistanında öncelikli sıra",
  ],
};

function CreateListingView({ onBack, onCreated }) {
  const [mode, setMode] = useState("local");
  const [providerName, setProviderName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cityId, setCityId] = useState("istanbul");
  const [district, setDistrict] = useState("");
  const [price, setPrice] = useState("");
  const [homeServiceVal, setHomeServiceVal] = useState("evde");
  const [photo, setPhoto] = useState(null); // { url, name }
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // form | success
  const [created, setCreated] = useState(null);
  const [aiWriting, setAiWriting] = useState(false);
  const [moderation, setModeration] = useState(null); // { status: 'checking'|'approved'|'flagged', reason }
  const [recommendation, setRecommendation] = useState(null); // { product, pitch }
  const [recLoading, setRecLoading] = useState(false);

  const availableCategories = CATEGORIES.filter((c) => c.mode === mode || c.mode === "both");
  const cityName = CITIES.find((c) => c.id === cityId)?.name;

  const writeWithAI = async () => {
    if (!categoryId) { setError("Önce bir kategori seç, AI ona göre yazsın."); return; }
    setAiWriting(true);
    setError("");
    try {
      const catName = CATEGORIES.find((c) => c.id === categoryId)?.name || "";
      const prompt = `Bir hizmet pazaryeri uygulaması için ilan metni yaz. Kategori: "${catName}". ${title.trim() ? `Kullanıcının notu: "${title.trim()} ${desc.trim()}"` : "Kullanıcı henüz bir şey yazmadı, kategoriye uygun genel ve inandırıcı bir metin üret."}
SADECE şu JSON formatında yanıt ver, başka hiçbir metin ekleme:
{"title": "çekici, kısa bir ilan başlığı (en fazla 8 kelime)", "desc": "2-3 cümlelik, samimi ve profesyonel bir hizmet açıklaması"}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 400, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTitle(parsed.title || title);
      setDesc(parsed.desc || desc);
    } catch (err) {
      setError("AI şu an yazamadı, tekrar dener misin?");
    } finally {
      setAiWriting(false);
    }
  };

  const checkPhotoContent = async (dataUrl, mimeType) => {
    setModeration({ status: "checking" });
    try {
      const base64 = dataUrl.split(",")[1];
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 200,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
              { type: "text", text: `Bu görsel, bakıcı/temizlikçi/öğretmen gibi hizmet sağlayıcı profillerinin bulunduğu bir aile hizmet pazaryerinde kapak fotoğrafı olarak kullanılacak — platformda çocuk bakımı kategorileri de var, bu yüzden standart yüksek tutulmalı.

Şu kategorilerden herhangi birine giriyorsa "approved: false" ver: çıplaklık veya cinsel içerik, şiddet/silah/yaralanma görüntüsü, nefret sembolü, platformla alakasız/spam görsel (ürün, ekran görüntüsü, ünlü biri vb.), belirsiz/tanınamayan/düşük kaliteli görsel, ya da kararsız kaldığın herhangi bir sınır durum. Sadece görselin normal, profesyonel bir profil/hizmet fotoğrafı olduğundan eminsen "approved: true" ver — şüphede kalırsan reddet.

SADECE şu JSON formatında yanıt ver: {"approved": true veya false, "reason": "kısa gerekçe (en fazla 12 kelime)"}` },
            ],
          }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setModeration({ status: parsed.approved ? "approved" : "flagged", reason: parsed.reason });
    } catch (err) {
      // Fail-safe: eğer otomatik kontrol başarısız olursa, ONAYLAMA — incelemeye al.
      setModeration({ status: "flagged", reason: "Otomatik kontrol başarısız oldu, manuel incelemeye alındı." });
    }
  };

  const getRecommendation = async (listing) => {
    setRecLoading(true);
    try {
      const prompt = `Bir hizmet pazaryerinde yeni bir ilan oluşturuldu. Başlık: "${listing.title}", kategori: "${CATEGORIES.find((c) => c.id === listing.category)?.name}". Bu sağlayıcıya, platformun sunduğu ücretli ek ürünlerden (Öne Çıkan İlan, Beceri Testi Rozeti, Görünürlük Paketi) birini kişiselleştirilmiş, samimi bir dille öner. SADECE şu JSON formatında yanıt ver: {"product": "Öne Çıkan İlan" | "Beceri Testi Rozeti" | "Görünürlük Paketi", "pitch": "2 cümlelik, o kişiye özel gerekçe"}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      setRecommendation(JSON.parse(clean));
    } catch (err) {
      setRecommendation(null);
    } finally {
      setRecLoading(false);
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto({ url, name: file.name });
    const reader = new FileReader();
    reader.onload = () => checkPhotoContent(reader.result, file.type);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!providerName.trim()) { setError("Görünecek isim/işletme adını yaz."); return; }
    if (!categoryId) { setError("Bir kategori seçmelisin."); return; }
    if (!title.trim()) { setError("İlan başlığı yazmalısın."); return; }
    if (!desc.trim()) { setError("Sunduğun hizmeti kısaca anlat."); return; }
    if (!price.trim()) { setError("Bir fiyat belirtmelisin."); return; }
    if (moderation?.status === "checking") { setError("Fotoğraf içerik kontrolü bitene kadar bekle."); return; }
    if (moderation?.status === "flagged") { setError("Kapak fotoğrafın incelemeye alındı, ilanı yayınlamadan önce fotoğrafı kaldır ya da değiştir."); return; }
    setError("");

    const listing = {
      id: Date.now(),
      category: categoryId,
      mode,
      title: title.trim(),
      provider: providerName.trim(),
      city: mode === "local" ? `${district.trim() ? district.trim() + ", " : ""}${cityName}` : "Uzaktan",
      price: price.trim(),
      rating: 0,
      reviewCount: 0,
      img: photo?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
      desc: desc.trim(),
      level: "new",
      verified: [],
      homeService: mode === "local" ? homeServiceVal : undefined,
    };
    setCreated(listing);
    onCreated(listing);
    setStep("success");
    getRecommendation(listing);
  };

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(47,191,113,0.15)" }}>
          <Check size={22} style={{ color: "#2FBF71" }} />
        </div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>İlanın yayında! 🎉</h2>
        <p className="text-sm mb-6" style={{ color: "#5C5744" }}>"{created?.title}" artık ana sayfada ve aramada görünüyor.</p>

        {recLoading && (
          <div className="rounded-2xl border p-4 mb-6 text-xs flex items-center justify-center gap-2" style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#8A8368" }}>
            <Loader2 size={13} className="animate-spin" /> Senin için kişisel bir öneri hazırlanıyor...
          </div>
        )}
        {recommendation && (
          <div className="rounded-2xl border-2 p-5 mb-6 text-left" style={{ borderColor: "#2563EB", background: "#EFF6FF" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={13} style={{ color: "#2563EB" }} />
              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#2563EB" }}>Senin İçin Önerimiz</span>
            </div>
            <p className="text-sm font-bold mb-1.5" style={{ color: "#0F1115" }}>{recommendation.product}</p>
            <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{recommendation.pitch}</p>
            <button className="mt-3 text-xs font-bold px-3.5 py-2 rounded-full text-white" style={{ background: "#2563EB" }}>İncele</button>
          </div>
        )}

        <div className="flex gap-2 justify-center">
          <button onClick={onBack} className="px-5 py-2.5 rounded-full text-sm font-medium text-white" style={{ background: "#C2872B" }}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>Hizmet Ekle</h1>
      <p className="text-sm mb-6" style={{ color: "#5C5744" }}>Sunduğun hizmeti anlat, ilanın hemen yayına girsin.</p>

      <div className="flex gap-2 mb-6">
        {[["local", "Yerinde hizmet"], ["remote", "Uzaktan hizmet"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setMode(key); setCategoryId(""); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
            style={mode === key ? { background: "#1B2B24", color: "#EFE8D8", borderColor: "#1B2B24" } : { borderColor: "#D9D0BA", color: "#5C5744" }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Görünecek isim / işletme adı</label>
          <input
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            placeholder="Örn. Ayşe T. veya Studio Reyhan"
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          >
            <option value="">Kategori seç...</option>
            {PARENT_CATEGORIES.map((group) => {
              const opts = availableCategories.filter((c) => group.categoryIds.includes(c.id));
              if (opts.length === 0) return null;
              return (
                <optgroup key={group.id} label={group.name}>
                  {opts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              );
            })}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium" style={{ color: "#5C5744" }}>İlan Başlığı</label>
            <button
              onClick={writeWithAI}
              disabled={aiWriting}
              className="text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ background: "#EFF6FF", color: "#2563EB" }}
            >
              {aiWriting ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
              {aiWriting ? "Yazıyor..." : "AI ile Yaz"}
            </button>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn. Deneyimli Bebek ve Çocuk Bakıcısı"
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Açıklama</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="Deneyimini, sunduğun hizmetleri ve neden seni seçmeliler anlat... (ya da kategori seçip 'AI ile Yaz'a bas)"
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none resize-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Kapak fotoğrafı (opsiyonel)</label>
          <div className="flex items-center gap-3">
            {photo && (
              <img src={photo.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
            )}
            <label
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
              style={{ borderColor: "#D9D0BA", color: "#5C5744" }}
            >
              <UploadCloud size={14} />
              {photo ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>
          {moderation && (
            <p
              className="text-[11px] mt-1.5 flex items-center gap-1"
              style={{ color: moderation.status === "checking" ? "#8A8368" : moderation.status === "approved" ? "#3F7D5C" : "#9C4A3C" }}
            >
              {moderation.status === "checking" && <><Loader2 size={11} className="animate-spin" /> AI ile içerik kontrol ediliyor...</>}
              {moderation.status === "approved" && <><ShieldCheck size={11} /> İçerik AI tarafından onaylandı</>}
              {moderation.status === "flagged" && <><AlertCircle size={11} /> {moderation.reason || "İçerik incelemeye alındı"}</>}
            </p>
          )}
        </div>

        {mode === "local" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Şehir</label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
                >
                  {["Türkiye", "Hindistan", "Avrupa", "Kuzey Amerika", "Orta Doğu", "Asya-Pasifik"].map((region) => (
                    <optgroup key={region} label={region}>
                      {CITIES.filter((c) => c.region === region).map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Semt / Bölge</label>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Örn. Kadıköy"
                  className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Nerede hizmet veriyorsun?</label>
              <div className="flex gap-2">
                {[["evde", "Eve giderim"], ["mekanda", "Kendi mekanımda"], ["esnek", "İkisi de olur"]].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setHomeServiceVal(key)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium border"
                    style={homeServiceVal === key
                      ? { background: "#3F7D5C", color: "#EFE8D8", borderColor: "transparent" }
                      : { borderColor: "#D9D0BA", color: "#5C5744" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Fiyat</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Örn. 500₺'den, 300₺/saat, 450₺/gün"
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
        </div>

        {error && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{error}</p>
        )}

        <button onClick={handleSubmit} className="w-full py-3 rounded-full text-sm font-medium text-white mt-2" style={{ background: "#2FBF71", color: "#1B2B24" }}>
          İlanı Yayınla
        </button>
        <p className="text-[11px] text-center" style={{ color: "#8A8368" }}>
          Sertifika, CV ve video tanıtım eklemek için profilini de tamamlamayı unutma.
        </p>
      </div>
    </div>
  );
}

const SUPPORT_CATEGORY_META = {
  "teknik sorun": { label: "Teknik Sorun", color: "#EF4444" },
  "istek": { label: "İstek", color: "#3B82F6" },
  "şikayet": { label: "Şikayet", color: "#F59E0B" },
  "diğer": { label: "Diğer", color: "#6B7280" },
};

function SupportChatView({ onBack, onReport }) {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Merhaba! Ben İşinn destek asistanıyım. Yaşadığın teknik sorunu, isteğini ya da şikayetini buraya yazabilirsin, sana yardımcı olmaya çalışırım." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportError, setReportError] = useState("");

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMsg = { sender: "me", text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSending(true);
    try {
      const apiMessages = newMessages
        .filter((m) => m.sender !== "ai" || newMessages.indexOf(m) !== 0) // include all but keep flow natural
        .map((m) => ({ role: m.sender === "me" ? "user" : "assistant", content: m.text }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          system: "Sen İşinn adlı hizmet pazaryeri uygulamasının teknik destek asistanısın. Kullanıcıların teknik sorunlarını, isteklerini ve şikayetlerini dinliyorsun. Kısa, sıcak, çözüm odaklı ve Türkçe yanıt ver. Emin olmadığın konularda 'bunu ekibe ileteceğim' de.",
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n");
      setMessages((prev) => [...prev, { sender: "ai", text: text || "Üzgünüm, şu an yanıt veremiyorum, birazdan tekrar dener misin?" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Bağlantı sorunu oluştu, birazdan tekrar dener misin?" }]);
    } finally {
      setSending(false);
    }
  };

  const reportToManagement = async () => {
    setSending(true);
    setReportError("");
    try {
      const convoText = messages.map((m) => `${m.sender === "me" ? "Kullanıcı" : "Asistan"}: ${m.text}`).join("\n");
      const prompt = `Aşağıda bir kullanıcı ile destek asistanı arasındaki yazışma var. Bunu üst yönetime raporlamak için SADECE şu JSON formatında bir özet çıkar, başka hiçbir metin ekleme:
{"title": "kısa başlık (en fazla 8 kelime)", "category": "teknik sorun" | "istek" | "şikayet" | "diğer", "summary": "2-3 cümlelik özet"}

YAZIŞMA:
${convoText}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 400, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      onReport({ ...parsed, id: Date.now(), time: "az önce" });
      setReported(true);
    } catch (err) {
      setReportError("Rapor oluşturulamadı, tekrar dener misin?");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-3 shrink-0" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2.5 pb-3 border-b mb-3 shrink-0" style={{ borderColor: "#F0F0F0" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
          <Bot size={16} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "#0F1115" }}>Destek Asistanı</p>
          <p className="text-[11px]" style={{ color: "#9CA3AF" }}>Yapay zeka destekli · yönetime raporlanabilir</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap"
              style={m.sender === "me"
                ? { background: "#2563EB", color: "white", borderBottomRightRadius: 4 }
                : { background: "#F7F7F8", color: "#0F1115", borderBottomLeftRadius: 4 }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-3.5 py-2 text-xs flex items-center gap-1.5" style={{ background: "#F7F7F8", color: "#9CA3AF" }}>
              <Loader2 size={12} className="animate-spin" /> yazıyor...
            </div>
          </div>
        )}
      </div>

      {!reported ? (
        <>
          <div className="flex items-center gap-2 pt-3 mt-2 border-t shrink-0" style={{ borderColor: "#F0F0F0" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Sorununu yaz..."
              disabled={sending}
              className="flex-1 px-3.5 py-2.5 rounded-full border text-sm outline-none"
              style={{ borderColor: "#F0F0F0", background: "#F7F7F8", color: "#0F1115" }}
            />
            <button onClick={sendMessage} disabled={sending} className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "#2563EB" }}>
              <Send size={16} />
            </button>
          </div>
          {messages.length > 1 && (
            <button
              onClick={reportToManagement}
              disabled={sending}
              className="w-full mt-3 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5"
              style={{ background: "#FEF3C7", color: "#92400E" }}
            >
              <AlertCircle size={13} /> Bu Sorunu Yönetime Bildir
            </button>
          )}
          {reportError && <p className="text-xs mt-2 text-center" style={{ color: "#EF4444" }}>{reportError}</p>}
        </>
      ) : (
        <div className="mt-3 pt-3 border-t text-center" style={{ borderColor: "#F0F0F0" }}>
          <p className="text-xs font-medium flex items-center justify-center gap-1.5" style={{ color: "#059669" }}>
            <Check size={13} /> Sorunun yönetime iletildi
          </p>
        </div>
      )}
    </div>
  );
}

function AdminAnalyticsView({ onBack }) {
  const [status, setStatus] = useState("loading"); // loading | done | error
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const categoryCounts = {};
        LISTINGS.forEach((l) => { categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1; });
        const jobCategoryCounts = {};
        JOB_POSTINGS.forEach((j) => { jobCategoryCounts[j.category] = (jobCategoryCounts[j.category] || 0) + 1; });
        const summary = Object.entries(categoryCounts)
          .map(([cat, count]) => {
            const name = CATEGORIES.find((c) => c.id === cat)?.name || cat;
            const jobCount = jobCategoryCounts[cat] || 0;
            return `${name}: ${count} sağlayıcı ilanı, ${jobCount} aktif iş talebi`;
          })
          .join("\n");
        const prompt = `Aşağıda bir hizmet pazaryeri uygulamasının kategori bazlı verisi var. Bu veriye bakarak üst yönetime sunulacak, ülke/sektör bazında mesleki yönelim ve talep trendi hakkında 4-5 kısa içgörü (insight) üret. Türkçe, madde madde, iş dünyasına uygun bir dille yaz. SADECE şu JSON formatında yanıt ver: {"insights": ["içgörü 1", "içgörü 2", ...]}

VERİ:
${summary}`;
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 700, messages: [{ role: "user", content: prompt }] }),
        });
        const data = await response.json();
        const text = (data.content || []).map((b) => b.text || "").join("\n");
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        if (cancelled) return;
        setInsights(parsed.insights || []);
        setStatus("done");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={20} style={{ color: "#2563EB" }} />
        <h1 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>Pazar Analizi</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Platform verisine göre AI tarafından üretilen sektör/talep içgörüleri</p>

      {status === "loading" && (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <Loader2 size={20} className="animate-spin mx-auto mb-2" style={{ color: "#2563EB" }} />
          <p className="text-sm" style={{ color: "#6B7280" }}>Kategori verileri analiz ediliyor...</p>
        </div>
      )}
      {status === "error" && (
        <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <p className="text-sm" style={{ color: "#EF4444" }}>Analiz oluşturulamadı, tekrar dener misin?</p>
        </div>
      )}
      {status === "done" && (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#1B2B24" }}>{insight}</p>
            </div>
          ))}
          <p className="text-[11px] mt-3" style={{ color: "#9CA3AF" }}>
            Not: Bu analiz şu anki örnek/demo veriye dayanıyor. Platform büyüdükçe içgörüler gerçek kullanıcı verisiyle çok daha güvenilir hale gelecek.
          </p>
        </div>
      )}
    </div>
  );
}

function AdminModerationQueueView({ onBack, queue, onApprove, onReject }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} style={{ color: "#2563EB" }} />
        <h1 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>Moderasyon Kuyruğu</h1>
      </div>
      <p className="text-sm mb-2" style={{ color: "#6B7280" }}>Platform ekibinin (şu an sen) gözden geçirmesi gereken içerikler</p>
      <p className="text-xs mb-6 px-3 py-2 rounded-lg" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
        Videolar AI ile otomatik taranamadığı için buraya düşer. Burada genel içerik güvenliğini (uygunsuz/tehlikeli içerik var mı) değerlendir — sağlayıcının kendi rızası ayrı bir adımda, sen onayladıktan sonra ayrıca sorulur.
      </p>

      {queue.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <ShieldCheck size={28} className="mx-auto mb-2" style={{ color: "#D1D5DB" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>İncelemeyi bekleyen içerik yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((item) => (
            <div key={item.id} className="rounded-2xl border p-4" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
              <video src={item.mediaUrl} controls className="w-full rounded-lg bg-black mb-3" style={{ maxHeight: "260px" }} />
              <p className="text-xs mb-1" style={{ color: "#6B7280" }}><span className="font-bold" style={{ color: "#0F1115" }}>{item.reviewerName}</span> → {item.providerName} için yorum ({item.listingTitle})</p>
              <p className="text-[11px] mb-3" style={{ color: "#9CA3AF" }}>{item.submittedAt}</p>
              <div className="flex gap-2">
                <button onClick={() => onApprove(item)} className="flex-1 py-2 rounded-full text-xs font-bold text-white flex items-center justify-center gap-1" style={{ background: "#3F7D5C" }}>
                  <Check size={13} /> Uygun, Sağlayıcıya Gönder
                </button>
                <button onClick={() => onReject(item.id)} className="flex-1 py-2 rounded-full text-xs font-bold border flex items-center justify-center gap-1" style={{ borderColor: "#D9D0BA", color: "#9C4A3C" }}>
                  <X size={13} /> Uygunsuz, Reddet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminReportsView({ onBack, reports }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <Inbox size={20} style={{ color: "#2563EB" }} />
        <h1 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>Destek Talepleri</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Kullanıcıların destek asistanına yazdığı ve yönetime bildirilen özetler</p>

      {reports.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <Inbox size={28} className="mx-auto mb-2" style={{ color: "#D1D5DB" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Henüz bildirilen bir destek talebi yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const meta = SUPPORT_CATEGORY_META[r.category] || SUPPORT_CATEGORY_META["diğer"];
            return (
              <div key={r.id} className="rounded-2xl border p-4" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-bold" style={{ color: "#0F1115" }}>{r.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${meta.color}18`, color: meta.color }}>{meta.label}</span>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "#6B7280" }}>{r.summary}</p>
                <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{r.time}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PricingView({ onBack, onJoined }) {
  const [joined, setJoined] = useState(false);
  const [boostSelected, setBoostSelected] = useState(false);
  const [cycle, setCycle] = useState("monthly"); // monthly | yearly
  const plan = PLANS[0];
  const basePrice = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
  const period = cycle === "monthly" ? "/ay" : "/yıl";
  const total = basePrice + (boostSelected ? BOOST_PACKAGE.priceMonthly : 0);

  if (joined) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(37,99,235,0.12)" }}>
          <Check size={22} style={{ color: "#2563EB" }} />
        </div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>Aramıza hoş geldin! 🎉</h2>
        <p className="text-sm mb-2" style={{ color: "#5C5744" }}>
          İlk {plan.trialMonths} ayın tamamen ücretsiz — hiçbir kart çekimi olmayacak.
        </p>
        <p className="text-sm mb-6" style={{ color: "#5C5744" }}>
          Deneme süresi bitince {cycle === "monthly" ? `ayda ${total}₺` : `yılda ${total}₺ (11 ay fiyatına 12 ay)`} olarak faturalandırılacaksın{boostSelected ? " (Standart Üyelik + Öne Çıkarma Paketi)" : ""}. Kazandığından hiçbir komisyon kesilmez.
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={onJoined} className="px-5 py-2.5 rounded-full text-sm font-medium text-white" style={{ background: "#2563EB" }}>İlk İlanını Oluştur</button>
          <button onClick={onBack} className="px-5 py-2.5 rounded-full text-sm font-medium border" style={{ borderColor: "#D9D0BA", color: "#1B2B24" }}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 py-14">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="text-center mb-6">
        <h1 className="font-serif text-3xl mb-3" style={{ color: "#1B2B24" }}>Sağlayıcı Ol</h1>
        <p className="text-sm mb-4" style={{ color: "#5C5744" }}>
          Tek, basit bir aylık ücret — kazandığından hiçbir komisyon almıyoruz.
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full text-white"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
        >
          <Sparkles size={13} /> İlk {plan.trialMonths} Ay Herkese Ücretsiz 🎉
        </span>
      </div>

      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ background: "#F8F4E9", border: "1px solid #D9D0BA" }}>
          {[["monthly", "Aylık"], ["yearly", "Yıllık"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCycle(key)}
              className="text-sm font-bold px-4 py-1.5 rounded-full transition-all"
              style={cycle === key ? { background: "#2563EB", color: "#FFFFFF" } : { color: "#8A8368" }}
            >
              {label} {key === "yearly" && <span className="text-[10px]" style={{ color: cycle === key ? "#DBEAFE" : "#2563EB" }}>11 ay fiyatına 12 ay</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 p-6 flex flex-col mb-4" style={{ borderColor: "#2563EB", background: "#F8F4E9" }}>
        <p className="font-serif text-lg mb-1" style={{ color: "#1B2B24" }}>{plan.name}</p>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>{plan.tagline}</p>
        <div className="mb-1 flex items-baseline gap-1">
          <span className="font-serif text-4xl" style={{ color: "#1B2B24" }}>{basePrice}₺</span>
          <span className="text-sm" style={{ color: "#8A8368" }}>{period}</span>
        </div>
        <p className="text-xs font-medium mb-4" style={{ color: "#059669" }}>İlk {plan.trialMonths} ay ücretsiz, sonra bu fiyattan devam eder</p>
        <div className="space-y-2.5">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "#3D3B30" }}>
              <Check size={14} style={{ color: "#2563EB" }} className="mt-0.5 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setBoostSelected(!boostSelected)}
        className="w-full rounded-2xl border-2 p-6 flex flex-col text-left mb-6 transition-colors"
        style={boostSelected ? { borderColor: "#F59E0B", background: "#FFFBEB" } : { borderColor: "#D9D0BA", background: "#F8F4E9" }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="font-serif text-lg" style={{ color: "#1B2B24" }}>{BOOST_PACKAGE.name}</p>
          <div
            className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
            style={boostSelected ? { background: "#F59E0B", borderColor: "#F59E0B" } : { borderColor: "#D9D0BA" }}
          >
            {boostSelected && <Check size={13} className="text-white" />}
          </div>
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>{BOOST_PACKAGE.tagline} — isteğe bağlı, deneme kapsamında değil</p>
        <div className="mb-4 flex items-baseline gap-1">
          <span className="font-serif text-2xl" style={{ color: "#1B2B24" }}>+{BOOST_PACKAGE.priceMonthly}₺</span>
          <span className="text-sm" style={{ color: "#8A8368" }}>/ay</span>
        </div>
        <div className="space-y-2">
          {BOOST_PACKAGE.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "#3D3B30" }}>
              <Sparkles size={13} style={{ color: "#F59E0B" }} className="mt-0.5 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </button>

      <div className="rounded-xl p-4 mb-4 flex items-center justify-between" style={{ background: "#0F1115" }}>
        <div>
          <span className="text-sm font-medium block" style={{ color: "#EFE8D8" }}>{cycle === "monthly" ? "Aylık toplam" : "Yıllık toplam"}</span>
          <span className="text-[11px]" style={{ color: "#9CA3AF" }}>İlk {plan.trialMonths} ay: 0₺</span>
        </div>
        <span className="font-serif text-2xl font-bold text-white">{total}₺</span>
      </div>

      <button
        onClick={() => setJoined(true)}
        className="w-full py-3 rounded-full text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
      >
        Ücretsiz Denemeye Başla
      </button>
      <p className="text-xs text-center mt-6" style={{ color: "#8A8368" }}>
        İstediğin zaman iptal edebilir ya da Öne Çıkarma Paketi'ni ekleyip çıkarabilirsin. Müşterilerden aldığın ödemelerden İşinn hiçbir kesinti yapmaz — kazancının tamamı sana kalır.
      </p>
    </div>
  );
}

function ProfileView({ onBack, onOpenAdminReports, onOpenAnalytics, onOpenModeration, pendingMediaApprovals, onApproveMedia, onRejectMedia }) {
  const [certificates, setCertificates] = useState([]); // { name, url, isPdf }
  const [cv, setCv] = useState(null); // { name, url }
  const [profilePhoto, setProfilePhoto] = useState(null); // { url }
  const [portfolio, setPortfolio] = useState([]); // { type: 'image'|'video', url, name } — work-in-action examples
  const [videoIntro, setVideoIntro] = useState(null); // { url, name } — single self-introduction video
  const [lightbox, setLightbox] = useState(null); // { media, index }

  const handleCertAdd = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - certificates.length);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setCertificates((prev) => [...prev, { name: file.name, url, isPdf: file.type === "application/pdf" }].slice(0, 5));
    });
    e.target.value = "";
  };

  const handleCvAdd = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCv({ name: file.name, url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handlePhotoAdd = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto({ url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handlePortfolioAdd = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 9 - portfolio.length);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? "video" : "image";
      setPortfolio((prev) => [...prev, { type, url, name: file.name }].slice(0, 9));
    });
    e.target.value = "";
  };

  const handleVideoAdd = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoIntro({ url: URL.createObjectURL(file), name: file.name });
    e.target.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-4 mb-8">
        <label className="relative w-16 h-16 rounded-full cursor-pointer shrink-0 group">
          {profilePhoto ? (
            <img src={profilePhoto.url} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium text-white" style={{ background: "#1B2B24" }}>SK</div>
          )}
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
            <Camera size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoAdd} />
        </label>
        <div>
          <h1 className="font-serif text-xl" style={{ color: "#1B2B24" }}>Sen (örnek profil)</h1>
          <p className="text-sm" style={{ color: "#5C5744" }}>İstanbul · Üye: Ağustos 2026</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[["0", "İlan"], ["0", "Tamamlanan İş"], ["—", "Puan"]].map(([val, label]) => (
          <div key={label} className="rounded-xl border p-4 text-center" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            <p className="font-serif text-xl" style={{ color: "#1B2B24" }}>{val}</p>
            <p className="text-xs mt-1" style={{ color: "#8A8368" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-1">
          <PlayCircle size={16} style={{ color: "#2FBF71" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Tanıtım Videosu</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
          Kendini kısa bir videoyla tanıt — kim olduğunu, deneyimini anlat. Örneğin İngilizce konuşabildiğini göstermek istiyorsan burada anlatabilirsin. Güven Merkezi'nde en üstte, tek ve öne çıkan video olarak görünür.
        </p>
        {videoIntro ? (
          <div>
            <video controls playsInline className="w-full rounded-lg bg-black mb-2" style={{ maxHeight: "240px" }}>
              <source src={videoIntro.url} />
            </video>
            <div className="flex items-center justify-between">
              <span className="text-xs truncate" style={{ color: "#5C5744" }}>{videoIntro.name}</span>
              <button onClick={() => setVideoIntro(null)} className="text-xs font-medium flex items-center gap-1" style={{ color: "#9C4A3C" }}>
                <Trash2 size={12} /> Kaldır
              </button>
            </div>
          </div>
        ) : (
          <label
            className="flex items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
            style={{ borderColor: "#D9D0BA", color: "#5C5744" }}
          >
            <UploadCloud size={16} />
            Tanıtım Videosu Yükle (en fazla 60 saniye önerilir)
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoAdd} />
          </label>
        )}
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-1">
          <Grid3x3 size={16} style={{ color: "#2FBF71" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Portföy — İş Başında</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
          İş yaparken çekilmiş fotoğraf ve videolarını ekle — örneğin oyun ablasıysan çocuklarla oynarken çekilmiş anlar. Instagram tarzı bir ızgarada görünür, tanıtım videondan ayrı ve ayrıca gösterilir.
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {portfolio.map((item, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
              <button
                onClick={() => setLightbox({ media: portfolio, index: i })}
                className="w-full h-full block"
              >
                {item.type === "video" ? (
                  <video muted playsInline className="w-full h-full object-cover">
                    <source src={item.url} />
                  </video>
                ) : (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                )}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
                    <PlayCircle size={22} className="text-white" />
                  </div>
                )}
              </button>
              <button
                onClick={() => setPortfolio(portfolio.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={11} className="text-white" />
              </button>
            </div>
          ))}
          {portfolio.length < 9 && (
            <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer gap-1" style={{ borderColor: "#D9D0BA", color: "#8A8368" }}>
              <UploadCloud size={18} />
              <span className="text-[10px] font-medium">Ekle</span>
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePortfolioAdd} />
            </label>
          )}
        </div>
      </div>

      {lightbox && (
        <MediaLightbox
          media={lightbox.media}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox({ ...lightbox, index: i })}
        />
      )}

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-1">
          <Award size={16} style={{ color: "#C2872B" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Sertifika & Belgeler</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
          Diploma, ustalık belgesi, lisans veya sertifikalarını ekle — ilanında "Doğrulanmış" rozeti olarak görünür.
        </p>
        <div className="space-y-2 mb-3">
          {certificates.map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: "#EFE8D8" }}>
              {c.isPdf ? (
                <FileText size={16} style={{ color: "#3A5BA0" }} className="shrink-0" />
              ) : (
                <img src={c.url} alt="" className="w-9 h-9 rounded object-cover shrink-0" />
              )}
              <span className="text-xs flex-1 truncate" style={{ color: "#1B2B24" }}>{c.name}</span>
              <button onClick={() => setCertificates(certificates.filter((_, idx) => idx !== i))}>
                <Trash2 size={14} style={{ color: "#9C4A3C" }} />
              </button>
            </div>
          ))}
        </div>
        {certificates.length < 5 && (
          <label
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
            style={{ borderColor: "#D9D0BA", color: "#5C5744" }}
          >
            <UploadCloud size={14} />
            Sertifika/Belge Ekle (PDF veya görsel)
            <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={handleCertAdd} />
          </label>
        )}
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} style={{ color: "#3A5BA0" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>CV / Özgeçmiş</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
          İş verenlerin deneyimini görebilmesi için özgeçmişini ekle (özellikle Mühendis, Öğretmen gibi kategorilerde önerilir).
        </p>
        {cv ? (
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: "#EFE8D8" }}>
            <FileText size={16} style={{ color: "#3A5BA0" }} className="shrink-0" />
            <span className="text-xs flex-1 truncate" style={{ color: "#1B2B24" }}>{cv.name}</span>
            <button onClick={() => setCv(null)}>
              <Trash2 size={14} style={{ color: "#9C4A3C" }} />
            </button>
          </div>
        ) : (
          <label
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
            style={{ borderColor: "#D9D0BA", color: "#5C5744" }}
          >
            <UploadCloud size={14} />
            CV Yükle (PDF)
            <input type="file" accept="application/pdf" className="hidden" onChange={handleCvAdd} />
          </label>
        )}
      </div>

      {pendingMediaApprovals && pendingMediaApprovals.length > 0 && (
        <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#F59E0B", background: "#FFFBEB" }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} style={{ color: "#F59E0B" }} />
            <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Onay Bekleyen Medyalarım ({pendingMediaApprovals.length})</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
            Bir müşteri, seni gösterebilecek bir fotoğraf/video ile ilanını değerlendirdi. Yayınlanması için onayın gerekiyor.
          </p>
          <div className="space-y-3">
            {pendingMediaApprovals.map((item) => (
              <div key={item.id} className="rounded-lg border p-3 flex items-center gap-3" style={{ borderColor: "#F0E4C4", background: "#FFFFFF" }}>
                {item.mediaType === "video" ? (
                  <video src={item.mediaUrl} muted className="w-14 h-14 rounded-lg object-cover shrink-0" />
                ) : (
                  <img src={item.mediaUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: "#1B2B24" }}>{item.reviewerName}</p>
                  <p className="text-[11px] truncate" style={{ color: "#8A8368" }}>{item.listingTitle} · {item.submittedAt}</p>
                  {item.isVideo && (
                    <p className="text-[10px]" style={{ color: "#9C4A3C" }}>Video — otomatik içerik kontrolü yapılamadı, dikkatli incele</p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => onApproveMedia(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#3F7D5C" }}>
                    <Check size={14} className="text-white" />
                  </button>
                  <button onClick={() => onRejectMedia(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: "#D9D0BA" }}>
                    <X size={14} style={{ color: "#8A8368" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onOpenAdminReports}
        className="w-full rounded-xl border p-5 mb-4 text-left flex items-center gap-3 hover:shadow-sm transition-shadow"
        style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.12)" }}>
          <Inbox size={16} style={{ color: "#2563EB" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>Destek Talepleri (Yönetim)</p>
          <p className="text-xs" style={{ color: "#8A8368" }}>Destek asistanına bildirilen kullanıcı sorunlarını gör</p>
        </div>
        <ChevronRight size={16} style={{ color: "#8A8368" }} />
      </button>

      <button
        onClick={onOpenModeration}
        className="w-full rounded-xl border p-5 mb-4 text-left flex items-center gap-3 hover:shadow-sm transition-shadow"
        style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.12)" }}>
          <ShieldCheck size={16} style={{ color: "#2563EB" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>Moderasyon Kuyruğu (Yönetim)</p>
          <p className="text-xs" style={{ color: "#8A8368" }}>AI'ın kontrol edemediği video içerikleri gözden geçir</p>
        </div>
        <ChevronRight size={16} style={{ color: "#8A8368" }} />
      </button>

      <button
        onClick={onOpenAnalytics}
        className="w-full rounded-xl border p-5 mb-4 text-left flex items-center gap-3 hover:shadow-sm transition-shadow"
        style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.12)" }}>
          <Sparkles size={16} style={{ color: "#2563EB" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>Pazar Analizi (Yönetim)</p>
          <p className="text-xs" style={{ color: "#8A8368" }}>AI ile üretilen sektör/talep içgörüleri</p>
        </div>
        <ChevronRight size={16} style={{ color: "#8A8368" }} />
      </button>

      <div className="rounded-xl border p-5 text-sm" style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#5C5744" }}>
        Bu, prototip amaçlı örnek bir profil ekranı. Gerçek uygulamada burada iş geçmişin, aldığın değerlendirmeler ve profil ayarların da yer alacak.
      </div>
    </div>
  );
}

export default function IsinnPrototype() {
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("local");
  const [query, setQuery] = useState("");
  const [lastJob, setLastJob] = useState(null);
  const [messageContact, setMessageContact] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [adminReports, setAdminReports] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [pendingMediaApprovals, setPendingMediaApprovals] = useState([]); // sağlayıcının kendi kimlik onayı kuyruğu
  const [staffModerationQueue, setStaffModerationQueue] = useState([]); // platform çalışanının içerik güvenliği kuyruğu (şu an sadece video)

  const runSearch = (q) => {
    const normalized = q.trim().toLocaleLowerCase("tr-TR");
    if (["tırnakçı", "tırnak", "nail", "nailart", "manikür", "manikur"].some((kw) => normalized.includes(kw))) {
      setView("nailart");
      return;
    }
    setQuery(q);
    setView("search");
  };

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF", fontFamily: "ui-sans-serif, system-ui" }}>
      <Header onNav={(v) => { setView(v); setSelected(null); if (v !== "messages") setMessageContact(null); }} onSearch={runSearch} pendingCount={pendingMediaApprovals.length + staffModerationQueue.length} />
      {view === "home" && (
        <HomeView
          onSelectListing={(l) => { setSelected(l); setView("detail"); }}
          onNav={setView}
          filter={filter}
          setFilter={setFilter}
          onSearch={runSearch}
          onApplyJob={(job) => { setMessageContact({ name: job.posterName, listingTitle: job.title }); setView("messages"); }}
          userListings={userListings}
        />
      )}
      {view === "search" && (
        <SearchResultsView
          query={query}
          onBack={() => setView("home")}
          onSelectListing={(l) => { setSelected(l); setView("detail"); }}
          userListings={userListings}
        />
      )}
      {view === "createListing" && (
        <CreateListingView
          onBack={() => setView("home")}
          onCreated={(listing) => setUserListings((prev) => [listing, ...prev])}
        />
      )}
      {view === "detail" && selected && (
        <ListingDetail
          listing={selected}
          onBack={() => setView("home")}
          onContact={() => { setMessageContact({ name: selected.provider, listingTitle: selected.title }); setView("messages"); }}
          userReviews={userReviews}
          onAddReview={(review) => setUserReviews((prev) => [review, ...prev])}
          onSubmitPendingMedia={(item) => setPendingMediaApprovals((prev) => [item, ...prev])}
          onSubmitStaffReview={(item) => setStaffModerationQueue((prev) => [item, ...prev])}
        />
      )}
      {view === "post" && (
        <PostJobView
          onBack={() => setView("home")}
          onSubmitted={() => setView("home")}
          onViewOffers={(job) => { setLastJob(job); setView("offers"); }}
          onMatchAI={(job) => { setLastJob(job); setView("aimatch"); }}
        />
      )}
      {view === "map" && (
        <MapView
          onBack={() => setView("home")}
          onSelectProvider={(p) => {
            const matched = LISTINGS.find((l) => l.provider === p.name) || LISTINGS[0];
            setSelected(matched);
            setView("detail");
          }}
        />
      )}
      {view === "offers" && <OffersView onBack={() => setView("home")} job={lastJob} />}
      {view === "aimatch" && (
        <AIMatchView
          job={lastJob}
          onBack={() => setView("home")}
          onSelectListing={(l) => { setSelected(l); setView("detail"); }}
        />
      )}
      {view === "nailart" && (
        <NailArtView
          onBack={() => setView("home")}
          onContact={(contact) => { setMessageContact(contact); setView("messages"); }}
        />
      )}
      {view === "messages" && <MessagesView onBack={() => setView("home")} initialContact={messageContact} />}
      {view === "pricing" && <PricingView onBack={() => setView("home")} onJoined={() => setView("createListing")} />}
      {view === "profile" && (
        <ProfileView
          onBack={() => setView("home")}
          onOpenAdminReports={() => setView("adminReports")}
          onOpenAnalytics={() => setView("adminAnalytics")}
          onOpenModeration={() => setView("adminModeration")}
          pendingMediaApprovals={pendingMediaApprovals}
          onApproveMedia={(id) => {
            const item = pendingMediaApprovals.find((p) => p.id === id);
            if (item) {
              setUserReviews((prev) => prev.map((r) => (r.id === item.reviewId ? { ...r, media: [{ type: item.mediaType, url: item.mediaUrl }] } : r)));
            }
            setPendingMediaApprovals((prev) => prev.filter((p) => p.id !== id));
          }}
          onRejectMedia={(id) => setPendingMediaApprovals((prev) => prev.filter((p) => p.id !== id))}
        />
      )}
      {view === "support" && (
        <SupportChatView
          onBack={() => setView("home")}
          onReport={(report) => setAdminReports((prev) => [report, ...prev])}
        />
      )}
      {view === "adminReports" && <AdminReportsView onBack={() => setView("home")} reports={adminReports} />}
      {view === "adminModeration" && (
        <AdminModerationQueueView
          onBack={() => setView("home")}
          queue={staffModerationQueue}
          onApprove={(item) => {
            setStaffModerationQueue((prev) => prev.filter((q) => q.id !== item.id));
            setPendingMediaApprovals((prev) => [{
              id: Date.now(), reviewId: item.reviewId, listingId: item.listingId, listingTitle: item.listingTitle,
              reviewerName: item.reviewerName, mediaUrl: item.mediaUrl, mediaType: item.mediaType, submittedAt: "az önce", isVideo: true,
            }, ...prev]);
          }}
          onReject={(id) => setStaffModerationQueue((prev) => prev.filter((q) => q.id !== id))}
        />
      )}
      {view === "adminAnalytics" && <AdminAnalyticsView onBack={() => setView("home")} />}

      {view !== "support" && (
        <button
          onClick={() => setView("support")}
          className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
        >
          <LifeBuoy size={22} />
        </button>
      )}
    </div>
  );
}
