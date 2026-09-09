// GÜVENLİK: bkz. supabase/listing_photo_moderation.sql'in üstündeki uzun not.
// Bu route AI kontrolünü sunucuda yapar VE sonucu moderated_images tablosuna
// (service role ile) yazar — services tablosundaki trigger, bir url'nin
// buraya "approved:true" olarak yazılmış olmasını ZORUNLU kılar. Yani bu
// route'u atlayıp doğrudan services.images'a bir url yazmaya çalışmak artık
// veritabanı seviyesinde reddedilir, sadece istemci tarafında "flagged"
// göstermekle kalmaz.
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!apiKey) return Response.json({ error: "ANTHROPIC_API_KEY ortam değişkeni ayarlanmamış." }, { status: 500 });
  if (!serviceRoleKey) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY ortam değişkeni ayarlanmamış." }, { status: 500 });

  const user = await getAuthedUser(request);
  if (!user) return Response.json({ error: "Giriş yapmış olmalısın." }, { status: 401 });

  if (!checkRateLimit(`listing-photo:${user.id}`, { limit: 15, windowMs: 10 * 60 * 1000 })
      || !checkRateLimit(`listing-photo-ip:${getClientIp(request)}`, { limit: 30, windowMs: 10 * 60 * 1000 })) {
    return Response.json({ error: "Çok fazla istek, birkaç dakika sonra tekrar dene." }, { status: 429 });
  }

  const { url, mimeType } = await request.json();
  if (!url) return Response.json({ error: "Eksik istek." }, { status: 400 });

  // Yüklenen dosyanın gerçekten bu kullanıcının kendi klasörüne (profile-media/{userId}/...)
  // ait olduğunu doğruluyoruz — başka birinin yüklediği bir url'yi "kendi
  // fotoğrafınmış gibi" onaylatmaya çalışmayı engeller.
  let expectedPrefix;
  try {
    expectedPrefix = `/storage/v1/object/public/profile-media/${user.id}/`;
    if (!new URL(url).pathname.includes(expectedPrefix)) {
      return Response.json({ error: "Bu dosya sana ait değil." }, { status: 403 });
    }
  } catch {
    return Response.json({ error: "Geçersiz url." }, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  let approved = false;
  let reason = "Otomatik kontrol başarısız oldu, manuel incelemeye alındı.";
  try {
    const imgRes = await fetch(url);
    if (!imgRes.ok) throw new Error("Görsel indirilemedi.");
    const buf = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType || "image/jpeg", data: base64 } },
            { type: "text", text: `Bu görsel, bakıcı/temizlikçi/öğretmen'den yazılımcıya/muhasebeciye kadar çok geniş bir kategori yelpazesindeki hizmet sağlayıcı profillerinin bulunduğu bir pazaryerinde kapak fotoğrafı olarak kullanılacak.

Şu kategorilerden herhangi birine GERÇEKTEN giriyorsa "approved: false" ver: çıplaklık veya cinsel içerik, şiddet/silah/kan/yaralanma görüntüsü, nefret sembolü ya da söylemi, ya da başka bir gerçek/ünlü kişiyi izinsiz kötüleyici/aşağılayıcı şekilde kullanan bir görsel.

Şunlar SEBEBIYLE reddetme — hepsi bu platformda meşru: insan/yüz görünmeyen görseller (logo, ürün, çalışma alanı, ekran görüntüsü, portre olmayan portföy işi vb.), belirli bir meslek/kategoriye özgü olması, ya da düşük çözünürlük/estetik zayıflık. Kararsız kaldığın sınır durumlarda ONAYLA (approved: true) — sadece yukarıdaki gerçek güvenlik kategorilerinden birinden GERÇEKTEN eminsen reddet.

SADECE şu JSON formatında yanıt ver: {"approved": true veya false, "reason": "kısa gerekçe (en fazla 12 kelime)"}` },
          ],
        }],
      }),
    });
    const aiData = await aiRes.json();
    const text = (aiData.content || []).map((b) => b.text || "").join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    approved = !!parsed.approved;
    reason = parsed.reason || (approved ? "Onaylandı" : "Reddedildi");
  } catch {
    // fail-safe: kontrol başarısız olursa ONAYLAMA.
    approved = false;
  }

  const { error: upsertErr } = await admin
    .from("moderated_images")
    .upsert({ url, profile_id: user.id, approved, reason }, { onConflict: "url" });
  if (upsertErr) {
    return Response.json({ error: upsertErr.message }, { status: 500 });
  }

  return Response.json({ approved, reason });
}
