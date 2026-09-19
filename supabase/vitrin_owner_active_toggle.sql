-- İşinn — vitrin sahibinin "Vitrin yayında / Yayından kaldır" anahtarı
-- (vitrin sayfası, sahip modu). Normalde istemci doğrudan
-- services.update({ active }) yapıyor; ama lock_row_ownership_columns.sql
-- services için sütun bazlı UPDATE yetkisi verdi ve `active` o listede YOK —
-- yani o migration çalıştıysa doğrudan güncelleme "permission denied" verir.
-- Bu güvenli RPC bu durumda devreye girer (istemci otomatik olarak buna düşer):
--   * sadece vitrinin sahibi çağırabilir,
--   * ödeme alınamadığı için kapatılmış vitrin (deactivated_for_billing_at dolu)
--     buradan yeniden açılamaz — gerçek ödeme (paytr-callback) açar,
--   * yeniden açarken enforce_vitrin_cap trigger'ı yine çalışır ("Vitrin hakkını
--     doldurdun..." hatası aynen istemciye döner).
create or replace function set_vitrin_active(p_service_id uuid, p_active boolean)
returns void as $$
begin
  if not exists (select 1 from services where id = p_service_id and provider_id = auth.uid()) then
    raise exception 'Bu vitrin sana ait değil.';
  end if;
  if p_active and exists (select 1 from services where id = p_service_id and deactivated_for_billing_at is not null) then
    raise exception 'Bu vitrin ödeme alınamadığı için kapatıldı. Üyeliğini yenilediğinde otomatik olarak yeniden yayına girer.';
  end if;
  update services set active = p_active where id = p_service_id;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function set_vitrin_active(uuid, boolean) from public, anon;
grant execute on function set_vitrin_active(uuid, boolean) to authenticated;
