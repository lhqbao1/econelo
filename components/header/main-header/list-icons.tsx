"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import SearchDrawer from "@/components/search-drawer/search-drawer";
import CartIcon from "./cart-icon";

interface ListIconsProps {
  isSticky: boolean;
}

const ListIcons = ({ isSticky }: ListIconsProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);

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

      <CartIcon isSticky={isSticky} />
    </div>
  );
};

export default ListIcons;
