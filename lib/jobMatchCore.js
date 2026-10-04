// İş ilanı eşleştirmesinde modelin ham cevabını doğrulayıp en iyi N adayı seçer.
// Saf fonksiyon (app/api/job-match/route.js kullanır, node ile de test edilebilir).
// idx: adayın 1 tabanlı sıra numarası; yalnızca aday sayısı içindeki, tekrarsız,
// 0-100 arası tam sayı puanlı girdiler kabul edilir (model uydurma ad/numara
// üretirse elenir).
export function pickTopMatches(parsed, candidateCount, count = 3) {
  const seen = new Set();
  return (Array.isArray(parsed) ? parsed : [])
    .map((m) => ({ idx: Number.isInteger(m?.idx) ? m.idx : -1, score: Math.round(Number(m?.matchScore)) }))
    .filter((m) => m.idx >= 1 && m.idx <= candidateCount && Number.isFinite(m.score) && m.score >= 0 && m.score <= 100 && !seen.has(m.idx) && seen.add(m.idx))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
