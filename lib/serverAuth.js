import { createClient } from "@supabase/supabase-js";

// Sunucu tarafı route'ların (app/api/**) "bu isteği gerçekten giriş yapmış
// biri mi yaptı" diye kontrol etmesi için ortak yardımcı. İstemci, çağrı
// yaparken kendi Supabase session'ının access_token'ını
// `Authorization: Bearer <token>` header'ında gönderir; burada o token
// anon key ile Supabase Auth'a doğrulatılır (service role gerekmiyor —
// sadece "bu token geçerli mi, kime ait" sorusu soruluyor).
export async function getAuthedUser(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  const sb = createClient(supabaseUrl, anonKey);
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
