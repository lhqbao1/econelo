"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ListVariant from "./list-variant";
import { VariantOptionResponse, VariantOptionsResponse } from "@/types/variant";
import { ProductItem } from "@/types/products";
import { ProductGroupDetailResponse } from "@/types/product-group";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cartFormSchema } from "@/lib/schema/cart";
import { useAddToCart } from "@/features/cart/hook";
import { useAddToWishList } from "@/features/wishlist/hook";
import { toast } from "sonner";
import { HandleApiError } from "@/lib/api-helper";
import { useCartLocal } from "@/hooks/cart";
import { CartItemLocal } from "@/lib/utils/cart";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";
import { formatEUR } from "@/lib/format-euro";
import { useInventoryPoByProductId } from "@/features/inventory-incoming/hook";

interface BuySectionProps {
  variant?: VariantOptionsResponse[];
  currentProduct: ProductItem;
  parentProduct?: ProductGroupDetailResponse | null;
}

type FormValues = z.infer<typeof cartFormSchema>;

const BuySection = ({
  variant,
  currentProduct,
  parentProduct,
}: BuySectionProps) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [userId, setUserId] = useAtom(userIdAtom);

  // form
  const methods = useForm<FormValues>({
    resolver: zodResolver(cartFormSchema),
    defaultValues: {
      productId: "",
      option_id: [],
      quantity: 1,
      is_active: false,
    },
  });

  const { handleSubmit, setValue, watch } = methods;

  // local cart hook & mutations
  const { addToCartLocal, cart } = useCartLocal();
  const createCartMutation = useAddToCart();
  const addProductToWishlistMutation = useAddToWishList();

  const currentProductId =
    typeof currentProduct?.id === "string" ? currentProduct.id : "";
  const currentProductOptions = Array.isArray(currentProduct?.options)
    ? currentProduct.options
    : [];
  const currentProductStaticFiles = Array.isArray(currentProduct?.static_files)
    ? currentProduct.static_files
    : [];
  const currentFinalPrice = Number(currentProduct?.final_price);
  const currentListPrice = Number(currentProduct?.price);
  const safeCurrentPrice = Number.isFinite(currentFinalPrice)
    ? currentFinalPrice
    : Number.isFinite(currentListPrice)
      ? currentListPrice
      : 0;

  useEffect(() => {
    if (currentProductId) {
      methods.setValue("productId", currentProductId);
      methods.setValue(
        "option_id",
        currentProductOptions.map((o: VariantOptionResponse) => o.id), // auto select option mặc định
      );
    }
  }, [currentProductId, currentProductOptions, methods]);

  // optionally watch quantity to disable buy button if zero or > stock
  const quantity = watch("quantity");

  const carrier = currentProduct?.carrier ?? "default";
  const isFreeShippingProduct =
    currentProduct?.id === "3c774b42-1778-4ac5-9c56-3ae6eaf8b19f";

  const shippingCostMap: Record<string, number> = {
    amm: 35.95,
    spedition: 35.95,
  };

  const shippingCost = isFreeShippingProduct
    ? 0
    : (shippingCostMap[carrier] ?? 5.95);

  const totalWithShipping = safeCurrentPrice + shippingCost;

  const { data: inventoryPo } = useInventoryPoByProductId(currentProductId);

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

  const onSubmit = (values: FormValues) => {
    if (!currentProduct) return;
    if (!currentProductId) {
      toast.error(t("addToCartFail"));
      return;
    }

    if (!userId) {
      const existingItem = cart.find(
        (item: CartItemLocal) => item.product_id === currentProductId,
      );
      const totalQuantity = (existingItem?.quantity || 0) + 1;
      if ((maxStock > 0 || maxStock === 0) && totalQuantity > maxStock) {
        toast.error(t("notEnoughStock"));
        return;
      }

      addToCartLocal(
        {
          item: {
            product_id: currentProductId,
            quantity: values.quantity,
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
            carrier: currentProduct.carrier ? currentProduct.carrier : "amm",
            id_provider: currentProduct.id_provider
              ? currentProduct.id_provider
              : "",
            delivery_time: currentProduct.delivery_time
              ? currentProduct.delivery_time
              : "",
          },
        },
        {
          onSuccess(data, variables, context) {
            toast.success(t("addToCartSuccess"));
          },
          onError(error, variables, context) {
            toast.error(t("addToCartFail"));
          },
        },
      );
    } else {
      createCartMutation.mutate(
        { productId: currentProductId, quantity: values.quantity },
        {
          onSuccess(data, variables, context) {
            toast.success(t("addToCartSuccess"));
          },
          onError(error, variables, context) {
            const { status, message } = HandleApiError(error, t);
            if (status === 400) {
              toast.error(t("notEnoughStock"));
              return;
            }
            toast.error(message);
            if (status === 401) router.push("/einloggen", { locale });
          },
        },
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{t("buyThis")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ListVariant
              variant={variant}
              currentProduct={currentProduct}
              parentProduct={parentProduct}
            />

            <Separator className="my-4" />

            <div className="space-y-2 pb-4">
              <div className="flex justify-between items-center">
                <label className="3xl:text-base text-sm">
                  {t("subTotalInclude")}
                </label>
                <span className="3xl:text-base text-sm">
                  {formatEUR(safeCurrentPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <label className="3xl:text-base text-sm">
                  {t("shippingCost")}
                </label>
                <span className="3xl:text-base text-sm">
                  {formatEUR(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between items-center font-semibold text-black text-lg">
                <label>{t("total")}</label>
                <span>{formatEUR(totalWithShipping)}</span>
              </div>
            </div>

            {maxStock > 0 ? (
              <Button
                type="submit"
                className="bg-primary w-full rounded-md py-6"
              >
                {createCartMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  t("addToCart")
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-primary w-full rounded-md py-6 bg-gray-500 text-white cursor-not-allowed"
                disabled
              >
                {createCartMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  t("addToCart")
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

export default BuySection;
