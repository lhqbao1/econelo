import type { Metadata } from "next";
import "../../globals.css";
import MainHeader from "@/components/header/header";
import MainFooter from "@/components/footer/main-footer";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      <main className="relative w-full">
        {/* <StickyIcon /> */}
        <div className="overflow-x-hidden">
          <div className="container-padding flex-1">{children}</div>
        </div>
      </main>
      <MainFooter />
    </>
  );
}
