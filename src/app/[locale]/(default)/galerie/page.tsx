import ImageGallery from "@/components/gallery/gallery-image-layout";
import VideoGallery from "@/components/gallery/gallery-video-layout";
import Script from "next/script";

export const metadata = {
  title: "Galerie | Prestige Home Deutschland",
  description:
    "Entdecken Sie die Prestige Home Galerie mit hochwertigen Bildern und Videos moderner Wohnräume, Einrichtungsideen und exklusiver Interior-Inspirationen.",
  alternates: {
    canonical: "https://www.econelo.de/galerie",
  },
  openGraph: {
    title: "Prestige Home Galerie – Bilder & Videos exklusiver Wohnideen",
    description:
      "Durchstöbern Sie unsere Galerie mit hochwertigen Fotos und Videos. Inspirationen für modernes Wohnen, stilvolle Einrichtung und exklusive Interior-Konzepte.",
    url: "https://www.econelo.de/galerie",
    siteName: "Prestige Home",
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
