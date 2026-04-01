"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlignJustify, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useTranslations } from "next-intl";

import { useGetCategories } from "@/features/category/hook";
import { flattenChildCategories } from "@/lib/flattern-categories";
import { useIsPhone } from "@/hooks/use-is-phone";

/* SHADCN DRAWER */
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

/* COLLAPSIBLE */
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { usePathname } from "@/src/i18n/navigation";

interface AppDrawerProps {
  isSticky: boolean;
}

export function AppDrawer({ isSticky }: AppDrawerProps) {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  const t = useTranslations();
  const isPhone = useIsPhone();

  /* LOAD CATEGORY API */
  const { data: categories } = useGetCategories({ is_econelo: true });
  const childCategories = React.useMemo(
    () => flattenChildCategories(categories ?? []),
    [categories],
  );

  const pages = [
    { title: "ABOUT US", href: "/ueber-uns" },
    { title: "OUR HISTORY", href: "/" },
    { title: "FAQ", href: "/" },
    { title: "SHOP", href: "/" },
  ];

  /* GSAP ANIMATION */
  useEffect(() => {
    const animateOpen = (ref: any) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -10, height: 0 },
        {
          opacity: 1,
          y: 0,
          height: "auto",
          duration: 0.35,
          ease: "power2.out",
        },
      );
    };

    const animateClose = (ref: any) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        opacity: 0,
        y: -10,
        height: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    if (openSection === "pages") animateOpen(pagesRef);
    else animateClose(pagesRef);

    if (openSection === "categories") animateOpen(categoriesRef);
    else animateClose(categoriesRef);
  }, [openSection]);

  const baseColor = !isHome ? "primary" : isSticky ? "primary" : "white";
  const iconColor = `text-${baseColor}`;

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      {/* ICON TO OPEN */}
      <DrawerTrigger asChild>
        <button className="p-2 hover:scale-110 transition-transform duration-200">
          <AlignJustify
            className={cn(
              "w-6 h-6 cursor-pointer transition-colors duration-200",
              iconColor,
            )}
            strokeWidth={2}
          />
        </button>
      </DrawerTrigger>

      {/* DRAWER CONTENT */}
      <DrawerContent className="h-full w-[85%] ml-auto rounded-none px-0">
        {/* HEADER */}
        <DrawerHeader className="border-b px-6 py-4 flex justify-between items-center">
          <DrawerTitle>
            <Image
              src="/econelo-logo.png"
              width={120}
              height={40}
              alt="Logo"
              className="object-contain h-[40px]"
            />
          </DrawerTitle>
        </DrawerHeader>

        {/* BODY */}
        <div className="px-6 py-6 space-y-6">
          {/* 🔹 Pages */}
          <Collapsible
            open={openSection === "pages"}
            onOpenChange={() =>
              setOpenSection(openSection === "pages" ? null : "pages")
            }
          >
            <CollapsibleTrigger className="w-full flex justify-between items-center uppercase font-semibold text-sm py-2">
              <span>{t("pages")}</span>
              <ChevronDown
                className={`size-4 transition-transform ${
                  openSection === "pages" ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent ref={pagesRef} className="pl-3 mt-2 space-y-2">
              {pages.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="block text-sm uppercase hover:text-green-600"
                  onClick={() => setOpen(false)}
                >
                  {p.title}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* 🔹 Categories */}
          <Collapsible
            open={openSection === "categories"}
            onOpenChange={() =>
              setOpenSection(openSection === "categories" ? null : "categories")
            }
          >
            <CollapsibleTrigger className="w-full flex justify-between items-center uppercase font-semibold text-sm py-2">
              <span>{t("categories")}</span>
              <ChevronDown
                className={`size-4 transition-transform ${
                  openSection === "categories" ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent
              ref={categoriesRef}
              className="pl-3 mt-2 space-y-2"
            >
              {childCategories?.map((c) => (
                <Link
                  key={c.id}
                  href={`/kategorie/${c.slug}`}
                  className="block text-sm uppercase hover:text-green-600"
                  onClick={() => setOpen(false)}
                >
                  {c.name}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* 🔹 Contact */}
          <Link
            href="/kontakt"
            className="block uppercase font-bold text-sm py-2 hover:text-green-600"
            onClick={() => setOpen(false)}
          >
            {t("contactUs")}
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
