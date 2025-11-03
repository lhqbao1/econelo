import { Card, CardContent } from "@/components/ui/card";
import { ProductItem } from "@/types/products";
import {
  Battery,
  Gauge,
  Palette,
  Car,
  Ruler,
  Globe,
  Zap,
  Tag,
} from "lucide-react";

interface TechnicalNumberSectionProps {
  productDetails: ProductItem;
}

const TechnicalNumberSection = ({
  productDetails,
}: TechnicalNumberSectionProps) => {
  const carFeatures = [
    { icon: Battery, label: "Battery", value: "60V / 20Ah" },
    { icon: Gauge, label: "Range", value: "60 km/charge" },
    { icon: Zap, label: "Power", value: "1200W" },
    { icon: Car, label: "Seats", value: "2" },
    { icon: Palette, label: "Color", value: productDetails.color ?? "Rot" },
    {
      icon: Globe,
      label: "Made in",
      value: productDetails.manufacture_country,
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardContent className="">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {carFeatures.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-green-100 text-black rounded-md px-3 py-4 font-medium"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalNumberSection;
