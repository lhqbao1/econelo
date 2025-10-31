import AdvantagesSection from "@/components/layout/home/about";
import HomeBanner from "@/components/layout/home/banner";
import CategorySection from "@/components/layout/home/categories";
import LogoLoopSection from "@/components/layout/home/logo-loop";
import MissionSection from "@/components/layout/home/mission";
import TestimonialsSection from "@/components/layout/home/testimonials";
import VideoSection from "@/components/layout/home/video";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <div className="h-[100vh] w-full">
        <HomeBanner />
      </div>
      <MissionSection />
      <VideoSection />
      <AdvantagesSection />
      <CategorySection />
      <TestimonialsSection />
      <LogoLoopSection />
    </div>
  );
}
