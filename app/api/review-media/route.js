// GÜVENLİK: yorum fotoğrafı moderasyonu (uygunluk + kimlik/rıza kontrolü)
// eskiden TAMAMEN tarayıcıda çalışıyordu — tarayıcı AI'a soruyor, cevaba göre
// yine tarayıcı review_media satırını kendisi insert ediyordu. AI'ın kararı
// güvenilirdi ama bu adımı ATLAMAK mümkündü: teknik bilgisi olan biri
// checkReviewMedia'yı hiç çağırmadan, doğrudan approval_status:'not_required'
// ile insert edip moderasyonu tamamen bypass edebilirdi — potansiyel olarak
// uygunsuz İÇERİK ya da sağlayıcının rızası olmadan yüzünü gösteren bir
// fotoğraf hiç kontrol edilmeden yayınlanabilirdi (bkz. review_media
// tablosunun kendi yorumu, TMK m.24-25).
//
// Artık AI kontrolü VE veritabanına yazma işlemi burada, sunucuda —
// istemci sadece dosyayı storage'a yükleyip bu route'u çağırıyor, kararı
// asla kendisi vermiyor.
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "../../../lib/serverAuth";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY ortam değişkeni ayarlanmamış." }, { status: 500 });
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const user = await getAuthedUser(request);
  if (!user) {
    return Response.json({ error: "Giriş yapmış olmalısın." }, { status: 401 });
  }

  if (!checkRateLimit(`review-media:${user.id}`, { limit: 10, windowMs: 10 * 60 * 1000 })
      || !checkRateLimit(`review-media-ip:${getClientIp(request)}`, { limit: 20, windowMs: 10 * 60 * 1000 })) {
    return Response.json({ error: "Çok fazla istek, birkaç dakika sonra tekrar dene." }, { status: 429 });
  }

  const { ratingId, mediaType, url, mimeType } = await request.json();
  if (!ratingId || !url || (mediaType !== "image" && mediaType !== "video")) {
    return Response.json({ error: "Eksik/geçersiz istek." }, { status: 400 });
  }

  // Kullanıcının gerçekten kendi değerlendirmesine medya eklediğini teyit
  // ediyoruz — kullanıcının kendi oturum token'ıyla, ratings'in mevcut RLS
  // policy'sini (herkes select edebilir) kullanarak, elle rater_id kontrolü.
  const authedSupabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: request.headers.get("authorization") || "" } },
  });
  const { data: ratingRow, error: ratingErr } = await authedSupabase
    .from("ratings")
    .select("id, rater_id")
    .eq("id", ratingId)
    .maybeSingle();
  if (ratingErr || !ratingRow || ratingRow.rater_id !== user.id) {
    return Response.json({ error: "Bu değerlendirmeye medya ekleme yetkin yok." }, { status: 403 });
  }

  // Video: Claude'un vision API'si video işleyemiyor. Sessizce yanlış
  // çalışmak yerine dürüst davranıyoruz — hiç insert etmiyoruz (gerçek
  // review akışında zaten video hiç sunulmuyor, bkz. IsinnApp.jsx notu).
  if (mediaType === "video") {
    return Response.json({ status: "review" });
  }

  let verdict;
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
            { type: "text", text: `Bu görsel bir hizmet yorumuna eklenecek. Üç şeyi değerlendir:
1. "appropriate": Görsel genel olarak uygun mu? Çıplaklık/cinsel içerik, şiddet, nefret sembolü veya platformla tamamen alakasız içerik varsa false ver. Şüphede kalırsan false ver.
2. "showsIdentifiableAdult": Tanınabilir bir yetişkin insan yüzü var mı? Sadece iş çıktısını (temizlenmiş oda, yapılmış tırnak tasarımı vb.) gösteren, kimse görünmeyen görseller false sayılır.
3. "showsIdentifiableChild": Tanınabilir bir çocuk yüzü var mı (18 yaş altı görünen biri)? Emin olamazsan true ver (güvenli taraf).

SADECE şu JSON formatında yanıt ver: {"appropriate": true/false, "showsIdentifiableAdult": true/false, "showsIdentifiableChild": true/false}` },
          ],
        }],
      }),
    });
    const aiData = await aiRes.json();
    const text = (aiData.content || []).map((b) => b.text || "").join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    verdict = {
      appropriate: parsed.appropriate !== false,
      showsIdentifiableAdult: !!parsed.showsIdentifiableAdult,
      showsIdentifiableChild: !!parsed.showsIdentifiableChild,
    };
  } catch (err) {
    // fail-safe: kontrol başarısız olursa YAYINLAMA, incelemeye düş.
    return Response.json({ status: "pending_review_failed" });
  }

  if (!verdict.appropriate) {
    return Response.json({ status: "rejected" });
  }
  if (verdict.showsIdentifiableChild) {
    return Response.json({ status: "child" });
  }

  // approval_status'u BURADA, AI'ın gerçek kararına göre hesaplıyoruz —
  // istemciden asla approval_status/contains_provider_identity kabul
  // etmiyoruz. Insert kullanıcının kendi token'ıyla (mevcut "Rater can
  // attach media to their own review" RLS policy'sini kullanarak).
  const approvalStatus = verdict.showsIdentifiableAdult ? "pending" : "not_required";
  const { data: inserted, error: insertErr } = await authedSupabase
    .from("review_media")
    .insert({
      rating_id: ratingId,
      media_type: "image",
      url,
      contains_provider_identity: verdict.showsIdentifiableAdult,
      approval_status: approvalStatus,
    })
    .select("id")
    .single();

  if (insertErr) {
    return Response.json({ error: insertErr.message }, { status: 500 });
  }

  return Response.json({ status: approvalStatus === "pending" ? "pending" : "auto", mediaId: inserted.id });
}
