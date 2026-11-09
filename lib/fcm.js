// Android push (Firebase Cloud Messaging HTTP v1). 2026-11-09.
// Gizli bilgi yalnızca Vercel ortam değişkeninde: FCM_SERVICE_ACCOUNT_B64 = Firebase hizmet hesabı JSON dosyasının base64'ü.
// Erişim jetonu (OAuth2) ~1 saat geçerli; sunucu örneği yaşadıkça bellekte tutulur.
import crypto from "node:crypto";

let cachedAccount = null;
let cachedToken = null; // { value, exp }

function account() {
  if (cachedAccount) return cachedAccount;
  const b64 = process.env.FCM_SERVICE_ACCOUNT_B64;
  if (!b64) return null;
  try {
    const a = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    if (a.client_email && a.private_key && a.project_id) cachedAccount = a;
  } catch {}
  return cachedAccount;
}

export function fcmConfigured() {
  return !!account();
}

const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.value;
  const a = account();
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({
    iss: a.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const signature = crypto.createSign("RSA-SHA256").update(`${header}.${claims}`).sign(a.private_key);
  const jwt = `${header}.${claims}.${b64url(signature)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("FCM erişim jetonu alınamadı");
  cachedToken = { value: data.access_token, exp: now + (data.expires_in || 3600) };
  return cachedToken.value;
}

// Dönen { status, reason }: 200 = gönderildi; "UNREGISTERED" / "INVALID_ARGUMENT" = jeton geçersiz, silinmeli.
export async function sendFcm(deviceToken, { title, body, collapseId, data = {} }) {
  try {
    const a = account();
    const token = await accessToken();
    const strData = Object.fromEntries(Object.entries(data).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${a.project_id}/messages:send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        message: {
          token: deviceToken,
          notification: { title, body },
          data: strData,
          android: { priority: "HIGH", collapse_key: collapseId ? String(collapseId).slice(0, 64) : undefined, notification: { sound: "default" } },
        },
      }),
    });
    if (res.ok) return { status: 200 };
    const err = await res.json().catch(() => ({}));
    const reason = err?.error?.details?.find?.((d) => d.errorCode)?.errorCode || err?.error?.status || "ERROR";
    return { status: res.status, reason };
  } catch (e) {
    return { status: 0, reason: e?.message || "ERROR" };
  }
}
