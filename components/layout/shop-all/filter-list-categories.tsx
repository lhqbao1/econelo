"use client";

import { useGetCategoriesWithChildren } from "@/features/category/hook";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import FilterSection from "./skeleton";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { CategoryResponse } from "@/types/categories";

interface FilterListCategoriesProps {
  isParentCategory?: boolean;
  categoryContextSlug?: string;
  categoryFilterMode?: "none" | "flat" | "grouped";
}

type GroupCategory = {
  id: string;
  name: string;
  options: CategoryResponse[];
};

const findCategoryBySlug = (
  categories: CategoryResponse[],
  targetSlug: string,
): CategoryResponse | null => {
  for (const category of categories) {
    if (category.slug === targetSlug) return category;
    if (Array.isArray(category.children) && category.children.length > 0) {
      const childMatch = findCategoryBySlug(category.children, targetSlug);
      if (childMatch) return childMatch;
    }
  }
  return null;
};

const getCategorySlugFromPathname = (pathname: string): string | null => {
  const cleanPath = pathname.split("?")[0];
  const segments = cleanPath.split("/").filter(Boolean);
  const markerIndex = segments.findIndex(
    (segment) => segment === "kategorie" || segment === "category",
  );

  if (markerIndex === -1) return null;
  const slugSegments = segments.slice(markerIndex + 1);
  if (slugSegments.length === 0) return null;

  return decodeURIComponent(slugSegments[slugSegments.length - 1]);
};

const FilterListCategories = ({
  isParentCategory = false,
  categoryContextSlug,
  categoryFilterMode = "flat",
}: FilterListCategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const slugFromPath = getCategorySlugFromPathname(pathname);
  const activeCategorySlug = categoryContextSlug ?? slugFromPath;

  const {
    data: parentCategories,
    isLoading,
    isError,
  } = useGetCategoriesWithChildren({ is_econelo: true });

  const { flatCategories, groupedCategories } = useMemo(() => {
    if (!parentCategories) {
      return {
        flatCategories: [] as CategoryResponse[],
        groupedCategories: [] as GroupCategory[],
      };
    }

    if (categoryFilterMode === "none") {
      return {
        flatCategories: [] as CategoryResponse[],
        groupedCategories: [] as GroupCategory[],
      };
    }

    if (!activeCategorySlug && !isParentCategory) {
      return {
        flatCategories: parentCategories.flatMap((parent) => parent.children ?? []),
        groupedCategories: [] as GroupCategory[],
      };
    }

    const currentCategory = activeCategorySlug
      ? findCategoryBySlug(parentCategories, activeCategorySlug)
      : null;

    const currentChildren = Array.isArray(currentCategory?.children)
      ? currentCategory.children
      : [];

    if (currentChildren.length === 0) {
      return {
        flatCategories: [] as CategoryResponse[],
        groupedCategories: [] as GroupCategory[],
      };
    }

    if (categoryFilterMode === "grouped") {
      const groups = currentChildren
        .map((child) => ({
          id: child.id,
          name: child.name,
          options: (child.children ?? []).filter(
            (option) =>
              typeof option?.name === "string" &&
              option.name.trim().length > 0,
          ),
        }))
        .filter((group) => group.options.length > 0);

      return {
        flatCategories: [] as CategoryResponse[],
        groupedCategories: groups,
      };
    }

    return {
      flatCategories: currentChildren,
      groupedCategories: [] as GroupCategory[],
    };
  }, [activeCategorySlug, categoryFilterMode, isParentCategory, parentCategories]);

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
      {groupedCategories.map((group) => (
        <div key={group.id} className="space-y-2">
          <p className="text-sm font-semibold text-[#111827]">{group.name}</p>
          <div className="space-y-2 pl-2">
            {group.options.map((item) => {
              const checked = selectedCategories.includes(item.name);

              return (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleCategory(item.name)}
                  />
                  <span className="text-base font-light">{item.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {flatCategories.map((item) => {
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
