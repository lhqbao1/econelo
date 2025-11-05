"use client";

import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { CartResponse } from "@/types/cart";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  cart?: CartResponse | any[];
  localCart?: any[];
  shippingCost?: number;
  couponAmount?: number;
  voucherAmount?: number;
  total?: number;
  isLoading?: boolean;
  hasOtherCarrier: boolean;
}

export function CartSummary({
  cart = [],
  localCart = [],
  shippingCost = 0,
  couponAmount = 0,
  voucherAmount = 0,
  total,
  isLoading,
  hasOtherCarrier,
}: CartSummaryProps) {
  const t = useTranslations();

  // Gộp items từ server hoặc local cart
  const items =
    cart && cart.length > 0
      ? cart.flatMap((group) => group.items)
      : localCart ?? [];

  console.log(items);

  const subTotal = items
    ?.filter((i) => i.is_active)
    ?.reduce(
      (sum, item) =>
        sum + (item.final_price ?? item.item_price ?? 0) * (item.quantity ?? 1),
      0
    );

  const totalPrice =
    (subTotal || 0) +
    (shippingCost || 0) -
    (couponAmount || 0) -
    (voucherAmount || 0);

  return (
    <div className="w-full space-y-6">
      <h2 className="text-lg font-semibold">{t("yourOrder")}</h2>

      {/* CART ITEMS */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between py-2">
                <div className="flex gap-3">
                  <div className="bg-gray-200 w-16 h-16 rounded-md" />
                  <div className="flex flex-col gap-2 w-32">
                    <div className="bg-gray-200 h-4 rounded" />
                    <div className="bg-gray-200 h-3 w-1/2 rounded" />
                  </div>
                </div>
                <div className="bg-gray-200 w-12 h-4 rounded" />
              </div>
            ))}
          </div>
        ) : items && items.length > 0 ? (
          items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center gap-6 py-4"
            >
              <div className="flex gap-3 items-center">
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                  <Image
                    src={
                      item.img_url ||
                      item.products?.static_files?.[0]?.url ||
                      "/placeholder.png"
                    }
                    alt={item.name || item.products?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.products?.name || item.product_name}
                  </p>
                </div>
              </div>
              <div className="">
                <p className="font-bold text-gray-800 whitespace-nowrap">
                  €{(item.final_price ?? item.item_price ?? 0).toFixed(2)}
                </p>
                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                  {t("quantity")}: {item.quantity}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">{t("noProductsFound")}</p>
        )}
      </div>

      <Separator />

      {/* SUMMARY */}
      <div className="text-sm space-y-2 col-span-2 lg:col-span-1">
        <div className="flex justify-between items-center">
          <span className="text-right">{t("subTotalInclude")}</span>
          <span className="text-right">
            €
            {(cart && Array.isArray(cart) && cart.length > 0
              ? cart
                  .flatMap((group) => group.items) // gom tất cả items trong từng supplier cart
                  .filter((item) => item.is_active)
                  .reduce((total, item) => total + (item.final_price ?? 0), 0)
              : localCart
                  ?.filter((item) => item.is_active)
                  .reduce(
                    (total, item) =>
                      total + (item.item_price ?? 0) * (item.quantity ?? 1),
                    0
                  ) ?? 0
            ).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-right">
            {hasOtherCarrier ? t("shippingSpedition") : t("shipping")}
          </span>
          <span className="text-right">
            €
            {shippingCost.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-right">{t("discount")}</span>
          <span className="text-right">€0</span>
        </div>
      </div>

      <Separator />

      {/* TOTAL */}
      <div className="flex justify-between items-center pt-2 text-xl font-bold text-gray-900">
        <span className="col-span-3 text-right">{t("total")}</span>
        <span className="text-right col-span-2">
          €
          {(
            (Array.isArray(cart) && cart.length > 0
              ? cart
                  .flatMap((group) => group.items) // gộp tất cả CartItem từ các supplier
                  .filter((item) => item.is_active)
                  .reduce((total, item) => total + (item.final_price ?? 0), 0)
              : localCart
                  ?.filter((item) => item.is_active)
                  .reduce(
                    (total, item) =>
                      total + (item.item_price ?? 0) * (item.quantity ?? 1),
                    0
                  ) ?? 0) +
            (shippingCost ?? 0) -
            (couponAmount ?? 0) -
            (voucherAmount ?? 0)
          ).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
