import HomeBanner from "@/components/layout/home/banner";
import MissionSection from "@/components/layout/home/mission";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <div className="h-[100vh] w-full">
        <HomeBanner />
      </div>
      <MissionSection />

    </div>
  );
}
