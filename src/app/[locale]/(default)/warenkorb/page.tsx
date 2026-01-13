"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { useCartLocal } from "@/hooks/cart";
import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/features/cart/api";
import { CartItemLocal } from "@/lib/utils/cart";
import { toast } from "sonner";
import CartTable from "@/components/layout/cart/cart-table";
import CartLocalTable from "@/components/layout/cart/cart-local-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginDrawer } from "@/components/shared/login-drawer";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";
import CartTableSkeleton from "@/components/layout/cart/cart-table-skeleton";

export default function CartPage() {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});

  const { cart: localCart } = useCartLocal();

  const {
    data: cart,
    isLoading: isLoadingCart,
    isError: isErrorCart,
  } = useQuery({
    queryKey: ["cart-items", userId],
    queryFn: async () => {
      const response = await getCartItems(); // CartResponse

      // 🧩 Lấy thời gian mới nhất trong từng CartResponseItem (flatten tạm)
      const sorted = [...response].sort((a, b) => {
        const latestA = Math.max(
          ...a.items.map((item) => new Date(item.created_at).getTime()),
        );
        const latestB = Math.max(
          ...b.items.map((item) => new Date(item.created_at).getTime()),
        );
        return latestB - latestA;
      });

      return sorted; // ✅ vẫn trả về CartResponse, không đổi type
    },
    retry: false,
    enabled: !!userId,
  });

  // Nếu có user thì hiển thị cart trên server, không thì localCart
  const displayedCart = useMemo(() => {
    // ❌ No user → dùng localCart
    if (!userId) return localCart;

    // ⏳ Có user nhưng API đang loading → trả empty để render skeleton
    if (isLoadingCart) return null;

    // ❌ Có user nhưng API error → fallback (optional)
    if (isErrorCart) {
      toast.error("Cannot load your cart, please try again.");
      return [];
    }

    // 🎯 Có user + API ok → dùng serverCart
    return cart ?? [];
  }, [userId, localCart, cart, isLoadingCart, isErrorCart]);

  const { updateStatus } = useCartLocal();

  let total = 0;

  if (!userId) {
    // Guest
    total = localCart
      .filter((i) => i.is_active)
      .reduce((acc, item) => {
        const key = item.product_id;
        const qty = localQuantities[key] ?? item.quantity;
        return acc + qty * item.item_price;
      }, 0);
  } else if (cart && !isLoadingCart) {
    // Logged in
    total = cart
      .flatMap((group) => group.items)
      .filter((i) => i.is_active)
      .reduce((acc, item) => {
        const key = item.id;
        const qty = localQuantities[key] ?? item.quantity;
        return acc + qty * item.item_price;
      }, 0);
  }

  // Proceed checkout
  const proceedToCart = () => {
    if (!displayedCart) return;
    if (userId) {
      if (displayedCart.length === 0) {
        toast.error(t("chooseAtLeastCart"));
      } else {
        // Navigate checkout
        router.push("/kasse", { locale });
      }
    } else {
      if (displayedCart.length === 0) {
        toast.error(t("chooseAtLeastCart"));
        return;
      }
      // Nếu chưa login → mở dialog
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center py-10 px-4 relative md:pt-[140px]">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-8">{t("shoppingCart")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
          {/* Left: Cart Items */}
          <div>
            {!userId && (
              <CartLocalTable
                data={localCart}
                onToggleItem={(product_id, is_active) =>
                  updateStatus({ product_id, is_active })
                }
                onToggleAll={(is_active) => {
                  localCart.forEach((item) =>
                    updateStatus({ product_id: item.product_id, is_active }),
                  );
                }}
              />
            )}

            {userId && isLoadingCart && (
              <CartTableSkeleton /> // hoặc cái loading hiện có
            )}

            {userId && !isLoadingCart && cart && (
              <CartTable
                isLoadingCart={isLoadingCart}
                cart={cart ?? []}
                localQuantities={localQuantities}
                setLocalQuantities={setLocalQuantities}
                isCheckout={false}
              />
            )}
          </div>

          {/* Summary */}
          <aside className="space-y-6">
            <Card className="py-4 px-0 border-0 shadow-none border rounded-xl sticky top-20">
              <CardHeader className="pb-0 border-b">
                <CardTitle className="text-xl font-bold text-center">
                  {t("orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Apply Coupon */}
                {/* <div className="flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-muted-foreground" />
                  <Input placeholder={t("applyCoupons")} className="flex-1" />
                  <Button className="bg-secondary/85 hover:bg-secondary cursor-pointer">
                    {t("apply")}
                  </Button>
                </div> */}

                {/* Total */}
                <div className="xl:py-7 py-3 border-b space-y-4">
                  <div className="flex justify-between text-base font-semibold items-center">
                    <span>{t("total")}</span>
                    <span className="text-primary text-xl font-bold">
                      €
                      {total.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <Button
                    className="w-full bg-primary py-5 cursor-pointer"
                    onClick={proceedToCart}
                  >
                    {t("proceedToCheckout")}
                  </Button>
                </div>

                {/* Info */}
                <p className="text-xs text-muted-foreground flex items-center gap-2 text-center">
                  <span></span> {t("safePaymentsInfo")}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      <LoginDrawer
        openLogin={isLoginOpen}
        setOpenLogin={setIsLoginOpen}
        isCheckOut
      />
    </div>
  );
}
