import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const pageTitle = "Akkus im Winter";
const pageDescription =
  "Wie Sie Blei- und Lithium-Akkus im Winter richtig pflegen, Reichweite sichern und die Gewährleistung erhalten.";
const pageUrl = "https://econelo.de/akkus-im-winter";
const pageImage = "https://econelo.de/winter.jpg";

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
        alt: "Akkus im Winter",
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

const akkusImWinterSchema = {
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

export default function AkkusImWinterPage() {
  return (
    <div className="min-h-screen md:pt-[108px] pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(akkusImWinterSchema),
        }}
      />
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 pt-6">
        <section className="relative overflow-hidden rounded-2xl min-h-[300px] md:min-h-[430px]">
          {/* Banner placeholder - can be replaced later */}
          <Image
            src="/winter.jpg"
            alt="Akkus im Winter Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <h1 className="text-white text-4xl md:text-6xl font-medium tracking-tight">
              Akkus im Winter
            </h1>
          </div>
        </section>

        <article className="mx-auto w-full max-w-5xl mt-8 md:mt-10 space-y-8">
          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Energieverlust bei Kälte – bis 30 Prozent mehr Verbrauch im Winter
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Der ADAC hat in einer groß angelegten Studie herausgefunden, dass
              Fahrzeuge mit Lithium-Ionen-Batterie bei Temperaturen von -7 Grad
              zwischen 25 % und 50 % mehr Energie verbrauchen als bei
              Temperaturen von +14 Grad.
            </p>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Hier können Sie den Bericht vom ADAC nachlesen:{" "}
              <Link
                href="https://www.adac.de/rund-ums-fahrzeug/elektromobilitaet/info/elektroauto-reichweite-winter/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                www.adac.de/rund-ums-fahrzeug/elektromobilitaet/info/elektroauto-reichweite-winter/
              </Link>
            </p>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Damit Sie auch im Winter zuverlässig mit Ihrem ECONELO von A nach
              B kommen, zeigen wir Ihnen, wie Sie Ihren Akku bei niedrigen
              Temperaturen fit halten und was dafür wichtig ist, damit die
              Gewährleistung erhalten bleibt.
            </p>
            <p className="mt-4 text-base leading-8 text-foreground/90">
              Mit einem Messgerät kann man einfach prüfen, wie oft und wann ein
              Akku geladen wurde.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-white p-6">
              <h3 className="text-xl font-semibold">
                Blei Akku vs. Lithium Akku
              </h3>
              <p className="mt-3 text-foreground/80 leading-7">
                Wenn viel elektrische Energie für den Antrieb benötigt wird,
                konkurrieren aktuell zwei Systeme: Blei Akkus und
                Lithium-Ionen-Akkus.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white p-6">
              <h3 className="text-xl font-semibold">Altbewährt vs. neu</h3>
              <p className="mt-3 text-foreground/80 leading-7">
                Beide Akkutypen haben klare Stärken und Schwächen – besonders
                bei niedrigen Temperaturen im Winter.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Blei Akkus – bewährte und preiswerte Energiespeicher
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Blei Akkus versorgen Elektromotoren seit mehr als 170 Jahren mit
              Energie. Die Technik ist ausgereift und gilt als robust. Kälte im
              Winter kann ein Bleiakku oft besser verkraften als andere
              Batterietypen – sofern der Akku gewartet ist.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Diese Zuverlässigkeit ist einer der Gründe, warum Blei Akkus
              weiterhin Standard bei Starterbatterien in Kraftfahrzeugen sind.
              Auch Überladung oder Tiefentladung kann ein Bleiakkumulator oft
              besser wegstecken.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Nachteilig ist vor allem das hohe Gewicht. Deshalb sind
              Bleiakkumulatoren in Elektrofahrzeugen in der Regel fest verbaut
              und nicht immer einfach entnehmbar.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              So pflegen Sie Ihren Blei Akku im Winter
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Wie viel Pflege nötig ist, hängt stark vom Alter des Akkus ab. Ein
              neuer, hochwertiger Bleiakku ist relativ unempfindlich. Ab etwa 2
              bis 3 Jahren nimmt die Leistung unter dem Gefrierpunkt deutlich
              ab.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Optimal ist ein Abstellort mit mindestens +10 Grad Celsius, zum
              Beispiel Garage oder geschlossener Schuppen. Falls möglich, sollte
              der Akku aus dem Fahrzeug genommen und an einem warmen Ort geladen
              und gelagert werden.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Wird das Fahrzeug im Winter selten genutzt, sollten Blei Akkus
              regelmäßig nachgeladen werden. Eine Erhaltungsladung bis 100 % ist
              bei Bleiakkus möglich. Zudem gibt es keinen Memory-Effekt.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Lithium Akkus – die Zukunft der Stromspeicherung?
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Lithium-Ionen-Akkus sind deutlich jünger als Bleiakkus, haben sich
              aber als Energiespeicher für Smartphones, Elektrofahrzeuge und
              viele weitere Geräte etabliert.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Vorteile sind hohe Energiedichte, mehr Reichweite, gute
              Lebensdauer und starke Stromabgabe – ideal für den Antrieb von
              Elektrofahrzeugen.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Nachteile sind der höhere Preis sowie eine höhere Empfindlichkeit
              gegenüber Kälte und Hitze. Unter +5 Grad kommt es häufig zu
              deutlichem Leistungsverlust.
            </p>

            <div className="mt-2 overflow-hidden rounded-xl border border-border/70">
              {/* Placeholder for battery image (image 2) */}
              <div className="relative h-[240px] md:h-[360px]">
                <Image
                  src="/winter-1.jpg"
                  alt="Akku Ansicht"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <p className="text-base leading-8 text-foreground/90">
              Physikalischer Grund: Bei niedrigen Temperaturen bewegen sich die
              Ionen langsamer. Je niedriger die Temperatur, desto geringer die
              verfügbare Leistung und Reichweite.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-white p-6 md:p-8 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Reichweite von E-Rollern mit Lithium-Akku im Winter erhalten
            </h2>
            <p className="text-base leading-8 text-foreground/90">
              Der wichtigste Hebel ist Temperatur: Fahrzeug und Akku sollten vor
              der Fahrt möglichst aufgewärmt sein. Ideal ist eine beheizte
              Garage. Ein warmer Akku lädt zudem schneller als ein eiskalter
              Akku.
            </p>
            <p className="text-base leading-8 text-foreground/90">
              Wird das Fahrzeug im Winter selten genutzt, sollte der Akku an
              einem trockenen, möglichst warmen Ort gelagert und regelmäßig
              geprüft werden.
            </p>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <h3 className="text-lg font-semibold text-primary">TIPP</h3>
              <p className="mt-2 text-base leading-7 text-foreground/90">
                Wenn Sie Ihren Elektroroller im Winter nicht benutzen, reinigen
                Sie das Fahrzeug gründlich vor dem Abstellen und klemmen Sie die
                Batterie ab. So reduzieren Sie Feuchtigkeit, Schmutz und
                Korrosion. Nutzen Sie bei Bedarf eine geeignete Abdeckplane als
                Schutz vor Staub und Nässe.
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
