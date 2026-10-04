// Tek persona için N kez ham model yanıtını çalıştırır ve süzülen/atılan önerileri nedenleriyle gösterir:
//   node evals/talent/debug.mjs <persona-id> [tekrar]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allowedTalentCategories, buildTalentPrompt, talentTextIsSafe, TALENT_BLOCKED_IDS } from "../../lib/talentCore.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(dir, "..", "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))[1].trim();
const persona = JSON.parse(fs.readFileSync(path.join(dir, "personas.json"), "utf8")).find((p) => p.id === process.argv[2]);
const times = parseInt(process.argv[3] || "1", 10);
const catRes = await fetch(`${get("NEXT_PUBLIC_SUPABASE_URL")}/rest/v1/categories?select=slug,name,mode`, { headers: { apikey: get("NEXT_PUBLIC_SUPABASE_ANON_KEY"), Authorization: `Bearer ${get("NEXT_PUBLIC_SUPABASE_ANON_KEY")}` } });
const cats = (await catRes.json()).filter((r) => r.slug !== "diger").map((r) => ({ id: r.slug, name: r.name, mode: r.mode }));
const allowed = allowedTalentCategories(cats, { remoteKey: persona.input.remoteKey });
const { system, user, userText } = buildTalentPrompt({ input: persona.input, allowed });
const names = allowed.map((c) => c.name);

await Promise.all(Array.from({ length: times }, async (_, n) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": get("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1400, temperature: 0.4, system, messages: [{ role: "user", content: user }] }),
  });
  const data = await res.json();
  const text = (data.content || []).map((b) => b.text || "").join("\n");
  let out = `--- koşu ${n + 1}\n`;
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    for (const s of parsed.suggestions || []) {
      const okId = allowed.some((c) => c.id === s.categoryId);
      const okReason = talentTextIsSafe(s.reason, userText, names);
      const okDraft = talentTextIsSafe(`${s.title} ${s.description}`, userText, names);
      out += `${s.categoryId} izinli:${okId} engelli:${TALENT_BLOCKED_IDS.has(s.categoryId)} gerekçe:${okReason} taslak:${okDraft}\n`;
      if (!okReason) out += `   GEREKÇE: ${s.reason}\n`;
      if (!okDraft) out += `   TASLAK: ${s.title} | ${s.description}\n`;
    }
    if (!(parsed.suggestions || []).length) out += `boş: ${parsed.constraint}\n`;
  } catch (e) { out += `JSON hatası: ${e.message}\n${text.slice(0, 300)}\n`; }
  console.log(out);
}));
