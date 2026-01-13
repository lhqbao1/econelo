"use client";

import { useFormContext, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CheckOutInvoiceAddressProps {
  isAdmin?: boolean;
}

export const COUNTRY_OPTIONS = [
  { value: "AT", label: "Austria" },
  { value: "DE", label: "Deutschland" },
];

function CheckOutInvoiceAddress({
  isAdmin = false,
}: CheckOutInvoiceAddressProps) {
  const form = useFormContext();
  const t = useTranslations();
  const [openShippingCountry, setOpenShippingCountry] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-primary/10 p-2">
        <h2 className="text-lg text-black font-semibold mb-0">
          {t("invoiceAddress")}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-black text-sm">
                {t("phone_number")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder=""
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Address Line */}
        <FormField
          control={form.control}
          name="invoice_address_line"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-black text-sm">
                {t("streetAndHouse")}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="address-line1"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoice_address_additional"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-black text-sm">
                {isAdmin ? (
                  "Additional Address"
                ) : (
                  <>{t("addressSupplement")} (Optional)</>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="address-line2"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Postal Code */}
        <FormField
          control={form.control}
          name="invoice_postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black text-sm">
                {isAdmin ? "Postal Code" : t("postalCode")}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="invoice_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black text-sm">
                {isAdmin ? "City" : t("city")}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="address-level2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoice_country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-black text-sm">
                {t("country")}
              </FormLabel>

              <Popover
                open={openShippingCountry}
                onOpenChange={setOpenShippingCountry}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      onClick={() =>
                        setOpenShippingCountry(!openShippingCountry)
                      }
                    >
                      {field.value
                        ? COUNTRY_OPTIONS.find((c) => c.value === field.value)
                            ?.label
                        : "Select country"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0 h-[150px]">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>{t("noCountry")}</CommandEmpty>
                      <CommandGroup>
                        {COUNTRY_OPTIONS.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.label}
                            onSelect={() => {
                              field.onChange(c.value);
                              setOpenShippingCountry(false); // 🔥 đóng popover sau khi chọn
                            }}
                            className="cursor-pointer"
                          >
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default CheckOutInvoiceAddress;
