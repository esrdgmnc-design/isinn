import HomeClient from "../components/HomeClient";
import { faqJsonLd } from "../lib/faqJsonLd";

// Ana sayfa artık sunucu bileşeni: kanonik adres "/" (parametreli ?vitrin=… gibi URL'ler
// ayrı sayfa sayılmasın) ve SSS şeması yalnızca burada.
export const metadata = {
  title: "İşinn — Güvenilir Usta, Temizlikçi, Özel Ders Bul",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeClient />
    </>
  );
}
