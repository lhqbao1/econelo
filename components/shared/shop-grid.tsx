import { ProductItem } from "@/types/products";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ShopGridCard from "./shop-grid-card";

interface ShopGridLayoutProps {
  products: ProductItem[];
}

export default function ShopGridLyaout({ products }: ShopGridLayoutProps) {
  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".group");

    cards.forEach((card) => {
      const imgOverlay = card.querySelector("div.absolute.inset-0"); // overlay đầu tiên
      const buttons = imgOverlay?.querySelectorAll("button");

      const metaDesc = card.querySelector(".meta-desc");
      const bottomOverlay = card.querySelector(
        ".meta-desc + div.absolute.inset-0",
      ); // layout mới (3 nút nhỏ)

      if (!imgOverlay || !buttons?.length || !metaDesc || !bottomOverlay)
        return;

      // Trạng thái ban đầu
      gsap.set(imgOverlay, { opacity: 0, y: 20, pointerEvents: "none" });
      gsap.set(buttons[0], { opacity: 0, y: -50 });
      gsap.set(buttons[1], { opacity: 0, y: 50 });
      gsap.set(bottomOverlay, { opacity: 0, y: 50, pointerEvents: "auto" }); // ban đầu hiện

      card.addEventListener("mouseenter", () => {
        // Ẩn meta_description và bottom layout
        gsap.to(metaDesc, {
          opacity: 0,
          y: -10,
          duration: 0.25,
          ease: "power2.out",
          pointerEvents: "none", // ✅ khóa click meta
        });
        gsap.to(bottomOverlay, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",

          onStart: () => {
            // hiệu ứng nút nhỏ nhô lên nhẹ
            gsap.fromTo(
              bottomOverlay.querySelectorAll("button"),
              { scale: 0.8, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.25,
                stagger: 0.05,
                ease: "back.out(1.7)",
              },
            );
          },
        });

        // Hiện overlay ở hình
        gsap.to(imgOverlay, {
          opacity: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(buttons[0], {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power3.out",
        });
        gsap.to(buttons[1], {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power3.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        // Ẩn overlay ở hình (để nút thoát trước rồi mới fade overlay)
        const tl = gsap.timeline();
        tl.to(
          buttons[0],
          {
            opacity: 0,
            y: -50,
            duration: 0.2,
            ease: "power3.inOut",
          },
          0,
        );
        tl.to(
          buttons[1],
          {
            opacity: 0,
            y: 50,
            duration: 0.2,
            ease: "power3.inOut",
          },
          0,
        );
        tl.to(
          imgOverlay,
          {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.25,
            ease: "power2.inOut",
          },
          0.05,
        );

        // Hiện lại meta_description và bottom layout
        gsap.to(metaDesc, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.inOut",
          pointerEvents: "auto", // ✅ bật lại click cho meta
        });
        gsap.to(bottomOverlay, {
          opacity: 0,
          y: 50,
          pointerEvents: "auto",
          duration: 0.25,
          ease: "power2.inOut",
        });
      });
    });
  }, [products]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:pt-6 pt-12">
      {products.map((product, idx) => (
        <ShopGridCard idx={idx} product={product} />
      ))}
    </div>
  );
}
