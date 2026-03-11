"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BlogScrollTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.includes("/blog")) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}
