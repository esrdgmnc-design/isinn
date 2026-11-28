#!/bin/bash
# İmza video: kare/{format}_{1..5}.png -> cikti/{format}_ana.mp4 (≈14 sn), _kapanis.mp4 (3 sn), _dongu.mp4 (döngü)
set -e
cd "$(dirname "$0")"
mkdir -p cikti
MUZIK="/c/Users/Pc/Desktop/isinn_videolar/muzik/calm-ambient-dreamscape.mp3"
for spec in dikey:1080:1920 kare:1080:1350 yatay:1920:1080; do
  IFS=: read F W H <<< "$spec"
  Z="zoompan=z='min(zoom+0.00035,1.03)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=${W}x${H}:fps=30,setsar=1,format=yuv420p"
  # Ana video: 4 sahne x 3,4 sn + kapanış 4 sn, 0,8 sn çapraz geçiş
  ffmpeg -y -loglevel error \
    -loop 1 -t 3.4 -i kare/${F}_1.png -loop 1 -t 3.4 -i kare/${F}_2.png -loop 1 -t 3.4 -i kare/${F}_3.png \
    -loop 1 -t 3.4 -i kare/${F}_4.png -loop 1 -t 4.0 -i kare/${F}_5.png -i "$MUZIK" \
    -filter_complex "[0]$Z[a];[1]$Z[b];[2]$Z[c];[3]$Z[d];[4]scale=${W}:${H},setsar=1,fps=30,format=yuv420p[e];\
[a][b]xfade=transition=fade:duration=0.8:offset=2.6[ab];[ab][c]xfade=transition=fade:duration=0.8:offset=5.2[ac];\
[ac][d]xfade=transition=fade:duration=0.8:offset=7.8[ad];[ad][e]xfade=transition=fade:duration=0.8:offset=10.4[v];\
[5:a]atrim=0:14.4,afade=t=in:d=1.2,afade=t=out:st=12.4:d=2,volume=0.8[m]" \
    -map "[v]" -map "[m]" -c:v libx264 -crf 19 -preset medium -c:a aac -b:a 160k -shortest -movflags +faststart cikti/${F}_ana.mp4
  # Kapanış kartı: 3 sn, yumuşak giriş
  ffmpeg -y -loglevel error -loop 1 -t 3 -i kare/${F}_5.png -i "$MUZIK" \
    -filter_complex "[0]scale=${W}:${H},setsar=1,fps=30,format=yuv420p,fade=t=in:d=0.6[v];[1:a]atrim=20:23,asetpts=PTS-STARTPTS,afade=t=in:d=0.5,afade=t=out:st=2:d=1[m]" \
    -map "[v]" -map "[m]" -c:v libx264 -crf 19 -c:a aac -shortest -movflags +faststart cikti/${F}_kapanis.mp4
  # Döngü: 1-2-3-4 ve tekrar 1'e geçiş (yakınlaşma yok, ilk/son kare aynı), sessiz
  ffmpeg -y -loglevel error \
    -loop 1 -t 3 -i kare/${F}_1.png -loop 1 -t 3 -i kare/${F}_2.png -loop 1 -t 3 -i kare/${F}_3.png -loop 1 -t 3 -i kare/${F}_4.png -loop 1 -t 1 -i kare/${F}_1.png \
    -filter_complex "[0]fps=30,format=yuv420p[a];[1]fps=30,format=yuv420p[b];[2]fps=30,format=yuv420p[c];[3]fps=30,format=yuv420p[d];[4]fps=30,format=yuv420p[e];\
[a][b]xfade=transition=fade:duration=0.8:offset=2.2[ab];[ab][c]xfade=transition=fade:duration=0.8:offset=4.4[ac];[ac][d]xfade=transition=fade:duration=0.8:offset=6.6[ad];[ad][e]xfade=transition=fade:duration=0.8:offset=8.8[v]" \
    -map "[v]" -c:v libx264 -crf 19 -movflags +faststart cikti/${F}_dongu.mp4
  echo "$F tamam"
done
