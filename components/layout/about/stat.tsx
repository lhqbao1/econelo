"use client";

import CountUp from "@/components/shared/count-up";
import { BatteryCharging, MapPin, Car, Truck } from "lucide-react";

const stats = [
  {
    icon: <BatteryCharging className="w-10 h-10 text-lime-400" />,
    value: 1582,
    unit: "+",
    label: "Charging sessions",
  },
  {
    icon: <MapPin className="w-10 h-10 text-lime-400" />,
    value: 650,
    unit: "m",
    label: "Green kms driven",
  },
  {
    icon: <Car className="w-10 h-10 text-lime-400" />,
    value: 562,
    unit: "+",
    label: "Service Stations",
  },
  {
    icon: <Truck className="w-10 h-10 text-lime-400" />,
    value: 282,
    unit: "+",
    label: "Electric Vehicles",
  },
];

export default function StatsSection() {
  return (
    <section className="flex justify-center w-full lg:py-12 md:py-8 py-6 bg-transparent">
      <div className="bg-black text-white rounded-b-[60px] rounded-t-3xl md:rounded-t-[40px] px-8 py-10 md:py-14 w-11/12 max-w-6xl shadow-xl flex flex-wrap justify-around gap-y-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center w-[150px] sm:w-[200px]"
          >
            <div className="mb-4">{stat.icon}</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-lime-400 tracking-tight flex gap-1">
              <CountUp
                from={0}
                to={stat.value}
                separator=","
                direction="up"
                duration={1}
                className=""
              />
              <p>{stat.unit}</p>
            </div>
            <div className="text-sm mt-1 text-white">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
