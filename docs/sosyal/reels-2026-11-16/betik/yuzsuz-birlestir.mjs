// Yüzsüz video: render kareleri + HeyGen'de daha önce üretilmiş ses (yeni kredi yok) + kısık müzik
// Kullanım: node yuzsuz-birlestir.mjs <kare-klasörü> <ses-kaynağı.mp4> <çıktı.mp4>
import { execFileSync } from 'node:child_process';
const [, , kare, ses, out] = process.argv;
const MUZIK = 'C:/Users/Pc/Desktop/isinn_videolar/muzik/calm-ambient-dreamscape.mp3';
const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', ses]).toString());
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', `${kare}/%04d.jpg`, '-i', ses, '-i', MUZIK,
  '-filter_complex', `[2:a]atrim=0:${dur},afade=t=in:d=1,afade=t=out:st=${dur - 1.5}:d=1.5,volume=0.12[m];[1:a][m]amix=inputs=2:duration=first:normalize=0[a]`,
  '-map', '0:v', '-map', '[a]', '-t', String(dur), '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log('tamam', out, dur);
