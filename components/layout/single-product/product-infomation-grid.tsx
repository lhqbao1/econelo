"use client";

import { ProductItem } from "@/types/products";
import { ProductGroupDetailResponse } from "@/types/product-group";

import IncludedInPriceCard from "./included-in-price";
import ProductShortDescription from "./product-short-description";
import ProductDetailsUserManual from "./product-details-user-manual";
import QAInput from "./qa/qa-input";
import ShippingSection from "./shipping-section";

interface BentoGridLayoutSection {
  productDetails: ProductItem;
  parentProduct?: ProductGroupDetailResponse | null;
}

export default function BentoGridLayout({
  productDetails,
  parentProduct,
}: BentoGridLayoutSection) {
  return (
    <div
      className="
        grid grid-cols-1 
        lg:grid-cols-12 
        gap-6 py-6
      "
    >
      {/* LEFT MAIN CONTENT */}
      <div
        className="
          lg:col-span-8 
          flex 
          flex-col 
          gap-6
          order-2 lg:order-1
        "
      >
        {/* Section 1 */}
        <IncludedInPriceCard id={productDetails.id_provider} />

        {/* Section 2 */}
        <ProductShortDescription description={productDetails.description} />

        {/* User Manual (mobile order 3, desktop order stays inside right column) */}
        <div className="lg:hidden">
          <ProductDetailsUserManual files={productDetails.pdf_files} />
        </div>

        <div className="lg:hidden">
          <QAInput productId={productDetails.id} />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div
        className="
          lg:col-span-4 
          flex 
          flex-col 
          gap-6
          order-1 lg:order-2
        "
      >
        <ShippingSection productDetails={productDetails} />

        {/* On desktop: show inside sidebar */}
        <div className="hidden lg:block">
          <ProductDetailsUserManual files={productDetails.pdf_files} />
        </div>

        <div className="hidden lg:block">
          <QAInput productId={productDetails.id} />
        </div>
      </div>
    </div>
  );
}
