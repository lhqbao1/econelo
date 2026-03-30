import StepsSection from "@/components/layout/about/steps";
import TestimonialsSection from "@/components/layout/about/testimonial";
import MissionSection from "@/components/layout/home/mission";
import { ArrowRight, ChevronRight, ChevronsRight } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Über Uns | Econelo",
  description:
    "Erfahren Sie mehr über Econelo, unsere Mission und unseren Anspruch an moderne und sichere E-Mobilität.",
  alternates: {
    canonical: "https://econelo.de/ueber-uns",
  },
  openGraph: {
    title: "Über Uns | Econelo",
    description:
      "Erfahren Sie mehr über Econelo, unsere Mission und unseren Anspruch an moderne und sichere E-Mobilität.",
    url: "https://econelo.de/ueber-uns",
    siteName: "Econelo",
    type: "website",
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://econelo.de/ueber-uns",
  name: "Über Uns | Econelo",
  description:
    "Erfahren Sie mehr über Econelo, unsere Mission und unseren Anspruch an moderne und sichere E-Mobilität.",
  inLanguage: "de-DE",
  publisher: {
    "@type": "Organization",
    name: "Econelo",
    url: "https://econelo.de",
  },
};

const AboutUsPage = () => {
  const t = useTranslations();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <div className="min-h-screen  flex flex-col items-center relative md:pt-[100px]">
        <div className="relative min-h-[400px] w-full">
          <Image
            src={"/econelo-banner1.webp"}
            alt=""
            fill
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
            unoptimized
          />
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl flex gap-3 z-20 px-6 py-1.5 text-sm items-center">
            <Link href={"/"}>{t("home")}</Link>
            <ChevronsRight size={18} />
            <p>{t("aboutUs")}</p>
          </div>
        </div>
        <MissionSection />
        <TestimonialsSection />
        <StepsSection />
      </div>
    </>
  );
};

export default AboutUsPage;
