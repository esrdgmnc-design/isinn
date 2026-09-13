-- İşinn — kayıtlı kart desteği (2026-09-13). "Kredi kartı otomatik hatırlar
-- mı" sorusuna gerçek bir cevap: PayTR'ın Kart Saklama API'si ile ilk
-- ödemede kartı saklıyoruz (paytr-init'teki store_card:1), PayTR'ın bize
-- geri verdiği utoken/ctoken'ı burada tutuyoruz. Bu ikisi hem otomatik
-- yenileme (renew-subscriptions cron'u) hem "kayıtlı kartınla öde" hızlı
-- satın alma akışı için kullanılıyor — kart numarası/CVV BİZDE HİÇ SAKLANMIYOR,
-- sadece PayTR'ın verdiği token'lar (PCI-DSS gereği doğru yaklaşım budur).

create table if not exists payment_methods (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  utoken text not null,
  ctoken text not null,
  last_4 text,
  card_brand text,
  card_bank text,
  exp_month text,
  exp_year text,
  updated_at timestamptz not null default now()
);

alter table payment_methods enable row level security;

create policy "Users can view their own saved card" on payment_methods
  for select using (auth.uid() = profile_id);

-- Bilerek insert/update/delete policy'si yok — sadece service role
-- (paytr-callback route'u) yazabiliyor. Client hiçbir zaman kendi adına
-- sahte bir "kayıtlı kart" satırı oluşturamaz.
