-- Yönetim Paneli (gerçek sayılarla) için gereken tek eksik izin.
--
-- profiles, services ve subscription_plans zaten herkese açık select
-- (pazaryeri zaten herkese görünür olmak zorunda) — admin ekranı için ayrı
-- bir izne ihtiyaçları yok. Ama provider_subscriptions sadece "kendi
-- aboneliğini gören" bir politikaya sahip (auth.uid() = profile_id), yani
-- admin_role.sql'in user_reports/support_tickets için yaptığı gibi, admin
-- için ayrı bir select politikası eklemek gerekiyor — var olanı değiştirmiyor,
-- üstüne ekliyor.

create policy "Admins can view all provider subscriptions" on provider_subscriptions for select
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));
