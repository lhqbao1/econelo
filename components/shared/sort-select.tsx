"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function SortSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
}) {
  const t = useTranslations("sort");

  return (
    <div className="flex items-center gap-2">
      {/* <label className="text-sm text-muted-foreground">{t("label")}:</label> */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t("options.newest")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{t("options.newest")}</SelectItem>
          <SelectItem value="price_low">{t("options.price_low")}</SelectItem>
          <SelectItem value="price_high">{t("options.price_high")}</SelectItem>
          <SelectItem value="name">{t("options.name")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
