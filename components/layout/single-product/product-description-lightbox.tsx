"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DescriptionImage = {
  src: string;
  alt: string;
  title: string;
};

interface ProductDescriptionLightboxProps {
  description: string;
}

const getImageTitle = (src: string, alt: string, title: string) => {
  if (title.trim()) return title.trim();
  if (alt.trim()) return alt.trim();

  const cleanSrc = src.split("?")[0]?.split("#")[0] ?? "";
  const fileName = cleanSrc.split("/").pop() ?? "";

  try {
    return decodeURIComponent(fileName) || "Produktbild";
  } catch {
    return fileName || "Produktbild";
  }
};

const getDescriptionImages = (container: HTMLElement | null) => {
  if (!container) return [];

  return Array.from(container.querySelectorAll("img"))
    .map((image) => {
      const src = image.currentSrc || image.getAttribute("src") || "";
      const alt = image.getAttribute("alt") || "";
      const title = image.getAttribute("title") || "";

      return {
        src,
        alt,
        title: getImageTitle(src, alt, title),
      };
    })
    .filter((image) => image.src.trim().length > 0);
};

export default function ProductDescriptionLightbox({
  description,
}: ProductDescriptionLightboxProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<DescriptionImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex];
  const hasMultipleImages = images.length > 1;

  const showPreviousImage = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? Math.max(images.length - 1, 0) : current - 1,
    );
  }, [images.length]);

  const showNextImage = useCallback(() => {
    setActiveIndex((current) =>
      current >= images.length - 1 ? 0 : current + 1,
    );
  }, [images.length]);

  useEffect(() => {
    if (!open || !hasMultipleImages) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, open, showNextImage, showPreviousImage]);

  const handleDescriptionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const imageElement = target.closest("img");
    const container = descriptionRef.current;

    if (!imageElement || !container?.contains(imageElement)) return;

    const nextImages = getDescriptionImages(container);
    const clickedIndex = Array.from(container.querySelectorAll("img")).findIndex(
      (image) => image === imageElement,
    );

    setImages(nextImages);
    setActiveIndex(clickedIndex >= 0 ? clickedIndex : 0);
    setOpen(true);
  };

  return (
    <>
      <div
        ref={descriptionRef}
        className="text-gray-600 leading-relaxed text-wrap [&_img]:my-4 [&_img]:max-w-full [&_img]:cursor-zoom-in [&_img]:rounded-lg [&_img]:border [&_img]:border-gray-100 [&_img]:bg-white [&_img]:shadow-sm [&_img]:transition [&_img:hover]:opacity-90"
        dangerouslySetInnerHTML={{ __html: description }}
        onClick={handleDescriptionClick}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="h-[min(92vh,900px)] w-[96vw] max-w-[min(96vw,1280px)] gap-0 overflow-hidden rounded-3xl border border-gray-200 bg-white p-0 shadow-2xl"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">
            {activeImage?.title ?? "Produktbild"}
          </DialogTitle>

          <div className="flex h-full flex-col bg-white">
            <div className="flex min-h-16 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 md:px-7">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-gray-950 md:text-lg">
                  {activeImage?.title ?? "Produktbild"}
                </p>
                {images.length > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {activeIndex + 1} / {images.length}
                  </p>
                )}
              </div>

              <DialogClose asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-11 w-11 shrink-0 rounded-xl border-gray-200 bg-white text-black shadow-sm hover:bg-gray-50 hover:text-black"
                  aria-label="Bild schliessen"
                >
                  <X className="size-5" />
                </Button>
              </DialogClose>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-white p-4 md:p-6">
              {activeImage && (
                <img
                  src={activeImage.src}
                  alt={activeImage.alt || activeImage.title}
                  className="max-h-full max-w-full rounded-2xl object-contain"
                />
              )}

              {hasMultipleImages && (
                <>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className={cn(
                      "absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-gray-200 bg-white text-black shadow-md",
                      "hover:bg-gray-50 hover:text-black md:left-5 md:h-12 md:w-12",
                    )}
                    aria-label="Vorheriges Bild"
                    onClick={showPreviousImage}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className={cn(
                      "absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-gray-200 bg-white text-black shadow-md",
                      "hover:bg-gray-50 hover:text-black md:right-5 md:h-12 md:w-12",
                    )}
                    aria-label="Naechstes Bild"
                    onClick={showNextImage}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
