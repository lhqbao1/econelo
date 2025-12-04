"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/features/products/api";
import { getProductGroupDetail } from "@/features/product-group/api";
import { getReviewByProduct } from "@/features/review/api";
import { ProductItem } from "@/types/products";
import { ProductGroupDetailResponse } from "@/types/product-group";

export function useProductDetails(
  productId: string,
  initialData: ProductItem,
  parentProductData: ProductGroupDetailResponse | null,
) {
  const product = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    initialData,
  });

  const reviews = useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: () => getReviewByProduct(productId),
    enabled: !!productId,
    retry: false,
  });

  const parent = useQuery({
    queryKey: ["product-group-detail", initialData.parent_id],
    queryFn: () => getProductGroupDetail(initialData.parent_id ?? ""),
    enabled: !!initialData.parent_id,
    initialData: parentProductData,
  });

  return {
    product: product.data,
    isLoadingProduct: product.isLoading,

    reviews: reviews.data,
    isLoadingReviews: reviews.isLoading,

    parent: parent.data,
    isLoadingParent: parent.isLoading,
  };
}
