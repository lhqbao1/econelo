import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Metadata } from "next";

// 🧠 SEO metadata cho trang 404
export const metadata: Metadata = {
  title: "404 | Seite nicht gefunden",
  description: "Die gesuchte Seite wurde leider nicht gefunden.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/404",
  },
  openGraph: {
    title: "404 | Seite nicht gefunden",
    description: "Die gesuchte Seite wurde leider nicht gefunden.",
    url: "https://econelo.de/404",
    type: "website",
    // images: [
    //   {
    //     url: "https://econelo.de/og-image-404.png", // optional
    //   },
    // ],
  },
};

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <h1 className="text-5xl font-bold mb-4">{t("title")}</h1>
      <p className="text-gray-600 mb-8 max-w-md">{t("description")}</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
