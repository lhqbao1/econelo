import type { Metadata } from "next";
import { Figtree, Libre_Caslon_Display, Quicksand } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import SiteHeader from "@/components/header/header";
import ImportantNotice from "@/components/shared/notice";
import { QueryProvider } from "@/lib/query-provider";
import { TrustedShops } from "@/components/shared/trusted-shop";

const quickSand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Econelo",
  description: "Econelo",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
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
        <Providers>{children}</Providers>
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
