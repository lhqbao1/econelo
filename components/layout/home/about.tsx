"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { BatteryCharging, Plug, CarFront } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const AdvantagesSection = () => {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const featuresLeft = [
    {
      icon: <BatteryCharging className="w-6 h-6 text-white" />,
      title: t("fastCharging"),
      desc: t("fastChargingDesc"),
    },
    {
      icon: <Plug className="w-6 h-6 text-white" />,
      title: t("ecoFriendlyRide"),
      desc: t("ecoFriendlyRideDesc"),
    },
    {
      icon: <CarFront className="w-6 h-6 text-white" />,
      title: t("lowMaintenance"),
      desc: t("lowMaintenanceDesc"),
    },
  ];

  const featuresRight = [
    {
      icon: <BatteryCharging className="w-6 h-6 text-white" />,
      title: t("costEfficient"),
      desc: t("costEfficientDesc"),
    },
    {
      icon: <Plug className="w-6 h-6 text-white" />,
      title: t("smartTechnology"),
      desc: t("smartTechnologyDesc"),
    },
    {
      icon: <CarFront className="w-6 h-6 text-white" />,
      title: t("licenseFreeOptions"),
      desc: t("licenseFreeOptionsDesc"),
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const leftItems = gsap.utils.toArray<HTMLElement>(".feature-left");
      const rightItems = gsap.utils.toArray<HTMLElement>(".feature-right");

      // Khởi tạo: bên trái ra ngoài -60px, bên phải ra ngoài +60px
      gsap.set(leftItems, { opacity: 0, x: -60 });
      gsap.set(rightItems, { opacity: 0, x: 60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          // markers: true,
        },
      });

      // Hiệu ứng cho từng hàng (cặp trái - phải vào cùng lúc)
      leftItems.forEach((leftEl, i) => {
        const rightEl = rightItems[i];

        tl.to(
          [leftEl, rightEl],
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "back.out(1.7)", // bounce nhẹ khi tới vị trí cuối
          },
          i * 0.3, // delay giữa từng cặp
        );
      });

      // Ảnh trung tâm xuất hiện sau khi các feature gần hoàn tất
      tl.fromTo(
        ".center-image",
        { opacity: 0, scale: 0.9, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.4)",
        },
        "-=0.3",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 bg-white flex justify-center"
    >
      <div className="w-11/12 xl:w-8/12 lg:w-10/12 flex flex-col justify-center items-center">
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t("weDo")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold max-w-xl mx-auto leading-snug">
            {t("advantageTitle")}
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-12/12 xl:w-10/12 items-center">
          {/* Left Features */}
          <div className="space-y-10">
            {featuresLeft.map((feature, index) => (
              <div
                key={index}
                className="feature-left flex items-center justify-end text-right gap-4"
              >
                <div>
                  <h3 className="font-bold text-lg text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    {feature.desc}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center center-image">
            <Image
              src="/advantages-image.jpg"
              alt="Eco scooter"
              width={500}
              height={500}
              className="object-cover xl:h-72 lg:h-60"
            />
          </div>

          {/* Right Features */}
          <div className="space-y-10">
            {featuresRight.map((feature, index) => (
              <div
                key={index}
                className="feature-right flex items-center text-left gap-4"
              >
                <div className="bg-primary p-4 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
