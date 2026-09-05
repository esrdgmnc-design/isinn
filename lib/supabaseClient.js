import { createClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_* env vars are safe to expose in the browser — the anon key
// alone cannot bypass Row Level Security (RLS). Real access control lives
// in the RLS policies defined in schema.sql, not in keeping this key secret.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at build/dev time rather than silently returning a client
  // that can't connect — easier to debug than a mysterious network error
  // deep inside a component.
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY ortam değişkenleri ayarlanmamış. " +
    ".env.local dosyasını kontrol edin (bkz. .env.local.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
