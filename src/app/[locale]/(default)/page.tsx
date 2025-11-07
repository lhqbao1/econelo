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
import NewArrivedSection from "@/components/layout/home/new-arrived";
import VideoSection from "@/components/layout/home/video";
import ProductTabsServer from "@/components/layout/home/server/product-tabs-server";
import AdvantagesSection from "@/components/layout/home/about";
import CategorySection from "@/components/layout/home/categories";
import TestimonialsSection from "@/components/layout/home/testimonials";
import LogoLoopSection from "@/components/layout/home/logo-loop";

export const revalidate = 300;

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(), // ✅ gọi trực tiếp, không truyền context
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
    <div className="flex flex-col items-center gap-12 w-full">
      <div className="h-[100vh] w-full">
        <HomeBanner />
      </div>
      <MissionSection />
      {/* chỉ bọc những cái thực sự async */}
      <NewArrivedSection /> {/* đã tự có Suspense bên trong */}
      <VideoSection />
      <Suspense fallback={<SectionSkeleton />}>
        <ProductTabsServer />
      </Suspense>
      <AdvantagesSection />
      <CategorySection />
      <TestimonialsSection />
      <LogoLoopSection />
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
