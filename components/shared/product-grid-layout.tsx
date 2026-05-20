"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ProductItem } from "@/types/products";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/navigation";
import { Heart, ShoppingBasket, Star, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useAddToCart } from "@/features/cart/hook";
import { useAddToWishList } from "@/features/wishlist/hook";
import { CART_QUERY_KEY, useCartLocal } from "@/hooks/cart";
import { toast } from "sonner";
import { HandleApiError } from "@/lib/api-helper";
import { CartItemLocal } from "@/lib/utils/cart";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ✅ shadcn carousel import
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import ProductGridCard from "./product-grid-card";

interface ProductsGridLayoutProps {
  hasBadge?: boolean;
  hasPagination?: boolean;
  data: ProductItem[];
  showCategoryLabel?: boolean;
}

const ProductsGridLayout = ({
  data,
  showCategoryLabel = true,
}: ProductsGridLayoutProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    align: "start",
  });

  const { addToCartLocal, cart } = useCartLocal();

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".group");

    cards.forEach((card) => {
      const imgOverlay = card.querySelector("div.absolute.inset-0"); // overlay đầu tiên
      const buttons = imgOverlay?.querySelectorAll("button");

      const metaDesc = card.querySelector(".meta-desc");
      const bottomOverlay = card.querySelector(
        ".meta-desc + div.absolute.inset-0",
      ); // layout mới (3 nút nhỏ)
      const bottomButtons = bottomOverlay?.querySelectorAll("button");

      if (!imgOverlay || !buttons?.length || !metaDesc || !bottomOverlay)
        return;

      // Trạng thái ban đầu
      gsap.set(imgOverlay, { opacity: 0, y: 20, pointerEvents: "none" });
      gsap.set(buttons[0], { opacity: 0, y: -50 });
      gsap.set(buttons[1], { opacity: 0, y: 50 });
      gsap.set(bottomOverlay, { opacity: 0, y: 50, pointerEvents: "auto" }); // ban đầu hiện
      if (bottomButtons && bottomButtons.length >= 2) {
        gsap.set(bottomButtons[0], { opacity: 0, y: -50 });
        gsap.set(bottomButtons[1], { opacity: 0, y: 50 });
      }

      card.addEventListener("mouseenter", () => {
        // Ẩn meta_description và bottom layout
        gsap.to(metaDesc, {
          opacity: 0,
          y: -10,
          duration: 0.25,
          ease: "power2.out",
          pointerEvents: "none", // ✅ khóa click meta
        });
        gsap.to(bottomOverlay, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",

          onStart: () => {
            const buttons = bottomOverlay.querySelectorAll("button");
            if (buttons.length >= 2) {
              gsap.to(buttons[0], {
                opacity: 1,
                y: 0,
                duration: 0.2,
                ease: "power3.out",
              });
              gsap.to(buttons[1], {
                opacity: 1,
                y: 0,
                duration: 0.2,
                ease: "power3.out",
              });
            } else {
              // fallback: nhẹ nhàng nhô lên nếu không đủ 2 nút
              gsap.fromTo(
                buttons,
                { scale: 0.8, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.25,
                  stagger: 0.05,
                  ease: "back.out(1.7)",
                },
              );
            }
          },
        });

        // Hiện overlay ở hình
        gsap.to(imgOverlay, {
          opacity: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(buttons[0], {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power3.out",
        });
        gsap.to(buttons[1], {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power3.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        // Ẩn overlay ở hình (để nút thoát trước rồi mới fade overlay)
        const tl = gsap.timeline();
        tl.to(
          buttons[0],
          {
            opacity: 0,
            y: -50,
            duration: 0.2,
            ease: "power3.inOut",
          },
          0,
        );
        tl.to(
          buttons[1],
          {
            opacity: 0,
            y: 50,
            duration: 0.2,
            ease: "power3.inOut",
          },
          0,
        );
        tl.to(
          imgOverlay,
          {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.25,
            ease: "power2.inOut",
          },
          0.05,
        );

        // Hiện lại meta_description và bottom layout
        gsap.to(metaDesc, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.inOut",
          pointerEvents: "auto", // ✅ bật lại click cho meta
        });
        gsap.to(bottomOverlay, {
          opacity: 0,
          y: 50,
          pointerEvents: "auto",
          duration: 0.25,
          ease: "power2.inOut",
        });
        if (bottomButtons && bottomButtons.length >= 2) {
          gsap.to(bottomButtons[0], {
            opacity: 0,
            y: -50,
            duration: 0.2,
            ease: "power3.inOut",
          });
          gsap.to(bottomButtons[1], {
            opacity: 0,
            y: 50,
            duration: 0.2,
            ease: "power3.inOut",
          });
        }
      });
    });
  }, [data, cart]);

  if (!data?.length) {
    return (
      <p className="text-center text-gray-500 py-10">{t("noProductsFound")}</p>
    );
  }

  return (
    <div className="relative py-6 w-full">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
        ref={emblaRef}
      >
        <CarouselContent className="flex -ml-0">
          {data.map((product, idx) => {
            // Mỗi viewport hiển thị 4 item

            return (
              <ProductGridCard
                product={product}
                idx={idx}
                showCategoryLabel={showCategoryLabel}
              />
            );
          })}
        </CarouselContent>

        {/* Nút điều hướng */}
        <CarouselPrevious className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-black hover:bg-primary text-white hover:text-white transition-all duration-300 w-12 h-12 rounded-none rounded-r-xl"></CarouselPrevious>
        <CarouselNext className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-black text-white hover:text-white transition-all duration-300 w-12 h-12 rounded-none rounded-l-xl"></CarouselNext>
      </Carousel>
    </div>
  );
};

export default ProductsGridLayout;
