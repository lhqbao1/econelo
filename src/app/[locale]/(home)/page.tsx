import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  DehydratedState,
} from "@tanstack/react-query";
import { getAllProducts } from "@/features/products/api";
import { Suspense } from "react";
import type { Metadata } from "next";

import HomeBanner from "@/components/layout/home/banner";
import MissionSection from "@/components/layout/home/mission";
import ProductTabsServer from "@/components/layout/home/server/product-tabs-server";
import AdvantagesSection from "@/components/layout/home/about";
import TestimonialsSection from "@/components/layout/home/testimonials";
import { getCategories } from "@/features/category/api";
import { getCart } from "@/lib/utils/cart";
import { CART_QUERY_KEY } from "@/hooks/cart";
import { getCartItems } from "@/features/cart/api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Econelo – Elektroroller, Elektromobile & E-Mobilität",
  description:
    "Entdecken Sie Elektroroller, Elektromobile und Seniorenfahrzeuge von Econelo für komfortable und nachhaltige Mobilität.",
  alternates: {
    canonical: "https://www.econelo.de",
  },
  openGraph: {
    title: "Econelo – Elektroroller, Elektromobile & E-Mobilität",
    description:
      "Entdecken Sie Elektroroller, Elektromobile und Seniorenfahrzeuge von Econelo für komfortable und nachhaltige Mobilität.",
    url: "https://www.econelo.de",
    siteName: "Econelo",
    type: "website",
  },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.econelo.de/#homepage",
  url: "https://www.econelo.de",
  name: "Econelo – Elektroroller, Elektromobile & E-Mobilität",
  description:
    "Entdecken Sie Elektroroller, Elektromobile und Seniorenfahrzeuge von Econelo.",
  isPartOf: {
    "@id": "https://www.econelo.de/#website",
  },
  inLanguage: "de-DE",
};

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(), // ✅ gọi trực tiếp, không truyền context
  });

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ is_econelo: true }), // ✅ gọi trực tiếp, không truyền context
  });

  const dehydratedState: DehydratedState = dehydrate(queryClient);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HydrationBoundary state={dehydratedState}>
        {/* ✅ Suspense cho loading mượt */}
        <Suspense fallback={<HomeSkeleton />}>
          <HomeContent />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}

/** ✅ Component tách riêng để Suspense hoạt động tốt hơn */
function HomeContent() {
  return (
    <div className="flex flex-col items-center lg:gap-12 md:gap-8 gap-6 w-full">
      <MissionSection />

      <Suspense fallback={<SectionSkeleton />}>
        <ProductTabsServer />
      </Suspense>
      <AdvantagesSection />

      <TestimonialsSection />
      {/* <LogoLoopSection /> */}
    </div>
  );
}

/** ✅ Loading skeletons — có thể reuse từ shadcn */
function HomeSkeleton() {
  return (
    <div className="flex flex-col items-center gap-10 w-full animate-pulse motion-reduce:animate-none">
      <div className="h-[80vh] w-full bg-gray-200 rounded-md" />
      <div className="h-10 w-1/3 bg-gray-300 rounded" />
      <div className="h-96 w-5/6 bg-gray-100 rounded-md" />
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse motion-reduce:animate-none rounded-md" />
  );
}
