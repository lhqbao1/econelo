"use client";

import ProductsGridLayout from "@/components/shared/product-grid-layout";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useGetAllProducts } from "@/features/products/hook";
import { useTranslations } from "next-intl";

export default function NewArrivedSection() {
  const t = useTranslations();
  const { data: products, isLoading, isError } = useGetAllProducts({});

  return (
    <section className="w-full lg:py-12 md:py-8 py-6 bg-white flex justify-center">
      <div className="w-full flex flex-col justify-center items-center">
        {/* Heading */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t("whatNext")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold max-w-xl mx-auto leading-snug">
            {t("newArrived")}
          </h2>
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <ProductsGridLayout data={products?.items ?? []} />
        )}
      </div>
    </section>
  );
}
