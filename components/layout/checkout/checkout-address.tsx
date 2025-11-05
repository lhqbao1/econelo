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
          "invoice_address_additional"
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
          invoiceSnapshot.current.invoice_address_line
        );
        form.setValue(
          "invoice_address_additional",
          invoiceSnapshot.current.invoice_address_additional ?? ""
        );
        form.setValue(
          "invoice_postal_code",
          invoiceSnapshot.current.invoice_postal_code
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
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("shippingAddress")}</h2>

        <FormField
          control={form.control}
          name="shipping_address_line"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addressLine")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123 Main St" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shipping_address_additional"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addressSupplement")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123 Main St" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="shipping_postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("postalCode")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="12345" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shipping_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Berlin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone_number")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+49 123 456789" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* SECTION 3 — Billing Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("invoiceAddress")}</h2>
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              id="same-billing"
              checked={isSameShipping}
              onCheckedChange={(checked) => setIsSameShipping(!!checked)}
            />
            <label
              htmlFor="same-billing"
              className="text-gray-600 cursor-pointer"
            >
              {t("sameAsShipping")}
            </label>
          </div>
        </div>

        {!isSameShipping && (
          <div className="space-y-4 animate-fadeIn">
            <FormField
              control={form.control}
              name="invoice_address_line"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addressLine")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123 Main St" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_address_additional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addressSupplement")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123 Main St" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoice_postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("postalCode")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoice_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("city")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Berlin" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
