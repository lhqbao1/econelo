"use client";

import { ProductItem } from "@/types/products";
import React from "react";

interface ProductDetailHeaderProps {
  productDetails: ProductItem;
}

const ProductDetailHeader = ({ productDetails }: ProductDetailHeaderProps) => {
  return (
    <div className="flex items-center">
      <div>
        Artikelnummer:{" "}
        <span className="underline font-semibold">
          {productDetails.id_provider}
        </span>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
