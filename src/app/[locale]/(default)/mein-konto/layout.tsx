import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Konto | Econelo",
  description: "Verwalten Sie Ihr Econelo Konto.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: "https://econelo.de/mein-konto",
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
