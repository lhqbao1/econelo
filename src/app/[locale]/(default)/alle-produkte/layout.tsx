import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alle Produkte | Econelo",
  description:
    "Entdecken Sie alle verfügbaren Produkte von Econelo – Elektroroller, Elektromobile und Zubehör.",
  alternates: {
    canonical: "https://econelo.de/alle-produkte",
  },
  openGraph: {
    title: "Alle Produkte | Econelo",
    description:
      "Entdecken Sie alle verfügbaren Produkte von Econelo – Elektroroller, Elektromobile und Zubehör.",
    url: "https://econelo.de/alle-produkte",
    siteName: "Econelo",
    type: "website",
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  url: "https://econelo.de/alle-produkte",
  name: "Alle Produkte | Econelo",
  description:
    "Entdecken Sie alle verfügbaren Produkte von Econelo – Elektroroller, Elektromobile und Zubehör.",
  inLanguage: "de-DE",
  isPartOf: {
    "@id": "https://econelo.de/#website",
  },
};

export default function ShopAllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
