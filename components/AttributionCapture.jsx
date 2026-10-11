"use client";
import { useEffect } from "react";
import { captureAttribution } from "../lib/analytics";

// Her sayfada (vitrin, rehber, kategori vb. sunucu sayfaları dahil) ilk ziyaretin kaynağını (utm_*, ref, yönlendiren site)
// ve "/?internal=1" iç cihaz bayrağını yakalar. captureAttribution ilk kaynağı ezmez, tekrar çağrılması zararsızdır.
export default function AttributionCapture() {
  useEffect(() => { captureAttribution(); }, []);
  return null;
}
