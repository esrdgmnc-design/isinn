-- İşinn — 2026-09-19 denetim düzeltmeleri (üç bölüm, tekrar çalıştırılabilir).

-- ============================================================
-- 1) KRİTİK: ücretsiz plan/boost verme fonksiyonları GERÇEKTEN kapatılıyor.
-- revoke_free_grant_rpcs.sql sadece "authenticated" rolünden EXECUTE'u geri
-- almıştı; Postgres fonksiyonlara varsayılan olarak PUBLIC'e EXECUTE verir,
-- yani anon ve authenticated hâlâ PUBLIC üzerinden çağırabiliyordu (canlı
-- probe: anon çağrısı fonksiyon gövdesine giriyor, "Giriş yapmış olmalısın"
-- hatasını fonksiyonun KENDİSİ veriyor — izin hatası değil). Giriş yapmış
-- biri upgrade_to_pro/add_boost_addon vb.'yi PayTR'a hiç uğramadan
-- çağırıp bedavaya Pro/Öne Çıkarma alabilirdi. Gerçek aktivasyon yalnızca
-- paytr-callback'ten (service role) gelmeli.
-- Aşırı yüklemeleri (overload) de yakalamak için imzalar pg_proc'tan alınıyor.
-- ============================================================
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('upgrade_to_pro', 'add_boost_addon', 'add_weekly_boost_addon',
                        'add_extra_vitrin_addon', 'sync_subscription_period', 'request_phone_otp')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', r.sig);
    execute format('grant execute on function %s to service_role', r.sig);
  end loop;

  -- Kullanıcının kendi oturumuyla gerçekten çağırdığı fonksiyonlar: anon ve
  -- PUBLIC kapansın, sadece giriş yapmış kullanıcılar çağırsın.
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('start_free_trial', 'sync_pro_boost', 'verify_phone_otp',
                        'find_or_create_job', 'is_blocked_between')
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated, service_role', r.sig);
  end loop;
end $$;

-- ============================================================
-- 2) professional_credential.sql çalıştırılmamıştı (services.professional_credential
-- yok → 400) ve lock_row_ownership_columns.sql sütun bazlı UPDATE/INSERT
-- listesinde de yoktu. Sütun + yetkiler:
-- ============================================================
alter table services add column if not exists professional_credential text;
grant update (professional_credential) on public.services to authenticated;
grant insert (professional_credential) on public.services to authenticated;

-- ============================================================
-- 3) Sık kullanılan sorgular için indeksler. Hangi sütunun/tablonun tam
-- olarak var olduğu repo'daki migration'lardan garanti edilemediği için her
-- biri kendi hata bloğunda — olmayan bir sütun sadece o indeksi atlar.
-- ============================================================
do $$
declare stmt text;
begin
  foreach stmt in array array[
    'create index if not exists idx_services_provider on services(provider_id)',
    'create index if not exists idx_services_active_created on services(created_at desc) where active',
    'create index if not exists idx_services_active_cat on services(category_id) where active',
    'create index if not exists idx_jobs_client on jobs(client_id)',
    'create index if not exists idx_jobs_delivered_service on jobs(service_id) where state = ''delivered''',
    'create index if not exists idx_messages_job_created on messages(job_id, created_at)',
    'create index if not exists idx_ratings_rated_profile on ratings(rated_profile_id)',
    'create index if not exists idx_notifications_profile_unread on notifications(profile_id, created_at desc) where read_at is null',
    'create index if not exists idx_favorites_service on favorites(service_id)',
    'create index if not exists idx_favorites_job on favorites(job_id)',
    'create index if not exists idx_addons_profile_status on provider_addons(profile_id, status)'
  ]
  loop
    begin
      execute stmt;
    exception when others then
      raise notice 'atlandı: % (%)', stmt, sqlerrm;
    end;
  end loop;
end $$;
