-- İşinn — kayıt sırasında KVKK/Gizlilik/Kullanım Şartları onayının kaydı.
-- Sadece ekranda bir onay kutusu göstermek yeterli değil — ileride bir
-- anlaşmazlık olursa "onayladı mı, ne zaman, hangi metin versiyonuna"
-- sorularının cevabı gerçekten veritabanında durmalı.
alter table profiles add column if not exists terms_accepted_at timestamptz;
alter table profiles add column if not exists terms_version text;
