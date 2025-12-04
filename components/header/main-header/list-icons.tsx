"use client";

import { Search, ShoppingCart } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartLocal } from "@/hooks/cart";
import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/features/cart/api";
import type { CartResponse } from "@/types/cart";
import gsap from "gsap";
import SearchDrawer from "@/components/search-drawer/search-drawer";

interface ListIconsProps {
  isSticky: boolean;
}

const ListIcons = ({ isSticky }: ListIconsProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const [userId, setUserId] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  const { cart: localCart } = useCartLocal();

  const { data: cart, isFetched } = useQuery<CartResponse>({
    queryKey: ["cart-items", userId],
    queryFn: getCartItems,
    enabled: !!userId,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const displayedCart = userId
    ? cart?.reduce((count, group) => count + group.items.length, 0) ?? 0
    : localCart.length;

  // ✅ GSAP hiệu ứng scale-in bounce khi badge xuất hiện
  useEffect(() => {
    if (badgeRef.current && displayedCart > 0 && isFetched) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0, opacity: 0, transformOrigin: "center" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)", // bounce nhẹ
        },
      );
    }
  }, [displayedCart, isFetched]);

  // ✅ Gom logic style
  const baseColor = !isHome ? "primary" : isSticky ? "primary" : "white";
  const iconColor = `text-${baseColor}`;
  const dividerColor = baseColor === "white" ? "bg-white" : `bg-primary`;

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      {/* 🔍 Search Icon */}
      <SearchDrawer iconColor={iconColor} />
      {/* Divider */}
      <div
        className={cn(
          "h-6 w-[1px] transition-colors duration-200",
          dividerColor,
        )}
      />

      {/* 🛒 Cart Icon */}
      <Link href="/warenkorb">
        <button className="relative p-2 hover:scale-110 transition-transform duration-200">
          <ShoppingCart
            className={cn(
              "w-6 h-6 cursor-pointer transition-colors duration-200",
              iconColor,
            )}
            strokeWidth={2}
          />
          {displayedCart > 0 && (
            <span
              ref={badgeRef}
              className={cn(
                "absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full",
                // chỉ khi đang ở Home và chưa sticky → màu cũ
                isHome && !isSticky
                  ? "bg-white text-primary"
                  : "bg-primary text-white",
              )}
            >
              {displayedCart > 99 ? "99+" : displayedCart}
            </span>
          )}
        </button>
      </Link>
    </div>
  );
};

export default React.memo(ListIcons);
