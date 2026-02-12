"use client";

import { toast } from "sonner";
import { HandleApiError } from "@/lib/api-helper";
import { useAddToCart } from "@/features/cart/hook";
import { useAddToWishList } from "@/features/wishlist/hook";
import { useCartLocal } from "@/hooks/cart";
import { CartItemLocal } from "@/lib/utils/cart";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ProductItem } from "@/types/products";
import { useInventoryPoByProductId } from "@/features/inventory-incoming/hook";
import { useMemo } from "react";

export function useBuySectionActions(currentProduct: ProductItem) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const { addToCartLocal, cart } = useCartLocal();
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishList();

  const { data: inventoryPo } = useInventoryPoByProductId(currentProduct.id);

  const incomingStock = useMemo(() => {
    const items = Array.isArray(inventoryPo)
      ? inventoryPo
      : inventoryPo
        ? [inventoryPo]
        : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return items.reduce((sum, item) => {
      if (item.list_delivery_date) {
        const deliveryDate = new Date(item.list_delivery_date);
        if (!Number.isNaN(deliveryDate.getTime())) {
          deliveryDate.setHours(0, 0, 0, 0);
          if (deliveryDate < today) {
            return sum;
          }
        }
      }

      return sum + (item.quantity ?? 0);
    }, 0);
  }, [inventoryPo]);

  const maxStock = useMemo(() => {
    const baseStock = currentProduct.stock ?? 0;
    const usedStock = currentProduct.result_stock ?? 0;
    return baseStock - usedStock + incomingStock;
  }, [currentProduct.stock, currentProduct.result_stock, incomingStock]);

  // ⭐ Add to Cart cho user chưa login (Local Cart)
  const addLocal = (quantity: number) => {
    const existingItem = cart.find(
      (item: CartItemLocal) => item.product_id === currentProduct.id,
    );
    const totalQuantity = (existingItem?.quantity || 0) + 1;
    if ((maxStock > 0 || maxStock === 0) && totalQuantity > maxStock) {
      toast.error(t("notEnoughStock"));
      return;
    }

    addToCartLocal(
      {
        item: {
          product_id: currentProduct.id,
          quantity,
          is_active: true,
          item_price: currentProduct.final_price,
          final_price: currentProduct.final_price,
          img_url: currentProduct.static_files?.[0]?.url ?? "",
          product_name: currentProduct.name,
          stock: currentProduct.stock,
          carrier: currentProduct.carrier ?? "amm",
          id_provider: currentProduct.id_provider ?? "",
          delivery_time: currentProduct.delivery_time ?? "",
        },
      },
      {
        onSuccess() {
          toast.success(t("addToCartSuccess"));
        },
        onError() {
          toast.error(t("addToCartFail"));
        },
      },
    );
  };

  // ⭐ Add to Cart khi user login (API)
  const addRemote = (quantity: number) => {
    addToCartMutation.mutate(
      { productId: currentProduct.id, quantity },
      {
        onSuccess() {
          toast.success(t("addToCartSuccess"));
        },
        onError(error) {
          const { status, message } = HandleApiError(error, t);
          if (status === 400) return toast.error(t("notEnoughStock"));
          toast.error(message);
          if (status === 401) router.push("/login", { locale });
        },
      },
    );
  };

  // ⭐ Add to Wishlist
  const addWishlist = () => {
    addToWishlistMutation.mutate(
      { productId: currentProduct.id, quantity: 1 },
      {
        onSuccess() {
          toast.success(t("addToWishlistSuccess"));
        },
        onError(error) {
          const { message } = HandleApiError(error, t);
          toast.error(message);
        },
      },
    );
  };

  return {
    addLocal,
    addRemote,
    addWishlist,
    addToCartMutation,
    addToWishlistMutation,
  };
}
