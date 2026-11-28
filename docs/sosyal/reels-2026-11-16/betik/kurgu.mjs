// HeyGen avatar videosu + gerçek site ara sahnesi + altyazı katmanları + kapanış kartı → ffmpeg
// Kullanım: node kurgu.mjs <avatar.mp4> <plan-adı> <çıktı.mp4>   (çalışma klasörü: kayıt kareleri ve katman/ klasörü)
import { execFileSync } from 'node:child_process';
const [, , src, ad, out] = process.argv;
const MUZIK = 'C:/Users/Pc/Desktop/isinn_videolar/muzik/calm-ambient-dreamscape.mp3';
const PLAN = {
  p8: { son: 17.6, ara: 9.9, k: [['etiket', 0, 17.6], ['p8_kanca', 0.15, 2.4], ['p8_1', 2.5, 5.6], ['p8_2', 5.9, 9.75], ['p8_3', 10.0, 13.55], ['p8_4', 13.65, 15.45], ['p8_5', 15.55, 17.55]] },
  p10: { son: 16.4, ara: 7.6, k: [['etiket', 0, 16.4], ['p10_kanca', 0.2, 1.75], ['p10_1', 1.8, 4.95], ['p10_2', 5.05, 7.45], ['p10_3', 7.55, 11.7], ['p10_4', 12.0, 14.4], ['p10_5', 14.6, 16.35]] },
  p1: { son: 16.3, ara: 8.4, k: [['etiket', 0, 16.3], ['p1_kanca', 0.15, 2.95], ['p1_1', 3.1, 7.7], ['p1_2', 8.0, 12.45], ['p1_3', 12.6, 14.1], ['p1_4', 14.3, 16.1]] },
  p2: { son: 16.3, ara: 8.3, k: [['etiket', 0, 16.3], ['p2_kanca', 0.15, 3.6], ['p2_1', 3.8, 7.95], ['p2_2', 8.2, 11.55], ['p2_3', 11.75, 13.65], ['p2_4', 13.9, 16.1]] },
}[ad];
const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString());
const args = ['-y', '-loglevel', 'error', '-i', src, '-framerate', '30', '-i', 'ara/%04d.jpg', '-loop', '1', '-t', String(dur), '-i', 'katman/son.png'];
PLAN.k.forEach(([n]) => args.push('-loop', '1', '-t', String(dur), '-i', `katman/${n}.png`));
args.push('-i', MUZIK);
const F = 0.25; let f = `[0:v]fps=30,format=yuv420p[v0];`;
f += `[1:v]format=yuva420p,fade=t=in:st=0:d=0.3:alpha=1,fade=t=out:st=3.7:d=0.3:alpha=1,setpts=PTS+${PLAN.ara}/TB[ara];`;
f += `[v0][ara]overlay=0:0:eof_action=pass:enable='between(t,${PLAN.ara},${PLAN.ara + 4})'[v1];`;
let last = 'v1';
PLAN.k.forEach(([n, a, b], i) => {
  const idx = 3 + i;
  f += `[${idx}:v]format=rgba,fade=t=in:st=${a}:d=${F}:alpha=1,fade=t=out:st=${b - F}:d=${F}:alpha=1[k${i}];`;
  f += `[${last}][k${i}]overlay=0:0:enable='between(t,${a},${b})'[w${i}];`; last = `w${i}`;
});
f += `[2:v]format=rgba,fade=t=in:st=${PLAN.son}:d=0.45:alpha=1[son];[${last}][son]overlay=0:0:enable='gte(t,${PLAN.son})'[vout];`;
const mi = 3 + PLAN.k.length;
f += `[${mi}:a]atrim=0:${dur},afade=t=in:d=1,afade=t=out:st=${dur - 1.5}:d=1.5,volume=0.12[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[aout]`;
args.push('-filter_complex', f, '-map', '[vout]', '-map', '[aout]', '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out);
execFileSync('ffmpeg', args, { stdio: 'inherit' });
console.log('tamam', out, dur);
