import { NextResponse } from "next/server";

// Kısa talep bağlantısı (2026-11-07): Instagram biyografisi, broşür vb. için www.isinn.com.tr/talep.
// Talep formunu (/?view=post) açar; form girişsiz doldurulabilir, giriş yalnızca yayınlarken istenir.
// Gelen utm_* parametreleri korunur; yoksa utm_source=instagram_bio eklenir (ölçüm için).
export function GET(request) {
  const incoming = new URL(request.url);
  const target = new URL("/", incoming.origin);
  target.searchParams.set("view", "post");
  let hasUtm = false;
  for (const [k, v] of incoming.searchParams) {
    if (k.startsWith("utm_")) { target.searchParams.set(k, v); hasUtm = true; }
  }
  if (!hasUtm) {
    target.searchParams.set("utm_source", "instagram_bio");
    target.searchParams.set("utm_medium", "social");
  }
  // 307: geçici yönlendirme — hedef ileride değişebilir, arama motoru /talep'i kalıcı olarak eşlemesin.
  return NextResponse.redirect(target, 307);
}
