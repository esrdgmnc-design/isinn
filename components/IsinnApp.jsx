"use client";

import { useState, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";
import { supabase } from "../lib/supabaseClient";
import {
  Search, MapPin, Star, Heart, PlayCircle, ChevronLeft, ChevronRight,
  Wrench, Truck, Monitor, Paintbrush, Code2, Sparkles, ThumbsUp,
  X, Send, Menu, Map as MapIcon, Check, MessageCircle, Clock, Key,
  GraduationCap, Baby, Megaphone, HardHat, Palette, Users, Grid3x3,
  ShieldCheck, BadgeCheck, Award, ArrowLeft, HeartPulse, Syringe, Activity, Wand2, Droplet, Home, Briefcase,
  Scissors, Shirt, Salad, Brain, HeartHandshake, Milk, Zap, Droplets, SprayCan, PartyPopper, Eye, Flower2,
  ChefHat, Flower, Sprout, Camera, MoreHorizontal, Dumbbell, Unlock,
  LifeBuoy, Bot, Loader2, AlertCircle, Inbox,
  UploadCloud, FileText, Trash2, Pencil, Phone, Lock, Bell,
  PaintBucket, AirVent, PawPrint, Music2, Calculator, Languages,
  PenTool, Video, Mic, ClipboardList
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
  // Kullanıcıyla birlikte gerçek pazar boşluğu olarak belirlendi (2026-09-07) —
  // bkz. supabase/categories_seed_v2.sql (bu satırları DB'ye de eklemek gerekiyor).
  { id: "boya-badana", name: "Boya & Badana", mode: "local", icon: PaintBucket },
  { id: "klima-beyaz-esya", name: "Klima & Beyaz Eşya Servisi", mode: "local", icon: AirVent },
  { id: "kuafor-berber", name: "Kuaför / Berber", mode: "local", icon: Scissors },
  { id: "evcil-hayvan", name: "Evcil Hayvan Bakımı", mode: "local", icon: PawPrint },
  { id: "muzik-egitmeni", name: "Müzik Eğitmeni", mode: "both", icon: Music2 },
  { id: "muhasebe", name: "Muhasebe / Mali Müşavir", mode: "both", icon: Calculator },
  { id: "ceviri", name: "Çeviri", mode: "remote", icon: Languages },
  // "Uzaktan hizmetler" grubu sadece 5 kategoriydi, kullanıcı birkaç tane
  // daha eklemek istedi (2026-09-08). bkz. supabase/categories_seed_v3.sql —
  // o dosya çalıştırılmadan bu kategoriler altında gerçek vitrin açılamaz.
  { id: "icerik-yazarligi", name: "İçerik Yazarlığı", mode: "remote", icon: PenTool },
  { id: "video-duzenleme", name: "Video Düzenleme", mode: "remote", icon: Video },
  { id: "seslendirme", name: "Seslendirme", mode: "remote", icon: Mic },
  { id: "sanal-asistan", name: "Sanal Asistan", mode: "remote", icon: ClipboardList },
];

// Sabit listede olmayan bir kategori isteyen kullanıcı için — CATEGORIES'e
// bilerek eklenmedi (homepage'deki kategori ızgaralarında normal bir
// kategoriymiş gibi görünmesini istemiyoruz), sadece Hizmet Ekle/İlan Ver
// formlarındaki <select>'e elle eklenen ayrı bir seçenek. Seçilince kullanıcı
// serbest bir etiket yazıyor, "diger" (bkz. supabase/custom_category_requests.sql)
// kategorisi altında kaydediliyor ve bir destek bileti düşüyor (kategori
// talebi) — bkz. CreateListingView/PostJobView handleSubmit.
const CUSTOM_CATEGORY_ID = "diger-ozel";

const PARENT_CATEGORIES = [
  { id: "ev-hizmetleri", name: "Ev Hizmetleri", icon: Home, categoryIds: ["temizlik", "nakliye", "tadilat", "cilingir", "terzi", "elektrikci", "su-tesisatcisi", "hali-yikama", "yemek", "boya-badana", "klima-beyaz-esya"] },
  { id: "guzellik-bakim", name: "Güzellik & Bakım", icon: Wand2, categoryIds: ["tirnakci", "makyaj", "bakim", "kuafor-berber"] },
  { id: "saglik", name: "Sağlık", icon: HeartPulse, categoryIds: ["hasta-bakici", "hemsire", "fizyoterapist", "diyetisyen", "psikolog", "yoga-koc", "spor-egitmeni"] },
  { id: "egitim-aile", name: "Eğitim & Aile", icon: GraduationCap, categoryIds: ["ogretmen", "bakici", "logusa-bakicisi", "emzirme-danismani", "etkinlik-organizatoru", "muzik-egitmeni"] },
  { id: "profesyonel", name: "Profesyonel Hizmetler", icon: Briefcase, categoryIds: ["tasarim", "yazilim", "dijital", "muhasebe", "ceviri", "icerik-yazarligi", "video-duzenleme", "seslendirme", "sanal-asistan"] },
  { id: "diger", name: "Diğer", icon: MoreHorizontal, categoryIds: ["bahce-bakim", "muhendis", "sosyal-medya", "profesyonel-fotograf", "evcil-hayvan"] },
];

const LEVEL_META = {
  "top-rated": { label: "Top Rated", color: "#C2872B" },
  "level-2": { label: "Level 2", color: "#6B4FA0" },
  "level-1": { label: "Level 1", color: "#3A5BA0" },
  "new": { label: "Yeni Satıcı", color: "#8A8368" },
};

// Gerçek vitrinler için seviye — tamamen otomatik, kimse manuel atamıyor
// (bkz. fetchListings). Fiverr'ın seviye mantığından esinlenildi ama bu
// şemada gerçekten ölçülebilen 3 sinyale (tamamlanan iş, ortalama puan,
// yorum sayısı) indirgendi — yanıt süresi/iptal oranı gibi burada takip
// edilmeyen sinyaller kullanılmadı (var olmayan veriyle sahte kesinlik
// yaratmamak için).
function computeProviderLevel(completedJobs, rating, reviewCount) {
  if (completedJobs >= 50 && rating >= 4.8 && reviewCount >= 30) return "top-rated";
  if (completedJobs >= 15 && rating >= 4.5 && reviewCount >= 10) return "level-2";
  if (completedJobs >= 3 && rating >= 4.0 && reviewCount >= 3) return "level-1";
  return "new";
}

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

// ---------------------------------------------------------------
// Gerçek veritabanı yardımcıları
// `services` tablosundaki satırları, bu dosyanın geri kalanının zaten
// bildiği LISTINGS/LOCAL_PROVIDERS şekline çeviren yardımcı fonksiyonlar.
// Bu sayede bileşenlerin JSX'i neredeyse hiç değişmeden gerçek veriyle
// çalışabiliyor — sadece veri kaynağı değişiyor.
// ---------------------------------------------------------------
const FALLBACK_LISTING_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600";

// services.price bir numeric alan, ama arayüz "8.500₺'den" / "450₺/saat" gibi
// serbest metin bekliyor/üretiyor. Formu gönderirken metinden sayı çıkarıyoruz,
// listelerken de sayıdan aynı formatta bir etiket geri üretiyoruz.
function parsePriceInput(raw) {
  const priceType = /saat/i.test(raw) ? "hourly" : "fixed";
  const match = (raw || "").match(/[\d.,]+/);
  if (!match) return { numeric: null, priceType };
  let s = match[0];
  s = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/\./g, "");
  const numeric = parseFloat(s);
  return { numeric: Number.isNaN(numeric) ? null : numeric, priceType };
}

function formatPriceLabel(price, priceType) {
  if (price == null) return priceType === "hourly" ? "Fiyat belirtilmemiş/saat" : "Fiyat belirtilmemiş";
  const formatted = Number(price).toLocaleString("tr-TR");
  if (priceType === "hourly") return `${formatted}₺/saat`;
  if (priceType === "quote") return "Teklif alın";
  return `${formatted}₺'den`;
}

// Bir kullanıcının kaç vitrin hakkı olduğunu hesaplar (plan tavanı + varsa
// Ek Vitrin Paketi). CreateListingView'daki checkVitrinLimit ile ProfileView'ın
// "Vitrinlerim (N/cap)" göstergesi aynı mantığı paylaşsın diye ortak fonksiyon —
// önceden sadece CreateListingView'da vardı, ProfileView kullanıcıya kaç
// vitrin hakkı olduğunu hiç göstermiyordu (sadece "Vitrinlerim (N)" — tavan
// görünmüyordu, "3'ten kaçı doldu" bilgisi eksikti).
async function getVitrinCapInfo(userId) {
  if (!userId) return { cap: 1, planName: "Standart Üyelik", hasExtraVitrinAddon: false };
  const [{ data: subRow }, { data: addonProduct }] = await Promise.all([
    supabase
      .from("provider_subscriptions")
      .select("subscription_plans(name, max_active_listings)")
      .eq("profile_id", userId)
      .in("status", ["active", "trialing"])
      .maybeSingle(),
    supabase.from("addon_products").select("id").eq("slug", "ek-vitrin").maybeSingle(),
  ]);
  let cap = subRow?.subscription_plans?.max_active_listings ?? 2;
  const planName = subRow?.subscription_plans?.name || "Standart Üyelik";
  let hasExtraVitrinAddon = false;
  if (addonProduct?.id) {
    const { data: addonRow } = await supabase
      .from("provider_addons")
      .select("id, current_period_end")
      .eq("profile_id", userId)
      .eq("addon_id", addonProduct.id)
      .eq("status", "active")
      .maybeSingle();
    hasExtraVitrinAddon = !!addonRow && new Date(addonRow.current_period_end) > new Date();
  }
  if (hasExtraVitrinAddon) cap += 3;
  return { cap, planName, hasExtraVitrinAddon };
}

// Şüpheli içerik önce ucuz bir anahtar kelime filtresinden geçiyor — her
// mesajda AI çağırmak hem pahalı hem gereksiz. Sadece bu kalıplardan biri
// eşleşirse AI'ye "gerçekten şüpheli mi" diye soruyoruz (yanlış pozitifleri
// azaltmak için). Sessiz, engellemeyen bir katman — hiçbir gönderimi
// durdurmuyor, sadece admin'in görebileceği content_flags'a düşürüyor
// (bkz. growth_features_batch.sql). Platform komisyon almadığı için "ücret
// kaçırma" değil, asıl risk WhatsApp/Telegram'a çekip dolandırıcılık yapmak.
const SUSPICIOUS_CONTENT_PATTERN = /whatsapp|telegram|\biban\b|banka hesab|kapora|ön ödeme|hemen ödeme|platform dışı|dışarıdan (öde|anlaş)/i;

async function checkAndFlagContent(contentType, contentId, text, profileId) {
  if (!text || !contentId || !SUSPICIOUS_CONTENT_PATTERN.test(text)) return;
  try {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 150,
        messages: [{
          role: "user",
          content: `Bir hizmet pazaryerinde şu metin gönderildi:\n"${text}"\n\nBu metin platformu atlayıp doğrudan ödeme isteme, dolandırıcılık kalıbı ya da kullanıcıyı kandırmaya yönelik şüpheli bir istek içeriyor mu? Sadece WhatsApp/Telegram'dan iletişime geçmeyi önermek TEK BAŞINA şüpheli sayılmaz (normal bir tercih olabilir) — asıl önemli olan ödeme/kapora isteme veya aldatma niyeti var mı.\n\nSADECE şu JSON formatında yanıt ver: {"suspicious": true veya false, "reason": "kısa gerekçe (en fazla 15 kelime)"}`,
        }],
      }),
    });
    const data = await response.json();
    const raw = (data.content || []).map((b) => b.text || "").join("\n");
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (parsed.suspicious) {
      await supabase.from("content_flags").insert({
        content_type: contentType, content_id: contentId, flagged_profile_id: profileId || null,
        reason: parsed.reason || "AI şüpheli buldu", excerpt: text.slice(0, 200),
      });
    }
  } catch {
    // sessizce vazgeç — bu tamamen ek bir katman, asıl akışı asla engellememeli
  }
}

// Bir şehrin merkez lat/lng'sini PostGIS'in anlayacağı EWKT metnine çevirir —
// services.location (geography(Point,4326)) kolonuna doğrudan yazılabilir.
function cityToLocationEwkt(cityId) {
  const c = CITIES.find((x) => x.id === cityId);
  if (!c) return null;
  return `SRID=4326;POINT(${c.lng} ${c.lat})`;
}

// "Kadıköy, İstanbul" gibi bir city metninden CITIES listesindeki id'yi bulmaya çalışır.
function deriveCityIdFromLabel(label) {
  if (!label) return null;
  const parts = label.split(",");
  const name = parts[parts.length - 1].trim().toLocaleLowerCase("tr-TR");
  const found = CITIES.find((c) => c.name.toLocaleLowerCase("tr-TR") === name);
  return found ? found.id : null;
}

// Görünürlük/sıralama matematiği — esrdgmnc@gmail.com ile konuşulan "50/5000
// kişi boost alırsa ne olur" sorusunun cevabı: Öne Çıkarma Paketi kaliteyi hiç
// EZMEZ, sadece sınırlı ve sabit bir bonus verir. Puan (ve puan sayısına göre
// güven payı) skorun büyük kısmını oluşturur; boost'lular kendi aralarında da
// hâlâ kaliteye göre sıralanır — "para = otomatik #1" değil, "para = adil bir
// avantaj". reviewCount=0 olan yeni vitrinlere de gömülüp kaybolmasınlar diye
// nötr bir başlangıç puanı veriyoruz (soğuk başlangıç sorunu).
function computeVisibilityScore(l) {
  const ratingScore = l.reviewCount > 0 ? l.rating * 20 : 75;
  const confidenceBonus = Math.min(l.reviewCount || 0, 20); // en fazla +20
  const boostBonus = l.isBoosted ? 15 : 0; // sabit, sınırlı bonus
  return ratingScore + confidenceBonus + boostBonus;
}

// "Öne Çıkan" şeridi gibi sınırlı-kapasiteli alanlarda, uygun havuzun TAMAMI
// arasında GÜNLÜK olarak adil rotasyon sağlar — yoksa havuzda kaç kişi olursa
// olsun hep en yüksek puanlılar sabit kalır, geri kalanının parası boşa gider.
// Aynı gün içinde herkese aynı sırayı gösterir (tutarlı), gün değişince
// rotasyon kayar (mulberry32 tabanlı, deterministik — sunucu/istemci arası
// state gerektirmez).
function seededDailyShuffle(arr) {
  const seed = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) >>> 0;
  const a = [...arr];
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// react-easy-crop, seçilen alanı piksel cinsinden döndürüyor (bkz.
// PhotoCropModal'ın onCropComplete'i) — bunu gerçek, yüklenebilir bir File'a
// çeviren canvas adımı. Kalite 0.92 JPEG'e sabit — orijinal formattan
// bağımsız, öngörülebilir dosya boyutu için.
async function getCroppedFile(imageSrc, cropPixels, fileName) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cropPixels.width);
  canvas.height = Math.round(cropPixels.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height,
    0, 0, cropPixels.width, cropPixels.height
  );
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  return new File([blob], fileName, { type: "image/jpeg" });
}

// Fotoğraf yükleme alanlarına ortak kırpma adımı — kullanıcı "son olarak
// fotoğraflara kırp/ayarla ekleyelim" dedi (2026-09-08). Dosya seçilir
// seçilmez doğrudan yüklemek yerine, önce bu modal açılıyor; kullanıcı
// alanı/yakınlaştırmayı ayarlayıp onaylayınca gerçek yükleme (mevcut
// upload fonksiyonları) kırpılmış File ile çağrılıyor. Kapak fotoğrafı
// (kare, aspect=1) ve profil fotoğrafı (kare, cropShape="round") için
// kullanılıyor — video/sertifika gibi kırpmanın anlamsız olduğu yüklemelere
// bilerek dokunulmadı.
function PhotoCropModal({ imageSrc, aspect = 1, shape = "rect", fileName, onCancel, onCropped }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedFile(imageSrc, croppedAreaPixels, fileName);
      onCropped(file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: "rgba(15,17,21,0.82)" }}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#FFFFFF" }}>
        <div className="px-4 pt-4 pb-1">
          <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>Fotoğrafı Ayarla</p>
        </div>
        <div className="relative" style={{ height: 320, background: "#111" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={shape}
            showGrid={shape === "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          />
        </div>
        <div className="p-4 space-y-3.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium shrink-0" style={{ color: "#5C5744" }}>Yakınlaştır</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border"
              style={{ borderColor: "#D9D0BA", color: "#5C5744" }}
            >
              Vazgeç
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ background: "#2FBF71", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Kaydediliyor..." : "Kırp ve Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// supabase.from('services').select('*, profiles(*), categories(*)') sonucundaki
// bir satırı, LISTINGS dizisindeki nesnelerle aynı şekle çevirir.
function mapServiceRowToListing(row) {
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
    // Eskiden burada her zaman "evde" sabitlenmişti — sağlayıcının formda
    // ne seçtiğine hiç bakılmıyordu (alan zaten kaydedilmiyordu). Artık
    // gerçek services.home_service_type okunuyor, yoksa (eski satırlar için)
    // eski varsayılana düşülüyor.
    homeService: row.is_remote ? undefined : (row.home_service_type || "evde"),
    isBoosted: false, // fetchListings, aktif Öne Çıkarma Paketi'ne göre bunu güncelliyor
    // Değerlendirmeler bu vitrinle diğer vitrinler arasında birleşik mi
    // gösterilsin (varsayılan) yoksa sadece bu vitrine mi özel — vitrin
    // sahibinin kararı (bkz. VitrinMediaView, vitrin_media.sql).
    shareProfileReviews: row.share_profile_reviews ?? true,
  };
}

// Gerçek bir ilanı, MapView'ın stilize haritasında gösterebileceği bir "pin"e çevirir.
// Gerçek adres/ilçe koordinatımız yok, bu yüzden şehir merkezinin lat/lng'sini
// kullanıyoruz (haritadaki not zaten pin konumlarının stilize olduğunu söylüyor).
function mapServiceRowToPin(row, listing) {
  if (listing.mode !== "local") return null;
  const cityId = deriveCityIdFromLabel(row.city);
  const cityInfo = CITIES.find((c) => c.id === cityId);
  if (!cityInfo) return null;
  const seed = String(row.id).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return {
    id: `real-${row.id}`,
    name: listing.provider,
    category: listing.category,
    homeService: listing.homeService || "evde",
    city: cityId,
    district: (row.city || "").split(",")[0].trim(),
    lat: cityInfo.lat,
    lng: cityInfo.lng,
    x: 20 + (seed % 60),
    y: 20 + ((seed * 7) % 60),
    rating: listing.rating,
    price: listing.price,
    img: listing.img,
    listing,
  };
}

function formatRelativeTr(iso) {
  const diffMin = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (diffMin < 1) return "az önce";
  if (diffMin < 60) return `${diffMin} dakika önce`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} saat önce`;
  const diffD = Math.round(diffH / 24);
  return `${diffD} gün önce`;
}

// jobs satırını, JOB_POSTINGS'teki sabit iş ilanlarıyla aynı şekle çevirir
// ("Aranıyor" panosunda gerçek+demo ilanlar aynı kartla gösterilebilsin diye).
function mapJobRowToPosting(row) {
  const profile = row.profiles;
  const category = row.categories;
  const posterName = (profile?.business_name && profile.business_name.trim()) || profile?.full_name || "Bir kullanıcı";
  const budget =
    row.budget_min != null && row.budget_max != null
      ? `${Number(row.budget_min).toLocaleString("tr-TR")}–${Number(row.budget_max).toLocaleString("tr-TR")}₺`
      : row.budget_min != null
      ? `${Number(row.budget_min).toLocaleString("tr-TR")}₺'den`
      : row.budget_max != null
      ? `${Number(row.budget_max).toLocaleString("tr-TR")}₺'e kadar`
      : "Bütçe belirtilmemiş";
  return {
    id: row.id,
    dbId: row.id,
    isReal: true,
    category: category?.slug || "",
    categoryDbId: row.category_id,
    posterName,
    posterId: row.client_id,
    district: row.is_remote ? "Uzaktan" : (row.city || "Belirtilmemiş"),
    title: row.title,
    desc: row.description,
    schedule: "Detaylar ilanda",
    budget,
    // "Yenile" (bump) sonrası bumped_at güncellenir — "postedTime" onu
    // yansıtmalı, yoksa yenileme hiçbir şeyi değiştirmiş gibi görünmez.
    postedTime: formatRelativeTr(row.bumped_at || row.created_at),
    offerCount: 0, // gerçek teklif/bidding akışı henüz yok
  };
}

// Gerçek bir iş ilanını (client'ın ihtiyacı), MapView'da servis pin'lerinden
// ayırt edilebilecek bir "job pin"e çevirir — bkz. mapServiceRowToPin.
// job: mapJobRowToPosting'in çıktısı (district alanı yerinde işler için
// "semt, şehir" metnini, uzaktan işler için "Uzaktan" tutuyor).
function mapJobRowToPin(job) {
  if (job.district === "Uzaktan") return null;
  const cityId = deriveCityIdFromLabel(job.district);
  const cityInfo = CITIES.find((c) => c.id === cityId);
  if (!cityInfo) return null;
  const seed = String(job.dbId).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return {
    id: `job-${job.dbId}`,
    kind: "job",
    name: job.posterName,
    category: job.category,
    homeService: "evde",
    city: cityId,
    district: (job.district || "").split(",")[0].trim(),
    lat: cityInfo.lat,
    lng: cityInfo.lng,
    x: 20 + (seed % 60),
    y: 20 + ((seed * 7) % 60),
    rating: 0,
    price: job.budget,
    img: FALLBACK_LISTING_IMG,
    job,
  };
}

function formatMessageTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

// İlan/iş ilanı oluşturma ve mesaj gönderme gibi "eylemler" için ortak telefon
// doğrulama kilidi (Fiverr'ın yaptığı gibi — gezinme/görüntüleme serbest,
// sadece eylemler kilitli). SMS servisi henüz yapılandırılmadıysa (Netgsm
// anahtarları yoksa) kilit devreye girmiyor — yumuşak blok, anahtar eklenince
// otomatik sertleşir.
async function checkPhoneGate(userId) {
  if (!userId) return { ok: false, reason: "Giriş yapmış olmalısın." };
  try {
    const cfgRes = await fetch("/api/send-otp");
    const cfg = await cfgRes.json();
    if (!cfg.configured) return { ok: true };
  } catch {
    return { ok: true }; // SMS servisi kontrol edilemiyorsa engelleme
  }
  const { data: prof } = await supabase.from("profiles").select("phone_verified").eq("id", userId).maybeSingle();
  if (!prof?.phone_verified) {
    return { ok: false, reason: "Devam etmeden önce profilinden telefonunu doğrulaman gerekiyor." };
  }
  return { ok: true };
}

// Temel profil kilidi — telefon gibi yumuşak değil, doğrudan sert: fotoğrafsız
// ve şehirsiz, gerçek anlamda "ciddi" bir profil oluşturmadan biri ne mesaj
// atabilsin ne vitrin/iş ilanı verebilsin ("ciddi bir profil oluşturmadım,
// yapamasın" — kullanıcının kararı). Netgsm gibi dış bir servise bağlı değil,
// bu yüzden ertelenecek bir sebep yok — baştan itibaren gerçek bir kilit.
async function checkProfileGate(userId) {
  if (!userId) return { ok: false, reason: "Giriş yapmış olmalısın." };
  const { data: prof } = await supabase.from("profiles").select("avatar_url, city").eq("id", userId).maybeSingle();
  if (!prof?.avatar_url || !prof?.city) {
    return { ok: false, reason: "Devam etmeden önce profiline bir fotoğraf ve şehir eklemen gerekiyor." };
  }
  return { ok: true };
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

// Bildirim merkezi — schema (3).sql'de tam bir `notifications` tablosu ve
// trigger'lar hazır duruyordu ama hiç okunmuyordu (bkz. notifications_center.sql).
// E-posta bilerek yok — kullanıcının "sadece uygulama içi" kararı burada da geçerli.
function NotificationBell({ userId, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = async () => {
    if (!userId) return;
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", userId)
      .is("read_at", null);
    setUnreadCount(count || 0);
  };

  useEffect(() => {
    loadUnreadCount();
    if (!userId) return;
    // Gerçek zamanlı abonelik yok (projenin geri kalanı da yok — mesajlaşma
    // ekranı da yenilemede tazeleniyor) — hafif bir polling yeterli.
    const interval = setInterval(loadUnreadCount, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const togglePanel = async () => {
    const next = !open;
    setOpen(next);
    if (!next || !userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, body, read_at, related_job_id, related_service_id, created_at")
      .eq("profile_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    setItems(data || []);
    setLoading(false);
    const unreadIds = (data || []).filter((n) => !n.read_at).map((n) => n.id);
    if (unreadIds.length > 0) {
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", unreadIds);
      setUnreadCount(0);
    }
  };

  if (!userId) return null;

  return (
    <div className="relative">
      <button
        onClick={togglePanel}
        className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
        style={{ background: "#F7F7F8", color: "#0F1115" }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: "#EF4444" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-11 z-20 w-80 max-h-96 overflow-y-auto rounded-xl shadow-lg border"
            style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}
          >
            <div className="px-4 py-3 border-b sticky top-0" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
              <p className="text-sm font-bold" style={{ color: "#0F1115" }}>Bildirimler</p>
            </div>
            {loading ? (
              <div className="px-4 py-8 text-center"><Loader2 size={16} className="animate-spin mx-auto" style={{ color: "#9CA3AF" }} /></div>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs" style={{ color: "#9CA3AF" }}>Henüz bir bildirimin yok.</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setOpen(false); onNavigate?.(n); }}
                  className="w-full text-left px-4 py-3 border-b hover:bg-black/[0.03] transition-colors"
                  style={{ borderColor: "#F7F7F8", background: n.read_at ? "transparent" : "rgba(37,99,235,0.04)" }}
                >
                  <p className="text-xs font-bold mb-0.5" style={{ color: "#0F1115" }}>{n.title}</p>
                  <p className="text-xs leading-snug" style={{ color: "#6B7280" }}>{n.body}</p>
                  <p className="text-[10px] mt-1" style={{ color: "#9CA3AF" }}>{formatRelativeTr(n.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Header({ onNav, onSearch, pendingCount, session, onNotificationClick }) {
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  // KRİTİK MOBİL HATA (kullanıcı fark etti, canlıda doğrulandı): Planlar/
  // Haritada Gör/Hizmet Ekle/İlan Ver hepsi "hidden sm:flex" ile mobilde
  // gizleniyordu, ve sağdaki hamburger ikonunun hiçbir onClick'i yoktu —
  // tıklanınca hiçbir şey açılmıyordu. Yani telefonda bu 4 linke ulaşmanın
  // HİÇBİR yolu yoktu (gizli bir menüde bile değildi, gerçekten erişilemezdi).
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const emailPrefix = session?.user?.email ? session.user.email.split("@")[0] : "";
  const initials = emailPrefix ? emailPrefix.slice(0, 2).toUpperCase() : "?";
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
          {session?.user?.id && (
            <NotificationBell userId={session.user.id} onNavigate={onNotificationClick} />
          )}
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
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}
              >
                {initials}
                {pendingCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "#EF4444" }}
                  >
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-11 z-20 w-44 rounded-xl overflow-hidden shadow-lg border py-1"
                    style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}
                  >
                    <button
                      onClick={() => { setMenuOpen(false); onNav("profile"); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-black/5"
                      style={{ color: "#0F1115" }}
                    >
                      Profilim
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); onNav("favorites"); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-black/5"
                      style={{ color: "#0F1115" }}
                    >
                      Favorilerim
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); supabase.auth.signOut(); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-black/5"
                      style={{ color: "#9C4A3C" }}
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Session yok — ziyaretçi gezinmeye devam edebilir, giriş/kayıt
            // sadece bu butonla veya kilitli bir eyleme (mesaj/vitrin/ilan)
            // dokununca açılıyor (bkz. IsinnPrototype'taki handleNav).
            <button
              onClick={() => onNav("auth")}
              className="text-sm font-bold px-4 py-2 rounded-full text-white shrink-0"
              style={{ background: "#0F1115" }}
            >
              Giriş Yap
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#F7F7F8", color: "#1B2B24" }}
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-10 sm:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="sm:hidden relative z-20 border-t px-5 py-3 flex flex-col gap-1" style={{ borderColor: "#EAEAEA", background: "#FFFFFF" }}>
            <div className="flex items-center relative mb-2">
              <Search size={16} className="absolute left-3.5" style={{ color: "#9CA3AF" }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) { onSearch(q); setMobileMenuOpen(false); } }}
                placeholder="Hizmet veya iş ara... örn. çilingir"
                className="w-full pl-9 pr-3 py-2.5 rounded-full text-sm outline-none border-2"
                style={{ borderColor: "#F0F0F0", background: "#F7F7F8", color: "#0F1115" }}
              />
            </div>
            <button
              onClick={() => { setMobileMenuOpen(false); onNav("pricing"); }}
              className="flex items-center gap-2 text-sm font-semibold px-2 py-2.5 rounded-lg text-left"
              style={{ color: "#0F1115" }}
            >
              <Award size={16} /> Planlar
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNav("map"); }}
              className="flex items-center gap-2 text-sm font-semibold px-2 py-2.5 rounded-lg text-left"
              style={{ color: "#0F1115" }}
            >
              <MapIcon size={16} /> Haritada Gör
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNav("createListing"); }}
              className="flex items-center gap-2 text-sm font-bold px-2 py-2.5 rounded-lg text-left"
              style={{ color: "#2563EB" }}
            >
              <Sparkles size={16} /> Hizmet Ekle
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNav("post"); }}
              className="flex items-center gap-2 text-sm font-bold px-2 py-2.5 rounded-lg text-left"
              style={{ color: "#0F1115" }}
            >
              İlan Ver
            </button>
          </div>
        </>
      )}
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
// Her rengin canlı-koyu çift ucu — rozet gradyanı için (bkz. CategoryTile).
const CATEGORY_TILE_GRADIENTS = [
  ["#3B82F6", "#1D4ED8"], // mavi
  ["#2DD4BF", "#0F766E"], // turkuaz
  ["#FBBF24", "#B45309"], // amber
  ["#F87171", "#B91C1C"], // kırmızı
  ["#A78BFA", "#6D28D9"], // mor
  ["#F472B6", "#BE185D"], // pembe
  ["#60A5FA", "#1E40AF"], // gök mavisi
  ["#FB923C", "#C2410C"], // turuncu
];

// Kategori başına küçük, "sevimli" bir görsel — özel illüstrasyon yerine emoji
// (asset üretmeden en hızlı gerçek çözüm). Kullanıcının verdiği örnekler
// (yemek, tadilat) dahil hepsi kendi görseline sahip.
const CATEGORY_EMOJI = {
  temizlik: "🧹", nakliye: "🚚", tadilat: "🛠️", cilingir: "🔑", ogretmen: "📚",
  bakici: "👶", "hasta-bakici": "🩺", hemsire: "💉", fizyoterapist: "🦴",
  "yoga-koc": "🧘", "spor-egitmeni": "🏋️", tirnakci: "💅", makyaj: "💄",
  bakim: "🧴", terzi: "🧵", yemek: "🍲", muhendis: "👷", tasarim: "🎨",
  yazilim: "💻", "sosyal-medya": "📱", dijital: "📈", diyetisyen: "🥗",
  psikolog: "🧠", "logusa-bakicisi": "🤱", "emzirme-danismani": "🍼",
  elektrikci: "💡", "su-tesisatcisi": "🚰", "hali-yikama": "🧽",
  "etkinlik-organizatoru": "🎉", "bahce-bakim": "🌱", "profesyonel-fotograf": "📸",
  "boya-badana": "🪣", "klima-beyaz-esya": "❄️", "kuafor-berber": "💇",
  "evcil-hayvan": "🐾", "muzik-egitmeni": "🎵", muhasebe: "🧮", ceviri: "🌐",
  "icerik-yazarligi": "✍️", "video-duzenleme": "🎬", seslendirme: "🎙️", "sanal-asistan": "🗂️",
};

// Sayfanın en altındaki "Aradığını bulamadın mı?" kategori kartları. Üç deneme
// oldu: önce koyu yeşil kart ("renkleri sevmedim"), sonra kartın tamamını
// kaplayan doygun gradyan ("alt kısmı yine sevmedim, mini sevimli görseller
// olsun") — bu üçüncüsü: sade beyaz kart + yumuşak pastel bir rozet içinde
// kategoriye özel emoji, aşırı renk değil zarif bir vurgu ("daha zevli, daha
// stil sahibi" isteği). Rozet gradyanı hâlâ canlı ama küçük bir alanda,
// kartın geneli site genelindeki temiz beyaz dille uyumlu kalıyor.
function CategoryTile({ c, i, onClick }) {
  const [from, to] = CATEGORY_TILE_GRADIENTS[i % CATEGORY_TILE_GRADIENTS.length];
  const emoji = CATEGORY_EMOJI[c.id] || "✨";
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-3 p-4 pt-5 rounded-2xl text-center hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg"
      style={{ background: "#FFFFFF", border: "1px solid #EFEDE7" }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
        style={{ background: `linear-gradient(150deg, ${from}26 0%, ${to}26 100%)` }}
      >
        <span style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.08))" }}>{emoji}</span>
      </div>
      <span className="text-xs font-semibold leading-snug" style={{ color: "#0F1115" }}>
        {c.name}
      </span>
    </button>
  );
}

const FEATURED_PROFILE_CARDS = [
  { listingId: 11, bg: "#1F3A2E", specialties: ["0-6 Yaş Bakım", "İlk Yardım Sertifikalı", "Ev İçi Destek"] },
  { listingId: 19, bg: "#3D2B1F", specialties: ["Saç Kesimi & Boya", "Kaş Tasarımı", "Çocuklu Aileler İçin Uygun"] },
  { listingId: 25, bg: "#C9A9A0", specialties: ["Sigorta Arızası", "Priz & Anahtar", "Güvenlik Kontrolü"] },
  { listingId: 21, bg: "#1B3B3A", specialties: ["Doğum Sonrası Beslenme", "Emzirme Dönemi Diyeti", "Çocuk Beslenmesi"] },
];

