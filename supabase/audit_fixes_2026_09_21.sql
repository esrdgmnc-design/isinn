-- İşinn — 2026-09-21 denetim düzeltmeleri (veri kaybı + gelir kaybı).
-- Supabase SQL Editor'de TEK SEFERDE çalıştırılabilir; her adım idempotent
-- (tekrar çalıştırmak güvenli). audit_fixes_2026_09_19.sql'den SONRA çalıştır.

-- ============================================================
-- 1) ratings — vitrin silinemiyordu + helpful_count/created_at client'tan yazılabiliyordu
-- ============================================================
-- vitrin_media.sql ratings.service_id'yi ON DELETE SET NULL yapıyor; ama
-- protect_ratings_columns service_id değişimini koşulsuz reddediyordu — FK'nın
-- kendi SET NULL aksiyonu da bu trigger'a takılıp DEĞERLENDİRMESİ olan bir
-- vitrinin silinmesini tamamen engelliyordu. FK aksiyonu iç içe tetikleyicide
-- (pg_trigger_depth() > 1) çalıştığı için sadece o yol serbest bırakılıyor.
create or replace function protect_ratings_columns()
returns trigger as $$
begin
  if new.job_id is distinct from old.job_id
     or new.rater_id is distinct from old.rater_id
     or new.rated_profile_id is distinct from old.rated_profile_id
  then
    raise exception 'Bu değerlendirmenin kime/hangi işe ait olduğu değiştirilemez.';
  end if;

  if new.service_id is distinct from old.service_id then
    -- Sadece FK'nın ON DELETE SET NULL aksiyonu (vitrin silinirken) serbest.
    if not (new.service_id is null and pg_trigger_depth() > 1) then
      raise exception 'Bu değerlendirmenin kime/hangi işe ait olduğu değiştirilemez.';
    end if;
  end if;

  -- helpful_count'u sadece sync_review_helpful_count trigger'ı (iç içe) değiştirebilir;
  -- tablo-geneli UPDATE grant'i sütun REVOKE'unu geçersiz kıldığı için burada da kilitli.
  if new.helpful_count is distinct from old.helpful_count and pg_trigger_depth() <= 1 then
    raise exception 'helpful_count doğrudan değiştirilemez.';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'Değerlendirme tarihi değiştirilemez.';
  end if;

  if (new.value is distinct from old.value or new.comment is distinct from old.comment)
     and auth.uid() is distinct from old.rater_id
  then
    raise exception 'Sadece değerlendirmeyi yazan kişi puan/yorumu değiştirebilir.';
  end if;

  if (new.provider_reply is distinct from old.provider_reply or new.provider_reply_at is distinct from old.provider_reply_at)
     and auth.uid() is distinct from old.rated_profile_id
  then
    raise exception 'Sadece değerlendirilen sağlayıcı yanıt yazabilir.';
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Sahte değerlendirme: insert policy'si sadece rater_id = auth.uid() kontrol
-- ediyordu; "teslim edildi" ve "bu iş senin" kontrolü sadece client'taydı.
-- Artık DB de doğruluyor (service role / SQL editor: auth.uid() null → atlanır).
create or replace function validate_rating_insert()
returns trigger as $$
declare
  v_job record;
  v_provider uuid;
begin
  if auth.uid() is null then
    return new;
  end if;
  if new.rater_id = new.rated_profile_id then
    raise exception 'Kendini değerlendiremezsin.';
  end if;

  select client_id, state, service_id into v_job from jobs where id = new.job_id;
  if not found then
    raise exception 'Değerlendirilecek iş bulunamadı.';
  end if;
  if v_job.client_id is distinct from new.rater_id then
    raise exception 'Sadece işin müşterisi değerlendirme yazabilir.';
  end if;
  if v_job.state is distinct from 'delivered' then
    raise exception 'Değerlendirme için işin teslim edilmiş olması gerekir.';
  end if;
  if v_job.service_id is not null then
    select provider_id into v_provider from services where id = v_job.service_id;
    if v_provider is distinct from new.rated_profile_id then
      raise exception 'Değerlendirilen kişi bu işin sağlayıcısı değil.';
    end if;
    if new.service_id is not null and new.service_id is distinct from v_job.service_id then
      raise exception 'Değerlendirilen vitrin bu işe ait değil.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_validate_rating_insert on ratings;
create trigger trg_validate_rating_insert
before insert on ratings
for each row execute function validate_rating_insert();

