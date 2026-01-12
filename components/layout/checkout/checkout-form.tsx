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
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";
import { getUserById } from "@/features/users/api";
import AGBDialogTrigger from "../sign-up/agb-dialog";
import WiderrufDialogTrigger from "../sign-up/widerruf-dialog";
import { getInvoiceAddressByUserId } from "@/features/address/api";
import { OtpDialog } from "./otp-dialog";
import BankDialog from "./bank-dialog";

interface CheckoutFormSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  clientSecret: string | null;
  setClientSecret: React.Dispatch<React.SetStateAction<string | null>>;
  total?: number;
  setTotal?: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (values: CreateOrderFormValues) => void;
  submitting: boolean;
  openCardDialog: boolean;
  setOpenCardDialog: React.Dispatch<React.SetStateAction<boolean>>;
  totalCents: number;

  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: (userId: string) => void;
  verifyOtp: (otpInput: string) => void;

  openBankDialog: boolean;
  setOpenBankDialog: (openBankDialog: boolean) => void;
  handleOTP: (values: CreateOrderFormValues) => void;
}

export const CheckoutFormSection = ({
  form,
  clientSecret,
  setClientSecret,
  total,
  setTotal,
  onSubmit,
  submitting,
  openCardDialog,
  setOpenCardDialog,
  totalCents,

  open,
  onOpenChange,
  email,
  onSuccess,
  verifyOtp,

  openBankDialog,
  setOpenBankDialog,
  handleOTP,
}: CheckoutFormSectionProps) => {
  const t = useTranslations();
  const [userIdLogin, setUserIdLogin] = useAtom(userIdAtom);

  const isLogin = !!userIdLogin;

  const { data: userData } = useQuery({
    queryKey: ["user", userIdLogin],
    queryFn: () => getUserById(userIdLogin ?? ""),
    enabled: !!userIdLogin,
    retry: false,
  });

  const { data: invoiceAddress } = useQuery({
    queryKey: ["invoice-address-by-user", userIdLogin],
    queryFn: () => getInvoiceAddressByUserId(userIdLogin ?? ""),
    retry: false,
    enabled: !!userIdLogin,
  });

  // Khi user login → đổ dữ liệu vào form
  useEffect(() => {
    if (!userData) return;
    form.reset({
      first_name: userData.first_name ?? "",
      last_name: userData.last_name ?? "",
      email: userData.email ?? "",
      phone_number: userData.phone_number ?? "",
      gender: userData.gender ?? "",
      company_name: userData.company_name ?? "",
      tax_id: userData.tax_id ?? "",

      invoice_address_line: invoiceAddress?.address_line ?? "",
      invoice_address_additional: invoiceAddress?.additional_address_line ?? "",
      invoice_postal_code: invoiceAddress?.postal_code ?? "",
      invoice_city: invoiceAddress?.city ?? "",
      invoice_country: invoiceAddress?.country ?? "",
    });
  }, [userData, invoiceAddress]);

  return (
    <>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(
            (values) => handleOTP(values),
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
                        <FormLabel className="ml-2">
                          {t("otherGender")}
                        </FormLabel>
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
                      placeholder=""
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
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("companyName")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("vatId")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
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
                        placeholder=""
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

          <div className="space-y-4 py-5 border-y-2">
            {/* ALWAYS SHOW PAYMENT OPTIONS */}
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
                  openDialog={openCardDialog}
                  setOpenDialog={setOpenCardDialog}
                  total={totalCents}
                />
              </StripeProvider>
            )}
          </div>

          {/* SECTION 5 — Place Order */}
          <div className="space-y-4">
            {/* TERMS */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-2 mt-4 items-center">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel className="text-sm block">
                      {t("agreeTo")} <AGBDialogTrigger t={t} /> {t("and")}{" "}
                      <WiderrufDialogTrigger t={t} /> {t("agree_widderuf")}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-black text-white py-6 text-base font-semibold hover:bg-gray-800 transition"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                t("placeOrder")
              )}
            </Button>

            {/* Footer links (Refund, Privacy, etc.) */}
            <div className="border-t mt-8 pt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
              {[
                { href: "/refund-policy", label: t("termCondition") },
                { href: "/datenschutzerklaerung", label: t("privacyPolicy") },
                { href: "/impressum", label: t("imprint") },
                { href: "/widerrufsbelehrung", label: t("cancellations") },
                { href: "/kontakt", label: t("contact") },
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

      <OtpDialog
        open={open}
        onOpenChange={onOpenChange}
        email={email}
        onSuccess={onSuccess}
        verifyOtp={verifyOtp}
      />

      <BankDialog
        open={openBankDialog}
        onOpenChange={setOpenBankDialog}
      />
    </>
  );
};
