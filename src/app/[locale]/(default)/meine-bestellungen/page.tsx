import OrderList from "@/components/my-order/order-list";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import React from "react";

export const metadata: Metadata = {
  title: "Meine Bestellungen – Econelo",
  description:
    "Sehen Sie Ihre Bestellhistorie sicher in Ihrem Econelo Konto ein.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const MyOrder = () => {
  const t = useTranslations();
  return (
    <div className="min-h-screen w-full py-8 space-y-6 lg:pt-[120px] pt-[70px]">
      <h1 className="text-primary text-3xl md:text-4xl lg:text-5xl font-bold text-center capitalize">
        {t("myOrder")}
      </h1>
      <OrderList />
    </div>
  );
};

export default MyOrder;
