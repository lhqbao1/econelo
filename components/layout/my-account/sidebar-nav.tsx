"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { UserIcon, Heart, MapPin, Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface MyAccountSideBarProps {
  user?: User;
}

export default function MyAccountSideBar({ user }: MyAccountSideBarProps) {
  const t = useTranslations();
  return (
    <>
      <TabsTrigger
        value="orders"
        className="w-full justify-start gap-2 data-[state=active]:bg-gray-100 rounded-lg px-3 py-2"
      >
        <Package className="w-4 h-4" /> {t("orders")}
      </TabsTrigger>

      <TabsTrigger
        value="favorites"
        className="w-full justify-start gap-2 data-[state=active]:bg-gray-100 rounded-lg px-3 py-2"
      >
        <Heart className="w-4 h-4" /> {t("favorites")}
      </TabsTrigger>

      <TabsTrigger
        value="profile"
        className="w-full justify-start gap-2 data-[state=active]:bg-gray-100 rounded-lg px-3 py-2"
      >
        <UserIcon className="w-4 h-4" /> {t("profile")}
      </TabsTrigger>

      <TabsTrigger
        value="addresses"
        className="w-full justify-start gap-2 data-[state=active]:bg-gray-100 rounded-lg px-3 py-2"
      >
        <MapPin className="w-4 h-4" /> {t("address")}
      </TabsTrigger>
    </>
  );
}
