// Yapay zekâ sağlayıcısına (Anthropic, ABD) giden metinlerden kişiyi doğrudan tanımlayan bilgileri siler.
// Amaç (2026-10-17, KVKK m.9): yurt dışına kişisel veri aktarımını en aza indirmek — telefon, e-posta,
// T.C. kimlik numarası ve IBAN hiçbir yapay zekâ çağrısına girmez. Saf fonksiyon; metnin geri kalanına
// dokunmaz (istem talimatları bozulmaz). Kullanan yerler: app/api/claude, app/api/talent, lib/jobMatchRun,
// lib/needMatchCore. Test: evals/unit-need-match.mjs.
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const IBAN = /\bTR\s?\d{2}(?:\s?\d{4}){5}\s?\d{2}\b/gi;
// 05xx xxx xx xx, +90 5xx..., 5xxxxxxxxx (boşluk/tire serbest)
const PHONE = /(?:\+?90[\s-]?)?0?\s?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g;
const TCKN = /\b\d{11}\b/g;

export function scrubPII(text) {
  if (typeof text !== "string" || !text) return text;
  return text.replace(EMAIL, "[silindi]").replace(IBAN, "[silindi]").replace(PHONE, "[silindi]").replace(TCKN, "[silindi]");
}

// Anthropic messages[] içindeki metinleri temizler (string içerik ya da {type:"text"} blokları); görsel blokları olduğu gibi kalır.
export function scrubMessages(messages) {
  if (!Array.isArray(messages)) return messages;
  return messages.map((m) => {
    if (!m || typeof m !== "object") return m;
    if (typeof m.content === "string") return { ...m, content: scrubPII(m.content) };
    if (Array.isArray(m.content)) {
      return { ...m, content: m.content.map((b) => (b && b.type === "text" && typeof b.text === "string" ? { ...b, text: scrubPII(b.text) } : b)) };
    }
    return m;
  });
}
