"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import gsap from "gsap";

export default function GalleryVideoItem({ file }: { file: string }) {
  const videoSrc = `/video/${file}`;
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);

  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /** 🔥 Lazy load khi vào viewport */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /** 🎯 GSAP Drop-in effect (y: -40 → 0) */
  useEffect(() => {
    if (!wrapperRef.current || !loaded) return;

    gsap.fromTo(
      wrapperRef.current,
      {
        opacity: 0,
        y: -40,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      },
    );
  }, [loaded]);

  /** 🎯 Hover zoom effect */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const zoomIn = () =>
      gsap.to(el, { scale: 1.03, duration: 0.25, ease: "power2.out" });
    const zoomOut = () =>
      gsap.to(el, { scale: 1, duration: 0.25, ease: "power2.out" });

    el.addEventListener("mouseenter", zoomIn);
    el.addEventListener("mouseleave", zoomOut);

    return () => {
      el.removeEventListener("mouseenter", zoomIn);
      el.removeEventListener("mouseleave", zoomOut);
    };
  }, []);

  /** ▶ Toggle play/pause */
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play();
      setPlaying(true);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full overflow-hidden group rounded-xl"
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={loaded ? videoSrc : undefined}
        muted
        playsInline
        className="
          w-full h-full object-cover 
          transition-transform duration-500 
          group-hover:scale-110
        "
      />

      {/* PLAY / PAUSE OVERLAY */}
      <button
        ref={overlayRef}
        onClick={togglePlay}
        className="
          absolute inset-0 
          flex items-center justify-center 
          bg-black/30 opacity-0 
          group-hover:opacity-100 
          transition-opacity cursor-pointer
        "
      >
        <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-xl">
          {playing ? (
            <Pause className="w-8 h-8 text-black" />
          ) : (
            <Play className="w-8 h-8 text-black ml-1" />
          )}
        </div>
      </button>
    </div>
  );
}
