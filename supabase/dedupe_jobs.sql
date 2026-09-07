-- İşinn — mesajlaşma başlatırken oluşan "jobs" kaydında yarış durumu (race
-- condition) düzeltmesi. MessagesView'daki eski "var mı diye bak, yoksa
-- oluştur" mantığı iki ayrı sorguydu (select sonra insert), aralarında hiçbir
-- kilit yoktu. React'in bir efekti art arda iki kez tetiklemesi (StrictMode,
-- hızlı yeniden render, vb.) bu iki sorgunun neredeyse aynı anda çalışmasına
-- yol açtı: ikisi de "yok" gördü, ikisi de insert etti. Canlı testte
-- yakalandı — aynı client_id+service_id için iki jobs satırı, created_at'leri
-- ~1ms arayla. Sonuç: "Hizmeti Aldım" bir satırı 'delivered' yapıyordu,
-- değerlendirme ekranı bazen diğerine bakıp hâlâ kilitli görünüyordu.
--
-- Bu dosya iki şey yapıyor: (1) var olan kopyaları güvenle temizler (mesaj/
-- değerlendirme geçmişini kaybetmeden), (2) bir daha oluşmasını ATOMİK bir
-- RPC ile engelliyor (advisory lock — eşzamanlı iki çağrıyı sıraya sokar).

-- 1) Var olan kopyaları temizle: aynı client_id+service_id için birden fazla
--    jobs satırı varsa, EN ESKİSİNİ tut (asıl konuşma o), diğerlerine bağlı
--    mesaj/değerlendirmeleri en eskiye taşı (jobs->messages/ratings "on
--    delete cascade" olduğu için önce taşımazsak mesaj geçmişi silinir),
--    sonra fazlalıkları sil.
do $$
declare
  r record;
  keep_id uuid;
begin
  for r in
    select client_id, service_id
    from jobs
    where service_id is not null
    group by client_id, service_id
    having count(*) > 1
  loop
    select id into keep_id
    from jobs
    where client_id = r.client_id and service_id = r.service_id
    order by created_at asc
    limit 1;

    update messages set job_id = keep_id
    where job_id in (
      select id from jobs
      where client_id = r.client_id and service_id = r.service_id and id <> keep_id
    );

    update ratings set job_id = keep_id
    where job_id in (
      select id from jobs
      where client_id = r.client_id and service_id = r.service_id and id <> keep_id
    );

    delete from jobs
    where client_id = r.client_id and service_id = r.service_id and id <> keep_id;
  end loop;
end $$;

-- 2) Bir daha oluşmasını engelle: atomik "bul-yoksa-oluştur" RPC'si.
--    pg_advisory_xact_lock aynı (client, vitrin) çifti için eşzamanlı
--    çağrıları sıraya sokar — transaction bitince kilit kendiliğinden
--    açılır, ikinci çağrı ilk çağrının insert'ini görüp onu döndürür.
create or replace function find_or_create_job(
  p_service_id uuid,
  p_category_id uuid,
  p_title text
)
returns uuid as $$
declare
  v_job_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmış olmalısın.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text || ':' || coalesce(p_service_id::text, p_title), 0));

  select id into v_job_id
  from jobs
  where client_id = auth.uid()
    and (
      (p_service_id is not null and service_id = p_service_id)
      or (p_service_id is null and title = p_title)
    )
  order by created_at desc
  limit 1;

  if v_job_id is not null then
    return v_job_id;
  end if;

  insert into jobs (client_id, category_id, title, state, service_id)
  values (auth.uid(), p_category_id, p_title, 'negotiating', p_service_id)
  returning id into v_job_id;

  return v_job_id;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function find_or_create_job(uuid, uuid, text) to authenticated;
