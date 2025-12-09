"use client";

import React from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";

const testimonials = [
  {
    id: 1,
    text: "Seit ich mein dreirädriges Elektromobil von Econelo habe, bin ich wieder selbstständig unterwegs. Das Fahrzeug ist stabil, leicht zu bedienen und gibt mir ein sicheres Gefühl im Alltag.",
    name: "Helga Schneider",
    role: "Rentnerin",
  },
  {
    id: 2,
    text: "Das vierrädrige Seniorenmobil fährt sich unglaublich bequem. Kein Balancehalten, kein Stress – einfach draufsetzen und losfahren. Perfekt für Einkäufe und Arzttermine.",
    name: "Walter Hofmann",
    role: "Senior",
  },
  {
    id: 3,
    text: "Die Lieferung war schnell und der Kundenservice sehr freundlich. Mein Dreirad ist leise, zuverlässig und ideal für kurze Strecken in der Stadt. Ich kann Econelo absolut empfehlen.",
    name: "Monika Berger",
    role: "Ehemalige Lehrerin",
  },
];

const TestimonialsSection = () => {
  const t = useTranslations();
  return (
    <section className="w-full xl:w-8/12 py-24 relative flex flex-col items-center justify-center">
      {/* Background map (decorative) */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <Image
          src="/testimonials.png"
          alt="World Map Background"
          fill
          className="object-cover z-50"
        />
      </div>

      <div className="w-11/12 lg:w-10/12 flex flex-col items-center">
        {/* Header */}
        <div className="relative z-10 text-center space-y-3 mb-10">
          <div className="flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="uppercase text-sm font-semibold text-gray-600">
              {t("testimonials")}
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            {t("clientSays")}
          </h2>
        </div>

        {/* Carousel */}
        <Carousel className="relative w-full">
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem
                key={t.id}
                className="text-center px-8 py-12"
              >
                <p className="text-lg md:text-xl text-gray-600 font-semibold leading-relaxed relative z-10 max-w-4xl mx-auto">
                  <span className="absolute left-[45%] -top-10 text-7xl text-primary/15 font-serif select-none">
                    “
                  </span>
                  {t.text}
                </p>

                {/* Rating */}
                {/* <div className="flex justify-center mt-8 mb-4 text-primary">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                </div> */}

                {/* Author */}
                <div className="flex justify-center items-center gap-4 mt-6">
                  <div className="text-center">
                    <h4 className="font-bold text-lg text-black">{t.name}</h4>
                    <p className="text-sm text-primary font-medium">{t.role}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <CarouselPrevious className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-black hover:bg-primary text-white hover:text-white transition-all duration-300 w-12 h-12 rounded-none rounded-r-xl"></CarouselPrevious>
          <CarouselNext className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-black text-white hover:text-white transition-all duration-300 w-12 h-12 rounded-none rounded-l-xl"></CarouselNext>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
