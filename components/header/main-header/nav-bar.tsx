"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { useGetCategoriesWithChildren } from "@/features/category/hook";

export function NavBar() {
  const t = useTranslations();
  const infoAndAdviceItems = [
    {
      href: "/batteriepflege",
      label: "Batteriepflege",
    },
    {
      href: "/akkus-im-winter",
      label: "Akkus im Winter",
    },
    {
      href: "/hinweis-auf-batteriegesetz",
      label: "Hinweis auf Batteriegesetz",
    },
    {
      href: "/rechtliches",
      label: "Rechtliches",
    },
  ];

  const { data: categories } = useGetCategoriesWithChildren({
    is_econelo: true,
  });

  const groupedCategories = React.useMemo(
    () =>
      (categories ?? []).filter(
        (parent) =>
          parent.name?.trim().length > 0 || (parent.children?.length ?? 0) > 0,
      ),
    [categories],
  );

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem className="">
          <NavigationMenuTrigger
            hasIcon={false}
            className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent"
          >
            <Link href={"/ueber-uns"}>{t("aboutUs")}</Link>
          </NavigationMenuTrigger>
        </NavigationMenuItem>

        {/* <NavigationMenuItem className="">
          <NavigationMenuTrigger
            hasIcon={false}
            className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent"
          >
            <Link href={"/alle-produkte"}>{t("shopAll")}</Link>
          </NavigationMenuTrigger>
        </NavigationMenuItem> */}

        <NavigationMenuItem className="">
          <NavigationMenuTrigger
            hasIcon={true}
            className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent"
          >
            Info und Beratung
          </NavigationMenuTrigger>
          <NavigationMenuContent className="left-0 mt-3 w-[80vw] max-w-[320px] md:w-[80vw] rounded-lg border border-border/70 bg-white shadow-lg group-data-[viewport=false]/navigation-menu:!rounded-sm group-data-[viewport=false]/navigation-menu:!shadow-lg before:hidden">
            <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
              <ul className="flex flex-col">
                {infoAndAdviceItems.map((item) => (
                  <li
                    key={item.href}
                    className="px-4 py-3.5 border-b-2 border-border/80 last:border-b-0 transition-colors hover:bg-muted/30 hover:border-primary"
                  >
                    <Link
                      href={item.href}
                      className="block text-base leading-snug font-medium text-black transition-colors hover:text-primary md:text-base"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="uppercase font-semibold bg-transparent text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent">
            {t("categories")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="left-0 mt-3 w-[94vw] max-w-[1180px] md:left-1/2 md:w-[calc(100vw-4rem)] md:max-w-[1100px] md:-translate-x-1/2 lg:w-[1040px] xl:w-[1180px] rounded-xl border border-border/80 bg-white shadow-[0_40px_90px_-26px_rgba(0,0,0,0.68),0_20px_40px_-18px_rgba(0,0,0,0.46)] group-data-[viewport=false]/navigation-menu:!rounded-sm group-data-[viewport=false]/navigation-menu:!shadow-[0_40px_90px_-26px_rgba(0,0,0,0.68),0_20px_40px_-18px_rgba(0,0,0,0.46)] before:hidden">
            <div className="max-h-[70vh] overflow-y-auto overscroll-contain px-5 py-5 md:px-7 md:py-6">
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groupedCategories.map((parent) => (
                  <li
                    key={parent.id}
                    className="rounded-xl border border-border/70 bg-white p-4 transition-colors hover:border-primary/35"
                  >
                    <Link
                      href={`/kategorie/${parent.slug}`}
                      className="block text-base font-semibold text-black transition-colors hover:text-primary"
                    >
                      {parent.name}
                    </Link>

                    <ul className="mt-3 space-y-1.5">
                      {(parent.children ?? []).map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/kategorie/${child.slug}`}
                            className="block rounded-md px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger
            hasIcon={false}
            className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent"
          >
            <Link href={"/galerie"}>{t("gallery")}</Link>
          </NavigationMenuTrigger>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger
            hasIcon={false}
            className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent"
          >
            <Link href={"/kontakt"}>{t("contactUs")}</Link>
          </NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
