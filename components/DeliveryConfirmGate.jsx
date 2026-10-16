"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X, BellRing } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { nextPending } from "../lib/deliveryGate";
import { trackEvent } from "../lib/analytics";

// İki taraflı iş onayı: karşı taraf işi onayladıysa ve ben henüz yanıt vermediysem fark edilir bir
// uyarı görürüm. ZORLAYICI DEĞİL (kurucu kararı, 2026-10-16): pencere "Sonra karar veririm" ile
// kapatılabilir; kapatınca ekranın altında, yanıtlanana kadar duran renkli bir bildirim kartı kalır.
// Aynı iş için pencere oturum başına bir kez kendiliğinden açılır.
const SELECT = "id, title, state, client_id, client_delivered_at, provider_delivered_at, services!inner(provider_id)";
const SEEN_KEY = "isinn_delivery_gate_seen";

function readSeen() {
  try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]"); } catch { return []; }
}
function markSeen(id) {
  try { sessionStorage.setItem(SEEN_KEY, JSON.stringify([...new Set([...readSeen(), id])])); } catch {}
}

export default function DeliveryConfirmGate({ userId }) {
  const { t } = useLanguage();
  const [pending, setPending] = useState(null); // { job, role }
  const [open, setOpen] = useState(false); // pencere mi açık, yoksa yalnız alt kart mı
  const [step, setStep] = useState("ask"); // "ask" | "sure"
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false);
  busyRef.current = busy;

  const refresh = useCallback(async () => {
    if (!userId || busyRef.current) return;
    // Müşteri olduğum işler + hizmet veren olduğum işler (iki ayrı sorgu; RLS yalnız tarafları gösterir)
    const [asClient, asProvider] = await Promise.all([
      supabase.from("jobs").select(SELECT).eq("state", "delivered").eq("client_id", userId).limit(30),
      supabase.from("jobs").select(SELECT).eq("state", "delivered").eq("services.provider_id", userId).limit(30),
    ]);
    const jobs = [...(asClient.data || []), ...(asProvider.data || [])];
    const next = nextPending(jobs, userId);
    setPending((cur) => {
      if (next?.job.id === cur?.job.id && next?.role === cur?.role) return cur;
      setStep("ask"); setError("");
      // Bu oturumda bu iş için pencere daha önce açıldıysa yalnız alt kart görünür
      setOpen(!!next && !readSeen().includes(next.job.id));
      if (next) markSeen(next.job.id);
      return next;
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) { setPending(null); setOpen(false); return undefined; }
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const timer = setInterval(refresh, 120000);
    return () => { window.removeEventListener("focus", onFocus); document.removeEventListener("visibilitychange", onFocus); clearInterval(timer); };
  }, [userId, refresh]);

  if (!pending) return null;
  const { job, role } = pending;
  const title = job.title || t("deliveryGate.untitled");

  const run = async (fn, event) => {
    setBusy(true); setError("");
    const { error: e } = await supabase.rpc(fn, { p_job_id: job.id });
    setBusy(false);
    if (e) {
      setError(e.code === "PGRST202" ? t("deliveryGate.errNotReady") : t("deliveryGate.errFailed", { message: e.message || "" }));
      return;
    }
    trackEvent(event, { role }, userId);
    setPending(null); setOpen(false); setStep("ask");
    refresh();
  };

  const later = () => { setOpen(false); setStep("ask"); setError(""); };

  if (!open) {
    // Kalıcı ama engellemeyen alt kart
    return (
      <div className="fixed left-3 right-3 bottom-3 sm:left-auto sm:right-4 sm:bottom-4 sm:w-96 z-[90] rounded-2xl shadow-xl p-3.5 flex items-start gap-3" style={{ background: "#FFF7E6", border: "1px solid #F0C97A" }} role="status">
        <BellRing size={18} className="shrink-0 mt-0.5" style={{ color: "#B45309" }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "#7C2D12" }}>{t(role === "provider" ? "deliveryGate.providerTitle" : "deliveryGate.clientTitle")}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "#92400E" }}>{title}</p>
          <button onClick={() => { setStep("ask"); setError(""); setOpen(true); }} className="mt-2 text-xs font-bold px-3.5 py-1.5 rounded-full text-white" style={{ background: "#B45309" }}>{t("deliveryGate.bannerOpen")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(15,17,21,0.6)" }} role="dialog" aria-modal="true" aria-labelledby="delivery-gate-title" aria-describedby="delivery-gate-body">
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[92dvh] overflow-y-auto relative" style={{ background: "#FFFFFF" }}>
        <button onClick={later} aria-label={t("deliveryGate.later")} className="absolute top-3 right-3 p-1.5 rounded-full" style={{ color: "#6B7280", background: "#F3F4F6" }}><X size={16} /></button>
        {step === "ask" ? (
          <>
            <h2 id="delivery-gate-title" className="text-lg font-black mb-2 pr-8" style={{ color: "#0F1115" }}>{t(role === "provider" ? "deliveryGate.providerTitle" : "deliveryGate.clientTitle")}</h2>
            <p id="delivery-gate-body" className="text-sm leading-relaxed mb-1" style={{ color: "#374151" }}>{t(role === "provider" ? "deliveryGate.providerBody" : "deliveryGate.clientBody", { title })}</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7280" }}>{t("deliveryGate.honestNote")}</p>
            {error && <p role="alert" className="text-xs mb-3" style={{ color: "#9C4A3C" }}>{error}</p>}
            <div className="flex flex-col gap-2">
              <button onClick={() => run("confirm_job_delivery", "delivery_gate_confirmed")} disabled={busy} className="w-full py-3 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2" style={{ background: "#2563EB", opacity: busy ? 0.7 : 1 }}>
                {busy && <Loader2 size={14} className="animate-spin" />}
                {t(role === "provider" ? "deliveryGate.confirmProvider" : "deliveryGate.confirmClient")}
              </button>
              <button onClick={() => { setError(""); setStep("sure"); }} disabled={busy} className="w-full py-3 rounded-full text-sm font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>
                {t(role === "provider" ? "deliveryGate.disputeProvider" : "deliveryGate.disputeClient")}
              </button>
              <button onClick={later} className="w-full py-2 text-xs font-semibold underline" style={{ color: "#6B7280" }}>{t("deliveryGate.later")}</button>
            </div>
          </>
        ) : (
          <>
            <h2 id="delivery-gate-title" className="text-lg font-black mb-2 pr-8" style={{ color: "#0F1115" }}>{t("deliveryGate.sureTitle")}</h2>
            <p id="delivery-gate-body" className="text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>{t("deliveryGate.sureBody", { title })}</p>
            {error && <p role="alert" className="text-xs mb-3" style={{ color: "#9C4A3C" }}>{error}</p>}
            <div className="flex flex-col gap-2">
              <button onClick={() => run("dispute_job_delivery", "delivery_gate_disputed")} disabled={busy} className="w-full py-3 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2" style={{ background: "#9C4A3C", opacity: busy ? 0.7 : 1 }}>
                {busy && <Loader2 size={14} className="animate-spin" />}
                {t("deliveryGate.sureYes")}
              </button>
              <button onClick={() => { setError(""); setStep("ask"); }} disabled={busy} className="w-full py-3 rounded-full text-sm font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>{t("deliveryGate.sureBack")}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
