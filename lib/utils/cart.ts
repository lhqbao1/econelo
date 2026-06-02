// utils/cart.ts

export type CartIncomingInventoryItem = {
  quantity?: number;
  incoming_stock?: number;
  list_delivery_date?: string;
  date_received?: string;
};

export type CartItemLocal = {
  id?: string;
  product_id: string;
  quantity: number;
  is_active: boolean;
  item_price: number;
  final_price: number;
  img_url: string;
  product_name: string;
  stock: number;
  carrier: string;
  id_provider?: string;
  delivery_time?: string;
  result_stock?: number;
  inventory_pos?: CartIncomingInventoryItem[];
};

type IncomingInventorySourceItem = {
  quantity?: unknown;
  incoming_stock?: unknown;
  list_delivery_date?: unknown;
  date_received?: unknown;
};

export function mapCartIncomingInventory(
  source:
    | IncomingInventorySourceItem[]
    | IncomingInventorySourceItem
    | null
    | undefined,
): CartIncomingInventoryItem[] {
  const items = Array.isArray(source) ? source : source ? [source] : [];

  return items.flatMap((item) => {
    const quantity = Number(item.quantity ?? item.incoming_stock ?? 0);
    const listDeliveryDate =
      typeof item.list_delivery_date === "string" ? item.list_delivery_date : "";
    const dateReceived =
      typeof item.date_received === "string" ? item.date_received : "";

    if (!quantity || (!listDeliveryDate && !dateReceived)) return [];

    return [
      {
        quantity,
        incoming_stock: quantity,
        list_delivery_date: listDeliveryDate || undefined,
        date_received: dateReceived || undefined,
      },
    ];
  });
}

const CART_KEY = "guest_cart";

export function getCart(): CartItemLocal[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCart(items: CartItemLocal[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToLocalCart(item: CartItemLocal) {
  const cart = getCart();
  const existing = cart.find((i) => i.product_id === item.product_id);

  let newCart: CartItemLocal[];

  if (existing) {
    newCart = cart.map((i) =>
      i.product_id === item.product_id
        ? { ...i, quantity: i.quantity + item.quantity }
        : i,
    );
  } else {
    newCart = [...cart, item];
  }

  saveCart(newCart);
  return newCart;
}

export function removeFromLocalCart(product_id: string) {
  let cart = getCart();

  // lọc ra những sản phẩm khác product_id
  cart = cart.filter((item) => item.product_id !== product_id);

  saveCart(cart);
  return cart;
}

export function updateLocalCartQuantity(
  product_id: string,
  newQuantity: number,
) {
  let cart = getCart();

  cart = cart.map((item) => {
    if (item.product_id === product_id) {
      return { ...item, quantity: newQuantity };
    }
    return item;
  });

  // Remove items with quantity <= 0
  cart = cart.filter((item) => item.quantity > 0);

  saveCart(cart);
  return cart;
}

export function updateLocalCartStatus(product_id: string, is_active: boolean) {
  const cart = getCart().map((item) =>
    item.product_id === product_id ? { ...item, is_active } : item,
  );

  saveCart(cart);
  return cart;
}
