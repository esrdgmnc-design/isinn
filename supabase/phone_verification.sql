-- İşinn — telefon doğrulama (SMS OTP) altyapısı.
create extension if not exists pgcrypto;

-- Telefon numarasının kendisi HERKESE AÇIK profiles tablosuna hiç yazılmıyor —
-- ayrı, tamamen özel bir tabloda tutuluyor (sadece sahibi görebilir/düzenleyebilir).
-- profiles tablosunda sadece iki güvenli, herkese açık sinyal var:
--   phone_verified   -> "doğrulanmış" rozeti göstermek için (numarayı sızdırmaz)
--   public_phone     -> SADECE kullanıcı kendi isteğiyle "profilimde göster"
--                       derse dolduruluyor (LinkedIn mantığı — görünürlük karara bağlı)

alter table profiles add column if not exists phone_verified boolean not null default false;
alter table profiles add column if not exists public_phone text;

create table if not exists profile_phone (
  profile_id uuid primary key references profiles(id) on delete cascade,
  phone text not null,
  verified boolean not null default false,
  show_publicly boolean not null default false,
  verified_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table profile_phone enable row level security;
create policy "Owner can view their own phone" on profile_phone for select using (auth.uid() = profile_id);
create policy "Owner can upsert their own phone" on profile_phone for insert with check (auth.uid() = profile_id);
create policy "Owner can update their own phone" on profile_phone for update using (auth.uid() = profile_id);

-- profile_phone her değiştiğinde, profiles'taki güvenli/herkese açık
-- yansımaları (rozet + isteğe bağlı görünür numara) otomatik günceller.
create or replace function sync_public_phone()
returns trigger as $$
begin
  update profiles
  set phone_verified = new.verified,
      public_phone = case when new.show_publicly then new.phone else null end
  where id = new.profile_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_sync_public_phone on profile_phone;
create trigger trg_sync_public_phone
after insert or update on profile_phone
for each row execute function sync_public_phone();

-- ============================================================
-- Tek kullanımlık SMS kodları — kısa ömürlü, kimse doğrudan okuyamaz
-- (sadece güvenli fonksiyonlar üzerinden yazılıp/kontrol edilir).
-- ============================================================
create table if not exists phone_otp_codes (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  phone text not null,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table phone_otp_codes enable row level security;
-- Bilerek hiçbir select/insert/update policy yok — bu tabloya sadece
-- security definer fonksiyonlar (aşağıda) erişebilir, istemci asla doğrudan değil.

create index if not exists idx_phone_otp_profile on phone_otp_codes(profile_id);

-- 6 haneli kodu üretir, hash'ini saklar (düz metin hiçbir yerde durmaz),
-- gerçek gönderim Next.js /api/send-otp route'unda Netgsm ile yapılır — bu
-- fonksiyon sadece kodu üretip DB'ye yazar ve çağırana düz kodu döner (o da
-- sadece sunucu tarafındaki /api/send-otp bunu SMS olarak gönderdikten sonra
-- hiçbir yerde tutmaz).
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
    update profile_phone set verified = true, verified_at = now(), updated_at = now() where profile_id = auth.uid();
    delete from phone_otp_codes where profile_id = auth.uid();
    return true;
  else
    update phone_otp_codes set attempts = attempts + 1 where id = v_row.id;
    return false;
  end if;
end;
$$ language plpgsql security definer set search_path = public, extensions;

grant execute on function verify_phone_otp(text) to authenticated;
