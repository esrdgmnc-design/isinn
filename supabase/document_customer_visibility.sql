-- İşinn — sertifika/CV'yi müşterilere, SADECE sağlayıcının açık rızasıyla göster.
-- provider_documents tablosu ve "provider-documents" storage bucket'ı bilerek
-- ÖZEL (bkz. verification_signal.sql, vitrin_media.sql): dosyalar kimlik no,
-- adres, telefon gibi kişisel veri içerebiliyor (KVKK). Bu yüzden bugüne kadar
-- müşteri sadece "Belge Paylaştı" rozetini görüyordu, belgenin kendisini değil.
-- Sağlayıcı isterse, TEK TEK belge bazında "Müşteriler görebilsin" diyebilsin
-- diye bir rıza bayrağı ekliyoruz. Varsayılan KAPALI — hiçbir mevcut belge bu
-- migration yüzünden görünür hale gelmez.
--
-- NOT: Sahibin mevcut SELECT/UPDATE/DELETE politikalarına (schema.sql'deki
-- "owner only") DOKUNMUYORUZ. Postgres'te aynı tablodaki birden fazla PERMISSIVE
-- politika OR ile birleşir; yani aşağıdaki yeni politikalar sadece "sahibi
-- zaten görüyor" kuralının ÜSTÜNE, rıza verilmiş satırlar için ek okuma yolu açar.

alter table provider_documents add column if not exists visible_to_customers boolean not null default false;

-- 1) Tablo satırı: herkes (anon dahil) sadece rıza verilmiş VE aktif bir
-- vitrine ait belgelerin meta verisini (ad, dosya yolu) okuyabilir. Vitrin
-- kapatılmışsa (services.active=false) belge de kendiliğinden gizlenir.
drop policy if exists "Customer-visible documents are viewable by everyone" on provider_documents;
create policy "Customer-visible documents are viewable by everyone"
  on provider_documents for select
  using (
    visible_to_customers = true
    and exists (
      select 1 from services s
      where s.id = provider_documents.service_id and s.active = true
    )
  );

-- 2) Dosyanın kendisi: bucket PRIVATE ve uygulama createSignedUrl kullanıyor —
-- bu da çağıranın storage.objects üzerinde SELECT yetkisi olmasını gerektiriyor.
-- Tablo politikası tek başına yetmez, yoksa müşteri satırı görür ama dosyayı
-- açamazdı. Sadece "eşleşen provider_documents satırı rıza vermiş + vitrin
-- aktif" ise okumaya izin veriyoruz (sahibin kendi klasörüne erişimi ayrı,
-- mevcut politikayla devam ediyor). Bucket private kalıyor, public URL yok.
drop policy if exists "Customer-visible provider documents are readable" on storage.objects;
create policy "Customer-visible provider documents are readable"
  on storage.objects for select
  using (
    bucket_id = 'provider-documents'
    and exists (
      select 1
      from provider_documents d
      join services s on s.id = d.service_id
      where d.file_url = storage.objects.name
        and d.visible_to_customers = true
        and s.active = true
    )
  );

-- 3) Rıza DOSYAYA verilir, vitrine değil: sağlayıcı CV'sini başka bir dosyayla
-- değiştirirse (file_url değişir) yeni dosya için rıza sıfırlanır — yoksa eski
-- onay, hiç görülmemiş yeni bir dosyayı sessizce herkese açardı.
create or replace function reset_document_visibility_on_file_change()
returns trigger as $$
begin
  if new.file_url is distinct from old.file_url then
    new.visible_to_customers := false;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_reset_document_visibility on provider_documents;
create trigger trg_reset_document_visibility
before update of file_url on provider_documents
for each row execute function reset_document_visibility_on_file_change();
