"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { useGetCategories } from "@/features/category/hook";
import { flattenChildCategories } from "@/lib/flattern-categories";

export function NavBar() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const t = useTranslations();

  const {
    data: categories,
    isLoading,
    isError,
  } = useGetCategories({ is_econelo: true });

  const childCategories = React.useMemo(
    () => flattenChildCategories(categories ?? []),
    [categories],
  );

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem className="">
          <NavigationMenuTrigger
            hasIcon={false}
            className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent"
          >
            <Link href={"/ueber-uns"}>{t("aboutUs")}</Link>
          </NavigationMenuTrigger>
        </NavigationMenuItem>

        <NavigationMenuItem className="">
          <NavigationMenuTrigger
            hasIcon={false}
            className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent"
          >
            <Link href={"/alle-produkte"}>{t("shopAll")}</Link>
          </NavigationMenuTrigger>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="uppercase font-semibold bg-transparent text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent">
            {t("categories")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="rounded-xs">
            <ul className="grid gap-2 md:w-[400px] lg:w-[300px]">
              {childCategories?.map((item, index) => {
                return (
                  <ListItem
                    key={item.id}
                    href={`/kategorie/${item.slug}`}
                    title={item.name}
                    className="uppercase"
                  ></ListItem>
                );
              })}
            </ul>
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

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        asChild
        className="group/item block"
      >
        <Link
          href={href}
          className="pl-8 py-5 transition-all duration-300"
        >
          <div className="text-black text-md leading-none font-semibold transition-all duration-400 group-hover/item:pl-2 group-hover/item:text-primary">
            {title}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-md leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
