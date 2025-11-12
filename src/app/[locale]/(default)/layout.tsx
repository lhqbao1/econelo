import type { Metadata } from "next";
import "../../globals.css";
import MainHeader from "@/components/header/header";
import MainFooter from "@/components/footer/main-footer";
import Footer from "@/components/footer/footer";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-hidden">
      <MainHeader />
      <main className="relative w-full">
        {/* <StickyIcon /> */}
        <div className="overflow-x-hidden">
          <div className="container-padding flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
