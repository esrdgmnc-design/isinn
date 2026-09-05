"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AuthView from "../components/AuthView";
import IsinnApp from "../components/IsinnApp";

export default function Page() {
  const [session, setSession] = useState(undefined); // undefined = still checking, null = signed out

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Keeps `session` in sync if the user logs in/out in another tab, or
    // their token refreshes/expires — without this, a stale session could
    // linger in this tab's state after a real sign-out elsewhere.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
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

  if (!session) {
    return <AuthView onAuthenticated={setSession} />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => supabase.auth.signOut()}
        className="fixed bottom-5 left-5 z-50 text-xs font-bold px-3.5 py-2 rounded-full text-white shadow-lg"
        style={{ background: "#0F1115" }}
      >
        Çıkış Yap
      </button>
      <IsinnApp session={session} />
    </div>
  );
}
