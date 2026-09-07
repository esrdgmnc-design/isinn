-- İşinn — gerçek bir admin rolü. Bu şemada şimdiye kadar hiç yoktu (schema
-- (3).sql'in kendi notu, ve user_reports/support_tickets'ı gerçek yaparken
-- birkaç kez karşımıza çıktı: "kim bunları görebilir" sorusunun cevabı hep
-- "henüz kimse" idi). Tam bir rol/izin sistemi kurmak yerine (bu ölçekte
-- gereğinden büyük iş) en basit, dürüst çözüm: profiles'a tek bir is_admin
-- bayrağı ve sahibini (uygulamayı işleten kişi) admin işaretlemek.

alter table profiles add column if not exists is_admin boolean not null default false;

-- esrdgmnc@gmail.com hesabını admin yap. Bu e-postayla auth.users'da bir
-- kayıt yoksa (henüz o hesapla giriş yapılmadıysa) hiçbir şey değişmez —
-- güvenli, hata vermez.
update profiles set is_admin = true
where id = (select id from auth.users where email = 'esrdgmnc@gmail.com');

-- Adminler user_reports ve support_tickets'ın TAMAMINI görebilsin (öncekiler
-- sadece "bildiren kendi bildirdiklerini görür" idi — admin için ayrı,
-- ek bir select policy; var olanları değiştirmiyor, üstüne ekliyor).
create policy "Admins can view all user reports" on user_reports for select
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));
create policy "Admins can update user report status" on user_reports for update
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));

create policy "Admins can view all support tickets" on support_tickets for select
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));
create policy "Admins can update support ticket status" on support_tickets for update
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true));
