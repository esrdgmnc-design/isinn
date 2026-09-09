-- GÜVENLİK DÜZELTMESİ — phone_verification.sql'deki request_phone_otp(text)
-- fonksiyonu, kodu hash'leyip DB'ye yazdıktan SONRA kodun DÜZ HALİNİ de
-- çağırana (tarayıcıya) döndürüyordu. Uygulamanın kendi akışı bu kodu hemen
-- /api/send-otp'a gönderip gerçek bir SMS olarak yolluyordu — ama bunu
-- zorunlu kılan hiçbir şey yoktu: anon key'i olan HERKES bu RPC'yi doğrudan
-- çağırıp (uygulamayı hiç kullanmadan) kodu SMS'i hiç almadan öğrenebilir,
-- ardından verify_phone_otp'a geçirip HERHANGİ bir telefon numarasını hiç
-- doğrulamadan "doğrulanmış" işaretleyebilirdi. Bu, review-güven sistemi ve
-- phone gate'in dayandığı tüm anti-sahtekarlık değerini sıfırlıyordu.
--
-- Düzeltme: kod artık Postgres'te DEĞİL, sunucu tarafındaki
-- app/api/send-otp route'unda üretiliyor (bkz. o dosyadaki değişiklik) ve
-- SADECE service_role (asla tarayıcıya çıkmayan bir anahtar) çağırabilen bu
-- yeni store_phone_otp fonksiyonuyla DB'ye yazılıyor — kod hiçbir zaman
-- tarayıcıya dönmüyor, sadece gerçek SMS ile kullanıcının telefonuna gidiyor.

create or replace function store_phone_otp(p_profile_id uuid, p_phone text, p_code text)
returns void as $$
begin
  delete from phone_otp_codes where profile_id = p_profile_id;
  insert into phone_otp_codes (profile_id, phone, code_hash, expires_at)
  values (p_profile_id, p_phone, crypt(p_code, gen_salt('bf')), now() + interval '10 minutes');

  insert into profile_phone (profile_id, phone, verified, show_publicly)
  values (p_profile_id, p_phone, false, false)
  on conflict (profile_id) do update set phone = excluded.phone, verified = false, updated_at = now();
end;
$$ language plpgsql security definer set search_path = public, extensions;

-- Sadece service_role çağırabilsin — normal giriş yapmış kullanıcılar (ve
-- anonim ziyaretçiler) DEĞİL, çünkü bu fonksiyon "p_profile_id" parametresine
-- körü körüne güveniyor (auth.uid() kontrolü yok, çünkü service_role
-- çağrısında oturum bağlamı yok — kimlik doğrulaması zaten /api/send-otp
-- route'unda, çağıran kullanıcının kendi access_token'ı üzerinden yapılıyor).
revoke all on function store_phone_otp(uuid, text, text) from public, anon, authenticated;
grant execute on function store_phone_otp(uuid, text, text) to service_role;

-- Eski, kodu düz metin döndüren fonksiyonun çağrılabilirliğini kapat.
-- Fonksiyonu silmiyoruz (varlığı zararsız, sadece artık kimse çağıramıyor) —
-- geri almak istenirse tek satırlık bir grant yeterli olsun diye.
revoke execute on function request_phone_otp(text) from authenticated;
