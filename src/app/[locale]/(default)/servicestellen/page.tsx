import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Route,
  Wrench,
} from "lucide-react";

const pageTitle = "Servicestellen für Elektrofahrzeuge";
const pageDescription =
  "Finden Sie Econelo Servicestellen für Reparatur, Wartung und Service rund um Elektromobile, Elektro Trikes und Elektroroller.";
const pageUrl = "https://www.econelo.de/servicestellen";
const pageImage = "https://www.econelo.de/econelo-banner1.webp";

const servicePoints = [
  {
    id: "service-point-nord",
    name: "Servicestelle Nord",
    badge: "Platzhalter",
    address: {
      street: "Musterstraße 12",
      postalCode: "10115",
      city: "Berlin",
    },
    phone: "+49 30 0000000",
    email: "service-nord@example.com",
    hours: "Mo-Fr 09:00-17:00 Uhr",
    services: ["Reparaturannahme", "Fehlerdiagnose", "Ersatzteilservice"],
    position: "left-[26%] top-[36%]",
  },
  {
    id: "service-point-sued",
    name: "Servicestelle Süd",
    badge: "Platzhalter",
    address: {
      street: "Beispielweg 8",
      postalCode: "80331",
      city: "München",
    },
    phone: "+49 89 0000000",
    email: "service-sued@example.com",
    hours: "Mo-Fr 09:00-17:00 Uhr",
    services: ["Wartung", "Akkuservice", "Probefahrt-Check"],
    position: "left-[65%] top-[62%]",
  },
];

export const metadata: Metadata = {
  title: `${pageTitle} | Econelo`,
  description: pageDescription,
  keywords: [
    "Econelo Servicestellen",
    "Service Point Elektrofahrzeug",
    "Elektromobil Reparatur",
    "Elektroroller Werkstatt",
    "Elektro Trike Service",
    "Econelo Reparaturservice",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `${pageTitle} | Econelo`,
    description: pageDescription,
    url: pageUrl,
    siteName: "Econelo",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: pageImage,
        width: 1200,
        height: 630,
        alt: "Econelo Servicestellen für Elektrofahrzeuge",
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

const servicePointSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: `${pageTitle} | Econelo`,
      description: pageDescription,
      inLanguage: "de-DE",
      isPartOf: {
        "@id": "https://www.econelo.de/#website",
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
          item: "https://www.econelo.de/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Servicestellen",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#service-points`,
      name: "Econelo Servicestellen",
      itemListElement: servicePoints.map((point, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "AutoRepair",
          name: point.name,
          url: `${pageUrl}#${point.id}`,
          telephone: point.phone,
          email: point.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: point.address.street,
            postalCode: point.address.postalCode,
            addressLocality: point.address.city,
            addressCountry: "DE",
          },
        },
      })),
    },
  ],
};

export default function ServicePointsPage() {
  return (
    <div className="min-h-screen pb-16 md:pt-[100px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicePointSchema),
        }}
      />

      <section className="relative min-h-[360px] w-full overflow-hidden md:min-h-[430px]">
        <Image
          src="/econelo-banner1.webp"
          alt="Econelo Elektrofahrzeuge"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <div className="max-w-4xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
              Reparatur & Wartung
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
              Econelo Servicestellen
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
              Ansprechpartner für Wartung, Diagnose und Reparatur Ihrer
              Elektrofahrzeuge.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3 text-sm font-semibold">
              <Link
                href="#service-map"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-white transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:outline-none"
              >
                Karte ansehen
                <ChevronRight className="size-4" />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-black transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:outline-none"
              >
                Anfrage senden
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="service-map"
        className="mx-auto mt-10 w-full max-w-[1400px] px-4 md:mt-14 md:px-6"
      >
        <div className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              <MapPin className="size-4" />
              Servicestellen Finder
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
              Zwei Servicestellen als Platzhalter
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-muted-foreground">
            Sobald die finalen Adressen vorliegen, können die Daten direkt in
            diesen Einträgen ersetzt werden.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            {servicePoints.map((point, index) => (
              <article
                id={point.id}
                key={point.id}
                className="rounded-xl border border-border bg-white p-5 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.75)] transition-colors hover:border-primary/45"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                      0{index + 1}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">
                      {point.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    {point.badge}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-foreground/80">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <p>{point.address.street}</p>
                      <p>
                        {point.address.postalCode} {point.address.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-primary" />
                    <span>{point.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 shrink-0 text-primary" />
                    <span>{point.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="size-4 shrink-0 text-primary" />
                    <span>{point.hours}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {point.services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-xs font-semibold text-foreground/75"
                    >
                      <CheckCircle2 className="size-3.5 text-primary" />
                      {service}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-border bg-[#f6f8f3] shadow-[0_30px_80px_-45px_rgba(0,0,0,0.85)] md:min-h-[620px]">
            <div className="absolute inset-0 opacity-[0.42] [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:46px_46px]" />
            <div className="absolute -left-16 top-12 h-24 w-[115%] rotate-[-12deg] bg-white/80 shadow-inner" />
            <div className="absolute left-10 top-56 h-20 w-[110%] rotate-[18deg] bg-white/70 shadow-inner" />
            <div className="absolute left-[48%] top-0 h-full w-24 rotate-[7deg] bg-white/75 shadow-inner" />
            <div className="absolute left-[10%] top-[12%] h-[70%] w-[72%] rounded-[45%] border-2 border-dashed border-primary/35" />

            <div className="absolute left-6 top-6 z-10 rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Route className="size-4 text-primary" />
                Deutschland Servicekarte
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Platzhalterpositionen bis zur finalen Adresse
              </p>
            </div>

            {servicePoints.map((point, index) => (
              <div
                key={point.id}
                className={`absolute ${point.position} z-20 -translate-x-1/2 -translate-y-1/2`}
              >
                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-primary/35 motion-safe:animate-ping" />
                    <span className="relative flex size-12 items-center justify-center rounded-full bg-primary text-base font-bold text-white shadow-[0_12px_35px_-12px_rgba(0,0,0,0.7)]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="hidden rounded-xl bg-white px-4 py-3 shadow-lg md:block">
                    <p className="text-sm font-semibold">{point.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {point.address.postalCode} {point.address.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 rounded-xl bg-black p-4 text-white md:grid-cols-3">
              <div className="flex items-center gap-3">
                <Wrench className="size-5 text-primary" />
                <span className="text-sm font-semibold">Werkstattservice</span>
              </div>
              <div className="flex items-center gap-3">
                <Navigation className="size-5 text-primary" />
                <span className="text-sm font-semibold">Regionale Hilfe</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-primary" />
                <span className="text-sm font-semibold">
                  Termin nach Absprache
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
