import type { MetadataRoute } from "next";
import { getCategoriesWithChildren } from "@/features/category/api";
import { getBlogs, getBlogsByProduct } from "@/features/blog/api";
import { getAllProductsSelect } from "@/features/product-group/api";
import type { CategoryResponse } from "@/types/categories";
import type { BlogItem } from "@/types/blog";

const SITE_URL = "https://econelo.de";
const DEFAULT_LOCALE = "de";
const SECONDARY_LOCALE = "en";

const STATIC_PATHS = [
  "/",
  "/alle-produkte",
  "/ueber-uns",
  "/galerie",
  "/kontakt",
  "/faq",
  "/blog",
  "/agb",
  "/impressum",
  "/datenschutzerklaerung",
  "/zahlungsbedingungen",
  "/versandbedingungen",
  "/widerrufsbelehrung",
];

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

export const revalidate = 60 * 60;

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildLocalePath(path: string, locale: string): string {
  const normalizedPath = normalizePath(path);
  if (locale === DEFAULT_LOCALE) return normalizedPath;
  if (normalizedPath === "/") return `/${SECONDARY_LOCALE}`;
  return `/${SECONDARY_LOCALE}${normalizedPath}`;
}

function buildAbsoluteUrl(path: string, locale: string = DEFAULT_LOCALE): string {
  return `${SITE_URL}${buildLocalePath(path, locale)}`;
}

function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function sanitizeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function createLocalizedEntry(
  path: string,
  changeFrequency: ChangeFrequency,
  priority: number,
  lastModified?: Date,
): SitemapEntry {
  return {
    url: buildAbsoluteUrl(path),
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        de: buildAbsoluteUrl(path, DEFAULT_LOCALE),
        en: buildAbsoluteUrl(path, SECONDARY_LOCALE),
      },
    },
  };
}

function flattenCategorySlugs(
  categories: CategoryResponse[] | undefined,
  output: Set<string>,
) {
  if (!Array.isArray(categories)) return;

  for (const category of categories) {
    const slug = sanitizeSlug(category?.slug);
    if (slug) output.add(slug);
    if (Array.isArray(category?.children) && category.children.length > 0) {
      flattenCategorySlugs(category.children, output);
    }
  }
}

function dedupeEntries(entries: SitemapEntry[]): SitemapEntry[] {
  const map = new Map<string, SitemapEntry>();

  for (const entry of entries) {
    if (!entry?.url) continue;
    const existing = map.get(entry.url);
    if (!existing) {
      map.set(entry.url, entry);
      continue;
    }

    const existingDate = parseDate(existing.lastModified);
    const incomingDate = parseDate(entry.lastModified);
    if (incomingDate && (!existingDate || incomingDate > existingDate)) {
      map.set(entry.url, { ...existing, ...entry, lastModified: incomingDate });
    }
  }

  return [...map.values()].sort((a, b) => a.url.localeCompare(b.url));
}

async function buildProductEntries(): Promise<SitemapEntry[]> {
  try {
    const products = await getAllProductsSelect({
      is_econelo: true,
      all_products: true,
    });

    if (!Array.isArray(products)) return [];

    return products
      .map((product) => {
        const slug = sanitizeSlug(product?.url_key);
        if (!slug) return null;

        return createLocalizedEntry(
          `/produkt/${slug}`,
          "daily",
          0.9,
          parseDate(product.updated_at || product.created_at),
        );
      })
      .filter((entry): entry is SitemapEntry => Boolean(entry));
  } catch (error) {
    console.error("❌ sitemap: failed to load products", error);
    return [];
  }
}

async function buildCategoryEntries(): Promise<SitemapEntry[]> {
  try {
    const categories = await getCategoriesWithChildren({ is_econelo: true });
    const categorySlugs = new Set<string>();
    flattenCategorySlugs(categories, categorySlugs);

    return [...categorySlugs].map((slug) =>
      createLocalizedEntry(`/kategorie/${slug}`, "weekly", 0.8),
    );
  } catch (error) {
    console.error("❌ sitemap: failed to load categories", error);
    return [];
  }
}

async function fetchAllBlogs(): Promise<BlogItem[]> {
  const allItems: BlogItem[] = [];

  try {
    const firstPage = await getBlogs({ page: 1, pageSize: 100, is_econelo: true });
    if (!Array.isArray(firstPage?.items)) return [];

    allItems.push(...firstPage.items);

    const totalPages = Math.min(
      Math.max(Number(firstPage.pagination?.total_pages || 1), 1),
      20,
    );

    for (let page = 2; page <= totalPages; page += 1) {
      try {
        const nextPage = await getBlogs({
          page,
          pageSize: 100,
          is_econelo: true,
        });
        if (Array.isArray(nextPage?.items)) {
          allItems.push(...nextPage.items);
        }
      } catch (error) {
        console.error(`❌ sitemap: failed to load blog page ${page}`, error);
      }
    }
  } catch (error) {
    console.error("❌ sitemap: failed to load blog list", error);
    return [];
  }

  return allItems;
}

async function buildBlogPostEntries(): Promise<SitemapEntry[]> {
  const posts = await fetchAllBlogs();
  if (!Array.isArray(posts) || posts.length === 0) return [];

  return posts
    .map((post) => {
      const slug = sanitizeSlug(post?.slug);
      if (!slug) return null;
      return createLocalizedEntry(
        `/blog/${slug}`,
        "weekly",
        0.7,
        parseDate(post.created_at),
      );
    })
    .filter((entry): entry is SitemapEntry => Boolean(entry));
}

async function buildBlogCategoryEntries(): Promise<SitemapEntry[]> {
  try {
    const data = await getBlogsByProduct({
      page_size_product: 200,
      page_size_blog: 1,
    });

    if (!Array.isArray(data?.products)) return [];

    const slugs = new Set<string>();
    for (const product of data.products) {
      const slug = sanitizeSlug(product?.url_key);
      if (slug) slugs.add(slug);
    }

    return [...slugs].map((slug) =>
      createLocalizedEntry(`/blog/category/${slug}`, "weekly", 0.6),
    );
  } catch (error) {
    console.error("❌ sitemap: failed to load blog category pages", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((path) =>
    createLocalizedEntry(
      path,
      path === "/" ? "daily" : "weekly",
      path === "/" ? 1 : 0.8,
      now,
    ),
  );

  const [productEntries, categoryEntries, blogPostEntries, blogCategoryEntries] =
    await Promise.all([
      buildProductEntries(),
      buildCategoryEntries(),
      buildBlogPostEntries(),
      buildBlogCategoryEntries(),
    ]);

  return dedupeEntries([
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...blogPostEntries,
    ...blogCategoryEntries,
  ]);
}
