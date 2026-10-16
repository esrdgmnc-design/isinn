-- İşinn — İki taraflı onayda "itiraz et / iptal" (2026-10-16)
--
-- Uygulama, karşı taraf işi onayladıysa ve ben henüz yanıt vermediysem fark edilir bir pencere ve alt kartla
-- "onayla ya da itiraz et" der (components/DeliveryConfirmGate.jsx; zorlayıcı değil, "Sonra karar veririm" var).
-- Onay zaten confirm_job_delivery() ile veriliyordu; bu dosya "itiraz" yolunu ekler.
--
-- dispute_job_delivery(p_job_id):
--   * Yalnızca işin tarafı (müşteri ya da hizmeti veren) çağırabilir.
--   * Yalnızca iş 'delivered' ise, KARŞI tarafın onayı varsa ve benim onayım yoksa çalışır.
--   * İşi 'negotiating' durumuna döndürür, iki tarafın onay damgasını siler (tek taraflı "beyan" kalmaz),
--     itirazın zamanını ve kimden geldiğini kaydeder, bu işe yazılmış yorumların both_confirmed'ını false yapar.
--   * Karşı tarafa bildirim gider. Mevcut yorumlar SİLİNMEZ ve gizlenmez (bu dosya yorum moderasyonu yapmaz).
--
-- Çalıştırma: Supabase SQL düzenleyicisinde bir kez. two_sided_confirmation_2026_10_05.sql'den SONRA.
-- (2026-10-16'da kurucu tarafından prod'da çalıştırıldı ve doğrulandı.)

alter table jobs add column if not exists delivery_disputed_at timestamptz;
alter table jobs add column if not exists delivery_disputed_by uuid;

create or replace function dispute_job_delivery(p_job_id uuid)
returns text as $$
declare
  v_job record;
  v_provider uuid;
  v_is_client boolean;
  v_is_provider boolean;
  v_other uuid;
begin
  if auth.uid() is null then
    raise exception 'Giriş gerekli.';
  end if;
  select id, client_id, service_id, title, state, client_delivered_at, provider_delivered_at
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
    raise exception 'Kendi işine itiraz edemezsin.';
  end if;
  if v_job.state is distinct from 'delivered' then
    raise exception 'İtiraz edilecek bir onay yok.';
  end if;
  if v_is_client and not (v_job.client_delivered_at is null and v_job.provider_delivered_at is not null) then
    raise exception 'İtiraz edilecek bir onay yok.';
  end if;
  if v_is_provider and not (v_job.provider_delivered_at is null and v_job.client_delivered_at is not null) then
    raise exception 'İtiraz edilecek bir onay yok.';
  end if;

  v_other := case when v_is_client then v_provider else v_job.client_id end;

  perform set_config('app.job_confirm_rpc', '1', true);
  update jobs
     set state = 'negotiating',
         client_delivered_at = null,
         provider_delivered_at = null,
         delivery_disputed_at = now(),
         delivery_disputed_by = auth.uid()
   where id = p_job_id;
  update ratings set both_confirmed = false where job_id = p_job_id;
  perform set_config('app.job_confirm_rpc', '', true);

  -- notifications_type_check'i genişletmemek için mevcut 'job_delivered' tipi kullanılır
  if v_other is not null then
    insert into notifications (profile_id, type, title, body, related_job_id, related_service_id)
    values (
      v_other, 'job_delivered',
      'Karşı taraf işi onaylamadı',
      '"' || coalesce(v_job.title, 'Görüşme') || '" için karşı taraf işin tamamlandığını onaylamadı ve itiraz etti. Mesajlaşma ekranından konuşabilirsiniz.',
      v_job.id, v_job.service_id
    );
  end if;

  return 'disputed';
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function dispute_job_delivery(uuid) from public;
grant execute on function dispute_job_delivery(uuid) to authenticated;
