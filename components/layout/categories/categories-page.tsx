"use client";

import CustomBreadCrumb from "@/components/shared/breadcrumb";
import React, { useEffect, useMemo, useState } from "react";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useTranslations } from "next-intl";
import { CategoryBySlugResponse, CategoryResponse } from "@/types/categories";
import { CustomPagination } from "@/components/shared/pagination";
import ShopGridLyaout from "@/components/shared/shop-grid";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import ShopAllFilterSection from "@/components/layout/shop-all/shop-all-filter-section";
import MobileFilter from "@/components/layout/shop-all/mobile-filter";
import { useProductsAlgoliaSearch } from "@/features/products/hook";
import { useGetCategoriesWithChildren } from "@/features/category/hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, SearchX } from "lucide-react";

interface ProductCategoryProps {
  categorySlugs: string[];
  category?: CategoryBySlugResponse;
}

type CategoryFilterMode = "none" | "flat" | "grouped";

const SHOP_CATEGORY_PAGE_SIZE = 18;
const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 5000;

const parsePriceParam = (
  rawValue: string | null,
  fallbackValue: number,
): number => {
  if (rawValue === null) return fallbackValue;
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
};

const findCategoryBySlug = (
  categories: CategoryResponse[],
  targetSlug: string,
): CategoryResponse | null => {
  for (const category of categories) {
    if (category.slug === targetSlug) return category;
    if (category.children?.length) {
      const childMatch = findCategoryBySlug(category.children, targetSlug);
      if (childMatch) return childMatch;
    }
  }
  return null;
};

const getLeafCategoryNames = (
  category: CategoryResponse | null | undefined,
): string[] => {
  if (!category) return [];

  const children = Array.isArray(category.children) ? category.children : [];
  if (children.length === 0) {
    return category.name ? [category.name] : [];
  }

  const leafNames = children.flatMap((child) => getLeafCategoryNames(child));
  const cleaned = leafNames.filter(
    (name): name is string => typeof name === "string" && name.trim().length > 0,
  );

  return [...new Set(cleaned)];
};

const resolveCategoryFilterMode = (
  category: CategoryResponse | null | undefined,
): CategoryFilterMode => {
  if (!category) return "none";

  const children = Array.isArray(category.children) ? category.children : [];
  if (children.length === 0) return "none";

  const hasGrandChildren = children.some(
    (child) => Array.isArray(child.children) && child.children.length > 0,
  );

  return hasGrandChildren ? "grouped" : "flat";
};

