import ImageGallery from "@/components/gallery/gallery-image-layout";
import VideoGallery from "@/components/gallery/gallery-video-layout";
import Script from "next/script";

export const metadata = {
  title: "Bilder- & Videogalerie | Econelo Deutschland",
  description:
    "Entdecken Sie unsere Bilder- und Videogalerie von Econelo Elektrofahrzeugen. Hochwertige Fotos und Videos unserer modernen E-Mobilität – gemacht für Komfort, Sicherheit und nachhaltiges Fahren.",
  alternates: {
    canonical: "https://www.econelo.de/galerie",
  },
  openGraph: {
    title: "Econelo Galerie – Bilder & Videos unserer Elektrofahrzeuge",
    description:
      "Durchstöbern Sie unsere Galerie mit hochwertigen Fotos und Videos der Econelo Elektromobilität. Entdecken Sie Design, Komfort und Innovation.",
    url: "https://www.econelo.de/galerie",
    siteName: "Econelo",
    type: "website",
    locale: "de_DE",
  },
};

// -----------------------------------------

export default function GalleryPage() {
  // SCHEMA JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Econelo Bilder- & Videogalerie",
    description:
      "Galerie mit Bildern und Videos der Econelo Elektrofahrzeuge – hochwertige Eindrücke von Design, Komfort und moderner E-Mobilität.",
    url: "https://www.econelo.de/galerie",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "MediaObject",
          name: "Econelo Video Galerie",
          description: "Videos verschiedener Econelo Elektrofahrzeuge.",
          url: "https://www.econelo.de/galerie",
        },
        {
          "@type": "MediaObject",
          name: "Econelo Bildergalerie",
          description: "Bilder der Econelo Elektrofahrzeuge.",
          url: "https://www.econelo.de/galerie",
        },
      ],
    },
  };

  return (
    <>
      {/* 📌 Schema.org JSON-LD */}
      <Script
        id="econelo-gallery-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* 📌 Page layout */}
      <section className="md:pt-[120px] bg-white lg:px-64 px-4 py-10">
        <VideoGallery />
        <ImageGallery />
      </section>
    </>
  );
}
