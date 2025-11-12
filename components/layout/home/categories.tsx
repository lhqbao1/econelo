"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { Category, CategoryResponse } from "@/types/categories";
import { flattenChildCategories } from "@/lib/flattern-categories";

interface CategorySectionProps {
  categories: CategoryResponse[];
}

export default async function CategorySection({
  categories,
}: CategorySectionProps) {
  const router = useRouter();
  const t = useTranslations();

  const childCategories = useMemo(
    () => flattenChildCategories(categories),
    [categories]
  );

  return (
    <section className="w-full flex justify-center">
      <div className="w-11/12 lg:w-8/12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start px-6 bg-[#EFF3F5]/60 rounded-[40px] py-24 relative">
        {/* Left column */}
        <div className="space-y-6 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="uppercase text-sm font-semibold text-gray-600">
              {t("chooseRide")}
            </span>
          </div>

          <h2 className="text-4xl font-extrabold leading-snug text-black">
            {t("discoverEconelo")}
          </h2>

          <p className="text-gray-500 text-base leading-relaxed max-w-md">
            {t("chooseRideDes")}
          </p>
        </div>

        {/* Right side - grid 2x2 categories */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {childCategories.slice(0, 4).map((cat, index) => (
            <div
              key={index}
              className="relative group h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
            >
              {/* Background image */}
              <Image
                src={cat.img_url ?? "/category-section-image-1.png"}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500"></div>

              {/* Category content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center transition-all duration-500">
                <h3 className="text-2xl font-semibold mb-4">{cat.name}</h3>

                <Button
                  variant="outline"
                  className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 border-white text-black hover:bg-white hover:text-black"
                  onClick={() => router.push(`/kategorie/${cat.slug}`)}
                >
                  {t("viewMore")} →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
