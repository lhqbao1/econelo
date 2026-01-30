import type { Metadata } from "next";
import { Figtree, Libre_Caslon_Display, Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
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
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
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
