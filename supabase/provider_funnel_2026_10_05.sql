-- İşinn — Sağlayıcı performans paneli (2026-10-05)
-- Vitrin sahibi, KENDİ vitrininin son N gününü görür: görüntüleme (tekil oturum) → çalışma bağlantısı/paylaşım →
-- görüşme → yanıt verilen görüşme → iki taraflı onaylı iş. Başkasının vitrini sorgulanamaz.
-- Ölçüm sınırı: listing_view olayına vitrin kimliği (props.listing_id) bu tarihten itibaren eklendi; daha eski
-- görüntülemeler vitrine bağlanamaz, bu yüzden "measured_since" döndürülür ve arayüz dürüstçe gösterir.
-- Sahibin kendi ziyaretleri sayılmaz. Tekil oturum = events.session_id (çerezsiz, tarayıcı başına rastgele kimlik).

create or replace function provider_vitrin_funnel(p_service_id uuid, p_days integer default 30)
returns json as $$
declare
  v_owner uuid;
  v_since timestamptz := now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)));
  v_views integer;
  v_link_clicks integer;
  v_shares integer;
  v_convs integer;
  v_replied integer;
  v_both integer;
  v_measured_since timestamptz;
begin
  select provider_id into v_owner from services where id = p_service_id;
  if v_owner is null or v_owner is distinct from auth.uid() then
    raise exception 'Bu vitrin sana ait değil.';
  end if;

  select count(distinct session_id) into v_views
    from events
   where name = 'listing_view' and props->>'listing_id' = p_service_id::text
     and created_at >= v_since and (profile_id is null or profile_id <> v_owner);
  select min(created_at) into v_measured_since
    from events where name = 'listing_view' and props->>'listing_id' = p_service_id::text;

  select count(distinct session_id) into v_link_clicks
    from events
   where name = 'portfolio_link_click' and props->>'listing_id' = p_service_id::text
     and created_at >= v_since and (profile_id is null or profile_id <> v_owner);

  select count(*) into v_shares
    from events
   where name = 'vitrin_shared' and props->>'listing_id' = p_service_id::text
     and created_at >= v_since;

  select count(*) into v_convs
    from jobs where service_id = p_service_id and created_at >= v_since and client_id <> v_owner;

  select count(*) into v_replied
    from jobs j
   where j.service_id = p_service_id and j.created_at >= v_since and j.client_id <> v_owner
     and exists (select 1 from messages m where m.job_id = j.id and m.sender_id = v_owner);

  select count(*) into v_both
    from jobs j
   where j.service_id = p_service_id and j.created_at >= v_since and j.client_id <> v_owner
     and j.client_delivered_at is not null and j.provider_delivered_at is not null;

  return json_build_object(
    'days', greatest(1, least(coalesce(p_days, 30), 365)),
    'views', coalesce(v_views, 0),
    'link_clicks', coalesce(v_link_clicks, 0),
    'shares', coalesce(v_shares, 0),
    'conversations', coalesce(v_convs, 0),
    'replied', coalesce(v_replied, 0),
    'confirmed_both', coalesce(v_both, 0),
    'measured_since', v_measured_since
  );
end;
$$ language plpgsql security definer stable set search_path = public;

revoke all on function provider_vitrin_funnel(uuid, integer) from public;
grant execute on function provider_vitrin_funnel(uuid, integer) to authenticated;
