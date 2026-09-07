-- İşinn — dürüst "belge paylaştı" sinyali.
-- provider_documents tablosu RLS ile bilerek özel (sahibinden başkası okuyamaz,
-- kişisel bilgi içerebiliyor) — bu yüzden bir ilana bakan müşteri, sağlayıcının
-- gerçekten sertifika yüklediğini normalde hiç göremiyordu (ya hiç rozet yoktu,
-- ya da eski kod hep boş bırakıyordu). Burada hiçbir belge/kişisel bilgi
-- sızdırmadan, sadece "en az bir sertifika yüklenmiş mi" bilgisini public
-- profiles tablosuna bir bayrak olarak yansıtıyoruz. Bilerek "Doğrulanmış"
-- DEMİYORUZ (kimse belgeyi incelemedi/onaylamadı) — "Belge Paylaştı" gibi
-- dürüst bir etiket kullanılmalı, gerçek bir admin-onay akışı kurulana kadar.

alter table profiles add column if not exists has_certificates boolean not null default false;

create or replace function sync_has_certificates()
returns trigger as $$
begin
  update profiles
  set has_certificates = exists(
    select 1 from provider_documents
    where profile_id = coalesce(new.profile_id, old.profile_id)
      and doc_type = 'certificate'
  )
  where id = coalesce(new.profile_id, old.profile_id);
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_has_certificates on provider_documents;
create trigger trg_sync_has_certificates
after insert or delete on provider_documents
for each row execute function sync_has_certificates();

-- Zaten yüklenmiş belgeler için bayrağı bir kereliğine geriye dönük hesapla.
update profiles p
set has_certificates = exists(
  select 1 from provider_documents d where d.profile_id = p.id and d.doc_type = 'certificate'
);