-- ============================================================
-- 2) start_free_trial — sınırsız ücretsiz deneme + ücretli aboneliğin üstüne yazma (GELİR KAYBI)
-- ============================================================
-- Eskiden var olan satırı koşulsuz 'trialing' + 30 gün yapıyordu: (a) bitmek
-- üzere olan deneme her 30 günde bir yenilenip hiç ödenmeden kullanılabiliyordu,
-- (b) 3999-6490₺ yıllık Pro ödemiş biri çağırırsa Standart deneme'ye düşüp
-- ödediği süre siliniyordu. Artık SADECE hiç abonelik satırı olmayan (ilk kez
-- deneme başlatan) kullanıcı için çalışır.
create or replace function start_free_trial(p_billing_cycle text default 'monthly')
returns void as $$
declare
  v_plan_id uuid;
  v_trial_days integer;
  v_period_end timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;
  if p_billing_cycle not in ('monthly', 'yearly') then
    p_billing_cycle := 'monthly';
  end if;

  if exists (select 1 from provider_subscriptions where profile_id = auth.uid()) then
    -- Zaten bir abonelik/deneme kaydı var: sessizce hiçbir şey yapma (idempotent);
    -- deneme hakkı tek seferliktir.
    return;
  end if;

  select id, trial_days into v_plan_id, v_trial_days
  from subscription_plans where slug = 'standart' and active = true;
  if v_plan_id is null then
    raise exception 'Standart plan bulunamadı.';
  end if;

  v_period_end := now() + make_interval(days => coalesce(v_trial_days, 30));
  insert into provider_subscriptions (profile_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
  values (auth.uid(), v_plan_id, 'trialing', p_billing_cycle, now(), v_period_end);
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function start_free_trial(text) to authenticated;

-- ============================================================
-- 3) sync_pro_boost — süresi dolmuş Pro'ya bedava boost + tüm vitrin satırlarını ezme (GELİR KAYBI)
-- ============================================================
create or replace function sync_pro_boost()
returns void as $$
declare
  v_anchor timestamptz;
  v_plan_slug text;
  v_addon_id uuid;
  v_period_end timestamptz;
  v_days_since_anchor double precision;
  v_window_start timestamptz;
begin
  if auth.uid() is null then
    return;
  end if;

  select ps.boost_anchor_at, sp.slug into v_anchor, v_plan_slug
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = auth.uid()
    and ps.status = 'active'
    and ps.current_period_end > now(); -- süresi dolmuş Pro hediye almasın

  if v_plan_slug is distinct from 'pro' then
    return;
  end if;
  if v_anchor is null then
    return;
  end if;

  v_days_since_anchor := extract(epoch from (now() - v_anchor)) / 86400;
  v_window_start := v_anchor + (floor(v_days_since_anchor / 30) * interval '30 days');

  if now() > v_window_start + interval '7 days' then
    return;
  end if;

  select id into v_addon_id from addon_products where slug = 'one-cikarma' and active = true;
  if v_addon_id is null then
    return;
  end if;

  -- Vaat edilen hediye 7 gün: bitişi pencerenin başından +7 gün (eskiden now()+30 gün
  -- olduğundan bir sonraki pencereyle örtüşüp sürekli ücretsiz boost oluyordu).
  v_period_end := v_window_start + interval '7 days';

  -- Sadece "tüm vitrinler" (service_id null) hediye satırı — vitrine özel,
  -- ÖDENMİŞ boost satırlarının durumu/süresi dokunulmaz.
  if exists (select 1 from provider_addons where profile_id = auth.uid() and addon_id = v_addon_id and service_id is null) then
    update provider_addons
    set status = 'active', current_period_start = now(), current_period_end = v_period_end
    where profile_id = auth.uid() and addon_id = v_addon_id and service_id is null;
  else
    insert into provider_addons (profile_id, addon_id, status, current_period_start, current_period_end)
    values (auth.uid(), v_addon_id, 'active', now(), v_period_end);
  end if;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function sync_pro_boost() to authenticated;

-- ============================================================
-- 4) payment_orders — hesap silinince ödeme kayıtları da siliniyordu (vergi/fatura saklama)
-- ============================================================
do $$
declare r record;
begin
  alter table payment_orders alter column profile_id drop not null;
  -- profile_id üzerindeki (adı ne olursa olsun) tüm FK'ları bul ve düşür
  for r in
    select c.conname from pg_constraint c
    where c.conrelid = 'public.payment_orders'::regclass and c.contype = 'f'
      and c.conkey = array[(select attnum from pg_attribute where attrelid = 'public.payment_orders'::regclass and attname = 'profile_id')]
  loop
    execute format('alter table payment_orders drop constraint %I', r.conname);
  end loop;
  alter table payment_orders
    add constraint payment_orders_profile_id_fkey
    foreign key (profile_id) references profiles(id) on delete set null;
