"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutFormSection } from "@/components/layout/checkout/checkout-form";
import { CartSummary } from "@/components/layout/checkout/checkout-summary";
import { useCheckoutSubmit } from "@/hooks/check-out/useCheckOutSubmit";
import { CheckoutProvider } from "@/components/layout/checkout/context";
import BankDialog from "@/components/layout/checkout/bank-dialog";
import { OtpDialog } from "@/components/layout/checkout/otp-dialog";
import { useCheckoutInit } from "@/hooks/check-out/useCheckoutInit";
import {
  checkoutDefaultValues,
  CreateOrderFormValues,
  CreateOrderSchema,
} from "@/lib/schema/checkout";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CheckoutPageNew() {
  const t = useTranslations();
  const locale = useLocale();
  const { open } = useSidebar();

  const schema = CreateOrderSchema(t);
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: checkoutDefaultValues,
    mode: "onSubmit",
  });
  // -------------------------------
  // 1️⃣ INIT HOOK (user/cart/address/shipping logic)
  // -------------------------------
  const {
    user,
    addresses,
    invoiceAddress,
    cartItems,
    localCart,
    isLoadingCart,
    hasServerCart,
    shippingCost,
    hasOtherCarrier,
    userId,
    userIdLogin,
    setUserIdLogin,
  } = useCheckoutInit();

  // -------------------------------
  // 2️⃣ FORM SETUP
  // -------------------------------

  // Pre-fill form values from user/address
  useEffect(() => {
    const defaults: Partial<CreateOrderFormValues> = {};

    if (user) {
      defaults.first_name = user.first_name ?? "";
      defaults.last_name = user.last_name ?? "";
      defaults.email = user.email ?? "";
    }

    if (invoiceAddress) {
      defaults.invoice_address_line = invoiceAddress.address_line ?? "";
      defaults.invoice_postal_code = invoiceAddress.postal_code ?? "";
      defaults.invoice_city = invoiceAddress.city ?? "";
      defaults.invoice_address_id = invoiceAddress.id;
    }

    if (addresses && addresses.length > 0) {
      const shippingAddress = addresses.find((a) => a.is_default);
      if (shippingAddress) {
        defaults.shipping_address_line = shippingAddress.address_line ?? "";
        defaults.shipping_postal_code = shippingAddress.postal_code ?? "";
        defaults.shipping_city = shippingAddress.city ?? "";
        defaults.shipping_address_id = shippingAddress.id;
        defaults.phone_number = shippingAddress.phone_number ?? "";
      }
    }

    if (Object.keys(defaults).length > 0)
      form.reset({ ...form.getValues(), ...defaults });
  }, [user, invoiceAddress, addresses]);

  // -------------------------------
  // 3️⃣ SUBMIT HOOK (checkout + payment logic)
  // -------------------------------
  const {
    submitting,
    clientSecret,
    total,
    openCardDialog,
    openBankDialog,
    openOtpDialog,
    otpEmail,
    setClientSecret,
    setTotal,
    setOpenCardDialog,
    setOpenBankDialog,
    setOpenOtpDialog,
    handleSubmit,
  } = useCheckoutSubmit({
    form,
    user,
    addresses,
    invoiceAddress,
    cartItems,
    localCart,
    hasServerCart,
    shippingCost,
    locale,
  });

  const handleOtpSuccess = (verifiedUserId: string) => {
    setUserIdLogin(verifiedUserId);
  };

  return (
    <section className="flex flex-row w-full">
      {/* LEFT: Form Section */}
      <div className="bg-white flex justify-end lg:pr-8 lg:py-8 lg:w-1/2 w-full lg:pt-36">
        <div className="lg:w-1/2 w-full">
          <CheckoutFormSection
            form={form}
            clientSecret={clientSecret}
            setClientSecret={setClientSecret}
            total={total}
            setTotal={setTotal}
            openDialog={openCardDialog}
            setOpenDialog={setOpenCardDialog}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* RIGHT: Cart Summary */}
      <div className="bg-gray-100 flex justify-start lg:pl-8 lg:py-8 lg:w-1/2 w-full lg:pt-36">
        <div className="lg:w-1/2 w-full">
          <CartSummary
            total={total}
            cart={cartItems}
            localCart={localCart}
            hasOtherCarrier={hasOtherCarrier}
            shippingCost={shippingCost}
          />
        </div>
      </div>

      <OtpDialog
        open={openOtpDialog}
        onOpenChange={setOpenOtpDialog}
        email={otpEmail}
        onSuccess={handleOtpSuccess}
      />

      <BankDialog
        open={openBankDialog}
        onOpenChange={setOpenBankDialog}
      />
    </section>
  );
}
