import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { StaticFile, ProductItem } from "@/types/products";
import type { CarouselApi } from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  productDetails: ProductItem;
  mainImageIndex: number;
  setMainImageIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function ProductImageCarousel({
  productDetails,
  mainImageIndex,
  setMainImageIndex,
}: ProductImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "vertical",
  );

  // 🔥 Detect screen size
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const updateOrientation = () =>
      setOrientation(media.matches ? "horizontal" : "vertical");

    updateOrientation(); // run at mount
    media.addEventListener("change", updateOrientation);

    return () => media.removeEventListener("change", updateOrientation);
  }, []);

  const handleSelectImage = (index: number) => {
    setMainImageIndex(index);
    api?.scrollTo(index);
  };

  const safeImages = Array.isArray(productDetails?.static_files)
    ? productDetails.static_files.filter(
        (item) => typeof item?.url === "string" && item.url.trim().length > 0,
      )
    : [];
  const images =
    safeImages.length > 0
      ? safeImages
      : ([{ url: "/placeholder-product.webp" }] as StaticFile[]);

  return (
    <>
      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={setApi}
        orientation={orientation} // ⬅️ switch automatically
      >
        <CarouselContent
          className={`w-full flex ${
            orientation === "vertical"
              ? "md:flex-col flex-row lg:h-[400px] md:h-[300px]"
              : "flex-row"
          }`}
        >
          {images.map(
            (item: StaticFile, index: number) => (
              <CarouselItem
                key={index}
                className={
                  orientation === "vertical"
                    ? "lg:basis-1/4 basis-1/3"
                    : "basis-1/3"
                }
              >
                <div
                  className="cursor-pointer"
                  onClick={() => handleSelectImage(index)}
                >
                  <Image
                    src={item.url}
                    width={100}
                    height={100}
                    alt=""
                    className={`${
                      mainImageIndex === index
                        ? "border-2 border-primary lg:p-1 p-0.5 rounded-md"
                        : ""
                    } lg:h-[100px] h-[80px] object-cover rounded-md`}
                    priority={index < 2}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>
              </CarouselItem>
            ),
          )}
        </CarouselContent>
      </Carousel>
    </>
  );
}
