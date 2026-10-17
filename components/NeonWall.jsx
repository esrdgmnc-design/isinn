"use client";

import { Abril_Fatface, Bungee, Lobster, Tilt_Neon, Pacifico, Playfair_Display, Grenze_Gotisch, Anton } from "next/font/google";

// "Ne arıyorsun?" sağ paneli (2026-10-17, kurucu isteği): duman görseli yerine farklı yazı
// stillerinde neon "İşinn" tabelalarıyla dolu bir duvar. Renkler logoyla uyumlu (ağırlık marka
// mavisi, araya beyaz/camgöbeği/mor). Birkaç tabela yavaşça titrer (saniyede birden az, sert
// yanıp sönme yok); hareket azaltılmışsa titreme yok (globals.css .neon-flicker). Tamamen dekoratif.
// Tüm yazı tipleri latin-ext alt kümesiyle Türkçe İ/ş harflerini içerir; Rye gibi desteklemeyenler kullanılmadı.
const abril = Abril_Fatface({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap" });
const bungee = Bungee({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap" });
const lobster = Lobster({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap" });
const monoton = Tilt_Neon({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap" });
const pacifico = Pacifico({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap" });
const playfair = Playfair_Display({ weight: "900", style: "italic", subsets: ["latin", "latin-ext"], display: "swap" });
const gothic = Grenze_Gotisch({ weight: "700", subsets: ["latin", "latin-ext"], display: "swap" });
const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap" });
const f = { abril, bungee, lobster, monoton, pacifico, playfair, gothic, anton };

const BLUE = "#3B82F6", WHITE = "#F8FAFF", CYAN = "#22D3EE", VIOLET = "#A78BFA";
// [yazı tipi, boyut(px), renk, titresin mi, büyük harf mi]
const SIGNS = [
  ["pacifico", 64, BLUE, true], ["bungee", 40, WHITE], ["gothic", 60, CYAN],
  ["abril", 58, WHITE], ["monoton", 50, VIOLET, true], ["playfair", 60, BLUE],
  ["anton", 70, WHITE, false, true], ["lobster", 56, CYAN], ["gothic", 54, VIOLET, true],
  ["abril", 62, BLUE],
];

const glow = (c) => `0 0 4px ${c}, 0 0 12px ${c}, 0 0 28px ${c}, 0 0 48px ${c}`;

export default function NeonWall() {
  return (
    <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-x-8 gap-y-6 p-8 overflow-hidden" style={{ background: "radial-gradient(80% 60% at 50% 50%, #0B1530 0%, #05050A 75%)" }}>
      {SIGNS.map(([font, size, color, flicker, upper], i) => (
        <span
          key={i}
          className={`${f[font].className}${flicker ? " neon-flicker" : ""}`}
          style={{ fontSize: size, lineHeight: 1.05, color: "#FFFFFF", textShadow: glow(color), textTransform: upper ? "uppercase" : "none", animationDelay: `${(i % 7) * 0.9}s`, whiteSpace: "nowrap" }}
        >
          İşinn<span style={{ color: BLUE, textShadow: glow(BLUE) }}>.</span>
        </span>
      ))}
    </div>
  );
}
