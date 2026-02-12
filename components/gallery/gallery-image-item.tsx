"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ImageItem({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  /** 🎯 GSAP DROP ANIMATION (soft + quick) */
  useEffect(() => {
    if (!loaded || !wrapperRef.current) return;

    gsap.fromTo(
      wrapperRef.current,
      {
        opacity: 0,
        y: -12,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        delay: index * 0.02, // nhẹ nhàng, nhanh hơn
      },
    );
  }, [loaded]);

  /** 🎯 Hover Zoom */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const hoverIn = () =>
      gsap.to(el, { scale: 1.03, duration: 0.25, ease: "power2.out" });
    const hoverOut = () =>
      gsap.to(el, { scale: 1, duration: 0.25, ease: "power2.out" });

    el.addEventListener("mouseenter", hoverIn);
    el.addEventListener("mouseleave", hoverOut);

    return () => {
      el.removeEventListener("mouseenter", hoverIn);
      el.removeEventListener("mouseleave", hoverOut);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden rounded-xl"
    >
      <Image
        src={src}
        alt=""
        width={500}
        height={600}
        loading="lazy"
        onLoadingComplete={() => setLoaded(true)}
        className="w-full h-auto object-cover rounded-xl"
      />
    </div>
  );
}
