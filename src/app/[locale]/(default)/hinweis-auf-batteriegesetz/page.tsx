import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const pageTitle = "Hinweis auf Batteriegesetz";
const pageDescription =
  "Wichtige Hinweise zur Batterieentsorgung, Rückgabepflicht und Kennzeichnung nach Batteriegesetz.";
const pageUrl = "https://econelo.de/hinweis-auf-batteriegesetz";
const pageImage = "https://econelo.de/battery-law-banner.jpg";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `${pageTitle} | Econelo`,
    description: pageDescription,
    url: pageUrl,
    siteName: "Econelo",
    locale: "de_DE",
    type: "article",
    images: [
      {
        url: pageImage,
        width: 1200,
        height: 630,
        alt: "Batterieentsorgung und Kennzeichnung nach Batteriegesetz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Econelo`,
    description: pageDescription,
    images: [pageImage],
  },
};

const batteryLawSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": pageUrl,
      name: `${pageTitle} | Econelo`,
      url: pageUrl,
      description: pageDescription,
      inLanguage: "de-DE",
      isPartOf: {
        "@id": "https://econelo.de/#website",
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: pageImage,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startseite",
          item: "https://econelo.de/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageTitle,
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function HinweisAufBatteriegesetzPage() {
  return (
    <div className="min-h-screen md:pt-[108px] pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(batteryLawSchema) }}
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 pt-6">
        <section className="relative overflow-hidden rounded-2xl min-h-[300px] md:min-h-[430px]">
          <Image
            src="/battery-law-banner.jpg"
            alt="Batterieentsorgung und Recycling"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <h1 className="text-white text-3xl md:text-6xl font-medium tracking-tight">
              Hinweis auf Batteriegesetz
            </h1>
          </div>
        </section>

        <p className="mt-2 text-xs text-muted-foreground">
          Bildnachweis:{" "}
          <Link
            href="https://commons.wikimedia.org/wiki/File:Battery_recycling.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Wikimedia Commons (Santeri Viinamäki, CC BY-SA 4.0)
          </Link>
        </p>

        <article className="mx-auto w-full max-w-5xl mt-8 md:mt-10 space-y-6">
          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Hinweise zur Batterieentsorgung
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Im Zusammenhang mit dem Vertrieb von Batterien oder mit der
              Lieferung von Geräten, die Batterien enthalten, sind wir
              verpflichtet, Sie auf folgendes hinzuweisen:
            </p>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Sie sind zur Rückgabe gebrauchter Batterien als Endnutzer
              gesetzlich verpflichtet. Sie können Altbatterien, die wir als
              Neubatterien im Sortiment führen oder geführt haben, unentgeltlich
              an unserem Versandlager (Versandadresse) zurückgeben. Auch
              ausgewählte kommunale Sammelstellen (Qualifizierte
              Sammelstellen) nehmen größere Bleigel- und Lithium-Altbatterien
              kostenfrei zurück. Informieren Sie sich am Besten im Vorfeld der
              Rückgabe, ob Ihr Wertstoffhof diese Batteriesorten kostenfrei
              entgegennimmt. Eine Entsorgung der Batterien über den Hausmüll
              ist untersagt.
            </p>
          </section>

          <section className="rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-semibold text-primary">
              Gesetzliche Kennzeichnung auf Batterien
            </h3>
            <p className="mt-3 text-base leading-8 text-foreground/90">
              Die auf den Batterien abgebildeten Symbole haben folgende
              Bedeutung: Das Symbol der durchgekreuzten Mülltonne bedeutet,
              dass die Batterie nicht in den Hausmüll gegeben werden darf.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-white p-5 md:p-6">
              <p className="text-2xl font-bold text-primary">Pb</p>
              <p className="mt-2 text-sm leading-7 text-foreground/85">
                Batterie enthält mehr als 0,004 Masseprozent Blei.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white p-5 md:p-6">
              <p className="text-2xl font-bold text-primary">Cd</p>
              <p className="mt-2 text-sm leading-7 text-foreground/85">
                Batterie enthält mehr als 0,002 Masseprozent Cadmium.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white p-5 md:p-6">
              <p className="text-2xl font-bold text-primary">Hg</p>
              <p className="mt-2 text-sm leading-7 text-foreground/85">
                Batterie enthält mehr als 0,0005 Masseprozent Quecksilber.
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
