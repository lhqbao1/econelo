import "../../globals.css";
import MainHeader from "@/components/header/header";
import Footer from "@/components/footer/footer";
import HomeBanner from "@/components/layout/home/banner";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      <main id="main-content" className="relative w-full min-h-screen">
        <div className="relative overflow-x-hidden">
          <div className="flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
