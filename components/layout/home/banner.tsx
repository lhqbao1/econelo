"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClockFading, Gauge, ShieldCheck, Weight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HoverButton from "../../shared/hover-button";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const HomeBanner = () => {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // bắt đầu khi 80% màn hình chạm section
        },
      });

      // 🖼️ 1️⃣ Ảnh banner — từ phải sang trái, bounce
      tl.fromTo(
        imageRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "circ.out",
        },
      );

      // 🟢 2️⃣ Tiêu đề — từ phải sang trái
      tl.fromTo(
        titleRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.6", // xuất hiện gần đồng thời
      );

      // 2️⃣ Stats (3 icon) — từng cái từ dưới lên
      const icons = statsRef.current?.querySelectorAll(".stat-item");
      if (icons) {
        tl.fromTo(
          icons,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2, // từng cái cách nhau 0.2s
          },
          "-=0.4", // overlap 1 chút cho mượt
        );
      }

      // 3️⃣ Nút Book Now — từ phải qua trái
      tl.fromTo(
        buttonRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.3",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative lg:min-h-[80vh] min-h-[450px] bg-primary bg-center z-10 md:px-20 px-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <div className="absolute left-20 top-2/5 -translate-y-1/2 lg:flex hidden flex-col items-center gap-12 text-black z-40">
            <div className="flex flex-col items-center gap-2 group">
              <span className="text-sm font-bold tracking-widest [writing-mode:vertical-rl] cursor-pointer rotate-180">
                {t("followUs")}
              </span>
              <div className="relative h-24 w-px bg-black overflow-hidden group cursor-pointer">
                <span className="absolute inset-x-0 -bottom-4 h-0 bg-primary transition-all duration-500 ease-in-out group-hover:h-full" />
              </div>
            </div>

            <ul className="flex flex-row items-center gap-8 text-sm font-semibold [writing-mode:vertical-rl] rotate-180">
              <li>
                <Link href="https://facebook.com">FB</Link>
              </li>
              <li>
                <Link href="https://instagram.com">INS</Link>
              </li>
              <li>
                <Link href="https://youtube.com">YT</Link>
              </li>
            </ul>
          </div>

          <div className="absolute lg:left-1/5 left-1/2 lg:top-2/5 top-1/2 -translate-y-1/2 lg:-translate-x-0 -translate-x-1/2 space-y-8 w-full flex flex-col items-center justify-center lg:block">
            {/* 1️⃣ Tiêu đề */}
            <h1
              ref={titleRef}
              className="
                capitalize 
                text-2xl md:text-5xl 
                lg:font-semibold font-bold 
                lg:max-w-xl max-w-xs 
                lg:pt-40 pt-0 
                text-white opacity-0 
                lg:text-left text-center
                leading-tight md:leading-snug lg:leading-normal
              "
            >
              {t("bannerSlogan")}
            </h1>

            {/* 2️⃣ Stats */}
            {/* <div
              ref={statsRef}
              className="lg:flex hidden gap-12"
            >
              <div className="stat-item space-y-2 flex flex-col items-center opacity-0">
                <Weight
                  className="text-white size-12"
                  strokeWidth={1}
                />
                <div>
                  <div className="text-md font-semibold text-center">
                    {t("maxWeight")}
                  </div>
                  <div className="text-base font-bold text-center">190kg</div>
                </div>
              </div>

              <div className="stat-item space-y-2 flex flex-col items-center opacity-0">
                <ClockFading
                  className="text-white size-12"
                  strokeWidth={1}
                />
                <div>
                  <div className="text-md font-semibold text-center">
                    0-40 km/hr in
                  </div>
                  <div className="text-base font-bold text-center">3.3 sec</div>
                </div>
              </div>

              <div className="stat-item space-y-2 flex flex-col items-center opacity-0">
                <ShieldCheck
                  className="text-white size-12"
                  strokeWidth={1}
                />
                <div>
                  <div className="text-md font-semibold text-center">
                    {t("range")}
                  </div>
                  <div className="text-base font-bold text-center">40 km</div>
                </div>
              </div>
            </div> */}

            {/* 3️⃣ Button */}
            <div
              ref={buttonRef}
              className="opacity-0"
            >
              <HoverButton
                text={t("forThem")}
                redirect_url="/produkt/econelo-j1000-seniorenmobil-nicht-strassenzulaessig-25-km-h-1000w-rot-1000014"
              />
            </div>
          </div>

          {/* 🖼️ 1️⃣ Image */}
          <div
            ref={imageRef}
            className="absolute right-0 lg:top-9/12 top-10/12 -translate-y-1/2 space-y-8 opacity-0 z-40 hidden lg:block"
          >
            <Image
              src={"/J1000-banner.png"}
              width={1200}
              height={800}
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
