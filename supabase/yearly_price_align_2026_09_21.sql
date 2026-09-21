-- Yıllık plan fiyatı uyuşmazlığı düzeltmesi (2026-09-21).
-- Arayüz (PLANS/PRO_PACKAGE) yıllık fiyatı 799 / 3999 gösteriyordu, ama
-- ödeme tutarı subscription_plans'tan okunuyor ve orada 1590 / 6490 vardı —
-- müşteriye gösterilenden fazla çekiliyordu. Karar: 799 / 3999 (ilk yıl indirimli).
update subscription_plans set price_yearly = 799 where slug = 'standart';
update subscription_plans set price_yearly = 3999 where slug = 'pro';
