import { getProductBySlug, getProductsFeed } from "@/features/products/api";
import type { Metadata } from "next";
import { StaticFile } from "@/types/products";
import {
  getAllProductsSelect,
  getProductGroupDetail,
} from "@/features/product-group/api";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/layout/single-product/product-details";
import { getReviewByProduct } from "@/features/review/api";
import { ReviewResponse } from "@/types/review";

interface PageProps {
  params: Promise<{ slug: string[]; locale: string }>;
}

// 🕒 ISR: tái tạo lại mỗi 1 giờ (3600s)
export const experimental_ppr = true;
export const revalidate = 3600;
export const dynamicParams = true;

// 🏗️ Pre-render sản phẩm (SSG + ISR)
export async function generateStaticParams() {
  let products: Awaited<ReturnType<typeof getAllProductsSelect>> = [];

  try {
    products = await getAllProductsSelect({
      is_econelo: true,
      all_products: true,
    });
  } catch (error) {
    console.error("❌ getAllProductsSelect failed in generateStaticParams:", error);
    return [];
  }

  const locales = ["de", "en"];

  return products
    .filter(
      (p) =>
        p?.url_key && typeof p.url_key === "string" && p.url_key.length > 0,
    )
    .flatMap((p) =>
      locales.map((locale) => ({
        locale,
        slug: p.url_key,
      })),
    );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lastSlug = Array.isArray(slug) ? slug.at(-1) : slug;

  if (!lastSlug) return {};

  let product = null;
  try {
    product = await getProductBySlug(lastSlug);
  } catch (err) {
    console.error("❌ getProductBySlug failed in metadata:", err);
    return {};
  }

  if (!product) return notFound();

  // SAFE JSON
  product = JSON.parse(JSON.stringify(product));

  let reviews: ReviewResponse[] = [];
  try {
    reviews = await getReviewByProduct(product.id);
  } catch (error) {
    console.error("❌ getReviewByProduct failed in metadata:", error);
  }
  const hasReviews = reviews && reviews.length > 0;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.static_files?.map((f: StaticFile) => f.url),
    description: product.description,
    sku: product.sku,
    gtin13: product.ean,
    brand: {
      "@type": "Brand",
      name: product.brand?.name ?? "Econelo",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.econelo.de/produkt/${product.url_key}`,
      priceCurrency: "EUR",
      price: String(product.final_price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceValidUntil: "2026-12-31",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.econelo.de",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.categories?.[0]?.name ?? "Produkte",
        item: `https://www.econelo.de/kategorie/${product.categories?.[0]?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://www.econelo.de/produkt/${product.url_key}`,
      },
    ],
  };

  if (hasReviews) {
    const ratingValue =
      reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;

    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: reviews.length,
    };
  }

  if (product.ean) {
    schema.gtin13 = product.ean;
  }

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.description?.slice(0, 150),
    openGraph: {
      title: product.meta_title || product.name,
      description:
        product.meta_description || product.description?.slice(0, 150),
      url: `https://www.econelo.de/produkt/${product.url_key}`,
      images:
        product.static_files?.map((f: StaticFile) => ({ url: f.url })) ?? [],
    },
    other: {
      "application/ld+json": JSON.stringify([schema, breadcrumbSchema]),
    },
  };
}

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const lastSlug = Array.isArray(slug) ? slug.at(-1) : slug;

  if (!lastSlug) return notFound();

  /* ----------------------------------------------------
   * 1) GET PRODUCT (wrapped in try/catch to prevent 502 crash)
   * --------------------------------------------------*/
  let product: any = null;

  try {
    product = await getProductBySlug(lastSlug);
  } catch (err) {
    console.error("❌ getProductBySlug failed:", err);
    return notFound(); // ✔ SAFE FALLBACK
  }

  if (!product) return notFound();

  // ⭐ Convert to JSON to avoid "function passed to client component"
  product = JSON.parse(JSON.stringify(product));

  /* ----------------------------------------------------
   * 2) PARALLEL REQUESTS (SAFE WRAPPED)
   * --------------------------------------------------*/
  let reviews: ReviewResponse[] = [];
  let parentProduct = null;

  try {
    const promises: Promise<any>[] = [getReviewByProduct(product.id)];

    if (product.parent_id) {
      promises.push(getProductGroupDetail(product.parent_id));
    }

    const results = await Promise.allSettled(promises);

    reviews = results[0].status === "fulfilled" ? results[0].value : [];

    parentProduct =
      results[1]?.status === "fulfilled" ? results[1].value : null;
  } catch (err) {
    console.error("❌ Error fetching child data:", err);
  }

  // Convert to plain JSON
  const plainProduct = toPlain(product);
  const plainReviews = toPlain(reviews);
  const plainParent = toPlain(parentProduct);

  return (
    <div className="w-full flex justify-center py-12 xl:pt-[120px] lg:pt-[160px] pt-[50px]">
      <ProductDetails
        parentProductData={plainParent}
        productDetailsData={plainProduct}
        productId={product.id}
      />
    </div>
  );
}
