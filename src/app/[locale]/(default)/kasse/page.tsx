"use client";
import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutFormSection } from "@/components/layout/checkout/checkout-form";
import { CartSummary } from "@/components/layout/checkout/checkout-summary";
import { useCheckoutSubmit } from "@/hooks/check-out/useCheckOutSubmit";
import { useCheckoutInit } from "@/hooks/check-out/useCheckoutInit";
import {
  checkoutDefaultValues,
  CreateOrderFormValues,
  CreateOrderSchema,
} from "@/lib/schema/checkout";
import { FormProvider, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function CheckoutPageNew() {
  const t = useTranslations();
  const locale = useLocale();

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
    isServerCartMode,
    isCheckoutCartReady,
    shippingCost,
    hasOtherCarrier,
    userLoginId,
    setUserLoginId,
    finalUserId,
  } = useCheckoutInit();

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
    handleOTP,
    verifyOtp,
  } = useCheckoutSubmit({
    form,
    user,
    addresses,
    invoiceAddress,
    cartItems,
    localCart,
    shippingCost,
    locale,
    currentUserId: finalUserId ?? "",
  });

  const handleOtpSuccess = (verifiedUserId: string) => {
    setUserLoginId(verifiedUserId);
  };

  const couponAmount = form.watch("coupon_amount");
  const voucherAmount = form.watch("voucher_amount");

  const totalEuro = useMemo(() => {
    const productsTotal = isServerCartMode
      ? (cartItems ?? [])
          .flatMap((g) => g.items)
          .filter((i) => i.is_active)
          .reduce((sum, item) => sum + (item.final_price ?? 0), 0)
      : (localCart ?? [])
          .filter((i) => i.is_active)
          .reduce(
            (sum, item) => sum + (item.item_price ?? 0) * (item.quantity ?? 1),
            0,
          );

    return (
      productsTotal +
      (shippingCost ?? 0) -
      (couponAmount ?? 0) -
      (voucherAmount ?? 0)
    );
  }, [
    isServerCartMode,
    cartItems,
    localCart,
    shippingCost,
    couponAmount,
    voucherAmount,
  ]);

  // Chuyển sang cents cho Stripe
  const totalCents = useMemo(() => {
    return Math.round(totalEuro * 100);
  }, [totalEuro]);

  if (!isCheckoutCartReady) {
    return (
      <div className="min-h-screen section-padding md:pt-[140px] flex items-start justify-center">
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
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
        <section className="flex lg:flex-row w-full lg:flex-nowrap flex-col-reverse flex-wrap">
          {/* LEFT: Form Section */}
          <div className="bg-white flex justify-end py-8 px-8 w-full lg:pt-36">
            <div className="lg:w-1/2 w-full">
              <CheckoutFormSection
                form={form}
                clientSecret={clientSecret}
                setClientSecret={setClientSecret}
                total={total}
                setTotal={setTotal}
                openCardDialog={openCardDialog}
                setOpenCardDialog={setOpenCardDialog}
                onSubmit={handleSubmit}
                submitting={submitting}
                totalCents={totalCents}
                open={openOtpDialog}
                onOpenChange={setOpenOtpDialog}
                email={otpEmail}
                onSuccess={handleOtpSuccess}
                verifyOtp={verifyOtp}
                openBankDialog={openBankDialog}
                setOpenBankDialog={setOpenBankDialog}
                handleOTP={handleOTP}
              />
            </div>
          </div>

          {/* RIGHT: Cart Summary */}
          <div className="bg-gray-100 flex justify-start py-8 px-8 w-full lg:pt-36">
            <div className="lg:w-1/2 w-full">
              <CartSummary
                form={form}
                total={total}
                cart={cartItems}
                localCart={localCart}
                hasOtherCarrier={hasOtherCarrier}
                shippingCost={shippingCost}
                userLoginId={userLoginId ?? null}
                isLoading={isServerCartMode && isLoadingCart}
                submitting={submitting}
                open={openOtpDialog}
                onOpenChange={setOpenOtpDialog}
                email={otpEmail}
                onSuccess={handleOtpSuccess}
                verifyOtp={verifyOtp}
                openBankDialog={openBankDialog}
                setOpenBankDialog={setOpenBankDialog}
                handleOTP={handleOTP}
              />
            </div>
          </div>
        </section>
      </form>
    </FormProvider>
  );
}
