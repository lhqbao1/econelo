"use client";
import CustomBreadCrumb from "@/components/shared/breadcrumb";
import React, { useState } from "react";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useAtom } from "jotai";
import {
  currentCategoryIdAtom,
  currentCategoryNameAtom,
} from "@/store/category";
import { useTranslations } from "next-intl";
import { CategoryBySlugResponse } from "@/types/categories";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlug } from "@/features/category/api";
import { CustomPagination } from "@/components/shared/pagination";
import ProductsGridLayout from "@/components/shared/product-grid-layout";
import ShopGridLyaout from "@/components/shared/shop-grid";
import { Filter, SlidersHorizontal } from "lucide-react";
import { SortSelect } from "@/components/shared/sort-select";

interface ProductCategoryProps {
  categorySlugs: string[];
  tag?: string;
  category?: CategoryBySlugResponse;
}

const ProductCategory = ({
  categorySlugs,
  tag,
  category,
}: ProductCategoryProps) => {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [currentCategoryName, setCurrentCategoryName] = useAtom(
    currentCategoryNameAtom,
  );

  const { data: categoryData, isFetching } = useQuery({
    queryKey: ["category", categorySlugs, page, pageSize],
    queryFn: () =>
      getCategoryBySlug(categorySlugs[categorySlugs.length - 1], {
        page,
        page_size: pageSize,
      }),
    initialData: category, // 👈 lấy từ server render lần đầu
  });

  return (
    <div className="pt-[70px] xl:pb-16 pb-6 md:pt-[130px] flex flex-col items-center">
      <div className="w-11/12 md:w-8/12 space-y-4">
        <CustomBreadCrumb currentPage={category?.name ?? ""} />
        <div className="flex justify-between items-center lg:flex-row flex-col-reverse lg:gap-0 gap-4">
          <div className="flex gap-4">
            <div className="text-base text-primary font-semibold">
              {category?.products.length} {t("productsFound")}
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
          <p className="text-center text-xl font-bold mt-2">
            {category?.products.length === 0 ? t("emptyCategory") : ""}
          </p>
          {!categoryData || isFetching ? (
            <ProductGridSkeleton
              length={16}
              col={3}
              mobileCol={1}
              width="full"
            />
          ) : (
            <div className="filter-section">
              <div className="">
                <ShopGridLyaout products={categoryData.products} />
              </div>
            </div>
          )}
        </div>
        {categoryData && categoryData.products.length > 16 && (
          <CustomPagination
            totalPages={categoryData.total_pages}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
