"use client";
// import CustomBreadCrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Share, Share2, Star, Truck } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/features/cart/hook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductById } from "@/features/products/api";
import { ProductItem } from "@/types/products";
import { useAddToWishList } from "@/features/wishlist/hook";
import { useLocale, useTranslations } from "next-intl";
import { HandleApiError } from "@/lib/api-helper";
// import { useCartLocal } from "@/hooks/cart";
import { useSwipeable } from "react-swipeable";
import { ProductGroupDetailResponse } from "@/types/product-group";
import { getProductGroupDetail } from "@/features/product-group/api";
// import ProductImageDialog from "./main-image-dialog";
import { CartItemLocal } from "@/lib/utils/cart";
import { useRouter } from "@/src/i18n/navigation";
import Script from "next/script";
// import { ProductImageCarousel } from "./sub-images-carousel";
import ProductDetailsSkeleton from "./skeleton";
import { useCartLocal } from "@/hooks/cart";
import ProductImageDialog from "./product-image-dialog";
import { ProductImageCarousel } from "./product-image-carousel";
import CustomBreadCrumb from "@/components/shared/breadcrumb";
import { getReviewByProduct } from "@/features/review/api";
import ProductRating from "./rating";
import BentoGridLayout from "./product-infomation-grid";
import BuySection from "./buy-section";
import { useProductDetails } from "@/hooks/single-product/useProductDetails";
import ProductDetailHeader from "./product-detail-header";

interface ProductDetailsProps {
  productDetailsData: ProductItem;
  productId: string;
  parentProductData: ProductGroupDetailResponse | null;
}

const ProductDetails = ({
  productDetailsData,
  productId,
  parentProductData,
}: ProductDetailsProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const t = useTranslations();
  const { addToCartLocal, cart } = useCartLocal();
  const router = useRouter();
  const locale = useLocale();

  const {
    product: productDetails,
    reviews: productReviews,
    parent: parentProduct,
    isLoadingProduct,
  } = useProductDetails(productId, productDetailsData, parentProductData);

  // Image zoom
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const handleZoomImage = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
  };

  const adminId =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_access_token")
      : null;

  const moveToAdmin = (productId: string) => {
    if (adminId) {
      router.push(`/admin/products/${productId}/edit`, { locale });
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!productDetails?.static_files?.length) return;
      setMainImageIndex(
        (prev) => (prev + 1) % productDetails.static_files.length,
      );
    },
    onSwipedRight: () => {
      if (!productDetails?.static_files?.length) return;
      setMainImageIndex((prev) =>
        prev === 0 ? productDetails.static_files.length - 1 : prev - 1,
      );
    },
    trackTouch: true,
  });

  return (
    <>
      <div className="py-3 lg:pt-3 space-y-4 lg:w-8/12 w-full lg:px-0 px-4">
        <CustomBreadCrumb
          isProductPage
          currentPage={
            productDetails?.categories[0]?.children?.length
              ? productDetails.categories[0].children[0].name
              : productDetails?.categories[0]?.name
          }
          currentPageLink={
            productDetails?.categories[0]?.children?.length
              ? `category/${productDetails.categories[0].children[0].slug}`
              : `category/${productDetails?.categories[0]?.slug}`
          }
        />
        {!isLoadingProduct && productDetails ? (
          <>
            <div className="space-y-8">
              <div className="flex flex-col gap-8 items-start">
                {/* Product images & carousel */}
                <div className="w-full grid grid-cols-3 lg:py-12 py-6 lg:space-y-6 space-y-4 ">
                  <div className="flex flex-row-reverse gap-4 items-start lg:col-span-2 col-span-3">
                    <div className="flex-1">
                      <ProductImageDialog productDetails={productDetails}>
                        <div
                          className="flex justify-center overflow-hidden main-image"
                          onMouseMove={handleZoomImage}
                          onMouseEnter={() => setIsHover(true)}
                          onMouseLeave={() => setIsHover(false)}
                          {...handlers}
                        >
                          <Image
                            src={
                              productDetails.static_files.length > 0
                                ? productDetails.static_files[mainImageIndex]
                                    .url
                                : "/placeholder-product.webp"
                            }
                            width={500}
                            height={300}
                            alt={`${productDetails.name}`}
                            className="transition-transform duration-300 lg:h-[400px] h-[300px] w-auto object-cover cursor-pointer rounded-md"
                            style={{
                              transformOrigin: `${position.x}% ${position.y}%`,
                              transform: isHover ? "scale(1.5)" : "scale(1)",
                            }}
                            priority
                          />
                        </div>
                      </ProductImageDialog>
                    </div>

                    <ProductImageCarousel
                      productDetails={productDetails}
                      mainImageIndex={mainImageIndex}
                      setMainImageIndex={setMainImageIndex}
                    />
                  </div>

                  {/* BuySection now contains the form */}
                  <BuySection
                    currentProduct={productDetails}
                    parentProduct={parentProduct}
                    variant={parentProduct?.variants}
                  />
                </div>

                {/* Product details */}
                <div className="xl:col-span-6 col-span-12 flex flex-col gap-6 w-full">
                  {adminId ? (
                    <div
                      className="cursor-pointer text-primary"
                      onClick={() => moveToAdmin(productDetails.id)}
                    >
                      <Eye />
                    </div>
                  ) : (
                    ""
                  )}
                  <ProductRating reviews={productReviews} />

                  <div className="space-y-2">
                    <h1 className="lg:text-3xl lg:w-2/3 w-full text-xl font-bold text-black">
                      {productDetails.name}
                    </h1>

                    <ProductDetailHeader productDetails={productDetails} />
                  </div>

                  <BentoGridLayout
                    productDetails={productDetails}
                    parentProduct={parentProduct}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <ProductDetailsSkeleton />
        )}
      </div>
    </>
  );
};

export default ProductDetails;
