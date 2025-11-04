"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import { NavBar } from "./main-header/nav-bar";
import ListIcons from "./main-header/list-icons";
import HoverButton from "../shared/hover-button";
import { usePathname } from "@/src/i18n/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/auth/api";

const MainHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);

  // ✅ Lấy userId từ localStorage (sau khi client mount)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  // ✅ Gọi API user info khi đã có userId
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["me", userId],
    queryFn: () => getMe(), // hàm useMe() sẽ gọi API getMe()
    enabled: !!userId,
    retry: false,
  });

  // ✅ Sticky header logic
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
          : "block top-0 left-0 bg-white text-black shadow-md -translate-y-0"
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

          {/* Right side: Contact + Login/User */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <PhoneCall className="text-black" />
              <div className="font-semibold text-xl text-black">
                +49 1520 6576540
              </div>
            </div>

            {/* ✅ Hiển thị user hoặc Login */}
            {userId && user ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">
                  Hello, {user.first_name} {user.last_name}
                </span>
              </div>
            ) : (
              <HoverButton text="Login" redirect_url="/mein-konto" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
