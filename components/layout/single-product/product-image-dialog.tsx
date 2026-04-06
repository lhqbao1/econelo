"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductItem } from "@/types/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageDialogProps {
  productDetails: ProductItem;
  children: React.ReactNode;
}

export default function ProductImageDialog({
  productDetails,
  children,
}: ProductImageDialogProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const safeImages = Array.isArray(productDetails?.static_files)
    ? productDetails.static_files.filter(
        (file) => typeof file?.url === "string" && file.url.trim().length > 0,
      )
    : [];
  const images =
    safeImages.length > 0 ? safeImages : [{ url: "/placeholder-product.webp" }];
  const safeProductName =
    typeof productDetails?.name === "string" && productDetails.name.trim().length > 0
      ? productDetails.name
      : "Produkt";

  const handleZoomImage = (e: React.MouseEvent) => {
    if (!zoom) {
      const rect = imageContainerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
      }
    }
    setZoom(!zoom);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="p-6 lg:h-[90vh] lg:w-[calc(100%-8rem)] h-[calc(100%-3rem)] w-full left-0"
        aria-describedby=""
      >
        <DialogTitle className="hidden" />
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Main image */}
          <div
            ref={imageContainerRef}
            className="col-span-12 lg:col-span-8 flex items-center justify-center lg:max-h-[85vh] max-h-[40vh] relative overflow-hidden cursor-zoom-in"
            onClick={handleZoomImage}
          >
            <Image
              src={
                images[mainImageIndex]?.url ??
                images[0]?.url ??
                "/placeholder-product.webp"
              }
              alt={safeProductName}
              width={800}
              height={800}
              className={`object-contain h-full w-full transition-transform duration-300 ${
                zoom ? "scale-200 cursor-zoom-out" : "scale-100"
              }`}
              style={
                zoom
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              unoptimized
            />

            {/* Next / Prev buttons */}
            <div
              className="absolute right-2 top-1/2 rounded-full border border-primary p-2 cursor-pointer hover:bg-primary hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setMainImageIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0,
                );
              }}
            >
              <ChevronRight />
            </div>
            <div
              className="absolute left-2 top-1/2 rounded-full border border-primary p-2 cursor-pointer hover:bg-primary hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setMainImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                );
              }}
            >
              <ChevronLeft />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 lg:max-h-[80vh] max-h-[55vh]">
            <h2 className="text-2xl font-semibold">{safeProductName}</h2>

            <div className="grid grid-cols-4 gap-2">
              {images.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMainImageIndex(idx);
                    setZoom(false);
                  }}
                  className={`border-2 rounded-md p-2 overflow-hidden ${
                    mainImageIndex === idx
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={file.url}
                    alt={`Thumbnail ${idx}`}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
