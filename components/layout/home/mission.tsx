"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Contact2, CarFront } from "lucide-react";
import Image from "next/image";
import HoverButton from "@/components/shared/hover-button";
import CountUp from "@/components/shared/count-up";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const MissionSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations();

  const stats = [
    {
      value: 1200,
      label: t("statSatisfy"),
      unit: "+",
    },
    {
      value: 350,
      label: t("statCharging"),
      unit: "+",
    },
    {
      value: 85,
      label: t("statRange"),
      unit: "km",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // set initial states
      gsap.set(
        [
          ".left-images",
          ".right-subheading",
          ".right-heading",
          ".right-description",
        ],
        {
          opacity: 0,
        }
      );
      gsap.set(".left-images", { x: 60 }); // left images slide in from right -> slightly
      gsap.set(".right-subheading", { x: -60 }); // right text slide in from left
      gsap.set(".right-heading", { x: -80 });
      gsap.set(".right-description", { x: -100 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // when top of section hits 80% of viewport height
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
          // markers: true, // uncomment to debug
        },
      });

      // Animate left images first (bounce feel)
      tl.to(".left-images", {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "bounce.out",
      });

      // Then animate the right column groups together but staggered slightly
      tl.to(
        ".right-subheading",
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
        "-=0.45" // overlap
      );
      tl.to(
        ".right-heading",
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
        "-=0.45"
      );
      tl.to(
        ".right-description",
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
        "-=0.45"
      );

      // optional: small pop for CTA
      tl.fromTo(
        ".mission-cta",
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full lg:py-12 md:py-8 py-6 bg-white flex flex-col justify-center items-center md:gap-32 gap-24"
    >
      <div className="w-11/12 lg:w-8/12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — IMAGES */}
        <div className="relative flex lg:flex-row flex-col items-center h-full left-images">
          {/* Image 1 */}
          <div className="lg:absolute relative left-0 top-0 w-[340px] h-[340px] lg:rounded-tl-2xl rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/mission-image-1.jpg"
              alt="Charging scooter"
              fill
              className="object-cover"
            />
          </div>

          {/* Image 2 */}
          <div className="lg:absolute relative -bottom-4 lg:-right-2 right-0 w-[340px] h-[340px] rounded-2xl overflow-hidden">
            <Image
              src="/mission-image-2.jpg"
              alt="Riding scooter"
              fill
              className="object-cover"
            />
          </div>

          {/* Circle badge */}
          <div className="absolute -top-0 right-0 -translate-x-1/3 bg-primary text-white w-[110px] h-[110px] rounded-full lg:flex hidden flex-col items-center justify-center font-semibold shadow-md border-4 border-white">
            <span className="text-2xl font-bold">85%</span>
            <span className="text-sm">Clients</span>
          </div>
        </div>

        {/* RIGHT — TEXT CONTENT */}
        <div className="lg:space-y-8 space-y-4">
          {/* Subheading */}
          <div className="flex items-center gap-2 right-subheading">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="uppercase font-semibold tracking-wide text-sm text-gray-500">
              {t("whyEconelo")}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold leading-tight right-heading">
            {t("whySlogan")}
          </h2>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed right-description">
            {t("whyDes")}
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Contact2 className="text-primary size-10" strokeWidth={1} />
                <span className="font-semibold">{t("rideConfidence")}</span>
              </div>
              <p className="text-gray-500 text-sm leading-snug">
                {t("rideConfidenceDes")}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CarFront className="text-primary size-10" strokeWidth={1} />
                <span className="font-semibold">{t("noLicense")}</span>
              </div>
              <p className="text-gray-500 text-sm leading-snug">
                {t("noLicenseDes")}
              </p>
            </div>
          </div>

          {/* Check list */}
          <ul className="space-y-2 mt-4">
            <li className="flex items-center gap-2 text-sm">
              <Image
                src={"/check.png"}
                width={20}
                height={20}
                alt="check icon"
                className="object-contain"
              />
              <span>
                <strong>{t("removeBattery")}</strong>
              </span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Image
                src={"/check.png"}
                width={20}
                height={20}
                alt="check icon"
                className="object-contain"
              />
              <span>
                <strong>{t("noEmissions")}</strong>
              </span>
            </li>
          </ul>

          <div className="mission-cta">
            <HoverButton text={t("readMore")} redirect_url="#" is_primary />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="w-11/12 lg:w-7/12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center space-y-3"
          >
            <div className="flex gap-1">
              <CountUp
                from={0}
                to={item.value}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text text-5xl font-extrabold text-black"
              />
              {item.unit && (
                <span className="text-3xl font-bold text-black self-end mb-1">
                  {item.unit}
                </span>
              )}
            </div>
            <p className="text-gray-500 leading-snug max-w-[240px] text-base">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionSection;
