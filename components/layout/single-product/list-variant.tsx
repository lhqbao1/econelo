"use client";

import { CartFormValues } from "@/lib/schema/cart";
import { useRouter } from "@/src/i18n/navigation";
import { ProductGroupDetailResponse } from "@/types/product-group";
import { ProductItem } from "@/types/products";
import { VariantOptionsResponse } from "@/types/variant";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface ListVariantProps {
  variant?: VariantOptionsResponse[];
  currentProduct: ProductItem;
  parentProduct?: ProductGroupDetailResponse | null;
}

const ListVariant = ({
  variant,
  currentProduct,
  parentProduct,
}: ListVariantProps) => {
  const { control, setValue } = useFormContext<CartFormValues>();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (!currentProduct?.options?.length) return;

    const ids = currentProduct.options.map((o) => o.id);

    // ✅ Cập nhật state trước
    setSelectedOptions(ids);

    // ✅ Đảm bảo chỉ setValue sau khi render xong (next tick)
    // hoặc trong effect riêng biệt
    const timer = setTimeout(() => {
      setValue("option_id", ids, { shouldValidate: false });
    }, 0);

    return () => clearTimeout(timer);
  }, [currentProduct, setValue]);

  const handleSelect = (variantId: string, optionId: string) => {
    if (!parentProduct) return;

    // Cập nhật state selectedOptions
    setSelectedOptions((prev) => {
      const otherOptions = prev.filter((id) => {
        const isSameVariant = variant?.some((g) =>
          g.options.some((o) => o.id === id && g.variant.id === variantId)
        );
        return !isSameVariant;
      });
      return [...otherOptions, optionId];
    });

    // 🔍 Tìm product khớp trong parentProduct.products
    const matchedProduct = parentProduct.products.find((product) =>
      product.options?.some((opt) => opt.id === optionId)
    );

    // 👉 Nếu tìm thấy thì chuyển hướng
    if (matchedProduct?.url_key) {
      router.push(`/product/${matchedProduct.url_key}`);
    } else {
      toast.error(t("noOption"));
      return;
    }
  };

  // ✅ Khi selectedOptions thay đổi thì update form
  useEffect(() => {
    setValue("option_id", selectedOptions, { shouldValidate: false });
  }, [selectedOptions, setValue]);

  return (
    <Controller
      control={control}
      name="option_id"
      render={() => (
        <div className="flex flex-col gap-4">
          {variant?.map((group) => (
            <div key={group.variant.id} className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">
                {group.variant.name}
              </span>

              <div className="flex gap-2 flex-wrap">
                {group.options.map((option) => {
                  const isSelected = selectedOptions.includes(option.id);

                  return (
                    <div
                      key={option.id}
                      className={`cursor-pointer ${
                        isSelected
                          ? "border-2 border-primary rounded-sm"
                          : "border border-gray-300 rounded-sm"
                      }`}
                      onClick={() => handleSelect(group.variant.id, option.id)}
                    >
                      {option.image_url ? (
                        <div className="shadow-sm bg-white rounded-sm border border-gray-300 p-2">
                          <Image
                            src={option.image_url}
                            width={50}
                            height={50}
                            alt={option.label || group.variant.name}
                            className=""
                            unoptimized
                          />
                          {option.img_description}
                        </div>
                      ) : (
                        <div
                          className={`px-3 py-1 rounded-md text-sm font-semibold`}
                        >
                          {option.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default ListVariant;
