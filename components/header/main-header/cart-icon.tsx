"use client";
import { getCartItems } from "@/features/cart/api";
import { CART_QUERY_KEY, useCartLocal } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/src/i18n/navigation";
import { userIdAtom } from "@/store/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ShoppingCart } from "lucide-react";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
interface CartIconProps {
  isSticky: boolean;
}

const CartIcon = ({ isSticky }: CartIconProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);
  const [userId, setUserId] = useAtom(userIdAtom);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const baseColor = !isHome ? "primary" : isSticky ? "primary" : "white";
  const iconColor = `text-${baseColor}`;

  const queryClient = useQueryClient();
  queryClient.getQueryData(CART_QUERY_KEY); // đọc -> subscribe

  //Get cart local and server
  const { cart: localCart } = useCartLocal(); // giữ
  useEffect(() => {
    console.log("localCart changed", localCart);
  }, [localCart]);

  const { data: cart } = useQuery({
    queryKey: ["cart-items", userId],
    queryFn: getCartItems,
    enabled: !!userId,
  });

  console.log(localCart);

  const displayedCart = userId
    ? cart?.reduce((count, group) => count + group.items.length, 0) ?? 0
    : localCart.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ GSAP hiệu ứng scale-in bounce khi badge xuất hiện
  // useEffect(() => {
  //   if (badgeRef.current && displayedCart > 0) {
  //     gsap.fromTo(
  //       badgeRef.current,
  //       { scale: 0, opacity: 0, transformOrigin: "center" },
  //       {
  //         scale: 1,
  //         opacity: 1,
  //         duration: 0.5,
  //         ease: "back.out(1.7)", // bounce nhẹ
  //       },
  //     );
  //   }
  // }, [displayedCart]);

  return (
    <Link href="/warenkorb">
      <button className="relative p-2 hover:scale-110 transition-transform duration-200">
        <ShoppingCart
          className={cn(
            "w-6 h-6 cursor-pointer transition-colors duration-200",
            iconColor,
          )}
          strokeWidth={2}
        />
        {displayedCart > 0 ? (
          <span
            // ref={badgeRef}
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
        ) : (
          ""
        )}
      </button>
    </Link>
  );
};

export default CartIcon;
