// Kategori sayfalarında yanıt veren vitrinler önce (2026-10-29). Veri: öğretmen kategorisindeki 14 vitrinin
// 10'unun sahibi hiç mesaj göndermemişti; müşteri en üstteki birkaç vitrine yazıp yanıt alamıyordu.
// Sıra: son 14 günde mesaj gönderen sahipler, sonra daha önce hiç mesaj göndermiş olanlar, sonra diğerleri;
// her grup içinde mevcut sıra (en son güncellenen önce) korunur. Sayfaya yalnızca sıra yansır, kişisel veri gitmez.
import { createClient } from "@supabase/supabase-js";

export const RECENT_DAYS = 14;

export function responsivenessRank(lastSentAt, now = Date.now()) {
  if (!lastSentAt) return 0;
  return now - new Date(lastSentAt).getTime() <= RECENT_DAYS * 864e5 ? 2 : 1;
}

// services: provider_id içeren satırlar (zaten istenen sırada); lastSent: { providerId: ISO tarih }.
export function orderByResponsiveness(services, lastSent = {}, now = Date.now()) {
  return (services || [])
    .map((row, i) => ({ row, i, r: responsivenessRank(lastSent[row.provider_id], now) }))
    .sort((a, b) => b.r - a.r || a.i - b.i)
    .map((x) => x.row);
}

// Sunucu tarafı: sahiplerin son gönderdiği mesajın tarihi. Servis anahtarı yoksa ya da hata olursa boş döner
// (sayfa eski sırayla açılır). Yalnızca server component'lerden çağrılır.
export async function getProviderLastSent(providerIds) {
  const ids = [...new Set((providerIds || []).filter(Boolean))];
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!ids.length || !key || !process.env.NEXT_PUBLIC_SUPABASE_URL) return {};
  try {
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, { auth: { persistSession: false } });
    // Yönetici (kurucu) hesaplarının tanıtım mesajları müşteriye yanıt sayılmaz; kendi vitrinleri öne çıkmasın.
    const { data: admins } = await admin.from("profiles").select("id").eq("is_admin", true);
    const skip = new Set((admins || []).map((a) => a.id));
    const { data, error } = await admin
      .from("messages")
      .select("sender_id, created_at")
      .in("sender_id", ids)
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error || !data) return {};
    const out = {};
    for (const m of data) if (!out[m.sender_id] && !skip.has(m.sender_id)) out[m.sender_id] = m.created_at;
    return out;
  } catch {
    return {};
  }
}
