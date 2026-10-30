"use client";

import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { CartResponse } from "@/types/cart";
import { cn } from "@/lib/utils";
import VoucherApply from "./voucher-apply";
import { useAtomValue } from "jotai";
import { currentVoucherAtom } from "@/store/voucher";
import { useFormContext, UseFormReturn, useWatch } from "react-hook-form";
import CheckoutPaymentUI from "../stripe/payment-ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import AGBDialogTrigger from "../sign-up/agb-dialog";
import WiderrufDialogTrigger from "../sign-up/widerruf-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { CreateOrderFormValues } from "@/lib/schema/checkout";
import { OtpDialog } from "./otp-dialog";
import BankDialog from "./bank-dialog";

interface CartSummaryProps {
  form: UseFormReturn<CreateOrderFormValues>;

  cart?: CartResponse | any[];
  localCart?: any[];
  shippingCost?: number;
  couponAmount?: number;
  voucherAmount?: number;
  total?: number;
  isLoading?: boolean;
  hasOtherCarrier: boolean;
  isServerCartMode: boolean;
  submitting: boolean;

  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: (userId: string) => void;
  verifyOtp: (otpInput: string) => void;

  openBankDialog: boolean;
  setOpenBankDialog: (openBankDialog: boolean) => void;
  handleOTP: (values: CreateOrderFormValues) => void;
}

export function CartSummary({
  form,
  cart = [],
  localCart = [],
  shippingCost = 0,

  total,
  isLoading,
  hasOtherCarrier,
  isServerCartMode,
  submitting,

  open,
  onOpenChange,
  email,
  onSuccess,
  verifyOtp,

  openBankDialog,
  setOpenBankDialog,
  handleOTP,
}: CartSummaryProps) {
  // const form = useFormContext();

  const selectedVoucher = useAtomValue(currentVoucherAtom);

  const t = useTranslations();

  const serverCart = Array.isArray(cart) ? cart : [];
  const items = isServerCartMode
    ? serverCart.flatMap((group) => group.items)
    : localCart;

  const voucherAmount = useWatch({
    control: form.control,
    name: "voucher_amount",
  });

  const couponAmount = useWatch({
    control: form.control,
    name: "coupon_amount",
  });

  const orderValue = React.useMemo(() => {
    if (isServerCartMode) {
      return serverCart
        .flatMap((g) => g.items)
        .filter((i) => i.is_active)
        .reduce((s, i) => s + (i.final_price ?? 0), 0);
    }

    return (
      localCart
        ?.filter((i) => i.is_active)
        .reduce((s, i) => s + (i.item_price ?? 0) * (i.quantity ?? 1), 0) ?? 0
    );
  }, [serverCart, localCart, isServerCartMode]);

  // const carrier = React.useMemo<"dpd" | "amm" | undefined>(() => {
  //   if (shippingCost === 35.95) return "amm";
  //   if (shippingCost === 5.95) return "dpd";
  //   return undefined;
  // }, [shippingCost]);

  // const { data: listVouchers, isLoading } = useGetVoucherForCheckout(
  //   {
  //     product_ids: productIds,
  //     user_id: userId,
  //     carrier,
  //     order_value: orderValue,
  //   },
  //   true,
  // );

  React.useEffect(() => {
    if (!selectedVoucher) {
      if (form.getValues("voucher_amount") !== 0) {
        form.setValue("voucher_amount", 0);
      }
      return;
    }

    let nextValue = 0;
    const currentValue = form.getValues("voucher_amount");

    // Product vouchers apply to all selected goods in the Econelo order.
    if (
      selectedVoucher.type === "product" ||
      selectedVoucher.type === "user_specific" ||
      selectedVoucher.type === "order"
    ) {
      nextValue =
        orderValue <= 0
          ? 0
          : selectedVoucher.discount_type === "percent"
            ? (orderValue * selectedVoucher.discount_value) / 100
            : selectedVoucher.discount_value;
    }

    /**
     * 3️⃣ SHIPPING
     */
    if (selectedVoucher.type === "shipping") {
      nextValue =
        selectedVoucher.discount_type === "percent"
          ? shippingCost
          : selectedVoucher.discount_value;
    }

    /**
     * 4️⃣ max_discount
     */
    if (
      selectedVoucher.max_discount &&
      nextValue > selectedVoucher.max_discount
    ) {
      nextValue = selectedVoucher.max_discount;
    }

    /**
     * 5️⃣ SET VALUE
     */

    if (currentValue !== nextValue) {
      form.setValue("voucher_amount", nextValue, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [selectedVoucher, orderValue, shippingCost, voucherAmount, form]);

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
          items.map((item, i) => {
            const price =
              (item.final_price ?? item.item_price ?? 0) * item.quantity;

            return (
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
                    <div className="w-1/3 h-[1px] bg-black my-1"></div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {t("quantity")}: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="font-bold text-gray-800 whitespace-nowrap">
                    €{price.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">{t("noProductsFound")}</p>
        )}
      </div>

      <Separator />

      <div className="space-y-4 flex justify-end xl:mb-8">
        <VoucherApply />
      </div>

      <Separator />

      {/* SUMMARY */}
      <div className="text-sm space-y-2 col-span-2 lg:col-span-1">
        <div className="flex justify-between items-center">
          <span className="text-right">{t("subTotalInclude")}</span>
          <span className="text-right">
            €
            {(isServerCartMode
              ? serverCart
                  .flatMap((group) => group.items) // gom tất cả items trong từng supplier cart
                  .filter((item) => item.is_active)
                  .reduce((total, item) => total + (item.final_price ?? 0), 0)
              : (localCart
                  ?.filter((item) => item.is_active)
                  .reduce(
                    (total, item) =>
                      total + (item.item_price ?? 0) * (item.quantity ?? 1),
                    0,
                  ) ?? 0)
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
        <div className="flex justify-between items-center gap-3">
          <div className="min-w-0">
            <span>{t("discount")}</span>
          </div>
          <span className="shrink-0 text-right">
            {(voucherAmount ?? 0) > 0 ? "−€" : "€"}
            {(voucherAmount ?? 0).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <Separator />

      {/* TOTAL */}
      <div className="flex justify-between items-center pt-2 text-xl font-bold text-gray-900">
        <span className="col-span-3 text-right">{t("total")}</span>
        <span className="text-right col-span-2">
          €
          {(
            (isServerCartMode
              ? serverCart
                  .flatMap((group) => group.items) // gộp tất cả CartItem từ các supplier
                  .filter((item) => item.is_active)
                  .reduce((total, item) => total + (item.final_price ?? 0), 0)
              : (localCart
                  ?.filter((item) => item.is_active)
                  .reduce(
                    (total, item) =>
                      total + (item.item_price ?? 0) * (item.quantity ?? 1),
                    0,
                  ) ?? 0)) +
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
