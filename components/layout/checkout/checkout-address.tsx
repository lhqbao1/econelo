"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { CreateOrderFormValues } from "@/lib/schema/checkout";
import CheckOutShippingAddress from "./shipping-address";
import CheckOutInvoiceAddress from "./invoice-address";

interface ShippingAddressValues {
  shipping_address_line: string;
  shipping_address_additional?: string | null;
  shipping_recipient_name?: string | null;
  shipping_city: string;
  shipping_country: string;
  shipping_phone_number?: string | null;
  shipping_postal_code: string;
}

interface CheckoutAddressSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  t: (key: string) => string;
}

export function CheckoutAddressSection({
  form,
  t,
}: CheckoutAddressSectionProps) {
  return (
    <>
      {/* SECTION 2 — Shipping Address */}
      <CheckOutInvoiceAddress />

      <Separator />

      {/* SECTION 3 — Billing Address */}
      <CheckOutShippingAddress />
    </>
  );
}
