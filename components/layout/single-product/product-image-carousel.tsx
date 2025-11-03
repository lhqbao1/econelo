import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Product,
  ProductItem,
  StaticFile,
  StaticFileItem,
} from "@/types/products";
import type { EmblaCarouselType } from "embla-carousel";
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

  const handleSelectImage = (index: number) => {
    setMainImageIndex(index);
    if (api) api.scrollTo(index); // 👈 scroll đến item vừa click
  };

  return (
    <div className="flex flex-col">
      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={setApi} // 👈 lấy api khi mount
        orientation="vertical"
      >
        <CarouselContent className="w-full flex lg:h-[400px] h-[300px]">
          {productDetails.static_files.map(
            (item: StaticFile, index: number) => (
              <CarouselItem key={index} className="lg:basis-1/4 basis-1/3">
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
                        ? "border-2 border-primary lg:p-1 p-0.5 rounded-md object-cover"
                        : ""
                    } lg:h-[100px] h-[80px] object-cover rounded-md`}
                    priority={index < 2}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>
              </CarouselItem>
            )
          )}
        </CarouselContent>

        {/* <CarouselPrevious className="text-primary border-primary" />
        <CarouselNext className="text-primary border-primary" /> */}
      </Carousel>
    </div>
  );
}
