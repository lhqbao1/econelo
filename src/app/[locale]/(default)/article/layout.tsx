import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artikel | Econelo",
  description: "Informationsseite von Econelo.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: "https://econelo.de/article",
  },
};

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
