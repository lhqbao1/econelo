"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { useCartLocal } from "@/hooks/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItems } from "@/features/cart/api";
import { useDeleteCartItem } from "@/features/cart/hook";
import { getProductById } from "@/features/products/api";
import { CartItem, CartResponseItem } from "@/types/cart";
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
  const [userId] = useAtom(userIdAtom);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});

  const {
    cart: localCart,
    updateStatus,
    removeItem: removeLocalCartItem,
  } = useCartLocal();
  const deleteCartItemMutation = useDeleteCartItem();

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
      return [];
    }

    // 🎯 Có user + API ok → dùng serverCart
    return cart ?? [];
  }, [userId, localCart, cart, isLoadingCart, isErrorCart]);

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

  const getServerActiveItems = () => {
    const groups = (Array.isArray(displayedCart) ? displayedCart : []).filter(
      (item): item is CartResponseItem =>
        !!item && Array.isArray((item as CartResponseItem).items),
    );

    return groups
      .flatMap((group) => group.items ?? [])
      .filter((item): item is CartItem => !!item && item.is_active);
  };

  const getLocalActiveItems = () => {
    const items = (Array.isArray(displayedCart) ? displayedCart : []).filter(
      (item): item is CartItemLocal =>
        !!item && !Array.isArray((item as CartResponseItem).items),
    );

    return items.filter((item) => item.is_active);
  };

  const getRemovalReasonText = (reason: "inactive" | "stock") =>
    reason === "inactive"
      ? t("cartRemovedInactive")
      : t("cartRemovedOutOfStock");

  const getEffectiveAvailableStock = (product: {
    stock?: number | null;
    result_stock?: number | null;
    incomming_stock?: number | null;
    available?: number | null;
  }) => {
    const baseStock = Number(product.stock ?? 0);
    const usedStock = Number(product.result_stock ?? 0);
    const incomingStock = Number(product.incomming_stock ?? 0);
    const maxStock = Math.max(0, baseStock - usedStock + incomingStock);
    const apiAvailable = Number(product.available);

    if (Number.isFinite(apiAvailable)) {
      return Math.max(0, Math.min(apiAvailable, maxStock));
    }

    return maxStock;
  };

  // Proceed checkout
  const proceedToCart = async () => {
    if (!displayedCart) return;

    if (userId) {
      const activeItems = getServerActiveItems();

      if (activeItems.length === 0) {
        toast.error(t("chooseAtLeastCart"));
        return;
      }

      const validationResults = await Promise.all(
        activeItems.map(async (item) => {
          const label = item.products?.name ?? item.products?.id_provider ?? "Produkt";

          try {
            const latestProduct = await getProductById(item.products.id);
            const isProductActive = latestProduct?.is_active === true;
            const availableStock = getEffectiveAvailableStock(latestProduct);

            if (!isProductActive) {
              return { item, label, isValid: false, reason: "inactive" as const };
            }

            if (
              !Number.isFinite(availableStock) ||
              availableStock <= 0 ||
              item.quantity > availableStock
            ) {
              return { item, label, isValid: false, reason: "stock" as const };
            }

            return { item, label, isValid: true, reason: "ok" as const };
          } catch {
            const isProductActive = item.products?.is_active === true;
            const availableStock = getEffectiveAvailableStock(item.products);

            if (!isProductActive) {
              return { item, label, isValid: false, reason: "inactive" as const };
            }

            if (
              !Number.isFinite(availableStock) ||
              availableStock <= 0 ||
              item.quantity > availableStock
            ) {
              return { item, label, isValid: false, reason: "stock" as const };
            }

            return { item, label, isValid: true, reason: "ok" as const };
          }
        }),
      );

      const invalidItems = validationResults.filter((result) => !result.isValid);

      if (invalidItems.length > 0) {
        for (const result of invalidItems) {
          try {
            await deleteCartItemMutation.mutateAsync(result.item.id);
            toast.error(
              `${result.label}: ${getRemovalReasonText(result.reason as "inactive" | "stock")}`,
            );
          } catch {
            toast.error(`${result.label}: ${t("cartRemoveFailed")}`);
          }
        }

        await queryClient.invalidateQueries({
          queryKey: ["cart-items", userId],
        });
        await queryClient.invalidateQueries({
          queryKey: ["cart-items"],
        });
        return;
      }

      router.push("/kasse", { locale });
      return;
    }

    const activeItems = getLocalActiveItems();
    if (activeItems.length === 0) {
      toast.error(t("chooseAtLeastCart"));
      return;
    }

    const localValidationResults = await Promise.all(
      activeItems.map(async (item) => {
        const fallbackLabel = item.product_name ?? item.id_provider ?? "Produkt";

        try {
          const latestProduct = await getProductById(item.product_id);
          const isProductActive = latestProduct?.is_active === true;
          const availableStock = getEffectiveAvailableStock(latestProduct);
          const label = latestProduct?.name ?? fallbackLabel;

          if (!isProductActive) {
            return { item, label, isValid: false, reason: "inactive" as const };
          }

          if (
            !Number.isFinite(availableStock) ||
            availableStock <= 0 ||
            item.quantity > availableStock
          ) {
            return { item, label, isValid: false, reason: "stock" as const };
          }

          return { item, label, isValid: true, reason: "ok" as const };
        } catch {
          return {
            item,
            label: fallbackLabel,
            isValid: false,
            reason: "check_failed" as const,
          };
        }
      }),
    );

    if (
      localValidationResults.some((result) => result.reason === "check_failed")
    ) {
      toast.error(t("cartValidationFailed"));
      return;
    }

    const invalidLocalItems = localValidationResults.filter(
      (result) => !result.isValid && result.reason !== "check_failed",
    );

    if (invalidLocalItems.length > 0) {
      for (const result of invalidLocalItems) {
        removeLocalCartItem(result.item.product_id);
        toast.error(
          `${result.label}: ${getRemovalReasonText(result.reason as "inactive" | "stock")}`,
        );
      }
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      return;
    }

    // Nếu chưa login → mở dialog
    setIsLoginOpen(true);
  };

  return (
    <div className="min-h-screen  flex flex-col items-center py-10 px-4 relative md:pt-[140px]">
      <div className="w-full max-w-7xl bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-8">{t("shoppingCart")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.4fr)_minmax(320px,0.9fr)] gap-10">
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
            <Card className="py-4 px-0  shadow-none border rounded-xl sticky top-20">
              <CardHeader className="pb-0 border-b">
                <CardTitle className="text-xl font-bold text-center">
                  {t("orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
