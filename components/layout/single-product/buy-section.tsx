import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ListVariant from "./list-variant";
import { VariantOptionsResponse } from "@/types/variant";
import { ProductItem } from "@/types/products";
import { ProductGroupDetailResponse } from "@/types/product-group";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface BuySectionProps {
  variant?: VariantOptionsResponse[];
  currentProduct: ProductItem;
  parentProduct?: ProductGroupDetailResponse | null;
}

const BuySection = ({
  variant,
  currentProduct,
  parentProduct,
}: BuySectionProps) => {
  const extras = [
    { label: "GPS Navigation System", price: "$25.00" },
    { label: "Child Seat", price: "$32.00" },
    { label: "Additional Driver", price: "$25.00" },
    { label: "Insurance Coverage", price: "$52.00" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Buy This Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <ListVariant
          variant={variant}
          currentProduct={currentProduct}
          parentProduct={parentProduct}
        />

        <Separator className="my-4" />

        <div className="space-y-2 text-sm text-black">
          <p className="font-medium">Add Extra:</p>
          {extras.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-gray-700"
            >
              <label className="flex items-center gap-2">
                <Checkbox id={`extra-${idx}`} />
                <span>{item.label}</span>
              </label>
              <span>{item.price}</span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 pb-4">
          <div className="flex justify-between items-center">
            <label>Subtotal</label>
            <span>
              {currentProduct.price.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              €
            </span>
          </div>
          <div className="flex justify-between items-center">
            <label>Sale discount</label>
            <span>0.00€</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-black text-lg">
            <label>Total Payable</label>
            <span>
              {currentProduct.price.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              €
            </span>
          </div>
        </div>

        <Button className="bg-primary w-full rounded-md py-6">Buy Now</Button>
      </CardContent>

      <CardFooter className="flex gap-1 items-center pb-0 pt-4 justify-center text-gray-400 font-semibold text-sm">
        <User className="size-5" />
        Need some help
      </CardFooter>
    </Card>
  );
};

export default BuySection;
