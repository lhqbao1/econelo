"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (currentProduct?.id) {
      methods.setValue("productId", currentProduct.id);
      methods.setValue(
        "option_id",
        currentProduct.options.map((o: VariantOptionResponse) => o.id), // auto select option mặc định
      );
    }
  }, [currentProduct, methods]);

  // handle wishlist (optional)
  const handleAddProductToWishlist = () => {
    addProductToWishlistMutation.mutate(
      { productId: currentProduct?.id ?? "", quantity: 1 },
      {
        onSuccess: () => {
          toast.success(t("addToWishlistSuccess"));
        },
        onError: (error) => {
          const { status, message } = HandleApiError(error, t);
          toast.error(message);
        },
      },
    );
  };

  const onSubmit = (values: FormValues) => {
    if (!currentProduct) return;

    if (!userId) {
      const existingItem = cart.find(
        (item: CartItemLocal) => item.product_id === currentProduct.id,
      );
      const totalQuantity = (existingItem?.quantity || 0) + values.quantity;

      if (totalQuantity > currentProduct.stock) {
        toast.error(t("notEnoughStock"));
        return;
      }

      addToCartLocal(
        {
          item: {
            product_id: currentProduct.id ?? "",
            quantity: values.quantity,
            is_active: true,
            item_price: currentProduct.final_price,
            final_price: currentProduct.final_price,
            img_url:
              currentProduct.static_files.length > 0
                ? currentProduct.static_files[0].url
                : "",
            product_name: currentProduct.name,
            stock: currentProduct.stock,
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
        { productId: currentProduct?.id ?? "", quantity: values.quantity },
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

  // optionally watch quantity to disable buy button if zero or > stock
  const quantity = watch("quantity");

  const carrier = currentProduct?.carrier ?? "default";

  const shippingCostMap: Record<string, number> = {
    amm: 35.95,
    spedition: 35.95,
  };

  const shippingCost = shippingCostMap[carrier] ?? 5.95;

  const totalWithShipping = Number(currentProduct.final_price) + shippingCost;

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
                <label>{t("subTotalInclude")}</label>
                <span>{formatEUR(currentProduct.final_price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <label>{t("shippingCost")}</label>
                <span>{formatEUR(shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-black text-lg">
                <label>{t("total")}</label>
                <span>{formatEUR(totalWithShipping)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="bg-primary w-full rounded-md py-6"
              disabled={
                quantity <= 0 ||
                quantity > currentProduct.stock ||
                createCartMutation.isPending
              }
            >
              {createCartMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                t("addToCart")
              )}
            </Button>

            {/* optional wishlist button */}
            {/* <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddProductToWishlist}
                disabled={addProductToWishlistMutation.isPending}
              >
                {addProductToWishlistMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  t("addToWishlist")
                )}
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

export default BuySection;
