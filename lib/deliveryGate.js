// İki taraflı iş onayı: karşı taraf işi onayladıysa ve ben henüz yanıt vermediysem uygulama beni
// engelleyen bir pencereyle "onayla ya da itiraz et" der. Bu dosya bağımlılıksız (test edilebilir).
//
// job: { id, state, client_id, client_delivered_at, provider_delivered_at, services: { provider_id } }
// Dönüş: "client" (müşteri olarak benden onay bekleniyor), "provider" (hizmet veren olarak benden
// onay bekleniyor) ya da null.
export function pendingConfirmationRole(job, userId) {
  if (!job || !userId || job.state !== "delivered") return null;
  const providerId = job.services?.provider_id || null;
  const isClient = job.client_id === userId;
  const isProvider = !!providerId && providerId === userId;
  if (isClient === isProvider) return null; // ikisi de ya da hiçbiri
  if (isClient && !job.client_delivered_at && job.provider_delivered_at) return "client";
  if (isProvider && !job.provider_delivered_at && job.client_delivered_at) return "provider";
  return null;
}

// Bekleyenlerden bu oturumda "şimdilik kapat"ılmış olanları ayıklar ve ilkini verir.
export function nextPending(jobs, userId, skippedIds = []) {
  for (const job of jobs || []) {
    if (skippedIds.includes(job.id)) continue;
    const role = pendingConfirmationRole(job, userId);
    if (role) return { job, role };
  }
  return null;
}
