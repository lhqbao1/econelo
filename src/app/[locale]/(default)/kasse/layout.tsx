import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasse | Econelo",
  description: "Sicherer Checkout bei Econelo.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: "https://econelo.de/kasse",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
