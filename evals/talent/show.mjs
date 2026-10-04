// Tek persona için üretimle aynı yoldan geçen kartları (gerekçe, söz, ilk adım) gösterir:
//   node evals/talent/show.mjs <persona-id>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allowedTalentCategories, buildTalentPrompt, parseTalentResponse } from "../../lib/talentCore.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "..", "..");
const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))[1].trim();
const persona = JSON.parse(fs.readFileSync(path.join(dir, "personas.json"), "utf8")).find((p) => p.id === process.argv[2]);
const sb = get("NEXT_PUBLIC_SUPABASE_URL"), key = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const cats = (await (await fetch(`${sb}/rest/v1/categories?select=slug,name,mode`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })).json()).filter((r) => r.slug !== "diger").map((r) => ({ id: r.slug, name: r.name, mode: r.mode }));
const allowed = allowedTalentCategories(cats, {});
const p = buildTalentPrompt({ input: persona.input, allowed });
const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": get("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 2000, temperature: 0.4, system: p.system, messages: [{ role: "user", content: p.user }] }) });
const data = await res.json();
const { suggestions } = parseTalentResponse((data.content || []).map((b) => b.text || "").join("\n"), { allowed, userText: p.userText });
console.log("Girdi:", persona.input.skills, "|", persona.input.hours, "|", persona.input.budget);
for (const s of suggestions) console.log(`\n[${s.categoryId}]\n  gerekçe: ${s.reason}\n  sözün:   ${s.userWords}\n  ilk adım: ${s.firstStep}\n  taslak:  ${s.draft?.title}`);
