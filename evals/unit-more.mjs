// İkinci birim test dosyası (ağ yok): doğrulanmış alıntı/ilk adım, çalışma bağlantısı doğrulaması, JSON-LD kaçışı.
// Çalıştırma: node evals/unit-more.mjs   (npm test içinde evals/talent/unit.mjs ile birlikte çalışır)
import assert from "node:assert/strict";
import { validUserWords, validFirstStep, TALENT_MAX_SUGGESTIONS, parseTalentResponse } from "../lib/talentCore.js";
import { normalizeWorkLink, safeWorkLink } from "../lib/workLink.js";
import { jsonLdString } from "../lib/jsonLd.js";

// --- kullanıcının sözü: yalnızca gerçekten girdide geçen ifade gösterilir
const u = "Örgü örmeyi seviyorum, çocuklarla vakit geçirmek hoşuma gidiyor. haftada 6 saat";
assert.equal(validUserWords("örgü örmeyi seviyorum", u), "örgü örmeyi seviyorum");
assert.equal(validUserWords("Çocuklarla vakit geçirmek", u), "Çocuklarla vakit geçirmek");
assert.equal(validUserWords("dikiş dikerim", u), null, "uydurma alıntı");
assert.equal(validUserWords("a", u), null, "çok kısa");
assert.equal(validUserWords("bir iki üç dört beş altı yedi", "bir iki üç dört beş altı yedi"), null, "6 kelimeden uzun");

// --- ilk adım: güvenli, kısa, kanal/rakam yok
assert.ok(validFirstStep("Bu hafta yaptığın örgülerden üç fotoğraf çekip vitrinine ekle.", u, ["Terzi"]));
assert.equal(validFirstStep("Etsy'de mağaza aç.", u, ["Terzi"]), null);
assert.equal(validFirstStep("Ayda 5000 TL kazan.", u, ["Terzi"]), null);
assert.equal(validFirstStep("x", u, ["Terzi"]), null, "çok kısa");

// --- en fazla 2 öneri ve uydurma alıntı elenir
const allowed = [{ id: "terzi", name: "Terzi" }, { id: "egitmen", name: "Eğitmen" }, { id: "ogretmen", name: "Öğretmen" }];
const parsed = parseTalentResponse(JSON.stringify({ suggestions: [
  { categoryId: "terzi", reason: "Örgü örmeyi sevdiğin için ders verebilirsin.", userWords: "örgü örmeyi seviyorum", firstStep: "Bu hafta bir örgü örneğini fotoğrafla.", title: "Örgü dersi", description: "Örgü örmeyi paylaşıyorum." },
  { categoryId: "egitmen", reason: "Anlatmak güzel.", userWords: "uydurma söz", firstStep: "Bir örnek hazırla ve vitrine ekle." },
  { categoryId: "ogretmen", reason: "Üçüncü öneri." },
] }), { allowed, userText: u });
assert.equal(parsed.suggestions.length, TALENT_MAX_SUGGESTIONS);
assert.equal(parsed.suggestions[1].userWords, null);

// --- çalışma bağlantısı: yalnızca Instagram/TikTok/YouTube profil adresi
const ok = (raw, expectUrl) => { const r = normalizeWorkLink(raw); assert.equal(r.ok, true, raw); assert.equal(r.url, expectUrl, raw); };
const bad = (raw, reason) => { const r = normalizeWorkLink(raw); assert.equal(r.ok, false, raw); if (reason) assert.equal(r.reason, reason, raw); };
ok("", null);
ok("@ilayda", "https://www.instagram.com/ilayda/");
ok("instagram.com/ilayda", "https://www.instagram.com/ilayda/");
ok("https://www.instagram.com/ilayda_mum/?igsh=abc", "https://www.instagram.com/ilayda_mum/");
ok("http://instagram.com/ilayda", "https://www.instagram.com/ilayda/");
ok("tiktok.com/@ilayda", "https://www.tiktok.com/@ilayda");
ok("youtube.com/@ilaydamum", "https://www.youtube.com/@ilaydamum");
ok("linkedin.com/in/esra-gunes", "https://www.linkedin.com/in/esra-gunes/");
ok("https://tr.linkedin.com/in/esra-gunes-123?trk=abc", "https://www.linkedin.com/in/esra-gunes-123/");
ok("https://www.linkedin.com/company/isinn/", "https://www.linkedin.com/company/isinn/");
bad("linkedin.com/posts/esra_abc-123", "post");
bad("linkedin.com/feed/", "post");
bad("linkedin.com/jobs/view/123", "post");
bad("linkedin.com/in/ab", "format");
bad("https://evil.com/linkedin.com/in/esra-gunes", "platform");
bad("https://linkedin.com.evil.com/in/esra-gunes", "platform");
{ const r = normalizeWorkLink("esra-gunes", "linkedin"); assert.equal(r.ok, true); assert.equal(r.url, "https://www.linkedin.com/in/esra-gunes/"); }
{ const r = normalizeWorkLink("esra-gunes", "instagram"); assert.equal(r.ok, false); assert.equal(r.needsPlatform, true); }
assert.equal(safeWorkLink("https://www.linkedin.com/in/esra-gunes/").platform, "linkedin");
bad("instagram.com/p/XYZ/", "post");
bad("tiktok.com/video/123", "post");
bad("youtube.com/watch?v=abc", "post");
bad("javascript:alert(1)", "format");
bad("data:text/html,x", "format");
bad("https://instagram.com@evil.com/x", "format");
bad("https://evil.com/instagram.com/x", "platform");
for (const host of ["wa.me/905551112233", "bit.ly/abc", "linktr.ee/ilayda", "shopier.com/ilayda", "trendyol.com/x", "mumatolyem.com"]) bad(host, "platform");
bad("https://www.instagram.com:8080/ilayda", "format");
bad("insta gram.com/x", "format");
assert.equal(safeWorkLink("https://evil.com/"), null);
assert.equal(safeWorkLink("https://www.instagram.com/ilayda/").platform, "instagram");

// --- JSON-LD: "<" kaçışlanır, yine de geçerli JSON ve aynı değere döner
const attack = { d: "x</script><script>alert(1)</script>", e: "satır" + String.fromCharCode(0x2028) + "ayırıcı" };
const out = jsonLdString(attack);
assert.equal(out.includes("</script>"), false);
assert.equal(out.includes("<"), false);
assert.deepEqual(JSON.parse(out), attack);

console.log("ek birim testleri geçti");
