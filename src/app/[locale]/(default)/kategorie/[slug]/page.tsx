import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/features/category/api";
import ProductCategory from "@/components/layout/categories/categories-page";
import type { CategoryBySlugResponse } from "@/types/categories";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const SITE_URL = "https://econelo.de";
const FALLBACK_CATEGORY_DESCRIPTION =
  "Entdecken Sie unsere Produkte bei Econelo.";
const FALLBACK_PRODUCT_IMAGE = `${SITE_URL}/product-placeholder.png`;

export const revalidate = 3600;

function sanitizeText(value?: string | null): string {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function resolveSlugParts(value: string[] | string): string[] {
  const rawParts = Array.isArray(value) ? value : [value];
  return rawParts
    .filter((part): part is string => typeof part === "string")
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildCategoryUrl(slug: string): string {
  return `${SITE_URL}/kategorie/${encodeURIComponent(slug)}`;
}

async function getCategorySafe(
  slug: string,
): Promise<CategoryBySlugResponse | null> {
  try {
    return await getCategoryBySlug(slug, { is_econelo: true });
  } catch (error) {
    console.error("❌ getCategoryBySlug failed:", error);
    return null;
  }
}

function buildCategorySchema(category: CategoryBySlugResponse) {
  const safeSlug =
    typeof category.slug === "string" ? category.slug.trim() : "";
  const categoryUrl = safeSlug ? buildCategoryUrl(safeSlug) : `${SITE_URL}/alle-produkte`;
  const categoryName =
    category.meta_title?.trim() || category.name?.trim() || "Kategorie";
  const categoryDescription =
    sanitizeText(category.meta_description) || FALLBACK_CATEGORY_DESCRIPTION;
  const safeProducts = Array.isArray(category.products) ? category.products : [];

  const itemListElement = safeProducts
    .slice(0, 10)
    .map((product, index) => {
      const productSlug =
        typeof product?.url_key === "string" ? product.url_key.trim() : "";
      if (!productSlug) return null;

      const productUrl = `${SITE_URL}/produkt/${encodeURIComponent(productSlug)}`;
      const productImage =
        product.static_files?.[0]?.url || FALLBACK_PRODUCT_IMAGE;
      const price = product.final_price ?? product.price ?? 0;
      const stockValue = Number(product.stock ?? 0);

      return {
        "@type": "Product",
        position: index + 1,
        name: product.name || "Produkt",
        image: productImage,
        url: productUrl,
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: String(price),
          availability:
            stockValue > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      };
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categoryName,
    description: categoryDescription,
    url: categoryUrl,
    inLanguage: "de-DE",
    isPartOf: {
      "@type": "WebSite",
      name: "Econelo",
      url: SITE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryName,
          item: categoryUrl,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      name: categoryName,
      numberOfItems: safeProducts.length,
      itemListElement,
    },
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugParts = resolveSlugParts(slug);
  const lastSlug = slugParts[slugParts.length - 1];

  if (!lastSlug) {
    return {
      title: "Kategorie",
      description: FALLBACK_CATEGORY_DESCRIPTION,
      robots: { index: false, follow: false },
    };
  }

  const category = await getCategorySafe(lastSlug);
  if (!category) {
    return {
      title: "Kategorie nicht gefunden",
      description: FALLBACK_CATEGORY_DESCRIPTION,
      robots: { index: false, follow: false },
    };
  }

  const categoryTitle =
    category.meta_title?.trim() || category.name?.trim() || "Kategorie";
  const categoryDescription =
    sanitizeText(category.meta_description) || FALLBACK_CATEGORY_DESCRIPTION;
  const categoryUrl = buildCategoryUrl(category.slug || lastSlug);

  return {
    title: categoryTitle,
    description: categoryDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: categoryTitle,
      description: categoryDescription,
      url: categoryUrl,
      images: category.img_url ? [{ url: category.img_url }] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slugParts = resolveSlugParts(resolvedParams.slug);
  const lastSlug = slugParts[slugParts.length - 1];

  if (!lastSlug) return notFound();

  const category = await getCategorySafe(lastSlug);
  if (!category) return notFound();

  const categorySchema = buildCategorySchema(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <ProductCategory category={category} categorySlugs={slugParts} />
    </>
  );
}
