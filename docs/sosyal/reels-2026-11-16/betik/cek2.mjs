import { launch } from './cdp.mjs'; import fs from 'node:fs';
const G=fs.readFileSync('gizle.js','utf8');
const c = await launch(); await c.mobile(390,844,2);
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
async function clip(dir){ fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir); let i=0; return async()=>{ await c.shot(`${dir}/${String(i++).padStart(4,'0')}.png`); }; }
async function scroll(f, from, to, frames){ for(let k=0;k<frames;k++){ const y=from+(to-from)*ease(k/(frames-1)); await c.eval(`scrollTo(0,${y})`); await c.sleep(40); await f(); } }
async function hold(f,n){ for(let k=0;k<n;k++) await f(); }
await c.goto('https://www.isinn.com.tr/', 5000);
await c.eval(`document.querySelector('input[placeholder*="Hangi hizmeti"]').focus()`);
await c.send('Input.insertText',{text:'özel ders'}); await c.sleep(300);
await c.eval(`[...document.querySelectorAll('button')].find(b=>/Keşfet/.test(b.innerText)).click()`); await c.sleep(4500);
await c.eval(G); await c.sleep(300); await c.eval(G);
const max = await c.eval('document.documentElement.scrollHeight - innerHeight'); console.log('max',max);
let f = await clip('b_sonuc');
await hold(f,12); await scroll(f,0,max,80); await hold(f,8);
await c.goto('https://www.isinn.com.tr/vitrin/321e87bd-3c3d-4ad5-8e49-617fd96773b2', 5500); await c.eval(G); console.log('gizlenen',await c.eval(fs.readFileSync('gizle_vitrin.js','utf8')));
f = await clip('c_vitrin');
await hold(f,10); await scroll(f,0,300,50); await hold(f,15);
const by = await c.eval(`(()=>{const b=[...document.querySelectorAll('a,button')].find(x=>/Mesaj Gönder/.test(x.innerText));return b.getBoundingClientRect().top+scrollY})()`);
const y2 = by - 520; await c.eval(`scrollTo(0,${y2})`); await c.sleep(400);
console.log('btn', by, 'onscreen', 520);
f = await clip('d_mesaj');
await hold(f,75);
await c.close();
