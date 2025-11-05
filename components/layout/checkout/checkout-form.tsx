"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
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
import StripeLayout from "./stripe";
import ShippingSection from "../single-product/shipping-section";
import { CheckoutAddressSection } from "./checkout-address";
import Link from "next/link";

interface CheckoutFormSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  clientSecret: string | null;
  setClientSecret: React.Dispatch<React.SetStateAction<string | null>>;
  total?: number;
  setTotal?: React.Dispatch<React.SetStateAction<number>>;
  openDialog?: boolean;
  setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>>;
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
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
                  <Input {...field} placeholder="John" />
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
                  <Input {...field} placeholder="Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      <CheckoutAddressSection form={form} t={t} />
      <Separator />

      {/* SECTION 4 — Payment Method */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("paymentMethod")}</h2>
        <StripeLayout
          clientSecret={clientSecret}
          setClientSecret={setClientSecret}
          total={total}
          setTotal={setTotal}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          form={form}
          userEmail={form.watch("email")}
        />
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
                      <Link href={`/agb`} className="text-primary underline">
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
  );
};
