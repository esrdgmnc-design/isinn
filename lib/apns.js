// APNs (Apple Push) gönderimi: Node http2 + ES256 JWT, ek bağımlılık yok.
// Gizli bilgiler yalnızca Vercel ortam değişkenlerinde: APNS_KEY_ID, APNS_TEAM_ID, APNS_BUNDLE_ID, APNS_PRIVATE_KEY_B64.
import http2 from "node:http2";
import crypto from "node:crypto";

let cachedJwt = null; // { token, at }

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function apnsConfigured() {
  return !!(process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID && process.env.APNS_BUNDLE_ID && process.env.APNS_PRIVATE_KEY_B64);
}

// Apple, sağlayıcı jetonunu 20 dakikadan sık yenilemeyi reddeder; ~50 dakika önbellekte tutuyoruz.
function providerToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedJwt && now - cachedJwt.at < 50 * 60) return cachedJwt.token;
  const header = b64url(JSON.stringify({ alg: "ES256", kid: process.env.APNS_KEY_ID }));
  const claims = b64url(JSON.stringify({ iss: process.env.APNS_TEAM_ID, iat: now }));
  const key = Buffer.from(process.env.APNS_PRIVATE_KEY_B64, "base64").toString("utf8");
  const sig = crypto.sign("sha256", Buffer.from(`${header}.${claims}`), { key, dsaEncoding: "ieee-p1363" });
  const token = `${header}.${claims}.${b64url(sig)}`;
  cachedJwt = { token, at: now };
  return token;
}

function sendOnce(host, deviceToken, payload, collapseId) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    const client = http2.connect(`https://${host}`);
    client.on("error", () => done({ status: 0, reason: "connect" }));
    const headers = {
      ":method": "POST",
      ":path": `/3/device/${deviceToken}`,
      authorization: `bearer ${providerToken()}`,
      "apns-topic": process.env.APNS_BUNDLE_ID,
      "apns-push-type": "alert",
      "apns-priority": "10",
    };
    if (collapseId) headers["apns-collapse-id"] = String(collapseId).slice(0, 64);
    const req = client.request(headers);
    let status = 0;
    let body = "";
    req.on("response", (h) => { status = h[":status"]; });
    req.setEncoding("utf8");
    req.on("data", (c) => { body += c; });
    req.on("end", () => {
      client.close();
      let reason = "";
      try { reason = JSON.parse(body).reason || ""; } catch {}
      done({ status, reason });
    });
    req.on("error", () => { client.close(); done({ status: 0, reason: "request" }); });
    req.setTimeout(10000, () => { req.close(); client.close(); done({ status: 0, reason: "timeout" }); });
    req.end(JSON.stringify(payload));
  });
}

// Önce production, "BadDeviceToken" gelirse sandbox (Xcode'dan kurulan geliştirme sürümü) denenir.
export async function sendApns(deviceToken, { title, body, data = {}, collapseId }) {
  const payload = { aps: { alert: { title, body }, sound: "default" }, ...data };
  let r = await sendOnce("api.push.apple.com", deviceToken, payload, collapseId);
  if (r.status === 400 && r.reason === "BadDeviceToken") r = await sendOnce("api.sandbox.push.apple.com", deviceToken, payload, collapseId);
  return r;
}
