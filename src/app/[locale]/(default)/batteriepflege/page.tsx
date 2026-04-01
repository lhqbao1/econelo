import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const pageTitle = "Batteriepflege";
const pageDescription =
  "Pflege und Wartung der Batterie an Ihrem Elektro Seniorenmobil: Einbau, Einfahren, Laden und Lagerung.";
const pageUrl = "https://econelo.de/batteriepflege";
const pageImage = "https://econelo.de/batteriepflege-banner.jpg";

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
        alt: "Batteriepflege am Elektro Seniorenmobil",
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

const batteriepflegeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: pageTitle,
      description: pageDescription,
      inLanguage: "de-DE",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
      },
      image: [pageImage],
      author: {
        "@type": "Organization",
        name: "Econelo",
        url: "https://econelo.de",
      },
      publisher: {
        "@id": "https://econelo.de/#organization",
      },
      isPartOf: {
        "@id": "https://econelo.de/#website",
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

export default function BatteriepflegePage() {
  return (
    <div className="min-h-screen md:pt-[108px] pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(batteriepflegeSchema),
        }}
      />
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 pt-6">
        <section className="relative overflow-hidden rounded-2xl min-h-[300px] md:min-h-[420px]">
          <Image
            src="/batteriepflege-banner.jpg"
            alt="Batteriepflege Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/25" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <h1 className="text-white text-4xl md:text-6xl font-light tracking-tight">
              Batteriepflege
            </h1>
          </div>
        </section>

        <article className="mx-auto w-full max-w-5xl mt-8 md:mt-10 space-y-8">
          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Pflege und Wartung der Batterie an Ihrem Elektro Seniorenmobil
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Mit einem Elektro Dreirad Roller haben Sie sich für ein
              Seniorenmobil entschieden, das Ihnen Mobilität und ein großes Plus
              an Lebensqualität schenkt. Damit Ihr Elektro Seniorenmobil nicht
              an Leistungsfähigkeit verliert und Sie nie im Stich lässt, sind
              regelmäßige Pflege und Wartung genauso wichtig wie beim Auto.
            </p>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Beim Seniorenmobil spielt die Batteriepflege dabei eine zentrale
              Rolle. Vier Punkte sind entscheidend:
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                Batterien richtig einbauen
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                Batterien einfahren
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                Batterien richtig laden
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                Batterien fachgerecht lagern und warten
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Batterien richtig einbauen
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Auch im Fachgeschäft finden Sie kompetente Ansprechpartner für den
              Einbau der Batterien. Viele Familien können den Einbau jedoch auch
              selbst vornehmen.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Wichtig ist, bei den klassischerweise zwei Batterien à 24 Volt
              keine unterschiedlichen Modelle verschiedener Hersteller in Reihe
              zu schalten. Achten Sie außerdem auf das vorgeschriebene
              Anzugsdrehmoment der Schrauben, um Funkenbildung zu vermeiden.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Batterien einfahren
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Ein Seniorenmobil dauerhaft ungenutzt in der Garage stehen zu
              lassen, schont die Batterie nicht automatisch. Batterien müssen
              eingefahren werden.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Je aktiver Sie Ihr Seniorenmobil bewegen, desto besser für die
              Haltbarkeit. Laden Sie die Batterie in der Anfangszeit wiederholt
              vollständig auf und entladen Sie sie auf etwa 25 %
              Restenergie, damit eine intelligente Batterie ihr Leistungspotenzial
              optimal abrufen kann.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Batterien richtig laden
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Kurzladungen schaden eher, als dass sie nutzen. Nutzen Sie Ihr
              Elektro Seniorenmobil tagsüber normal und laden Sie vorzugsweise am
              Abend vollständig auf. Moderne Batterien verfügen über einen Schutz
              vor Überladung.
            </p>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <h3 className="text-lg font-semibold text-primary">Wichtig bei Lithiumakkus</h3>
              <p className="mt-2 text-base leading-7 text-foreground/90">
                Vor dem Trennen und Anschließen des Akkus am Fahrzeug die
                Hauptsicherung auf „aus“ schalten, um Kurzschlüsse zu vermeiden.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr] items-start">
              <ol className="space-y-3 list-decimal pl-5 text-base leading-7 text-foreground/90">
                <li>Zündung aus.</li>
                <li>Hauptsicherung (soweit vorhanden) einschalten.</li>
                <li>Erst Ladebuchse mit Ladegerät verbinden, dann ans Netz.</li>
                <li>Nur Original-/Herstellerladegeräte verwenden.</li>
                <li>Komplette Entladung vermeiden.</li>
                <li>Akku nach Möglichkeit immer vollständig aufladen.</li>
              </ol>

              <div className="overflow-hidden rounded-xl border border-border/70">
                <div className="relative h-[220px] md:h-[280px]">
                  <Image
                    src="/J1000/J1000_detail_20.jpg"
                    alt="Batterie im Elektrofahrzeug"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Batterien fachgerecht lagern und warten
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Lagern Sie Batterien nur im geladenen Zustand und trennen Sie sie
              für die Lagerung vom Stromanschluss. Extreme Temperaturen
              (&lt; -10°C bzw. &gt; +50°C) können schaden; ideal sind +15°C bis
              +25°C.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Bei längerer Nichtbenutzung, z. B. über die Wintermonate,
              empfehlen wir dringend, die Batterie(n) Ihres Elektrorollers etwa
              alle 4 Wochen vollständig aufzuladen. So wird die technische
              Selbstentladung ausgeglichen und eine Tiefenentladung verhindert.
            </p>
          </section>

          <section className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Fragen zur Batteriepflege?
            </h2>
            <p className="mt-3 text-base leading-8 text-foreground/90">
              Haben Sie noch Fragen rund um Pflege und Wartung der Batterie an
              Ihrem Elektro Seniorenmobil? Über unser Kontaktformular erreichen
              Sie unser Experten-Team.
            </p>
            <div className="mt-5">
              <Link
                href="/kontakt"
                className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-black"
              >
                Zum Kontaktformular
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
