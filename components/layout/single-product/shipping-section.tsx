"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryPoByProductId } from "@/features/inventory-incoming/hook";
import {
  addBusinessDays,
  getDeliveryDayRange,
} from "@/hooks/get-shipping-date";
import { ProductItem } from "@/types/products";
import { Info, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface ShippingSectionProps {
  productDetails: ProductItem;
}

export function formatDateDE(date: Date) {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const ShippingSection = ({ productDetails }: ShippingSectionProps) => {
  const t = useTranslations();
  const { data, isLoading, isError } = useInventoryPoByProductId(
    productDetails.id,
  );

  const latestDeliveryDate = React.useMemo(() => {
    const items = Array.isArray(data) ? data : data ? [data] : [];
    let latest: Date | null = null;

    for (const item of items) {
      if (!item.list_delivery_date) continue;
      const date = new Date(item.list_delivery_date);
      if (Number.isNaN(date.getTime())) continue;

      if (!latest || date > latest) {
        latest = date;
      }
    }

    return latest;
  }, [data]);

  const estimatedDeliveryRange = React.useMemo(() => {
    const deliveryRange = getDeliveryDayRange(productDetails.delivery_time);
    if (!deliveryRange || !latestDeliveryDate) return null;

    return {
      from: addBusinessDays(latestDeliveryDate, deliveryRange.min),
      to: addBusinessDays(latestDeliveryDate, deliveryRange.max),
    };
  }, [latestDeliveryDate, productDetails.delivery_time]);
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("availabilityAndShipping")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="space-y-4">
          <div>{t("includeVatAndShipping")}</div>
          <div className="flex gap-2 items-center ">
            <div>{t("inStock")}:</div>
            <div className="grid grid-cols-3 w-1/3 gap-1">
              <span
                className={`w-full h-2 rounded-xs ${
                  productDetails.stock === 0
                    ? "bg-gray-300"
                    : productDetails.stock < 10
                      ? "bg-red-500"
                      : productDetails.stock <= 20
                        ? "bg-primary"
                        : "bg-primary"
                }`}
              />

              <span
                className={`w-full h-2 rounded-xs ${
                  productDetails.stock === 0
                    ? "bg-gray-300"
                    : productDetails.stock < 10
                      ? "bg-gray-300"
                      : productDetails.stock <= 20
                        ? "bg-primary"
                        : "bg-primary"
                }`}
              />

              <span
                className={`w-full h-2 rounded-xs ${
                  productDetails.stock === 0
                    ? "bg-gray-300"
                    : productDetails.stock < 10
                      ? "bg-gray-300"
                      : productDetails.stock <= 20
                        ? "bg-gray-400"
                        : "bg-primary"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 items-start border px-2.5 py-1.5 rounded-md w-fit border-black/40">
            <Truck size={30} />
            <div>
              <span className="text-gray-800 font-medium text-sm">
                {estimatedDeliveryRange ? (
                  <>
                    {t.rich("deliveryDateRange", {
                      from: formatDateDE(estimatedDeliveryRange.from),
                      to: formatDateDE(estimatedDeliveryRange.to),
                      b: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </>
                ) : productDetails.delivery_time ? (
                  t("deliveryTime", {
                    days: productDetails.delivery_time,
                  })
                ) : (
                  t("updating")
                )}
              </span>

              <ul className="space-y-1 text-gray-600 text-sm">
                {(() => {
                  const carrier = productDetails?.carrier?.toLowerCase();

                  if (carrier !== "amm" && carrier !== "spedition") return null;

                  return (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-sm leading-5">•</span>
                        <span className="text-sm text-gray-800">
                          Lieferung <strong>frei Bordsteinkante</strong>{" "}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="inline-block w-3.5 h-3.5 text-gray-500 ml-1 mb-0.5" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-primary">
                              <p className="text-white text-sm">
                                „Frei Bordsteinkante“ bedeutet: Lieferung bis
                                zur Grundstücksgrenze – kein Transport ins Haus
                                oder zur Wohnung.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </span>
                      </li>

                      <li className="flex items-start gap-2">
                        <span className="text-sm leading-5">•</span>
                        <span className="text-sm text-gray-800">
                          Speditionsversand nach Terminabsprache
                        </span>
                      </li>
                    </>
                  );
                })()}
              </ul>
            </div>
          </div>

          {productDetails.brand.name.toLowerCase() === "econelo" && (
            <div className="border px-2.5 py-2 rounded-md border-black/40">
              <p className="text-sm text-gray-700">
                2 Jahre Gewährleistung auf das Fahrzeug. Die Batterie hat eine
                Garantie von 6 Monaten ab dem Lieferdatum.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingSection;
