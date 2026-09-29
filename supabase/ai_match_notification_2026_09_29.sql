-- İşinn — 2026-09-29: iş ilanı verildiğinde AI eşleştirme otomatik çalışsın
-- ve ilk 3 sonuç ilan sahibine bildirim olarak gitsin.
-- İhtiyaç: reklam metninde "ilanın yayına girince... yapay zekâ en uygun
-- profilleri uyum yüzdesiyle sıralar" deniyordu ama bu daha önce sadece
-- müşteri "AI ile Eşleştir"e manuel basınca oluyordu, bildirim hiç gitmiyordu.
-- Bu dosya sadece notifications_type_check kısıtını genişletiyor — asıl AI
-- çağrısı ve bildirim insert'i istemci tarafında (PostJobView), çünkü bu
-- akış zaten Claude API'sine tarayıcıdan gidiyor (SQL trigger'dan HTTP
-- isteği atılamaz).

alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'pending_media_approval', 'staff_review_needed', 'media_approved', 'media_rejected',
    'new_message', 'job_delivered', 'saved_search_match',
    'subscription_ending_soon', 'vitrin_deactivated', 'new_job_match',
    'service_favorited', 'ai_match_top3'
  ));
