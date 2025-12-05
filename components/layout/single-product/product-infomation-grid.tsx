"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import TechnicalNumberSection from "./technical-number";
import { ProductItem } from "@/types/products";
import ShippingSection from "./shipping-section";
import ProductShortDescription from "./product-short-description";
import FaqAccordion from "./faq";
import IncludedInPriceCard from "./included-in-price";
import BuySection from "./buy-section";
import { ProductGroupDetailResponse } from "@/types/product-group";
import QAInput from "./qa/qa-input";
import ProductDetailsUserManual from "./product-details-user-manual";

interface BentoGridLayoutSection {
  productDetails: ProductItem;
  parentProduct?: ProductGroupDetailResponse | null;
}

export default function BentoGridLayout({
  productDetails,
  parentProduct,
}: BentoGridLayoutSection) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6">
      {/* LEFT COLUMN */}
      <div className="md:col-span-8 space-y-6">
        {/* Section 1 - Car Features */}
        <IncludedInPriceCard id={productDetails.id_provider} />

        {/* <TechnicalNumberSection productDetails={productDetails} /> */}

        {/* Section 2 - Overview */}
        <ProductShortDescription description={productDetails.description} />

        {/* Section 3 - Included in the Price */}

        {/* <FaqAccordion /> */}
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:col-span-4 space-y-6">
        {/* Get Started */}
        <ShippingSection productDetails={productDetails} />
        <ProductDetailsUserManual files={productDetails.pdf_files} />
        <QAInput productId={productDetails.id} />
      </div>
    </div>
  );
}
