import type { Metadata } from "next";
import { Figtree, Libre_Caslon_Display, Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SiteHeader from "@/components/header/header";
import ImportantNotice from "@/components/shared/notice";
import { TrustedShops } from "@/components/shared/trusted-shop";
import { Providers } from "./provider";
import QueryProvider from "@/hooks/query-provider";

const quickSand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.econelo.de"),
  title: {
    default: "Econelo – Elektroroller, Elektromobile & E-Mobilität",
    template: "%s | Econelo",
  },
  description:
    "Econelo bietet Elektroroller, Elektromobile und Seniorenfahrzeuge für eine komfortable, sichere und moderne Mobilität. Nachhaltige E-Mobilität für Alltag, Freizeit und Senioren.",
  keywords: [
    "Econelo",
    "Elektroroller",
    "Elektromobile",
    "Seniorenmobil",
    "E Scooter",
    "E-Mobile",
    "Roller elektrisch",
    "Elektrische Fahrzeuge",
    "Nachhaltige Mobilität",
    "E-Mobilität Deutschland",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.econelo.de",
  },
  openGraph: {
    title: "Econelo – Elektroroller & Elektromobile für moderne Mobilität",
    description:
      "Elektroroller, Elektromobile und Seniorenfahrzeuge für Alltag und Freizeit. Nachhaltige E-Mobilität mit Qualität und Komfort.",
    url: "https://www.econelo.de",
    siteName: "Econelo",
    images: [
      {
        url: "/banner.jpeg",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Econelo – Elektroroller & Elektromobile",
    description:
      "Elektroroller, Elektromobile und Seniorenfahrzeuge für nachhaltige Mobilität.",
    images: ["/banner.jpeg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.econelo.de/#organization",
      name: "Econelo",
      url: "https://www.econelo.de",
      logo: "https://www.econelo.de/econelo-logo.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.econelo.de/#website",
      url: "https://www.econelo.de",
      name: "Econelo",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://www.econelo.de/alle-produkte?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@id": "https://www.econelo.de/#organization",
      },
      inLanguage: "de-DE",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" translate="no">
      <head>
        <meta
          name="google-site-verification"
          content="YoswpUfQvsm7CswB52jjf5u7yT4lygfW3bjYtbl72Fg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${quickSand.variable} font-quicksand antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <Providers>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WKVQP2QH"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          {/* <ImportantNotice /> */}
          <TrustedShops />
          <QueryProvider>{children}</QueryProvider>
        </Providers>
        <Toaster
          expand
          richColors
          position="top-right"
          closeButton
          toastOptions={{
            className:
              "bg-[rgba(81,190,140,0.2)] text-white z-100 top-10 translate-y-10",
          }}
        />
      </body>
    </html>
  );
}
