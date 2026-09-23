"use client";
import { useEffect, useState } from "react";
import { captureAttribution, trackEvent } from "../lib/analytics";

// Müşteri kazanım reklamı iniş sayfası — CTA doğrudan ilan verme (?view=post)
// akışına gider, UTM'yi taşır. bkz. ProviderLandingClient (sağlayıcı tarafının
// aynısı) — burada hedef akış farklı.
export default function CustomerLandingClient({ audienceSlug }) {
  const [ctaHref, setCtaHref] = useState("/?view=post");

  useEffect(() => {
    captureAttribution();
    trackEvent("customer_landing_view", { audience: audienceSlug });
    if (window.location.search) {
      setCtaHref(`/?view=post&${window.location.search.slice(1)}`);
    }
  }, [audienceSlug]);

  return (
    <a
      href={ctaHref}
      onClick={() => trackEvent("customer_landing_cta_click", { audience: audienceSlug, cta: "ilan_ver" })}
      className="inline-block text-center text-sm font-bold px-8 py-3.5 rounded-full text-white"
      style={{ background: "#2563EB" }}
    >
      Ücretsiz İlan Verin
    </a>
  );
}
