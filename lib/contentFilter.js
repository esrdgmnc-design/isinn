// Kullanıcı üretimi metin için temel filtre (App Store 1.2: "uygunsuz içeriği filtreleme yöntemi").
// Bilinçli olarak DAR tutuldu: yalnızca açık küfür/hakaret, tehdit ve tam bir IBAN numarası engellenir.
// Anatomik/tıbbi sözcükler (anne-çocuk, hemşire, diyetisyen vitrinleri) ve belirsiz kökler ("sık", "sik sik") listede YOK;
// yanlış pozitif, kaçan bir küfürden daha pahalıdır. Şüpheli ödeme ifadeleri ayrıca IsinnApp.jsx'te "uyar" modelinde.
// Saf fonksiyon: node ile test edilir (evals/unit-content-filter.mjs).

const ZW = /[​-‍﻿­]/g;
const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", "@": "a", $: "s" };

// Türkçe duyarlı küçültme + aksan düşürme. "ı" bilerek "i"ye çevrilmez: "sıkı/sıkıntı" ile "siki" karışmasın.
export function normalizeForFilter(input) {
  return String(input || "")
    .slice(0, 5000)
    .replace(ZW, "")
    .replace(/İ/g, "i").replace(/I/g, "ı")
    .toLocaleLowerCase("tr")
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/(?<=[a-zı])[01345@$](?=[a-zı])/g, (m) => LEET[m])
    .replace(/(.)\1{2,}/g, "$1$1");
}

// "s.i.k.t.i.r" / "s i k t i r" gibi tek harflerin ayrılmış hâlini birleştirir.
function joinSpacedLetters(s) {
  return s.replace(/(?<![a-zı])(?:[a-zı][\s.\-_*]+){2,}[a-zı](?![a-zı])/g, (m) => m.replace(/[\s.\-_*]+/g, ""));
}

const B = "(?<![a-zı])";
const E = "(?![a-zı])";
// Her harf tekrar edebilir ("siiiiktir"), i harfi ı ile de eşleşir. Terimler tam sözcük olarak aranır.
const loose = (w) => w.split("").map((c) => (c === " " ? "\\s+" : c === "i" ? "[ıi]+" : c + "+")).join("");
const WORDS = [
  "siktir", "siktirgit", "siktirler", "sikeyim", "sikerim", "siktim", "sikik",
  "amcik", "amciklar", "amcika", "orospu", "oruspu", "orospular", "yarrak", "yarraklar",
  "pezevenk", "pezevenkler", "ibne", "ibneler", "kahpe", "kahpeler", "gotveren", "sicarim",
  "seni oldurecegim", "seni oldururum", "seni oldureyim", "seni gebertirim", "seni gebertecegim",
];
const ABUSE = WORDS.map((w) => new RegExp(B + loose(w) + E));

const IBAN_NUMBER = /(?<![A-Za-z0-9])TR\s?\d{2}(?:\s?\d{4}){5}\s?\d{2}(?!\d)/i;

// -> { action: "ok" } | { action: "block", cls: "abuse" | "iban" }
export function checkContent(text) {
  if (!text || typeof text !== "string") return { action: "ok" };
  if (IBAN_NUMBER.test(text.slice(0, 5000))) return { action: "block", cls: "iban" };
  const n = normalizeForFilter(text);
  const joined = joinSpacedLetters(n);
  for (const re of ABUSE) if (re.test(n) || re.test(joined)) return { action: "block", cls: "abuse" };
  return { action: "ok" };
}
