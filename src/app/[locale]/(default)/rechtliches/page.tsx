import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const pageTitle = "Rechtliche Fragen zum Fahren mit Elektro Trikes";
const pageDescription =
  "Mofa-Prüfbescheinigung, Führerschein Klasse AM und rechtliche Grundlagen für Elektro Senioren Mobile und Krankenfahrstühle.";
const pageUrl = "https://econelo.de/rechtliches";
const pageImage = "https://econelo.de/econelo-banner1.webp";

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
        alt: "Rechtliche Informationen zu Elektro Trikes",
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

const rechtlichesSchema = {
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
          name: "Rechtliches",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function RechtlichesPage() {
  return (
    <div className="min-h-screen pb-14 md:pt-[108px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rechtlichesSchema) }}
      />
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 md:px-6">
        <section className="relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-[430px]">
          <Image
            src="/econelo-banner1.webp"
            alt="Elektromobile und Elektrofahrzeuge von Econelo"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/30" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/85 md:text-base">
                Rechtliche Grundlagen
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-6xl">
                Rechtliche Fragen zum Fahren mit Elektro Trikes
              </h1>
            </div>
          </div>
        </section>

        <article className="mx-auto mt-8 w-full max-w-5xl space-y-8 md:mt-10">
          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Mofa-Pruefbescheinigung, Klasse AM und Elektro Senioren Mobile
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Bei unseren Elektro Trikes muss rechtlich zuerst zwischen
              Krankenfahrstuhl und Freizeitmobil unterschieden werden. Davon
              haengt ab, ob ein Fahrzeug ohne Genehmigung, mit
              Mofa-Pruefbescheinigung oder mit Fuehrerschein gefahren werden
              darf.
            </p>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Wichtig: Das Elektro Senioren Mobil mit 25 km/h ist in der Regel
              zu schnell fuer die Krankenfahrstuhl-Einstufung. Ein
              Kabinenroller mit 45 km/h benoetigt mindestens die Fahrerlaubnis
              Klasse AM.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Voraussetzungen fuer die Zulassung als Krankenfahrstuhl
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Damit ein Fahrzeug rechtlich als Krankenfahrstuhl gilt, muessen
              nach den beschriebenen Vorgaben folgende Kriterien eingehalten
              werden:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-8 text-foreground/90">
              <li>Bauart fuer die Nutzung durch koerperbehinderte Personen</li>
              <li>Hoechstens ein Sitz</li>
              <li>Ueberdachung ist zulaessig</li>
              <li>Leergewicht inklusive Akku, ohne Fahrer: maximal 300 kg</li>
              <li>Zulaessiges Gesamtgewicht: maximal 500 kg</li>
              <li>Maximale Breite: 110 cm</li>
              <li>Bauartbedingte Hoechstgeschwindigkeit: maximal 15 km/h</li>
            </ul>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-white p-6">
              <h3 className="text-xl font-semibold">
                Einordnung unserer Elektro Trikes
              </h3>
              <p className="mt-3 leading-7 text-foreground/85">
                Offene elektrische Dreiradroller koennen unter die oben genannten
                Grenzen fallen, wenn sie auf 15 km/h begrenzt sind.
              </p>
              <p className="mt-3 leading-7 text-foreground/85">
                Das 25-km/h-Seniorenmobil ist fuer die
                Krankenfahrstuhl-Einstufung normalerweise zu schnell.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white p-6">
              <h3 className="text-xl font-semibold">Kabinenroller</h3>
              <p className="mt-3 leading-7 text-foreground/85">
                Kabinenroller sind in der Regel breiter, schwerer und schneller.
                Deshalb werden sie rechtlich nicht als Krankenfahrstuhl
                eingeordnet.
              </p>
              <p className="mt-3 leading-7 text-foreground/85">
                Zuschuesse durch Krankenkassen sind moeglich, muessen aber immer
                individuell geprueft werden.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Unterkategorien und erforderliche Nachweise
            </h2>
            <div className="mt-5 grid gap-4">
              <div className="rounded-xl border border-border/70 bg-background/50 p-5">
                <h3 className="text-lg font-semibold">Bis 6 km/h</h3>
                <p className="mt-2 leading-7 text-foreground/85">
                  Rechtlich wie Fussgaenger im Strassenverkehr. Keine
                  Pruefbescheinigung und in der Regel kein Versicherungskennzeichen
                  erforderlich. Eine Haftpflichtversicherung ist trotzdem dringend
                  empfehlenswert.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-5">
                <h3 className="text-lg font-semibold">Ueber 6 km/h bis 10 km/h</h3>
                <p className="mt-2 leading-7 text-foreground/85">
                  Versicherungspflicht besteht. Gefuehrt werden kann das Fahrzeug
                  weiterhin ohne Fuehrerschein oder Mofa-Pruefbescheinigung, wenn
                  die Person dazu in der Lage ist.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-5">
                <h3 className="text-lg font-semibold">
                  Ueber 10 km/h (z. B. 15 km/h oder 25 km/h)
                </h3>
                <p className="mt-2 leading-7 text-foreground/85">
                  Versicherungskennzeichen und Mofa-Pruefbescheinigung notwendig.
                  Die Bescheinigung ist ab 15 Jahren moeglich und gilt rechtlich
                  nicht als Fuehrerschein.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-5">
                <h3 className="text-lg font-semibold">
                  Bis 45 km/h (Kabinenroller 1500)
                </h3>
                <p className="mt-2 leading-7 text-foreground/85">
                  Mindestens Fuehrerschein Klasse AM erforderlich. Alternativ sind
                  hoehere Klassen (z. B. A, B, C) ebenfalls gueltig.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Mofa-Pruefbescheinigung: wichtige Punkte
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-8 text-foreground/90">
              <li>
                Fuer Fahrzeuge ueber 10 km/h benoetigt man eine
                Mofa-Pruefbescheinigung.
              </li>
              <li>
                Erwerb ueber Fahrschule/Bildungseinrichtung (Theorie + Praxis
                + theoretische Pruefung).
              </li>
              <li>Aushaendigung ab vollendetem 15. Lebensjahr.</li>
              <li>
                Personen mit Geburtsjahr vor 1965 benoetigen diese
                Bescheinigung in der Regel nicht.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Sonderfaelle und Stichtage
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              In der Fahrerlaubnisverordnung (FeV) gibt es Uebergangsregelungen
              fuer Altfahrzeuge und alte Bescheinigungen. Als genannte Stichtage
              gelten insbesondere der 01.09.2002 und der 30.06.1999.
            </p>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Die Auslegung im Einzelfall haengt von Fahrzeugtyp,
              Erstzulassung/Inverkehrnahme und vorhandenen Dokumenten ab.
              Rechtliche Grundlage:
              {" "}
              <Link
                href="https://www.gesetze-im-internet.de/fev_2010/__4.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                Fahrerlaubnis-Verordnung (FeV)
              </Link>
              .
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Teilnahme am Strassenverkehr
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-8 text-foreground/90">
              <li>
                Bis 6 km/h: Nutzung von Gehwegen und Fussgaengerzonen im Rahmen
                der geltenden Regeln moeglich.
              </li>
              <li>
                Mit schnellerem, versicherungspflichtigem Fahrzeug:
                Fahrbahnbenutzungspflicht.
              </li>
              <li>
                Radwege sind fuer diese Fahrzeuge in der Regel nicht zulaessig.
              </li>
              <li>
                Beim 25-km/h-Seniorenmobil gilt: im kleinsten Gang bis 6 km/h
                wie Fussgaenger, darueber auf die Strasse.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">
              Hinweis
            </h2>
            <p className="mt-3 text-base leading-8 text-foreground/90">
              Diese Seite stellt eine uebersichtliche Zusammenfassung dar und
              ersetzt keine individuelle Rechtsberatung. Fuer verbindliche
              Einordnung im Einzelfall sollten zustaendige Behoerden oder
              Fachstellen einbezogen werden.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
