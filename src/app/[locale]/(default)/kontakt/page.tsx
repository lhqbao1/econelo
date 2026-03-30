import StepsSection from "@/components/layout/about/steps";
import ContactForm from "@/components/layout/contact/contact-form";
import ContactInfo from "@/components/layout/contact/contact-info";
import { ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import React from "react";

// ✅ Metadata SEO cho trang Contact
export const metadata: Metadata = {
  title: "Kontakt | Econelo – Kontaktieren Sie uns",
  description:
    "Kontaktieren Sie Econelo für Fragen zu Produkten, Bestellungen, Versand oder Support. Wir helfen Ihnen gerne weiter.",
  alternates: { canonical: "https://econelo.de/kontakt" },
  openGraph: {
    title: "Kontakt | Econelo",
    description:
      "Kontaktieren Sie Econelo für Fragen zu Produkten, Bestellungen, Versand oder Support.",
    url: "https://econelo.de/kontakt",
    siteName: "Econelo",
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary",
    title: "Kontakt | Econelo",
    description:
      "Kontaktieren Sie Econelo für Fragen zu Produkten, Bestellungen, Versand oder Support.",
  },
};

const ContactPage = () => {
  const t = useTranslations();
  return (
    <div className="min-h-screen flex flex-col items-center relative lg:pt-[100px] pt-[70px]">
      {/* Banner */}
      <div className="relative min-h-[400px] w-full">
        <Image
          src={"/econelo-banner1.webp"}
          alt="Econelo Kontakt Banner"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
          unoptimized
        />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl flex gap-3 z-20 px-6 py-1.5 text-sm items-center">
          <Link href={"/"}>{t("home")}</Link>
          <ChevronsRight size={18} />
          <p>Kontakt</p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="w-full flex flex-col items-center">
        {/* <h1 className="text-4xl font-extrabold mb-12 text-center">
          Kontaktieren Sie uns
        </h1> */}
        {/* <ContactInfo /> */}

        {/* Giả sử bạn có component ContactForm */}
        <ContactForm />

        <StepsSection />
      </section>

      {/* Optional: Structured data cho Contact */}
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Kontakt Econelo",
            url: "https://econelo.de/kontakt",
            contactType: "customer support",
            areaServed: "DE",
            publisher: {
              "@type": "Organization",
              name: "Econelo",
              url: "https://econelo.de",
            },
          }),
        }}
      />
    </div>
  );
};

export default ContactPage;
