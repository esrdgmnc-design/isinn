// Fiyat birimi ve ders bilgileri (2026-11-11; bkz. supabase/price_unit_lesson_details_2026_11_11.sql).
// "Başlangıç 8.000₺" bir ders mi, ay mı, paket mi belli değildi. Birim seçilmişse sabit fiyat "8.000₺ / ay" yazılır;
// seçilmemişse eski yazım ("Başlangıç ...") korunur. "use client" içermez: sunucu bileşenleri de kullanır.

export const PRICE_UNITS = ["ders", "ay", "paket", "proje"];
export const PRICE_UNIT_LABELS = { ders: "Ders başı", ay: "Aylık", paket: "Paket", proje: "Proje" };

export function fixedPriceText(formatted, unit) {
  return PRICE_UNITS.includes(unit) ? `${formatted}₺ / ${unit}` : `Başlangıç ${formatted}₺`;
}

// Ders bilgileri yalnızca bu kategorilerde sorulur ve gösterilir.
export const LESSON_CATEGORY_SLUGS = ["ogretmen", "egitmen"];
export const LESSON_LEVELS = { ilkokul: "İlkokul", ortaokul: "Ortaokul", lise: "Lise", universite: "Üniversite", yetiskin: "Yetişkin" };
export const LESSON_DURATIONS = [40, 60, 90];
export const LESSON_FORMATS = { birebir: "Birebir", grup: "Grup", ikisi: "Birebir ve grup" };

// Formdan gelen değeri temizler; boşsa null (sütun hiç gönderilmesin diye).
export function cleanLessonDetails(v) {
  if (!v || typeof v !== "object") return null;
  const out = {};
  const levels = Array.isArray(v.levels) ? v.levels.filter((l) => LESSON_LEVELS[l]) : [];
  if (levels.length) out.levels = levels;
  if (LESSON_DURATIONS.includes(Number(v.duration_min))) out.duration_min = Number(v.duration_min);
  if (LESSON_FORMATS[v.format]) out.format = v.format;
  const edu = String(v.education || "").replace(/\s+/g, " ").trim().slice(0, 120);
  if (edu) out.education = edu;
  return Object.keys(out).length ? out : null;
}

// Vitrin sayfasında gösterilecek satırlar: [["Düzey", "İlkokul, Ortaokul"], ...]
export function lessonDetailRows(v) {
  const d = cleanLessonDetails(v);
  if (!d) return [];
  const rows = [];
  if (d.levels) rows.push(["Düzey", d.levels.map((l) => LESSON_LEVELS[l]).join(", ")]);
  if (d.duration_min) rows.push(["Ders süresi", `${d.duration_min} dk`]);
  if (d.format) rows.push(["Yöntem", LESSON_FORMATS[d.format]]);
  if (d.education) rows.push(["Eğitim", d.education]);
  return rows;
}
