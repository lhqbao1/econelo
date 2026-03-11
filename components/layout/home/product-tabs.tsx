"use client";

import { useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlug } from "@/features/category/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Head from "next/head";
import ProductsGridLayout from "@/components/shared/product-grid-layout";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useTranslations } from "next-intl";

interface CategoryTab {
  id: string;
  name: string;
  slug: string;
}

interface ProductTabsClientProps {
  categoriesList: CategoryTab[];
}

export default function ProductTabsClient({
  categoriesList,
}: ProductTabsClientProps) {
  const t = useTranslations();
  const [active, setActive] = useState<string>(categoriesList?.[1]?.slug ?? "");

  const { data, isLoading } = useQuery({
    queryKey: ["categoryProducts", active],
    queryFn: () =>
      getCategoryBySlug(active, {
        is_econelo: true,
      }),
    enabled: !!active,
  });

  const products = data?.products ?? [];

  const reordered = [
    categoriesList[1], // cat thứ 2
    categoriesList[3], // cat thứ 4
    ...categoriesList.filter((_, i) => i !== 1 && i !== 3),
  ];

  console.log(reordered);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "New Arrived Products",
              itemListElement: products.map((p, i) => ({
                "@type": "Product",
                position: i + 1,
                name: p.name,
                image: p.static_files?.[0]?.url,
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/produkt/${p.url_key}`,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "EUR",
                  price: p.final_price,
                  availability: "https://schema.org/InStock",
                },
              })),
            }),
          }}
        />
      </Head>

      <section
        className="w-full lg:py-12 md:py-8 py-6 bg-white flex justify-center"
        aria-labelledby="new-arrived-title"
      >
        <div className="w-full flex flex-col items-center">
          <div className="text-center mb-8 px-4">
            <div className="flex justify-center items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {t("whatNext")}
              </span>
            </div>
            <h2
              id="new-arrived-title"
              className="text-3xl md:text-4xl font-extrabold leading-snug"
            >
              {t("tabTitle")}
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {t("tabDes")}
            </p>
          </div>

          {isLoading && <ProductGridSkeleton />}

          {!isLoading && (
            <Tabs
              value={active}
              onValueChange={setActive}
              defaultValue={reordered[0]?.slug}
              className="w-full"
            >
              <TabsList className="flex flex-wrap justify-center gap-3 mb-8 bg-transparent px-4">
                {reordered.map((cat, i) => (
                  <Fragment key={cat.id}>
                    <TabsTrigger
                      value={cat?.slug ?? ""}
                      className={cn(
                        "lg:px-5 px-2 lg:py-3 py-1 font-medium text-sm uppercase transition-all rounded-full border border-gray-200",
                        active === cat.slug
                          ? "bg-primary text-white border-primary"
                          : "text-gray-600 hover:bg-primary hover:text-white",
                      )}
                    >
                      {cat.name}
                    </TabsTrigger>
                    <div className="hidden lg:block">
                      {i < categoriesList.length - 1 && (
                        <Separator orientation="vertical" />
                      )}
                    </div>
                  </Fragment>
                ))}
              </TabsList>

              <TabsContent className="w-full" value={active}>
                {isLoading ? (
                  <ProductGridSkeleton />
                ) : (
                  <ProductsGridLayout data={products} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </>
  );
}
