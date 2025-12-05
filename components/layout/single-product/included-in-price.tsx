import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";

interface IncludedInPriceCardProps {
  id: string;
}

export default function IncludedInPriceCard({ id }: IncludedInPriceCardProps) {
  const items = [
    {
      id: "1000337",
      data: [
        "Doppel-Motor 2×250W – stark",
        "Komfort-Sitz – weich & stabil",
        "Schnell faltbar – leicht transportierbar",
        "Einfache Steuerung – 360° Joystick",
      ],
    },
    {
      id: "1000330",
      data: [
        "Doppel-Motor 2×250W – stark",
        "Leicht & faltbar",
        "360°-Joystick",
        "Stabil & komfortabel",
      ],
    },
    {
      id: "1000015",
      data: [
        "Starker 1000W-Motor",
        "Bis zu 25 km/h",
        "Komfort-Sitz & Federung",
        "Hohe Stabilität & Sicherheit",
      ],
    },
    {
      id: "1000014",
      data: [
        "Starker 1000W-Motor",
        "25 km/h Höchsttempo",
        "Komfortabler Sitz",
        "Stabile & sichere Fahrt",
      ],
    },
    {
      id: "1000007",
      data: [
        "Starker 1000W-Motor",
        "25 km/h Geschwindigkeit",
        "Großer Komfortsitz",
        "Hohe Fahrstabilität",
      ],
    },
    {
      id: "1000010",
      data: [
        "1000W starker Motor",
        "25 km/h Höchsttempo",
        "Komfort-Sitz & Federung",
        "Stabile, sichere Fahrt",
      ],
    },
  ];

  // 🔥 Lấy item theo id props
  const selected = items.find((item) => item.id === id);

  return (
    <Card className="shadow-lg">
      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-black">
          {selected?.data.map((text, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              <BadgeCheck className="text-primary w-5 h-5" />
              <span>{text}</span>
            </li>
          ))}

          {/* Nếu không tìm thấy id */}
          {!selected && (
            <li className="text-sm text-gray-500">
              Keine Informationen verfügbar.
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
