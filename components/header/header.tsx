"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { NavBar } from "./main-header/nav-bar";
import ListIcons from "./main-header/list-icons";
import HoverButton from "../shared/hover-button";
import { usePathname } from "@/src/i18n/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import gsap from "gsap";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/auth/api";
import SearchDrawer from "../search-drawer/search-drawer";
import CartIcon from "./main-header/cart-icon";
import { AppDrawer } from "../app-drawer/app-drawer";

const MainHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);
  const [userId, setUserId] = useAtom(userIdAtom);

  const t = useTranslations();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQuery({
    queryKey: ["me", userId],
    queryFn: () => getMe(),
    enabled: !!userId,
  });

  // refs for animation
  const contactRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // ✅ animate group when loaded
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: {
        duration: 0.6,
        ease: "back.out(1.7)",
      },
    });

    tl.fromTo(
      contactRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1 },
    ).fromTo(
      buttonRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1 },
      "-=0.5", // overlap a little for smooth timing
    );
  }, []);

  // ✅ Sticky logic
  useEffect(() => {
    const handleScroll = () => {
      const threshold = isHome ? window.innerHeight * 0.5 : 100;
      setIsSticky(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={cn(
        "transition-all duration-500 w-full z-50 transform",
        isHome
          ? isSticky
            ? "fixed top-0 left-0 bg-white text-black shadow-md opacity-100 translate-y-0"
            : "absolute top-10 bg-transparent text-white opacity-100 -translate-y-10"
          : isSticky
            ? "fixed top-0 left-0 bg-white text-black shadow-md translate-y-0"
            : "absolute top-0 left-0 bg-white text-black shadow-md -translate-y-0",
      )}
    >
      <div className="flex 3xl:gap-32 2xl:gap-12 gap-4 xl:px-20 md:px-6 px-4 lg:min-h-[100px] min-h-[60px] items-center">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            src={
              !isHome
                ? "/econelo-logo.png"
                : isSticky
                  ? "/econelo-logo.png"
                  : "/econelo-logo-03.png"
            }
            alt="Econelo Logo"
            width={200}
            height={70}
            className="object-contain transition-all duration-300 cursor-pointer"
          />
        </Link>

        <div className="flex flex-1 3xl:justify-between justify-end gap-4 items-center">
          {/* Left side: Nav + Icons */}
          <div className="items-center gap-8 hidden 2xl:flex">
            <NavBar />
          </div>
          <div className="lg:hidden flex flex-row gap-0 items-center">
            <SearchDrawer isSticky={isSticky} />
            <CartIcon isSticky={isSticky} />
            <AppDrawer isSticky={isSticky} />
          </div>

          {/* ✅ Right side: Contact + Login/User */}
          <div className="lg:flex hidden items-center gap-8">
            {/* Contact Info */}
            <ListIcons isSticky={isSticky} />

            {/* Button (only after user loaded) */}
            <div ref={buttonRef} className="opacity-0">
              <HoverButton
                redirect_url="/einloggen"
                isLogin={!!user}
                is_primary={isHome ? isSticky : true}
                text={
                  user
                    ? `${t("greeting")}, ${user.first_name} ${user.last_name}`
                    : `${t("login")}`
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="items-center gap-8 lg:flex hidden justify-center 2xl:hidden">
        <NavBar />
      </div>
    </header>
  );
};

export default MainHeader;
