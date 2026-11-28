import { launch } from './cdp.mjs'; import fs from 'node:fs';
const [,, html, out, T='15.5', only] = process.argv;
const c = await launch({port:9444}); 
await c.send('Emulation.setDeviceMetricsOverride',{width:1080,height:1920,deviceScaleFactor:1,mobile:false});
const base = 'file:///' + process.cwd().split(String.fromCharCode(92)).join('/') + '/';
await c.goto('file:///'+html+'?base='+encodeURIComponent(base), 3000);
console.log('preload', await c.eval('preload()'));
fs.mkdirSync(out,{recursive:true});
const N = Math.round(parseFloat(T)*30);
const list = only ? only.split(',').map(Number) : [...Array(N).keys()];
for (const i of list) { await c.eval(`render(${i/30})`);
  const r = await c.send('Page.captureScreenshot',{format:'jpeg',quality:94});
  fs.writeFileSync(`${out}/${String(i).padStart(4,'0')}.jpg`, Buffer.from(r.data,'base64')); }
await c.close(); console.log('done', list.length);
