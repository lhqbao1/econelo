"use client";

import { useState, Fragment, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlug } from "@/features/category/api";
import { getAllProducts } from "@/features/products/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Head from "next/head";
import ProductsGridLayout from "@/components/shared/product-grid-layout";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { useTranslations } from "next-intl";
import { ProductItem } from "@/types/products";

const HOMEPAGE_PINNED_PRODUCT_KEY = "coc";

const normalizeValue = (value?: string | null) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const shouldPinProduct = (product: ProductItem, pinnedKey: string) => {
  const normalizedPinnedKey = normalizeValue(pinnedKey);

  if (!normalizedPinnedKey) return false;

  const isExactMatch = [product.url_key, product.sku].some(
    (field) => normalizeValue(field) === normalizedPinnedKey,
  );

  if (isExactMatch) return true;

  return normalizeValue(product.name).includes(normalizedPinnedKey);
};

const movePinnedProductToFront = (products: ProductItem[], pinnedKey: string) => {
  const index = products.findIndex((product) =>
    shouldPinProduct(product, pinnedKey),
  );

  if (index <= 0) return products;

  const orderedProducts = [...products];
  const pinnedProduct = orderedProducts[index];

  if (!pinnedProduct) return products;

  orderedProducts.splice(index, 1);
  orderedProducts.unshift(pinnedProduct);

  return orderedProducts;
};

const mergeProductsWithPinnedFirst = (
  products: ProductItem[],
  pinnedProduct: ProductItem | undefined,
  pinnedKey: string,
) => {
  const mergedProducts = pinnedProduct ? [pinnedProduct, ...products] : products;
  const uniqueProducts = mergedProducts.filter((product, index, list) => {
    const productIdentity = product.id || product.url_key;
    return (
      list.findIndex((item) => {
        const itemIdentity = item.id || item.url_key;
        return itemIdentity === productIdentity;
      }) === index
    );
  });

  return movePinnedProductToFront(uniqueProducts, pinnedKey);
};

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

  const { data: pinnedProductSearchData } = useQuery({
    queryKey: ["homepagePinnedProduct", HOMEPAGE_PINNED_PRODUCT_KEY],
    queryFn: () =>
      getAllProducts({
        is_econelo: true,
        all_products: true,
        search: HOMEPAGE_PINNED_PRODUCT_KEY,
      }),
  });

  const products = useMemo(
    () => {
      const pinnedProduct = pinnedProductSearchData?.items?.find((product) => {
        const inActiveCategory = Array.isArray(product.categories)
          ? product.categories.some((category) => category.slug === active)
          : false;

        return inActiveCategory && shouldPinProduct(product, HOMEPAGE_PINNED_PRODUCT_KEY);
      });

      return mergeProductsWithPinnedFirst(
        data?.products ?? [],
        pinnedProduct,
        HOMEPAGE_PINNED_PRODUCT_KEY,
      );
    },
    [active, data?.products, pinnedProductSearchData?.items],
  );

  const reordered = [
    categoriesList[1], // cat thứ 2
    categoriesList[3], // cat thứ 4
    ...categoriesList.filter((_, i) => i !== 1 && i !== 3),
  ]
    .filter(Boolean)
    .slice(0, 4);

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
                      {i < reordered.length - 1 && (
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
                  <ProductsGridLayout data={products} showCategoryLabel={false} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </>
  );
}
