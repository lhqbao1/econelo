import { ReactNode } from "react";
import BlogScrollTop from "@/components/layout/blog/blog-scroll-top";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BlogScrollTop />
      {children}
    </>
  );
}
