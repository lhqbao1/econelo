import { getProductBySlug } from "@/features/products/api";
import type { Metadata } from "next";
import { ProductItem } from "@/types/products";
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

const SITE_URL = "https://econelo.de";
const DEFAULT_PRODUCT_IMAGE = `${SITE_URL}/product-placeholder.png`;
const FALLBACK_PRODUCT_NAME = "Produkt";
const FALLBACK_PRODUCT_DESCRIPTION =
  "Entdecken Sie Produktinformationen bei Econelo.";

function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getProductUrl(urlKey?: string): string {
  return `${SITE_URL}/produkt/${urlKey ?? ""}`;
}

function getProductImageUrls(product: ProductItem): string[] {
  const urls =
    product.static_files
      ?.map((file) => file?.url)
      .filter((url): url is string => typeof url === "string" && url.length > 0) ??
    [];

  return urls.length > 0 ? urls : [DEFAULT_PRODUCT_IMAGE];
}

function getProductMetaDescription(product: ProductItem): string {
  const raw = product.meta_description || product.description || "";
  return stripHtml(raw).slice(0, 160) || FALLBACK_PRODUCT_DESCRIPTION;
}

function buildProductSchemas(product: ProductItem, reviews: ReviewResponse[]) {
  const productUrl = getProductUrl(product.url_key);
  const category = product.categories?.[0];
  const imageUrls = getProductImageUrls(product);
  const description = getProductMetaDescription(product);
  const price = product.final_price ?? product.price ?? 0;
  const inStock = Number(product.stock ?? 0) > 0;
  const safeName = product.name || FALLBACK_PRODUCT_NAME;
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: safeName,
    url: productUrl,
    image: imageUrls,
    description,
    sku: product.sku || undefined,
    gtin13: product.ean || undefined,
    brand: {
      "@type": "Brand",
      name: product.brand?.name ?? "Econelo",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: String(price),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  if (safeReviews.length > 0) {
    const ratingValue =
      safeReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
      safeReviews.length;

    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount: safeReviews.length,
    };
  }

  const breadcrumbItems: Array<Record<string, unknown>> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ];

  if (category?.slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: category.name || "Produkte",
      item: `${SITE_URL}/kategorie/${category.slug}`,
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: safeName,
    item: productUrl,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return {
    productSchema,
    breadcrumbSchema,
    productUrl,
    imageUrls,
    description,
  };
}

