import { ProductItem } from "@/types/products";
import React, { useMemo, useRef } from "react";
import { CarouselItem } from "../ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "@/src/i18n/navigation";
import { Button } from "../ui/button";
import { useAddToCart } from "@/features/cart/hook";
import { useAddToWishList } from "@/features/wishlist/hook";
import { CART_QUERY_KEY, useCartLocal } from "@/hooks/cart";
import { CartItemLocal } from "@/lib/utils/cart";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { HandleApiError } from "@/lib/api-helper";
import { Eye, ShoppingBasket } from "lucide-react";
import { useInventoryPoByProductId } from "@/features/inventory-incoming/hook";

interface ProductGridCard {
  product: ProductItem;
  idx: number;
}

const ProductGridCard = ({ product, idx }: ProductGridCard) => {
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
  const safeStaticFiles = Array.isArray(product?.static_files)
    ? product.static_files
    : [];
  const primaryImageUrl = safeStaticFiles[0]?.url ?? "/placeholder-product.webp";
  const productName =
    typeof product?.name === "string" && product.name.trim().length > 0
      ? product.name
      : "Produkt";
  const productCategoryName =
    product?.categories?.[0]?.name?.trim() || "Unkategorisiert";
  const rawUrlKey =
    typeof product?.url_key === "string" ? product.url_key.trim() : "";
  const productDetailPath = rawUrlKey ? `/produkt/${rawUrlKey}` : "/alle-produkte";
  const safeMetaDescription =
    typeof product?.meta_description === "string" ? product.meta_description : "";
  const listPrice = Number(product?.price);
  const salePrice = Number(product?.final_price);
  const displayPrice = Number.isFinite(salePrice)
    ? salePrice
    : Number.isFinite(listPrice)
      ? listPrice
      : 0;
  const showComparePrice =
    Number.isFinite(listPrice) &&
    Number.isFinite(salePrice) &&
    listPrice > salePrice;

  const handleAddToCart = (currentProduct: ProductItem) => {
    if (!currentProduct) return;
    const currentProductId =
      typeof currentProduct.id === "string" ? currentProduct.id : "";
    if (!currentProductId) {
      toast.error(t("addToCartFail"));
      return;
    }

    if (isOutOfStock) {
      toast.error(t("notEnoughStock"));
      return;
    }

    if (!userId) {
      const currentProductStaticFiles = Array.isArray(currentProduct.static_files)
        ? currentProduct.static_files
        : [];
      const currentFinalPrice = Number(currentProduct.final_price);
      const currentListPrice = Number(currentProduct.price);
      const safeCurrentPrice = Number.isFinite(currentFinalPrice)
        ? currentFinalPrice
        : Number.isFinite(currentListPrice)
          ? currentListPrice
          : 0;
      const existingItem = cart.find(
        (item: CartItemLocal) => item.product_id === currentProductId,
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
            product_id: currentProductId,
            quantity: 1,
            is_active: true,
            item_price: safeCurrentPrice,
            final_price: safeCurrentPrice,
            img_url: currentProductStaticFiles[0]?.url ?? "",
            product_name:
              typeof currentProduct.name === "string" &&
              currentProduct.name.trim().length > 0
                ? currentProduct.name
                : "Produkt",
            stock: currentProduct.stock ?? 0,
            carrier: currentProduct.carrier ?? "amm",
            id_provider: currentProduct.id_provider ?? "",
            delivery_time: currentProduct.delivery_time ?? "",
          },
        },
        {
          onSuccess() {
            toast.success(t("addToCartSuccess"));
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
          },
          onError() {
            toast.error(t("addToCartFail"));
          },
        },
      );
    } else {
      addToCartMutation.mutate(
        { productId: currentProductId, quantity: 1 },
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
    <CarouselItem
      key={product.id ?? `product-${idx}`}
      className={`xl:basis-1/4 lg:basis-1/3 basis-full lg:flex-shrink-0 border-b border-r border-gray-200`}
    >
      <div className="group px-2 py-4 flex flex-col h-full bg-white relative overflow-hidden">
        <div className="relative  overflow-hidden mb-4">
          <Link href={productDetailPath}>
            {/* Hình sản phẩm */}
            <div className="relative w-full lg:h-72 h-60 rounded-md bg-white overflow-hidden">
              <Image
                src={primaryImageUrl}
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain p-2 lg:p-2 transition-all duration-500 group-hover:scale-110"
              />
            </div>
          </Link>

          {/* Overlay ẩn (GSAP sẽ bật khi hover) */}
          <div
            onClick={() => router.push(productDetailPath)}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/80 opacity-0 cursor-pointer"
          >
            <Button
              className="bg-black text-white px-6 py-2 font-semibold rounded-full"
              onClick={() => router.push(productDetailPath)}
            >
              {t("learnMore")}
            </Button>
            <Button
              className="bg-lime-400 text-black px-6 py-2 font-semibold rounded-full disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-auto"
              disabled={isOutOfStock || addToCartMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              {t("addToCart")}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-6">
          <div className="space-y-1">
            <p className="text-primary uppercase text-sm font-semibold">
              {productCategoryName}
            </p>
            <h3 className="text-base font-black line-clamp-2">
              {productName}
            </h3>
          </div>

          <div
            className="relative h-[60px] overflow-hidden"
            ref={(el) => {
              descRefs.current[idx] = el;
            }}
          >
            <p
              dangerouslySetInnerHTML={{
                __html: safeMetaDescription,
              }}
              className="text-sm text-gray-700 line-clamp-3 meta-desc inset-0 z-10"
            ></p>

            {/* Layout mới (ẩn ban đầu) */}
            <div className="absolute inset-0 flex items-center gap-3 justify-center opacity-0 pointer-events-none bottom-overlay z-20">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-300 text-primary cursor-pointer"
                disabled={isOutOfStock || addToCartMutation.isPending}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingBasket className="size-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-300 hover:bg-black hover:text-white"
                onClick={() => router.push(productDetailPath)}
              >
                <Eye className="size-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <p className="text-base font-bold">
              € {displayPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
            </p>
            {showComparePrice && (
              <p className="text-base line-through text-gray-500">
                € {listPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>
      </div>
    </CarouselItem>
  );
};

export default ProductGridCard;
