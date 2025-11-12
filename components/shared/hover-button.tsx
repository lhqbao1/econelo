"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, User, LogOut, Package } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface HoverButtonProps {
  text?: React.ReactNode; // 👈 Cho phép string hoặc t('...')
  redirect_url: string;
  is_primary?: boolean;
  isLogin?: boolean;
  children?: React.ReactNode;
}

const HoverButton = ({
  text,
  redirect_url,
  is_primary = false,
  isLogin = false,
  children,
}: HoverButtonProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [userId, setUserId] = React.useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("userId") : ""
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    localStorage.removeItem("checkout");
    localStorage.removeItem("payment");

    toast.success("Logged out successfully");

    // Reset react-query cache liên quan đến user/session
    queryClient.removeQueries({ queryKey: ["me"], exact: true });
    queryClient.refetchQueries({ queryKey: ["me"], exact: true });
    queryClient.removeQueries({ queryKey: ["user"], exact: true });
    queryClient.refetchQueries({ queryKey: ["user"], exact: true });
    queryClient.refetchQueries({ queryKey: ["cart-items"], exact: true });

    setUserId(null); // cập nhật lại state để trigger re-render
    // queryClient.removeQueries({ queryKey: ["cart-items"], exact: true });
  };

  if (isLogin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "flex gap-2 w-fit items-center text-center bg-black px-10 group py-4 rounded-tl-3xl rounded-br-3xl cursor-pointer hover:rounded-tl-none hover:rounded-br-none hover:rounded-tr-3xl hover:bg-white transition-all duration-500",
              is_primary ? "hover:bg-primary" : ""
            )}
          >
            <span className="text-white text-sm uppercase font-semibold group-hover:text-black transition-all duration-500">
              {children ?? text}
            </span>
            <ArrowRight className="text-white group-hover:text-black transition-all duration-500" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-full mt-0 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-lg"
        >
          <DropdownMenuItem
            onClick={() => router.push("/meine-bestellungen")}
            className="cursor-pointer flex items-center gap-2 hover:bg-gray-200 hover:shadow-xl"
          >
            <Package className="w-4 h-4 text-gray-600" />
            <span>My Orders</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/mein-konto")}
            className="cursor-pointer flex items-center gap-2"
          >
            <User className="w-4 h-4 text-gray-600" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 🔹 Default (không login)
  return (
    <Link href={redirect_url} passHref>
      <div
        className={cn(
          "flex gap-2 w-fit items-center text-center bg-black px-16 group py-4 rounded-tl-3xl rounded-br-3xl cursor-pointer hover:rounded-tl-none hover:rounded-br-none hover:rounded-tr-3xl hover:bg-white transition-all duration-500",
          is_primary ? "hover:bg-primary" : ""
        )}
      >
        <span className="text-white text-sm uppercase font-semibold group-hover:text-black transition-all duration-500">
          {text}
        </span>
        <ArrowRight className="text-white group-hover:text-black transition-all duration-500" />
      </div>
    </Link>
  );
};

export default HoverButton;
