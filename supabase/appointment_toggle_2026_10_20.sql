-- İşinn — vitrin başına "Randevu / görüşme talebi al" tercihi (2026-10-20).
-- null = varsayılan: yerinde hizmet veren vitrinde AÇIK, uzaktan vitrinde KAPALI. Sahibi açıp kapatabilir.
-- Sağlık kategorilerinde istemci bu seçeneği hiç göstermez (KVKK özel nitelikli veri riski).
-- Supabase SQL Editor'de BİR KEZ çalıştır (idempotent). work_link_2026_10_05.sql'deki kolon grant kalıbı.

alter table services add column if not exists appointment_requests boolean;

grant update (appointment_requests) on public.services to authenticated;
grant insert (appointment_requests) on public.services to authenticated;
