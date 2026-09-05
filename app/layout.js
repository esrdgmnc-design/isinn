import "./globals.css";

export const metadata = {
  title: "İşinn — Güvendiğin Ellere",
  description: "Yerinde ve uzaktan hizmet pazaryeri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
