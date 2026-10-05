-- İşinn — İki taraflı iş onayı (2026-10-05)
--
-- Sorun: bir iş 'delivered' olunca değerlendirme açılıyordu ve bunu müşteri VEYA sağlayıcı tek başına
-- tetikleyebiliyordu. Hangi tarafın onayladığı yalnızca sağlayıcı için kaydediliyordu ve o kayıt da
-- istemciden gelen değerdi (sahte yazılabilirdi).
--
-- Çözüm (dürüst sınır: bu, iki tarafın anlaşarak sahte iş uydurmasını ENGELLEMEZ; yalnızca tek tarafın
-- kendi başına "iş yapıldı" demesiyle gelen değerlendirmeyi ayırt eder ve etiketler):
--   1) jobs.client_delivered_at ve jobs.provider_delivered_at artık yalnızca sunucuda damgalanır.
--   2) İş 'delivered' olduğunda işaretleyen tarafın zamanı, karşı taraf confirm_job_delivery() ile onaylayınca
--      onun zamanı yazılır.
--   3) ratings.both_confirmed: iki damga da doluysa true. Yorum kartında "İki taraf da onayladı" etiketi
--      yalnızca buna bağlıdır; tek taraflı onaylar "beyan" olarak etiketlenir.
--   4) Karşı tarafa bildirim gider (eskiden sağlayıcı kendi işaretlediğinde bile "müşteri onayladı"
--      bildirimi alıyordu).
--
-- Mevcut 'delivered' işler: damgalar boş kalır → "iki taraflı" sayılmazlar (geriye dönük iddia yok).

alter table jobs add column if not exists client_delivered_at timestamptz;
alter table jobs add column if not exists provider_delivered_at timestamptz;
alter table ratings add column if not exists both_confirmed boolean not null default false;

-- 1) Damgalar yalnızca bu tetikleyici ve confirm_job_delivery() ile değişir.
create or replace function stamp_job_delivery()
returns trigger as $$
declare
  v_provider uuid;
  v_via_rpc boolean := coalesce(current_setting('app.job_confirm_rpc', true), '') = '1';
begin
  if not v_via_rpc then
    -- istemci payload'ındaki damgalar yok sayılır
    new.client_delivered_at := old.client_delivered_at;
    new.provider_delivered_at := old.provider_delivered_at;

    if new.state = 'delivered' and old.state is distinct from 'delivered' then
      select provider_id into v_provider from services where id = new.service_id;
      if auth.uid() is not null and auth.uid() = old.client_id then
        new.client_delivered_at := now();
      elsif auth.uid() is not null and auth.uid() = v_provider then
        new.provider_delivered_at := now();
      end if;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_stamp_job_delivery on jobs;
create trigger trg_stamp_job_delivery
before update on jobs
for each row execute function stamp_job_delivery();

-- 2) Karşı tarafın (veya iş henüz 'delivered' değilse işaretleyen tarafın) onayı
create or replace function confirm_job_delivery(p_job_id uuid)
returns text as $$
declare
  v_job record;
  v_provider uuid;
  v_is_client boolean;
  v_is_provider boolean;
begin
  if auth.uid() is null then
    raise exception 'Giriş gerekli.';
  end if;
  select id, client_id, service_id, state, client_delivered_at, provider_delivered_at
    into v_job from jobs where id = p_job_id;
  if not found then
    raise exception 'İş bulunamadı.';
  end if;
  select provider_id into v_provider from services where id = v_job.service_id;
  v_is_client := auth.uid() = v_job.client_id;
  v_is_provider := v_provider is not null and auth.uid() = v_provider;
  if not v_is_client and not v_is_provider then
    raise exception 'Bu işte taraf değilsin.';
  end if;
  if v_is_client and v_is_provider then
    raise exception 'Kendi işini onaylayamazsın.';
  end if;

  perform set_config('app.job_confirm_rpc', '1', true);
  if v_is_client then
    update jobs set state = 'delivered', client_delivered_at = coalesce(client_delivered_at, now()) where id = p_job_id;
  else
    update jobs set state = 'delivered', provider_delivered_at = coalesce(provider_delivered_at, now()) where id = p_job_id;
  end if;
  perform set_config('app.job_confirm_rpc', '', true);

  -- iki damga da doluysa bu işe yazılmış yorumlar "iki taraflı" olur
  update ratings set both_confirmed = true
   where job_id = p_job_id
     and exists (select 1 from jobs j where j.id = p_job_id and j.client_delivered_at is not null and j.provider_delivered_at is not null);

  return case when exists (select 1 from jobs j where j.id = p_job_id and j.client_delivered_at is not null and j.provider_delivered_at is not null)
              then 'both' else 'one' end;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function confirm_job_delivery(uuid) from public;
grant execute on function confirm_job_delivery(uuid) to authenticated;

-- 3) Yeni yorumda both_confirmed işin o anki durumundan hesaplanır (istemci değeri yok sayılır)
create or replace function set_rating_both_confirmed()
returns trigger as $$
begin
  new.both_confirmed := exists (
    select 1 from jobs j where j.id = new.job_id and j.client_delivered_at is not null and j.provider_delivered_at is not null
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_set_rating_both_confirmed on ratings;
create trigger trg_set_rating_both_confirmed
before insert on ratings
for each row execute function set_rating_both_confirmed();

-- Yorum düzenlemesi both_confirmed'ı değiştiremesin
create or replace function lock_rating_both_confirmed()
returns trigger as $$
begin
  if coalesce(current_setting('app.job_confirm_rpc', true), '') <> '1' then
    new.both_confirmed := old.both_confirmed;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_lock_rating_both_confirmed on ratings;
create trigger trg_lock_rating_both_confirmed
before update on ratings
for each row execute function lock_rating_both_confirmed();

-- 4) Bildirim: işi işaretleyen tarafa değil, KARŞI tarafa gider
create or replace function notify_job_delivered()
returns trigger as $$
declare
  v_provider_id uuid;
begin
  if new.state = 'delivered' and (old.state is distinct from 'delivered') then
    select provider_id into v_provider_id from services where services.id = new.service_id;
    if new.provider_delivered_at is not null and new.client_delivered_at is null then
      insert into notifications (profile_id, type, title, body, related_job_id, related_service_id)
      values (
        new.client_id, 'job_delivered',
        'Hizmeti veren işi teslim ettiğini işaretledi',
        '"' || new.title || '" görüşmesinde hizmet veren işi teslim ettiğini bildirdi. Hizmeti aldıysan mesajlaşma ekranından onaylayabilirsin.',
        new.id, new.service_id
      );
    elsif v_provider_id is not null then
      insert into notifications (profile_id, type, title, body, related_job_id, related_service_id)
      values (
        v_provider_id, 'job_delivered',
        'Müşteri hizmeti aldığını onayladı',
        'Bir müşteri "' || new.title || '" görüşmesinde hizmeti aldığını işaretledi. Artık seni değerlendirebilir.',
        new.id, new.service_id
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;
