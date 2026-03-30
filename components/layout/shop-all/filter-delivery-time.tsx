"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";

const FilterListDeliveryTime = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const deliveryTimes = ["1-3", "3-5", "5-8", "8-14", "14-20", "20-30"];

  const selectedBrands = searchParams.getAll("delivery_time");

  const toggleBrand = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("delivery_time");

    params.delete("delivery_time");

    if (current.includes(value)) {
      // ❌ đã có → remove
      current
        .filter((c) => c !== value)
        .forEach((c) => params.append("delivery_time", c));
    } else {
      // ✅ chưa có → add
      current.forEach((c) => params.append("delivery_time", c));
      params.append("delivery_time", value);
    }

    // reset page khi filter đổi
    params.delete("page_size");
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-3">
      {deliveryTimes.map((item, index) => {
        const checked = selectedBrands.includes(item);

        return (
          <label
            key={index}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggleBrand(item)} // ✅ FIX
            />
            <span className="text-base font-light mt-0.5">
              {t("deliveryTimeFilter", { days: item })}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default FilterListDeliveryTime;
