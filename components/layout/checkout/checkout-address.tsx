"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CreateOrderFormValues } from "@/lib/schema/checkout";
import { useTranslations } from "next-intl";
import CheckOutShippingAddress from "./shipping-address";
import CheckOutInvoiceAddress from "./invoice-address";

interface InvoiceAddressValues {
  invoice_address_line: string;
  invoice_address_additional?: string;
  invoice_postal_code: string;
  invoice_city: string;
}

interface CheckoutAddressSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  t: (key: string) => string;
}

export function CheckoutAddressSection({
  form,
  t,
}: CheckoutAddressSectionProps) {
  const [open, setOpen] = useState(false);
  const [isSameShipping, setIsSameShipping] = useState(true);

  // Watch shipping fields
  const shippingAddressLine = useWatch({
    name: "shipping_address_line",
    control: form.control,
  });
  const shippingPostalCode = useWatch({
    name: "shipping_postal_code",
    control: form.control,
  });
  const shippingCity = useWatch({
    name: "shipping_city",
    control: form.control,
  });
  const shippingAddressAdditional = useWatch({
    name: "shipping_address_additional",
    control: form.control,
  });

  // Dùng ref lưu snapshot invoice gốc
  const invoiceSnapshot = useRef<InvoiceAddressValues | null>(null);

  useEffect(() => {
    if (isSameShipping) {
      // Lưu lại dữ liệu invoice hiện tại
      invoiceSnapshot.current = {
        invoice_address_line: form.getValues("invoice_address_line"),
        invoice_address_additional: form.getValues(
          "invoice_address_additional",
        ),
        invoice_postal_code: form.getValues("invoice_postal_code"),
        invoice_city: form.getValues("invoice_city"),
      };

      // Copy shipping → invoice
      form.setValue("invoice_address_line", shippingAddressLine);
      form.setValue("invoice_address_additional", shippingAddressAdditional);
      form.setValue("invoice_postal_code", shippingPostalCode);
      form.setValue("invoice_city", shippingCity);
    } else {
      // Restore lại snapshot nếu có
      if (invoiceSnapshot.current) {
        form.setValue(
          "invoice_address_line",
          invoiceSnapshot.current.invoice_address_line,
        );
        form.setValue(
          "invoice_address_additional",
          invoiceSnapshot.current.invoice_address_additional ?? "",
        );
        form.setValue(
          "invoice_postal_code",
          invoiceSnapshot.current.invoice_postal_code,
        );
        form.setValue("invoice_city", invoiceSnapshot.current.invoice_city);
      }
    }
  }, [
    isSameShipping,
    shippingAddressLine,
    shippingAddressAdditional,
    shippingPostalCode,
    shippingCity,
    form,
  ]);

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
