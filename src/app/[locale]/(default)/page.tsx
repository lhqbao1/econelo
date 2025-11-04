import AdvantagesSection from "@/components/layout/home/about";
import HomeBanner from "@/components/layout/home/banner";
import CategorySection from "@/components/layout/home/categories";
import LogoLoopSection from "@/components/layout/home/logo-loop";
import MissionSection from "@/components/layout/home/mission";
import NewArrivedSection from "@/components/layout/home/new-arrived";
import ProductTabs from "@/components/layout/home/product-tabs";
import ProductTabsServer from "@/components/layout/home/server/product-tabs-server";
import TestimonialsSection from "@/components/layout/home/testimonials";
import VideoSection from "@/components/layout/home/video";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <div className="h-[100vh] w-full">
        <HomeBanner />
      </div>
      <MissionSection />
      <NewArrivedSection />
      <VideoSection />
      <ProductTabsServer />
      <AdvantagesSection />
      <CategorySection />
      <TestimonialsSection />
      <LogoLoopSection />
    </div>
  );
}
