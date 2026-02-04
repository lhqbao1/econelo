"use client";
import CustomBreadCrumb from "@/components/shared/breadcrumb";
import React, { useEffect, useMemo, useState } from "react";

import { useGetAllProducts } from "@/features/products/hook";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useTranslations } from "next-intl";
import { CustomPagination } from "@/components/shared/pagination";
import ShopGridLyaout from "@/components/shared/shop-grid";
import { SortSelect } from "@/components/shared/sort-select";

export default function ShopAllPage() {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const {
    data: products,
    isLoading,
    isError,
    isFetching,
  } = useGetAllProducts({
    page,
    page_size: pageSize,
    is_econelo: true,
    all_products: true,
  });

  const [lastTotalItems, setLastTotalItems] = useState<number | null>(null);

  useEffect(() => {
    if (products?.pagination?.total_items != null) {
      setLastTotalItems(products.pagination.total_items);
    }
  }, [products?.pagination?.total_items]);

  const totalItems =
    products?.pagination?.total_items ?? lastTotalItems ?? null;

  const isInitialLoading = isLoading && !products;

  return (
    <div className="pt-[70px] xl:pb-16 pb-6 md:pt-[130px] flex flex-col items-center">
      <div className="w-11/12 md:w-8/12 space-y-4">
        <CustomBreadCrumb currentPage={t("shopAll")} />
        <div className="flex justify-between items-center lg:flex-row flex-col-reverse lg:gap-0 gap-4">
          <div className="flex gap-4">
            <div className="text-base text-primary font-semibold">
              {totalItems == null ? (
                <span className="inline-block h-4 w-10 rounded bg-gray-200 animate-pulse motion-reduce:animate-none align-middle" />
              ) : (
                totalItems
              )}{" "}
              {t("productsFound")}
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <SortSelect />
          </div>
        </div>
        <div className="">
          {isInitialLoading ? (
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
              className={`filter-section ${isFetching ? "opacity-60" : ""}`}
              aria-busy={isFetching}
            >
              <div className="">
                <ShopGridLyaout products={products?.items ?? []} />
              </div>
            </div>
          )}
        </div>
        {products && products.pagination.total_items > 16 && (
          <CustomPagination
            totalPages={products.pagination.total_pages}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
}
