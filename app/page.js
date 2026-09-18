"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AuthView from "../components/AuthView";
import IsinnApp from "../components/IsinnApp";
import ErrorBoundary from "../components/ErrorBoundary";
import { LanguageProvider } from "../lib/i18n/LanguageContext";

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

  // Eskiden session === undefined (oturum kontrolü sürerken) burada boş bir
  // "Yükleniyor..." ekranı dönüyordu — Google'ın ve gerçek kullanıcının ilk
  // gördüğü şey içerik değil, boş bir bekleme metniydi (bkz. SEO stratejisi
  // dokümanı, "ana sayfa render riski"). IsinnApp zaten session'ı her yerde
  // optional chaining ile okuyor (userId = session?.user?.id), yani undefined
  // ile null arasında fark gözetmiyor — session henüz çözülmemişken bile
  // güvenle "anonim" gibi render edilebilir, birkaç yüz ms sonra gerçek
  // session gelince kendiliğinden güncellenir.
  if (!session && showAuth) {
    return (
      <LanguageProvider>
        <ErrorBoundary>
          <AuthView onAuthenticated={(s) => { setSession(s); setShowAuth(false); }} onCancel={() => setShowAuth(false)} />
        </ErrorBoundary>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <div className="relative">
          <IsinnApp session={session} onRequireAuth={() => setShowAuth(true)} />
        </div>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