end $$;

-- ============================================================
-- 5) enforce_vitrin_cap — eşzamanlı iki insert/aktifleştirme kotayı aşabiliyordu
-- ============================================================
create or replace function enforce_vitrin_cap()
returns trigger as $$
declare
  v_cap integer;
  v_addon_id uuid;
  v_has_addon boolean;
  v_active_count integer;
begin
  if new.active is not true then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.active is true then
    return new;
  end if;

  -- Aynı sağlayıcı için eşzamanlı işlemleri sıraya sok (count-sonra-insert yarışı).
  perform pg_advisory_xact_lock(hashtext('vitrin_cap:' || new.provider_id::text));

  select coalesce(sp.max_active_listings, 1) into v_cap
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = new.provider_id
    and ps.status in ('active', 'trialing')
    and ps.current_period_end > now()
  order by ps.current_period_end desc
  limit 1;

  if v_cap is null then
    v_cap := 1;
  end if;

  select id into v_addon_id from addon_products where slug = 'ek-vitrin' and active = true;
  if v_addon_id is not null then
    select exists(
      select 1 from provider_addons
      where profile_id = new.provider_id and addon_id = v_addon_id
        and status = 'active' and current_period_end > now()
    ) into v_has_addon;
    if v_has_addon then
      v_cap := v_cap + 3;
    end if;
  end if;

  select count(*) into v_active_count
  from services
  where provider_id = new.provider_id and active = true
    and id is distinct from new.id;

  if v_active_count >= v_cap then
    raise exception 'Vitrin hakkını doldurdun (limit: %). Daha fazla vitrin açmak için üyeliğini yükselt ya da Ek Vitrin Paketi al.', v_cap;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- ============================================================
-- 6) provider_documents / portfolio_items — başkasının vitrinine belge/portföy eklenebiliyordu
-- ============================================================
create or replace function enforce_own_service_ref()
returns trigger as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  if new.service_id is not null
     and not exists (select 1 from services where id = new.service_id and provider_id = new.profile_id)
  then
    raise exception 'Bu vitrin sana ait değil.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_enforce_own_service_ref on provider_documents;
create trigger trg_enforce_own_service_ref
before insert or update on provider_documents
for each row execute function enforce_own_service_ref();

drop trigger if exists trg_enforce_own_service_ref on portfolio_items;
create trigger trg_enforce_own_service_ref
before insert or update on portfolio_items
for each row execute function enforce_own_service_ref();

-- "verified" (doğrulanmış belge) yalnızca admin/servis tarafından değişsin.
create or replace function protect_document_verified()
returns trigger as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  if (to_jsonb(new)->'verified') is distinct from (to_jsonb(old)->'verified')
     or (to_jsonb(new)->'verified_at') is distinct from (to_jsonb(old)->'verified_at')
  then
    if not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
      raise exception 'Belge doğrulama durumu değiştirilemez.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_protect_document_verified on provider_documents;
create trigger trg_protect_document_verified
before update on provider_documents
for each row execute function protect_document_verified();

-- ============================================================
-- 7) favorites — çift favori (iki sekme/cihaz) sayaçları şişiriyordu
-- ============================================================
do $$
begin
  if exists (select 1 from information_schema.columns where table_name='favorites' and column_name='service_id')
     and exists (select 1 from information_schema.columns where table_name='favorites' and column_name='job_id') then
    delete from favorites a using favorites b
    where a.ctid > b.ctid and a.profile_id = b.profile_id
      and a.service_id is not distinct from b.service_id
      and a.job_id is not distinct from b.job_id;
    create unique index if not exists favorites_profile_service_uniq on favorites(profile_id, service_id) where service_id is not null;
    create unique index if not exists favorites_profile_job_uniq on favorites(profile_id, job_id) where job_id is not null;
  elsif exists (select 1 from information_schema.columns where table_name='favorites' and column_name='service_id') then
    delete from favorites a using favorites b
    where a.ctid > b.ctid and a.profile_id = b.profile_id and a.service_id = b.service_id;
    create unique index if not exists favorites_profile_service_uniq on favorites(profile_id, service_id) where service_id is not null;
  end if;
end $$;
