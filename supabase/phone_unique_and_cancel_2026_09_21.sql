-- İşinn — 2026-09-21: (1) aynı telefonla ikinci hesap açılamasın, ücretsiz deneme
-- doğrulanmış telefona bağlansın; (2) üyelik iptali (ödenen dönem bitince kapanış).
-- audit_fixes_2026_09_21.sql ve no_subscription_no_vitrin_2026_09_21.sql'den SONRA
-- çalıştır. Idempotent.

-- ============================================================
-- 1) Telefon: bir numara tek hesapta DOĞRULANABİLİR
-- ============================================================
create or replace function normalize_phone(p text)
returns text as $$
  select right(regexp_replace(coalesce(p, ''), '\D', '', 'g'), 10);
$$ language sql immutable;

-- Numara başka bir hesapta doğrulanmışsa kod isteme (SMS maliyeti + suistimal).
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
     and exists (
    select 1 from profile_phone
    where verified = true
      and profile_id <> auth.uid()
      and normalize_phone(phone) = normalize_phone(p_phone)
  ) then
    raise exception 'Bu telefon numarası başka bir hesapta kullanılıyor. Her numara tek hesapta doğrulanabilir.';
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

grant execute on function request_phone_otp(text) to authenticated;

-- Ücretsiz deneme: hiç abonelik satırı olmayan + telefonu doğrulanmış profil için.
-- (İstemciden çağrılamaz; sadece start_free_trial / verify_phone_otp içinden.)
create or replace function grant_trial_if_eligible(p_profile uuid)
returns void as $$
declare
  v_plan_id uuid;
  v_trial_days integer;
  r record;
begin
  if exists (select 1 from provider_subscriptions where profile_id = p_profile) then
    return;
  end if;
  if not exists (select 1 from profile_phone where profile_id = p_profile and verified = true) then
    return;
  end if;
  select id, trial_days into v_plan_id, v_trial_days
  from subscription_plans where slug = 'standart' and active = true;
  if v_plan_id is null then
    return;
  end if;
  insert into provider_subscriptions (profile_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
  values (p_profile, v_plan_id, 'trialing', 'monthly', now(), now() + make_interval(days => coalesce(v_trial_days, 30)));

  -- Üyelik yokluğundan kapatılmış vitrinleri (deactivated_for_billing_at dolu)
  -- tek tek, en eskiden başlayarak geri aç; kapasite dolunca dur. Kullanıcının
  -- kendi kapattığı vitrinlere dokunulmaz.
  for r in
    select id from services
    where provider_id = p_profile and deactivated_for_billing_at is not null
    order by created_at
  loop
    begin
      update services set active = true, deactivated_for_billing_at = null where id = r.id;
    exception when others then
      exit; -- vitrin limiti doldu
    end;
  end loop;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function grant_trial_if_eligible(uuid) from public, anon, authenticated;

create or replace function start_free_trial(p_billing_cycle text default 'monthly')
returns void as $$
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;
  -- Kayıtta otomatik çağrılır; telefon henüz doğrulanmadıysa hiçbir şey yapmaz —
  -- deneme, telefon doğrulanınca (verify_phone_otp) başlar.
  perform grant_trial_if_eligible(auth.uid());
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function start_free_trial(text) to authenticated;

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
    -- Kod istendikten sonra aynı numara başka hesapta doğrulanmış olabilir (yarış).
    if not exists (select 1 from profiles where id = auth.uid() and is_admin = true)
       and exists (
      select 1 from profile_phone
      where verified = true and profile_id <> auth.uid()
        and normalize_phone(phone) = normalize_phone(v_row.phone)
    ) then
      raise exception 'Bu telefon numarası başka bir hesapta kullanılıyor.';
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

grant execute on function verify_phone_otp(text) to authenticated;

-- Veritabanı düzeyinde de garanti: aynı numara iki DOĞRULANMIŞ hesapta olamaz.
-- Mevcut verilerde zaten kopya varsa (aynı kişinin birden çok hesabı) dizin
-- kurulamaz; script bozulmasın diye uyarı verip atlanır — yukarıdaki fonksiyon
-- kontrolleri yeni kopyaları yine de engeller.
do $$
begin
  create unique index if not exists profile_phone_verified_unique
    on profile_phone ((normalize_phone(phone))) where verified = true;
exception when unique_violation then
  raise notice 'Mevcut kopya doğrulanmış telefonlar var; benzersiz dizin atlandı. Kopyaları temizleyince tekrar çalıştır.';
end $$;

-- ============================================================
-- 2) Üyelik iptali — ödenen dönem bitince kapanır (cron uygular)
-- ============================================================
create or replace function cancel_subscription()
returns void as $$
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;
  update provider_subscriptions
  set cancel_at_period_end = true, updated_at = now()
  where profile_id = auth.uid()
    and status in ('active', 'trialing')
    and current_period_end > now();
  if not found then
    raise exception 'İptal edilecek aktif bir üyeliğin yok.';
  end if;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function resume_subscription()
returns void as $$
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;
  update provider_subscriptions
  set cancel_at_period_end = false, updated_at = now()
  where profile_id = auth.uid()
    and status in ('active', 'trialing')
    and current_period_end > now();
  if not found then
    raise exception 'Yeniden başlatılacak aktif bir üyeliğin yok.';
  end if;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function cancel_subscription() to authenticated;
grant execute on function resume_subscription() to authenticated;
