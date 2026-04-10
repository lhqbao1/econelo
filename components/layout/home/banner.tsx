"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HoverButton from "../../shared/hover-button";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  {
    label: "FB",
    href: "https://www.facebook.com/econelo.de",
    ariaLabel: "Econelo on Facebook",
  },
  {
    label: "INS",
    href: "https://www.instagram.com/econelo.de",
    ariaLabel: "Econelo on Instagram",
  },
  {
    label: "YT",
    href: "https://www.youtube.com/@econelo",
    ariaLabel: "Econelo on YouTube",
  },
];

const HomeBanner = () => {
  const t = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([contentRef.current, imageRef.current, socialRef.current], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        contentRef.current,
        { x: -48, y: 12, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.78 },
      );

      tl.fromTo(
        imageRef.current,
        { x: 110, opacity: 0, scale: 0.9 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.05,
          ease: "power4.out",
        },
        "-=0.42",
      );

      tl.fromTo(
        socialRef.current,
        { x: -22, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        "-=0.65",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate z-10 w-full overflow-hidden bg-primary min-h-[56vh] sm:min-h-[58vh] lg:min-h-[70vh] xl:min-h-[80vh]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(128deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_44%)]" />
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/18 blur-3xl md:-left-14 md:h-80 md:w-80" />
        <div className="absolute -right-20 bottom-10 h-[24rem] w-[24rem] rounded-full bg-white/12 blur-3xl xl:h-[28rem] xl:w-[28rem]" />
        <div className="absolute inset-y-0 right-0 hidden w-[72%] bg-white/8 [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)] xl:block" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1680px] min-h-[56vh] flex-col justify-center px-4 py-8 sm:min-h-[58vh] sm:px-6 sm:py-9 md:px-10 md:py-10 lg:min-h-[70vh] lg:px-12 lg:py-10 xl:min-h-[80vh] xl:px-20 xl:py-12">
        <div className="relative">
          <div
            ref={socialRef}
            className="absolute left-0 top-1/2 z-30 hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center xl:gap-10"
          >
            <div className="flex flex-col items-center gap-2 text-black/90">
              <span className="rotate-180 text-xs font-semibold uppercase tracking-[0.34em] [writing-mode:vertical-rl]">
                {t("followUs")}
              </span>
              <span className="h-24 w-px bg-black/70" />
            </div>

            <nav aria-label="Social media">
              <ul className="flex rotate-180 flex-row items-center gap-8 text-xs font-semibold tracking-[0.2em] text-black/85 [writing-mode:vertical-rl]">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none"
                    >
                      {social.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div
            ref={imageRef}
            className="relative z-10 mx-auto w-full max-w-[1120px] opacity-0 xl:max-w-none xl:-mr-4 2xl:-mr-10"
          >
            <div className="pointer-events-none absolute inset-x-[4%] bottom-[8%] top-[10%] rounded-[46%] bg-gradient-to-br from-white/70 via-white/18 to-transparent blur-[80px] xl:inset-x-[12%] xl:bottom-[12%] xl:top-[12%] xl:blur-[100px]" />
            <div className="pointer-events-none absolute inset-x-[12%] bottom-[7%] h-[20%] rounded-full bg-black/35 blur-3xl xl:inset-x-[22%]" />
            <Image
              src={"/banner-3.png"}
              width={1250}
              height={820}
              alt={t("bannerSlogan")}
              priority
              sizes="(max-width: 640px) 96vw, (max-width: 1024px) 90vw, (max-width: 1280px) 82vw, 62vw"
              className="relative z-10 h-auto w-full scale-[1.12] object-contain object-center drop-shadow-[0_28px_40px_rgba(0,0,0,0.38)] sm:scale-[1.1] md:scale-[1.06] lg:scale-[1.04] xl:scale-100 xl:origin-bottom 2xl:scale-[1.04]"
            />
          </div>
        </div>

        <div
          ref={contentRef}
          className="relative z-20 mx-auto mt-4 w-full max-w-[320px] opacity-0 sm:mt-6 sm:max-w-[360px] md:max-w-[430px] lg:max-w-[520px] xl:absolute xl:bottom-5 xl:left-1/2 xl:mt-0 xl:max-w-[500px] xl:-translate-x-1/2 2xl:bottom-6 2xl:max-w-[540px]"
        >
          <div className="rounded-[22px] border border-white/55 bg-white/16 p-3 shadow-[0_18px_56px_rgba(0,0,0,0.2)] backdrop-blur-md sm:rounded-[24px] sm:p-5 xl:rounded-[26px] xl:p-7">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-white/55" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90">
                Econelo
              </span>
              <span className="h-px w-10 bg-white/55" />
            </div>

          <div className="flex justify-center xl:hidden">
            <Link
              href="/alle-produkte"
              className="flex w-fit items-center gap-2 rounded-tl-3xl rounded-br-3xl bg-black px-8 py-3 transition-all duration-500 hover:rounded-tl-none hover:rounded-br-none hover:rounded-tr-3xl"
            >
              <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.08em] text-white sm:text-xs">
                {t("forThem")}
              </span>
              <ArrowRight className="size-4 text-white" />
            </Link>
          </div>

          <div className="hidden justify-center xl:flex">
            <HoverButton text={t("forThem")} redirect_url="/alle-produkte" />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HomeBanner;
