"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageItem from "./gallery-image-item";
import { useTranslations } from "next-intl";

export default function ImageGallery() {
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const t = useTranslations();

  const imageGalleryList = [
    ...Array.from({ length: 30 }, (_, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `/J1000/J1000_detail_${num}.jpg`;
    }),

    ...Array.from({ length: 30 }, (_, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `/J1000/J4000_premium_${num}.jpg`;
    }),
  ];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const visibleImages = imageGalleryList.slice(0, page * PAGE_SIZE);

  /** Infinite Scroll */
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { threshold: 0.3 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /** Columns responsive */
  const getColumns = () =>
    window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4;

  const [columns, setColumns] = useState(4);

  useEffect(() => {
    setColumns(getColumns());
    const resize = () => setColumns(getColumns());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /** Masonry grouping */
  const colArr: string[][] = Array.from({ length: columns }, () => []);
  visibleImages.forEach((src, i) => colArr[i % columns].push(src));

  return (
    <section className="w-full py-12">
      <h2 className="text-2xl font-bold mb-6">{t("imageGallery")}</h2>

      <div className="flex gap-4 w-full">
        {colArr.map((col, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-col gap-4 w-full"
          >
            {col.map((src, i) => (
              <ImageItem
                key={i}
                src={src}
                index={i}
              />
            ))}
          </div>
        ))}
      </div>

      <div
        ref={loadMoreRef}
        className="h-10"
      ></div>
    </section>
  );
}
