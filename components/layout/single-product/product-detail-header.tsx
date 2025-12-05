import { Button } from "@/components/ui/button";
import { useAddToWishList } from "@/features/wishlist/hook";
import { HandleApiError } from "@/lib/api-helper";
import { ProductItem } from "@/types/products";
import { Heart, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";

interface ProductDetailHeaderProps {
  productDetails: ProductItem;
}

const ProductDetailHeader = ({ productDetails }: ProductDetailHeaderProps) => {
  const t = useTranslations();
  const addProductToWishlistMutation = useAddToWishList();

  // handle wishlist (optional)
  const handleAddProductToWishlist = () => {
    addProductToWishlistMutation.mutate(
      { productId: productDetails?.id ?? "", quantity: 1 },
      {
        onSuccess: () => {
          toast.success(t("addToWishlistSuccess"));
        },
        onError: (error) => {
          const { status, message } = HandleApiError(error, t);
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        Artikelnummer:{" "}
        <span className="underline font-semibold">
          {productDetails.id_provider}
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          type="button"
          variant="outline"
          className="rounded-full flex items-center gap-2 hover:text-primary cursor-pointer"
          onClick={() => {
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

            window.open(
              shareUrl,
              "_blank",
              "noopener,noreferrer,width=600,height=500",
            );
          }}
        >
          <Share2 className="w-4 h-4" />
          <span className="hover:text-primary">{t("share")}</span>
        </Button>

        {/* <Button
          type="button"
          variant="outline"
          className="rounded-full flex items-center gap-2 hover:text-primary cursor-pointer"
          onClick={() => handleAddProductToWishlist()}
        >
          <Heart className="w-4 h-4" />
          {t("wishlist")}
        </Button> */}
      </div>
    </div>
  );
};

export default ProductDetailHeader;
