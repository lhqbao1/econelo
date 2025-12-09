"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import StatsSection from "./stat";
import { EmblaCarouselType } from "embla-carousel";

const testimonials = [
  {
    id: 1,
    text: "I appreciate your hospital really good environment and excellent patient care. You are continuously handle patient treatment wonderfully. Thanks for your great service. Please enjoy the chocolates.",
    name: "Striven Porter",
    role: "Financial Adviser",
  },
  {
    id: 2,
    text: "Econelo scooters have completely changed my daily commute. Smooth, silent, and efficient — love it!",
    name: "Julia Weber",
    role: "Marketing Expert",
  },
  {
    id: 3,
    text: "The delivery was fast and customer service was excellent. Highly recommend Econelo for anyone looking for an eco-friendly ride.",
    name: "Lukas Meyer",
    role: "Engineer",
  },
  {
    id: 4,
    text: "I appreciate your hospital really good environment and excellent patient care. You are continuously handle patient treatment wonderfully. Thanks for your great service. Please enjoy the chocolates.",
    name: "Striven Porter",
    role: "Financial Adviser",
  },
  {
    id: 5,
    text: "Econelo scooters have completely changed my daily commute. Smooth, silent, and efficient — love it!",
    name: "Julia Weber",
    role: "Marketing Expert",
  },
  {
    id: 6,
    text: "The delivery was fast and customer service was excellent. Highly recommend Econelo for anyone looking for an eco-friendly ride.",
    name: "Lukas Meyer",
    role: "Engineer",
  },
];

const TestimonialsSection = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );

  const emblaRef = useRef<EmblaCarouselType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Animation when active slide changes
  useEffect(() => {
    if (!emblaRef.current || !containerRef.current) return;
    const embla = emblaRef.current;

    const animateVisibleSlides = () => {
      const slides = embla.slidesInView();
      slides.forEach((index) => {
        const card =
          containerRef.current?.querySelectorAll(".testimonial-card")[index];
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          );
        }
      });
    };

    embla.on("select", animateVisibleSlides);
    animateVisibleSlides(); // run on mount

    // ✅ Cleanup đúng chuẩn React
    return () => {
      embla.off("select", animateVisibleSlides);
    };
  }, []);

  return (
    <section className="w-full flex flex-col justify-center bg-[#eff3f5] min-h-screen items-center">
      <div className="w-11/12 lg:w-7/12 py-24 relative">
        {/* Header */}
        <div className="relative z-10 text-center space-y-3 mb-10">
          <div className="flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="uppercase text-sm font-semibold text-gray-600">
              Our Customer Say
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            Here are some of our most valuable comments.
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{ align: "center", loop: true }}
        >
          <CarouselContent className="-ml-8 h-full py-10">
            {testimonials.map((t, index) => (
              <CarouselItem
                key={index}
                className="pl-8 md:basis-1/3 sm:basis-1/2 basis-full"
              >
                <Card className="relative p-8 text-center rounded-3xl shadow-md bg-white hover:shadow-lg transition-all duration-300 h-full">
                  {/* Quote icon */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary rounded-full p-3">
                    <Quote className="text-white w-6 h-6" />
                  </div>

                  <CardContent className="mt-4 flex flex-col items-center justify-center space-y-4">
                    <h3 className="text-xl font-semibold">{t.name}</h3>
                    <p className="uppercase text-green-600 text-sm font-semibold tracking-wide">
                      {t.role}
                    </p>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {t.text}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <CarouselPrevious className="absolute cursor-pointer -left-16 top-1/2 -translate-y-1/2 bg-black hover:bg-primary text-white hover:text-white transition-all duration-300 w-12 h-12 rounded-none rounded-r-xl"></CarouselPrevious>
          <CarouselNext className="absolute cursor-pointer -right-16 top-1/2 -translate-y-1/2 bg-primary hover:bg-black text-white hover:text-white transition-all duration-300 w-12 h-12 rounded-none rounded-l-xl"></CarouselNext>
        </Carousel>
      </div>
      {/* <StatsSection /> */}
    </section>
  );
};

export default TestimonialsSection;
