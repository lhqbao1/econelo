"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutFormSection } from "@/components/layout/checkout/checkout-form";
import { CartSummary } from "@/components/layout/checkout/checkout-summary";
import { useCheckoutLogic } from "@/hooks/useCheckOutLogic";
import { CheckoutProvider } from "@/components/layout/checkout/context";
import BankDialog from "@/components/layout/checkout/bank-dialog";
import { OtpDialog } from "@/components/layout/checkout/otp-dialog";

export default function CheckoutPageNew() {
  const [userIdLogin, setUserIdLogin] = useState<string>("");

  const {
    form,
    user,
    addresses,
    invoiceAddress,
    isLoading,
    cartItems,
    isLoadingCart,
    clientSecret,
    hasOtherCarrier,
    setClientSecret,
    localCart,
    total,
    setTotal,
    openCardDialog,
    setOpenCardDialog,
    openBankDialog,
    setOpenBankDialog,
    openOtpDialog,
    setOpenOtpDialog,
    otpEmail,
    shippingCost,
    handleSubmit,
  } = useCheckoutLogic();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const handleOtpSuccess = (verifiedUserId: string) => {
    setUserIdLogin(verifiedUserId);
  };

  return (
    <CheckoutProvider form={form}>
      {/* LEFT: Form Section */}
      <div className="bg-white flex justify-end lg:pr-8 lg:py-8">
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
      <div className="bg-gray-100 flex justify-start lg:pl-8 lg:py-8 ">
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

      <BankDialog open={openBankDialog} onOpenChange={setOpenBankDialog} />
    </CheckoutProvider>
  );
}
