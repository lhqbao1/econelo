"use client";
import CustomBreadCrumb from "@/components/shared/breadcrumb";
import React, { useEffect, useMemo, useState } from "react";

import {
  useGetAllProducts,
  useProductsAlgoliaSearch,
} from "@/features/products/hook";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useTranslations } from "next-intl";
import { CustomPagination } from "@/components/shared/pagination";
import ShopGridLyaout from "@/components/shared/shop-grid";
import { SortSelect } from "@/components/shared/sort-select";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { Input } from "@/components/ui/input";

export default function ShopAllPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 🔹 1. LẤY PARAMS TỪ URL
  const query = searchParams.get("search") ?? "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const pageSizeFromUrl = Number(searchParams.get("page_size")) || 40;

  const brands = searchParams.getAll("brand");
  const brandsKey =
    brands.length > 0 ? brands.slice().sort().join("|") : undefined;

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

  // 🔹 2. STATE (sync với URL)
  const [page, setPage] = useState(pageFromUrl);
  const [pageSize, setPageSize] = useState(pageSizeFromUrl);
  const [searchValue, setSearchValue] = useState(query);

  // 🔹 3. SYNC khi back / reload
  useEffect(() => {
    setPage(pageFromUrl);
    setPageSize(pageSizeFromUrl);
  }, [pageFromUrl, pageSizeFromUrl]);

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

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, query, pathname, router, searchParams]);

  // 🔹 4. QUERY
  const { data, isLoading, isError } = useProductsAlgoliaSearch({
    page,
    page_size: pageSize,
    query: query || undefined,
    is_active: true,
    is_econelo: true,
    brand: brands,
    categories, // 👈 gửi array cho API
    categoriesKey, // 👈 chỉ dùng cho cache
    brandsKey,
    color: colors,
    colorsKey,
    materials: materials,
    materialsKey,
    delivery_time: deliveryTime,
    delivery_timeKey: deliveryTimeKey,
  });

  // 🔹 5. UPDATE URL khi đổi page
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    return <div className="text-center py-10">Something went wrong</div>;
  }

  return (
    <div className="pt-[70px] xl:pb-16 pb-6 md:pt-[130px] flex flex-col items-center">
      <div className="w-11/12 md:w-8/12 space-y-4">
        <CustomBreadCrumb currentPage={t("shopAll")} />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={`${t("search")}...`}
          className="w-full lg:w-1/3 bg-white"
        />
        <div className="flex justify-between items-center lg:flex-row flex-col-reverse lg:gap-0 gap-4">
          <div className="flex gap-4">
            <div className="text-base text-primary font-semibold">
              {data?.items == null || data?.items.length === 0 ? (
                <span className="inline-block h-4 w-10 rounded bg-gray-200 animate-pulse motion-reduce:animate-none align-middle" />
              ) : (
                data.pagination.total_items
              )}{" "}
              {t("productsFound")}
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <SortSelect />
          </div>
        </div>
        <div className="">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <ProductGridSkeleton
                length={16}
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
              <div className="">
                <ShopGridLyaout products={data?.items ?? []} />
              </div>
            </div>
          )}
        </div>
        {data && data.pagination.total_items > 16 && (
          <CustomPagination
            totalPages={data.pagination.total_pages}
            page={page}
            onPageChange={(newPage) => handlePageChange(newPage)}
          />
        )}
      </div>
    </div>
  );
}