function HomeView({ onSelectListing, onNav, filter, setFilter, onSearch, onApplyJob, onOpenJob, realListings, listingsLoading, realJobs, favoriteIds, onToggleFavorite, onToggleJobFavorite, platformStats }) {
  const [heroQ, setHeroQ] = useState("");
  const [heroCity, setHeroCity] = useState("");
  // Rakip site kıyaslamasında fark edildi: tek kutuya "istanbul temizlik"
  // yazmak aslında hiç işe yaramıyordu (bkz. SearchResultsView'daki haystack
  // sırası notu) — "ne" ve "nerede" ayrı alanlara bölündü, İşin Olsun'daki
  // gibi. Hızlı şehir çipleri de aynı gerekçeyle eklendi (yazmadan tıkla-ara).
  const QUICK_CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Kocaeli"];
  const [wordIndex, setWordIndex] = useState(0);
  // Önceden gizliydi, tıklayan açardı — kullanıcı "uzaktan hizmetler
  // kısmını da görünür yap" dedi, artık varsayılan açık (istenirse
  // gizlenebiliyor, aşağıdaki toggle hâlâ duruyor).
  const [showRemote, setShowRemote] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const allListings = [...(realListings || []), ...LISTINGS];
  // Gerçek ilanlar da en az bir değerlendirmeyle 4.5+ puana ulaşınca "Öne Çıkan"a
  // girebiliyor — sabit demo listesine hapsolmuyor, gerçekten hak ederek çıkıyor.
  // "Öne Çıkan" şeridi sınırlı kapasiteli (FEATURED_SLOT_CAP) — uygun havuz
  // (boost'lu VEYA gerçekten 4.5+ puanlı) kapasiteden büyükse günlük adil
  // rotasyonla paylaşılır, yoksa her zaman aynı birkaç kişi kalıcı olarak
  // üstte kalır ve geri kalanların Öne Çıkarma parası boşa gider (bkz.
  // computeVisibilityScore/seededDailyShuffle üstündeki not).
  const FEATURED_SLOT_CAP = 8;
  const featuredEligible = (realListings || []).filter((l) => l.isBoosted || (l.reviewCount > 0 && l.rating >= 4.5));
  const realFeatured = seededDailyShuffle(featuredEligible).slice(0, FEATURED_SLOT_CAP);
  const featured = [...realFeatured, ...LISTINGS.filter((l) => l.level === "top-rated")];
  const filtered = (
    filter === "all" ? allListings :
    filter === "home" ? allListings.filter((l) => l.mode === "local" && (l.homeService === "evde" || l.homeService === "esnek")) :
    allListings.filter((l) => l.mode === filter)
  ).slice().sort((a, b) => computeVisibilityScore(b) - computeVisibilityScore(a));

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
        <div className="max-w-6xl mx-auto relative lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="relative">
          {/* leading-[0.98], sonra 1.05 — ikisi de "ç"/"y" gibi alt uzantılı
              (descender) harfleri kırpmaya devam etti (kullanıcı ekran
              görüntüsüyle doğruladı). Asıl sebep muhtemelen bg-clip-text +
              inline-block birleşimi — bu ikili, satır kutusunu (line-height)
              normalden daha sıkı yorumluyor ve gradyanla "boyanan" metnin alt
              kısmını kesebiliyor. leading'i iyice gevşettik (1.15) VE
              kırpılan tam da o gradyanlı span olduğu için ona ayrıca
              pb-1.5 (alt boşluk) verdik. */}
          <h1 className="font-sans text-5xl md:text-7xl font-black leading-[1.15] max-w-3xl tracking-tight" style={{ color: "#FFFFFF" }}>
            İhtiyacın olan şeyi<br />
            <span className="inline-block relative">
              <span
                key={wordIndex}
                className="inline-block pb-1.5 animate-[fadeSlide_0.4s_ease] bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #2563EB, #60A5FA)" }}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </span>{" "}
            anlat!
          </h1>
          <style>{`@keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <p className="mt-8 max-w-md text-base" style={{ color: "#B8BCC4" }}>
            En yakınındaki ustadan güvenilir bakıcıya, uzaktaki yazılımcıdan, salondaki tırnakçıya — ihtiyacın olan herkes burada.
          </p>
          <div className="mt-9 flex items-center gap-1 max-w-lg bg-white rounded-full p-1.5 pl-4 shadow-2xl">
            <Search size={16} style={{ color: "#9CA3AF" }} />
            <input
              value={heroQ}
              onChange={(e) => setHeroQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (heroQ.trim() || heroCity)) onSearch(heroQ, heroCity); }}
              placeholder="Örn. çilingir, mutfak tadilatı..."
              className="flex-1 min-w-0 text-sm outline-none py-1.5"
              style={{ color: "#0F1115" }}
            />
            <div className="w-px h-5 shrink-0" style={{ background: "#E5E7EB" }} />
            <MapPin size={14} className="shrink-0" style={{ color: "#9CA3AF" }} />
            <select
              value={heroCity}
              onChange={(e) => setHeroCity(e.target.value)}
              className="text-sm outline-none py-1.5 max-w-[92px] shrink-0 bg-transparent"
              style={{ color: heroCity ? "#0F1115" : "#9CA3AF" }}
            >
              <option value="">Nerede?</option>
              {CITIES.filter((c) => c.country === "Türkiye").map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button
              onClick={() => (heroQ.trim() || heroCity) && onSearch(heroQ, heroCity)}
              className="text-sm font-bold px-6 py-3 rounded-full text-white hover:scale-105 transition-transform shrink-0"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
            >
              Ara
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {QUICK_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => onSearch("", c)}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                style={{ background: "rgba(255,255,255,0.08)", color: "#B8BCC4" }}
              >
                {c}
              </button>
            ))}
          </div>
          {/* Küçük platform istatistikleri ("1 Sağlayıcı, 1 Tamamlanan iş...")
              kullanıcıya amaçsız/zayıf geldi (platform henüz küçükken sayılar
              güven vermek yerine tam tersi izlenim veriyordu) — yerine kısa
              bir slogan koyduk. */}
          <p className="mt-8 flex items-center gap-2 text-sm font-bold tracking-wide">
            <Sparkles size={14} style={{ color: "#F59E0B" }} />
            <span style={{ color: "#FFFFFF" }}>İşin gücün</span>
            <span style={{ color: "#9CA3AF" }}>burada!</span>
          </p>
        </div>

        {/* Hero'nun sağ tarafı (metnin simetriği) boş kalıyordu — gerçek
            veriden beslenen, yüzen kartlar ekledik. Öne Çıkan kart bilerek en
            üstte/en belirgin: hem gerçek bir vitrini sergiliyor hem Öne
            Çıkarma Paketi'nin "böyle görüneceksin" vaadini dolaylı yoldan
            gösteriyor (kullanıcının isteği — "öne çıkanlar için heveslendirici dursun"). */}
        {featured.length > 0 && (
          // max-w-sm — ilk halinin genişliği. max-w-lg'ye çıkarınca sol
          // taraftaki başlık daralıp 4 satıra düşüyordu (kullanıcı fark etti,
          // "yazı yine ilk hali ile kalsın" dedi) — o yüzden sağ tarafı bu
          // genişliğe göre küçülttük, geniş bırakmadık.
          <div className="hidden lg:block relative w-full max-w-sm shrink-0">
            {/* Fiverr'ın "AI Director" hero'sundaki fanlanmış kart destesi
                stilinde — ama bizde her kart gerçek bir vitrin (sabit
                illüstrasyon değil), kullanıcının verdiği referansa göre.
                Deste, featuredIndex'in ilerlediği her an (aşağıdaki
                useEffect, 4.5sn'de bir) bambaşka bir 3'lüye "kayıyor".
                Önce 5 kart vardı — kullanıcıya kalabalık/dağınık geldi ve
                ortadaki "öne çıkan" belli olmuyordu; 3'e indirip ortadakine
                amber bir çerçeve/glow verdik, yanlardakileri de koyu bir
                örtüyle geri plana ittik. */}
            <style>{`
              @keyframes cardPop { from { opacity: 0; transform: scale(0.85) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
            <div className="flex items-end justify-center" style={{ paddingTop: "24px" }}>
              {Array.from({ length: Math.min(3, featured.length) }, (_, k) => featured[(featuredIndex + k) % featured.length]).map((l, i, arr) => {
                const mid = (arr.length - 1) / 2;
                const offset = i - mid; // -1..0..1
                const isCenter = Math.abs(offset) < 0.5;
                const rotation = offset * 9;
                return (
                  // Dıştaki div sadece SABİT rotasyonu taşıyor (asla animasyonlu
                  // değil) — pop-in animasyonu (opacity+scale+translateY) içteki
                  // butonda ayrı bir katmanda. İkisini aynı transform'da
                  // birleştirip bir CSS custom property (--rot) ile keyframe'e
                  // geçirmeye çalışmıştık — kartlar opacity:0'da hiç ilerlemeden
                  // kalıyordu, canlı DOM'dan doğrulandı. Katmanları ayırmak
                  // sorunu kökten çözüyor.
                  <div
                    key={`${featuredIndex}-${l.id}`}
                    className="shrink-0"
                    style={{
                      width: isCenter ? "156px" : "100px",
                      height: isCenter ? "234px" : "150px",
                      transform: `rotate(${rotation}deg)`,
                      marginLeft: i === 0 ? 0 : "-20px",
                      zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                    }}
                  >
                    <button
                      onClick={() => onSelectListing(l)}
                      // NOT: animasyonu inline style.animation yerine Tailwind'in
                      // statik animate-[...] class'ıyla veriyoruz — dosyada aynı
                      // ihtiyaç için zaten kanıtlanmış çalışan tek örnek buydu
                      // (yukarıdaki dönen kelime, satır ~1692). İlk denemede
                      // inline style.animation kullanmıştık ve kartlar canlı
                      // DOM'da doğrulandığı üzere opacity:0'da donup kalıyordu —
                      // muhtemelen her re-render'da (wordIndex her ~1.8sn'de bir
                      // tetikliyor) aynı string yeniden style'a yazılınca
                      // animasyon baştan sarıyordu. Statik class re-render'lar
                      // arasında değişmediği için bu sorunu yaşamıyor.
                      className={`relative w-full h-full rounded-2xl overflow-hidden hover:z-20 hover:-translate-y-3 hover:scale-105 transition-transform block animate-[cardPop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both] ${isCenter ? "shadow-[0_0_0_3px_#F59E0B,0_20px_45px_rgba(0,0,0,0.55)]" : "shadow-xl"}`}
                      style={{
                        border: isCenter ? "2px solid rgba(255,255,255,0.9)" : "2px solid rgba(255,255,255,0.12)",
                        animationDelay: `${i * 70}ms`,
                      }}
                    >
                      <img src={l.img} alt="" className="w-full h-full object-cover" style={isCenter ? {} : { filter: "brightness(0.55) saturate(0.85)" }} />
                      <div className="absolute inset-x-0 bottom-0 p-2 pt-7" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.88) 100%)" }}>
                        <p className={`font-bold text-white truncate ${isCenter ? "text-xs" : "text-[10px]"}`}>{l.provider}</p>
                      </div>
                      {isCenter && (
                        <span
                          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1"
                          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
                        >
                          <Sparkles size={9} /> Öne Çıkan
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Eskiden burada "Sen de Öne Çıkarma Paketi ile burada görün" gibi
                doğrudan bir satış mesajı vardı — ilk saniyede, güven inşa
                etmeden önce ziyaretçiye "burası bir şeyler satmaya çalışıyor"
                izlenimi veriyordu (rakip site kıyaslamasında fark edildi).
                Hero'da güven, satış sayfada (Planlar) yapılmalı. */}
            <p className="text-[11px] mt-4 text-center" style={{ color: "#6B7280" }}>
              Şu an platformda gerçek, aktif vitrinler.
            </p>
          </div>
        )}
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

      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 mt-8">
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
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <h2 className="font-sans text-3xl font-black" style={{ color: "#0F1115" }}>Vitrinler</h2>
            <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Şu an aktif, gerçek zamanlı vitrinler — filtrele, keşfet, doğrudan ulaş</p>
          </div>
          {!listingsLoading && filtered.length > 0 && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#EFF6FF", color: "#2563EB" }}>
              {filtered.length} vitrin
            </span>
          )}
        </div>
        {listingsLoading ? (
          <div className="flex items-center gap-2 py-16 justify-center">
            <Loader2 size={16} className="animate-spin" style={{ color: "#9CA3AF" }} />
            <span className="text-sm" style={{ color: "#9CA3AF" }}>Vitrinler yükleniyor...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ border: "1px solid #F0F0F0", background: "#FAFAFA" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>Bu filtreyle eşleşen bir vitrin bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((l) => (
              <div
                key={l.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectListing(l)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectListing(l); }}
                className="text-left rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all group shadow-sm hover:shadow-xl cursor-pointer"
                style={{ border: "1px solid #F0F0F0", background: "#FFFFFF" }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={l.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <ModeTag mode={l.mode} />
                    {l.isBoosted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-0.5" style={{ background: "#F59E0B" }}><Sparkles size={9} />Öne Çıkan</span>
                    )}
                    {l.isReal && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#2FBF71" }}>Yeni</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(l); }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart size={13} style={{ color: "#EF4444" }} fill={favoriteIds?.has(l.dbId) ? "#EF4444" : "none"} />
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shrink-0" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
                      {l.provider.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: "rgba(15,17,21,0.75)", color: "#FFFFFF" }}>{l.price}</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-bold leading-snug line-clamp-2 min-h-[2.5em]" style={{ color: "#0F1115" }}>{l.title}</p>
                  <p className="text-xs mt-1 truncate" style={{ color: "#9CA3AF" }}>{l.provider} · {l.city}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Stars value={l.rating} size={12} />
                    <span className="text-xs" style={{ color: "#6B7280" }}>{l.reviewCount > 0 ? `(${l.reviewCount})` : "Yeni vitrin"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <div className="relative -mx-5">
          {/* Kartlar yatay kaydırmayla görülüyor ama bunu belirten hiçbir
              görsel ipucu yoktu — sağdaki kart yarım kesik göründüğü için
              "daha fazlası var, kaydır" değil "bozuk/eksik" gibi algılanıyordu
              (kullanıcı geri bildirimi: "sağdakiler görünmüyor"). Sağ kenara
              kaydırılabilir olduğunu gösteren ince bir gradient ekliyoruz. */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 z-10 sm:hidden"
            style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)" }}
          />
          <div className="flex gap-4 overflow-x-auto pb-2 px-5" style={{ scrollbarWidth: "thin" }}>
          {[...(realJobs || []), ...JOB_POSTINGS].map((job, jobIdx) => {
            const cat = CATEGORIES.find((c) => c.id === job.category);
            const Icon = cat?.icon;
            const catIndex = CATEGORIES.findIndex((c) => c.id === job.category);
            const tileColor = CATEGORY_TILE_COLORS[(catIndex >= 0 ? catIndex : jobIdx) % CATEGORY_TILE_COLORS.length];
            return (
              <div
                key={job.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenJob(job)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpenJob(job); }}
                className="text-left rounded-2xl overflow-hidden shrink-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                style={{ border: "1px solid #F0F0F0", background: "#FFFFFF", width: "270px" }}
              >
                <div className="h-16 flex items-center justify-between px-4" style={{ background: `${tileColor}17` }}>
                  <div className="flex items-center gap-2 min-w-0">
                    {Icon && (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: tileColor }}>
                        <Icon size={16} className="text-white" />
                      </div>
                    )}
                    <span className="text-[11px] font-bold truncate" style={{ color: tileColor }}>{cat?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {job.isReal && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#2FBF71" }}>Yeni</span>
                    )}
                    {job.isReal && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleJobFavorite?.(job); }}
                        className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Heart size={12} style={{ color: "#EF4444" }} fill={favoriteIds?.has(job.dbId) ? "#EF4444" : "none"} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[11px] mb-1.5" style={{ color: "#9CA3AF" }}>{job.postedTime}</p>
                  <p className="text-sm font-bold leading-snug mb-2 line-clamp-2 min-h-[2.5em]" style={{ color: "#0F1115" }}>{job.title}</p>
                  <p className="text-xs mb-0.5 flex items-center gap-1" style={{ color: "#6B7280" }}><MapPin size={11} />{job.district}</p>
                  <p className="text-xs mb-3 flex items-center gap-1" style={{ color: "#6B7280" }}><Clock size={11} />{job.schedule}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-black" style={{ color: "#F59E0B" }}>{job.budget}</span>
                    <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>{job.offerCount} teklif var</span>
                  </div>
                  <span
                    onClick={(e) => { e.stopPropagation(); onApplyJob(job); }}
                    className="w-full py-2 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
                  >
                    Teklif Ver
                  </span>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 mt-12">
        <h2 className="font-sans text-2xl font-black mb-1" style={{ color: "#0F1115" }}>Öne çıkan profiller</h2>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>Doğrulanmış sağlayıcıların gerçek uzmanlıkları</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            // Gerçek değerlendirme almış sağlayıcılar, sabit demo kartlardan
            // önce gösteriliyor — burada yer almak sabit bir listeye değil,
            // gerçekten kazanılan puana bağlı.
            ...(realListings || [])
              .filter((l) => l.reviewCount > 0)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((l) => ({ listing: l, specialties: [l.desc ? (l.desc.length > 42 ? `${l.desc.slice(0, 42)}…` : l.desc) : ""], bg: "#1F2937" })),
            ...FEATURED_PROFILE_CARDS.map((card) => {
              const l = LISTINGS.find((x) => x.id === card.listingId);
              return l ? { listing: l, specialties: card.specialties, bg: card.bg } : null;
            }).filter(Boolean),
          ].slice(0, 4).map((item) => {
            const l = item.listing;
            return (
              <div
                key={l.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectListing(l)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectListing(l); }}
                className="text-left rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all group shadow-sm hover:shadow-xl cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden" style={{ background: item.bg }}>
                  <img src={l.img} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-300" />
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(l); }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart size={13} style={{ color: "#EF4444" }} fill={favoriteIds?.has(l.dbId) ? "#EF4444" : "none"} />
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
                    {item.specialties.map((s, si) => (
                      <p key={si} className="text-xs line-clamp-2" style={{ color: "#6B7280" }}>{s}</p>
                    ))}
                  </div>
                  <span className="text-xs font-black inline-block mt-2" style={{ color: "#F59E0B" }}>{l.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sayfanın en altına bilerek taşındı — akışta (Öne Çıkan/Vitrinler/
          Aranıyor) aradığını bulamayan biri için son bir "ilham ver" katmanı,
          önden dayatılan bir kategori seçimi değil (kullanıcının kararı). */}
      <section className="max-w-6xl mx-auto px-5 mt-12 pb-16 space-y-9">
        <div>
          <h2 className="font-sans text-2xl font-black mb-1" style={{ color: "#0F1115" }}>Aradığını bulamadın mı? 👀</h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>Kategorilere göz at, bir fikir versin</p>
        </div>
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
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {groupCategories.map((c, i) => (
                  <CategoryTile key={c.id} c={c} i={i} onClick={() => (c.id === "tirnakci" ? onNav("nailart") : onSearch(c.name))} />
                ))}
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
                  <button
                    onClick={() => setShowRemote(false)}
                    className="text-[11px] font-bold ml-auto"
                    style={{ color: "#9CA3AF" }}
                  >
                    Gizle
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {groupCategories.map((c, i) => (
                    <CategoryTile key={c.id} c={c} i={i} onClick={() => onSearch(c.name)} />
                  ))}
                </div>
              </div>
            );
          })()
        )}
      </section>

      <SiteFooter onNav={onNav} />
    </div>
  );
}

// Sitede hiç footer yoktu — sözleşmelere (KVKK/Gizlilik/Kullanım Şartları,
// zaten app/ altında sayfaları var ama hiçbir yerden linklenmiyorlardı,
// sadece kayıt formundaki onay kutusundan erişilebiliyordu) ve iletişime
// ulaşmanın tek yolu yoktu. Hero'daki koyu tonla bookend oluşturması için
// aynı palet (bkz. HomeView'ın en üstündeki radial-gradient).
function SiteFooter({ onNav }) {
  return (
    <footer className="px-5 pt-14 pb-8" style={{ background: "#0F1115" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10">
          <div>
            <p className="font-sans text-xl font-black" style={{ color: "#FFFFFF" }}>
              İşinn<span style={{ color: "#2563EB" }}>.</span>
            </p>
            <p className="text-xs mt-3 leading-relaxed max-w-[220px]" style={{ color: "#7A7F8A" }}>
              İhtiyacın olan hizmeti bulduğun ya da kendi hizmetini sunduğun güvenilir yerel pazar yeri.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide mb-3" style={{ color: "#FFFFFF" }}>Keşfet</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => onNav("map")} className="text-xs text-left" style={{ color: "#9CA3AF" }}>Haritada Gör</button>
              <button onClick={() => onNav("createListing")} className="text-xs text-left" style={{ color: "#9CA3AF" }}>Hizmet Ekle</button>
              <button onClick={() => onNav("post")} className="text-xs text-left" style={{ color: "#9CA3AF" }}>İlan Ver</button>
              <button onClick={() => onNav("pricing")} className="text-xs text-left" style={{ color: "#9CA3AF" }}>Planlar</button>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide mb-3" style={{ color: "#FFFFFF" }}>Sözleşmeler</p>
            <div className="flex flex-col gap-2.5">
              <a href="/kvkk-aydinlatma-metni" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#9CA3AF" }}>KVKK Aydınlatma Metni</a>
              <a href="/gizlilik-politikasi" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#9CA3AF" }}>Gizlilik Politikası</a>
              <a href="/kullanim-sartlari" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#9CA3AF" }}>Kullanım Şartları</a>
              <a href="/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#9CA3AF" }}>Mesafeli Satış Sözleşmesi</a>
              <a href="/iptal-iade-kosullari" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#9CA3AF" }}>İptal, İade ve Geri Ödeme</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide mb-3" style={{ color: "#FFFFFF" }}>İletişim</p>
            <div className="flex flex-col gap-2.5">
              <a href="mailto:esra.gunes@codegtechnology.com" className="text-xs" style={{ color: "#9CA3AF" }}>esra.gunes@codegtechnology.com</a>
              <a href="tel:+905364603682" className="text-xs" style={{ color: "#9CA3AF" }}>0536 460 36 82</a>
              <button onClick={() => onNav("support")} className="text-xs text-left" style={{ color: "#9CA3AF" }}>Destek Talebi Oluştur</button>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-[11px]" style={{ color: "#5C6070" }}>
            © {new Date().getFullYear()} Code G Teknoloji ve Ticaret Limited Şirketi — Şişli, İstanbul. Tüm hakları saklıdır.
          </p>
          <p className="text-[11px]" style={{ color: "#5C6070" }}>İşinn bir aracı pazaryeridir; hizmetin tarafı değildir.</p>
        </div>
      </div>
    </footer>
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

function ReviewCard({ review, onOpenMedia, isReal, currentUserId, providerId }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);
  const [votePending, setVotePending] = useState(false);
  // Değerlendirmeye herkese açık yanıt — sağlayıcı kendi vitrinine bırakılan
  // bir yoruma tek bir yanıt yazabilir (bkz. growth_features_batch.sql).
  const isOwner = isReal && currentUserId && currentUserId === providerId;
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [providerReply, setProviderReply] = useState(review.providerReply || "");
  const submitReply = async () => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    const { error } = await supabase
      .from("ratings")
      .update({ provider_reply: replyText.trim(), provider_reply_at: new Date().toISOString() })
      .eq("id", review.id);
    setReplySubmitting(false);
    if (!error) { setProviderReply(replyText.trim()); setShowReplyForm(false); }
  };

  // Gerçek yorumlarda "Faydalı buldum" eskiden tamamen sahteydi — tıklayınca
  // sadece local state artıyordu, hiçbir yere kaydedilmiyordu, yenilemede
  // sıfırlanıyordu (favoriler'deki aynı hatanın bir başka örneği). review_
  // helpful_votes tablosu + ratings.helpful_count'u senkron tutan trigger
  // zaten şemada hazırdı, hiç kullanılmıyordu.
  useEffect(() => {
    if (!isReal || !currentUserId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("review_helpful_votes")
        .select("id")
        .eq("rating_id", review.id)
        .eq("profile_id", currentUserId)
        .maybeSingle();
      if (!cancelled) setVoted(!!data);
    })();
    return () => { cancelled = true; };
  }, [isReal, currentUserId, review.id]);

  const toggleHelpful = async () => {
    if (!isReal || !currentUserId || votePending) return;
    setVotePending(true);
    if (voted) {
      const { error } = await supabase.from("review_helpful_votes").delete().eq("rating_id", review.id).eq("profile_id", currentUserId);
      setVotePending(false);
      if (!error) { setVoted(false); setHelpful((h) => Math.max(0, h - 1)); }
    } else {
      const { error } = await supabase.from("review_helpful_votes").insert({ rating_id: review.id, profile_id: currentUserId });
      setVotePending(false);
      if (!error) { setVoted(true); setHelpful((h) => h + 1); }
    }
  };

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
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={isReal ? toggleHelpful : () => { if (!voted) { setHelpful(helpful + 1); setVoted(true); } }}
          disabled={votePending}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
          style={{ borderColor: voted ? "#C2872B" : "#D9D0BA", color: voted ? "#C2872B" : "#5C5744", opacity: votePending ? 0.6 : 1 }}
        >
          <ThumbsUp size={12} />
          Faydalı buldum · {helpful}
        </button>
        {isOwner && !providerReply && !showReplyForm && (
          <button onClick={() => setShowReplyForm(true)} className="text-xs font-bold" style={{ color: "#2563EB" }}>
            Yanıtla
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-2.5 pl-3 border-l-2" style={{ borderColor: "#D9D0BA" }}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder="Bu değerlendirmeye herkese açık bir yanıt yaz..."
            className="w-full px-3 py-2 rounded-lg border text-xs outline-none resize-none mb-1.5"
            style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={submitReply}
              disabled={replySubmitting || !replyText.trim()}
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: "#2563EB", opacity: replySubmitting ? 0.7 : 1 }}
            >
              {replySubmitting ? "Gönderiliyor..." : providerReply ? "Yanıtı Güncelle" : "Yanıtı Yayınla"}
            </button>
            <button onClick={() => { setShowReplyForm(false); setReplyText(providerReply); }} className="text-xs font-medium" style={{ color: "#8A8368" }}>Vazgeç</button>
          </div>
        </div>
      )}

      {providerReply && !showReplyForm && (
        <div className="mt-2.5 pl-3 py-2 border-l-2 rounded-r-lg" style={{ borderColor: "#3F7D5C", background: "#F8F4E9" }}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold mb-0.5" style={{ color: "#3F7D5C" }}>Sağlayıcının yanıtı</p>
            {/* Düzenleme hakkı — eskiden bir kere yazılan yanıt kalıcıydı,
                düzeltme/güncelleme yolu yoktu (kullanıcının kararı: olmalı). */}
            {isOwner && (
              <button
                onClick={() => { setReplyText(providerReply); setShowReplyForm(true); }}
                className="text-[11px] font-bold shrink-0"
                style={{ color: "#2563EB" }}
              >
                Düzenle
              </button>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#3D3B30" }}>{providerReply}</p>
        </div>
      )}
    </div>
  );
}

