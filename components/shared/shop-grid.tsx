import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductItem } from "@/types/products";
import Link from "next/link";
import { useRouter } from "@/src/i18n/navigation";
import { useRef } from "react";
import { useAddToCart } from "@/features/cart/hook";
import { useAddToWishList } from "@/features/wishlist/hook";
import { useCartLocal } from "@/hooks/cart";
import { CartItemLocal } from "@/lib/utils/cart";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { HandleApiError } from "@/lib/api-helper";
import { Eye, Heart, ShoppingBasket, Star } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ShopGridLayoutProps {
  products: ProductItem[];
}

export default function ShopGridLyaout({ products }: ShopGridLayoutProps) {
  const router = useRouter();
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const t = useTranslations();

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishList();
  const { addToCartLocal, cart } = useCartLocal();

  const handleAddToCart = (currentProduct: ProductItem) => {
    if (!currentProduct) return;
    const userId = localStorage.getItem("userId");

    if (!userId) {
      const existingItem = cart.find(
        (item: CartItemLocal) => item.product_id === currentProduct.id,
      );
      const totalQuantity = (existingItem?.quantity || 0) + 1;
      if (totalQuantity > currentProduct.stock) {
        toast.error(t("notEnoughStock"));
        return;
      }
      addToCartLocal(
        {
          item: {
            product_id: currentProduct.id,
            quantity: 1,
            is_active: true,
            item_price: currentProduct.final_price,
            final_price: currentProduct.final_price,
            img_url:
              currentProduct.static_files.length > 0
                ? currentProduct.static_files[0].url
                : "",
            product_name: currentProduct.name,
            stock: currentProduct.stock,
            carrier: currentProduct.carrier ?? "amm",
            id_provider: currentProduct.id_provider ?? "",
            delivery_time: currentProduct.delivery_time ?? "",
          },
        },
        {
          onSuccess() {
            toast.success(t("addToCartSuccess"));
          },
          onError() {
            toast.error(t("addToCartFail"));
          },
        },
      );
    } else {
      addToCartMutation.mutate(
        { productId: currentProduct.id ?? "", quantity: 1 },
        {
          onSuccess() {
            toast.success(t("addToCartSuccess"));
          },
          onError(error) {
            const { status, message } = HandleApiError(error, t);
            if (status === 400) {
              toast.error(t("notEnoughStock"));
              return;
            }
            toast.error(message);
            if (status === 401) router.push("/login");
          },
        },
      );
    }
  };

  const handleAddToWishlist = (currentProduct: ProductItem) => {
    if (!currentProduct) return;
    addToWishlistMutation.mutate(
      { productId: currentProduct.id ?? "", quantity: 1 },
      {
        onSuccess() {
          toast.success(t("addToWishlistSuccess"));
        },
        onError(error) {
          const { status, message } = HandleApiError(error, t);
          if (status === 400) {
            toast.error(t("notEnoughStock"));
            return;
          }
          toast.error(message);
          if (status === 401) router.push("/login");
        },
      },
    );
  };

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
        // Ẩn overlay ở hình
        gsap.to(imgOverlay, {
          opacity: 0,
          y: 20,
          pointerEvents: "none",
          duration: 0.3,
          ease: "power2.inOut",
        });
        gsap.to(buttons[0], {
          opacity: 0,
          y: -50,
          duration: 0.2,
          ease: "power3.inOut",
        });
        gsap.to(buttons[1], {
          opacity: 0,
          y: 50,
          duration: 0.2,
          ease: "power3.inOut",
        });

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
        <div
          className="group px-2 py-4 flex flex-col h-full bg-white relative overflow-hidden hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md"
          key={product.id}
        >
          <div className="relative  overflow-hidden mb-12">
            <Link href={`/produkt/${product.url_key}`}>
              {/* Hình sản phẩm */}
              <Image
                src={
                  product.static_files?.[0]?.url ?? "/placeholder-product.webp"
                }
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-64 p-4 lg:p-10 object-contain transition-all duration-500 group-hover:scale-110"
              />
            </Link>

            {/* Overlay ẩn (GSAP sẽ bật khi hover) */}
            <div
              onClick={() => router.push(`/produkt/${product.url_key}`)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 opacity-0 cursor-pointer"
            >
              <Button
                className="bg-black text-white px-6 py-2 font-semibold rounded-full"
                onClick={() => router.push(`/produkt/${product.url_key}`)}
              >
                {t("learnMore")}
              </Button>
              <Button
                className="bg-lime-400 text-black px-6 py-2 font-semibold rounded-full"
                onClick={() => handleAddToCart(product)}
              >
                {t("addToCart")}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-6 px-4">
            <div className="space-y-1">
              <p className="text-primary uppercase text-sm font-semibold">
                {product.categories[0].name}
              </p>
              <h3 className="text-base font-black line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-primary"
                  />
                ))}
                <span className="text-sm font-medium">(0)</span>
              </div>
            </div>

            <div
              className="relative h-[60px] overflow-hidden"
              ref={(el) => {
                descRefs.current[idx] = el;
              }}
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: product.meta_description,
                }}
                className="text-sm text-gray-700 line-clamp-3 meta-desc inset-0 z-10"
              ></p>

              {/* Layout mới (ẩn ban đầu) */}
              <div className="absolute inset-0 flex items-center gap-3 justify-center opacity-0 pointer-events-none bottom-overlay z-20">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-300 text-primary cursor-pointer"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBasket className="size-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-300 hover:bg-black hover:text-white"
                  onClick={() => router.push(`/produkt/${product.url_key}`)}
                >
                  <Eye className="size-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-300 hover:bg-black hover:text-white"
                  onClick={() => handleAddToWishlist(product)}
                >
                  <Heart className="size-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <p className="text-base font-bold">
                €{" "}
                {(product.final_price ?? product.price).toLocaleString(
                  "de-DE",
                  {
                    minimumFractionDigits: 2,
                  },
                )}
              </p>
              {product.price > product.final_price && (
                <p className="text-base line-through text-gray-500">
                  €{" "}
                  {product.price.toLocaleString("de-DE", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
