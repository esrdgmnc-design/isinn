import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "İşinn — Güvendiğin Ellere",
  description: "Yerinde ve uzaktan hizmet pazaryeri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
        {/* Ziyaretçi/sayfa görüntüleme sayısı hiç tutulmuyordu ("kaç kişi
            tıklamış siteyi" — cevap yoktu). Vercel Web Analytics çerezsiz
            çalışır (gizlilik politikasındaki "takip çerezi kullanmıyoruz"
            beyanını bozmaz) — Google Analytics kasıtlı olarak tercih
            edilmedi, bkz. bu tercihin gerekçesi konuşma geçmişinde. */}
        <Analytics />
      </body>
    </html>
  );
}
