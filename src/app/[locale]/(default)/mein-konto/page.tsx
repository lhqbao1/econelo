"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/features/users/api";
import MyAccountSideBar from "@/components/layout/my-account/sidebar-nav";
import MyAccountOrders from "@/components/layout/my-account/tabs/orders";
import MyAccountFavorites from "@/components/layout/my-account/tabs/favorites";
import MyAccountProfile from "@/components/layout/my-account/tabs/profile";
import MyAccountAddress from "@/components/layout/my-account/tabs/address";
import MyAccountSkeleton from "@/components/layout/my-account/skeleton";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";

export default function MyAccountPage() {
  const [userId, setUserId] = useAtom(userIdAtom);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId ?? ""),
    enabled: !!userId,
  });

  const [activeTab, setActiveTab] = useState("profile");
  const contentRef = useRef<HTMLDivElement>(null);

  // ✅ GSAP hiệu ứng nhẹ khi tab đổi
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 },
      );
    }
  }, [activeTab]);

  if (!user || isLoading) return <MyAccountSkeleton />;

  return (
    <div className="flex justify-center bg-gray-50 lg:pt-[140px] pt-[70px]">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-row gap-6 items-start min-h-screen lg:w-9/12 w-11/12"
      >
        {/* Sidebar */}
        <div className="w-64 bg-white p-6 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.1)]">
          <TabsList className="flex flex-col items-start gap-3 w-full bg-white h-full rounded-md">
            <MyAccountSideBar user={user} />
          </TabsList>
        </div>

        {/* Main content */}
        <main
          className="flex-1"
          ref={contentRef}
        >
          <Card className="p-6 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
            {/* <TabsContent value="orders">
              <MyAccountOrders />
            </TabsContent> */}
            <TabsContent value="favorites">
              <MyAccountFavorites />
            </TabsContent>
            <TabsContent value="profile">
              <MyAccountProfile user={user} />
            </TabsContent>
            <TabsContent value="addresses">
              <MyAccountAddress userId={user.id} />
            </TabsContent>
          </Card>
        </main>
      </Tabs>
    </div>
  );
}
