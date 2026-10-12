import assert from "node:assert/strict";
import { checkContent, normalizeForFilter } from "../lib/contentFilter.js";

const blocked = ["siktir git", "SİKTİR", "S.İ.K.T.İ.R", "s i k t i r", "s1ktir", "siiiiktir", "AMCIK", "amcık", "orospu", "OROSPU çocuğu", "Oruspu", "yarrak", "pezevenk", "ibne", "seni öldüreceğim", "Seni gebertirim", "bu bir sikerim cümlesi", "s​iktir", "kahpe"];
for (const t of blocked) assert.equal(checkContent(t).action, "block", "engellenmeli: " + t);

const clean = [
  "şikayet", "Şikayet etmek istiyorum", "ŞİKAYET", "sikke", "siklet", "sıkıntı", "sıkı", "sıkıştı", "sık sık", "sik sik arıyorum", "Amcıkoğlu", "Sikorsky", "Sinop",
  "memur", "memleket", "meme", "bebek meme bakımı", "doğum günü pastası", "emzirme danışmanı", "cinsel eğitim", "kan alma", "hasta bakım", "popo kremi",
  "götürmek", "götürü fiyat", "boksör", "ocak", "koç", "pişirme", "bananı", "salak", "aptal", "gerizekalı",
  "iş bitince havale yaparım", "IBAN'ı atar mısın", "hizmeti görmeden ödeme yapma", "5 TL", "a1", "Fiyat 1500 TL", "0532 123 45 67",
  "Ders vermek için IBAN gerekmez", "İstanbul", "ISPARTA", "ibneden", "orospuluk", "TR1",
  "Örgü ve el işi atölyesi, çocuklara özel kurslar", "Çocuk bakıcısı, 5 yıl deneyim",
];
for (const t of clean) assert.equal(checkContent(t).action, "ok", "temiz olmalı: " + t);

assert.equal(checkContent("TR33 0006 1005 1978 6457 8413 26").cls, "iban");
assert.equal(checkContent("tr330006100519786457841326").cls, "iban");
assert.equal(checkContent("TR33 0006 1005").action, "ok");

assert.equal(normalizeForFilter("İSTANBUL"), "istanbul");
assert.equal(normalizeForFilter("ISPARTA"), "ısparta");
assert.equal(normalizeForFilter("ŞİKAYET"), "sikayet");
assert.equal(normalizeForFilter("5 TL"), "5 tl");

assert.equal(checkContent(null).action, "ok");
assert.equal(checkContent("").action, "ok");
const t0 = Date.now();
checkContent("a ".repeat(6000) + "siktir"); checkContent("x".repeat(20000)); checkContent("s.".repeat(3000));
assert.ok(Date.now() - t0 < 500, "yavaş: " + (Date.now() - t0));

console.log("içerik filtresi testleri geçti");
