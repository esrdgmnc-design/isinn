// PayTR iFrame API için ortak yardımcılar. Formüller PayTR'ın kendi resmi
// dokümantasyonundan (dev.paytr.com/en/iframe-api) birebir alındı — hash
// alanlarının SIRASI kritik, tek bir alan yanlış sırada olsa PayTR sessizce
// "geçersiz token" hatası veriyor, o yüzden burada değiştirilmemeli.
import crypto from "crypto";

export function hmacBase64(str, key) {
  return crypto.createHmac("sha256", key).update(str).digest("base64");
}

// Adım 1 — get-token isteği için paytr_token. Alan sırası:
// merchant_id + user_ip + merchant_oid + email + payment_amount +
// user_basket + no_installment + max_installment + currency + test_mode +
// merchant_salt
export function computeGetTokenHash({
  merchantId, userIp, merchantOid, email, paymentAmount, userBasketBase64,
  noInstallment, maxInstallment, currency, testMode, merchantSalt, merchantKey,
}) {
  const hashStr =
    merchantId + userIp + merchantOid + email + paymentAmount +
    userBasketBase64 + noInstallment + maxInstallment + currency + testMode +
    merchantSalt;
  return hmacBase64(hashStr, merchantKey);
}

// Adım 2 — Bildirim URL'e gelen POST'un hash doğrulaması. Alan sırası:
// merchant_oid + merchant_salt + status + total_amount
export function computeCallbackHash({ merchantOid, merchantSalt, status, totalAmount, merchantKey }) {
  const hashStr = merchantOid + merchantSalt + status + totalAmount;
  return hmacBase64(hashStr, merchantKey);
}

// merchant_oid PayTR'da SADECE alfanümerik olmalı (max 64 karakter).
export function generateMerchantOid(prefix = "ISINN") {
  const rand = crypto.randomBytes(6).toString("hex");
  return `${prefix}${Date.now()}${rand}`.toUpperCase();
}
