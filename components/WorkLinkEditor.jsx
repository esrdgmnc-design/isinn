"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { trackEvent } from "../lib/analytics";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { normalizeWorkLink, WORK_LINK_PLATFORMS } from "../lib/workLink";

// Vitrin sahibinin "Çalışmalarımı gör" bağlantısını eklediği/kaldırdığı küçük, kendi kaydını yapan
// alan (vitrin detayında sahip modunda ve vitrin yayınlandıktan sonraki ekranda kullanılır).
// Migration (supabase/work_link_2026_10_05.sql) henüz çalışmadıysa kayıt hata verir; bu bileşen
// yalnızca kendi mesajını gösterir, vitrinin geri kalanı etkilenmez.
export default function WorkLinkEditor({ serviceId, initialUrl, userId, source, onSaved, bare = false }) {
  const { t } = useLanguage();
  const [value, setValue] = useState(initialUrl || "");
  const [platform, setPlatform] = useState("instagram");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const parsed = normalizeWorkLink(value, platform);
  const handleOnly = !!parsed.needsPlatform;

  const save = async () => {
    setError(""); setStatus("");
    const res = normalizeWorkLink(value, platform);
    if (!res.ok) { setError(t(`listingDetail.workLinkErr_${res.reason}`)); trackEvent("portfolio_link_invalid", { reason: res.reason }, userId || null); return; }
    setSaving(true);
    const { error: upErr } = await supabase.from("services").update({ work_link_url: res.url }).eq("id", serviceId);
    setSaving(false);
    if (upErr) { setError(t("listingDetail.workLinkErrSave")); return; }
    setValue(res.url || "");
    setStatus(res.url ? t("listingDetail.workLinkSaved") : t("listingDetail.workLinkRemoved"));
    if (res.url) trackEvent("portfolio_link_added", { platform: res.platform, source: source || "detail", handle_only: !!res.needsPlatform }, userId || null);
    onSaved?.(res.url);
  };

  return (
    <div className={bare ? "" : "mt-5 pt-4 border-t"} style={bare ? undefined : { borderColor: "#EAE3CE" }}>
      <label className="text-xs font-bold block mb-1" style={{ color: "#5C5744" }}>{t("listingDetail.workLinkEditLabel")}</label>
      <p className="text-[11px] mb-2" style={{ color: "#6B6550" }}>{t("listingDetail.workLinkEditHelp")}</p>
      <input
        type="text"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        maxLength={300}
        value={value}
        onChange={(e) => { setValue(e.target.value); setStatus(""); setError(""); }}
        placeholder={t("listingDetail.workLinkPlaceholder")}
        className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none"
        style={{ borderColor: "#D9D0BA", background: "#F8F4E9", color: "#1B2B24" }}
      />
      {handleOnly && (
        <div className="flex gap-2 mt-2" role="radiogroup" aria-label={t("listingDetail.workLinkPlatformLabel")}>
          {WORK_LINK_PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={platform === p}
              onClick={() => setPlatform(p)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border"
              style={platform === p ? { background: "#1B2B24", borderColor: "#1B2B24", color: "#FFFFFF" } : { background: "#FFFFFF", borderColor: "#D9D0BA", color: "#1B2B24" }}
            >
              {t(`listingDetail.workLinkPlatform_${p}`)}
            </button>
          ))}
        </div>
      )}
      {parsed.ok && parsed.url && (
        <p className="text-[11px] mt-1.5" style={{ color: "#6B6550" }}>{t("listingDetail.workLinkPreview", { url: parsed.url.replace(/^https:\/\//, "") })}</p>
      )}
      <p className="text-[10px] mt-1.5" style={{ color: "#8A8470" }}>{t("listingDetail.workLinkVisibleNote")}</p>
      {error && <p className="text-[11px] mt-1.5" style={{ color: "#D14D4D" }}>{error}</p>}
      <div className="flex items-center gap-2 mt-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-1.5"
          style={{ borderColor: "#D9D0BA", color: "#1B2B24", background: "#FFFFFF" }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : null}
          {t("listingDetail.workLinkSave")}
        </button>
        {status && <span className="text-[11px] flex items-center gap-1" style={{ color: "#2F7D4F" }}><Check size={12} />{status}</span>}
      </div>
    </div>
  );
}
