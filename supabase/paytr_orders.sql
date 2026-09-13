-- İşinn — PayTR entegrasyonu için sipariş takip tablosu (2026-09-13).
--
-- Ödeme akışı iki sunucu route'undan geçiyor (app/api/paytr-init,
-- app/api/paytr-callback) ve ikisi de service role key kullanıyor — bu
-- yüzden normal kullanıcı RLS'i sadece "kendi siparişlerini görebilsin"
-- kuralını taşıyor, insert/update client'tan asla yapılmıyor (sahte
-- "ödeme başarılı" satırı yazılmasının önü baştan kapalı).

create table if not exists payment_orders (
  id uuid primary key default uuid_generate_v4(),
  merchant_oid text not null unique,
  profile_id uuid not null references profiles(id) on delete cascade,
  plan_slug text not null,
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  amount numeric not null, -- TL cinsinden, PayTR'a kuruşa çevrilerek gönderiliyor
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  failed_reason text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists idx_payment_orders_profile on payment_orders(profile_id, created_at desc);
create index if not exists idx_payment_orders_oid on payment_orders(merchant_oid);

alter table payment_orders enable row level security;

create policy "Users can view their own orders" on payment_orders
  for select using (auth.uid() = profile_id);

create policy "Admins can view all orders" on payment_orders
  for select using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Bilerek insert/update policy'si yok — bu tabloya sadece
-- SUPABASE_SERVICE_ROLE_KEY ile (paytr-init ve paytr-callback route'ları)
-- yazılabiliyor, RLS'i bypass ediyorlar. Client hiçbir zaman doğrudan bir
-- sipariş satırı yazamaz veya "success" yapamaz.
