import { CartItemLocal } from "@/lib/utils/cart";
import { CartItem } from "@/types/cart";

type NormalizedCartItem = {
  carrier: string;
  id_provider?: string;
};

export function normalizeCartItems(
  cartItems: CartItemLocal[] | CartItem[],
  isLoggedIn: boolean,
): NormalizedCartItem[] {
  if (isLoggedIn) {
    return (cartItems as CartItem[]).map((item) => ({
      carrier: item.products.carrier,
      id_provider: item.products.id_provider,
    }));
  }
  return (cartItems as CartItemLocal[]).map((item) => ({
    carrier: item.carrier,
    id_provider: item.id_provider,
  }));
}

export function calculateShipping(cartItems: NormalizedCartItem[]): number {
  if (cartItems.length === 0) return 0;

  // ✅ Free shipping only if the cart has exactly this one item
  if (
    cartItems.length === 1 &&
    String(cartItems[0].id_provider ?? "") === "1001935"
  ) {
    return 0;
  }

  // ✅ Kiểm tra nếu có ít nhất 1 item có carrier là "amm"
  const hasAmmCarrier = cartItems.some(
    (item) => item.carrier === "amm" || item.carrier === "spedition",
  );

  // ✅ Nếu có AMM thì 5.95, ngược lại 35.95
  return hasAmmCarrier ? 35.95 : 5.95;
}

export function checkShippingType(cartItems: NormalizedCartItem[]): boolean {
  if (cartItems.length === 0) return false;

  // ✅ Trả về true nếu có carrier là "amm"
  const hasAmmCarrier = cartItems.some(
    (item) => item.carrier === "amm" || item.carrier === "spedition",
  );

  return hasAmmCarrier;
}

export function calculateShippingCost(items: CartItem[]) {
  const hasAmm = items.some(
    (item) =>
      item.products?.carrier === "amm" ||
      item.products?.carrier === "spedition",
  );

  const gross = hasAmm ? 35.95 : 5.95;
  const vatRate = 0.19;

  const net = Number((gross / (1 + vatRate)).toFixed(2));
  const vat = Number((gross - net).toFixed(2));

  return { gross, net, vat, vatRate };
}
