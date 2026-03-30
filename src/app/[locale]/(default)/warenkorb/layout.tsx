import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warenkorb | Econelo",
  description: "Ihr Warenkorb bei Econelo.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: "https://econelo.de/warenkorb",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
