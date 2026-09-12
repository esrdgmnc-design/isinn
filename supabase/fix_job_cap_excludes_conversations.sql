-- İşinn — bu dosya artık job_posting_cap.sql'in TAMAMINI da içeriyor
-- (2026-09-12'deki sistem taramasında bulundu: job_posting_cap.sql hiç
-- çalıştırılmamış — subscription_plans.max_active_jobs kolonu ve
-- trg_enforce_job_cap trigger'ı canlıda yoktu. Bu dosya sadece FONKSİYONU
-- değiştiriyordu, kolonu eklemiyordu ve trigger'ı hiç oluşturmuyordu — yani
-- "çalıştırdım" dense bile hem kolon eksikliğinden hata verip duracaktı hem
-- de trigger hiçbir zaman var olmayacaktı. Artık tek dosya, baştan sona
-- güvenle (tekrar) çalıştırılabilir.)
--
-- KRİTİK HATA (kullanıcı canlıda yakaladı, 2026-09-10): jobs tablosu
-- iki tamamen farklı şey için kullanılıyor:
--   1) Gerçek "İlan Ver" gönderileri (PostJobView) — service_id HER ZAMAN null.
--   2) Bir vitrine "İletişime Geç" denince find_or_create_job'ın arka planda
--      açtığı, mesajlaşmayı bağlayan görüşme kaydı — service_id HER ZAMAN dolu,
--      başlığı "{vitrin} hakkında görüşme", açıklaması yok.
--
-- Eski enforce_job_cap() bu ikisini hiç ayırmıyordu:
--   a) Aktif sayısını sayarken (2) türü satırları da sayıyordu — yani biri
--      hiç ilan vermeden, sadece birkaç vitrine mesaj atarak kendi ilan
--      hakkını (Standart 5 / Pro 20) sessizce tüketebiliyordu.
--   b) Daha kötüsü: (2) türü bir satır İNSERT edilirken de (yani biri
--      SADECE bir vitrine mesaj atmaya çalışırken) tavan dolmuşsa trigger
--      bunu da REDDEDİYORDU — kapasitesi dolan biri artık hiçbir yeni
--      vitrine mesaj bile atamaz hale geliyordu (bu asla amaçlanmamıştı).
--
-- Aynı sorunun component tarafındaki (fetchJobs, loadMyJobs, PostJobView'daki
-- ilan-tavanı ön kontrolü) karşılığı components/IsinnApp.jsx'te zaten
-- düzeltildi (service_id IS NULL filtresi) — bu dosya sunucu tarafındaki
-- asıl zorlamayı (kolon + trigger + fonksiyon, sıfırdan) kuruyor.

alter table subscription_plans add column if not exists max_active_jobs integer;
update subscription_plans set max_active_jobs = 5 where slug = 'standart';
update subscription_plans set max_active_jobs = 20 where slug = 'pro';

create or replace function enforce_job_cap()
returns trigger as $$
declare
  v_cap integer;
  v_active_count integer;
begin
  if new.active is not true then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.active is true then
    return new;
  end if;
  -- Bu bir görüşme-bağlantı kaydıysa (vitrine mesaj atarken oluşan), ilan
  -- tavanı hiç uygulanmaz — sadece gerçek "İlan Ver" gönderileri sayılır.
  if new.service_id is not null then
    return new;
  end if;

  select coalesce(sp.max_active_jobs, 5) into v_cap
  from provider_subscriptions ps
  join subscription_plans sp on sp.id = ps.plan_id
  where ps.profile_id = new.client_id and ps.status in ('active', 'trialing')
  order by ps.current_period_end desc
  limit 1;

  if v_cap is null then
    v_cap := 5;
  end if;

  select count(*) into v_active_count
  from jobs
  where client_id = new.client_id and active = true and service_id is null
    and id is distinct from new.id;

  if v_active_count >= v_cap then
    raise exception 'Aynı anda en fazla % aktif ilanın olabilir. Yeni bir ilan açmak için önce eski bir tanesini pasife al.', v_cap;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_enforce_job_cap on jobs;
create trigger trg_enforce_job_cap
before insert or update on jobs
for each row execute function enforce_job_cap();