function ListingDetail({ listing, onBack, onContact, userReviews, onAddReview, onSubmitPendingMedia, onSubmitStaffReview, currentUserId, favoriteIds, onToggleFavorite }) {
  const isRealListing = !!(listing.isReal && listing.providerId);
  const [lightbox, setLightbox] = useState(null); // { media, index }
  const isFavorited = !!favoriteIds?.has(listing.dbId);

  // "İlanı Bildir" — sahibinden.com'un ilanın kendisini (kişiyi değil)
  // bildirebilme özelliğinden — bkz. supabase/sahibinden_features.sql.
  const canReportListing = isRealListing && currentUserId && currentUserId !== listing.providerId;
  const [showListingReportForm, setShowListingReportForm] = useState(false);
  const [listingReportReason, setListingReportReason] = useState("yanlis_kategori");
  const [listingReportDetail, setListingReportDetail] = useState("");
  const [listingReportSubmitting, setListingReportSubmitting] = useState(false);
  const [listingReportSubmitted, setListingReportSubmitted] = useState(false);
  const [listingReportError, setListingReportError] = useState("");
  const submitListingReport = async () => {
    setListingReportSubmitting(true);
    setListingReportError("");
    const { error } = await supabase.from("listing_reports").insert({
      reporter_id: currentUserId, service_id: listing.dbId, reason: listingReportReason, detail: listingReportDetail.trim() || null,
    });
    setListingReportSubmitting(false);
    if (error) { setListingReportError(`Bildirilemedi: ${error.message}`); return; }
    setListingReportSubmitted(true);
  };

  const [showReviewForm, setShowReviewForm] = useState(false);
  // Değerlendirme yazabilmek için gerçek bir "eşleşme" şartı: aranan kişiyle
  // bu vitrin için gerçekten iletişime geçmiş olman VE sağlayıcının en az bir
  // kez yanıt vermiş olması gerekiyor — yoksa herkes herkesi hiç tanışmadan
  // değerlendirebilirdi (kullanıcının fark ettiği gerçek bir boşluktu).
  const [reviewEligibility, setReviewEligibility] = useState(null); // { checking, ok, reason, jobId }
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

  // Gerçek bir ilan için sağlayıcının vitrin bilgilerini (tanıtım videosu +
  // portföy galerisi) çekiyoruz — Instagram profili gibi sergileme burada,
  // müşterinin gerçekten göreceği yerde olmalı, sadece kendi profilinde değil.
  // Not: sertifika/CV RLS ile sahibinden başkasına kapalı (kişisel bilgi
  // içerebiliyor), o yüzden burada gösterilmiyor — sadece profil sahibi görür.
  const [providerShowcase, setProviderShowcase] = useState(null); // { video_intro_url, video_intro_name }
  const [providerPortfolio, setProviderPortfolio] = useState([]);
  const [showcaseLightbox, setShowcaseLightbox] = useState(null); // { media, index }

  useEffect(() => {
    if (!listing.isReal || !listing.dbId) return;
    let cancelled = false;
    (async () => {
      const [{ data: serviceData }, { data: portfolioData }] = await Promise.all([
        supabase.from("services").select("video_intro_url, video_intro_name").eq("id", listing.dbId).maybeSingle(),
        supabase.from("portfolio_items").select("id, media_type, url, file_name").eq("service_id", listing.dbId).order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;
      setProviderShowcase(serviceData || null);
      setProviderPortfolio(portfolioData || []);
    })();
    return () => { cancelled = true; };
  }, [listing.isReal, listing.dbId]);

  // Gerçek ilanlar için değerlendirmeler gerçekten ratings tablosundan geliyor
  // (sahte REVIEWS demo dizisiyle karıştırılmıyor — bir müşteri gerçek bir
  // ilanda alakasız sahte yorumlar görmemeli). Vitrin sahibi "Birleştir" derse
  // (varsayılan) ratings.rated_profile_id üzerinden kişiye bağlı TÜM
  // değerlendirmeler gösterilir; "Ayrı tut" derse sadece bu vitrine
  // (ratings.service_id) bırakılanlar sayılır (bkz. VitrinMediaView, vitrin_media.sql).
  const [realReviews, setRealReviews] = useState([]);
  const [reviewError, setReviewError] = useState("");
  const [shareProfileReviews, setShareProfileReviews] = useState(true);

  const loadRealReviews = async () => {
    if (!isRealListing) return;
    const { data: serviceRow } = await supabase.from("services").select("share_profile_reviews").eq("id", listing.dbId).maybeSingle();
    const shared = serviceRow?.share_profile_reviews ?? true;
    setShareProfileReviews(shared);
    let ratingsQuery = supabase.from("ratings").select("*").order("created_at", { ascending: false });
    ratingsQuery = shared ? ratingsQuery.eq("rated_profile_id", listing.providerId) : ratingsQuery.eq("service_id", listing.dbId);
    const { data: ratingsData } = await ratingsQuery;
    const rows = ratingsData || [];
    const raterIds = [...new Set(rows.map((r) => r.rater_id))];
    let profilesById = {};
    if (raterIds.length > 0) {
      const { data: profilesData } = await supabase.from("profiles").select("id, full_name, business_name").in("id", raterIds);
      (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
    }
    // review_media'nın RLS'i zaten "not_required/approved herkese, pending/
    // rejected sadece yorumu yapan veya değerlendirilen sağlayıcıya" kuralını
    // uyguluyor — burada ek filtre gerekmiyor, RLS'e güveniyoruz (aynı
    // provider_documents'taki gibi: sadece görebildiğin satırlar dönüyor).
    const ratingIds = rows.map((r) => r.id);
    let mediaByRating = {};
    if (ratingIds.length > 0) {
      const { data: mediaData } = await supabase
        .from("review_media")
        .select("id, rating_id, media_type, url, approval_status")
        .in("rating_id", ratingIds)
        .order("sort_order", { ascending: true });
      (mediaData || []).forEach((m) => { (mediaByRating[m.rating_id] = mediaByRating[m.rating_id] || []).push(m); });
    }
    setRealReviews(rows.map((r) => {
      const p = profilesById[r.rater_id];
      const name = (p?.business_name && p.business_name.trim()) || p?.full_name || "Kullanıcı";
      return {
        id: r.id,
        name,
        initials: name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??",
        value: r.value,
        verified: true,
        time: formatRelativeTr(r.created_at),
        comment: r.comment || "",
        helpful: r.helpful_count || 0,
        media: (mediaByRating[r.id] || []).map((m) => ({ type: m.media_type, url: m.url, pending: m.approval_status === "pending" })),
        providerReply: r.provider_reply || "",
        providerReplyAt: r.provider_reply_at,
      };
    }));
  };

  useEffect(() => {
    loadRealReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRealListing, listing.providerId]);

  const myReviews = isRealListing ? [] : (userReviews || []).filter((r) => r.listingId === listing.id);
  const allReviews = isRealListing ? realReviews : [...myReviews, ...REVIEWS];
  const avg = allReviews.length ? (allReviews.reduce((s, r) => s + r.value, 0) / allReviews.length).toFixed(1) : null;

  // Yorum özeti — sadece gerçek vitrinlerde ve yeterince (en az 3) yazılı
  // yorum birikince anlamlı; her açılışta değil, yorum sayısı değiştiğinde
  // yeniden üretiliyor (aynı sayıdaysa tekrar tekrar çağırmamak için).
  const [reviewSummary, setReviewSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const summarizedCountRef = useRef(0);
  useEffect(() => {
    if (!isRealListing) return;
    const withText = realReviews.filter((r) => r.comment && r.comment.trim().length > 0);
    if (withText.length < 3 || summarizedCountRef.current === withText.length) return;
    let cancelled = false;
    (async () => {
      setSummaryLoading(true);
      try {
        const commentsList = withText.slice(0, 30).map((r, i) => `${i + 1}. (${r.value}★) ${r.comment}`).join("\n");
        const response = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 200,
            messages: [{ role: "user", content: `Aşağıda bir hizmet sağlayıcı için bırakılmış müşteri değerlendirmeleri var. Bunları okuyup, öne çıkan ortak temaları (olumlu ve varsa olumsuz) tek, akıcı bir Türkçe cümleyle (en fazla 25 kelime) özetle. Yorumlardan alıntı yapma, sadece genel izlenimi yaz.\n\n${commentsList}\n\nSADECE özet cümleyi yaz, başka hiçbir şey ekleme.` }],
          }),
        });
        const data = await response.json();
        const text = (data.content || []).map((b) => b.text || "").join("\n").trim();
        if (!cancelled && text) { setReviewSummary(text); summarizedCountRef.current = withText.length; }
      } catch {
        // sessizce vazgeç — özet olmadan da yorumlar normal şekilde listelenir
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isRealListing, realReviews]);

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

  // "Eşleşme" kontrolü — asıl kalıcı çözüm: değerlendirme sadece MÜŞTERİ
  // (jobs.client_id) mesajlaşma ekranından "Hizmeti Aldım" diyerek job.state'i
  // gerçekten 'delivered'a çevirdikten sonra açılır (bkz. MessagesView.markDelivered).
  // Öncesinde burada sahte bir "delivered" job otomatik oluşturuluyordu (hiç
  // konuşmamış biri bile değerlendirme bırakabiliyordu), sonra geçici bir
  // heuristik (min. mesaj sayısı + zaman eşiği) kullanıldı — ikisi de gerçek
  // bir "işlem tamamlandı" onayının yerini tutamaz, o yüzden asıl bu.
  // Telefon doğrulama şartı hâlâ duruyor (ucuz, tamamlayıcı bir katman) ama
  // checkPhoneGate'teki gibi YUMUŞAK — Netgsm henüz kurulu değilken (SMS
  // gönderilemiyorken) kimse gerçekten telefonunu doğrulayamaz, bu şartı sert
  // bırakmak herkesi sonsuza kadar kilitler (canlı testte fark edildi — gerçek
  // bir tutarsızlıktı). Anahtarlar eklenince otomatik sertleşir, kod değişmez.
  const checkReviewEligibility = async () => {
    if (!currentUserId) return { ok: false, reason: "Değerlendirme bırakmak için giriş yapmış olmalısın." };
    if (currentUserId === listing.providerId) return { ok: false, reason: "Kendi vitrinini değerlendiremezsin." };

    let smsConfigured = true;
    try {
      const cfgRes = await fetch("/api/send-otp");
      smsConfigured = (await cfgRes.json()).configured;
    } catch {
      smsConfigured = false;
    }
    if (smsConfigured) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, phone_verified")
        .in("id", [currentUserId, listing.providerId]);
      const myVerified = profilesData?.find((p) => p.id === currentUserId)?.phone_verified;
      const providerVerified = profilesData?.find((p) => p.id === listing.providerId)?.phone_verified;
      if (!myVerified) {
        return { ok: false, reason: "Değerlendirme yapabilmek için önce kendi telefonunu doğrulaman gerekiyor (Profilim → Telefon Doğrulama)." };
      }
      if (!providerVerified) {
        return { ok: false, reason: "Bu sağlayıcı henüz telefonunu doğrulamadığı için şu an değerlendirilemiyor." };
      }
    }

    const { data: jobRow } = await supabase
      .from("jobs")
      .select("id, state")
      .eq("client_id", currentUserId)
      .eq("service_id", listing.dbId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!jobRow) {
      return { ok: false, reason: "Değerlendirme yapabilmek için önce bu sağlayıcıyla iletişime geçmelisin.", needsContact: true };
    }
    if (jobRow.state !== "delivered") {
      return { ok: false, reason: "Değerlendirme yapabilmek için önce hizmeti aldığını mesajlaşma ekranından \"Hizmeti Aldım\" diyerek işaretlemen gerekiyor.", needsDelivery: true };
    }

    // Daha önce bu vitrini değerlendirdiysen (ratings tablosunda zaten bir
    // satır varsa), yeni bir insert değil GÜNCELLEME akışına geç — eskiden
    // burada bir yol yoktu, tekrar denersen sadece unique(job_id, rater_id,
    // rated_profile_id) kısıtına takılıp "zaten değerlendirdin" hatası
    // alıyordun (kısıt doğru çalışıyordu, sadece düzeltme yolu eksikti).
    // .maybeSingle() değil — teoride aynı vitrine birden fazla iş/tekrar
    // müşterisi olarak gelinip her birinde ayrı ayrı değerlendirme
    // bırakılmış olabilir (ratings'in unique kısıtı job_id bazlı, service_id
    // bazlı değil); en sonuncusunu düzenliyoruz.
    const { data: existingRatings } = await supabase
      .from("ratings")
      .select("id, value, comment")
      .eq("rater_id", currentUserId)
      .eq("service_id", listing.dbId)
      .order("created_at", { ascending: false });
    const existingRating = existingRatings?.[0] || null;

    return { ok: true, jobId: jobRow.id, existingRating: existingRating || null };
  };

  // Bir yorum fotoğrafı sağlayıcının kendi yüzünü/kimliğini gösteriyor
  // olabilir — TMK m.24-25 kişilik hakları nedeniyle bu durumda önce
  // sağlayıcının onayına gidiyor (review_media.approval_status='pending'),
  // az önce checkReviewMedia'nın (yukarıda, AI ile) verdiği karara göre.
  // Video burada bilerek desteklenmiyor: demo akışta video "AI kontrol
  // edemiyor, platform ekibine gider" diyor ama gerçek veride henüz bir
  // staff/admin inceleme ekranı yok (bkz. proje notları) — kimsenin
  // çözemeyeceği bir "pending" kaydı oluşturmaktansa şimdilik sadece
  // fotoğrafı gerçek akışa bağlıyoruz.
  // GÜVENLİK: AI moderasyon kararı (uygunluk + kimlik/rıza) artık burada
  // DEĞİL, sunucuda veriliyor (bkz. app/api/review-media/route.js) —
  // tarayıcı sadece dosyayı storage'a yükleyip sonucu istiyor, approval_status
  // gibi bir karara asla kendisi varmıyor. Eskiden bu fonksiyon AI'a kendisi
  // soruyor, cevaba göre review_media satırını kendisi insert ediyordu —
  // teknik bilgisi olan biri bu adımı atlayıp moderasyonu tamamen bypass
  // edebilirdi (kontrol edilen içerik değil, kontrolü ATLAMA riski).
  const attachRealReviewMedia = async (ratingId) => {
    try {
      const ext = (reviewMediaFile.name || "").split(".").pop() || "jpg";
      const path = `${currentUserId}/review-${ratingId}-${Date.now()}.${ext}`;
      const blob = await (await fetch(reviewMediaFile.dataUrl)).blob();
      const { error: uploadError } = await supabase.storage.from("profile-media").upload(path, blob, { contentType: reviewMediaFile.mimeType });
      if (uploadError) throw uploadError;
      const { data: pub } = supabase.storage.from("profile-media").getPublicUrl(path);

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/review-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          ratingId, mediaType: reviewMediaFile.type, url: pub.publicUrl, mimeType: reviewMediaFile.mimeType,
        }),
      });
      const result = await res.json();
      if (!mountedRef.current) return null;
      if (result.error) throw new Error(result.error);
      if (result.status === "pending" || result.status === "auto") return result.status;
      if (result.status === "rejected") return "rejected";
      if (result.status === "child") return "child";
      // "review"/"pending_review_failed" gibi diğer durumlar — güvenli
      // tarafta kal, otomatik yayınlanmadığını varsay ama kullanıcıyı da
      // hataya düşürme (yazılı yorum zaten kaydedildi).
      return "auto";
    } catch {
      // Görsel yüklenemese bile yazılı yorum zaten kaydedildi — metin her
      // zaman öncelikli, burada sessizce "auto" dönüp kullanıcıyı üzmüyoruz.
      return "auto";
    }
  };

  const submitRealReview = async () => {
    setReviewError("");
    const jobId = reviewEligibility?.jobId;
    const existing = reviewEligibility?.existingRating;
    if (!jobId) {
      setReviewError("Değerlendirme yapabilmek için önce bu sağlayıcıyla iletişime geçmelisin.");
      return null;
    }
    try {
      let ratingId;
      if (existing) {
        // Güncelleme — bkz. supabase/edit_reviews.sql (ratings için update
        // RLS policy'si yoktu, bu satır olmadan da bu update sessizce 0 satır
        // etkilerdi, o yüzden migration'ı çalıştırmadan bu akış çalışmaz).
        const { error: updateErr } = await supabase
          .from("ratings")
          .update({ value: reviewValue, comment: reviewComment.trim() })
          .eq("id", existing.id);
        if (updateErr) throw updateErr;
        ratingId = existing.id;
      } else {
        const { data: ratingRow, error: ratingErr } = await supabase
          .from("ratings")
          .insert({
            job_id: jobId, rater_id: currentUserId, rated_profile_id: listing.providerId, service_id: listing.dbId, value: reviewValue, comment: reviewComment.trim(),
          })
          .select("id")
          .single();
        if (ratingErr) throw ratingErr;
        ratingId = ratingRow.id;
      }
      const mediaResult = reviewMediaFile ? await attachRealReviewMedia(ratingId) : null;
      await loadRealReviews();
      return mediaResult || (existing ? "updated" : "auto");
    } catch (err) {
      const msg = (err?.message || "").includes("duplicate") || err?.code === "23505"
        ? "Bu sağlayıcıyı zaten değerlendirdin."
        : `Değerlendirme kaydedilemedi: ${err?.message || "bilinmeyen hata"}`;
      setReviewError(msg);
      return null;
    }
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);

    // Gerçek bir ilansa değerlendirme (puan + yorum + fotoğraf) gerçekten
    // kaydediliyor. Başarısız olursa formda kal, sahte akışa düşme.
    if (isRealListing) {
      if (!currentUserId) {
        setReviewError("Değerlendirme bırakmak için giriş yapmış olmalısın.");
        setReviewSubmitting(false);
        return;
      }
      const result = await submitRealReview();
      if (!mountedRef.current) return;
      setReviewSubmitting(false);
      if (!result) return;
      setReviewSubmitted(result);
      setReviewComment("");
      setReviewMediaFile(null);
      return;
    }

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
            onClick={() => onToggleFavorite?.(listing)}
            className="w-full py-2.5 rounded-full text-sm font-medium border flex items-center justify-center gap-1.5"
            style={isFavorited ? { borderColor: "#9C4A3C", color: "#9C4A3C", background: "rgba(156,74,60,0.06)" } : { borderColor: "#D9D0BA", color: "#1B2B24" }}
          >
            <Heart size={14} fill={isFavorited ? "#9C4A3C" : "none"} />
            {isFavorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          </button>

          {canReportListing && !listingReportSubmitted && (
            <button
              onClick={() => setShowListingReportForm((v) => !v)}
              className="w-full py-2 mt-2 rounded-full text-xs font-medium"
              style={{ color: "#9C4A3C" }}
            >
              Vitrini Bildir
            </button>
          )}
          {listingReportSubmitted && (
            <p className="text-xs text-center mt-2" style={{ color: "#3F7D5C" }}>Bildirimin alındı, teşekkürler.</p>
          )}
          {showListingReportForm && !listingReportSubmitted && (
            <div className="mt-2 pt-3 border-t" style={{ borderColor: "#D9D0BA" }}>
              <select
                value={listingReportReason}
                onChange={(e) => setListingReportReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none mb-2"
                style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
              >
                {Object.entries(LISTING_REPORT_REASON_LABELS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
              </select>
              <textarea
                value={listingReportDetail}
                onChange={(e) => setListingReportDetail(e.target.value)}
                rows={2}
                placeholder="Ek detay (opsiyonel)"
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none mb-2 resize-none"
                style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
              />
              {listingReportError && <p className="text-[11px] mb-2" style={{ color: "#9C4A3C" }}>{listingReportError}</p>}
              <button
                onClick={submitListingReport}
                disabled={listingReportSubmitting}
                className="w-full py-2 rounded-full text-xs font-bold text-white"
                style={{ background: "#9C4A3C", opacity: listingReportSubmitting ? 0.7 : 1 }}
              >
                {listingReportSubmitting ? "Gönderiliyor..." : "Şikayeti Gönder"}
              </button>
            </div>
          )}
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

      {(providerShowcase?.video_intro_url || providerPortfolio.length > 0) && (
        <div className="mt-10 pt-8 border-t" style={{ borderColor: "#D9D0BA" }}>
          <div className="flex items-center gap-2 mb-1">
            <Grid3x3 size={18} style={{ color: "#3F7D5C" }} />
            <h2 className="font-serif text-xl" style={{ color: "#1B2B24" }}>{listing.provider} — Vitrin</h2>
          </div>
          <p className="text-xs mb-5" style={{ color: "#8A8368" }}>
            Sağlayıcının tanıtım videosu ve iş başında çektiği fotoğraf/videolar
          </p>

          {providerShowcase?.video_intro_url && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#5C5744" }}>Video Tanıtım</p>
              <video controls playsInline className="w-full rounded-xl bg-black" style={{ maxHeight: "320px" }}>
                <source src={providerShowcase.video_intro_url} />
              </video>
            </div>
          )}

          {providerPortfolio.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#5C5744" }}>Portföy — İş Başında</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {providerPortfolio.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => setShowcaseLightbox({ media: providerPortfolio.map((p) => ({ type: p.media_type, url: p.url })), index: i })}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    {item.media_type === "video" ? (
                      <video muted playsInline className="w-full h-full object-cover">
                        <source src={item.url} />
                      </video>
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    )}
                    {item.media_type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
                        <PlayCircle size={20} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showcaseLightbox && (
        <MediaLightbox
          media={showcaseLightbox.media}
          index={showcaseLightbox.index}
          onClose={() => setShowcaseLightbox(null)}
          onNav={(i) => setShowcaseLightbox({ ...showcaseLightbox, index: i })}
        />
      )}

      <div className="mt-10 pt-8 border-t" style={{ borderColor: "#D9D0BA" }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl" style={{ color: "#1B2B24" }}>Değerlendirmeler</h2>
            <span className="text-sm" style={{ color: "#5C5744" }}>
              {avg ? `${avg} ortalama · ${allReviews.length} yorum` : "Henüz değerlendirme yok"}
            </span>
          </div>
          <button
            onClick={async () => {
              if (showReviewForm) { setShowReviewForm(false); return; }
              if (!isRealListing) { setShowReviewForm(true); return; }
              setReviewEligibility({ checking: true });
              const result = await checkReviewEligibility();
              setReviewEligibility(result);
              // Daha önce değerlendirmişse formu boş değil, mevcut
              // puan/yorumla aç — "güncelle" tam olarak bunu bekler.
              if (result?.existingRating) {
                setReviewValue(result.existingRating.value);
                setReviewComment(result.existingRating.comment || "");
              }
              setShowReviewForm(true);
            }}
            className="text-xs font-bold px-3.5 py-2 rounded-full text-white"
            style={{ background: "#2563EB" }}
          >
            Değerlendirme Yaz
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>Fotoğraf ve video içeren yorumlar önce gösterilir</p>

        {isRealListing && (summaryLoading || reviewSummary) && (
          <div className="flex items-start gap-2 rounded-xl p-3.5 mb-4" style={{ background: "#EFF6FF" }}>
            <Sparkles size={14} style={{ color: "#2563EB" }} className="mt-0.5 shrink-0" />
            {summaryLoading && !reviewSummary ? (
              <p className="text-xs" style={{ color: "#5C5744" }}>Yorumlar AI ile özetleniyor...</p>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: "#1B2B24" }}>{reviewSummary}</p>
            )}
          </div>
        )}

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
                    : reviewSubmitted === "updated" ? "Değerlendirmen güncellendi!"
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
            ) : isRealListing && reviewEligibility?.checking ? (
              <div className="flex items-center gap-2 py-3 justify-center">
                <Loader2 size={14} className="animate-spin" style={{ color: "#8A8368" }} />
                <span className="text-xs" style={{ color: "#8A8368" }}>Kontrol ediliyor...</span>
              </div>
            ) : isRealListing && !reviewEligibility?.ok ? (
              <div className="text-center py-3">
                <p className="text-xs" style={{ color: "#5C5744" }}>{reviewEligibility?.reason || "Değerlendirme yapabilmen için önce bu sağlayıcıyla iletişime geçmen gerekiyor."}</p>
                {reviewEligibility?.needsContact && (
                  <button onClick={onContact} className="text-xs font-bold mt-2" style={{ color: "#2563EB" }}>İletişime Geç</button>
                )}
                {reviewEligibility?.needsDelivery && (
                  <button onClick={onContact} className="text-xs font-bold mt-2" style={{ color: "#2563EB" }}>Mesajlara Git</button>
                )}
              </div>
            ) : (
              <>
                {isRealListing && reviewEligibility?.existingRating && (
                  <p className="text-xs mb-2.5 px-3 py-2 rounded-lg" style={{ background: "rgba(37,99,235,0.08)", color: "#2563EB" }}>
                    Bu sağlayıcıyı zaten değerlendirmiştin — aşağıdakini düzenleyip güncelleyebilirsin.
                  </p>
                )}
                {!isRealListing && (
                  <input
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Adın (isteğe bağlı)"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-2.5"
                    style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
                  />
                )}
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
                {(
                  <>
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
                        {reviewMediaFile ? "Değiştir" : isRealListing ? "Fotoğraf Ekle" : "Fotoğraf/Video Ekle"}
                        {/* Gerçek vitrinlerde video bilerek desteklenmiyor — bkz.
                            attachRealReviewMedia'daki not (AI videoyu kontrol
                            edemiyor, gerçek veride henüz bir staff inceleme
                            ekranı yok). */}
                        <input type="file" accept={isRealListing ? "image/*" : "image/*,video/*"} className="hidden" onChange={handleReviewMedia} />
                      </label>
                    </div>
                    <p className="text-[11px] mb-3" style={{ color: "#8A8368" }}>
                      Eklediğin görsel sağlayıcının kendisini gösteriyorsa, yayınlanmadan önce sağlayıcının onayına sunulur. Yazılı yorumun her zaman anında yayınlanır.
                    </p>
                  </>
                )}
                {reviewError && (
                  <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{reviewError}</p>
                )}
                <button
                  onClick={submitReview}
                  disabled={!reviewComment.trim() || reviewSubmitting}
                  className="w-full py-2.5 rounded-full text-sm font-bold text-white"
                  style={{ background: "#2563EB", opacity: reviewSubmitting ? 0.6 : 1 }}
                >
                  {reviewSubmitting ? "Gönderiliyor..." : reviewEligibility?.existingRating ? "Değerlendirmeyi Güncelle" : "Yorumu Gönder"}
                </button>
              </>
            )}
          </div>
        )}

        <div>
          {allReviews.map((r) => (
            <ReviewCard key={r.id} review={r} onOpenMedia={(media, index) => setLightbox({ media, index })} isReal={isRealListing} currentUserId={currentUserId} providerId={listing.providerId} />
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

function MapView({ onBack, onSelectProvider, onSelectJob, realListings, realJobs }) {
  const [mapQuery, setMapQuery] = useState("");
  const [homeOnly, setHomeOnly] = useState(false);
  // Harita eskiden vitrinleri ve iş ilanlarını hep karışık gösteriyordu —
  // "iş mi arıyorsun, vitrin mi arıyorsun" diye bir ayrım hiç yoktu, ikisi
  // farklı niyetler (kullanıcının kendi tespiti: bir asimetri/tutarsızlık).
  // Varsayılan "Tümü" — eski davranış korunuyor, ama artık daraltılabiliyor.
  // "Tümü" seçeneği kaldırıldı (kullanıcının kararı) — kullanıcı iş mi
  // arıyor vitrin mi net seçmeli, varsayılan hizmet sağlayanlar (haritanın
  // asıl amacı: "Dünya Genelinde Hizmet Sağlayanlar").
  const [pinType, setPinType] = useState("vitrin"); // vitrin | job
  const [active, setActive] = useState(null);
  const [cityId, setCityId] = useState("istanbul");
  const [userLoc, setUserLoc] = useState(null); // { lat, lng }
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | granted | denied

  // Gerçek (yerinde) ilanları haritada gösterilebilecek pin'lere çeviriyoruz —
  // bkz. mapServiceRowToPin. Uzaktan hizmetler haritada gösterilmiyor (LOCAL_PROVIDERS'ta da yok).
  const realPins = (realListings || [])
    .filter((l) => l.mode === "local")
    .map((l) => mapServiceRowToPin({ id: l.dbId, city: l.city }, l))
    .filter(Boolean);
  // Gerçek iş ilanları (client'ların "İlan Ver" ile girdiği ihtiyaçlar) da
  // haritada ayrı bir pin türü olarak gösteriliyor — bkz. mapJobRowToPin.
  const jobPins = (realJobs || []).map((j) => mapJobRowToPin(j)).filter(Boolean);
  const allProviders = [...LOCAL_PROVIDERS, ...realPins, ...jobPins];

  const city = CITIES.find((c) => c.id === cityId);
  const catColor = {
    temizlik: "#3F7D5C", nakliye: "#3A5BA0", tadilat: "#C2872B", cilingir: "#9C4A3C", ogretmen: "#6B4FA0",
    bakici: "#C25B8E", muhendis: "#2E6B6B", "hasta-bakici": "#D14D4D", hemsire: "#2196A6", fizyoterapist: "#4C8C4A",
    makyaj: "#B8548C", bakim: "#5B9BA8", terzi: "#7A6B8F", yemek: "#B5762E",
    diyetisyen: "#5C9C4A", psikolog: "#7B5FA8", "logusa-bakicisi": "#D1706B", "emzirme-danismani": "#4A9C8C",
    elektrikci: "#D1A23B", "su-tesisatcisi": "#3A7CA5", "hali-yikama": "#6B8E4E", "etkinlik-organizatoru": "#D16BA5",
    "yoga-koc": "#8FA65C", "bahce-bakim": "#5C8A3F", "profesyonel-fotograf": "#6B5B95", "spor-egitmeni": "#B85450",
    // 2026-09-07'de eklenen 7 kategori — bu haritada unutulursa pin rengi
    // undefined olur (görünmez/kırık daire), her yeni kategoride burayı da
    // güncellemek gerekiyor.
    "boya-badana": "#E07A5F", "klima-beyaz-esya": "#4A90A4", "kuafor-berber": "#A8527A",
    "evcil-hayvan": "#C68642", "muzik-egitmeni": "#8A5FBF", "muhasebe": "#4A6572", "ceviri": "#5FA8A0",
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

  let list = cityId === "all" ? allProviders : allProviders.filter((p) => p.city === cityId);
  if (pinType === "vitrin") list = list.filter((p) => p.kind !== "job");
  if (pinType === "job") list = list.filter((p) => p.kind === "job");
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

      <div className="flex items-center gap-1.5 mb-4">
        {[["vitrin", "Hizmet Sağlayanlar"], ["job", "İş İlanları"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPinType(key)}
            className="text-xs font-bold px-3.5 py-2 rounded-full transition-colors"
            style={pinType === key ? { background: "#2563EB", color: "#FFFFFF" } : { background: "#F8F4E9", color: "#5C5744", border: "1px solid #D9D0BA" }}
          >
            {label}
          </button>
        ))}
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
                {p.kind === "job" ? <Megaphone size={14} fill="white" /> : <MapPin size={15} fill="white" />}
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
              {active.kind === "job" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2" style={{ background: "#FFF3E0", color: "#C2872B" }}>
                  <Megaphone size={10} /> İş İlanı
                </span>
              )}
              <img src={active.img} alt="" className="w-full h-28 object-cover rounded-lg mb-3" />
              <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{active.name}</p>
              <p className="text-xs mb-2" style={{ color: "#8A8368" }}>{active.district}, {city?.name}</p>
              {active.kind !== "job" && (
                <div className="flex items-center gap-1 mb-1">
                  <Stars value={active.rating} size={12} />
                  <span className="text-xs" style={{ color: "#5C5744" }}>{active.rating}</span>
                </div>
              )}
              {active.distance != null && (
                <p className="text-xs mb-2" style={{ color: "#3F7D5C" }}>Senden yaklaşık {active.distance.toFixed(1)} km uzakta</p>
              )}
              <p className="text-sm font-medium mb-3 mt-2" style={{ color: "#C2872B" }}>{active.price}</p>
              <button
                onClick={() => (active.kind === "job" ? onSelectJob(active.job) : onSelectProvider(active))}
                className="w-full py-2 rounded-full text-sm font-medium text-white"
                style={{ background: "#C2872B" }}
              >
                {active.kind === "job" ? "Teklif Ver" : "Profili Gör"}
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
                    {p.kind === "job" ? <Megaphone size={13} fill="white" /> : <MapPin size={14} fill="white" />}
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

const LISTING_REPORT_REASON_LABELS = {
  yanlis_kategori: "Yanlış kategori",
  supheli_sahte: "Şüpheli / sahte ilan",
  kopya_ilan: "Kopya ilan",
  uygunsuz_icerik: "Uygunsuz içerik",
  diger: "Diğer",
};

function JobDetailView({ job, onBack, onContact, currentUserId }) {
  const cat = CATEGORIES.find((c) => c.id === job?.category);
  const Icon = cat?.icon;
  const isOwner = job?.isReal && currentUserId && job.posterId === currentUserId;
  const canReport = job?.isReal && currentUserId && job.posterId !== currentUserId;

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("yanlis_kategori");
  const [reportDetail, setReportDetail] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState("");

  const submitListingReport = async () => {
    setReportSubmitting(true);
    setReportError("");
    const { error } = await supabase.from("listing_reports").insert({
      reporter_id: currentUserId, job_id: job.dbId, reason: reportReason, detail: reportDetail.trim() || null,
    });
    setReportSubmitting(false);
    if (error) { setReportError(`Bildirilemedi: ${error.message}`); return; }
    setReportSubmitted(true);
  };

  // "Yenile" — sahibinden'in "ilanı üste taşı" mantığı: eski, unutulmuş iş
  // ilanları listede sessizce dibe batmasın diye sahibi manuel tazeleyebilsin.
  // jobs.bumped_at (bkz. sahibinden_features.sql) — mevcut "Clients can
  // update their own jobs" RLS policy'si zaten bu update'e izin veriyor.
  const [bumping, setBumping] = useState(false);
  const [bumped, setBumped] = useState(false);
  const bumpJob = async () => {
    if (!job?.dbId) return;
    setBumping(true);
    const { error } = await supabase.from("jobs").update({ bumped_at: new Date().toISOString() }).eq("id", job.dbId).eq("client_id", currentUserId);
    setBumping(false);
    if (!error) setBumped(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>

      <div className="rounded-2xl p-7 mb-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F1115 0%, #1A1D23 60%, #16321F 100%)" }}>
        <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-20" style={{ background: "#F59E0B" }} />
        <div className="flex items-center gap-2 mb-3 relative">
          {Icon && (
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <Icon size={16} style={{ color: "#F59E0B" }} />
            </div>
          )}
          <span className="text-xs font-semibold" style={{ color: "#B8BCC4" }}>{cat?.name}{job?.postedTime ? ` · ${job.postedTime}` : ""}</span>
        </div>
        <h1 className="font-sans text-2xl font-black relative" style={{ color: "#FFFFFF" }}>{job?.title}</h1>
      </div>

      <div className="grid sm:grid-cols-[1fr_240px] gap-6">
        <div>
          <h2 className="text-sm font-bold mb-2" style={{ color: "#0F1115" }}>İş Detayı</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#374151" }}>
            {job?.desc || "Bu ilan için ek bir açıklama eklenmemiş."}
          </p>
        </div>
        <div className="rounded-xl border p-5 h-fit" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "#9CA3AF" }}>Bütçe</p>
          <p className="text-lg font-black mb-4" style={{ color: "#F59E0B" }}>{job?.budget}</p>
          <p className="text-xs font-medium mb-1" style={{ color: "#9CA3AF" }}>Konum</p>
          <p className="text-sm mb-4 flex items-center gap-1" style={{ color: "#374151" }}>
            <MapPin size={13} />{job?.district}
          </p>
          <p className="text-xs font-medium mb-1" style={{ color: "#9CA3AF" }}>İlan Sahibi</p>
          <p className="text-sm mb-5" style={{ color: "#374151" }}>{job?.posterName || "—"}</p>
          <button
            onClick={onContact}
            className="w-full py-2.5 rounded-full text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
          >
            Teklif Ver
          </button>

          {isOwner && (
            <button
              onClick={bumpJob}
              disabled={bumping || bumped}
              className="w-full py-2 mt-2 rounded-full text-xs font-bold border flex items-center justify-center gap-1.5"
              style={{ borderColor: "#D9D0BA", color: bumped ? "#3F7D5C" : "#5C5744", opacity: bumping ? 0.6 : 1 }}
            >
              {bumping ? <Loader2 size={12} className="animate-spin" /> : bumped ? <Check size={12} /> : null}
              {bumped ? "Yenilendi" : "İlanı Yenile"}
            </button>
          )}

          {canReport && !reportSubmitted && (
            <button
              onClick={() => setShowReportForm((v) => !v)}
              className="w-full py-2 mt-2 rounded-full text-xs font-medium"
              style={{ color: "#9C4A3C" }}
            >
              İlanı Bildir
            </button>
          )}
          {reportSubmitted && (
            <p className="text-xs text-center mt-2" style={{ color: "#3F7D5C" }}>Bildirimin alındı, teşekkürler.</p>
          )}
          {showReportForm && !reportSubmitted && (
            <div className="mt-2 pt-3 border-t" style={{ borderColor: "#F0F0F0" }}>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none mb-2"
                style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
              >
                {Object.entries(LISTING_REPORT_REASON_LABELS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
              </select>
              <textarea
                value={reportDetail}
                onChange={(e) => setReportDetail(e.target.value)}
                rows={2}
                placeholder="Ek detay (opsiyonel)"
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none mb-2 resize-none"
                style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
              />
              {reportError && <p className="text-[11px] mb-2" style={{ color: "#9C4A3C" }}>{reportError}</p>}
              <button
                onClick={submitListingReport}
                disabled={reportSubmitting}
                className="w-full py-2 rounded-full text-xs font-bold text-white"
                style={{ background: "#9C4A3C", opacity: reportSubmitting ? 0.7 : 1 }}
              >
                {reportSubmitting ? "Gönderiliyor..." : "Şikayeti Gönder"}
              </button>
            </div>
          )}
        </div>
      </div>
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

function SearchResultsView({ query, cityFilter, onBack, onSelectListing, realListings, currentUserId }) {
  const [homeOnly, setHomeOnly] = useState(false);
  // Kayıtlı arama — sahibinden.com'un "aramanı kaydet, yeni ilan gelince
  // haber ver" özelliği. bkz. supabase/sahibinden_features.sql (saved_searches
  // + notify_saved_search_matches trigger'ı).
  const [savingSearch, setSavingSearch] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);
  const saveThisSearch = async () => {
    if (!currentUserId || !query.trim()) return;
    setSavingSearch(true);
    const { error } = await supabase.from("saved_searches").insert({ profile_id: currentUserId, query: query.trim() });
    setSavingSearch(false);
    if (!error) setSearchSaved(true);
  };
  const q = query.trim().toLocaleLowerCase("tr-TR");
  // "Ne" ve "Nerede" ayrı alanlar (hero'daki iki alanlı arama) — önceden tek
  // kutuya "istanbul temizlik" gibi yazmak işe yaramıyordu, çünkü haystack'te
  // şehir başlıktan SONRA geliyor ve düz substring arama sırayı bozan
  // birleşik sorguları hiç yakalamıyordu. Şimdi şehir kendi başına, AND
  // mantığıyla ayrı bir filtre.
  const cityQ = (cityFilter || "").trim().toLocaleLowerCase("tr-TR");
  const pool = [...(realListings || []), ...LISTINGS];
  const literalResults = pool
    .filter((l) => {
      const haystack = [l.title, l.provider, l.city, l.desc || "", CATEGORIES.find((c) => c.id === l.category)?.name || ""]
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      const matchesQuery = q.length === 0 || haystack.includes(q);
      const matchesCity = cityQ.length === 0 || (l.city || "").toLocaleLowerCase("tr-TR").includes(cityQ);
      const matchesHome = !homeOnly || l.homeService === "evde" || l.homeService === "esnek";
      return matchesQuery && matchesCity && matchesHome;
    })
    .sort((a, b) => computeVisibilityScore(b) - computeVisibilityScore(a));

  // Düz kelime eşleşmesi hiç sonuç bulamazsa ("evimi kim toplar" gibi
  // dolaylı bir arama, "temizlik" kelimesini hiç içermiyor) AI ile aramayı
  // genişletiyoruz — kategori/anahtar kelime çıkarıp tekrar filtreliyoruz.
  // Sadece literal arama boşken devreye giriyor, her tuşta değil.
  const [aiKeywords, setAiKeywords] = useState(null); // { categorySlugs, keywords }
  const [aiExpanding, setAiExpanding] = useState(false);
  const expandedForRef = useRef("");
  useEffect(() => {
    if (q.length < 2 || literalResults.length > 0) { setAiKeywords(null); return; }
    if (expandedForRef.current === q) return;
    let cancelled = false;
    (async () => {
      setAiExpanding(true);
      try {
        const catList = CATEGORIES.map((c) => `${c.id}: ${c.name}`).join(", ");
        const response = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 200,
            messages: [{ role: "user", content: `Bir hizmet pazaryerinde kullanıcı şunu aradı: "${query}". Kategori listesi (slug: isim): ${catList}. Kullanıcının kastettiği en olası 1-2 kategori slug'ını ve aramaya eklenebilecek 3-5 ilgili Türkçe anahtar kelimeyi bul.\n\nSADECE şu JSON formatında yanıt ver: {"categorySlugs": ["..."], "keywords": ["..."]}` }],
          }),
        });
        const data = await response.json();
        const text = (data.content || []).map((b) => b.text || "").join("\n");
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        if (!cancelled) { setAiKeywords(parsed); expandedForRef.current = q; }
      } catch {
        if (!cancelled) setAiKeywords(null);
      } finally {
        if (!cancelled) setAiExpanding(false);
      }
    })();
    return () => { cancelled = true; };
  }, [q, literalResults.length, query]);

  const aiResults = aiKeywords
    ? pool
        .filter((l) => {
          const haystack = [l.title, l.provider, l.city, l.desc || ""].join(" ").toLocaleLowerCase("tr-TR");
          const matchesCategory = (aiKeywords.categorySlugs || []).includes(l.category);
          const matchesKeyword = (aiKeywords.keywords || []).some((k) => haystack.includes(String(k).toLocaleLowerCase("tr-TR")));
          const matchesCity = cityQ.length === 0 || (l.city || "").toLocaleLowerCase("tr-TR").includes(cityQ);
          const matchesHome = !homeOnly || l.homeService === "evde" || l.homeService === "esnek";
          return (matchesCategory || matchesKeyword) && matchesCity && matchesHome;
        })
        .sort((a, b) => computeVisibilityScore(b) - computeVisibilityScore(a))
    : [];

  const results = literalResults.length > 0 ? literalResults : aiResults;
  const isAiBoosted = literalResults.length === 0 && aiResults.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>
        {query.trim() && cityFilter ? `"${query}" — ${cityFilter}` : query.trim() ? `"${query}"` : cityFilter}
        {" "}için {results.length} sonuç
      </h1>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <p className="text-sm" style={{ color: "#5C5744" }}>Başlık, hizmet sağlayan ve bölgeye göre eşleşenler</p>
        <div className="flex items-center gap-2">
          {currentUserId && query.trim() && (
            <button
              onClick={saveThisSearch}
              disabled={savingSearch || searchSaved}
              className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border"
              style={searchSaved ? { background: "#3F7D5C", color: "white", borderColor: "#3F7D5C" } : { borderColor: "#D9D0BA", color: "#5C5744" }}
            >
              <Bell size={13} />
              {searchSaved ? "Kaydedildi" : savingSearch ? "Kaydediliyor..." : "Bu Aramayı Kaydet"}
            </button>
          )}
          <button
            onClick={() => setHomeOnly(!homeOnly)}
            className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border"
            style={homeOnly ? { background: "#3F7D5C", color: "white", borderColor: "#3F7D5C" } : { borderColor: "#D9D0BA", color: "#5C5744" }}
          >
            <Home size={13} />
            Sadece evime gelsin
          </button>
        </div>
      </div>

      {aiExpanding && (
        <p className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "#2563EB" }}>
          <Loader2 size={12} className="animate-spin" /> Tam eşleşme yok, AI ile aramanı genişletiyorum...
        </p>
      )}
      {isAiBoosted && !aiExpanding && (
        <p className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "#2563EB" }}>
          <Sparkles size={12} /> Tam eşleşme bulunamadı, bunlar AI ile ilgili görülüp önerildi
        </p>
      )}

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
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <ModeTag mode={l.mode} />
                  {l.isBoosted && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-0.5" style={{ background: "#F59E0B" }}><Sparkles size={9} />Öne Çıkan</span>
                  )}
                  {l.isReal && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#2FBF71" }}>Yeni</span>
                  )}
                </div>
              </div>
              <div className="p-3.5">
                <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "#1B2B24" }}>{l.title}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <p className="text-xs" style={{ color: "#8A8368" }}>{l.provider} · {l.city}</p>
                  <LevelBadge level={l.level} />
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1">
                    <Stars value={l.rating} size={12} />
                    <span className="text-xs" style={{ color: "#5C5744" }}>{l.reviewCount > 0 ? `(${l.reviewCount})` : "Yeni vitrin"}</span>
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

