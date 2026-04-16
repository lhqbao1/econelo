import ListPolicy from "@/components/layout/policy/list-policy";
import type { PolicyResponse, PolicyVersion } from "@/types/policy";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Impressum | Econelo",
  description:
    "Rechtliche Angaben und Kontaktdaten der ECONELO Mobility GmbH gemäß § 5 TMG.",
  alternates: {
    canonical: "https://www.econelo.de/impressum",
  },
  openGraph: {
    title: "Impressum | Econelo",
    description: "Rechtliche Angaben und Kontaktdaten der ECONELO Mobility GmbH.",
    url: "https://www.econelo.de/impressum",
    siteName: "Econelo",
    locale: "de_DE",
    type: "website",
  },
};

const staticVersion: PolicyVersion[] = [
  {
    id: "impressum-static-v1",
    name: "Impressum",
    created_at: new Date("2026-04-16"),
    updated_at: new Date("2026-04-16"),
  },
];

const staticPolicyResponse: PolicyResponse = {
  id: "impressum-static-v1",
  name: "Impressum",
  created_at: "2026-04-16T00:00:00.000Z",
  updated_at: "2026-04-16T00:00:00.000Z",
  legal_policies: [
    {
      id: "impressum-static-tab-agb",
      version_id: "impressum-static-v1",
      name: "Allgemeine Geschäftsbedingungen (AGB)",
      created_at: "2026-04-16T00:00:00.000Z",
      updated_at: "2026-04-16T00:00:00.000Z",
      child_legal_policies: [],
    },
    {
      id: "impressum-static-tab",
      version_id: "impressum-static-v1",
      name: "Impressum",
      created_at: "2026-04-16T00:00:00.000Z",
      updated_at: "2026-04-16T00:00:00.000Z",
      child_legal_policies: [
        {
          id: "impressum-static-item-1",
          legal_policy_id: "impressum-static-tab",
          label: "Angaben gemäß § 5 TMG",
          tt: 1,
          content:
            "<p>ECONELO Mobility GmbH</p><p>Edisonstraße 4</p><p>85716 Unterschleißheim</p><p>Germany</p>",
          created_at: "2026-04-16T00:00:00.000Z",
          updated_at: "2026-04-16T00:00:00.000Z",
        },
        {
          id: "impressum-static-item-2",
          legal_policy_id: "impressum-static-tab",
          label: "Vertreten durch",
          tt: 2,
          content:
            "<p>Marco Oberste</p><p>Geschäftsführer (Managing Director)</p>",
          created_at: "2026-04-16T00:00:00.000Z",
          updated_at: "2026-04-16T00:00:00.000Z",
        },
        {
          id: "impressum-static-item-3",
          legal_policy_id: "impressum-static-tab",
          label: "Kontakt",
          tt: 3,
          content:
            "<p>Telefonnummer: +491774328570</p><p>E-Mail: info@econelo.de</p>",
          created_at: "2026-04-16T00:00:00.000Z",
          updated_at: "2026-04-16T00:00:00.000Z",
        },
        {
          id: "impressum-static-item-5",
          legal_policy_id: "impressum-static-tab",
          label: "Eintragung im Handelsregister",
          tt: 4,
          content:
            "<p>Registergericht: Amtsgericht München</p><p>Eintragung im Handelsregister ist angemeldet. Die Registernummer wird nach Eintragung ergänzt.</p>",
          created_at: "2026-04-16T00:00:00.000Z",
          updated_at: "2026-04-16T00:00:00.000Z",
        },
        {
          id: "impressum-static-item-6",
          legal_policy_id: "impressum-static-tab",
          label: "Haftungsausschluss",
          tt: 5,
          content:
            "<p><strong>Haftung für Inhalte</strong></p><p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach den §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p><br/><p><strong>Haftung für Links</strong></p><p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p><p><strong>Urheberrecht</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors oder Erstellers.</p>",
          created_at: "2026-04-16T00:00:00.000Z",
          updated_at: "2026-04-16T00:00:00.000Z",
        },
      ],
    },
    {
      id: "impressum-static-tab-widerruf",
      version_id: "impressum-static-v1",
      name: "Widerrufsbelehrung",
      created_at: "2026-04-16T00:00:00.000Z",
      updated_at: "2026-04-16T00:00:00.000Z",
      child_legal_policies: [],
    },
    {
      id: "impressum-static-tab-zahlung",
      version_id: "impressum-static-v1",
      name: "Zahlungsbedingungen",
      created_at: "2026-04-16T00:00:00.000Z",
      updated_at: "2026-04-16T00:00:00.000Z",
      child_legal_policies: [],
    },
    {
      id: "impressum-static-tab-versand",
      version_id: "impressum-static-v1",
      name: "Versandbedingungen",
      created_at: "2026-04-16T00:00:00.000Z",
      updated_at: "2026-04-16T00:00:00.000Z",
      child_legal_policies: [],
    },
    {
      id: "impressum-static-tab-datenschutz",
      version_id: "impressum-static-v1",
      name: "Datenschutzerklärung",
      created_at: "2026-04-16T00:00:00.000Z",
      updated_at: "2026-04-16T00:00:00.000Z",
      child_legal_policies: [],
    },
  ],
};

export default function ImpressumPage() {
  return (
    <>
      <Script
        id="schema-impressum"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Impressum – Econelo",
            url: "https://www.econelo.de/impressum",
            about: { "@type": "Thing", name: "Legal Notice / Impressum" },
            publisher: {
              "@type": "Organization",
              name: "ECONELO Mobility GmbH",
              legalName: "ECONELO Mobility GmbH",
              url: "https://www.econelo.de",
              logo: {
                "@type": "ImageObject",
                url: "https://www.econelo.de/econelo-logo.png",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+49 177 4328570",
                contactType: "Customer Service",
                areaServed: "DE",
                availableLanguage: "German",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Edisonstraße 4",
                addressLocality: "Unterschleißheim",
                postalCode: "85716",
                addressCountry: "DE",
              },
            },
          }),
        }}
      />

      <div className="w-full min-h-screen">
        <ListPolicy
          versionId={staticVersion[0].id}
          versionData={staticVersion}
          currentPage="Impressum"
          staticPolicyResponse={staticPolicyResponse}
        />
      </div>
    </>
  );
}
