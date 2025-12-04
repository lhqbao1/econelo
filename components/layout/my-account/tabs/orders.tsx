"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCheckOutByUserId } from "@/features/checkout/api";
import MyAccountOrdersSkeleton from "../order-skeleton";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";

export default function MyAccountOrders() {
  const [userId, setUserId] = useAtom(userIdAtom);
  const t = useTranslations();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["checkout-user-id", userId],
    queryFn: () => getCheckOutByUserId(userId ?? ""),
    enabled: !!userId,
    retry: false,
  });

  if (isLoading) return <MyAccountOrdersSkeleton />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">{t("orders")}</h2>
      {orders?.length ? (
        orders.map((order: any) => (
          <Card
            key={order.id}
            className="p-4 flex justify-between items-center rounded-md! border-none"
          >
            <div>
              <p className="text-sm text-gray-600">Order #{order.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString()} — €{order.total}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Processing"
                      ? "text-orange-600"
                      : "text-gray-600"
                  }
                >
                  {order.status}
                </span>
              </p>
            </div>
            <Button variant="outline">View Order</Button>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No orders yet.</p>
      )}
    </div>
  );
}
