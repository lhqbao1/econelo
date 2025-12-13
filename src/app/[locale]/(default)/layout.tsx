import "../../globals.css";
import MainHeader from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      <main className="overflow-hidden">
        <div className="relative w-full">
          {/* <StickyIcon /> */}
          <div className="overflow-x-hidden">
            <div className="container-padding flex-1">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
