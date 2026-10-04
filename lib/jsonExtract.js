// Modelin cevabından ilk dengeli JSON nesnesini/dizisini ayıklar. Model bazen
// JSON'dan sonra (ya da önce) açıklama metni yazıyor; düz JSON.parse bu durumda
// "Unexpected non-whitespace character after JSON" ile çöküyordu. Dize içindeki
// süslü parantezleri ve kaçışları doğru sayar. Bulunamazsa/bozuksa null döner.
export function extractJsonValue(text) {
  const s = String(text || "");
  let start = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "{" || s[i] === "[") { start = i; break; }
  }
  if (start < 0) return null;
  const open = s[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(s.slice(start, i + 1)); } catch { return null; }
      }
    }
  }
  return null;
}