// Gerçek, kalıcı favoriler — hem vitrinler hem iş ilanları favorilenebiliyor
// (favorites tablosu schema (3).sql'de zaten ikisini de destekliyordu, artık
// gerçekten kullanılıyor). Kalp ikonuna bastığında burada birikir, sayfa
// yenilenince kaybolmaz.
function FavoritesView({ onBack, onSelectListing, onOpenJob, realListings, realJobs, favoriteIds, onToggleFavorite, onToggleJobFavorite }) {
  const favoriteListings = (realListings || []).filter((l) => favoriteIds?.has(l.dbId));
  const favoriteJobs = (realJobs || []).filter((j) => favoriteIds?.has(j.dbId));
  const isEmpty = favoriteListings.length === 0 && favoriteJobs.length === 0;
  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>Favorilerim</h1>
      <p className="text-sm mb-6" style={{ color: "#5C5744" }}>Kalp ikonuyla işaretlediğin vitrinler ve iş ilanları burada birikir.</p>

      {isEmpty ? (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
          <Heart size={22} style={{ color: "#D9D0BA" }} className="mx-auto mb-2" />
          <p className="text-sm" style={{ color: "#5C5744" }}>Henüz favorin yok. Beğendiğin bir vitrin ya da iş ilanında kalp ikonuna basarak buraya ekleyebilirsin.</p>
        </div>
      ) : (
        <>
          {favoriteListings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold mb-3" style={{ color: "#1B2B24" }}>Vitrinler ({favoriteListings.length})</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteListings.map((l) => (
                  <div key={l.id} className="rounded-xl overflow-hidden border" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
                    <button onClick={() => onSelectListing(l)} className="w-full text-left">
                      <div className="relative h-40 overflow-hidden">
                        <img src={l.img} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3.5">
                        <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "#1B2B24" }}>{l.title}</p>
                        <p className="text-xs mt-1" style={{ color: "#8A8368" }}>{l.provider} · {l.city}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => onToggleFavorite?.(l)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 border-t"
                      style={{ borderColor: "#D9D0BA", color: "#9C4A3C" }}
                    >
                      <Heart size={13} fill="#9C4A3C" /> Favorilerden çıkar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favoriteJobs.length > 0 && (
            <div>
              <h2 className="text-sm font-bold mb-3" style={{ color: "#1B2B24" }}>İş İlanları ({favoriteJobs.length})</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteJobs.map((j) => (
                  <div key={j.id} className="rounded-xl overflow-hidden border" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
                    <button onClick={() => onOpenJob(j)} className="w-full text-left p-3.5">
                      <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "#1B2B24" }}>{j.title}</p>
                      <p className="text-xs mt-1" style={{ color: "#8A8368" }}>{j.district} · {j.budget}</p>
                    </button>
                    <button
                      onClick={() => onToggleJobFavorite?.(j)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 border-t"
                      style={{ borderColor: "#D9D0BA", color: "#9C4A3C" }}
                    >
                      <Heart size={13} fill="#9C4A3C" /> Favorilerden çıkar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PostJobView({ onBack, onSubmitted, onViewOffers, onMatchAI, userId, onJobPosted, editingJob, onJobUpdated, onGoToProfile }) {
  // İlan verildikten sonra düzenleme yolu hiç yoktu (kullanıcının fark
  // ettiği gerçek bir eksiklik — "balkon temizliğinden bahsetmeyi unutmuş,
  // düzenleyemiyor" gibi bir durumda tek çare ilanı silip yeniden girmekti).
  // CreateListingView'daki editingListing deseniyle birebir aynı.
  const isEditing = !!editingJob;
  const [mode, setMode] = useState(editingJob?.mode || "local");
  const [step, setStep] = useState("form"); // form | success
  const [title, setTitle] = useState(editingJob?.title || "");
  const [categoryId, setCategoryId] = useState(editingJob?.category === "diger" ? CUSTOM_CATEGORY_ID : editingJob?.category || "");
  const [customCategoryLabel, setCustomCategoryLabel] = useState(editingJob?.customCategoryLabel || ""); // categoryId === CUSTOM_CATEGORY_ID iken
  const [desc, setDesc] = useState(editingJob?.desc || "");
  const [cityId, setCityId] = useState(() => deriveCityIdFromLabel(editingJob?.city) || "istanbul");
  const [district, setDistrict] = useState(() => (editingJob?.city || "").split(",")[0]?.trim() || "");
  const [minBudget, setMinBudget] = useState(editingJob?.budgetMin != null ? String(editingJob.budgetMin) : "");
  const [maxBudget, setMaxBudget] = useState(editingJob?.budgetMax != null ? String(editingJob.budgetMax) : "");
  const [urgency, setUrgency] = useState("today"); // now | today | flexible
  const [homeServicePref, setHomeServicePref] = useState("evde"); // evde | mekanda | esnek
  const [photos, setPhotos] = useState([]); // { url, name }
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categoryIdBySlug, setCategoryIdBySlug] = useState({});
  const [postedJob, setPostedJob] = useState(null); // { dbId, posterId, categoryDbId, ... } — gerçek jobs satırı
  const [aiWriting, setAiWriting] = useState(false);

  // Kullanıcı geri bildirimi: profil/telefon eksikse önceden bu kontrol
  // sadece "İlanı Yayınla"ya basınca yapılıyordu — biri tüm formu doldurup
  // gönderdiğinde reddediliyor, formdan çıkıp profilini tamamlamaya
  // gidince yazdığı her şey kayboluyordu. Artık form hiç açılmadan,
  // en baştan kontrol ediliyor (CreateListingView ile aynı desen).
  const [gateCheck, setGateCheck] = useState(isEditing ? { checking: false, ok: true } : { checking: true, ok: null });
  useEffect(() => {
    if (isEditing) { setGateCheck({ checking: false, ok: true }); return; }
    if (!userId) { setGateCheck({ checking: false, ok: true }); return; }
    let cancelled = false;
    (async () => {
      const profileGate = await checkProfileGate(userId);
      if (cancelled) return;
      if (!profileGate.ok) { setGateCheck({ checking: false, ok: false, reason: profileGate.reason }); return; }
      const phoneGate = await checkPhoneGate(userId);
      if (cancelled) return;
      setGateCheck({ checking: false, ok: phoneGate.ok, reason: phoneGate.ok ? "" : phoneGate.reason });
    })();
    return () => { cancelled = true; };
  }, [userId, isEditing]);

  useEffect(() => {
    let cancelled = false;
    supabase.from("categories").select("id, slug").then(({ data }) => {
      if (cancelled || !data) return;
      const map = {};
      data.forEach((c) => { map[c.slug] = c.id; });
      setCategoryIdBySlug(map);
    });
    return () => { cancelled = true; };
  }, []);

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

  // CreateListingView'daki writeWithAI ile aynı desen — vitrin tarafında
  // vardı, iş ilanı tarafında hiç yoktu (tutarsızlık).
  const writeWithAI = async () => {
    if (!categoryId) { setError("Önce bir kategori seç, AI ona göre yazsın."); return; }
    setAiWriting(true);
    setError("");
    try {
      const catName = categoryId === CUSTOM_CATEGORY_ID ? customCategoryLabel.trim() : CATEGORIES.find((c) => c.id === categoryId)?.name || "";
      const prompt = `Bir hizmet pazaryeri uygulamasında bir MÜŞTERİ, ihtiyacı olan işi anlatan bir ilan yazıyor (bir sağlayıcı değil). Kategori: "${catName}". ${title.trim() || desc.trim() ? `Kullanıcının notu: "${title.trim()} ${desc.trim()}"` : "Kullanıcı henüz bir şey yazmadı, kategoriye uygun genel ve gerçekçi bir müşteri ihtiyacı metni üret."}
SADECE şu JSON formatında yanıt ver, başka hiçbir metin ekleme:
{"title": "kısa, net bir ilan başlığı (en fazla 8 kelime)", "desc": "2-3 cümlelik, ihtiyacı ve beklentiyi anlatan bir açıklama"}`;
      const response = await fetch("/api/claude", {
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

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Bir başlık yazmalısın."); return; }
    if (!categoryId) { setError("Bir kategori seçmelisin."); return; }
    if (categoryId === CUSTOM_CATEGORY_ID && !customCategoryLabel.trim()) { setError("Hangi hizmet olduğunu yazmalısın."); return; }
    if (!desc.trim()) { setError("İşin ne olduğunu kısaca anlat."); return; }
    if (!userId) { setError("İlan vermek için giriş yapmış olmalısın."); return; }
    // "Diğer" seçilince gerçek FK hedefi hep "diger" kategorisi — kullanıcının
    // yazdığı serbest metin ayrı bir kolonda duruyor (bkz. custom_category_label).
    const categoryDbId = categoryId === CUSTOM_CATEGORY_ID ? categoryIdBySlug["diger"] : categoryIdBySlug[categoryId];
    if (!categoryDbId) { setError("Bu kategori veritabanında henüz tanımlı değil."); return; }
    setError("");
    setSubmitting(true);
    if (!isEditing) {
      const profileGate = await checkProfileGate(userId);
      if (!profileGate.ok) { setSubmitting(false); setError(profileGate.reason); return; }
      const gate = await checkPhoneGate(userId);
      if (!gate.ok) { setSubmitting(false); setError(gate.reason); return; }
    }

    const parseBudget = (v) => {
      const n = parseFloat(v.replace(/\./g, "").replace(",", "."));
      return Number.isNaN(n) ? null : n;
    };
    const cityLabel = `${district.trim() ? district.trim() + ", " : ""}${cityName}`;
    const payload = {
      category_id: categoryDbId,
      title: title.trim(),
      description: desc.trim(),
      budget_min: minBudget.trim() ? parseBudget(minBudget.trim()) : null,
      budget_max: maxBudget.trim() ? parseBudget(maxBudget.trim()) : null,
      is_remote: mode === "remote",
      city: mode === "local" ? cityLabel : null,
      location: mode === "local" ? cityToLocationEwkt(cityId) : null,
      custom_category_label: categoryId === CUSTOM_CATEGORY_ID ? customCategoryLabel.trim() : null,
    };

    const { data, error: dbError } = isEditing
      ? await supabase.from("jobs").update(payload).eq("id", editingJob.dbId).select().single()
      : await supabase.from("jobs").insert({ ...payload, client_id: userId, state: "new_offer", active: true }).select().single();

    setSubmitting(false);
    if (dbError || !data) {
      setError(`İlan kaydedilemedi: ${dbError?.message || "bilinmeyen bir hata oluştu"}`);
      return;
    }
    if (isEditing) {
      onJobUpdated?.();
      return;
    }
    setPostedJob({ dbId: data.id, posterId: data.client_id, categoryDbId: data.category_id });
    onJobPosted?.();
    setStep("success");
    // Şüpheli içerik taraması — sessiz, engellemeyen.
    checkAndFlagContent("job", data.id, `${title} ${desc}`.trim(), userId);
    // Listede olmayan bir kategori istendiyse, gerçekten görülmesi için
    // destek talebi kuyruğuna düşürüyoruz — sessiz, engellemeyen (bkz. üstteki desen).
    if (categoryId === CUSTOM_CATEGORY_ID) {
      supabase.from("support_tickets").insert({
        reporter_id: userId,
        title: `Yeni kategori talebi: ${customCategoryLabel.trim()}`,
        category: "istek",
        summary: `İlan Ver formunda "${customCategoryLabel.trim()}" kategorisi listede yoktu, kullanıcı "Diğer" ile devam etti. İlan başlığı: "${title.trim()}".`,
      }).then(() => {});
    }
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
          <button
            onClick={() => onViewOffers({ title, categoryId, homeServicePref, ...postedJob })}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-white"
            style={{ background: "#C2872B" }}
          >
            Teklifleri Gör
          </button>
          <button onClick={onSubmitted} className="px-5 py-2.5 rounded-full text-sm font-medium border" style={{ borderColor: "#D9D0BA", color: "#1B2B24" }}>Ana Sayfaya Dön</button>
        </div>
        <p className="text-[11px] mt-4" style={{ color: "#8A8368" }}>
          Not: İlanın gerçekten kaydedildi. "Teklifleri Gör" ekranındaki teklifler ise henüz örnek veri — sağlayıcıların gerçek teklif göndermesi ayrı bir özellik, istersen onu da ekleyebiliriz.
        </p>
      </div>
    );
  }

  if (gateCheck.checking) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <Loader2 size={20} className="animate-spin mx-auto" style={{ color: "#8A8368" }} />
      </div>
    );
  }

  if (!gateCheck.ok) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(194,135,43,0.15)" }}>
          <AlertCircle size={22} style={{ color: "#C2872B" }} />
        </div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>Önce profilini tamamla</h2>
        <p className="text-sm mb-6" style={{ color: "#5C5744" }}>{gateCheck.reason}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={onGoToProfile || onBack} className="px-5 py-2.5 rounded-full text-sm font-medium text-white" style={{ background: "#2563EB" }}>Profilime Git</button>
          <button onClick={onBack} className="px-5 py-2.5 rounded-full text-sm font-medium border" style={{ borderColor: "#D9D0BA", color: "#1B2B24" }}>Vazgeç</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>{isEditing ? "İlanı Düzenle" : "İş İlanı Ver"}</h1>
      <p className="text-sm mb-6" style={{ color: "#5C5744" }}>{isEditing ? "İlanında eksik/yanlış bir şey mi vardı? Düzelt, kaydet." : "İhtiyacını anlat, uygun kişiler sana anlık teklif göndersin."}</p>

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
            {/* Listede aradığını bulamayan için — bkz. CUSTOM_CATEGORY_ID notu. */}
            <option value={CUSTOM_CATEGORY_ID}>Diğer (belirtiniz)</option>
          </select>
          {categoryId && categoryId !== CUSTOM_CATEGORY_ID && (
            <p className="text-xs mt-1.5" style={{ color: "#3F7D5C" }}>
              {mode === "local"
                ? `${cityName}'de bu kategoride ${nearbyCount} kayıtlı sağlayıcı var`
                : `Bu kategoride ${nearbyCount > 0 ? nearbyCount : "çok sayıda"} uzaktan çalışan sağlayıcı var`}
            </p>
          )}
          {categoryId === CUSTOM_CATEGORY_ID && (
            <div className="mt-2.5">
              <input
                value={customCategoryLabel}
                onChange={(e) => setCustomCategoryLabel(e.target.value)}
                placeholder="Hangi hizmet? Örn. Halı saha kurulumu"
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
              />
              <p className="text-xs mt-1.5" style={{ color: "#8A8368" }}>
                Bu kategori henüz listede yok — ilanın "Diğer" altında yayınlanır ve ekibimize bir kategori talebi olarak iletilir.
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium" style={{ color: "#5C5744" }}>Başlık</label>
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
            placeholder="Örn. 2+1 daire boyama işi"
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
          />
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

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 rounded-full text-sm font-medium text-white mt-2 flex items-center justify-center gap-2"
          style={{ background: "#C2872B", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? (isEditing ? "Kaydediliyor..." : "Yayınlanıyor...") : (isEditing ? "Değişiklikleri Kaydet" : "İlanı Yayınla")}
        </button>
      </div>
    </div>
  );
}

function AIMatchView({ job, onBack, onSelectListing, realListings }) {
  const [status, setStatus] = useState("loading"); // loading | done | error
  const [matches, setMatches] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const category = CATEGORIES.find((c) => c.id === job?.categoryId);
  const cityName = CITIES.find((c) => c.id === job?.cityId)?.name;

  // Aday havuzu — eskiden sadece sabit demo LISTINGS'ten geliyordu, gerçek
  // vitrinler (realListings) hiç dahil edilmiyordu; yani AI eşleştirme
  // gerçek bir sağlayıcıyı asla önermiyordu. category alanı (slug) her
  // ikisinde de aynı uzayı paylaşıyor (categories_seed.sql), o yüzden aynı
  // filtre ikisine de doğrudan uygulanabiliyor.
  const candidates = [...LISTINGS, ...(realListings || [])].filter((l) => {
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

        // Doğrudan api.anthropic.com'a, tarayıcıdan, API anahtarı hiç
        // eklenmeden çağrılıyordu — bu yüzden her zaman başarısız oluyordu
        // (checkReviewMedia/checkPhotoContent/writeWithAI'nin kullandığı
        // doğru /api/claude sunucu route'u kullanılmıyordu, muhtemelen
        // gözden kaçmıştı). Aynı desene çekildi.
        const response = await fetch("/api/claude", {
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

function MessagesView({ onBack, initialContact, currentUserId, onOpenListing }) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS.map((c) => ({ ...c, demo: true })));
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(!!currentUserId);
  const [sending, setSending] = useState(false);
  const [gateError, setGateError] = useState("");
  const [draftingMessage, setDraftingMessage] = useState(false);
  // Gerçek, kalıcı engelleme/şikayet (bkz. supabase/user_safety.sql) —
  // önceki "Destek Talepleri" ekranı tamamen sahteydi, hiçbir yere yazmıyordu.
  const [myBlockOfThem, setMyBlockOfThem] = useState(false); // ben onu engelledim mi
  const [blockChecking, setBlockChecking] = useState(false);
  const [blockError, setBlockError] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("uygunsuz_mesaj");
  const [reportDetail, setReportDetail] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState("");
  // Gerçek "iş tamamlandı" onayı — değerlendirme güvenliğinin asıl kalıcı
  // çözümü. jobs.client_id her zaman hizmeti ALAN taraf (bir vitrine mesaj
  // atarak geldiyse de, kendi iş ilanına gelen bir teklifi kabul ettiyse de
  // aynı — bkz. schema (3).sql). Sadece o taraf "Hizmeti Aldım" diyebilir;
  // state 'delivered' olunca ListingDetail'deki değerlendirme kapısı açılır.
  const [activeJob, setActiveJob] = useState(null); // { clientId, state, serviceId, providerId }
  const [markingDelivered, setMarkingDelivered] = useState(false);
  const [deliveredError, setDeliveredError] = useState("");
  const [openingReview, setOpeningReview] = useState(false);

  // Gerçek konuşmaları messages/jobs/profiles tablolarından yükler. Anlık
  // (realtime) değil — sayfa/görünüm yenilendiğinde yeniden çekiliyor.
  const loadRealConversations = async () => {
    if (!currentUserId) return { realConvos: [], realThreads: {} };
    const { data: myMessages, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order("created_at", { ascending: true });
    if (error || !myMessages || myMessages.length === 0) return { realConvos: [], realThreads: {} };

    const byJob = {};
    myMessages.forEach((m) => { (byJob[m.job_id] = byJob[m.job_id] || []).push(m); });
    const jobIds = Object.keys(byJob);

    const { data: jobsData } = await supabase.from("jobs").select("id, title, service_id").in("id", jobIds);
    const jobsById = {};
    (jobsData || []).forEach((j) => { jobsById[j.id] = j; });

    // Bir görüşme belirli bir vitrin için açıldıysa (job.service_id), o
    // vitrinin sahibine gösterilecek isim PAYLAŞILAN profil adı değil, o
    // vitrinin display_name'i olmalı — yoksa aynı kişinin iki farklı vitrini
    // müşteriye aynı isimle görünür (bkz. vitrin_media.sql'deki not).
    const serviceIds = [...new Set((jobsData || []).map((j) => j.service_id).filter(Boolean))];
    const servicesById = {};
    if (serviceIds.length > 0) {
      const { data: servicesData } = await supabase.from("services").select("id, display_name, provider_id").in("id", serviceIds);
      (servicesData || []).forEach((s) => { servicesById[s.id] = s; });
    }

    const otherIds = new Set();
    jobIds.forEach((jid) => byJob[jid].forEach((m) => {
      const otherId = m.sender_id === currentUserId ? m.receiver_id : m.sender_id;
      if (otherId && otherId !== currentUserId) otherIds.add(otherId);
    }));
    const profilesById = {};
    if (otherIds.size > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, business_name")
        .in("id", Array.from(otherIds));
      (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
    }

    const realThreads = {};
    const realConvos = jobIds
      .map((jid) => {
        const msgs = [...byJob[jid]].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const last = msgs[msgs.length - 1];
        const otherId = last.sender_id === currentUserId ? last.receiver_id : last.sender_id;
        const otherProfile = profilesById[otherId];
        // Bu görüşmenin bağlı olduğu vitrin, karşı tarafın SAHİBİ olduğu bir
        // vitrinse (yani biz bu vitrine mesaj atan taraf isek) vitrinin
        // display_name'ini kullan — kendi vitrinimize gelen bir müşteri
        // konuşmasında ise bu koşul sağlanmaz, paylaşılan isme düşülür.
        const vitrin = servicesById[jobsById[jid]?.service_id];
        const vitrinName = vitrin && vitrin.provider_id === otherId ? (vitrin.display_name || "").trim() : "";
        const otherName = vitrinName || (otherProfile?.business_name && otherProfile.business_name.trim()) || otherProfile?.full_name || "Kullanıcı";
        realThreads[jid] = msgs.map((m) => ({
          id: m.id, sender: m.sender_id === currentUserId ? "me" : "them", text: m.body, time: formatMessageTime(m.created_at),
        }));
        return {
          id: jid,
          name: otherName,
          initials: otherName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
          lastMessage: last.body,
          time: formatMessageTime(last.created_at),
          unread: 0,
          listingTitle: jobsById[jid]?.title || "",
          otherId,
          sortTime: last.created_at,
        };
      })
      .sort((a, b) => new Date(b.sortTime) - new Date(a.sortTime));

    return { realConvos, realThreads };
  };

  // İlk açılışta gerçek konuşmalarımı yükle.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { realConvos, realThreads } = await loadRealConversations();
      if (cancelled) return;
      if (Object.keys(realThreads).length > 0) setThreads((t) => ({ ...t, ...realThreads }));
      if (realConvos.length > 0) setConversations((prev) => [...realConvos, ...prev.filter((c) => c.demo)]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // Bir ilan/profilden "İletişime Geç" ile gelindiğinde: gerçek bir sağlayıcıysa
  // (providerId + categoryId, yani gerçek bir services satırından geldiyse) o
  // konuşma için gerçek bir jobs satırı bulur/oluşturur ve mesajları oraya bağlar.
  // Değilse (demo akışlar: "Aranıyor" panosu, Nail Art) eski local-only davranış sürer.
  useEffect(() => {
    if (!initialContact) return;

    if (!currentUserId || !initialContact.providerId || !initialContact.categoryId) {
      setConversations((prev) => {
        const existing = prev.find((c) => c.demo && c.name === initialContact.name);
        if (existing) { setActiveId(existing.id); return prev; }
        const demoIds = prev.filter((c) => c.demo).map((c) => c.id);
        const newId = Math.max(...demoIds, 0) + 1;
        setThreads((t) => ({ ...t, [newId]: [] }));
        setActiveId(newId);
        return [
          { id: newId, demo: true, name: initialContact.name, initials: initialContact.name.split(" ").map((w) => w[0]).join("").slice(0, 2), lastMessage: "Yeni sohbet", time: "Şimdi", unread: 0, listingTitle: initialContact.listingTitle },
          ...prev,
        ];
      });
      return;
    }

    if (initialContact.providerId === currentUserId) return; // kendine mesaj atamaz

    let cancelled = false;
    (async () => {
      setLoading(true);
      // Gerçek bir iş ilanından (PostJobView → jobs) geliniyorsa o job zaten
      // var — yeni bir tane oluşturmaya gerek yok, doğrudan onu kullanıyoruz.
      let jobId = initialContact.existingJobId || null;
      if (!jobId) {
        const threadTitle = `${initialContact.listingTitle} hakkında görüşme`;
        // Eskiden burada iki ayrı sorgu vardı (var mı diye bak, yoksa
        // insert et) — aralarında kilit olmadığı için art arda iki kez
        // tetiklenince (örn. StrictMode) aynı client+vitrin için iki jobs
        // satırı oluşabiliyordu (canlı testte yakalandı — bkz.
        // dedupe_jobs.sql). Artık tek, atomik bir RPC çağrısı.
        const { data: foundJobId, error: jobError } = await supabase.rpc("find_or_create_job", {
          p_service_id: initialContact.listingId || null,
          p_category_id: initialContact.categoryId,
          p_title: threadTitle,
        });
        if (jobError || !foundJobId) { if (!cancelled) setLoading(false); return; }
        jobId = foundJobId;
      }
      if (cancelled) return;

      const { realConvos, realThreads } = await loadRealConversations();
      if (cancelled) return;
      if (Object.keys(realThreads).length > 0) setThreads((t) => ({ ...t, ...realThreads }));
      setConversations((prev) => {
        const merged = [...realConvos, ...prev.filter((c) => c.demo)];
        if (!merged.find((c) => c.id === jobId)) {
          merged.unshift({
            id: jobId,
            name: initialContact.name,
            initials: initialContact.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
            lastMessage: "Yeni sohbet", time: "Şimdi", unread: 0, listingTitle: initialContact.listingTitle, otherId: initialContact.providerId,
          });
        }
        return merged;
      });
      setActiveId(jobId);
      setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContact?.providerId, initialContact?.categoryId, initialContact?.listingTitle, initialContact?.existingJobId]);

  const active = conversations.find((c) => c.id === activeId);
  const activeMessages = threads[activeId] || [];

  useEffect(() => {
    if (!active?.otherId || active.demo || !currentUserId) { setMyBlockOfThem(false); return; }
    let cancelled = false;
    (async () => {
      setBlockChecking(true);
      const { data } = await supabase
        .from("user_blocks")
        .select("id")
        .eq("blocker_id", currentUserId)
        .eq("blocked_id", active.otherId)
        .maybeSingle();
      if (!cancelled) { setMyBlockOfThem(!!data); setBlockChecking(false); }
    })();
    setShowReportForm(false);
    setReportSubmitted(false);
    return () => { cancelled = true; };
  }, [active?.otherId, currentUserId]);

  useEffect(() => {
    if (!activeId || active?.demo || !currentUserId) { setActiveJob(null); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("jobs").select("client_id, state, service_id, services(provider_id)").eq("id", activeId).maybeSingle();
      if (!cancelled) setActiveJob(data ? { clientId: data.client_id, state: data.state, serviceId: data.service_id, providerId: data.services?.provider_id || null } : null);
    })();
    setDeliveredError("");
    return () => { cancelled = true; };
  }, [activeId, active?.demo, currentUserId]);

  const markDelivered = async () => {
    if (!activeId || !currentUserId || activeJob?.clientId !== currentUserId) return;
    setDeliveredError("");
    setMarkingDelivered(true);
    const { error } = await supabase.from("jobs").update({ state: "delivered" }).eq("id", activeId).eq("client_id", currentUserId);
    setMarkingDelivered(false);
    if (error) { setDeliveredError(`İşaretlenemedi: ${error.message}`); return; }
    setActiveJob((j) => (j ? { ...j, state: "delivered" } : j));
  };

  // Adil olsun diye eklendi: eskiden SADECE müşteri "Hizmeti Aldım"
  // diyebiliyordu — sağlayıcı gerçekten işi yapmış olsa bile müşteri
  // onaylamazsa (unutursa, geciktirse) hiçbir hakkı yoktu, değerlendirme de
  // hiç açılmıyordu. Artık sağlayıcı kendi tarafından "Hizmeti Verdim"
  // diyebiliyor — ikisinden hangisi önce işaretlerse iş 'delivered' sayılır
  // (bkz. supabase/provider_delivery_confirmation.sql).
  const markProviderDelivered = async () => {
    if (!activeId || !currentUserId || activeJob?.providerId !== currentUserId) return;
    setDeliveredError("");
    setMarkingDelivered(true);
    const { error } = await supabase.from("jobs").update({ state: "delivered", provider_delivered_at: new Date().toISOString() }).eq("id", activeId);
    setMarkingDelivered(false);
    if (error) { setDeliveredError(`İşaretlenemedi: ${error.message}`); return; }
    setActiveJob((j) => (j ? { ...j, state: "delivered" } : j));
  };

  // "Değerlendirme Yaz" mesajlaşma ekranından doğrudan vitrine gitsin diye —
  // önceden hizmeti aldım demeden sonra kullanıcı ilanı tekrar isim yazıp
  // aramak zorunda kalıyordu (canlı testte fark edildi).
  const goToReview = async () => {
    if (!activeJob?.serviceId || !onOpenListing) return;
    setOpeningReview(true);
    const { data } = await supabase
      .from("services")
      .select("*, profiles(*), categories(*)")
      .eq("id", activeJob.serviceId)
      .maybeSingle();
    setOpeningReview(false);
    if (data) onOpenListing(mapServiceRowToListing(data));
  };

  // İlk mesajı ne yazacağını bilememe sürtünmesini azaltmak için — sadece
  // henüz hiç mesaj atılmamış gerçek bir sohbette görünür, taslağı input'a
  // yazar (otomatik göndermez, kullanıcı düzenleyip kendi göndersin).
  const suggestOpeningMessage = async () => {
    if (!active) return;
    setDraftingMessage(true);
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 150,
          messages: [{ role: "user", content: `Bir hizmet pazaryerinde bir müşteri "${active.name}" adlı sağlayıcıyla "${active.listingTitle || "bir hizmet"}" konusunda ilk kez iletişime geçiyor. Onun yerine, nazik, net ve kısa (en fazla 3 cümle) bir açılış mesajı yaz — ihtiyacını kısaca belirtsin ve müsaitlik/fiyat sorsun. Türkçe, samimi ama profesyonel bir dille.\n\nSADECE mesaj metnini yaz, tırnak işareti veya başka hiçbir şey ekleme.` }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n").trim();
      if (text) setInput(text);
    } catch {
      // sessizce vazgeç — kullanıcı zaten kendi yazabilir
    } finally {
      setDraftingMessage(false);
    }
  };

  const toggleBlock = async () => {
    if (!active?.otherId || !currentUserId) return;
    setBlockError("");
    setBlockChecking(true);
    if (myBlockOfThem) {
      const { error } = await supabase.from("user_blocks").delete().eq("blocker_id", currentUserId).eq("blocked_id", active.otherId);
      setBlockChecking(false);
      if (error) { setBlockError(`Engel kaldırılamadı: ${error.message}`); return; }
      setMyBlockOfThem(false);
    } else {
      const { error } = await supabase.from("user_blocks").insert({ blocker_id: currentUserId, blocked_id: active.otherId });
      setBlockChecking(false);
      if (error) { setBlockError(`Engellenemedi: ${error.message}`); return; }
      setMyBlockOfThem(true);
    }
  };

  const submitReport = async () => {
    if (!active?.otherId || !currentUserId) return;
    setReportError("");
    setReportSubmitting(true);
    const { error } = await supabase.from("user_reports").insert({
      reporter_id: currentUserId,
      reported_id: active.otherId,
      reason: reportReason,
      detail: reportDetail.trim() || null,
      job_id: active.demo ? null : activeId,
    });
    setReportSubmitting(false);
    if (error) { setReportError(`Şikayet gönderilemedi: ${error.message}`); return; }
    setReportSubmitted(true);
    setReportDetail("");
  };

  const sendDemoMessage = () => {
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

  const sendRealMessage = async () => {
    if (!active?.otherId || !currentUserId) return;
    const body = input.trim();
    if (!body) return;
    setSending(true);
    // Aramızda herhangi bir yönde engel varsa (ben onu engelledim ya da o beni
    // engelledi) mesaj gitmez — yönü açıklamıyor, sadece engelli olduğunu
    // söylüyor (bkz. supabase/user_safety.sql'deki is_blocked_between).
    const { data: blocked } = await supabase.rpc("is_blocked_between", { other_id: active.otherId });
    if (blocked) {
      setSending(false);
      setGateError("Bu kişiyle mesajlaşamıyorsun.");
      return;
    }
    const profileGate = await checkProfileGate(currentUserId);
    if (!profileGate.ok) {
      setSending(false);
      setGateError(profileGate.reason);
      return;
    }
    const gate = await checkPhoneGate(currentUserId);
    if (!gate.ok) {
      setSending(false);
      setGateError(gate.reason);
      return;
    }
    const { data, error } = await supabase
      .from("messages")
      .insert({ job_id: activeId, sender_id: currentUserId, receiver_id: active.otherId, body })
      .select()
      .single();
    setSending(false);
    if (error || !data) {
      // Eskiden burada input zaten temizlenmişti, hata sessizce yutuluyordu —
      // kullanıcı yazdığı mesajı kaybediyordu, hiçbir açıklama görmüyordu.
      // Artık hız sınırı gibi gerçek bir red sebebi varsa (bkz.
      // growth_features_batch.sql) görünür oluyor, metin de kaybolmuyor.
      setGateError(error?.message || "Mesaj gönderilemedi, tekrar dener misin?");
      return;
    }
    setInput("");
    const time = formatMessageTime(data.created_at);
    setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] || []), { id: data.id, sender: "me", text: body, time }] }));
    setConversations((cs) => cs.map((c) => (c.id === activeId ? { ...c, lastMessage: body, time } : c)));
    // Şüpheli içerik taraması — sessiz, engellemeyen, mesaj zaten gönderildi.
    checkAndFlagContent("message", data.id, body, currentUserId);
  };

  const sendMessage = () => {
    if (!input.trim() || !activeId) return;
    if (active?.demo) sendDemoMessage();
    else sendRealMessage();
  };

  if (activeId && active) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
        <button onClick={() => setActiveId(null)} className="flex items-center gap-1 text-sm mb-3 shrink-0" style={{ color: "#5C5744" }}>
          <ArrowLeft size={16} /> Sohbetler
        </button>
        <div className="flex items-center gap-2.5 pb-3 border-b mb-3 shrink-0" style={{ borderColor: "#D9D0BA" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0" style={{ background: "#1B2B24" }}>{active.initials}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium" style={{ color: "#1B2B24" }}>{active.name}</p>
              {active.demo && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#F0EAD6", color: "#8A8368" }}>Örnek</span>
              )}
            </div>
            <p className="text-[11px]" style={{ color: "#8A8368" }}>{active.listingTitle}</p>
          </div>
          {!active.demo && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleBlock}
                disabled={blockChecking}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-full"
                style={myBlockOfThem ? { background: "#3F7D5C", color: "white" } : { color: "#9C4A3C" }}
              >
                {myBlockOfThem ? "Engeli Kaldır" : "Engelle"}
              </button>
              <button
                onClick={() => setShowReportForm((v) => !v)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-full"
                style={{ color: "#8A8368" }}
              >
                Şikayet Et
              </button>
            </div>
          )}
        </div>

        {blockError && (
          <p className="text-xs mb-2 px-3 py-2 rounded-lg shrink-0" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{blockError}</p>
        )}

        {showReportForm && (
          <div className="rounded-xl border p-3 mb-3 shrink-0" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            {reportSubmitted ? (
              <div className="text-center py-2">
                <Check size={16} style={{ color: "#3F7D5C" }} className="mx-auto mb-1" />
                <p className="text-xs" style={{ color: "#5C5744" }}>Şikayetin kaydedildi.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold mb-2" style={{ color: "#1B2B24" }}>Bu kişiyi şikayet et</p>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-none mb-2"
                  style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
                >
                  <option value="uygunsuz_mesaj">Taciz / uygunsuz mesaj</option>
                  <option value="sahte_profil">Sahte profil</option>
                  <option value="dolandiricilik">Dolandırıcılık şüphesi</option>
                  <option value="diger">Diğer</option>
                </select>
                <textarea
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  placeholder="Kısaca ne olduğunu anlat (isteğe bağlı)"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-none mb-2"
                  style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
                />
                {reportError && <p className="text-xs mb-2" style={{ color: "#9C4A3C" }}>{reportError}</p>}
                <button
                  onClick={submitReport}
                  disabled={reportSubmitting}
                  className="text-xs font-bold px-3.5 py-2 rounded-full text-white flex items-center gap-1.5"
                  style={{ background: "#9C4A3C", opacity: reportSubmitting ? 0.7 : 1 }}
                >
                  {reportSubmitting && <Loader2 size={12} className="animate-spin" />}
                  Şikayeti Gönder
                </button>
              </>
            )}
          </div>
        )}

        {!active.demo && activeJob && (
          activeJob.state === "delivered" ? (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs mb-3 shrink-0" style={{ background: "rgba(63,125,92,0.1)", color: "#3F7D5C" }}>
              <span className="flex items-center gap-2">
                <Check size={13} className="shrink-0" />
                {activeJob.clientId === currentUserId
                  ? "Hizmeti aldığını işaretledin — değerlendirme yazabilirsin."
                  : activeJob.providerId === currentUserId
                  ? "İşi teslim ettin olarak işaretledin."
                  : "İş teslim edildi olarak işaretlendi."}
              </span>
              {activeJob.clientId === currentUserId && activeJob.serviceId && (
                <button onClick={goToReview} disabled={openingReview} className="font-bold shrink-0 flex items-center gap-1" style={{ color: "#2563EB" }}>
                  {openingReview && <Loader2 size={11} className="animate-spin" />}
                  Değerlendirme Yaz
                </button>
              )}
            </div>
          ) : activeJob.clientId === currentUserId ? (
            <div className="rounded-lg p-2.5 mb-3 shrink-0" style={{ background: "#F8F4E9", border: "1px solid #D9D0BA" }}>
              <p className="text-xs mb-1.5" style={{ color: "#5C5744" }}>Hizmeti aldıysan işaretle — değerlendirme yazabilmen için gerekiyor.</p>
              {deliveredError && <p className="text-xs mb-1.5" style={{ color: "#9C4A3C" }}>{deliveredError}</p>}
              <button
                onClick={markDelivered}
                disabled={markingDelivered}
                className="text-xs font-bold px-3 py-1.5 rounded-full text-white flex items-center gap-1.5"
                style={{ background: "#3F7D5C", opacity: markingDelivered ? 0.7 : 1 }}
              >
                {markingDelivered && <Loader2 size={12} className="animate-spin" />}
                Hizmeti Aldım
              </button>
            </div>
          ) : activeJob.providerId === currentUserId ? (
            // Adil olsun diye: müşteri onaylamazsa (unutursa, geciktirse)
            // sağlayıcının hiçbir hakkı yoktu, değerlendirme de hiç
            // açılmıyordu. Artık sağlayıcı da kendi tarafından işaretleyebiliyor.
            <div className="rounded-lg p-2.5 mb-3 shrink-0" style={{ background: "#F8F4E9", border: "1px solid #D9D0BA" }}>
              <p className="text-xs mb-1.5" style={{ color: "#5C5744" }}>Hizmeti verdiysen işaretle — müşteri onaylamasa bile bu, teslim edildiğini kayda geçirir.</p>
              {deliveredError && <p className="text-xs mb-1.5" style={{ color: "#9C4A3C" }}>{deliveredError}</p>}
              <button
                onClick={markProviderDelivered}
                disabled={markingDelivered}
                className="text-xs font-bold px-3 py-1.5 rounded-full text-white flex items-center gap-1.5"
                style={{ background: "#3F7D5C", opacity: markingDelivered ? 0.7 : 1 }}
              >
                {markingDelivered && <Loader2 size={12} className="animate-spin" />}
                Hizmeti Verdim
              </button>
            </div>
          ) : null
        )}

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {activeMessages.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-xs mb-2" style={{ color: "#8A8368" }}>Henüz mesaj yok, ilk mesajı sen gönder.</p>
              {!active.demo && (
                <button
                  onClick={suggestOpeningMessage}
                  disabled={draftingMessage}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "#EFF6FF", color: "#2563EB", opacity: draftingMessage ? 0.7 : 1 }}
                >
                  {draftingMessage ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                  {draftingMessage ? "Yazılıyor..." : "AI ile Taslak Öner"}
                </button>
              )}
            </div>
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

        {gateError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs mt-2 shrink-0" style={{ background: "#FDECEC", color: "#B3261E" }}>
            <Lock size={13} className="shrink-0" />
            <span>{gateError}{gateError.includes("doğrula") && <> — <span className="underline">Profilinden doğrula</span>.</>}</span>
          </div>
        )}
        {!active.demo && myBlockOfThem ? (
          <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t shrink-0" style={{ borderColor: "#D9D0BA" }}>
            <p className="text-xs" style={{ color: "#8A8368" }}>Bu kişiyi engelledin, mesaj gönderemezsin.</p>
            <button onClick={toggleBlock} className="text-xs font-bold shrink-0" style={{ color: "#3F7D5C" }}>Engeli Kaldır</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-3 mt-2 border-t shrink-0" style={{ borderColor: "#D9D0BA" }}>
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); if (gateError) setGateError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Mesaj yaz..."
              className="flex-1 px-3.5 py-2.5 rounded-full border text-sm outline-none"
              style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
            />
            <button onClick={sendMessage} disabled={sending} className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "#2FBF71", opacity: sending ? 0.6 : 1 }}>
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-6" style={{ color: "#1B2B24" }}>Mesajlar</h1>
      {loading && (
        <div className="flex items-center gap-2 mb-4">
          <Loader2 size={14} className="animate-spin" style={{ color: "#8A8368" }} />
          <span className="text-xs" style={{ color: "#8A8368" }}>Konuşmalar yükleniyor...</span>
        </div>
      )}
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
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#1B2B24" }}>{c.name}</p>
                  {c.demo && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: "#F0EAD6", color: "#8A8368" }}>Örnek</span>
                  )}
                </div>
                <span className="text-[11px] shrink-0" style={{ color: "#8A8368" }}>{c.time}</span>
              </div>
              {/* Hangi ilan/vitrinle ilgili olduğu eskiden sadece konuşmayı
                  AÇINCA görünüyordu — birden fazla ilanı olan biri listeye
                  bakınca benzer mesajları karıştırabiliyordu (kullanıcının
                  fark ettiği gerçek bir sorun). Artık listede de görünüyor. */}
              {c.listingTitle && (
                <p className="text-[11px] truncate font-medium" style={{ color: "#2563EB" }}>{c.listingTitle}</p>
              )}
              <p className="text-xs truncate" style={{ color: c.unread > 0 ? "#1B2B24" : "#8A8368" }}>{c.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Lansman fiyatlandırması (esrdgmnc@gmail.com ile birlikte karara bağlandı —
// bkz. supabase/pro_plan.sql'deki not). Yıllık fiyatlar "ilk yıla özel"
// indirimli fiyatlar (159×12=1908 yerine 799, 649×12=7788 yerine 3999) —
// 2. yıldan itibaren ne olacağı henüz karara bağlanmadı/kodlanmadı, şimdilik
// sadece görünen fiyat bu (2026-09-08, kullanıcının kararı).
const PLANS = [
  {
    // priceYearly: 1590 (159×10) yerine ilk yıla özel indirimli fiyat —
    // kullanıcının kararı (2026-09-08). "İlk yıla özel" etiketi PricingView'da
    // fiyatın yanında gösteriliyor (bkz. yearlyIntroNote).
    id: "standart", name: "Standart Üyelik", priceMonthly: 159, priceYearly: 799, trialMonths: 1, currency: "₺",
    tagline: "Herkes için tek, basit plan",
    features: [
      "2 vitrin dahil", "Sınırsız teklif", "Tam profil sayfası (video, sertifika, CV)", "Mesajlaşma + bildirimler",
      "AI eşleştirmede yer alma", "Harita ve arama görünürlüğü", "Diğer tüm ilan ve vitrinleri görüntüleme",
    ],
    notIncluded: [],
    badge: null, highlight: false,
  },
];

const BOOST_PACKAGE = {
  id: "one-cikarma", name: "Öne Çıkarma Paketi", priceMonthly: 459, currency: "₺",
  tagline: "Seçtiğin bir vitrini öne çıkarır — Standart Üyeliğe ek, isteğe bağlı",
  features: [
    "Öne çıkan sağlayıcı rozeti", "Haritada ve aramada üstte görünme",
    "AI eşleştirmede öncelik", "Pazar Analizi'ne erişim (talep trendleri)", "Destek asistanında öncelikli sıra",
  ],
};

// Kısa süreli deneyip/kampanya yapmak isteyenler için — bilerek günlük birim
// fiyatı aylıktan yüksek (149₺/7gün ≈ 21,3₺/gün vs 459₺/30gün ≈ 15,3₺/gün),
// aylığa geçmeyi caydırmasın diye teşvik etsin diye. bkz. supabase/weekly_boost_addon.sql.
const WEEKLY_BOOST_PACKAGE = {
  id: "one-cikarma-haftalik", name: "Haftalık Öne Çıkarma", price: 149, days: 7,
};

// Birden fazla vitrin açmak isteyenler için (örn. iki ayrı uzmanlık alanını
// ayrı vitrinlerde sergilemek) — bkz. supabase/pro_plan.sql. Artık Planlar'da
// tam bir kart (kullanıcının kararı, bkz. sohbet geçmişi) — asıl teklif
// noktası hâlâ kullanıcının 2. vitrini açmak isteyip Hizmet Ekle'deki sınıra
// takıldığı an (bkz. CreateListingView), ama artık ön planda da görünür.
// Hediye metni: "her ayın ilk haftası" — gerçekten öyle çalışıyor, ödeme
// döngüsünden (aylık/yıllık) bağımsız olarak (bkz. pro_boost_monthly_fix.sql
// — eski hâli yıllık ödeyenlerde yılda bir kereye düşüyordu, gerçek bir hataydı).
const PRO_PACKAGE = {
  // priceYearly: 6490 (649×10) yerine ilk yıla özel indirimli fiyat — bkz. PLANS'taki aynı not.
  id: "pro", name: "Pro Üyelik", priceMonthly: 649, priceYearly: 3999, currency: "₺",
  tagline: "Birden fazla vitrin açmak isteyenler için",
  features: [
    "3 vitrin hakkı (Standart'ta 2)", "Sınırsız teklif",
    "Her ayın ilk haftası tüm vitrinlerin Öne Çıkarma Paketi hediyeli", "AI eşleştirmede öncelik",
  ],
};

function CreateListingView({ onBack, onCreated, userId, editingListing, onGoToProfile }) {
  const isEditing = !!editingListing;
  const [mode, setMode] = useState(editingListing?.mode || "local");
  const [providerName, setProviderName] = useState(editingListing?.provider || "");
  // "diger" (gerçek DB slug'ı) düzenlemede CUSTOM_CATEGORY_ID'ye ("diger-ozel",
  // sadece bu formun <select>'inde var olan sahte id) çeviriyoruz — yoksa
  // düzenlerken kategori seçili görünmez, serbest metin kutusu da açılmaz.
  const [categoryId, setCategoryId] = useState(editingListing?.category === "diger" ? CUSTOM_CATEGORY_ID : editingListing?.category || "");
  const [customCategoryLabel, setCustomCategoryLabel] = useState(editingListing?.customCategoryLabel || "");
  const [title, setTitle] = useState(editingListing?.title || "");
  const [desc, setDesc] = useState(editingListing?.desc || "");
  const [cityId, setCityId] = useState(() => deriveCityIdFromLabel(editingListing?.city) || "istanbul");
  const [district, setDistrict] = useState(() => (editingListing?.city || "").split(",")[0]?.trim() || "");
  const [price, setPrice] = useState(editingListing ? "" : "");
  const [homeServiceVal, setHomeServiceVal] = useState(editingListing?.homeService || "evde");
  const [photo, setPhoto] = useState(editingListing?.img && editingListing.img !== FALLBACK_LISTING_IMG ? { url: editingListing.img, name: "mevcut fotoğraf" } : null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categoryIdBySlug, setCategoryIdBySlug] = useState({});
  const [step, setStep] = useState("form"); // form | success
  const [created, setCreated] = useState(null);
  const [aiWriting, setAiWriting] = useState(false);
  const [moderation, setModeration] = useState(null); // { status: 'checking'|'approved'|'flagged', reason }
  const [recommendation, setRecommendation] = useState(null); // { product, pitch }
  const [recLoading, setRecLoading] = useState(false);

  // Kullanıcı geri bildirimi: profil/telefon eksikse önceden bu kontrol
  // sadece "Yayınla"ya basınca yapılıyordu — biri tüm formu doldurup
  // gönderdiğinde reddediliyor, formdan çıkıp profilini tamamlamaya
  // gidince (component unmount olduğu için) yazdığı her şey kayboluyordu.
  // Artık form hiç açılmadan, en baştan kontrol ediliyor.
  const [gateCheck, setGateCheck] = useState(isEditing ? { checking: false, ok: true } : { checking: true, ok: null });
  useEffect(() => {
    if (isEditing) { setGateCheck({ checking: false, ok: true }); return; }
    if (!userId) { setGateCheck({ checking: false, ok: true }); return; } // GATED_VIEWS zaten auth'suz buraya hiç gelmeye izin vermiyor
    let cancelled = false;
    (async () => {
      const profileGate = await checkProfileGate(userId);
      if (cancelled) return;
      if (!profileGate.ok) { setGateCheck({ checking: false, ok: false, reason: profileGate.reason }); return; }
      const phoneGate = await checkPhoneGate(userId);
      if (cancelled) return;
      setGateCheck({ checking: false, ok: phoneGate.ok, reason: phoneGate.ok ? "" : phoneGate.reason });
    })();
    return () => { cancelled = true; };
  }, [userId, isEditing]);

  // Ücretsiz vitrin sınırı: Standart Üyelik'te 1 vitrin, Pro Üyelik'te 3 vitrin
  // hakkı var (bkz. supabase/pro_plan.sql — subscription_plans.max_active_listings).
  // Sadece YENİ vitrin açarken kontrol ediyoruz — düzenlemede sınır uygulanmaz.
  const [vitrinLimit, setVitrinLimit] = useState({ checking: !isEditing, blocked: false, count: 0, cap: 1, planName: "Standart Üyelik" });
  const [upgrading, setUpgrading] = useState(false);

  // Güncel sonucu hem state'e yazıyor hem de doğrudan döndürüyor — handleSubmit
  // state'in henüz render'a yansımamış olma ihtimaline karşı dönen değeri kullanıyor.
  const checkVitrinLimit = async () => {
    if (isEditing || !userId) return { checking: false, blocked: false, count: 0, cap: 1, planName: "Standart Üyelik" };
    setVitrinLimit((v) => ({ ...v, checking: true }));
    const [{ count }, { cap, planName, hasExtraVitrinAddon }] = await Promise.all([
      supabase.from("services").select("id", { count: "exact", head: true }).eq("provider_id", userId).eq("active", true),
      getVitrinCapInfo(userId),
    ]);
    const realCount = count || 0;
    const result = { checking: false, blocked: cap != null && realCount >= cap, count: realCount, cap, planName, hasExtraVitrinAddon };
    setVitrinLimit(result);
    return result;
  };

  useEffect(() => { checkVitrinLimit(); }, [userId, isEditing]);

  const upgradeToPro = async () => {
    setUpgrading(true);
    const { error: rpcError } = await supabase.rpc("upgrade_to_pro");
    setUpgrading(false);
    if (rpcError) { setError(rpcError.message); return; }
    await checkVitrinLimit();
  };

  const buyExtraVitrinAddon = async () => {
    setUpgrading(true);
    const { error: rpcError } = await supabase.rpc("add_extra_vitrin_addon");
    setUpgrading(false);
    if (rpcError) { setError(rpcError.message); return; }
    await checkVitrinLimit();
  };

  const availableCategories = CATEGORIES.filter((c) => c.mode === mode || c.mode === "both");
  const cityName = CITIES.find((c) => c.id === cityId)?.name;

  // categories tablosundaki uuid'leri, arayüzün kullandığı slug'larla (temizlik, nakliye...)
  // eşleştiriyoruz — services.category_id gerçek bir uuid bekliyor.
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("categories")
      .select("id, slug")
      .then(({ data }) => {
        if (cancelled || !data) return;
        const map = {};
        data.forEach((c) => { map[c.slug] = c.id; });
        setCategoryIdBySlug(map);
      });
    return () => { cancelled = true; };
  }, []);

  // Düzenleme modunda mevcut fiyatı, price/price_type'tan okunabilir bir
  // metne çeviriyoruz — kullanıcı formda düzenlerken tekrar aynı formatı görsün.
  useEffect(() => {
    if (!editingListing) return;
    setPrice(editingListing.price || "");
  }, [editingListing]);

  const writeWithAI = async () => {
    if (!categoryId) { setError("Önce bir kategori seç, AI ona göre yazsın."); return; }
    setAiWriting(true);
    setError("");
    try {
      const catName = categoryId === CUSTOM_CATEGORY_ID ? customCategoryLabel.trim() : CATEGORIES.find((c) => c.id === categoryId)?.name || "";
      const prompt = `Bir hizmet pazaryeri uygulaması için ilan metni yaz. Kategori: "${catName}". ${title.trim() ? `Kullanıcının notu: "${title.trim()} ${desc.trim()}"` : "Kullanıcı henüz bir şey yazmadı, kategoriye uygun genel ve inandırıcı bir metin üret."}
SADECE şu JSON formatında yanıt ver, başka hiçbir metin ekleme:
{"title": "çekici, kısa bir ilan başlığı (en fazla 8 kelime)", "desc": "2-3 cümlelik, samimi ve profesyonel bir hizmet açıklaması"}`;
      // Not: api.anthropic.com'a doğrudan tarayıcıdan istek atılamaz (CORS + API
      // anahtarı gizliliği) — ListingDetail'deki checkReviewMedia'nın da yaptığı
      // gibi /api/claude sunucu route'u üzerinden gidiyoruz.
      const response = await fetch("/api/claude", {
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

  // GÜVENLİK: AI kontrolü artık burada karar vermiyor, sadece sunucudaki
  // gerçek kararı gösteriyor (bkz. app/api/listing-photo-check/route.js +
  // supabase/listing_photo_moderation.sql). Asıl zorlama artık services
  // tablosundaki trigger'da — bu fonksiyon sadece kullanıcıya "onaylandı/
  // reddedildi" geri bildirimi vermek için var, submit'i engelleme yetkisi
  // moderation state'inde değil, veritabanında.
  const checkPhotoContent = async (url, mimeType) => {
    setModeration({ status: "checking" });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/listing-photo-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ url, mimeType }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setModeration({ status: data.approved ? "approved" : "flagged", reason: data.reason });
    } catch (err) {
      // Fail-safe: eğer otomatik kontrol başarısız olursa, ONAYLAMA — incelemeye al.
      setModeration({ status: "flagged", reason: "Otomatik kontrol başarısız oldu, manuel incelemeye alındı." });
    }
  };

  const getRecommendation = async (listing) => {
    setRecLoading(true);
    try {
      const prompt = `Bir hizmet pazaryerinde yeni bir hizmet vitrini oluşturuldu. Başlık: "${listing.title}", kategori: "${CATEGORIES.find((c) => c.id === listing.category)?.name}". Bu sağlayıcıya, platformun sunduğu ücretli ek ürünlerden (Öne Çıkan Vitrin, Beceri Testi Rozeti, Görünürlük Paketi) birini kişiselleştirilmiş, samimi bir dille öner. SADECE şu JSON formatında yanıt ver: {"product": "Öne Çıkan Vitrin" | "Beceri Testi Rozeti" | "Görünürlük Paketi", "pitch": "2 cümlelik, o kişiye özel gerekçe"}`;
      const response = await fetch("/api/claude", {
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

  // Dosya seçilince artık doğrudan yüklemiyoruz — önce kırpma modalı açılıyor
  // (bkz. PhotoCropModal), gerçek yükleme kullanıcı "Kırp ve Kaydet"e basınca
  // uploadPhoto ile tetikleniyor.
  const [cropSrc, setCropSrc] = useState(null); // seçilen dosyanın obje URL'i
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
  };

  const uploadPhoto = async (file) => {
    setCropSrc(null);
    if (!file || !userId) return;
    setPhotoError("");
    setPhotoUploading(true);
    try {
      // profile-media zaten public bir bucket (profil fotoğrafı/portföy için
      // kurulmuştu) — ilan kapak fotoğrafları için de aynısını kullanıyoruz,
      // ayrı bir bucket/migration gerekmiyor.
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${userId}/listing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("profile-media").upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("profile-media").getPublicUrl(path);
      setPhoto({ url: data.publicUrl, name: file.name });
      // AI fotoğraf kontrolü — daha önce "lüks özellikler" kapsamında
      // ertelenmişti, checkPhotoContent fonksiyonu hazır duruyordu ama hiç
      // çağrılmıyordu. Yükleme bitince, storage'daki genel-erişim url'i ile
      // sunucu tarafı kontrolü tetikliyoruz (bkz. checkPhotoContent notu).
      checkPhotoContent(data.publicUrl, file.type);
    } catch (err) {
      setPhotoError(`Fotoğraf yüklenemedi: ${err.message}`);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!providerName.trim()) { setError("Görünecek isim/işletme adını yaz."); return; }
    if (!categoryId) { setError("Bir kategori seçmelisin."); return; }
    if (categoryId === CUSTOM_CATEGORY_ID && !customCategoryLabel.trim()) { setError("Hangi hizmet olduğunu yazmalısın."); return; }
    if (!title.trim()) { setError("Vitrin başlığı yazmalısın."); return; }
    if (!desc.trim()) { setError("Sunduğun hizmeti kısaca anlat."); return; }
    if (!price.trim()) { setError("Bir fiyat belirtmelisin."); return; }
    if (moderation?.status === "checking") { setError("Fotoğraf içerik kontrolü bitene kadar bekle."); return; }
    if (moderation?.status === "flagged") { setError("Kapak fotoğrafın incelemeye alındı, vitrini yayınlamadan önce fotoğrafı kaldır ya da değiştir."); return; }
    if (!userId) { setError("Vitrin yayınlamak için giriş yapmış olmalısın."); return; }
    // "Diğer" seçilince gerçek FK hedefi hep "diger" kategorisi — kullanıcının
    // yazdığı serbest metin ayrı bir kolonda duruyor (bkz. custom_category_label).
    const categoryDbId = categoryId === CUSTOM_CATEGORY_ID ? categoryIdBySlug["diger"] : categoryIdBySlug[categoryId];
    if (!categoryDbId) {
      setError("Bu kategori veritabanında henüz tanımlı değil (supabase/categories_seed.sql çalıştırıldı mı?).");
      return;
    }
    setError("");
    setSubmitting(true);
    if (!isEditing) {
      const profileGate = await checkProfileGate(userId);
      if (!profileGate.ok) { setSubmitting(false); setError(profileGate.reason); return; }
      const gate = await checkPhoneGate(userId);
      if (!gate.ok) { setSubmitting(false); setError(gate.reason); return; }
      // Vitrin sınırının istemci tarafındaki kontrolü sadece UX içindir — burada
      // da tekrar kontrol ediyoruz (sekme arkada açıkken sınır dolmuş olabilir).
      const freshLimit = await checkVitrinLimit();
      if (freshLimit.blocked) { setSubmitting(false); return; }
    }

    const { numeric: priceNumeric, priceType } = parsePriceInput(price.trim());
    const cityLabel = `${district.trim() ? district.trim() + ", " : ""}${cityName}`;
    const payload = {
      category_id: categoryDbId,
      title: title.trim(),
      description: desc.trim(),
      // Görünecek isim vitrine özel (services.display_name) — eskiden
      // profiles.business_name'i güncelliyordu, bu da bir vitrinde ismini
      // değiştirince diğer TÜM vitrinlerin de adını sessizce değiştiriyordu.
      display_name: providerName.trim(),
      price: priceNumeric,
      price_type: priceType,
      is_remote: mode === "remote",
      city: mode === "local" ? cityLabel : null,
      location: mode === "local" ? cityToLocationEwkt(cityId) : null,
      // "Nerede hizmet veriyorsun?" — eskiden hiçbir yere kaydedilmiyordu
      // (bkz. supabase/home_service_type.sql), sadece ekranda duran kozmetik
      // bir seçimdi.
      home_service_type: mode === "local" ? homeServiceVal : null,
      images: photo?.url ? [photo.url] : null,
      custom_category_label: categoryId === CUSTOM_CATEGORY_ID ? customCategoryLabel.trim() : null,
    };

    const { data, error: dbError } = isEditing
      ? await supabase
          .from("services")
          .update(payload)
          .eq("id", editingListing.dbId)
          .select("*, profiles(*), categories(*)")
          .single()
      : await supabase
          .from("services")
          .insert({ ...payload, provider_id: userId, active: true })
          .select("*, profiles(*), categories(*)")
          .single();

    if (dbError || !data) {
      setSubmitting(false);
      setError(`Vitrin kaydedilemedi: ${dbError?.message || "bilinmeyen bir hata oluştu"}`);
      return;
    }

    // Pro Üyelik'te, mevcut dönemin ilk 7 günü içindeysek Öne Çıkarma Paketi'ni
    // (yeniden) açar/yeniler — sağlayıcı bazlı olduğu için TÜM vitrinleri kapsar,
    // sadece yeni açılanı değil (bkz. supabase/pro_boost_recurring.sql). Sessizce
    // deniyoruz — uygun değilse RPC hiçbir şey yapmadan döner, akışı bozmaz.
    if (!isEditing) supabase.rpc("sync_pro_boost").then(() => {});

    // Şüpheli içerik taraması — sessiz, engellemeyen.
    checkAndFlagContent("service", data.id, `${title} ${desc}`.trim(), userId);

    // Listede olmayan bir kategori istendiyse, gerçekten görülmesi için
    // destek talebi kuyruğuna düşürüyoruz — sessiz, engellemeyen. Sadece yeni
    // vitrin açılışında (düzenlemede tekrar tekrar bilet açmayalım).
    if (!isEditing && categoryId === CUSTOM_CATEGORY_ID) {
      supabase.from("support_tickets").insert({
        reporter_id: userId,
        title: `Yeni kategori talebi: ${customCategoryLabel.trim()}`,
        category: "istek",
        summary: `Hizmet Ekle formunda "${customCategoryLabel.trim()}" kategorisi listede yoktu, kullanıcı "Diğer" ile devam etti. Vitrin başlığı: "${title.trim()}".`,
      }).then(() => {});
    }

    const listing = mapServiceRowToListing(data);
    setSubmitting(false);
    setCreated(listing);
    onCreated();
    setStep("success");
    if (!isEditing) getRecommendation(listing);
  };

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(47,191,113,0.15)" }}>
          <Check size={22} style={{ color: "#2FBF71" }} />
        </div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>{isEditing ? "Vitrinin güncellendi ✓" : "Vitrinin yayında! 🎉"}</h2>
        <p className="text-sm mb-6" style={{ color: "#5C5744" }}>
          {isEditing ? `"${created?.title}" değişiklikleri kaydedildi.` : `"${created?.title}" artık ana sayfada ve aramada görünüyor.`}
        </p>

        {!isEditing && recLoading && (
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

  if (gateCheck.checking) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <Loader2 size={20} className="animate-spin mx-auto" style={{ color: "#8A8368" }} />
      </div>
    );
  }

  if (!gateCheck.ok) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(194,135,43,0.15)" }}>
          <AlertCircle size={22} style={{ color: "#C2872B" }} />
        </div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>Önce profilini tamamla</h2>
        <p className="text-sm mb-6" style={{ color: "#5C5744" }}>{gateCheck.reason}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={onGoToProfile || onBack} className="px-5 py-2.5 rounded-full text-sm font-medium text-white" style={{ background: "#2563EB" }}>Profilime Git</button>
          <button onClick={onBack} className="px-5 py-2.5 rounded-full text-sm font-medium border" style={{ borderColor: "#D9D0BA", color: "#1B2B24" }}>Vazgeç</button>
        </div>
      </div>
    );
  }

  if (!isEditing && vitrinLimit.blocked) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <button onClick={onBack} className="flex items-center gap-1 text-sm mb-8" style={{ color: "#5C5744" }}>
          <ChevronLeft size={16} /> Geri
        </button>
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
          <Sparkles size={22} style={{ color: "#F59E0B" }} />
        </div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#1B2B24" }}>{vitrinLimit.planName} vitrin hakkını doldurdun</h2>
        <p className="text-sm mb-6" style={{ color: "#5C5744" }}>
          {vitrinLimit.planName === "Pro Üyelik"
            ? `Şu an ${vitrinLimit.count} aktif vitrinin var, ${vitrinLimit.hasExtraVitrinAddon ? "Ek Vitrin Paketi'yle birlikte" : "Pro Üyelik"} en fazla ${vitrinLimit.cap} vitrin hakkı veriyor.`
            : `Standart Üyelik'te ${vitrinLimit.cap} vitrin hakkın var, zaten kullandın. Pro Üyelik'e geçerek 3 vitrin açabilir, hizmetlerini (örn. mühendislik + nefes terapisi gibi ayrı alanları) ayrı ayrı vitrinlerde sergileyebilirsin.`}
        </p>
        {vitrinLimit.planName !== "Pro Üyelik" ? (
          <div className="rounded-2xl border-2 p-5 mb-6 text-left" style={{ borderColor: "#F59E0B", background: "#FFFBEB" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "#1B2B24" }}>Pro Üyelik — 649₺/ay</p>
            <ul className="text-xs space-y-1 mb-4" style={{ color: "#5C5744" }}>
              <li>• 3 vitrin hakkı, sınırsız teklif</li>
              <li>• Pro'ya geçtiğin ilk 7 gün açtığın her vitrin, Öne Çıkarma Paketi hediyeli</li>
              <li>• AI eşleştirmede öncelik</li>
            </ul>
            {error && <p className="text-xs mb-3" style={{ color: "#9C4A3C" }}>{error}</p>}
            <button
              onClick={upgradeToPro}
              disabled={upgrading}
              className="w-full py-2.5 rounded-full text-sm font-medium text-white flex items-center justify-center gap-1.5"
              style={{ background: "#F59E0B", opacity: upgrading ? 0.7 : 1 }}
            >
              {upgrading && <Loader2 size={13} className="animate-spin" />}
              Pro Üyelik'e Geç
            </button>
          </div>
        ) : !vitrinLimit.hasExtraVitrinAddon ? (
          <div className="rounded-2xl border-2 p-5 mb-6 text-left" style={{ borderColor: "#8B5CF6", background: "#F8F4E9" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "#1B2B24" }}>Ek Vitrin Paketi — 249₺/ay</p>
            <ul className="text-xs space-y-1 mb-4" style={{ color: "#5C5744" }}>
              <li>• 3 vitrin hakkına +3 daha ekler (toplam 6 vitrin)</li>
              <li>• Pro Üyeliğe ek, isteğe bağlı</li>
            </ul>
            {error && <p className="text-xs mb-3" style={{ color: "#9C4A3C" }}>{error}</p>}
            <button
              onClick={buyExtraVitrinAddon}
              disabled={upgrading}
              className="w-full py-2.5 rounded-full text-sm font-medium text-white flex items-center justify-center gap-1.5"
              style={{ background: "#8B5CF6", opacity: upgrading ? 0.7 : 1 }}
            >
              {upgrading && <Loader2 size={13} className="animate-spin" />}
              Ek Vitrin Paketi Al
            </button>
          </div>
        ) : null}
        <button onClick={onBack} className="text-xs font-medium" style={{ color: "#8A8368" }}>Şimdilik vazgeç</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          aspect={1}
          fileName="kapak-fotografi.jpg"
          onCancel={() => setCropSrc(null)}
          onCropped={uploadPhoto}
        />
      )}
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <h1 className="font-serif text-2xl mb-1" style={{ color: "#1B2B24" }}>{isEditing ? "Vitrini Düzenle" : "Hizmet Vitrini Oluştur"}</h1>
      <p className="text-sm mb-6" style={{ color: "#5C5744" }}>
        {isEditing ? "Vitrininin bilgilerini güncelle, kaydettiğinde hemen yansısın." : "Sunduğun hizmeti anlat, vitrinin hemen yayına girsin."}
      </p>

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
            {/* Listede aradığını bulamayan için — bkz. CUSTOM_CATEGORY_ID notu. */}
            <option value={CUSTOM_CATEGORY_ID}>Diğer (belirtiniz)</option>
          </select>
          {categoryId === CUSTOM_CATEGORY_ID && (
            <div className="mt-2.5">
              <input
                value={customCategoryLabel}
                onChange={(e) => setCustomCategoryLabel(e.target.value)}
                placeholder="Ne sunuyorsun? Örn. Halı saha kurulumu"
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
              />
              <p className="text-xs mt-1.5" style={{ color: "#8A8368" }}>
                Bu kategori henüz listede yok — vitrinin "Diğer" altında yayınlanır ve ekibimize bir kategori talebi olarak iletilir.
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium" style={{ color: "#5C5744" }}>Vitrin Başlığı</label>
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
              <label className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer shrink-0 group">
                <img src={photo.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                  <Camera size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={photoUploading} />
              </label>
            )}
            <label
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
              style={{ borderColor: "#D9D0BA", color: "#5C5744", opacity: photoUploading ? 0.6 : 1 }}
            >
              {photoUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              {photoUploading ? "Yükleniyor..." : photo ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={photoUploading} />
            </label>
          </div>
          {photoError && (
            <p className="text-[11px] mt-1.5" style={{ color: "#9C4A3C" }}>{photoError}</p>
          )}
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
                {[["evde", "Müşteri Konumu"], ["mekanda", "Kendi Konumum"], ["esnek", "İkisi de Olsun"]].map(([key, label]) => (
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

        <button
          onClick={handleSubmit}
          disabled={submitting || photoUploading}
          className="w-full py-3 rounded-full text-sm font-medium text-white mt-2 flex items-center justify-center gap-2"
          style={{ background: "#2FBF71", color: "#1B2B24", opacity: submitting || photoUploading ? 0.7 : 1 }}
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? (isEditing ? "Kaydediliyor..." : "Yayınlanıyor...") : isEditing ? "Değişiklikleri Kaydet" : "Vitrini Yayınla"}
        </button>
        {!isEditing && (
          <p className="text-[11px] text-center" style={{ color: "#8A8368" }}>
            Sertifika, CV ve video tanıtım eklemek için profilini de tamamlamayı unutma.
          </p>
        )}
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

function SupportChatView({ onBack, onReport, currentUserId }) {
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
      // Doğrudan api.anthropic.com'a, tarayıcıdan, API anahtarı hiç eklenmeden
      // çağrılıyordu — Destek Asistanı'nın kendisi bu yüzden hiç çalışmıyordu,
      // her mesajda sessizce "Bağlantı sorunu oluştu" hatasına düşüyordu.
      const response = await fetch("/api/claude", {
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
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 400, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      // Gerçekten kaydet — bkz. supabase/support_tickets.sql. Öncesinde bu
      // rapor sadece o anki tarayıcı oturumunun local state'inde duruyordu,
      // sayfa yenilenince kayboluyordu.
      if (currentUserId) {
        await supabase.from("support_tickets").insert({
          reporter_id: currentUserId, title: parsed.title, category: parsed.category, summary: parsed.summary, transcript: convoText,
        });
      }
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
        const response = await fetch("/api/claude", {
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

function AdminReportsView({ onBack, reports, userId, isAdmin }) {
  // Admin değilsen bu hâlâ "Destek Taleplerim" — sadece kendi bildirdiklerin
  // (RLS zaten öyle sınırlıyor). Admin isen (bkz. supabase/admin_role.sql)
  // gerçekten HERKESİN taleplerini görebiliyorsun, artık "Yönetim" ismini
  // hak ediyor, ve durum güncelleyebiliyorsun (open/reviewed/dismissed).
  const [realTickets, setRealTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadTickets = async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    let query = supabase
      .from("support_tickets")
      .select("id, title, category, summary, transcript, status, created_at, reporter_id")
      .order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("reporter_id", userId);
    const { data } = await query;
    let rows = data || [];
    if (isAdmin && rows.length > 0) {
      const reporterIds = [...new Set(rows.map((r) => r.reporter_id))];
      const { data: profilesData } = await supabase.from("profiles").select("id, full_name, business_name").in("id", reporterIds);
      const profilesById = {};
      (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
      rows = rows.map((r) => ({ ...r, reporterName: (profilesById[r.reporter_id]?.business_name || profilesById[r.reporter_id]?.full_name || "Bilinmiyor") }));
    }
    setRealTickets(rows);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isAdmin]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    const { error } = await supabase.from("support_tickets").update({ status }).eq("id", id);
    setUpdatingId(null);
    if (!error) setRealTickets((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const merged = [
    ...realTickets.map((r) => ({ ...r, time: formatRelativeTr(r.created_at) })),
    ...(isAdmin ? [] : reports), // bu oturumda az önce gönderilenler — admin görünümünde zaten DB'den geliyor
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <Inbox size={20} style={{ color: "#2563EB" }} />
        <h1 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>{isAdmin ? "Destek Talepleri (Yönetim)" : "Destek Taleplerim"}</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
        {isAdmin ? "Tüm kullanıcıların destek asistanına yazdığı ve bildirdiği talepler" : "Destek asistanına yazdığın ve bildirdiğin geçmiş talepler"}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-8"><Loader2 size={18} className="animate-spin" style={{ color: "#9CA3AF" }} /></div>
      ) : merged.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <Inbox size={28} className="mx-auto mb-2" style={{ color: "#D1D5DB" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>{isAdmin ? "Henüz bildirilen bir destek talebi yok." : "Henüz bildirdiğin bir destek talebi yok."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {merged.map((r) => {
            const meta = SUPPORT_CATEGORY_META[r.category] || SUPPORT_CATEGORY_META["diğer"];
            return (
              <div key={r.id} className="rounded-2xl border p-4" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-bold" style={{ color: "#0F1115" }}>{r.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${meta.color}18`, color: meta.color }}>{meta.label}</span>
                </div>
                {isAdmin && r.reporterName && (
                  <p className="text-[11px] mb-1" style={{ color: "#8A8368" }}>Bildiren: <span className="font-medium">{r.reporterName}</span></p>
                )}
                <p className="text-xs leading-relaxed mb-2" style={{ color: "#6B7280" }}>{r.summary}</p>
                <p className="text-[11px] mb-2" style={{ color: "#9CA3AF" }}>{r.time}</p>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    {["open", "reviewed", "dismissed"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(r.id, s)}
                        disabled={updatingId === r.id}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                        style={(r.status || "open") === s
                          ? { background: "#1B2B24", color: "#EFE8D8", borderColor: "#1B2B24" }
                          : { borderColor: "#D9D0BA", color: "#5C5744" }}
                      >
                        {s === "open" ? "Açık" : s === "reviewed" ? "İncelendi" : "Kapatıldı"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const REPORT_REASON_LABELS = {
  uygunsuz_mesaj: "Taciz / uygunsuz mesaj",
  sahte_profil: "Sahte profil",
  dolandiricilik: "Dolandırıcılık şüphesi",
  diger: "Diğer",
};

// Kullanıcı şikayetleri — user_safety.sql'de gerçek bir user_reports tablosu
// vardı (MessagesView'daki "Şikayet Et" oradan geliyor, gerçekten kaydediyor)
// ama bunu okuyan/inceleyen hiçbir ekran yoktu — şikayetler birikiyordu,
// kimse görmüyordu. Sadece admin (bkz. supabase/admin_role.sql) erişebilir.
function AdminUserReportsView({ onBack }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("user_reports")
      .select("id, reporter_id, reported_id, reason, detail, status, created_at")
      .order("created_at", { ascending: false });
    const rows = data || [];
    if (rows.length > 0) {
      const profileIds = [...new Set(rows.flatMap((r) => [r.reporter_id, r.reported_id]))];
      const { data: profilesData } = await supabase.from("profiles").select("id, full_name, business_name").in("id", profileIds);
      const profilesById = {};
      (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
      const nameOf = (id) => (profilesById[id]?.business_name || profilesById[id]?.full_name || "Bilinmiyor");
      setReports(rows.map((r) => ({ ...r, reporterName: nameOf(r.reporter_id), reportedName: nameOf(r.reported_id) })));
    } else {
      setReports([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    const { error } = await supabase.from("user_reports").update({ status }).eq("id", id);
    setUpdatingId(null);
    if (!error) setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} style={{ color: "#9C4A3C" }} />
        <h1 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>Kullanıcı Şikayetleri (Yönetim)</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Kullanıcıların mesajlaşma ekranından bildirdiği şikayetler</p>

      {loading ? (
        <div className="flex items-center justify-center py-8"><Loader2 size={18} className="animate-spin" style={{ color: "#9CA3AF" }} /></div>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <ShieldCheck size={28} className="mx-auto mb-2" style={{ color: "#D1D5DB" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Henüz bir şikayet yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl border p-4" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-bold" style={{ color: "#0F1115" }}>{r.reporterName} → {r.reportedName}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(156,74,60,0.12)", color: "#9C4A3C" }}>
                  {REPORT_REASON_LABELS[r.reason] || r.reason}
                </span>
              </div>
              {r.detail && <p className="text-xs leading-relaxed mb-2" style={{ color: "#6B7280" }}>{r.detail}</p>}
              <p className="text-[11px] mb-2" style={{ color: "#9CA3AF" }}>{formatRelativeTr(r.created_at)}</p>
              <div className="flex items-center gap-2">
                {["open", "reviewed", "dismissed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(r.id, s)}
                    disabled={updatingId === r.id}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                    style={(r.status || "open") === s
                      ? { background: "#1B2B24", color: "#EFE8D8", borderColor: "#1B2B24" }
                      : { borderColor: "#D9D0BA", color: "#5C5744" }}
                  >
                    {s === "open" ? "Açık" : s === "reviewed" ? "İncelendi" : "Kapatıldı"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// İlan şikayetleri — sahibinden.com'un "ilanı bildir" özelliğinin admin
// tarafı. user_reports'tan ayrı: burada bildirilen bir KİŞİ değil, bir
// vitrin/iş ilanının kendisi (yanlış kategori, sahte, kopya vb.).
function AdminListingReportsView({ onBack }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("listing_reports")
      .select("id, reporter_id, service_id, job_id, reason, detail, status, created_at")
      .order("created_at", { ascending: false });
    const rows = data || [];
    if (rows.length > 0) {
      const reporterIds = [...new Set(rows.map((r) => r.reporter_id))];
      const serviceIds = [...new Set(rows.map((r) => r.service_id).filter(Boolean))];
      const jobIds = [...new Set(rows.map((r) => r.job_id).filter(Boolean))];
      const [{ data: profilesData }, { data: servicesData }, { data: jobsData }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, business_name").in("id", reporterIds),
        serviceIds.length > 0 ? supabase.from("services").select("id, title, display_name").in("id", serviceIds) : Promise.resolve({ data: [] }),
        jobIds.length > 0 ? supabase.from("jobs").select("id, title").in("id", jobIds) : Promise.resolve({ data: [] }),
      ]);
      const profilesById = {};
      (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
      const servicesById = {};
      (servicesData || []).forEach((s) => { servicesById[s.id] = s; });
      const jobsById = {};
      (jobsData || []).forEach((j) => { jobsById[j.id] = j; });
      setReports(rows.map((r) => ({
        ...r,
        reporterName: (profilesById[r.reporter_id]?.business_name || profilesById[r.reporter_id]?.full_name || "Bilinmiyor"),
        listingTitle: r.service_id ? (servicesById[r.service_id]?.title || "Silinmiş vitrin") : (jobsById[r.job_id]?.title || "Silinmiş ilan"),
        listingKind: r.service_id ? "Vitrin" : "İş İlanı",
      })));
    } else {
      setReports([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    const { error } = await supabase.from("listing_reports").update({ status }).eq("id", id);
    setUpdatingId(null);
    if (!error) setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <AlertCircle size={20} style={{ color: "#9C4A3C" }} />
        <h1 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>İlan Şikayetleri (Yönetim)</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Vitrin/iş ilanlarının kendisi için bildirilen şikayetler (yanlış kategori, sahte, kopya vb.)</p>

      {loading ? (
        <div className="flex items-center justify-center py-8"><Loader2 size={18} className="animate-spin" style={{ color: "#9CA3AF" }} /></div>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <AlertCircle size={28} className="mx-auto mb-2" style={{ color: "#D1D5DB" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Henüz bir ilan şikayeti yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl border p-4" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-bold" style={{ color: "#0F1115" }}>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5" style={{ background: "#F0F0F0", color: "#6B7280" }}>{r.listingKind}</span>
                  {r.listingTitle}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(156,74,60,0.12)", color: "#9C4A3C" }}>
                  {LISTING_REPORT_REASON_LABELS[r.reason] || r.reason}
                </span>
              </div>
              <p className="text-[11px] mb-1" style={{ color: "#8A8368" }}>Bildiren: <span className="font-medium">{r.reporterName}</span></p>
              {r.detail && <p className="text-xs leading-relaxed mb-2" style={{ color: "#6B7280" }}>{r.detail}</p>}
              <p className="text-[11px] mb-2" style={{ color: "#9CA3AF" }}>{formatRelativeTr(r.created_at)}</p>
              <div className="flex items-center gap-2">
                {["open", "reviewed", "dismissed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(r.id, s)}
                    disabled={updatingId === r.id}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                    style={(r.status || "open") === s
                      ? { background: "#1B2B24", color: "#EFE8D8", borderColor: "#1B2B24" }
                      : { borderColor: "#D9D0BA", color: "#5C5744" }}
                  >
                    {s === "open" ? "Açık" : s === "reviewed" ? "İncelendi" : "Kapatıldı"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const CONTENT_FLAG_TYPE_LABELS = { message: "Mesaj", service: "Vitrin", job: "İş İlanı" };

// İçerik uyarıları — AI'nin şüpheli bulduğu mesaj/vitrin/iş ilanı metinleri
// (bkz. checkAndFlagContent, growth_features_batch.sql). Hiçbir şeyi
// otomatik engellemiyor/silmiyor, sadece admin'in incelemesine sunuyor —
// aynı user_reports/listing_reports felsefesi.
function AdminContentFlagsView({ onBack }) {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadFlags = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("content_flags")
      .select("id, content_type, content_id, flagged_profile_id, reason, excerpt, status, created_at")
      .order("created_at", { ascending: false });
    const rows = data || [];
    if (rows.length > 0) {
      const profileIds = [...new Set(rows.map((r) => r.flagged_profile_id).filter(Boolean))];
      let profilesById = {};
      if (profileIds.length > 0) {
        const { data: profilesData } = await supabase.from("profiles").select("id, full_name, business_name").in("id", profileIds);
        (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
      }
      setFlags(rows.map((r) => ({
        ...r,
        profileName: r.flagged_profile_id ? ((profilesById[r.flagged_profile_id]?.business_name || profilesById[r.flagged_profile_id]?.full_name) || "Bilinmiyor") : null,
      })));
    } else {
      setFlags([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    const { error } = await supabase.from("content_flags").update({ status }).eq("id", id);
    setUpdatingId(null);
    if (!error) setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: "#6B7280" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} style={{ color: "#9C4A3C" }} />
        <h1 className="font-sans text-2xl font-black" style={{ color: "#0F1115" }}>İçerik Uyarıları (Yönetim)</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>AI'nin şüpheli bulduğu mesaj/vitrin/iş ilanı metinleri — hiçbiri otomatik engellenmedi</p>

      {loading ? (
        <div className="flex items-center justify-center py-8"><Loader2 size={18} className="animate-spin" style={{ color: "#9CA3AF" }} /></div>
      ) : flags.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
          <ShieldCheck size={28} className="mx-auto mb-2" style={{ color: "#D1D5DB" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Henüz işaretlenen bir içerik yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flags.map((f) => (
            <div key={f.id} className="rounded-2xl border p-4" style={{ borderColor: "#F0F0F0", background: "#FFFFFF" }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-bold" style={{ color: "#0F1115" }}>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5" style={{ background: "#F0F0F0", color: "#6B7280" }}>
                    {CONTENT_FLAG_TYPE_LABELS[f.content_type] || f.content_type}
                  </span>
                  {f.profileName || "Bilinmiyor"}
                </p>
              </div>
              <p className="text-xs mb-1" style={{ color: "#9C4A3C" }}>{f.reason}</p>
              {f.excerpt && <p className="text-xs leading-relaxed mb-2 italic" style={{ color: "#6B7280" }}>"{f.excerpt}"</p>}
              <p className="text-[11px] mb-2" style={{ color: "#9CA3AF" }}>{formatRelativeTr(f.created_at)}</p>
              <div className="flex items-center gap-2">
                {["open", "reviewed", "dismissed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(f.id, s)}
                    disabled={updatingId === f.id}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                    style={(f.status || "open") === s
                      ? { background: "#1B2B24", color: "#EFE8D8", borderColor: "#1B2B24" }
                      : { borderColor: "#D9D0BA", color: "#5C5744" }}
                  >
                    {s === "open" ? "Açık" : s === "reviewed" ? "İncelendi" : "Kapatıldı"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PricingView({ onBack, onJoined, userId }) {
  const [joined, setJoined] = useState(false);
  const [boostSelected, setBoostSelected] = useState(false);
  const [boostDuration, setBoostDuration] = useState("monthly"); // monthly | weekly
  const [cycle, setCycle] = useState("monthly"); // monthly | yearly
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [proJoining, setProJoining] = useState(false);
  const [proJoined, setProJoined] = useState(false);
  const [proError, setProError] = useState("");
  const proPrice = cycle === "monthly" ? PRO_PACKAGE.priceMonthly : PRO_PACKAGE.priceYearly;
  const plan = PLANS[0];
  const basePrice = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
  const period = cycle === "monthly" ? "/ay" : "/yıl";
  const boostPrice = boostDuration === "weekly" ? WEEKLY_BOOST_PACKAGE.price : BOOST_PACKAGE.priceMonthly;
  const total = basePrice + (boostSelected ? boostPrice : 0);

  // Gerçek ödeme entegrasyonu ayrı bir faz (görev kapsamı dışı) — ama şemanın
  // kendi 30 günlük ücretsiz deneme mekanizması (provider_subscriptions,
  // status='trialing') hiçbir ödeme/kart bilgisi gerektirmeden gerçekten
  // kurulabilir. provider_subscriptions/provider_addons tablolarında bilerek
  // sadece SELECT RLS politikası var (insert/update yok) — istemciden doğrudan
  // yazmaya izin vermek, herkesin kendine bedava "active" abonelik açmasına
  // kapı aralardı. Onun yerine sadece auth.uid() için, sadece deneme başlatan,
  // güvenli bir RPC fonksiyonu üzerinden yazıyoruz (bkz. billing_trial_rpc.sql).
  const startTrial = async () => {
    if (!userId) { setJoinError("Denemeye başlamak için giriş yapmış olmalısın."); return; }
    setJoinError("");
    setJoining(true);
    try {
      const { error: subErr } = await supabase.rpc("start_free_trial", { p_billing_cycle: cycle });
      if (subErr) throw subErr;
      if (boostSelected) {
        const { error: addonErr } = await supabase.rpc(boostDuration === "weekly" ? "add_weekly_boost_addon" : "add_boost_addon");
        if (addonErr) throw addonErr;
      }
      setJoined(true);
    } catch (err) {
      setJoinError(`Kaydedilemedi: ${err?.message || "bilinmeyen hata"}`);
    } finally {
      setJoining(false);
    }
  };

  // Pro Üyelik, Standart'ın denemesinden bağımsız, ayrı bir yükseltme —
  // birden fazla vitrin açmak isteyen (örn. iki farklı uzmanlık alanı) biri
  // deneme beklemeden doğrudan buradan geçebilir (bkz. supabase/pro_plan.sql).
  const joinPro = async () => {
    if (!userId) { setProError("Pro Üyelik için giriş yapmış olmalısın."); return; }
    setProError("");
    setProJoining(true);
    try {
      const { error: proErr } = await supabase.rpc("upgrade_to_pro", { p_billing_cycle: cycle });
      if (proErr) throw proErr;
      setProJoined(true);
    } catch (err) {
      setProError(`Geçilemedi: ${err?.message || "bilinmeyen hata"}`);
    } finally {
      setProJoining(false);
    }
  };

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
          Deneme süresi bitince {cycle === "monthly" ? `ayda ${total}₺` : `yılda ${total}₺ (ilk yıla özel fiyat)`} olarak faturalandırılacaksın{boostSelected ? ` (Standart Üyelik + ${boostDuration === "weekly" ? WEEKLY_BOOST_PACKAGE.name : BOOST_PACKAGE.name})` : ""}. İstediğin zaman iptal edebilirsin, kazandığından hiçbir komisyon kesilmez.
          {boostSelected && boostDuration === "weekly" && " Haftalık Öne Çıkarma 7 gün sonra kendiliğinden biter, otomatik yenilenmez — tekrar istersen profilinden yeniden alabilirsin."}
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={onJoined} className="px-5 py-2.5 rounded-full text-sm font-medium text-white" style={{ background: "#2563EB" }}>Profilini Tamamla</button>
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
        <h1 className="font-serif text-3xl mb-3" style={{ color: "#1B2B24" }}>İlk vitrinin bizden</h1>
        <p className="text-sm mb-4" style={{ color: "#5C5744" }}>
          İşini göster, fırsatlara teklif ver, İşinn'de yerini al. Kazandığından hiçbir komisyon almıyoruz.
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full text-white"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
        >
          <Sparkles size={13} /> İlk {plan.trialMonths} Ay Herkese Ücretsiz 🎉
        </span>
        <p className="text-[11px] mt-2" style={{ color: "#8A8368" }}>Kredi kartı istemiyoruz — deneme süresi dolmadan haber veririz.</p>
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
              {label} {key === "yearly" && <span className="text-[10px]" style={{ color: cycle === key ? "#DBEAFE" : "#2563EB" }}>İlk yıla özel</span>}
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
          {cycle === "yearly" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>İlk yıla özel</span>
          )}
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

      {/* Pro Üyelik artık her zaman görünür bir kart — önceden lansmanın ilk
          ayında kimseye zorla satmamak için küçük, tıklanmadan açılmayan bir
          nota gizlenmişti; artık Ek Vitrin Paketi de var, Pro'nun değeri daha
          net olduğu için tam kart olarak gösteriliyor (kullanıcının kararı). */}
      <div className="rounded-2xl border-2 p-6 flex flex-col mb-6" style={{ borderColor: proJoined ? "#2FBF71" : "#8B5CF6", background: "#F8F4E9" }}>
        <div className="flex items-center justify-between mb-1">
          <p className="font-serif text-lg" style={{ color: "#1B2B24" }}>{PRO_PACKAGE.name}</p>
          {proJoined && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#2FBF71" }}>Aktif</span>
          )}
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>{PRO_PACKAGE.tagline} — deneme kapsamında değil, doğrudan üyelik</p>
        <div className="mb-4 flex items-baseline gap-1">
          <span className="font-serif text-2xl" style={{ color: "#1B2B24" }}>{proPrice}₺</span>
          <span className="text-sm" style={{ color: "#8A8368" }}>{period}</span>
          {cycle === "yearly" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#EDE9FE", color: "#6D28D9" }}>İlk yıla özel</span>
          )}
        </div>
        <div className="space-y-2 mb-4">
          {PRO_PACKAGE.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "#3D3B30" }}>
              <Sparkles size={13} style={{ color: "#8B5CF6" }} className="mt-0.5 shrink-0" />
              {f}
            </div>
          ))}
        </div>
        {proError && (
          <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{proError}</p>
        )}
        <button
          onClick={joinPro}
          disabled={proJoining || proJoined}
          className="w-full py-2.5 rounded-full text-sm font-medium text-white flex items-center justify-center gap-1.5"
          style={{ background: "#8B5CF6", opacity: proJoining ? 0.7 : proJoined ? 0.6 : 1 }}
        >
          {proJoining && <Loader2 size={13} className="animate-spin" />}
          {proJoined ? "Pro Üyeliğe geçtin ✓" : "Pro Üyelik'e Geç"}
        </button>
      </div>

      {/* Öne Çıkarma Paketi bilerek en altta — kullanıcının kararı (2026-09-08):
          önce iki asıl üyelik seçilsin, bu ikisine eklenen isteğe bağlı bir
          ek olarak en sonda dursun. Aylık/yıllık döngüden bağımsız (kendi
          fiyatı hep aylık), o yüzden iki görünümde de aynı yerde kalıyor. */}
      {/* Basitleştirildi (kullanıcı geri bildirimi: "kart mı seçiliyor, süre
          mi seçiliyor" iki aşamalı akışı kafa karıştırıyordu, "müşterinin
          kafası karışır" — gerçek bir uyarı). Artık tek adım: iki net fiyat
          seçeneği, hangisine tıklarsan o hem seçilir hem eklenir. Aynı
          seçeneğe tekrar tıklamak kaldırır. Standart bir "plan seç" deseni —
          sayfanın en üstündeki Aylık/Yıllık toggle'ıyla aynı mantık. */}
      <div className="w-full rounded-2xl border-2 p-6 flex flex-col mb-6" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <p className="font-serif text-lg mb-1" style={{ color: "#1B2B24" }}>{BOOST_PACKAGE.name}</p>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>{BOOST_PACKAGE.tagline}, deneme kapsamında değil</p>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { key: "monthly", label: "Aylık", price: BOOST_PACKAGE.priceMonthly, unit: "/ay" },
            { key: "weekly", label: "Haftalık", price: WEEKLY_BOOST_PACKAGE.price, unit: "/7 gün" },
          ].map((opt) => {
            const isActive = boostSelected && boostDuration === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  if (isActive) { setBoostSelected(false); return; }
                  setBoostDuration(opt.key);
                  setBoostSelected(true);
                }}
                className="rounded-xl border-2 p-3 text-left transition-colors"
                style={isActive ? { borderColor: "#F59E0B", background: "#FFFBEB" } : { borderColor: "#D9D0BA", background: "#FFFFFF" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: "#1B2B24" }}>{opt.label}</span>
                  {isActive && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F59E0B" }}>
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-serif text-lg" style={{ color: "#1B2B24" }}>+{opt.price}₺</span>
                  <span className="text-[11px]" style={{ color: "#8A8368" }}>{opt.unit}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {BOOST_PACKAGE.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "#3D3B30" }}>
              <Sparkles size={13} style={{ color: "#F59E0B" }} className="mt-0.5 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 mb-4 flex items-center justify-between" style={{ background: "#0F1115" }}>
        <div>
          <span className="text-sm font-medium block" style={{ color: "#EFE8D8" }}>{cycle === "monthly" ? "Aylık toplam" : "Yıllık toplam"}</span>
          <span className="text-[11px]" style={{ color: "#9CA3AF" }}>İlk {plan.trialMonths} ay: 0₺</span>
        </div>
        <span className="font-serif text-2xl font-bold text-white">{total}₺</span>
      </div>

      {joinError && (
        <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{joinError}</p>
      )}
      <button
        onClick={startTrial}
        disabled={joining}
        className="w-full py-3 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", opacity: joining ? 0.7 : 1 }}
      >
        {joining && <Loader2 size={14} className="animate-spin" />}
        {joining ? "Kaydediliyor..." : "Ücretsiz Denemeye Başla"}
      </button>
      <p className="text-xs text-center mt-6" style={{ color: "#8A8368" }}>
        İstediğin zaman iptal edebilir ya da Öne Çıkarma Paketi'ni ekleyip çıkarabilirsin. Müşterilerden aldığın ödemelerden İşinn hiçbir kesinti yapmaz — kazancının tamamı sana kalır.
      </p>
    </div>
  );
}

function ProfileView({ userId, onBack, onOpenAdminReports, onOpenAnalytics, onOpenModeration, onOpenUserReports, onOpenListingReports, onOpenContentFlags, isAdmin, pendingMediaApprovals, onApproveMedia, onRejectMedia, onListingsChanged, onJobsChanged, onEditListing, onOpenVitrinMedia, onEditJob }) {
  // Video tanıtım/portföy/sertifika/CV artık vitrine özel — bkz. VitrinMediaView
  // (supabase/vitrin_media.sql). Burada sadece paylaşılan profil fotoğrafı kalıyor
  // ("aynı kişinin gerçek yüzü her vitrinde aynı görünsün" — kullanıcının kararı).
  const [profilePhoto, setProfilePhoto] = useState(null); // { url }
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  // Gerçek profil — profiles tablosundan okunur/güncellenir.
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [myListings, setMyListings] = useState([]); // kendi ilanlarım — services tablosundan
  const [myJobs, setMyJobs] = useState([]); // kendi verdiğim iş ilanları — jobs tablosundan
  const [myRating, setMyRating] = useState(null); // { avg, count } — ratings tablosundan gerçek puan
  const [myPhone, setMyPhone] = useState(null); // { phone, verified, show_publicly } — özel profile_phone tablosundan
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [phoneStage, setPhoneStage] = useState("idle"); // idle | sending | code_sent | verifying
  const [phoneError, setPhoneError] = useState("");
  const [phoneNotConfigured, setPhoneNotConfigured] = useState(false);
  const [deactivatingJobId, setDeactivatingJobId] = useState(null);
  const [confirmDeactivateJobId, setConfirmDeactivateJobId] = useState(null);
  const [jobsError, setJobsError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [cityId, setCityId] = useState("istanbul");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveDone, setSaveDone] = useState(false);

  // Gerçek "onay bekleyen medyalarım" — review_media tablosundan. Eskiden bu
  // liste tamamen sahteydi (yalnızca demo akışının doldurduğu local state),
  // gerçek bir yorum fotoğrafı hiç buraya düşmüyordu (bkz. attachRealReviewMedia).
  const [realPendingMedia, setRealPendingMedia] = useState([]);
  // Kaç vitrin hakkın var — eskiden "Vitrinlerim (N)" sadece kaç vitrinin
  // olduğunu gösteriyordu, tavanı (kaçına kadar hakkın var) hiç göstermiyordu.
  const [vitrinCap, setVitrinCap] = useState(null); // { cap, planName, hasExtraVitrinAddon }
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getVitrinCapInfo(userId).then((info) => { if (!cancelled) setVitrinCap(info); });
    return () => { cancelled = true; };
  }, [userId]);
  const [mediaActionId, setMediaActionId] = useState(null);

  // Kayıtlı aramalar — bkz. SearchResultsView.saveThisSearch/sahibinden_features.sql.
  const [savedSearches, setSavedSearches] = useState([]);
  const loadSavedSearches = async () => {
    if (!userId) return;
    const { data } = await supabase.from("saved_searches").select("id, query, created_at").eq("profile_id", userId).order("created_at", { ascending: false });
    setSavedSearches(data || []);
  };
  useEffect(() => {
    loadSavedSearches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const deleteSavedSearch = async (id) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id)); // iyimser — geri almaya gerek yok, silme nadiren başarısız olur
    await supabase.from("saved_searches").delete().eq("id", id);
  };

  const loadRealPendingMedia = async () => {
    if (!userId) return;
    // Ayrı sorgular tercih edildi — services/jobs/ratings'te olduğu gibi,
    // PostgREST'in aynı tabloya iki farklı FK'dan (rater_id/rated_profile_id)
    // gelen belirsiz embed sorgularından kaçınmak için (bkz. loadRealReviews).
    const { data: ratingsData } = await supabase
      .from("ratings")
      .select("id, rater_id, comment")
      .eq("rated_profile_id", userId);
    const ratingsById = {};
    (ratingsData || []).forEach((r) => { ratingsById[r.id] = r; });
    const ratingIds = Object.keys(ratingsById);
    if (ratingIds.length === 0) { setRealPendingMedia([]); return; }

    const { data: mediaData } = await supabase
      .from("review_media")
      .select("id, rating_id, media_type, url")
      .in("rating_id", ratingIds)
      .eq("approval_status", "pending");
    const pending = mediaData || [];
    if (pending.length === 0) { setRealPendingMedia([]); return; }

    const raterIds = [...new Set(pending.map((m) => ratingsById[m.rating_id]?.rater_id).filter(Boolean))];
    let profilesById = {};
    if (raterIds.length > 0) {
      const { data: profilesData } = await supabase.from("profiles").select("id, full_name, business_name").in("id", raterIds);
      (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
    }
    setRealPendingMedia(
      pending.map((m) => {
        const rating = ratingsById[m.rating_id];
        const p = rating ? profilesById[rating.rater_id] : null;
        return {
          id: `real-${m.id}`,
          dbId: m.id,
          real: true,
          mediaType: m.media_type,
          mediaUrl: m.url,
          reviewerName: (p?.business_name && p.business_name.trim()) || p?.full_name || "Bir kullanıcı",
          listingTitle: rating?.comment ? `"${rating.comment.slice(0, 40)}${rating.comment.length > 40 ? "…" : ""}"` : "Bir değerlendirme",
          submittedAt: "",
        };
      })
    );
  };

  useEffect(() => {
    loadRealPendingMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const decideRealMedia = async (dbId, approve) => {
    setMediaActionId(dbId);
    const { error } = await supabase
      .from("review_media")
      .update({ approval_status: approve ? "approved" : "rejected", approved_at: approve ? new Date().toISOString() : null })
      .eq("id", dbId);
    setMediaActionId(null);
    if (!error) setRealPendingMedia((prev) => prev.filter((m) => m.dbId !== dbId));
  };

  const loadMyListings = async () => {
    if (!userId) return;
    // description/category_id/images de çekiyoruz — sadece listelemek için değil,
    // "Düzenle" ile CreateListingView'ı dolu açabilmek için de gerekiyor.
    const { data } = await supabase
      .from("services")
      .select("id, title, description, city, price, price_type, is_remote, home_service_type, category_id, images, active, created_at, display_name, categories(slug)")
      .eq("provider_id", userId)
      .order("created_at", { ascending: false });
    setMyListings(data || []);
  };

  // myListings satırını CreateListingView'ın "editingListing" prop'unun
  // beklediği şekle çevirir (mapServiceRowToListing ile aynı alan adları).
  const toEditableListing = (l) => ({
    dbId: l.id,
    category: l.categories?.slug || "",
    categoryDbId: l.category_id,
    mode: l.is_remote ? "remote" : "local",
    title: l.title,
    desc: l.description || "",
    city: l.is_remote ? "Uzaktan" : (l.city || ""),
    price: formatPriceLabel(l.price, l.price_type),
    img: (Array.isArray(l.images) && l.images[0]) || FALLBACK_LISTING_IMG,
    provider: (l.display_name && l.display_name.trim()) || (profile?.business_name && profile.business_name.trim()) || profile?.full_name || "",
    homeService: l.is_remote ? undefined : (l.home_service_type || "evde"),
  });

  const loadMyJobs = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("jobs")
      .select("id, title, description, city, budget_min, budget_max, is_remote, active, created_at, category_id, custom_category_label, categories(slug)")
      .eq("client_id", userId)
      .eq("active", true)
      .order("created_at", { ascending: false });
    setMyJobs(data || []);
  };

  // myJobs satırını PostJobView'ın "editingJob" prop'unun beklediği şekle
  // çevirir — CreateListingView'ın toEditableListing'iyle aynı desen.
  const toEditableJob = (j) => ({
    dbId: j.id,
    category: j.categories?.slug || "",
    customCategoryLabel: j.custom_category_label || "",
    mode: j.is_remote ? "remote" : "local",
    title: j.title,
    desc: j.description || "",
    city: j.is_remote ? "" : (j.city || ""),
    budgetMin: j.budget_min,
    budgetMax: j.budget_max,
  });

  // Gerçek puan ortalaması — "Tamamlanan İş" olarak da kaç kez değerlendirildiğini
  // (yani kaç iş için gerçek geri bildirim aldığını) kullanıyoruz, çünkü
  // schema'da provider'a özel ayrı bir "tamamlanan iş sayısı" alanı yok.
  const loadMyRating = async () => {
    if (!userId) return;
    const { data } = await supabase.from("ratings").select("value").eq("rated_profile_id", userId);
    const rows = data || [];
    if (rows.length === 0) { setMyRating(null); return; }
    const avg = rows.reduce((s, r) => s + r.value, 0) / rows.length;
    setMyRating({ avg: avg.toFixed(1), count: rows.length });
  };

  // Telefon numarasının kendisi HERKESE AÇIK profiles tablosunda hiç durmuyor —
  // ayrı, sadece sahibinin okuyabildiği profile_phone tablosunda tutuluyor.
  const loadMyPhone = async () => {
    if (!userId) return;
    const { data } = await supabase.from("profile_phone").select("*").eq("profile_id", userId).maybeSingle();
    setMyPhone(data || null);
    if (data?.phone) setPhoneInput(data.phone);
  };

  const sendPhoneCode = async () => {
    if (!phoneInput.trim()) { setPhoneError("Telefon numarası gir."); return; }
    setPhoneError("");
    setPhoneStage("sending");
    try {
      // Kod artık istemciye hiç gelmiyor — sunucu (/api/send-otp) kendi
      // üretiyor ve doğrudan SMS olarak yolluyor (bkz. supabase/fix_otp_leak.sql).
      // Kimlik doğrulaması için kendi oturum token'ımızı gönderiyoruz.
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ phone: phoneInput.trim() }),
      });
      const result = await res.json();
      if (!result.configured) {
        setPhoneNotConfigured(true);
        setPhoneStage("idle");
        return;
      }
      if (!result.sent) throw new Error(result.message || "SMS gönderilemedi.");
      setPhoneStage("code_sent");
    } catch (err) {
      setPhoneError(err.message || "Bir hata oluştu.");
      setPhoneStage("idle");
    }
  };

  const verifyPhoneCode = async () => {
    if (!otpInput.trim()) return;
    setPhoneError("");
    setPhoneStage("verifying");
    try {
      const { data: ok, error } = await supabase.rpc("verify_phone_otp", { p_code: otpInput.trim() });
      if (error) throw error;
      if (!ok) { setPhoneError("Kod yanlış, tekrar dene."); setPhoneStage("code_sent"); return; }
      await loadMyPhone();
      setProfile((p) => (p ? { ...p, phone_verified: true } : p));
      setPhoneStage("idle");
      setOtpInput("");
    } catch (err) {
      setPhoneError(err.message || "Bir hata oluştu.");
      setPhoneStage("code_sent");
    }
  };

  const togglePhonePublic = async (val) => {
    if (!userId) return;
    await supabase.from("profile_phone").update({ show_publicly: val }).eq("profile_id", userId);
    setMyPhone((p) => (p ? { ...p, show_publicly: val } : p));
  };

  // jobs tablosunda delete RLS policy yok (bilerek — kalıcı silme değil, pasife
  // alma öngörülmüş) — "Kaldır" burada active=false yapıyor, kayıt siliniyor sayılır.
  const deactivateJob = async (jobId) => {
    setJobsError("");
    setDeactivatingJobId(jobId);
    const { error } = await supabase.from("jobs").update({ active: false }).eq("id", jobId);
    setDeactivatingJobId(null);
    setConfirmDeactivateJobId(null);
    if (error) { setJobsError(`Kaldırılamadı: ${error.message}`); return; }
    setMyJobs((prev) => prev.filter((j) => j.id !== jobId));
    onJobsChanged?.();
  };

  // provider-documents PRIVATE bir bucket, o yüzden görüntülemek için her seferinde
  // kısa ömürlü (1 saat) bir "signed URL" üretiyoruz — public URL çalışmıyor.
  useEffect(() => {
    if (!userId) { setProfileLoading(false); return; }
    let cancelled = false;
    (async () => {
      setProfileLoading(true);
      const [{ data: profileData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        loadMyListings(),
        loadMyJobs(),
        loadMyRating(),
        loadMyPhone(),
      ]);
      if (cancelled) return;
      setProfile(profileData || null);
      setFullName(profileData?.full_name || "");
      setCityId(deriveCityIdFromLabel(profileData?.city) || "istanbul");
      setBio(profileData?.bio || "");
      if (profileData?.avatar_url) setProfilePhoto({ url: profileData.avatar_url });
      setProfileLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // profile-media PUBLIC bucket'ına {userId}/{prefix}-{timestamp}.{ext} yoluna yükler.
  const uploadToProfileMedia = async (file, prefix) => {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `${userId}/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("profile-media").upload(path, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("profile-media").getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const deleteListing = async (listingId) => {
    setDeleteError("");
    setDeletingId(listingId);
    const { error } = await supabase.from("services").delete().eq("id", listingId);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (error) { setDeleteError(`Silinemedi: ${error.message}`); return; }
    setMyListings((prev) => prev.filter((l) => l.id !== listingId));
    onListingsChanged?.();
  };

  const saveProfile = async () => {
    if (!userId) return;
    if (!fullName.trim()) { setSaveError("Ad Soyad boş olamaz."); return; }
    setSaveError("");
    setSaving(true);
    const cityName = CITIES.find((c) => c.id === cityId)?.name || null;
    const patch = { full_name: fullName.trim(), city: cityName, bio: bio.trim() || null };
    const { data, error } = await supabase.from("profiles").update(patch).eq("id", userId).select("*").maybeSingle();
    setSaving(false);
    if (error) { setSaveError(`Kaydedilemedi: ${error.message}`); return; }
    setProfile(data || { ...profile, ...patch });
    setEditing(false);
    setSaveDone(true);
    setTimeout(() => setSaveDone(false), 2500);
  };

  const joinedLabel = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })
    : null;

  // Profil fotoğrafı yuvarlak gösteriliyor (bkz. aşağıdaki rounded-full img) —
  // kırpma modalı da cropShape="round" ile aynı önizlemeyi veriyor.
  const [cropSrc, setCropSrc] = useState(null);
  const handlePhotoAdd = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
  };

  const uploadPhoto = async (file) => {
    setCropSrc(null);
    if (!file || !userId) return;
    setPhotoError("");
    setPhotoUploading(true);
    try {
      const { publicUrl } = await uploadToProfileMedia(file, "avatar");
      const { error } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
      if (error) throw error;
      setProfilePhoto({ url: publicUrl });
      setProfile((p) => (p ? { ...p, avatar_url: publicUrl } : p));
    } catch (err) {
      setPhotoError(`Yüklenemedi: ${err.message}`);
    } finally {
      setPhotoUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          aspect={1}
          shape="round"
          fileName="profil-fotografi.jpg"
          onCancel={() => setCropSrc(null)}
          onCropped={uploadPhoto}
        />
      )}
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-4 mb-8">
        <label className="relative w-16 h-16 rounded-full cursor-pointer shrink-0 group">
          {profilePhoto ? (
            <img src={profilePhoto.url} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium text-white" style={{ background: "#1B2B24" }}>
              {(profile?.full_name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
            {photoUploading ? <Loader2 size={16} className="text-white animate-spin" /> : <Camera size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoAdd} disabled={photoUploading} />
        </label>
        <div>
          <h1 className="font-serif text-xl" style={{ color: "#1B2B24" }}>
            {profileLoading ? "Yükleniyor..." : profile?.full_name || "Profilini tamamla"}
          </h1>
          <p className="text-sm" style={{ color: "#5C5744" }}>
            {profile?.city ? `${profile.city} · ` : ""}{joinedLabel ? `Üye: ${joinedLabel}` : ""}
          </p>
          {photoError && <p className="text-xs mt-1" style={{ color: "#9C4A3C" }}>{photoError}</p>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          [String(myListings.length), "Vitrin"],
          [myRating ? String(myRating.count) : "0", "Değerlendirme"],
          [myRating ? myRating.avg : "—", "Puan"],
        ].map(([val, label]) => (
          <div key={label} className="rounded-xl border p-4 text-center" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            <p className="font-serif text-xl" style={{ color: "#1B2B24" }}>{val}</p>
            <p className="text-xs mt-1" style={{ color: "#8A8368" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: "#2FBF71" }} />
            <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Profil Bilgileri</h2>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-xs font-bold" style={{ color: "#2563EB" }}>Düzenle</button>
          )}
        </div>
        {profileLoading ? (
          <p className="text-xs mt-3" style={{ color: "#8A8368" }}>Yükleniyor...</p>
        ) : !editing ? (
          <div className="mt-3 space-y-1.5 text-sm" style={{ color: "#3D3B30" }}>
            <p><span style={{ color: "#8A8368" }}>Ad Soyad:</span> {profile?.full_name || "—"}</p>
            <p><span style={{ color: "#8A8368" }}>Şehir:</span> {profile?.city || "—"}</p>
            <p><span style={{ color: "#8A8368" }}>Hakkımda / Uzmanlık:</span> {profile?.bio || "—"}</p>
            {saveDone && <p className="text-xs" style={{ color: "#2FBF71" }}>Kaydedildi ✓</p>}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Ad Soyad</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Şehir</label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
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
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#5C5744" }}>Hakkımda / Uzmanlık kategorin</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Örn. 5 yıldır çocuk bakıcılığı yapıyorum, İstanbul Anadolu yakasında hizmet veriyorum..."
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none resize-none"
                style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
              />
            </div>
            {saveError && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{saveError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex-1 py-2.5 rounded-full text-sm font-medium text-white flex items-center justify-center gap-2"
                style={{ background: "#2FBF71", color: "#1B2B24", opacity: saving ? 0.7 : 1 }}
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFullName(profile?.full_name || "");
                  setCityId(deriveCityIdFromLabel(profile?.city) || "istanbul");
                  setBio(profile?.bio || "");
                  setSaveError("");
                }}
                className="px-4 py-2.5 rounded-full text-sm font-medium border"
                style={{ borderColor: "#D9D0BA", color: "#5C5744" }}
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-1">
          <Phone size={16} style={{ color: myPhone?.verified ? "#3F7D5C" : "#C2872B" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Telefon Doğrulama</h2>
          {myPhone?.verified && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#3F7D5C" }}>Doğrulandı</span>
          )}
        </div>
        <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
          Mesaj gönderme ve vitrin/iş ilanı yayınlama için telefon doğrulaması gerekiyor. Numaran gizli tutulur — profilinde göstermek istersen ayrıca izin vermen gerekir.
        </p>

        {phoneError && (
          <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{phoneError}</p>
        )}
        {phoneNotConfigured && (
          <p className="text-xs mb-3 px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: "#FFFBEB", color: "#92640B" }}>
            <AlertCircle size={13} /> SMS doğrulama servisi yakında aktif olacak, şimdilik bu adımı atlayabilirsin.
          </p>
        )}

        {myPhone?.verified ? (
          <div>
            <p className="text-sm mb-3" style={{ color: "#1B2B24" }}>{myPhone.phone}</p>
            <label className="flex items-center gap-2 text-xs" style={{ color: "#5C5744" }}>
              <input
                type="checkbox"
                checked={!!myPhone.show_publicly}
                onChange={(e) => togglePhonePublic(e.target.checked)}
              />
              Profilimde telefon numaramı göster
            </label>
          </div>
        ) : phoneStage === "code_sent" ? (
          <div className="flex items-center gap-2">
            <input
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="6 haneli kod"
              inputMode="numeric"
              className="flex-1 px-3.5 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
            />
            <button
              onClick={verifyPhoneCode}
              disabled={phoneStage === "verifying" || !otpInput.trim()}
              className="px-4 py-2.5 rounded-full text-sm font-medium text-white flex items-center gap-1.5"
              style={{ background: "#3F7D5C", opacity: phoneStage === "verifying" ? 0.7 : 1 }}
            >
              {phoneStage === "verifying" && <Loader2 size={13} className="animate-spin" />}
              Doğrula
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="05xx xxx xx xx"
              className="flex-1 px-3.5 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: "#D9D0BA", background: "#FFFFFF", color: "#1B2B24" }}
            />
            <button
              onClick={sendPhoneCode}
              disabled={phoneStage === "sending"}
              className="px-4 py-2.5 rounded-full text-sm font-medium text-white flex items-center gap-1.5 shrink-0"
              style={{ background: "#C2872B", opacity: phoneStage === "sending" ? 0.7 : 1 }}
            >
              {phoneStage === "sending" && <Loader2 size={13} className="animate-spin" />}
              Kod Gönder
            </button>
          </div>
        )}
      </div>

      {savedSearches.length > 0 && (
        <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} style={{ color: "#2563EB" }} />
            <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Kayıtlı Aramalarım ({savedSearches.length})</h2>
          </div>
          <p className="text-xs mb-3" style={{ color: "#8A8368" }}>Bu aramalara uyan yeni bir vitrin yayına girince bildirim alırsın.</p>
          <div className="space-y-2">
            {savedSearches.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg" style={{ background: "#EFE8D8" }}>
                <span className="text-xs font-medium" style={{ color: "#1B2B24" }}>"{s.query}"</span>
                <button onClick={() => deleteSavedSearch(s.id)} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" title="Kaldır">
                  <X size={13} style={{ color: "#8A8368" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={16} style={{ color: "#2FBF71" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>
            Vitrinlerim ({myListings.length}{vitrinCap ? `/${vitrinCap.cap}` : ""})
          </h2>
        </div>
        {deleteError && (
          <p className="text-xs mb-2 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{deleteError}</p>
        )}
        {profileLoading ? (
          <p className="text-xs" style={{ color: "#8A8368" }}>Yükleniyor...</p>
        ) : myListings.length === 0 ? (
          <p className="text-xs" style={{ color: "#8A8368" }}>Henüz bir vitrinin yok. "Hizmet Ekle" ile ilk vitrinini oluşturabilirsin.</p>
        ) : (
          <div className="space-y-2">
            {myListings.map((l) => (
              <div
                key={l.id}
                onClick={() => confirmDeleteId !== l.id && onOpenVitrinMedia?.(l)}
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer"
                style={{ background: "#EFE8D8" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "#1B2B24" }}>{l.title}</p>
                  <p className="text-[11px] truncate" style={{ color: "#8A8368" }}>
                    {l.is_remote ? "Uzaktan" : l.city || "—"} · {formatPriceLabel(l.price, l.price_type)} · <span className="underline">fotoğraf/video/belge yönet</span>
                  </p>
                </div>
                {confirmDeleteId === l.id ? (
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => deleteListing(l.id)}
                      disabled={deletingId === l.id}
                      className="text-[11px] font-bold px-2.5 py-1.5 rounded-full text-white flex items-center gap-1"
                      style={{ background: "#9C4A3C", opacity: deletingId === l.id ? 0.6 : 1 }}
                    >
                      {deletingId === l.id && <Loader2 size={11} className="animate-spin" />}
                      Evet, sil
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={deletingId === l.id}
                      className="text-[11px] font-medium px-2.5 py-1.5 rounded-full"
                      style={{ color: "#5C5744" }}
                    >
                      Vazgeç
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEditListing?.(toEditableListing(l))}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      title="Vitrini düzenle"
                    >
                      <Pencil size={13} style={{ color: "#3A5BA0" }} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(l.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      title="Vitrini sil"
                    >
                      <Trash2 size={14} style={{ color: "#9C4A3C" }} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-3">
          <Megaphone size={16} style={{ color: "#C2872B" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>İş İlanlarım ({myJobs.length})</h2>
        </div>
        {jobsError && (
          <p className="text-xs mb-2 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{jobsError}</p>
        )}
        {profileLoading ? (
          <p className="text-xs" style={{ color: "#8A8368" }}>Yükleniyor...</p>
        ) : myJobs.length === 0 ? (
          <p className="text-xs" style={{ color: "#8A8368" }}>Henüz bir iş ilanı vermedin. "İlan Ver" ile ihtiyacını anlatabilirsin.</p>
        ) : (
          <div className="space-y-2">
            {myJobs.map((j) => (
              <div key={j.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "#EFE8D8" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "#1B2B24" }}>{j.title}</p>
                  <p className="text-[11px] truncate" style={{ color: "#8A8368" }}>
                    {j.is_remote ? "Uzaktan" : j.city || "—"}
                    {(j.budget_min != null || j.budget_max != null) &&
                      ` · ${j.budget_min != null ? Number(j.budget_min).toLocaleString("tr-TR") + "₺" : ""}${j.budget_min != null && j.budget_max != null ? "–" : ""}${j.budget_max != null ? Number(j.budget_max).toLocaleString("tr-TR") + "₺" : ""}`}
                  </p>
                </div>
                {confirmDeactivateJobId === j.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => deactivateJob(j.id)}
                      disabled={deactivatingJobId === j.id}
                      className="text-[11px] font-bold px-2.5 py-1.5 rounded-full text-white flex items-center gap-1"
                      style={{ background: "#9C4A3C", opacity: deactivatingJobId === j.id ? 0.6 : 1 }}
                    >
                      {deactivatingJobId === j.id && <Loader2 size={11} className="animate-spin" />}
                      Evet, kaldır
                    </button>
                    <button
                      onClick={() => setConfirmDeactivateJobId(null)}
                      disabled={deactivatingJobId === j.id}
                      className="text-[11px] font-medium px-2.5 py-1.5 rounded-full"
                      style={{ color: "#5C5744" }}
                    >
                      Vazgeç
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Düzenleme hakkı — eskiden hiç yoktu, ilanı silip yeniden
                        girmekten başka çare yoktu (kullanıcının fark ettiği
                        gerçek bir eksiklik: "balkon temizliğinden bahsetmeyi
                        unutmuş, düzenleyemiyor"). */}
                    <button
                      onClick={() => onEditJob?.(toEditableJob(j))}
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      title="İlanı düzenle"
                    >
                      <Pencil size={14} style={{ color: "#5C5744" }} />
                    </button>
                    <button
                      onClick={() => setConfirmDeactivateJobId(j.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      title="İlanı kaldır"
                    >
                      <Trash2 size={14} style={{ color: "#9C4A3C" }} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      {((pendingMediaApprovals && pendingMediaApprovals.length > 0) || realPendingMedia.length > 0) && (
        <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#F59E0B", background: "#FFFBEB" }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} style={{ color: "#F59E0B" }} />
            <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Onay Bekleyen Medyalarım ({(pendingMediaApprovals?.length || 0) + realPendingMedia.length})</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
            Bir müşteri, seni gösterebilecek bir fotoğraf ile seni değerlendirdi. Yayınlanması için onayın gerekiyor.
          </p>
          <div className="space-y-3">
            {[...realPendingMedia, ...(pendingMediaApprovals || [])].map((item) => (
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
                  <button
                    onClick={() => (item.real ? decideRealMedia(item.dbId, true) : onApproveMedia(item.id))}
                    disabled={item.real && mediaActionId === item.dbId}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "#3F7D5C", opacity: item.real && mediaActionId === item.dbId ? 0.6 : 1 }}
                  >
                    <Check size={14} className="text-white" />
                  </button>
                  <button
                    onClick={() => (item.real ? decideRealMedia(item.dbId, false) : onRejectMedia(item.id))}
                    disabled={item.real && mediaActionId === item.dbId}
                    className="w-8 h-8 rounded-full flex items-center justify-center border"
                    style={{ borderColor: "#D9D0BA", opacity: item.real && mediaActionId === item.dbId ? 0.6 : 1 }}
                  >
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
          <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>{isAdmin ? "Destek Talepleri (Yönetim)" : "Destek Taleplerim"}</p>
          <p className="text-xs" style={{ color: "#8A8368" }}>{isAdmin ? "Tüm kullanıcıların destek talepleri" : "Destek asistanına yazdığın ve bildirdiğin geçmiş talepler"}</p>
        </div>
        <ChevronRight size={16} style={{ color: "#8A8368" }} />
      </button>

      {isAdmin && (
        <button
          onClick={onOpenUserReports}
          className="w-full rounded-xl border p-5 mb-4 text-left flex items-center gap-3 hover:shadow-sm transition-shadow"
          style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(156,74,60,0.12)" }}>
            <ShieldCheck size={16} style={{ color: "#9C4A3C" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>Kullanıcı Şikayetleri (Yönetim)</p>
            <p className="text-xs" style={{ color: "#8A8368" }}>Mesajlaşmadan bildirilen kullanıcı şikayetlerini incele</p>
          </div>
          <ChevronRight size={16} style={{ color: "#8A8368" }} />
        </button>
      )}

      {isAdmin && (
        <button
          onClick={onOpenListingReports}
          className="w-full rounded-xl border p-5 mb-4 text-left flex items-center gap-3 hover:shadow-sm transition-shadow"
          style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(156,74,60,0.12)" }}>
            <AlertCircle size={16} style={{ color: "#9C4A3C" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>İlan Şikayetleri (Yönetim)</p>
            <p className="text-xs" style={{ color: "#8A8368" }}>Vitrin/iş ilanları için bildirilen şikayetleri incele</p>
          </div>
          <ChevronRight size={16} style={{ color: "#8A8368" }} />
        </button>
      )}

      {isAdmin && (
        <button
          onClick={onOpenContentFlags}
          className="w-full rounded-xl border p-5 mb-4 text-left flex items-center gap-3 hover:shadow-sm transition-shadow"
          style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(156,74,60,0.12)" }}>
            <ShieldCheck size={16} style={{ color: "#9C4A3C" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>İçerik Uyarıları (Yönetim)</p>
            <p className="text-xs" style={{ color: "#8A8368" }}>AI'nin şüpheli bulduğu mesaj/vitrin/iş ilanı metinleri</p>
          </div>
          <ChevronRight size={16} style={{ color: "#8A8368" }} />
        </button>
      )}

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

// Vitrine özel medya yönetimi — kullanıcının kendi tabiriyle "iki farklı
// Instagram hesabında gezinmek gibi": her vitrinin kendi video tanıtımı,
// portföyü, sertifika/belgeleri ve CV'si var (bkz. supabase/vitrin_media.sql).
// Paylaşılan kalan tek şey profil fotoğrafı (avatar) — ProfileView'da yönetiliyor.
function VitrinMediaView({ userId, service, onBack, onListingsChanged }) {
  const [certificates, setCertificates] = useState([]);
  const [cv, setCv] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [videoIntro, setVideoIntro] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [docViewer, setDocViewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [portfolioUploading, setPortfolioUploading] = useState(false);
  const [portfolioError, setPortfolioError] = useState("");
  const [certUploading, setCertUploading] = useState(false);
  const [certError, setCertError] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState("");
  // Bu vitrinin değerlendirmeleri diğer vitrinlerle birleşsin mi, yoksa ayrı mı
  // kalsın — sahibi (müşterimiz) kendi kararını veriyor (bkz. ratings.service_id).
  const [shareReviews, setShareReviews] = useState(true);
  const [shareReviewsSaving, setShareReviewsSaving] = useState(false);

  // Vitrin performansı — gerçek, ölçülebilen sinyallerle: kaç görüşme
  // başladı, kaçı tamamlandı, ortalama puan, kaç kişi favoriledi. "Kaç kişi
  // baktı" gibi bir görüntülenme sayısı YOK burada — hiçbir yerde
  // izlenmiyor, var olmayan bir veriyi uydurmamak için o metrik hiç
  // gösterilmiyor.
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  // Sağlayıcı, kendi vitrinini yönetim ekranından ("Vitrinlerim") açtığında
  // yorumların GERÇEK metnini hiç göremiyordu — sadece özet (ortalama puan +
  // sayı) vardı, yorumu okumak için vitrini "ziyaretçi gibi" ayrı bir
  // sekmede açması gerekiyordu (kullanıcının fark ettiği gerçek bir eksiklik).
  const [reviewsList, setReviewsList] = useState([]);

  const serviceId = service?.dbId || service?.id;

  useEffect(() => {
    if (!userId || !serviceId) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [{ data: serviceRow }, { data: docs }, { data: items }] = await Promise.all([
        supabase.from("services").select("video_intro_url, video_intro_name, share_profile_reviews").eq("id", serviceId).maybeSingle(),
        supabase.from("provider_documents").select("*").eq("service_id", serviceId).order("created_at", { ascending: false }),
        supabase.from("portfolio_items").select("*").eq("service_id", serviceId).order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;
      if (serviceRow?.video_intro_url) setVideoIntro({ url: serviceRow.video_intro_url, name: serviceRow.video_intro_name || "Tanıtım Videosu" });
      setShareReviews(serviceRow?.share_profile_reviews ?? true);

      const docRows = docs || [];
      const certs = docRows.filter((d) => d.doc_type === "certificate");
      const cvDoc = docRows.find((d) => d.doc_type === "cv");
      const certsWithUrls = await Promise.all(certs.map(async (d) => {
        const { data: signed } = await supabase.storage.from("provider-documents").createSignedUrl(d.file_url, 3600);
        return { id: d.id, name: d.file_name || d.label || "Belge", url: signed?.signedUrl || "", isPdf: (d.file_name || "").toLowerCase().endsWith(".pdf") };
      }));
      if (cancelled) return;
      setCertificates(certsWithUrls);
      if (cvDoc) {
        const { data: signed } = await supabase.storage.from("provider-documents").createSignedUrl(cvDoc.file_url, 3600);
        setCv({ id: cvDoc.id, path: cvDoc.file_url, name: cvDoc.file_name || "CV", url: signed?.signedUrl || "" });
      } else {
        setCv(null);
      }
      setPortfolio((items || []).map((p) => ({ id: p.id, type: p.media_type, url: p.url, name: p.file_name })));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [userId, serviceId]);

  useEffect(() => {
    if (!serviceId) { setStatsLoading(false); return; }
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      // "Birleştir" (paylaşılan) modundaysa sağlayıcının TÜM vitrinlerine
      // gelen değerlendirmeler sayılmalı — eskiden burada her zaman sadece
      // service_id'ye göre sorgulanıyordu, bu da "Birleştir" açıkken (ki
      // varsayılan bu) sayının/listenin herkese açık sayfadakiyle
      // tutarsız, eksik görünmesine yol açıyordu (ListingDetail'in kendi
      // loadRealReviews'i bu ayrımı zaten doğru yapıyordu, burası yapmıyordu).
      let ratingsQuery = supabase.from("ratings").select("id, value, comment, created_at, rater_id, provider_reply, provider_reply_at").order("created_at", { ascending: false });
      ratingsQuery = shareReviews ? ratingsQuery.eq("rated_profile_id", userId) : ratingsQuery.eq("service_id", serviceId);
      const [{ data: jobsData }, { data: ratingsData }, { count: favCount }] = await Promise.all([
        supabase.from("jobs").select("id, state").eq("service_id", serviceId),
        ratingsQuery,
        supabase.from("favorites").select("id", { count: "exact", head: true }).eq("service_id", serviceId),
      ]);
      if (cancelled) return;
      const jobs = jobsData || [];
      const ratings = ratingsData || [];
      setStats({
        conversations: jobs.length,
        completed: jobs.filter((j) => j.state === "delivered").length,
        avgRating: ratings.length > 0 ? (ratings.reduce((s, r) => s + r.value, 0) / ratings.length).toFixed(1) : null,
        reviewCount: ratings.length,
        favorites: favCount || 0,
      });

      const raterIds = [...new Set(ratings.map((r) => r.rater_id))];
      let profilesById = {};
      if (raterIds.length > 0) {
        const { data: profilesData } = await supabase.from("profiles").select("id, full_name, business_name").in("id", raterIds);
        (profilesData || []).forEach((p) => { profilesById[p.id] = p; });
      }
      setReviewsList(ratings.map((r) => {
        const p = profilesById[r.rater_id];
        const name = (p?.business_name && p.business_name.trim()) || p?.full_name || "Kullanıcı";
        return { id: r.id, name, value: r.value, comment: r.comment || "", time: formatRelativeTr(r.created_at), providerReply: r.provider_reply || "" };
      }));
      setStatsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [serviceId, shareReviews, userId]);

  const uploadToProfileMedia = async (file, prefix) => {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `${userId}/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("profile-media").upload(path, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("profile-media").getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  };

  const toggleShareReviews = async (val) => {
    setShareReviewsSaving(true);
    setShareReviews(val);
    await supabase.from("services").update({ share_profile_reviews: val }).eq("id", serviceId);
    setShareReviewsSaving(false);
  };

  const handleVideoAdd = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setVideoError("");
    setVideoUploading(true);
    try {
      const { publicUrl } = await uploadToProfileMedia(file, "video-intro");
      const { error } = await supabase.from("services").update({ video_intro_url: publicUrl, video_intro_name: file.name }).eq("id", serviceId);
      if (error) throw error;
      setVideoIntro({ url: publicUrl, name: file.name });
    } catch (err) {
      setVideoError(`Yüklenemedi: ${err.message}`);
    } finally {
      setVideoUploading(false);
    }
  };

  const removeVideoIntro = async () => {
    await supabase.from("services").update({ video_intro_url: null, video_intro_name: null }).eq("id", serviceId);
    setVideoIntro(null);
  };

  const handlePortfolioAdd = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 9 - portfolio.length);
    e.target.value = "";
    if (!userId || files.length === 0) return;
    setPortfolioError("");
    setPortfolioUploading(true);
    try {
      for (const file of files) {
        const type = file.type.startsWith("video/") ? "video" : "image";
        const { publicUrl } = await uploadToProfileMedia(file, "portfolio");
        const { data: row, error } = await supabase
          .from("portfolio_items")
          .insert({ profile_id: userId, service_id: serviceId, media_type: type, url: publicUrl, file_name: file.name })
          .select()
          .single();
        if (error) throw error;
        setPortfolio((prev) => [...prev, { id: row.id, type, url: publicUrl, name: file.name }].slice(0, 9));
      }
    } catch (err) {
      setPortfolioError(`Yüklenemedi: ${err.message}`);
    } finally {
      setPortfolioUploading(false);
    }
  };

  const removePortfolioItem = async (item, idx) => {
    setPortfolio((prev) => prev.filter((_, i) => i !== idx));
    if (item.id) await supabase.from("portfolio_items").delete().eq("id", item.id);
  };

  const handleCertAdd = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - certificates.length);
    e.target.value = "";
    if (!userId || files.length === 0) return;
    setCertError("");
    setCertUploading(true);
    try {
      for (const file of files) {
        const ext = (file.name.split(".").pop() || "bin").toLowerCase();
        const path = `${userId}/cert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("provider-documents").upload(path, file);
        if (upErr) throw upErr;
        const { data: docRow, error: insErr } = await supabase
          .from("provider_documents")
          .insert({ profile_id: userId, service_id: serviceId, doc_type: "certificate", file_url: path, file_name: file.name })
          .select()
          .single();
        if (insErr) throw insErr;
        const { data: signed } = await supabase.storage.from("provider-documents").createSignedUrl(path, 3600);
        setCertificates((prev) => [...prev, { id: docRow.id, name: file.name, url: signed?.signedUrl || "", isPdf: file.type === "application/pdf" }].slice(0, 5));
      }
      onListingsChanged?.(); // has_certificates güncellendi, listeleri tazele
    } catch (err) {
      setCertError(`Yüklenemedi: ${err.message}`);
    } finally {
      setCertUploading(false);
    }
  };

  const removeCertificate = async (item, idx) => {
    setCertificates((prev) => prev.filter((_, i) => i !== idx));
    if (item.id) await supabase.from("provider_documents").delete().eq("id", item.id);
    onListingsChanged?.();
  };

  const handleCvAdd = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setCvError("");
    setCvUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
      const path = `${userId}/cv-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("provider-documents").upload(path, file);
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage.from("provider-documents").createSignedUrl(path, 3600);
      if (cv?.id) {
        const { error: updErr } = await supabase.from("provider_documents").update({ file_url: path, file_name: file.name }).eq("id", cv.id);
        if (updErr) throw updErr;
        setCv({ id: cv.id, path, name: file.name, url: signed?.signedUrl || "" });
      } else {
        const { data: docRow, error: insErr } = await supabase
          .from("provider_documents")
          .insert({ profile_id: userId, service_id: serviceId, doc_type: "cv", file_url: path, file_name: file.name })
          .select()
          .single();
        if (insErr) throw insErr;
        setCv({ id: docRow.id, path, name: file.name, url: signed?.signedUrl || "" });
      }
    } catch (err) {
      setCvError(`Yüklenemedi: ${err.message}`);
    } finally {
      setCvUploading(false);
    }
  };

  const removeCv = async () => {
    if (cv?.id) await supabase.from("provider_documents").delete().eq("id", cv.id);
    setCv(null);
  };

  if (!service) return null;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5" style={{ color: "#5C5744" }}>
        <ChevronLeft size={16} /> Vitrinlerime dön
      </button>
      <div className="flex items-center gap-2 mb-1">
        <Grid3x3 size={18} style={{ color: "#3F7D5C" }} />
        <h1 className="font-serif text-xl" style={{ color: "#1B2B24" }}>{service.title}</h1>
      </div>
      <p className="text-xs mb-6" style={{ color: "#8A8368" }}>
        Bu vitrine özel video, portföy ve belgeler — diğer vitrinlerinle paylaşılmaz, her biri kendi kimliğini taşır.
      </p>

      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} style={{ color: "#3F7D5C" }} />
          <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Vitrin Performansı</h2>
        </div>
        {statsLoading ? (
          <p className="text-xs" style={{ color: "#8A8368" }}>Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="font-serif text-2xl" style={{ color: "#1B2B24" }}>{stats?.conversations ?? 0}</p>
              <p className="text-[11px]" style={{ color: "#8A8368" }}>Görüşme başladı</p>
            </div>
            <div>
              <p className="font-serif text-2xl" style={{ color: "#1B2B24" }}>{stats?.completed ?? 0}</p>
              <p className="text-[11px]" style={{ color: "#8A8368" }}>İş tamamlandı</p>
            </div>
            <div>
              <p className="font-serif text-2xl" style={{ color: "#1B2B24" }}>{stats?.avgRating ?? "—"}{stats?.reviewCount ? ` (${stats.reviewCount})` : ""}</p>
              <p className="text-[11px]" style={{ color: "#8A8368" }}>Ortalama puan</p>
            </div>
            <div>
              <p className="font-serif text-2xl" style={{ color: "#1B2B24" }}>{stats?.favorites ?? 0}</p>
              <p className="text-[11px]" style={{ color: "#8A8368" }}>Favoriye eklendi</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ color: "#1B2B24" }}>Değerlendirmeler</p>
            <p className="text-xs mt-0.5" style={{ color: "#8A8368" }}>
              {shareReviews
                ? "Diğer vitrinlerinle birleşik — genel güvenilirliğin burada da görünür."
                : "Bu vitrine özel — sadece bu vitrin için gelen değerlendirmeler sayılır."}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs shrink-0 cursor-pointer" style={{ color: "#5C5744" }}>
            {shareReviewsSaving && <Loader2 size={12} className="animate-spin" />}
            <input type="checkbox" checked={shareReviews} onChange={(e) => toggleShareReviews(e.target.checked)} />
            Birleştir
          </label>
        </div>

        {/* Eskiden burada sadece ortalama/sayı vardı, yorumun kendi metnini
            okumak için vitrini "ziyaretçi gibi" ayrı sekmede açman
            gerekiyordu — artık burada da okunabiliyor. */}
        {!statsLoading && reviewsList.length > 0 && (
          <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid #D9D0BA" }}>
            {reviewsList.map((r) => (
              <div key={r.id} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: "#1B2B24" }}>{r.name}</span>
                  <span style={{ color: "#8A8368" }}>{r.time}</span>
                </div>
                <div className="flex items-center gap-0.5 my-0.5">
                  <Stars value={r.value} size={11} />
                </div>
                {r.comment && <p style={{ color: "#3D3B30" }}>{r.comment}</p>}
                {r.providerReply && (
                  <p className="mt-1 pl-2 border-l-2" style={{ color: "#5C5744", borderColor: "#D9D0BA" }}>
                    <b>Senin yanıtın:</b> {r.providerReply}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-xs" style={{ color: "#8A8368" }}>Yükleniyor...</p>
      ) : (
        <>
          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            <div className="flex items-center gap-2 mb-1">
              <PlayCircle size={16} style={{ color: "#2FBF71" }} />
              <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Tanıtım Videosu</h2>
            </div>
            <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
              Bu vitrini kısa bir videoyla tanıt. Vitrin sayfasında en üstte, tek ve öne çıkan video olarak görünür.
            </p>
            {videoError && (
              <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{videoError}</p>
            )}
            {videoIntro ? (
              <div>
                <video controls playsInline className="w-full rounded-lg bg-black mb-2" style={{ maxHeight: "240px" }}>
                  <source src={videoIntro.url} />
                </video>
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate" style={{ color: "#5C5744" }}>{videoIntro.name}</span>
                  <button onClick={removeVideoIntro} className="text-xs font-medium flex items-center gap-1" style={{ color: "#9C4A3C" }}>
                    <Trash2 size={12} /> Kaldır
                  </button>
                </div>
              </div>
            ) : (
              <label
                className="flex items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
                style={{ borderColor: "#D9D0BA", color: "#5C5744", opacity: videoUploading ? 0.6 : 1 }}
              >
                {videoUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {videoUploading ? "Yükleniyor..." : "Tanıtım Videosu Yükle (en fazla 60 saniye önerilir)"}
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoAdd} disabled={videoUploading} />
              </label>
            )}
          </div>

          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            <div className="flex items-center gap-2 mb-1">
              <Grid3x3 size={16} style={{ color: "#2FBF71" }} />
              <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Portföy — İş Başında</h2>
            </div>
            <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
              Bu vitrindeki hizmeti verirken çekilmiş fotoğraf/videolar. Instagram tarzı bir ızgarada görünür.
            </p>
            {portfolioError && (
              <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{portfolioError}</p>
            )}
            <div className="grid grid-cols-3 gap-1.5">
              {portfolio.map((item, i) => (
                <div key={item.id || i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <button onClick={() => setLightbox({ media: portfolio, index: i })} className="w-full h-full block">
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
                    onClick={() => removePortfolioItem(item, i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}
              {portfolio.length < 9 && (
                <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer gap-1" style={{ borderColor: "#D9D0BA", color: "#8A8368", opacity: portfolioUploading ? 0.6 : 1 }}>
                  {portfolioUploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                  <span className="text-[10px] font-medium">{portfolioUploading ? "Yükleniyor..." : "Ekle"}</span>
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePortfolioAdd} disabled={portfolioUploading} />
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

          {docViewer && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.8)" }}
              onClick={() => setDocViewer(null)}
            >
              <div
                className="rounded-xl overflow-hidden w-full max-w-2xl flex flex-col"
                style={{ background: "#FFFFFF", height: "85vh" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "#F0F0F0" }}>
                  <p className="text-sm font-medium truncate" style={{ color: "#1B2B24" }}>{docViewer.name}</p>
                  <button onClick={() => setDocViewer(null)} className="shrink-0 ml-3">
                    <X size={18} style={{ color: "#5C5744" }} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto" style={{ background: "#F7F7F8" }}>
                  {docViewer.isPdf ? (
                    <iframe src={docViewer.url} title={docViewer.name} className="w-full h-full border-0" />
                  ) : /\.(png|jpe?g|webp|gif)$/i.test(docViewer.name || "") ? (
                    <img src={docViewer.url} alt={docViewer.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="h-full flex items-center justify-center p-6 text-center">
                      <p className="text-sm" style={{ color: "#5C5744" }}>Bu dosya türü tarayıcı içinde önizlenemiyor.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            <div className="flex items-center gap-2 mb-1">
              <Award size={16} style={{ color: "#C2872B" }} />
              <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>Sertifika & Belgeler</h2>
            </div>
            <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
              Bu vitrinle ilgili diploma, ustalık belgesi, lisans veya sertifikaları ekle — bu vitrinde "Doğrulanmış" rozeti olarak görünür.
            </p>
            {certError && (
              <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{certError}</p>
            )}
            <div className="space-y-2 mb-3">
              {certificates.map((c, i) => (
                <div key={c.id || i} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: "#EFE8D8" }}>
                  <button onClick={() => setDocViewer({ url: c.url, name: c.name, isPdf: c.isPdf })} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                    {c.isPdf ? (
                      <FileText size={16} style={{ color: "#3A5BA0" }} className="shrink-0" />
                    ) : (
                      <img src={c.url} alt="" className="w-9 h-9 rounded object-cover shrink-0" />
                    )}
                    <span className="text-xs flex-1 truncate underline decoration-dotted" style={{ color: "#1B2B24" }}>{c.name}</span>
                  </button>
                  <button onClick={() => removeCertificate(c, i)} className="shrink-0">
                    <Trash2 size={14} style={{ color: "#9C4A3C" }} />
                  </button>
                </div>
              ))}
            </div>
            {certificates.length < 5 && (
              <label
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
                style={{ borderColor: "#D9D0BA", color: "#5C5744", opacity: certUploading ? 0.6 : 1 }}
              >
                {certUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                {certUploading ? "Yükleniyor..." : "Sertifika/Belge Ekle (PDF veya görsel)"}
                <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={handleCertAdd} disabled={certUploading} />
              </label>
            )}
          </div>

          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#D9D0BA", background: "#F8F4E9" }}>
            <div className="flex items-center gap-2 mb-1">
              <FileText size={16} style={{ color: "#3A5BA0" }} />
              <h2 className="text-sm font-bold" style={{ color: "#1B2B24" }}>CV / Özgeçmiş</h2>
            </div>
            <p className="text-xs mb-4" style={{ color: "#8A8368" }}>
              Bu vitrinle ilgili özgeçmişini ekle (özellikle Mühendis, Öğretmen gibi kategorilerde önerilir).
            </p>
            {cvError && (
              <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(156,74,60,0.1)", color: "#9C4A3C" }}>{cvError}</p>
            )}
            {cv ? (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: "#EFE8D8" }}>
                <button
                  onClick={() => setDocViewer({ url: cv.url, name: cv.name, isPdf: (cv.name || "").toLowerCase().endsWith(".pdf") })}
                  className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                >
                  <FileText size={16} style={{ color: "#3A5BA0" }} className="shrink-0" />
                  <span className="text-xs flex-1 truncate underline decoration-dotted" style={{ color: "#1B2B24" }}>{cv.name}</span>
                </button>
                <button onClick={removeCv} className="shrink-0">
                  <Trash2 size={14} style={{ color: "#9C4A3C" }} />
                </button>
              </div>
            ) : (
              <label
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium cursor-pointer"
                style={{ borderColor: "#D9D0BA", color: "#5C5744", opacity: cvUploading ? 0.6 : 1 }}
              >
                {cvUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                {cvUploading ? "Yükleniyor..." : "CV Yükle (PDF, Word veya görsel — hangi formattaysa)"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                  className="hidden"
                  onChange={handleCvAdd}
                  disabled={cvUploading}
                />
              </label>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Sayfa yenilenince (F5) hangi görünümde kaldığımızı hatırlamak için URL'e
// yazıyoruz. "detail"/"offers"/"aimatch" gibi görünümler, sadece bu oturumda
// var olan bir nesneye (seçili ilan, son iş ilanı) ihtiyaç duyduğu için
// yenilemeden sonra yeniden kurulamıyor — o yüzden hatırlanan görünümler bu
// listeyle sınırlı, diğerleri yenilenince ana sayfaya düşer.
const RESTORABLE_VIEWS = new Set([
  "home", "profile", "createListing", "map", "post", "pricing", "messages",
  "search", "nailart", "support", "adminReports", "adminModeration", "adminAnalytics", "favorites",
]);

function getInitialView() {
  if (typeof window === "undefined") return "home";
  const v = new URLSearchParams(window.location.search).get("view");
  return v && RESTORABLE_VIEWS.has(v) ? v : "home";
}

// Yüzen "Destek Asistanı" butonu — sürüklenip her ekranda başka bir şeyin
// (örn. mesajlaşma ekranındaki gönder butonunun) üzerine denk gelmeyecek bir
// yere taşınabilsin diye. Konumu localStorage'da tutulur (per-viewer, sunucuya
// gitmez) — bir kere taşındıktan sonra sayfa/görünüm değişse de aynı yerde kalır.
// Pointer Events (mouse+dokunma tek API) kullanılıyor, touchAction:"none" ile
// mobilde sürüklerken sayfanın kaymasını engelliyoruz.
function DraggableSupportButton({ onClick }) {
  const [pos, setPos] = useState(null); // { x, y } — null = varsayılan sağ-alt köşe
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const BTN = 56;
  const MARGIN = 20;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("isinn_support_btn_pos");
      if (saved) setPos(JSON.parse(saved));
    } catch {}
  }, []);

  const getCurrentPos = () =>
    pos || { x: window.innerWidth - BTN - MARGIN, y: window.innerHeight - BTN - MARGIN };

  const onPointerDown = (e) => {
    draggingRef.current = true;
    movedRef.current = false;
    const current = getCurrentPos();
    startRef.current = { x: e.clientX, y: e.clientY, posX: current.x, posY: current.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
    const nx = Math.max(4, Math.min(window.innerWidth - BTN - 4, startRef.current.posX + dx));
    const ny = Math.max(4, Math.min(window.innerHeight - BTN - 4, startRef.current.posY + dy));
    setPos({ x: nx, y: ny });
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (movedRef.current) {
      const current = getCurrentPos();
      try { localStorage.setItem("isinn_support_btn_pos", JSON.stringify(current)); } catch {}
    }
  };

  const handleClick = () => {
    if (movedRef.current) { movedRef.current = false; return; } // sürüklemeydi, tıklama sayılmasın
    onClick();
  };

  const current = pos;
  const style = current
    ? { position: "fixed", left: current.x, top: current.y, touchAction: "none" }
    : { position: "fixed", bottom: MARGIN, right: MARGIN, touchAction: "none" };

  return (
    <button
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={handleClick}
      className="z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform"
      style={{ ...style, background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
    >
      <LifeBuoy size={22} />
    </button>
  );
}

export default function IsinnPrototype({ session, onRequireAuth }) {
  const [view, setView] = useState(getInitialView);
  const [selected, setSelected] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingListing, setEditingListing] = useState(null); // Düzenle ile açılan ilan (CreateListingView)
  const [editingJob, setEditingJob] = useState(null); // Düzenle ile açılan iş ilanı (PostJobView)
  const [managingVitrin, setManagingVitrin] = useState(null); // Medya yönetimi açılan vitrin (VitrinMediaView)
  const [favoriteIds, setFavoriteIds] = useState(new Set()); // gerçek, kalıcı favoriler (favorites tablosu)
  const [trialBanner, setTrialBanner] = useState(null); // { status, planName, daysLeft } — provider_subscriptions'tan
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(false);
  const [filter, setFilter] = useState("local");
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [lastJob, setLastJob] = useState(null);
  const [messageContact, setMessageContact] = useState(null);
  const [realListings, setRealListings] = useState([]); // services tablosundan gelen gerçek ilanlar
  const [listingsLoading, setListingsLoading] = useState(true);
  const [realJobs, setRealJobs] = useState([]); // jobs tablosundan gelen gerçek iş ilanları ("İlan Ver")
  // Ana sayfa hero'sundaki "12.400+ Sağlayıcı" gibi rakamlar eskiden sabit,
  // sahte sayılardı — platformda o kadar gerçek kullanıcı yokken bu yanıltıcı
  // bir sosyal kanıt iddiasıydı. Artık gerçek sayılara bağlı (küçük olsalar
  // bile dürüst).
  const [platformStats, setPlatformStats] = useState({ providers: 0, completedJobs: 0, avgRating: null });
  const [adminReports, setAdminReports] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [pendingMediaApprovals, setPendingMediaApprovals] = useState([]); // sağlayıcının kendi kimlik onayı kuyruğu
  const [staffModerationQueue, setStaffModerationQueue] = useState([]); // platform çalışanının içerik güvenliği kuyruğu (şu an sadece video)

  const userId = session?.user?.id;

  // Gerçek bir admin rolü — bkz. supabase/admin_role.sql. Tam bir rol/izin
  // sistemi değil, tek bir bayrak: kullanıcının kendi hesabını (profiles.
  // is_admin) admin işaretledik. Destek Talepleri ve Kullanıcı Şikayetleri
  // ekranları buna göre "sadece kendim" / "hepsi" arasında geçiş yapıyor.
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!userId) { setIsAdmin(false); return; }
    let cancelled = false;
    supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle().then(({ data }) => {
      if (!cancelled) setIsAdmin(!!data?.is_admin);
    });
    return () => { cancelled = true; };
  }, [userId]);

  // Gerçek, kalıcı favoriler (favorites tablosu — schema (3).sql'de zaten
  // vardı, hem vitrin hem iş ilanı favorileyebilecek şekilde, ama hiç
  // kullanılmıyordu). Demo/sabit LISTINGS/JOB_POSTINGS için kalıcılık anlamlı
  // değil (gerçek satır değiller), o yüzden sadece gerçek olanlar (isReal)
  // favorilenebiliyor. service_id ve job_id UUID'leri farklı tablolardan
  // geldiği için asla çakışmaz — tek bir favoriteIds Set'inde birlikte
  // tutuluyor, hangi tablodan geldiği FavoritesView'da realListings/realJobs
  // üzerinden ayrıştırılıyor (bkz. o bileşen).
  const loadFavorites = async () => {
    if (!userId) { setFavoriteIds(new Set()); return; }
    const { data } = await supabase.from("favorites").select("service_id, job_id").eq("profile_id", userId);
    const ids = (data || []).map((f) => f.service_id || f.job_id).filter(Boolean);
    setFavoriteIds(new Set(ids));
  };
  useEffect(() => { loadFavorites(); }, [userId]);

  // Deneme/üyelik bitişine kalan gün — kullanıcı gerçek e-posta/SMS hatırlatma
  // istemedi ("sadece uygulamada bildirim verelim, aktif kullanıcı zaten
  // fark eder") — bu yüzden bunu tüm sayfalarda görünen, Header'ın altındaki
  // global bir banner olarak gösteriyoruz, sadece Profil sayfasına gömülü değil.
  // Gerçek otomatik faturalama da yok — uygulama her açıldığında dönemi bitmiş
  // ama hâlâ 'active' bir üyelik varsa "yenilenmiş" sayılır (bkz.
  // supabase/pro_boost_recurring.sql) — Pro'da bu, 7 günlük öne çıkarma
  // hediyesinin gerçekten ay ay tekrar açılmasını sağlıyor.
  const loadTrialInfo = async () => {
    if (!userId) { setTrialBanner(null); return; }
    await supabase.rpc("sync_subscription_period"); // hata döner (throw etmez), sonucu zaten kullanmıyoruz
    const { data } = await supabase
      .from("provider_subscriptions")
      .select("status, current_period_end, billing_cycle, subscription_plans(name, slug)")
      .eq("profile_id", userId)
      .in("status", ["active", "trialing"])
      .maybeSingle();
    if (!data) { setTrialBanner(null); return; }
    const daysLeft = Math.ceil((new Date(data.current_period_end) - new Date()) / (1000 * 60 * 60 * 24));
    const planSlug = data.subscription_plans?.slug || "standart";
    // Banner eskiden hep "159₺/ay" diyordu — Pro'daki ya da yıllık ödemeyi
    // seçmiş biri için yanlıştı (gerçek bir hataydı, fark edildi). Artık
    // gerçek plan+döngüye göre doğru fiyatı gösteriyor.
    const isYearly = data.billing_cycle === "yearly";
    const priceLabel = planSlug === "pro"
      ? (isYearly ? `${PRO_PACKAGE.priceYearly}₺/yıl` : `${PRO_PACKAGE.priceMonthly}₺/ay`)
      : (isYearly ? `${PLANS[0].priceYearly}₺/yıl` : `${PLANS[0].priceMonthly}₺/ay`);
    setTrialBanner({
      status: data.status,
      planName: data.subscription_plans?.name || "Standart Üyelik",
      planSlug,
      priceLabel,
      daysLeft,
    });
  };
  useEffect(() => { loadTrialInfo(); setTrialBannerDismissed(false); }, [userId]);

  const toggleFavorite = async (item, kind = "service") => {
    if (!item?.isReal || !item.dbId) return;
    if (!userId) { onRequireAuth?.(); return; }
    const has = favoriteIds.has(item.dbId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      has ? next.delete(item.dbId) : next.add(item.dbId);
      return next;
    });
    const column = kind === "job" ? "job_id" : "service_id";
    if (has) await supabase.from("favorites").delete().eq("profile_id", userId).eq(column, item.dbId);
    else await supabase.from("favorites").insert({ profile_id: userId, [column]: item.dbId });
  };

  // Gerçek ilanları services tablosundan çeker. Hem ilk yüklemede hem de yeni
  // bir ilan yayınlandıktan sonra çağrılıyor — böylece "sayfayı yenile, hâlâ
  // görünüyor mu" testi gerçekten kalıcılığı sınıyor (local state değil).
  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*, profiles(*), categories(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const mapped = data.map(mapServiceRowToListing);
      // Gerçek ortalama puan/yorum sayısını da kartlara yansıtıyoruz — ratings
      // sağlayıcıya bağlı (bkz. schema), o yüzden tek sorguda tüm gerçek
      // ilanların sağlayıcıları için toplu çekip client tarafında topluyoruz.
      const providerIds = [...new Set(mapped.map((l) => l.providerId).filter(Boolean))];
      if (providerIds.length > 0) {
        const { data: ratingsData } = await supabase.from("ratings").select("rated_profile_id, service_id, value").in("rated_profile_id", providerIds);
        const byProvider = {};
        const byService = {};
        (ratingsData || []).forEach((r) => {
          if (!byProvider[r.rated_profile_id]) byProvider[r.rated_profile_id] = [];
          byProvider[r.rated_profile_id].push(r.value);
          if (r.service_id) {
            if (!byService[r.service_id]) byService[r.service_id] = [];
            byService[r.service_id].push(r.value);
          }
        });
        mapped.forEach((l) => {
          // "Ayrı tut" diyen vitrinler sadece kendi service_id'sine bırakılan
          // değerlendirmeleri sayar; "Birleştir" (varsayılan) diyenler kişiye
          // bağlı tüm değerlendirmeleri (bkz. VitrinMediaView).
          const values = l.shareProfileReviews ? byProvider[l.providerId] : byService[l.dbId];
          if (values && values.length > 0) {
            l.rating = Number((values.reduce((s, v) => s + v, 0) / values.length).toFixed(1));
            l.reviewCount = values.length;
          }
        });

        // Aktif "Öne Çıkarma Paketi" (provider_addons, sağlayıcı bazlı — belirli
        // bir vitrine değil) sahibi olan sağlayıcıları işaretliyoruz. Sıralama/
        // "Öne Çıkan" mantığı bunu computeVisibilityScore ve seededDailyShuffle
        // ile sınırlı, adil bir bonusa çeviriyor (bkz. o fonksiyonların üstündeki not).
        const { data: addonRows } = await supabase
          .from("provider_addons")
          .select("profile_id, current_period_end, addon_products!inner(slug)")
          .in("profile_id", providerIds)
          .eq("status", "active")
          .in("addon_products.slug", ["one-cikarma", "one-cikarma-haftalik"]);
        const boostedIds = new Set(
          (addonRows || [])
            .filter((r) => new Date(r.current_period_end) > new Date())
            .map((r) => r.profile_id)
        );
        if (boostedIds.size > 0) {
          mapped.forEach((l) => { l.isBoosted = boostedIds.has(l.providerId); });
        }

        // Seviye rozeti (Yeni Satıcı/Level 1/Level 2/Top Rated) — eskiden
        // gerçek vitrinlerde her zaman sabit "new" idi, mapServiceRowToListing
        // hiç gerçek performansa bakmıyordu (aramızda konuşuldu, kullanıcı
        // "sağlıklı kur" dedi). Tamamlanan iş sayısı (jobs.state='delivered')
        // + puan + yorum sayısına göre otomatik hesaplanıyor, kimse manuel
        // atamıyor — bkz. computeProviderLevel.
        const serviceIds = mapped.map((l) => l.dbId).filter(Boolean);
        if (serviceIds.length > 0) {
          const { data: deliveredJobs } = await supabase
            .from("jobs")
            .select("service_id")
            .eq("state", "delivered")
            .in("service_id", serviceIds);
          const completedByService = {};
          (deliveredJobs || []).forEach((j) => {
            if (j.service_id) completedByService[j.service_id] = (completedByService[j.service_id] || 0) + 1;
          });
          const serviceIdsByProvider = {};
          mapped.forEach((l) => {
            if (!l.providerId || !l.dbId) return;
            (serviceIdsByProvider[l.providerId] = serviceIdsByProvider[l.providerId] || []).push(l.dbId);
          });
          mapped.forEach((l) => {
            // Değerlendirmelerdeki "Birleştir/Ayrı tut" tercihiyle tutarlı:
            // birleştirenler kişinin TÜM vitrinlerindeki tamamlanan işleri
            // sayar, ayrı tutanlar sadece bu vitrini.
            const completedJobs = l.shareProfileReviews
              ? (serviceIdsByProvider[l.providerId] || []).reduce((sum, sid) => sum + (completedByService[sid] || 0), 0)
              : (completedByService[l.dbId] || 0);
            l.level = computeProviderLevel(completedJobs, l.rating, l.reviewCount);
          });
        }
      }
      setRealListings(mapped);
    }
    setListingsLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    (async () => {
      const [{ data: providerRows }, { count: completedCount }, { data: ratingsData }] = await Promise.all([
        supabase.from("services").select("provider_id").eq("active", true),
        supabase.from("jobs").select("id", { count: "exact", head: true }).eq("state", "delivered"),
        supabase.from("ratings").select("value"),
      ]);
      const distinctProviders = new Set((providerRows || []).map((r) => r.provider_id)).size;
      const ratings = ratingsData || [];
      const avgRating = ratings.length > 0 ? Number((ratings.reduce((s, r) => s + r.value, 0) / ratings.length).toFixed(1)) : null;
      setPlatformStats({ providers: distinctProviders, completedJobs: completedCount || 0, avgRating });
    })();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, profiles(*), categories(*)")
      .eq("active", true)
      .order("bumped_at", { ascending: false });
    if (!error && data) {
      setRealJobs(data.map(mapJobRowToPosting));
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // KRİTİK HATA (kullanıcı bildirimi: "AI ile yazınca geri yapınca siteden
  // komple atıyor"): bu efekt her zaman replaceState kullanıyordu — yani
  // uygulama içi hiçbir gezinme tarayıcı geçmişine YENİ bir kayıt eklemiyordu.
  // Sonuç: kullanıcı telefonun/tarayıcının FİZİKSEL geri tuşuna/kaydırmasına
  // bastığında, uygulama içindeki bir önceki ekrana değil, DOĞRUDAN siteye
  // gelmeden önce neredeyse oraya (Google sonucu, boş sekme, ne varsa)
  // atılıyordu — "AI ile Yaz" bunun tetikleyicisi değildi, sadece kullanıcının
  // "bir şeyi beğenmedim, geri döneyim" refleksinin en sık yaşandığı an oldu.
  // Artık her view değişikliği gerçek bir pushState kaydı ekliyor (ilk
  // yüklemede hariç) ve popstate ile fiziksel geri/ileri tuşu uygulama
  // içinde çalışıyor.
  const historyInitedRef = useRef(false);
  const fromPopStateRef = useRef(false);
  useEffect(() => {
    if (fromPopStateRef.current) { fromPopStateRef.current = false; return; }
    const url = new URL(window.location.href);
    if (view === "home") url.searchParams.delete("view");
    else url.searchParams.set("view", view);
    if (!historyInitedRef.current) { historyInitedRef.current = true; window.history.replaceState({}, "", url); return; }
    window.history.pushState({}, "", url);
  }, [view]);

  useEffect(() => {
    const onPopState = () => {
      fromPopStateRef.current = true;
      setView(getInitialView());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Kayıt olurken e-posta onayı gerekiyorsa (AuthView.jsx), auth.uid() henüz
  // set olmadığı için o an profiles satırı oluşturulamıyor — kullanıcı sonradan
  // giriş yapınca profil satırı hiç yoktur. services.provider_id gibi alanlar
  // profiles(id)'e referans verdiği için (foreign key) bu eksik satır, ilan
  // oluşturmayı da profil sayfasını da bozar. Burada eksikse tamamlıyoruz.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
      if (cancelled || existing) return;
      const fallbackName =
        session?.user?.user_metadata?.full_name ||
        (session?.user?.email ? session.user.email.split("@")[0] : "Kullanıcı");
      // KVKK/Gizlilik/Kullanım Şartları onayı kayıt formunda (AuthView)
      // verildi — e-posta onayı bekleyen hesaplarda profil satırı o an
      // oluşturulamadığı için bu bilgi user_metadata'da taşınmıştı, satır
      // burada oluşurken kaydediliyor.
      await supabase.from("profiles").insert({
        id: userId,
        full_name: fallbackName,
        terms_accepted_at: session?.user?.user_metadata?.terms_accepted_at || null,
        terms_version: session?.user?.user_metadata?.terms_version || null,
      });
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const runSearch = (q, city = "") => {
    const normalized = q.trim().toLocaleLowerCase("tr-TR");
    if (["tırnakçı", "tırnak", "nail", "nailart", "manikür", "manikur"].some((kw) => normalized.includes(kw))) {
      setView("nailart");
      return;
    }
    setQuery(q);
    setCityFilter(city);
    setView("search");
  };

  // Bir iş ilanına "Teklif Ver" — gerçek bir ilansa (posterId/categoryDbId
  // varsa) gerçek mesajlaşmaya bağlanır (bkz. MessagesView'daki existingJobId
  // desteği), demo/sabit ilanlarda eski local-only sohbet akışı çalışır.
  // Bildirim panelinden bir bildirime tıklayınca ilgili yere götürür —
  // bkz. NotificationBell/notifications_center.sql.
  const handleNotificationClick = async (n) => {
    if (n.type === "new_message" || n.type === "job_delivered") {
      setView("messages");
      return;
    }
    if (n.type === "pending_media_approval") {
      setView("profile");
      return;
    }
    if ((n.type === "media_approved" || n.type === "media_rejected" || n.type === "saved_search_match") && n.related_service_id) {
      const { data } = await supabase.from("services").select("*, profiles(*), categories(*)").eq("id", n.related_service_id).maybeSingle();
      if (data) { setSelected(mapServiceRowToListing(data)); setView("detail"); return; }
    }
    setView("home");
  };

  const openJobContact = (job) => {
    if (!userId) { onRequireAuth?.(); return; }
    setMessageContact({
      name: job.posterName,
      listingTitle: job.title,
      providerId: job.posterId,
      categoryId: job.categoryDbId,
      existingJobId: job.dbId,
    });
    setView("messages");
  };

  // Gezinme (ilan/vitrin/profil görüntüleme) herkese açık — sadece eylem
  // gerektiren ekranlara (vitrin/iş ilanı oluşturma, mesajlaşma, kendi profilin)
  // giriş yapmadan gidilemiyor; o durumda view değişmez, giriş ekranı açılır
  // (bkz. app/page.js'deki onRequireAuth). "auth" değeri Header'daki "Giriş
  // Yap" butonundan geliyor.
  const GATED_VIEWS = new Set(["createListing", "post", "messages", "profile", "favorites", "vitrinMedia"]);
  const handleNav = (v) => {
    if (v === "auth") { onRequireAuth?.(); return; }
    if (!userId && GATED_VIEWS.has(v)) { onRequireAuth?.(); return; }
    setView(v);
    setSelected(null);
    setEditingListing(null);
    if (v !== "messages") setMessageContact(null);
  };

  // ?view=profile gibi bir URL'den (F5 sonrası restore) doğrudan gated bir
  // ekrana düşülmüş olabilir — session yoksa geri Ana Sayfa'ya al, giriş ekranını
  // aç. handleNav'daki kontrolün aynısı, sadece ilk yüklemede de çalışsın diye.
  useEffect(() => {
    if (!userId && GATED_VIEWS.has(view)) {
      setView("home");
      onRequireAuth?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF", fontFamily: "ui-sans-serif, system-ui" }}>
      <Header onNav={handleNav} onSearch={runSearch} pendingCount={pendingMediaApprovals.length + staffModerationQueue.length} session={session} onNotificationClick={handleNotificationClick} />
      {!trialBannerDismissed && trialBanner?.status === "trialing" && trialBanner.daysLeft <= 7 && (
        <div className="flex items-center gap-3 px-5 py-2.5" style={{ background: "#FFFBEB", borderBottom: "1px solid #F0E4C4" }}>
          <AlertCircle size={15} style={{ color: "#C2872B" }} className="shrink-0" />
          <p className="text-xs flex-1" style={{ color: "#5C5744" }}>
            {trialBanner.daysLeft <= 0
              ? "Ücretsiz deneme süren bugün doluyor."
              : trialBanner.daysLeft === 1
              ? "Ücretsiz deneme süren yarın doluyor."
              : `Ücretsiz deneme süren ${trialBanner.daysLeft} gün sonra doluyor.`}{" "}
            Sonrasında {trialBanner.planName} {trialBanner.priceLabel} olarak devam eder — istediğin zaman iptal edebilirsin.
          </p>
          <button onClick={() => handleNav("pricing")} className="text-xs font-bold shrink-0" style={{ color: "#C2872B" }}>Planlar</button>
          <button onClick={() => setTrialBannerDismissed(true)} className="shrink-0">
            <X size={14} style={{ color: "#8A8368" }} />
          </button>
        </div>
      )}
      {view === "home" && (
        <HomeView
          onSelectListing={(l) => { setSelected(l); setView("detail"); }}
          onNav={handleNav}
          filter={filter}
          setFilter={setFilter}
          onSearch={runSearch}
          onOpenJob={(job) => { setSelectedJob(job); setView("jobDetail"); }}
          onApplyJob={openJobContact}
          realListings={realListings}
          listingsLoading={listingsLoading}
          realJobs={realJobs}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onToggleJobFavorite={(job) => toggleFavorite(job, "job")}
          platformStats={platformStats}
        />
      )}
      {view === "search" && (
        <SearchResultsView
          query={query}
          cityFilter={cityFilter}
          onBack={() => setView("home")}
          onSelectListing={(l) => { setSelected(l); setView("detail"); }}
          realListings={realListings}
          currentUserId={userId}
        />
      )}
      {view === "createListing" && (
        <CreateListingView
          onBack={() => { setEditingListing(null); setView("home"); }}
          onGoToProfile={() => { setEditingListing(null); setView("profile"); }}
          onCreated={() => fetchListings()}
          userId={userId}
          editingListing={editingListing}
        />
      )}
      {view === "detail" && selected && (
        <ListingDetail
          listing={selected}
          onBack={() => setView("home")}
          onContact={() => {
            if (!userId) { onRequireAuth?.(); return; }
            setMessageContact({
              name: selected.provider,
              listingTitle: selected.title,
              providerId: selected.providerId,
              categoryId: selected.categoryDbId,
              listingId: selected.dbId,
            });
            setView("messages");
          }}
          userReviews={userReviews}
          onAddReview={(review) => setUserReviews((prev) => [review, ...prev])}
          onSubmitPendingMedia={(item) => setPendingMediaApprovals((prev) => [item, ...prev])}
          onSubmitStaffReview={(item) => setStaffModerationQueue((prev) => [item, ...prev])}
          currentUserId={userId}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {view === "post" && (
        <PostJobView
          onBack={() => { setEditingJob(null); setView("home"); }}
          onGoToProfile={() => { setEditingJob(null); setView("profile"); }}
          onSubmitted={() => setView("home")}
          onViewOffers={(job) => { setLastJob(job); setView("offers"); }}
          onMatchAI={(job) => { setLastJob(job); setView("aimatch"); }}
          userId={userId}
          onJobPosted={() => fetchJobs()}
          editingJob={editingJob}
          onJobUpdated={() => { setEditingJob(null); fetchJobs(); setView("profile"); }}
        />
      )}
      {view === "map" && (
        <MapView
          onBack={() => setView("home")}
          realListings={realListings}
          realJobs={realJobs}
          onSelectProvider={(p) => {
            const matched = p.listing || LISTINGS.find((l) => l.provider === p.name) || LISTINGS[0];
            setSelected(matched);
            setView("detail");
          }}
          onSelectJob={openJobContact}
        />
      )}
      {view === "jobDetail" && selectedJob && (
        <JobDetailView
          job={selectedJob}
          onBack={() => setView("home")}
          onContact={() => openJobContact(selectedJob)}
          currentUserId={userId}
        />
      )}
      {view === "offers" && <OffersView onBack={() => setView("home")} job={lastJob} />}
      {view === "aimatch" && (
        <AIMatchView
          job={lastJob}
          onBack={() => setView("home")}
          onSelectListing={(l) => { setSelected(l); setView("detail"); }}
          realListings={realListings}
        />
      )}
      {view === "nailart" && (
        <NailArtView
          onBack={() => setView("home")}
          onContact={(contact) => { if (!userId) { onRequireAuth?.(); return; } setMessageContact(contact); setView("messages"); }}
        />
      )}
      {view === "messages" && (
        <MessagesView
          onBack={() => setView("home")}
          initialContact={messageContact}
          currentUserId={userId}
          onOpenListing={(l) => { setSelected(l); setView("detail"); }}
        />
      )}
      {view === "pricing" && <PricingView onBack={() => setView("home")} onJoined={() => setView("profile")} userId={userId} />}
      {view === "favorites" && (
        <FavoritesView
          onBack={() => setView("home")}
          onSelectListing={(l) => { setSelected(l); setView("detail"); }}
          onOpenJob={(job) => { setSelectedJob(job); setView("jobDetail"); }}
          realListings={realListings}
          realJobs={realJobs}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onToggleJobFavorite={(job) => toggleFavorite(job, "job")}
        />
      )}
      {view === "profile" && (
        <ProfileView
          userId={userId}
          onListingsChanged={fetchListings}
          onJobsChanged={fetchJobs}
          onEditListing={(l) => { setEditingListing(l); setView("createListing"); }}
          onEditJob={(j) => { setEditingJob(j); setView("post"); }}
          onBack={() => setView("home")}
          onOpenAdminReports={() => setView("adminReports")}
          onOpenAnalytics={() => setView("adminAnalytics")}
          onOpenModeration={() => setView("adminModeration")}
          onOpenUserReports={() => setView("adminUserReports")}
          onOpenListingReports={() => setView("adminListingReports")}
          onOpenContentFlags={() => setView("adminContentFlags")}
          isAdmin={isAdmin}
          pendingMediaApprovals={pendingMediaApprovals}
          onApproveMedia={(id) => {
            const item = pendingMediaApprovals.find((p) => p.id === id);
            if (item) {
              setUserReviews((prev) => prev.map((r) => (r.id === item.reviewId ? { ...r, media: [{ type: item.mediaType, url: item.mediaUrl }] } : r)));
            }
            setPendingMediaApprovals((prev) => prev.filter((p) => p.id !== id));
          }}
          onRejectMedia={(id) => setPendingMediaApprovals((prev) => prev.filter((p) => p.id !== id))}
          onOpenVitrinMedia={(l) => { setManagingVitrin(l); setView("vitrinMedia"); }}
        />
      )}
      {view === "vitrinMedia" && (
        <VitrinMediaView
          userId={userId}
          service={managingVitrin}
          onBack={() => setView("profile")}
          onListingsChanged={fetchListings}
        />
      )}
      {view === "support" && (
        <SupportChatView
          onBack={() => setView("home")}
          onReport={(report) => setAdminReports((prev) => [report, ...prev])}
          currentUserId={userId}
        />
      )}
      {view === "adminReports" && <AdminReportsView onBack={() => setView("home")} reports={adminReports} userId={userId} isAdmin={isAdmin} />}
      {view === "adminUserReports" && isAdmin && <AdminUserReportsView onBack={() => setView("home")} />}
      {view === "adminListingReports" && isAdmin && <AdminListingReportsView onBack={() => setView("home")} />}
      {view === "adminContentFlags" && isAdmin && <AdminContentFlagsView onBack={() => setView("home")} />}
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

      {view !== "support" && <DraggableSupportButton onClick={() => setView("support")} />}
    </div>
  );
}
