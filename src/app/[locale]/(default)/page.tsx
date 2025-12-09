import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  DehydratedState,
} from "@tanstack/react-query";
import { getAllProducts } from "@/features/products/api";
import { Suspense } from "react";

import HomeBanner from "@/components/layout/home/banner";
import MissionSection from "@/components/layout/home/mission";
import ProductTabsServer from "@/components/layout/home/server/product-tabs-server";
import AdvantagesSection from "@/components/layout/home/about";
import TestimonialsSection from "@/components/layout/home/testimonials";
import { getCategories } from "@/features/category/api";

export const revalidate = 300;

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
    <HydrationBoundary state={dehydratedState}>
      {/* ✅ Suspense cho loading mượt */}
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </HydrationBoundary>
  );
}

/** ✅ Component tách riêng để Suspense hoạt động tốt hơn */
function HomeContent() {
  return (
    <div className="flex flex-col items-center lg:gap-12 md:gap-8 gap-6 w-full">
      <div className="xl:h-[100vh] h-fit w-full">
        <HomeBanner />
      </div>
      <MissionSection />
      {/* chỉ bọc những cái thực sự async */}
      {/* <NewArrivedSection /> */}
      {/* <VideoSection /> */}
      <Suspense fallback={<SectionSkeleton />}>
        <ProductTabsServer />
      </Suspense>
      <AdvantagesSection />
      {/* <Suspense fallback={<SectionSkeleton />}>
        <CategorySectionServer />
      </Suspense> */}
      <TestimonialsSection />
      {/* <LogoLoopSection /> */}
    </div>
  );
}

/** ✅ Loading skeletons — có thể reuse từ shadcn */
function HomeSkeleton() {
  return (
    <div className="flex flex-col items-center gap-10 w-full animate-pulse">
      <div className="h-[80vh] w-full bg-gray-200 rounded-md" />
      <div className="h-10 w-1/3 bg-gray-300 rounded" />
      <div className="h-96 w-5/6 bg-gray-100 rounded-md" />
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-md" />
  );
}
