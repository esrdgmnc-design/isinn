-- İşinn — vitrine özel medya. Kullanıcının kendi tabiriyle: "iki farklı
-- Instagram hesabında gezinmek gibi, fotoğraflar ve belgeler farklı olacak."
-- Paylaşılan (kişi/hesap seviyesinde) kalanlar: giriş bilgileri, telefon,
-- üyelik/faturalama, gerçek ad-soyad/şehir, PROFİL FOTOĞRAFI (avatar) —
-- kullanıcının kendi kararı: "aynı kişinin gerçek yüzü her vitrinde aynı
-- görünsün". Vitrine özel olanlar: görünecek isim, video tanıtım, portföy,
-- sertifika & belgeler, CV.

-- "Görünecek isim / işletme adı" artık services'e ait — önceden
-- profiles.business_name'i güncelliyordu, bu da bir vitrinde ismini
-- değiştirince SESSİZCE diğer tüm vitrinlerin de adını değiştiriyordu
-- (gerçek bir hataydı, fark edilmemişti). display_name boşsa (eski
-- vitrinler) istemci tarafında profiles.business_name/full_name'e düşülüyor.
alter table services add column if not exists display_name text;

-- Tanıtım videosu artık vitrine ait (önceden profiles'ta tek videoydu).
alter table services add column if not exists video_intro_url text;
alter table services add column if not exists video_intro_name text;

-- "Doğrulanmış" rozeti de artık vitrin bazlı olmalı — bir vitrine yüklenen
-- sertifika diğer vitrinde alakasız görünmemeli (bkz. verification_signal.sql'in
-- eski profil-bazlı sync_has_certificates'i, o hâlâ profiles.has_certificates'i
-- güncelliyor ama artık mapServiceRowToListing bunu KULLANMIYOR).
alter table services add column if not exists has_certificates boolean not null default false;

-- portfolio_items / provider_documents sahiplik kontrolü hâlâ profile_id
-- üzerinden (RLS değişmedi) — service_id sadece "hangi vitrine ait"
-- filtrelemesi için eklendi. NULL = eski, henüz bir vitrine atanmamış medya
-- (yeni yüklemeler her zaman bir service_id ile gelecek).
alter table portfolio_items add column if not exists service_id uuid references services(id) on delete cascade;
create index if not exists idx_portfolio_items_service on portfolio_items(service_id);

alter table provider_documents add column if not exists service_id uuid references services(id) on delete cascade;
create index if not exists idx_provider_documents_service on provider_documents(service_id);

-- sync_has_certificates artık service_id bazlı çalışıyor — bir sertifika
-- eklenip/silinince SADECE o vitrinin has_certificates'i güncellenir.
-- service_id'si olmayan (eski/atanmamış) belgeler hiçbir vitrini etkilemez.
create or replace function sync_service_has_certificates()
returns trigger as $$
declare
  v_service_id uuid;
begin
  v_service_id := coalesce(new.service_id, old.service_id);
  if v_service_id is null then
    return null;
  end if;
  update services
  set has_certificates = exists(
    select 1 from provider_documents
    where service_id = v_service_id and doc_type = 'certificate'
  )
  where id = v_service_id;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_service_has_certificates on provider_documents;
create trigger trg_sync_service_has_certificates
after insert or update or delete on provider_documents
for each row execute function sync_service_has_certificates();

-- Değerlendirmeler — vitrin sahibi kendi kararını veriyor: "Birleştir" (varsayılan,
-- geriye dönük uyumlu — mevcut değerlendirmeler kişiye bağlı kalmaya devam eder,
-- yeni bir vitrin açtığında sıfırdan başlamaz) veya "Ayrı tut" (tam Instagram
-- hesabı gibi, sadece bu vitrine gelen değerlendirmeler sayılır).
alter table services add column if not exists share_profile_reviews boolean not null default true;

-- Hangi vitrin için bırakıldığını işaretliyoruz (NULL = eski kayıt, kişiye
-- bağlı sayılır). submitRealReview artık bunu dolduruyor.
alter table ratings add column if not exists service_id uuid references services(id) on delete set null;
create index if not exists idx_ratings_service on ratings(service_id);

-- Mesajlaşma sender adı sızıntısı: bir müşteri iki farklı vitrine mesaj
-- atınca gelen kutusunda gönderen adı ikisinde de AYNI görünüyordu (paylaşılan
-- profiles.business_name/full_name kullanılıyordu, vitrine özel display_name
-- değil) — Instagram-ayrı-hesap illüzyonunu bozan gerçek bir tutarsızlıktı.
-- jobs.service_id, bir mesajlaşma/görüşmenin HANGİ vitrin için açıldığını
-- işaretliyor; loadRealConversations artık varsa o vitrinin display_name'ini
-- kullanıyor, yoksa (eski kayıtlar, gerçek iş ilanı görüşmeleri) paylaşılan isme düşüyor.
alter table jobs add column if not exists service_id uuid references services(id) on delete set null;
create index if not exists idx_jobs_service on jobs(service_id);