function normalizeProductForRender(product: ProductItem): ProductItem {
  const plain = toPlain(product, {} as ProductItem);
  const safeStock = Number(plain.stock);
  const safePrice = Number(plain.price);
  const safeFinalPrice = Number(plain.final_price);

  return {
    ...plain,
    id: plain.id ?? "",
    name: plain.name || FALLBACK_PRODUCT_NAME,
    description: plain.description || "",
    url_key: plain.url_key || "",
    sku: plain.sku || "",
    ean: plain.ean || "",
    meta_title: plain.meta_title || plain.name || FALLBACK_PRODUCT_NAME,
    meta_description: plain.meta_description || "",
    stock: Number.isFinite(safeStock) ? safeStock : 0,
    price: Number.isFinite(safePrice)
      ? safePrice
      : Number.isFinite(safeFinalPrice)
        ? safeFinalPrice
        : 0,
    final_price: Number.isFinite(safeFinalPrice)
      ? safeFinalPrice
      : Number.isFinite(safePrice)
        ? safePrice
        : 0,
    static_files: Array.isArray(plain.static_files) ? plain.static_files : [],
    categories: Array.isArray(plain.categories)
      ? plain.categories.map((category) => ({
          ...category,
          children: Array.isArray(category?.children) ? category.children : [],
        }))
      : [],
    pdf_files: Array.isArray(plain.pdf_files) ? plain.pdf_files : [],
    options: Array.isArray(plain.options) ? plain.options : [],
    packages: Array.isArray(plain.packages) ? plain.packages : [],
    marketplace_products: Array.isArray(plain.marketplace_products)
      ? plain.marketplace_products
      : [],
    bundles: Array.isArray(plain.bundles) ? plain.bundles : [],
    inventory: Array.isArray(plain.inventory) ? plain.inventory : [],
    log_stocks: Array.isArray(plain.log_stocks) ? plain.log_stocks : [],
    inventory_pos: Array.isArray(plain.inventory_pos) ? plain.inventory_pos : [],
    vouchers: Array.isArray(plain.vouchers) ? plain.vouchers : [],
    faqs: Array.isArray(plain.faqs) ? plain.faqs : [],
    brand: plain.brand ?? ({ name: "Econelo" } as ProductItem["brand"]),
    owner: plain.owner ?? ({} as ProductItem["owner"]),
  } as ProductItem;
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

  let product: ProductItem | null = null;
  try {
    product = await getProductBySlug(lastSlug);
  } catch (err) {
    console.error("❌ getProductBySlug failed in metadata:", err);
    return {};
  }

  if (!product) notFound();
  let productData: ProductItem;
  try {
    productData = normalizeProductForRender(product);
  } catch (err) {
    console.error("❌ normalizeProductForRender failed in metadata:", err);
    return {};
  }

  const { productUrl, imageUrls, description } = buildProductSchemas(productData, []);

  return {
    title: productData.meta_title || productData.name,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: productData.meta_title || productData.name,
      description,
      url: productUrl,
      images: imageUrls.map((url) => ({ url })),
    },
  };
}

function toPlain<T>(data: T, fallback: T): T {
  try {
    const serialized = JSON.stringify(data);
    if (serialized === undefined) return fallback;
    return JSON.parse(serialized) as T;
  } catch {
    return fallback;
  }
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
  let product: ProductItem | null = null;

  try {
    product = await getProductBySlug(lastSlug);
  } catch (err) {
    console.error("❌ getProductBySlug failed:", err);
    return notFound(); // ✔ SAFE FALLBACK
  }

  if (!product) notFound();

  let productData: ProductItem;
  try {
    // ⭐ Convert to JSON to avoid "function passed to client component"
    productData = normalizeProductForRender(product);
  } catch (err) {
    console.error("❌ normalizeProductForRender failed:", err);
    return notFound();
  }

  if (!productData.id) {
    console.error("❌ Missing product id:", { slug: lastSlug });
    return notFound();
  }

  /* ----------------------------------------------------
   * 2) PARALLEL REQUESTS (SAFE WRAPPED)
   * --------------------------------------------------*/
  let reviews: ReviewResponse[] = [];
  let parentProduct = null;

  try {
    const [reviewsResult, parentResult] = await Promise.allSettled([
      getReviewByProduct(productData.id),
      productData.parent_id
        ? getProductGroupDetail(productData.parent_id)
        : Promise.resolve(null),
    ]);

    reviews =
      reviewsResult.status === "fulfilled" && Array.isArray(reviewsResult.value)
        ? reviewsResult.value
        : [];

    parentProduct = parentResult.status === "fulfilled" ? parentResult.value : null;
  } catch (err) {
    console.error("❌ Error fetching child data:", err);
  }

  // Convert to plain JSON
  const plainProduct = toPlain(productData, productData);
  const plainReviews = toPlain(reviews, []);
  const plainParent = toPlain(parentProduct, null);
  const { productSchema, breadcrumbSchema } = buildProductSchemas(
    plainProduct,
    plainReviews,
  );
  const schemaJson = toPlain(
    JSON.stringify([productSchema, breadcrumbSchema]),
    "[]",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaJson,
        }}
      />
      <div className="w-full flex justify-center py-12 xl:pt-[120px] lg:pt-[160px] pt-[50px]">
        <ProductDetails
          parentProductData={plainParent}
          productDetailsData={plainProduct}
          productId={productData.id}
        />
      </div>
    </>
  );
}
