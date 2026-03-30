"use client";
import CustomBreadCrumb from "@/components/shared/breadcrumb";
import React, { useEffect, useState } from "react";

import { useProductsAlgoliaSearch } from "@/features/products/hook";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useTranslations } from "next-intl";
import { CustomPagination } from "@/components/shared/pagination";
import ShopGridLyaout from "@/components/shared/shop-grid";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { Input } from "@/components/ui/input";
import ShopAllFilterSection from "@/components/layout/shop-all/shop-all-filter-section";
import MobileFilter from "@/components/layout/shop-all/mobile-filter";
import { Button } from "@/components/ui/button";
import { RotateCcw, SearchX } from "lucide-react";

const SHOP_ALL_PAGE_SIZE = 18;
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

export default function ShopAllPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 🔹 1. LẤY PARAMS TỪ URL
  const query = searchParams.get("search") ?? "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const priceMin = parsePriceParam(
    searchParams.get("price_min"),
    DEFAULT_PRICE_MIN,
  );
  const priceMax = parsePriceParam(
    searchParams.get("price_max"),
    DEFAULT_PRICE_MAX,
  );

  const categories = searchParams.getAll("categories");
  const categoriesKey =
    categories.length > 0 ? categories.slice().sort().join("|") : undefined;

  const colors = searchParams.getAll("color");
  const colorsKey =
    colors.length > 0 ? colors.slice().sort().join("|") : undefined;

  const materials = searchParams.getAll("materials");
  const materialsKey =
    materials.length > 0 ? materials.slice().sort().join("|") : undefined;

  const deliveryTime = searchParams.getAll("delivery_time");
  const deliveryTimeKey =
    deliveryTime.length > 0 ? deliveryTime.slice().sort().join("|") : undefined;
  const hasActiveFilters =
    query.trim().length > 0 ||
    categories.length > 0 ||
    colors.length > 0 ||
    materials.length > 0 ||
    deliveryTime.length > 0 ||
    priceMin !== DEFAULT_PRICE_MIN ||
    priceMax !== DEFAULT_PRICE_MAX;

  // 🔹 2. STATE (sync với URL)
  const [page, setPage] = useState(pageFromUrl);
  const [searchValue, setSearchValue] = useState(query);

  // 🔹 3. SYNC khi back / reload
  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  // 🔹 3.1 DEBOUNCE & SYNC SEARCH → URL
  useEffect(() => {
    const timeout = setTimeout(() => {
      const value = searchValue.trim();
      if (value === query) return;

      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page"); // reset page when search changes
      params.delete("page_size");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, query, pathname, router, searchParams]);

  // 🔹 4. QUERY
  const { data, isLoading, isError } = useProductsAlgoliaSearch({
    page,
    page_size: SHOP_ALL_PAGE_SIZE,
    query: query || undefined,
    is_active: true,
    is_econelo: true,
    categories, // 👈 gửi array cho API
    categoriesKey, // 👈 chỉ dùng cho cache
    color: colors,
    colorsKey,
    materials: materials,
    materialsKey,
    delivery_time: deliveryTime,
    delivery_timeKey: deliveryTimeKey,
    price_min: priceMin,
    price_max: priceMax,
  });

  // 🔹 5. UPDATE URL khi đổi page
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.delete("page_size");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetAllFilters = () => {
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

  return (
    <div className="pt-[70px] xl:pb-16 pb-6 md:pt-[130px]">
      <div className="w-11/12 mx-auto space-y-4">
        <CustomBreadCrumb currentPage={t("shopAll")} />

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-36 max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 no-scrollbar">
              <ShopAllFilterSection />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-4">
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

              <div className="flex gap-3 items-center">
                <div className="lg:hidden">
                  <MobileFilter />
                </div>
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
                          onClick={handleResetAllFilters}
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

            {data && data.pagination.total_items > SHOP_ALL_PAGE_SIZE && (
              <CustomPagination
                totalPages={data.pagination.total_pages}
                page={page}
                onPageChange={(newPage) => handlePageChange(newPage)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
