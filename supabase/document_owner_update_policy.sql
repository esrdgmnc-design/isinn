-- İşinn — sağlayıcı kendi belgesinin "Müşteriler görebilsin" rızasını
-- (provider_documents.visible_to_customers) güncelleyebilsin.
-- Belirti: anahtar arayüzde "açık" görünüyor ama müşteri gözünde belge çıkmıyor.
-- Neden: sahibin UPDATE yetkisi (RLS policy ya da kolon yetkisi) bu tabloda
-- yoksa/eksikse Supabase hata dönmüyor, sadece 0 satır güncelliyor.
-- Bu dosya güvenle tekrar çalıştırılabilir; sahibin mevcut politikalarına
-- ek olarak (PERMISSIVE politikalar OR ile birleşir) sadece KENDİ satırlarını
-- güncelleme yolunu açar.
alter table provider_documents enable row level security;

drop policy if exists "Owners can update their own documents" on provider_documents;
create policy "Owners can update their own documents"
  on provider_documents for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

grant update (visible_to_customers, file_url, file_name, label) on public.provider_documents to authenticated;
