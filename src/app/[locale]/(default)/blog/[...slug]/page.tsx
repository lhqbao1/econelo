import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SidebarBlog from "@/components/layout/blog/blog-sidebar";
import BlogDetails from "@/components/layout/blog/blog-details";
import { getBlogDetailsBySlug, getBlogsByProduct } from "@/features/blog/api";
import { unstable_cache } from "next/cache";
import { BlogByProductResponse, BlogItem } from "@/types/blog";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/* --------------------------------------------------------
 * ENABLE PARTIAL PRERENDERING
 * ------------------------------------------------------*/
export const experimental_ppr = true;
export const revalidate = 3600;
export const dynamicParams = true;
const BLOG_BASE_URL = "https://econelo.de/blog";

const getBlogDetailCached = (slug: string) =>
  unstable_cache(() => getBlogDetailsBySlug(slug), ["blog-detail", slug], {
    revalidate: 600,
  })();

const getSidebarBlogsCached = unstable_cache(
  () => getBlogsByProduct(),
  ["blog-sidebar-products"],
  { revalidate: 600 },
);

function toMetaDescription(value?: string | null): string {
  if (!value) return "Entdecken Sie den Blogbeitrag von Econelo.";
  const plainText = value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (
    plainText.slice(0, 160) || "Entdecken Sie den Blogbeitrag von Econelo."
  );
}

function buildBlogSchemas(post: BlogItem) {
  const postUrl = `${BLOG_BASE_URL}/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title || "Blogbeitrag",
    datePublished: post.created_at,
    dateModified: post.created_at,
    inLanguage: "de-DE",
    author: {
      "@type": "Organization",
      name: "Econelo Redaktion",
    },
    publisher: {
      "@type": "Organization",
      name: "Econelo",
      logo: {
        "@type": "ImageObject",
        url: "https://econelo.de/econelo-logo.png",
      },
    },
    mainEntityOfPage: postUrl,
    url: postUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://econelo.de",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: BLOG_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title || "Blogbeitrag",
        item: postUrl,
      },
    ],
  };

  return { articleSchema, breadcrumbSchema, postUrl };
}

/* --------------------------------------------------------
 * 2) GENERATE METADATA
 * ------------------------------------------------------*/
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lastSlug =
    typeof slug?.[0] === "string" ? slug[0].trim() : "";
  if (!lastSlug) return {};

  let post = await getBlogDetailCached(lastSlug);
  if (!post) {
    post = await getBlogDetailsBySlug(lastSlug);
  }
  if (!post) return {};
  const { postUrl } = buildBlogSchemas(post);
  const description = toMetaDescription(post.content);

  return {
    title: post.title || "Blogbeitrag",
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title || "Blogbeitrag",
      description,
      url: postUrl,
    },
  };
}

/* --------------------------------------------------------
 * 3) PAGE
 * ------------------------------------------------------*/
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const blogSlug =
    typeof slug?.[0] === "string" ? slug[0].trim() : "";
  if (!blogSlug) return notFound();

  let [post, sidebarData] = await Promise.all([
    getBlogDetailCached(blogSlug),
    getSidebarBlogsCached(),
  ]);

  if (!post) {
    post = await getBlogDetailsBySlug(blogSlug);
  }
  if (!post) return notFound();
  const { articleSchema, breadcrumbSchema } = buildBlogSchemas(post);

  if (!sidebarData || (sidebarData.products?.length ?? 0) === 0) {
    sidebarData = await getBlogsByProduct().catch(
      () =>
        ({
          products: [],
          pagination_product: {
            page: 1,
            page_size: 5,
            total_items: 0,
            total_pages: 0,
          },
        }) as BlogByProductResponse,
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, breadcrumbSchema]),
        }}
      />
      <div className="max-w-6xl mx-auto px-4 xl:py-30 py-16 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* MAIN CONTENT (9 columns) */}
          <div className="lg:col-span-9">
            <BlogDetails post={post} />
          </div>

          {/* SIDEBAR (3 columns) */}
          <aside className="lg:col-span-3">
            <SidebarBlog items={sidebarData} />
          </aside>
        </div>
      </div>
    </>
  );
}
