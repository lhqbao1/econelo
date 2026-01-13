"use client";

import Script from "next/script";
import { useRef } from "react";
import { ProductItem } from "@/types/products";

export const mapTrustedShopsPaymentType = (id: string): string => {
  switch (id) {
    case "paypal":
      return "PAYPAL";

    case "klarna":
      // Klarna Pay Later / Invoice
      return "INVOICE";

    case "card":
      // Credit / Debit Card
      return "CREDIT_CARD";

    case "applepay":
      // Apple Pay vẫn là card
      return "CREDIT_CARD";

    case "googlepay":
      // Google Pay vẫn là card
      return "CREDIT_CARD";

    default:
      return "OTHER";
  }
};

export interface TrustedShopsCheckoutProps {
  orderNumber: string;
  buyerEmail: string;
  amount: number;
  currency: "EUR";
  paymentType: string;
  estimatedDeliveryDate: string;
  products: ProductItem[];
}

export function TrustedShopsCheckout({
  orderNumber,
  buyerEmail,
  amount,
  currency,
  paymentType,
  estimatedDeliveryDate,
  products,
}: TrustedShopsCheckoutProps) {
  return (
    <>
      <div
        id="trustedShopsCheckout"
        style={{ display: "none" }}
      >
        <span id="tsCheckoutOrderNr">{orderNumber}</span>
        <span id="tsCheckoutBuyerEmail">{buyerEmail}</span>
        <span id="tsCheckoutOrderAmount">
          {amount.toLocaleString("DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span id="tsCheckoutOrderCurrency">EUR</span>
        <span id="tsCheckoutOrderPaymentType">{paymentType}</span>
        <span id="tsCheckoutOrderEstDeliveryDate">{estimatedDeliveryDate}</span>

        {products.map((item, index) => {
          return (
            <span className="tsCheckoutProductItem">
              <span className="tsCheckoutProductUrl">{item.url_key ?? ""}</span>
              <span className="tsCheckoutProductImageUrl">
                {item.static_files && item.static_files.length > 0
                  ? item.static_files[0].url
                  : ""}
              </span>
              <span className="tsCheckoutProductName">{item.name}</span>
              <span className="tsCheckoutProductSKU">{item.id_provider}</span>
              <span className="tsCheckoutProductGTIN">{item.ean}</span>
              {/* <span className="tsCheckoutProductMPN">0123456789</span> */}
              <span className="tsCheckoutProductBrand">
                {item.brand ? item.brand.name : "Prestige Home"}
              </span>
            </span>
          );
        })}
      </div>
    </>
  );
}
