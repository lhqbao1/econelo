"use client";

import React, { createContext, useContext } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/schema/checkout";

interface CheckoutContextType {
  form: UseFormReturn<CreateOrderFormValues>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutProvider = ({
  form,
  children,
}: {
  form: UseFormReturn<CreateOrderFormValues>;
  children: React.ReactNode;
}) => {
  return (
    <CheckoutContext.Provider value={{ form }}>
      <FormProvider {...form}>{children}</FormProvider>
    </CheckoutContext.Provider>
  );
};

export const useCheckoutForm = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckoutForm must be used inside CheckoutProvider");
  }
  return context.form;
};
