"use client";
import CustomBreadCrumb from "@/components/shared/breadcrumb";
import { SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useGetAllProducts } from "@/features/products/hook";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useTranslations } from "next-intl";
import ProductsGridLayout from "@/components/shared/product-grid-layout";
import { CustomPagination } from "@/components/shared/pagination";
import ShopGridLyaout from "@/components/shared/shop-grid";
import { SortSelect } from "@/components/shared/sort-select";

export default function ShopAllPage() {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProducts({ page, page_size: pageSize, is_econelo: true });
  if (!products || isLoading) return <ProductGridSkeleton length={12} />;

  return (
    <div className="pt-[70px] xl:pb-16 pb-6 md:pt-[130px] flex flex-col items-center">
      <div className="w-11/12 md:w-8/12 space-y-4">
        <CustomBreadCrumb currentPage={"Shop All"} />
        <div className="flex justify-between items-center lg:flex-row flex-col-reverse lg:gap-0 gap-4">
          <div className="flex gap-4">
            <div className="text-base text-primary font-semibold">
              {products?.items.length} products found
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <SortSelect />
            <div className="flex gap-2">
              <SlidersHorizontal />
              Filter
            </div>
          </div>
        </div>
        <div className="">
          {/* <p className="text-center text-xl font-bold mt-2">
            {products.length === 0 ? t("emptyCategory") : ""}
          </p> */}
          {!products || isLoading ? (
            <ProductGridSkeleton
              length={16}
              col={3}
              mobileCol={1}
              width="full"
            />
          ) : (
            <div className="filter-section">
              <div className="">
                <ShopGridLyaout products={products.items} />
              </div>
            </div>
          )}
        </div>
        {products && products.items.length > 16 && (
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
