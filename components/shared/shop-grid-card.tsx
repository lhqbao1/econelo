"use client";
import { useAddToCart } from "@/features/cart/hook";
import { useInventoryPoByProductId } from "@/features/inventory-incoming/hook";
import { useAddToWishList } from "@/features/wishlist/hook";
import { useCartLocal } from "@/hooks/cart";
import { useRouter } from "@/src/i18n/navigation";
import { userIdAtom } from "@/store/auth";
import { ProductItem } from "@/types/products";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useRef } from "react";
import { Button } from "../ui/button";
import { CartItemLocal } from "@/lib/utils/cart";
import { toast } from "sonner";
import { HandleApiError } from "@/lib/api-helper";
import { Eye, ShoppingBasket } from "lucide-react";

interface ShopGridCardProps {
  product: ProductItem;
  idx: number;
}

const ShopGridCard = ({ product, idx }: ShopGridCardProps) => {
  const router = useRouter();
  const [userId, setUserId] = useAtom(userIdAtom);
  const t = useTranslations();
  const queryClient = useQueryClient();
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishList();
  const { addToCartLocal, cart } = useCartLocal();

  const { data: inventoryPo } = useInventoryPoByProductId(product.id);

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
    const baseStock = product.stock ?? 0;
    const usedStock = product.result_stock ?? 0;
    return baseStock - usedStock + incomingStock;
  }, [product.stock, product.result_stock, incomingStock]);

  const effectiveAvailableStock = useMemo(() => {
    const availableFromApi = Number(
      (product as ProductItem & { available?: number }).available,
    );

    if (Number.isFinite(availableFromApi)) {
      return Math.min(availableFromApi, maxStock);
    }

    return maxStock;
  }, [product, maxStock]);

  const isOutOfStock = effectiveAvailableStock <= 0;

  const handleAddToCart = (currentProduct: ProductItem) => {
    if (!currentProduct) return;
    if (isOutOfStock) {
      toast.error(t("notEnoughStock"));
      return;
    }

    if (!userId) {
      const existingItem = cart.find(
        (item: CartItemLocal) => item.product_id === currentProduct.id,
      );
      const totalQuantity = (existingItem?.quantity || 0) + 1;
      if (
        (effectiveAvailableStock > 0 || effectiveAvailableStock === 0) &&
        totalQuantity > effectiveAvailableStock
      ) {
        toast.error(t("notEnoughStock"));
        return;
      }
      addToCartLocal(
        {
          item: {
            product_id: currentProduct.id,
            quantity: 1,
            is_active: true,
            item_price: currentProduct.final_price,
            final_price: currentProduct.final_price,
            img_url:
              currentProduct.static_files.length > 0
                ? currentProduct.static_files[0].url
                : "",
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
    } else {
      addToCartMutation.mutate(
        { productId: currentProduct.id ?? "", quantity: 1 },
        {
          onSuccess() {
            toast.success(t("addToCartSuccess"));
          },
          onError(error) {
            const { status, message } = HandleApiError(error, t);
            if (status === 400) {
              toast.error(t("notEnoughStock"));
              return;
            }
            toast.error(message);
            if (status === 401) router.push("/einloggen");
          },
        },
      );
    }
  };
  return (
    <div
      className="group px-2 py-4 flex flex-col h-full bg-white relative overflow-hidden hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md"
      key={product.id}
    >
      <div className="relative  overflow-hidden mb-4">
        <Link href={`/produkt/${product.url_key}`}>
          {/* Hình sản phẩm */}
          <div className="relative w-full lg:h-72 h-60 rounded-md bg-white overflow-hidden">
            <Image
              src={
                product.static_files?.[0]?.url ?? "/placeholder-product.webp"
              }
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain p-4 lg:p-6 transition-all duration-500 group-hover:scale-110"
            />
          </div>
        </Link>

        {/* Overlay ẩn (GSAP sẽ bật khi hover) */}
        <div
          onClick={() => router.push(`/produkt/${product.url_key}`)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 opacity-0 cursor-pointer"
        >
          <Button
            className="bg-black text-white px-6 py-2 font-semibold rounded-full"
            onClick={() => router.push(`/produkt/${product.url_key}`)}
          >
            {t("learnMore")}
          </Button>
          <Button
            className="bg-lime-400 text-black px-6 py-2 font-semibold rounded-full disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-auto"
            disabled={isOutOfStock || addToCartMutation.isPending}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-6 px-4">
        <div className="space-y-1">
          <p className="text-primary uppercase text-sm font-semibold">
            {product.categories[0].name}
          </p>
          <h3 className="text-base font-black line-clamp-2">{product.name}</h3>
        </div>

        <div
          className="relative h-[60px] overflow-hidden"
          ref={(el) => {
            descRefs.current[idx] = el;
          }}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: product.meta_description,
            }}
            className="text-sm text-gray-700 line-clamp-3 meta-desc inset-0 z-10"
          ></p>

          {/* Layout mới (ẩn ban đầu) */}
          <div className="absolute inset-0 flex items-center gap-3 justify-center opacity-0 pointer-events-none bottom-overlay z-20">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 text-primary cursor-pointer disabled:cursor-not-allowed"
              disabled={isOutOfStock || addToCartMutation.isPending}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
            >
              <ShoppingBasket className="size-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 hover:bg-black hover:text-white"
              onClick={() => router.push(`/produkt/${product.url_key}`)}
            >
              <Eye className="size-5" />
            </Button>
            {/* <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-300 hover:bg-black hover:text-white"
                  onClick={() => handleAddToWishlist(product)}
                >
                  <Heart className="size-5" />
                </Button> */}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <p className="text-base font-bold">
            €{" "}
            {(product.final_price ?? product.price).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
            })}
          </p>
          {product.price > product.final_price && (
            <p className="text-base line-through text-gray-500">
              €{" "}
              {product.price.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopGridCard;
