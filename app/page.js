"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AuthView from "../components/AuthView";
import IsinnApp from "../components/IsinnApp";

export default function Page() {
  const [session, setSession] = useState(undefined); // undefined = still checking, null = signed out
  // Fiverr modeli: gezinme (ana sayfa, vitrinler, ilanlar, haritada gör,
  // profil görüntüleme) session'sız da açık — giriş ekranı sadece bu bayrak
  // true olunca (Header'daki "Giriş Yap" butonu veya kilitli bir eyleme
  // dokununca, bkz. IsinnApp'teki handleNav/onRequireAuth) üstte açılıyor.
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Keeps `session` in sync if the user logs in/out in another tab, or
    // their token refreshes/expires — without this, a stale session could
    // linger in this tab's state after a real sign-out elsewhere.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) setShowAuth(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFFFF" }}>
        <p className="text-sm" style={{ color: "#6B7280" }}>Yükleniyor...</p>
      </div>
    );
  }

  if (!session && showAuth) {
    return <AuthView onAuthenticated={(s) => { setSession(s); setShowAuth(false); }} onCancel={() => setShowAuth(false)} />;
  }

  return (
    <div className="relative">
      <IsinnApp session={session} onRequireAuth={() => setShowAuth(true)} />
    </div>
  );
}
