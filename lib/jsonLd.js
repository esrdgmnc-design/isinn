// JSON-LD'yi <script> içine basarken kullan. JSON.stringify "<" karakterini kaçırmaz: bir
// vitrin açıklamasındaki "</script><script>..." sayfada kod çalıştırabilirdi (herkese açık,
// önbelleğe alınan sayfa). "<" karakterinin JSON'daki 6 karakterlik kaçış karşılığı aynı anlama
// gelir ve HTML ayrıştırıcısını kandıramaz. Satır/paragraf ayırıcıları da kaçışlanır.
const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
const BS = String.fromCharCode(92); // ters eğik çizgi

export function jsonLdString(value) {
  return JSON.stringify(value)
    .split("<").join(BS + "u003c")
    .split(LS).join(BS + "u2028")
    .split(PS).join(BS + "u2029");
}