const ProductCategory = ({ categorySlugs, category }: ProductCategoryProps) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCategorySlug = categorySlugs[categorySlugs.length - 1];

  const query = searchParams.get("search") ?? undefined;
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const priceMin = parsePriceParam(
    searchParams.get("price_min"),
    DEFAULT_PRICE_MIN,
  );
  const priceMax = parsePriceParam(
    searchParams.get("price_max"),
    DEFAULT_PRICE_MAX,
  );

  const categoriesFromUrl = searchParams.getAll("categories");
  const colors = searchParams.getAll("color");
  const colorsKey =
    colors.length > 0 ? colors.slice().sort().join("|") : undefined;

  const materials = searchParams.getAll("materials");
  const materialsKey =
    materials.length > 0 ? materials.slice().sort().join("|") : undefined;

  const deliveryTime = searchParams.getAll("delivery_time");
  const deliveryTimeKey =
    deliveryTime.length > 0 ? deliveryTime.slice().sort().join("|") : undefined;

  const [page, setPage] = useState(pageFromUrl);
  const [searchValue, setSearchValue] = useState(query ?? "");

  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    setSearchValue(query ?? "");
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const value = searchValue.trim();
      if (value === (query ?? "")) return;

      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      params.delete("page_size");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, query, pathname, router, searchParams]);

  const { data: categoriesWithChildren } = useGetCategoriesWithChildren({
    is_econelo: true,
  });

  const currentCategory = useMemo(
    () =>
      categoriesWithChildren
        ? findCategoryBySlug(categoriesWithChildren, currentCategorySlug)
        : null,
    [categoriesWithChildren, currentCategorySlug],
  );

  const defaultDeepestCategoryNames = useMemo(
    () => getLeafCategoryNames(currentCategory),
    [currentCategory],
  );

  const categoryFilterMode = useMemo(
    () => resolveCategoryFilterMode(currentCategory),
    [currentCategory],
  );

  const effectiveCategories = useMemo(() => {
    if (categoriesFromUrl.length > 0) return categoriesFromUrl;
    if (defaultDeepestCategoryNames.length > 0) return defaultDeepestCategoryNames;
    if (currentCategory?.name) return [currentCategory.name];
    if (category?.name) return [category.name];
    return [];
  }, [categoriesFromUrl, defaultDeepestCategoryNames, currentCategory, category?.name]);

  const categoriesKey =
    effectiveCategories.length > 0
      ? effectiveCategories.slice().sort().join("|")
      : undefined;

  const hasActiveFilters =
    Boolean(query?.trim()) ||
    categoriesFromUrl.length > 0 ||
    colors.length > 0 ||
    materials.length > 0 ||
    deliveryTime.length > 0 ||
    priceMin !== DEFAULT_PRICE_MIN ||
    priceMax !== DEFAULT_PRICE_MAX;

  const { data, isLoading, isError } = useProductsAlgoliaSearch({
    page,
    page_size: SHOP_CATEGORY_PAGE_SIZE,
    query,
    is_active: true,
    is_econelo: true,
    categories: effectiveCategories,
    categoriesKey,
    color: colors,
    colorsKey,
    materials,
    materialsKey,
    delivery_time: deliveryTime,
    delivery_timeKey: deliveryTimeKey,
    price_min: priceMin,
    price_max: priceMax,
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.delete("page_size");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetCategoryFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    params.delete("page_size");
    params.delete("categories");
    params.delete("brand");
    params.delete("color");
    params.delete("materials");
    params.delete("delivery_time");
    params.delete("price_min");
    params.delete("price_max");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    return <div className="text-center py-10">Something went wrong</div>;
  }

  const hasLoadedData = Boolean(data);
  const totalItems = data?.pagination.total_items ?? 0;
  const isInitialLoading = isLoading && !hasLoadedData;
  const showEmptyState = hasLoadedData && totalItems === 0;
  const shouldShowCategoryFilter = categoryFilterMode !== "none";

  return (
    <div className="pt-[70px] xl:pb-16 pb-6 md:pt-[130px]">
      <div className="w-11/12 mx-auto space-y-4">
        <CustomBreadCrumb currentPage={category?.name ?? ""} />

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-36 max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 no-scrollbar">
              <ShopAllFilterSection
                isShopAll={false}
                isParentCategory={false}
                showCategoryFilter={shouldShowCategoryFilter}
                categoryContextSlug={currentCategorySlug}
                categoryFilterMode={categoryFilterMode}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-4">
            <h1 className="text-3xl font-black">{category?.name ?? ""}</h1>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`${t("search")}...`}
              className="w-full lg:w-1/2 bg-white"
            />

            <div className="flex justify-between items-center lg:flex-row flex-col-reverse lg:gap-0 gap-4">
              <div className="flex gap-4">
                <div className="text-base text-primary font-semibold">
                  {isInitialLoading ? (
                    <span className="inline-block h-4 w-10 rounded bg-gray-200 animate-pulse motion-reduce:animate-none align-middle" />
                  ) : (
                    totalItems
                  )}{" "}
                  {t("productsFound")}
                </div>
              </div>

              <div className="lg:hidden">
                <MobileFilter
                  isShopAll={false}
                  isParentCategory={false}
                  showCategoryFilter={shouldShowCategoryFilter}
                  categoryContextSlug={currentCategorySlug}
                  categoryFilterMode={categoryFilterMode}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center">
                <ProductGridSkeleton
                  length={18}
                  col={3}
                  mobileCol={1}
                  width="full"
                />
              </div>
            ) : (
              <div
                className={`filter-section ${isLoading ? "opacity-60" : ""}`}
                aria-busy={isLoading}
              >
                {showEmptyState ? (
                  <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-primary/5 px-6 py-12 md:px-10 md:py-16 shadow-[0_22px_50px_-28px_hsl(var(--primary)/0.7)]">
                    <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_30px_-18px_hsl(var(--primary)/0.8)]">
                        <SearchX className="size-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-primary">
                        {t("shopEmptyTitle")}
                      </h2>
                      <p className="mt-3 text-sm text-gray-600 md:text-base">
                        {t("shopEmptyDescription")}
                      </p>

                      {hasActiveFilters ? (
                        <Button
                          type="button"
                          onClick={handleResetCategoryFilters}
                          className="mt-6 rounded-full px-6"
                        >
                          <RotateCcw className="mr-2 size-4" />
                          {t("shopEmptyResetCta")}
                        </Button>
                      ) : (
                        <p className="mt-6 text-sm font-medium text-primary/80">
                          {t("shopEmptyHint")}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <ShopGridLyaout products={data?.items ?? []} />
                )}
              </div>
            )}

            {data && data.pagination.total_items > SHOP_CATEGORY_PAGE_SIZE && (
              <CustomPagination
                totalPages={data.pagination.total_pages}
                page={page}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
