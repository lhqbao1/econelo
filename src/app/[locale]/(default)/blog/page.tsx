import BlogBreadcrumb from "@/components/layout/blog/blog-breadcrumb";
import BlogListClient from "@/components/layout/blog/blog-list-client";
import SidebarBlog from "@/components/layout/blog/blog-sidebar";
import FeaturedPost from "@/components/layout/blog/featured-post";
import { getBlogs, getBlogsByProduct } from "@/features/blog/api";
import { safeRequest } from "@/lib/safe-fetch-server";
import { BlogItem } from "@/types/blog";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

/* PPR */
export const experimental_ppr = true;
export const revalidate = 3600;
const BLOG_BASE_URL = "https://econelo.de/blog";

/* Metadata */
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Entdecken Sie Ratgeber zu E-Rollern, Elektromobilitaet, Akku-Pflege und sicherem Fahren.",
  alternates: {
    canonical: BLOG_BASE_URL,
  },
  openGraph: {
    title: "Blog",
    description:
      "Tipps und Wissen rund um E-Roller, Seniorenmobilitaet und Wartung.",
    url: BLOG_BASE_URL,
  },
};

export default async function BlogPage() {
  const getMainBlogsCached = unstable_cache(
    async () =>
      safeRequest(getBlogs({ pageSize: 16, is_econelo: true }), {
        items: [],
        pagination: {
          page: 1,
          page_size: 16,
          total_items: 0,
          total_pages: 0,
        },
      }),
    ["blog-main", "page-size-16"],
    { revalidate: 600 },
  );

  const getSidebarBlogsCached = unstable_cache(
    async () =>
      safeRequest(getBlogsByProduct(), {
        products: [],
        pagination_product: {
          page: 1,
          page_size: 5,
          total_items: 0,
          total_pages: 0,
        },
      }),
    ["blog-sidebar-products"],
    { revalidate: 600 },
  );

  const [mainData, sideBarData] = await Promise.all([
    getMainBlogsCached(),
    getSidebarBlogsCached(),
  ]);

  const featured = mainData.items.length > 0 ? mainData.items[0] : null;

  const listData = {
    ...mainData,
    items: mainData.items.length > 1 ? mainData.items.slice(1) : [],
  };

  /* Schema.org */
  const schema =
    mainData.items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Econelo Blog",
          url: BLOG_BASE_URL,
          blogPost: mainData.items.map((post: BlogItem) => ({
            "@type": "BlogPosting",
            headline: post.title,
            //   image: post.image,
            url: `${BLOG_BASE_URL}/${post.slug}`,
            datePublished: post.created_at,
            author: { "@type": "Organization", name: "Econelo" },
          })),
        }
      : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <div className="2xl:w-10/12 w-11/12 mx-auto px-4 pb-16 lg:pt-38 xl:pt-32 pt-20">
        <BlogBreadcrumb
          currentPage={{
            link: "/blog",
            title: "Blog",
          }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:gap-12 2xl:gap-20">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-20">
            {featured && <FeaturedPost post={featured} />}
            <BlogListClient
              initialData={{
                pages: [listData],
                pageParams: [1],
              }}
            />
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <SidebarBlog items={sideBarData} />
          </aside>
        </div>
      </div>
    </>
  );
}
