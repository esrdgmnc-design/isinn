-- Şeffaflık seviyesi (Seçenek A, 2026-09-14 — "profesyonel bir mimar olsan ne
-- eksik gelirdi" sorusundan çıkan sertifika/lisans doğrulama konuşması).
-- Sağlayıcı isterse meslek odası/lisans/sicil bilgisini serbest metin olarak
-- ekleyebiliyor (ör. "TMMOB Mimarlar Odası — Sicil No: 12345"). Biz bunu
-- DOĞRULAMIYORUZ — sadece görünür kılıyoruz, "sağlayıcı beyanı, doğrulanmadı"
-- etiketiyle. Gerçek doğrulama (admin onaylı rozet) ayrı, daha büyük bir iş
-- (Seçenek B) — bu sadece şeffaflık katmanı.
alter table services add column if not exists professional_credential text;
