"use client";

import { useGetCategoriesWithChildren } from "@/features/category/hook";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import FilterSection from "./skeleton";
import { usePathname, useRouter } from "@/src/i18n/navigation";

interface FilterListCategoriesProps {
  isParentCategory?: boolean;
}

const FilterListCategories = ({
  isParentCategory = false,
}: FilterListCategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const slug = pathname.split("/kategorie/")[1] ?? pathname.split("/category/")[1];

  const {
    data: parentCategories,
    isLoading,
    isError,
  } = useGetCategoriesWithChildren({ is_econelo: true });

  const categories = useMemo(() => {
    if (!parentCategories) return [];
    if (isParentCategory && slug)
      return parentCategories.find((p) => p.name.toLowerCase().includes(slug))
        ?.children;
    return parentCategories.flatMap((parent) => parent.children ?? []);
  }, [isParentCategory, parentCategories, slug]);

  const selectedCategories = searchParams.getAll("categories");

  const toggleCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("categories");

    params.delete("categories");

    if (current.includes(value)) {
      // ❌ đã có → remove
      current
        .filter((c) => c !== value)
        .forEach((c) => params.append("categories", c));
    } else {
      // ✅ chưa có → add
      current.forEach((c) => params.append("categories", c));
      params.append("categories", value);
    }

    // reset page khi filter đổi
    params.delete("page_size");
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isLoading)
    return (
      <div className="pr-4">
        <FilterSection />
      </div>
    );
  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="space-y-3">
      {categories?.map((item) => {
        const checked = selectedCategories.includes(item.name);

        return (
          <label
            key={item.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggleCategory(item.name)} // ✅ FIX
            />
            <span className="text-base font-light">{item.name}</span>
          </label>
        );
      })}
    </div>
  );
};

export default FilterListCategories;
