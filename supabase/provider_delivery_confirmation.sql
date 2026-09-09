-- İşinn — "Hizmeti Aldım" onayı tek taraflıydı: sadece müşteri (jobs.client_id)
-- işi 'delivered' işaretleyebiliyordu. Sağlayıcının gerçekten işi yapmış
-- olsa bile hiçbir hakkı yoktu — müşteri onaylamazsa (unutursa, kötü
-- niyetle geciktirse) sağlayıcı asla değerlendirme alamıyordu, itiraz
-- edecek bir yolu da yoktu. Kullanıcının kararı: adil olsun, sağlayıcı da
-- kendi tarafından "Hizmeti Verdim" diyebilsin, ikisinden hangisi önce
-- işaretlerse iş 'delivered' sayılsın (review_eligibility zaten sadece
-- state='delivered' bakıyor, hangi taraf tetiklediği fark etmiyor — sistem
-- zaten tek taraflı bir beyana güveniyordu, şimdi bu güven iki tarafa da
-- eşit dağılıyor, güven seviyesi düşmüyor).
--
-- Kayıt/kanıt amaçlı: sağlayıcının kendi işaretlediği an ayrıca tutuluyor
-- (provider_delivered_at) — ileride bir anlaşmazlık ekranı kurulursa
-- (bkz. "gerçek karşılıklı onay akışı" notu, şimdilik hâlâ ertelendi) bu
-- zaten burada duruyor olur.
alter table jobs add column if not exists provider_delivered_at timestamptz;

create policy "Providers can mark their own service jobs delivered" on jobs for update
  using (
    exists (select 1 from services where services.id = jobs.service_id and services.provider_id = auth.uid())
  )
  with check (
    exists (select 1 from services where services.id = jobs.service_id and services.provider_id = auth.uid())
  );

-- Yukarıdaki policy satır bazlı — hangi KOLONLARI değiştirebileceğini
-- kısıtlamıyor (bugün tekrar tekrar bulduğumuz aynı desen). Sağlayıcı bu
-- yoldan jobs'un client_id'sini, bütçesini, başlığını vb. DEĞİŞTİREMESİN —
-- sadece state'i 'delivered'a çevirebilsin ve provider_delivered_at'i
-- doldurabilsin. Müşterinin kendi (önceden var olan) update policy'si bu
-- trigger'dan etkilenmiyor (aşağıdaki kontrol sadece "aktör sağlayıcıysa"
-- devreye giriyor).
create or replace function enforce_provider_job_update_scope()
returns trigger as $$
declare
  v_is_provider boolean;
begin
  select exists(
    select 1 from services where services.id = old.service_id and services.provider_id = auth.uid()
  ) into v_is_provider;

  -- Aktör sağlayıcı değilse (müşteri kendi işini güncelliyorsa) bu kontrol
  -- devreye girmiyor — müşterinin mevcut hakları aynen duruyor.
  if not v_is_provider or auth.uid() = old.client_id then
    return new;
  end if;

  if new.state is distinct from old.state and new.state is distinct from 'delivered' then
    raise exception 'Sağlayıcı sadece işi teslim edildi olarak işaretleyebilir.';
  end if;
  if new.category_id is distinct from old.category_id
     or new.title is distinct from old.title
     or new.description is distinct from old.description
     or new.budget_min is distinct from old.budget_min
     or new.budget_max is distinct from old.budget_max
     or new.city is distinct from old.city
     or new.location is distinct from old.location
     or new.active is distinct from old.active
     or new.client_id is distinct from old.client_id
     or new.service_id is distinct from old.service_id
  then
    raise exception 'Sağlayıcı bu alanları değiştiremez.';
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_enforce_provider_job_update_scope on jobs;
create trigger trg_enforce_provider_job_update_scope
before update on jobs
for each row execute function enforce_provider_job_update_scope();
