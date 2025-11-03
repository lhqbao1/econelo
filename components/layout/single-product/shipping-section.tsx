import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductItem } from "@/types/products";
import { Truck } from "lucide-react";
import { useTranslations } from "next-intl";

interface ShippingSectionProps {
  productDetails: ProductItem;
}

const ShippingSection = ({ productDetails }: ShippingSectionProps) => {
  const t = useTranslations();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Availability and Shipping
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
                    : "bg-secondary"
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
                    : "bg-secondary"
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
                    : "bg-secondary"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 items-start border px-2.5 py-1.5 rounded-md w-fit border-black/40">
            <Truck size={30} />
            <div>
              <p className="font-bold">{t("delivery")}</p>
              <p className="font-light">
                {productDetails.delivery_time
                  ? t("deliveryTime", {
                      days: productDetails.delivery_time,
                    })
                  : t("updating")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingSection;
