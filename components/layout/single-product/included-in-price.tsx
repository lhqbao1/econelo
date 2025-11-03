import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeCheck, CheckCircle } from "lucide-react";

export default function IncludedInPriceCard() {
  const items = [
    "Free cancellation up to 48h before pick-up",
    "Theft Protection",
    "Collision Damage Waiver",
    "Unlimited mileage",
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Included in the Price
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-black">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              <BadgeCheck className="text-primary w-5 h-5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
