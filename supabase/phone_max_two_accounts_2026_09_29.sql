-- İşinn — 2026-09-29: telefon başına hesap sınırı 1'den 2'ye çıkarıldı.
-- Esra'nın kararı: platforma ödeme yapmak istemeyen/yapamayan, ilk aşamada
-- çabalayan kullanıcılara biraz daha esneklik tanımak için (fikir değişikliği,
-- ikinci bir deneme şansı vb.) — kötüye kullanımı önlemek için hâlâ bir üst
-- sınır var (2), tamamen kaldırılmadı. phone_unique_and_cancel_2026_09_21.sql'i
-- REVİZE EDER, ondan SONRA çalıştır. Idempotent.

-- ============================================================
-- 1) request_phone_otp: artık 2. hesaba kadar kod isteyebilir
-- ============================================================
create or replace function request_phone_otp(p_phone text)
returns text as $$
declare
  v_code text;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;
  if p_phone is null or length(regexp_replace(p_phone, '\D', '', 'g')) < 10 then
    raise exception 'Geçerli bir telefon numarası gir.';
  end if;
  if not exists (select 1 from profiles where id = auth.uid() and is_admin = true)
     and (
    select count(*) from profile_phone
    where verified = true
      and profile_id <> auth.uid()
      and normalize_phone(phone) = normalize_phone(p_phone)
  ) >= 2 then
    raise exception 'Bu telefon numarası zaten 2 hesapta kullanılıyor. Her numara en fazla 2 hesapta doğrulanabilir.';
  end if;

  v_code := lpad(floor(random() * 1000000)::text, 6, '0');

  delete from phone_otp_codes where profile_id = auth.uid();
  insert into phone_otp_codes (profile_id, phone, code_hash, expires_at)
  values (auth.uid(), p_phone, crypt(v_code, gen_salt('bf')), now() + interval '10 minutes');

  insert into profile_phone (profile_id, phone, verified, show_publicly)
  values (auth.uid(), p_phone, false, false)
  on conflict (profile_id) do update set phone = excluded.phone, verified = false, updated_at = now();

  return v_code;
end;
$$ language plpgsql security definer set search_path = public, extensions;

-- ============================================================
-- 2) verify_phone_otp: kod isteği ile doğrulama arasındaki yarış
--    durumunda da aynı 2 hesap sınırını tekrar kontrol eder
-- ============================================================
create or replace function verify_phone_otp(p_code text)
returns boolean as $$
declare
  v_row phone_otp_codes%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;

  select * into v_row from phone_otp_codes where profile_id = auth.uid() order by created_at desc limit 1;
  if v_row is null or v_row.expires_at < now() then
    raise exception 'Kodun süresi dolmuş, tekrar gönder.';
  end if;
  if v_row.attempts >= 5 then
    raise exception 'Çok fazla yanlış deneme, yeni kod iste.';
  end if;

  if v_row.code_hash = crypt(p_code, v_row.code_hash) then
    if not exists (select 1 from profiles where id = auth.uid() and is_admin = true)
       and (
      select count(*) from profile_phone
      where verified = true and profile_id <> auth.uid()
        and normalize_phone(phone) = normalize_phone(v_row.phone)
    ) >= 2 then
      raise exception 'Bu telefon numarası zaten 2 hesapta kullanılıyor.';
    end if;
    update profile_phone set verified = true, verified_at = now(), updated_at = now() where profile_id = auth.uid();
    delete from phone_otp_codes where profile_id = auth.uid();
    perform grant_trial_if_eligible(auth.uid());
    return true;
  else
    update phone_otp_codes set attempts = attempts + 1 where id = v_row.id;
    return false;
  end if;
end;
$$ language plpgsql security definer set search_path = public, extensions;

-- ============================================================
-- 3) Veritabanı düzeyinde garanti: basit UNIQUE index (en fazla 1)
--    "en fazla 2" ifade edemediği için kaldırılıp yerine bir trigger
--    konuyor — aynı savunma amacını (yarış koşullarına karşı) korur.
-- ============================================================
drop index if exists profile_phone_verified_unique;

create or replace function enforce_phone_verified_limit()
returns trigger as $$
begin
  if new.verified = true then
    if not exists (select 1 from profiles where id = new.profile_id and is_admin = true)
       and (
      select count(*) from profile_phone
      where verified = true
        and profile_id <> new.profile_id
        and normalize_phone(phone) = normalize_phone(new.phone)
    ) >= 2 then
      raise exception 'Bu telefon numarası zaten 2 hesapta doğrulanmış.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql set search_path = public;

drop trigger if exists trg_enforce_phone_verified_limit on profile_phone;
create trigger trg_enforce_phone_verified_limit
  before insert or update on profile_phone
  for each row execute function enforce_phone_verified_limit();
