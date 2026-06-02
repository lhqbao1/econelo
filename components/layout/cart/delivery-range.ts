import { calculateProductDeliveryRange } from "@/hooks/get-shipping-date";
import { formatDateToNum } from "@/lib/format-ios-to-num";

type CartDeliveryInput = {
  delivery_time?: string | null;
  stock?: number | null;
  result_stock?: number | null;
  inventory_pos?:
    | {
        quantity?: unknown;
        incoming_stock?: unknown;
        list_delivery_date?: unknown;
        date_received?: unknown;
      }[]
    | null;
};

export function getCartDeliveryRangeLabel(
  item: CartDeliveryInput,
): string | null {
  const deliveryRange = calculateProductDeliveryRange(
    {
      delivery_time: item.delivery_time ?? "",
      stock: Number(item.stock ?? 0),
      result_stock: Number(item.result_stock ?? 0),
    },
    {
      inventoryPo: item.inventory_pos ?? [],
    },
  );

  if (!deliveryRange) return null;

  return `${formatDateToNum(deliveryRange.from)} - ${formatDateToNum(
    deliveryRange.to,
  )}`;
}
