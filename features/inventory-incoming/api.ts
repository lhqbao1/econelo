import { apiPublic } from "@/lib/axios";
import { POContainerInventoryDetail } from "@/types/po";

export async function getInventoryPoByProductId(
  productId: string,
): Promise<POContainerInventoryDetail[]> {
  const { data } = await apiPublic.get(
    `/po/inventory-po/by-product/${productId}`,
  );

  return data;
}
