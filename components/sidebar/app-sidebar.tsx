"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetCategories } from "@/features/category/hook";
import { useTranslations } from "next-intl";
import { flattenChildCategories } from "@/lib/flattern-categories";
import { useIsPhone } from "@/hooks/use-is-phone";

const pages = [
  { title: "ABOUT US", href: "/ueber-uns" },
  { title: "OUR HISTORY", href: "/" },
  { title: "FAQ", href: "/" },
  { title: "SHOP", href: "/" },
];

const categories = [
  { title: "SCOOTERS", href: "/kategorie/scooters" },
  { title: "E-BIKES", href: "/kategorie/ebikes" },
  { title: "ACCESSORIES", href: "/kategorie/accessories" },
];

export function AppSidebar() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const isPhone = useIsPhone();
  const {
    open: sidebarOpen,
    setOpen,
    openMobile,
    setOpenMobile,
  } = useSidebar(); // true = expanded, false = collapsed

  const {
    data: categories,
    isLoading,
    isError,
  } = useGetCategories({ is_econelo: true });

  const childCategories = React.useMemo(
    () => flattenChildCategories(categories ?? []),
    [categories]
  );

  // 👉 Animate khi section mở
  useEffect(() => {
    const animateOpen = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -10, height: 0 },
        {
          opacity: 1,
          y: 0,
          height: "auto",
          duration: 0.4,
          ease: "power2.out",
        }
      );
    };

    const animateClose = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        opacity: 0,
        y: -10,
        height: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    if (openSection === "pages") animateOpen(pagesRef);
    else animateClose(pagesRef);

    if (openSection === "categories") animateOpen(categoriesRef);
    else animateClose(categoriesRef);
  }, [openSection]);

  return (
    <Sidebar side="right">
      {/* HEADER */}
      <SidebarHeader className="py-4">
        <div className="flex items-center">
          <SidebarTrigger isClose />
          <div className="flex-1 flex justify-center">
            <Image
              src="/econelo-logo.png"
              width={100}
              height={100}
              alt="Logo"
              className="object-contain h-[40px] w-auto"
            />
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="pt-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 🔹 Pages */}
              <SidebarMenuItem>
                <Collapsible
                  open={openSection === "pages"}
                  onOpenChange={() =>
                    setOpenSection(openSection === "pages" ? null : "pages")
                  }
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full uppercase font-semibold text-sm px-6 py-2 rounded-md hover:bg-gray-100 transition">
                    <span className="font-bold">{t("pages")}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openSection === "pages" ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>

                  <CollapsibleContent ref={pagesRef} className="px-8">
                    <ul className="mt-1 ml-3 flex flex-col gap-1 overflow-hidden">
                      {pages.map((p) => (
                        <li key={p.title}>
                          <Link
                            href={p.href}
                            className="block text-sm font-bold text-black uppercase hover:text-green-600 py-1"
                            onClick={() => {
                              if (isPhone) setOpenMobile(false);
                            }}
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* 🔹 Categories */}
              <SidebarMenuItem>
                <Collapsible
                  open={openSection === "categories"}
                  onOpenChange={() =>
                    setOpenSection(
                      openSection === "categories" ? null : "categories"
                    )
                  }
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full uppercase font-bold text-sm px-6 py-2 rounded-md hover:bg-gray-100 transition">
                    <span>{t("categories")}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openSection === "categories" ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>

                  <CollapsibleContent ref={categoriesRef} className="px-8">
                    <ul className="mt-1 ml-3 flex flex-col gap-1 overflow-hidden">
                      {childCategories?.map((c) => (
                        <li key={c.id}>
                          <Link
                            href={`/kategorie/${c.slug}`}
                            className="block text-sm font-bold text-black uppercase hover:text-green-600 py-1"
                            onClick={() => {
                              if (isPhone) setOpenMobile(false);
                            }}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* 🔹 Contact Us */}
              <SidebarMenuItem>
                <Link
                  href="/kontakt"
                  className="block uppercase font-bold text-sm px-6 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  {t("contactUs")}
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
