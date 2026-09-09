-- KRİTİK GÜVENLİK DÜZELTMESİ (v2 — ilk deneme yetersiz kaldı, aşağıda neden
-- açıklanıyor) — profiles tablosundaki "Users can update their own profile"
-- policy'si (schema (3).sql) sadece hangi SATIRIN değiştirilebileceğini
-- kısıtlıyor (auth.uid() = id), hangi KOLONLARIN değiştirilebileceğini
-- kısıtlamıyor. Bu yüzden giriş yapmış HERHANGİ bir kullanıcı, uygulama
-- arayüzünü hiç kullanmadan şunu çağırabiliyordu:
--   supabase.from('profiles').update({ is_admin: true }).eq('id', kendiId)
-- ve GERÇEKTEN ÇALIŞIYORDU — kendini admin yapıp admin_role.sql'in açtığı
-- tüm yönetim ekranlarına erişebiliyordu; aynı şekilde phone_verified ve
-- has_certificates'i de hiçbir gerçek doğrulama yapmadan true yapabiliyordu.
--
-- İLK DENEME NEDEN İŞE YARAMADI: sadece bu 4 kolon için "revoke update (...)
-- from authenticated" çalıştırmıştık. Ama Supabase her tabloyu oluştururken
-- authenticated/anon rollerine o tablonun TAMAMI için (tüm kolonlar dahil)
-- tablo-geneli UPDATE/INSERT yetkisi veriyor (asıl güvenlik RLS'ten
-- geliyor). Postgres'te kolon bazlı bir REVOKE, tablo-geneli bir yetkiyi
-- GEÇERSİZ KILAMIYOR — ikisi bağımsız, "tablo geneli VEYA kolon özel"
-- mantığıyla kontrol ediliyor. Doğru yöntem: önce UPDATE/INSERT yetkisinin
-- TAMAMINI geri almak, sonra SADECE güvenli kolonları tek tek geri vermek.
--
-- Güvenli kolon listesi kod taranarak çıkarıldı (components/IsinnApp.jsx'te
-- profiles tablosuna yapılan her .update()/.insert() çağrısı tek tek
-- kontrol edildi) — is_admin/phone_verified/public_phone/has_certificates
-- hiçbir yerde client'tan yazılmıyor (sadece SECURITY DEFINER trigger'lar
-- veya admin_role.sql'deki tek seferlik SQL ile yazılıyorlar, onlar tablo
-- sahibi yetkisiyle çalıştığı için bu REVOKE'tan etkilenmezler).

revoke update on public.profiles from authenticated, anon;
grant update (
  full_name, phone, avatar_url, bio,
  business_name, business_about, business_logo_url,
  city, country, location, is_remote_provider,
  twitter_url, instagram_url, tiktok_url,
  user_type, updated_at, video_intro_url, video_intro_name
) on public.profiles to authenticated;

-- Aynı kök sorun INSERT için de geçerli — yeni kayıt olan biri, ilk profil
-- satırını oluştururken (bkz. IsinnApp.jsx'teki tek insert() çağrısı: id,
-- full_name, terms_accepted_at, terms_version) is_admin:true gibi bir alanı
-- da payload'a ekleyebilirdi. Aynı yöntemle kapatıyoruz.
revoke insert on public.profiles from authenticated, anon;
grant insert (
  id, full_name, phone, avatar_url, bio,
  business_name, business_about, business_logo_url,
  city, country, location, is_remote_provider,
  twitter_url, instagram_url, tiktok_url,
  user_type, terms_accepted_at, terms_version
) on public.profiles to authenticated;
