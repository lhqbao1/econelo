import type { Metadata } from "next";
import "../../globals.css";
import LoginBackground from "@/components/layout/login/bg";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen overflow-hidden overflow-y-scroll min-h-screen">
      <header className="border-b bg-white py-4 px-8 flex items-center justify-between relative">
        {/* Giữ phần này để logo nằm giữa trong không gian trung tâm */}
        <div className="flex-1 flex justify-center">
          <img src="/econelo-logo.png" alt="Econelo" className="h-16" />
        </div>

        {/* Icon giỏ hàng */}
        <Link href={"/warenkorb"} className="absolute right-8">
          <ShoppingBag
            className="w-7 h-7 text-primary cursor-pointer transition-colors duration-200"
            strokeWidth={2}
          />
        </Link>
      </header>
      <main className="flex-1 relative grid grid-cols-1 lg:grid-cols-2">
        {/* Background animation */}
        {children}
      </main>
    </div>
  );
}
