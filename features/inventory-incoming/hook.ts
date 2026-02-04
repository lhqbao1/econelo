import { useQuery } from "@tanstack/react-query";
import { getInventoryPoByProductId } from "./api";
import { inventoryPoKeys } from "./inventory-po.keys";

export const useInventoryPoByProductId = (productId?: string) => {
  return useQuery({
    queryKey: productId ? inventoryPoKeys.detail(productId) : [],
    queryFn: () => getInventoryPoByProductId(productId!),
    enabled: !!productId,
  });
};
