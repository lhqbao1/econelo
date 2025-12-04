"use client";

import React, { useEffect, useMemo } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/schema/checkout";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import ShippingSection from "../single-product/shipping-section";
import { CheckoutAddressSection } from "./checkout-address";
import Link from "next/link";
import { toast } from "sonner";
import CheckoutPaymentUI from "../stripe/payment-ui";
import StripeProvider from "../stripe/stripe";
import StripeLayout from "../stripe/stripe-layout";
import { CartItem, CartResponse } from "@/types/cart";

interface CheckoutFormSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  clientSecret: string | null;
  setClientSecret: React.Dispatch<React.SetStateAction<string | null>>;
  total?: number;
  setTotal?: React.Dispatch<React.SetStateAction<number>>;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: CreateOrderFormValues) => void;
}

export const CheckoutFormSection = ({
  form,
  clientSecret,
  setClientSecret,
  total,
  setTotal,
  openDialog,
  setOpenDialog,
  onSubmit,
}: CheckoutFormSectionProps) => {
  const t = useTranslations();
  const couponAmount = form.watch("coupon_amount");
  const voucherAmount = form.watch("voucher_amount");

  // const totalEuro = useMemo(() => {
  //   const productsTotal =
  //     cartItems && cartItems.length > 0
  //       ? cartItems
  //           .flatMap((g) => g.items)
  //           .filter((i) => i.is_active)
  //           .reduce((sum, item) => sum + (item.final_price ?? 0), 0)
  //       : (localCart ?? [])
  //           .filter((i) => i.is_active)
  //           .reduce(
  //             (sum, item) =>
  //               sum + (item.item_price ?? 0) * (item.quantity ?? 1),
  //             0,
  //           );

  //   return (
  //     productsTotal +
  //     (shippingCost ?? 0) -
  //     (couponAmount ?? 0) -
  //     (voucherAmount ?? 0)
  //   );
  // }, [cartItems, localCart, shippingCost, couponAmount, voucherAmount]);
  // // Chuyển sang cents cho Stripe
  // const totalCents = useMemo(() => {
  //   return Math.round(totalEuro * 100);
  // }, [totalEuro]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => onSubmit(values),
          (error) => {
            const firstKey = Object.keys(error)[0] as keyof typeof error;
            const firstMessage = error[firstKey]?.message;

            toast.error(t("checkFormError"), {
              description: firstMessage,
            });
          },
        )}
        className="flex flex-col gap-8 section-padding"
      >
        {/* SECTION 1 — Contact Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("contactInfomation")}</h2>
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{t("gender")}</FormLabel> */}
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-4"
                  >
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="ml-2">{t("male")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="ml-2">{t("female")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="ml-2">{t("otherGender")}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    type="email"
                    className="w-full rounded-md border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("firstName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lastName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <CheckoutAddressSection
          form={form}
          t={t}
        />
        <Separator />

        {/* SECTION 4 — Payment Method */}
        <div className="space-y-4">
          <CheckoutPaymentUI
            control={form.control}
            selectedMethod={form.watch("payment_method")}
            onChange={(v) => form.setValue("payment_method", v)}
            t={t}
          />
          {clientSecret && (
            <StripeProvider clientSecret={clientSecret}>
              <StripeLayout
                form={form}
                clientSecret={clientSecret}
                setClientSecret={setClientSecret}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                total={100}
              />
            </StripeProvider>
          )}
        </div>

        {/* SECTION 5 — Place Order */}
        <div className="pt-6 space-y-4">
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row gap-2 mt-4 items-center">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                  <FormLabel className="text-sm flex flex-row font-medium text-gray-600">
                    <span className="space-x-2">
                      {t("byPlacing")}
                      <span className="pl-2">
                        <Link
                          href={`/agb`}
                          className="text-primary underline"
                        >
                          {t("termCondition")}
                        </Link>
                      </span>
                    </span>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-black text-white py-6 text-base font-semibold hover:bg-gray-800 transition"
          >
            {t("placeOrder")}
          </Button>

          {/* Footer links (Refund, Privacy, etc.) */}
          <div className="border-t mt-8 pt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
            {[
              { href: "/refund-policy", label: t("termCondition") },
              { href: "/privacy-policy", label: t("privacyPolicy") },
              { href: "/agb", label: t("imprint") },
              { href: "/cancellations", label: t("cancellations") },
              { href: "/contact", label: t("contact") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
        relative 
        text-gray-600 
        after:absolute after:left-0 after:-bottom-[2px] after:h-[1px]
        after:w-0 after:bg-black after:transition-all after:duration-300
        hover:after:w-full
      "
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
