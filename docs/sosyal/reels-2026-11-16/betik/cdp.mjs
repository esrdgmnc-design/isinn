import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export async function launch({ port = 9333, headless = true } = {}) {
  const dir = process.env.TEMP + '/cdp-prof-' + port;
  const args = [`--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run', '--hide-scrollbars', '--lang=tr-TR', '--window-size=500,1000'];
  if (headless) args.push('--headless=new');
  const proc = spawn(CHROME, [...args, 'about:blank'], { stdio: 'ignore' });
  let ws;
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/list`); const l = await r.json(); const pg = l.find(x => x.type === 'page'); if (pg) { ws = pg.webSocketDebuggerUrl; break; } } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  const sock = new WebSocket(ws);
  await new Promise(r => sock.onopen = r);
  let id = 0; const pend = new Map(); const listeners = [];
  sock.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); } else listeners.forEach(f => f(m)); };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); sock.send(JSON.stringify({ id: i, method, params })); });
  const c = {
    send, proc,
    on: f => listeners.push(f),
    sleep: ms => new Promise(r => setTimeout(r, ms)),
    async mobile(w = 430, h = 932, dpr = 2.5) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: true });
      await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', acceptLanguage: 'tr-TR' });
      await send('Emulation.setTouchEmulationEnabled', { enabled: true });
    },
    async goto(url, wait = 3000) { await send('Page.enable'); await send('Page.navigate', { url }); await c.sleep(wait); },
    async eval(expr) { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; },
    async shot(file, full = false) { const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full }); fs.writeFileSync(file, Buffer.from(r.data, 'base64')); },
    async close() { try { await send('Browser.close'); } catch {} proc.kill(); },
  };
  return c;
}
