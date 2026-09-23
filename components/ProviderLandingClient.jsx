"use client";
import { useEffect, useState } from "react";
import { captureAttribution, trackEvent } from "../lib/analytics";

// Reklamdan gelen kişi için: UTM'yi yakala, "iniş" olayını kaydet (tıklamasa bile
// reklamın en azından sayfaya getirdiğini görebilelim), CTA'ları soğuk bir sayfa
// yerine doğrudan kayıt/vitrin akışına, UTM'yi taşıyarak yönlendir.
export default function ProviderLandingClient({ audienceSlug }) {
  // Sunucu render'ıyla aynı başlangıç değeri (hidrasyon uyuşmazlığı olmasın diye);
  // gerçek query string'i mount sonrası effect'te ekliyoruz.
  const [ctaHref, setCtaHref] = useState("/?view=createListing");

  useEffect(() => {
    captureAttribution();
    trackEvent("provider_landing_view", { audience: audienceSlug });
    if (window.location.search) {
      setCtaHref(`/?view=createListing&${window.location.search.slice(1)}`);
    }
  }, [audienceSlug]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href={ctaHref}
        onClick={() => trackEvent("provider_landing_cta_click", { audience: audienceSlug, cta: "vitrin_ac" })}
        className="inline-block text-center text-sm font-bold px-7 py-3.5 rounded-full text-white"
        style={{ background: "#2563EB" }}
      >
        Ücretsiz Vitrinini Aç
      </a>
      <a
        href="/"
        onClick={() => trackEvent("provider_landing_cta_click", { audience: audienceSlug, cta: "ilanlara_bak" })}
        className="inline-block text-center text-sm font-bold px-7 py-3.5 rounded-full border"
        style={{ borderColor: "#D9D0BA", color: "#1B2B24" }}
      >
        Önce Açık İş İlanlarına Bak
      </a>
    </div>
  );
}
