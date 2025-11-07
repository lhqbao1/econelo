"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { PhoneCall } from "lucide-react";
import { NavBar } from "./main-header/nav-bar";
import ListIcons from "./main-header/list-icons";
import HoverButton from "../shared/hover-button";
import { usePathname } from "@/src/i18n/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import gsap from "gsap";
import { useUser } from "@/hooks/useUser";
import { useAtomValue } from "jotai";
import { isUserLoadedAtom } from "@/store/auth";

const MainHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);
  const { user } = useUser();
  const isUserLoaded = useAtomValue(isUserLoadedAtom);

  // refs for animation
  const contactRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // ✅ animate group when loaded
  useEffect(() => {
    if (isUserLoaded) {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.6,
          ease: "back.out(1.7)",
        },
      });

      tl.fromTo(
        contactRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1 }
      ).fromTo(
        buttonRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1 },
        "-=0.5" // overlap a little for smooth timing
      );
    }
  }, [isUserLoaded]);

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
          : "absolute top-0 left-0 bg-white text-black shadow-md -translate-y-0"
      )}
    >
      <div className="flex gap-32 md:px-20 px-4 min-h-[100px] items-center">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            src={"/econelo-logo.png"}
            alt="Econelo Logo"
            width={200}
            height={70}
            className="object-contain"
          />
        </Link>

        <div className="flex flex-1 justify-between gap-4 items-center">
          {/* Left side: Nav + Icons */}
          <div className="flex items-center gap-8">
            <NavBar />
            <ListIcons isSticky={isSticky} />
          </div>

          {/* ✅ Right side: Contact + Login/User */}
          <div className="flex items-center gap-8">
            {/* Contact Info */}
            <div ref={contactRef} className="flex items-center gap-2 opacity-0">
              <PhoneCall className="text-black" />
              <div className="font-semibold text-xl text-black">
                +49 1520 6576540
              </div>
            </div>

            {/* Button (only after user loaded) */}
            {isUserLoaded && (
              <div ref={buttonRef} className="opacity-0">
                <HoverButton
                  redirect_url="/anmelden"
                  isLogin={!!user}
                  is_primary={isHome ? isSticky : true}
                  text={
                    user
                      ? `Hello, ${user.first_name} ${user.last_name}`
                      : "Login"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
