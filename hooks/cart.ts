// import {
//   addToLocalCart,
//   CartItemLocal,
//   getCart,
//   removeFromLocalCart,
//   saveCart,
//   updateLocalCartQuantity,
//   updateLocalCartStatus,
// } from "@/lib/utils/cart";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const CART_QUERY_KEY = ["cart"];

// export function useCartLocal() {
//   const queryClient = useQueryClient();

//   // query để lấy giỏ hàng
//   const cartQuery = useQuery<CartItemLocal[]>({
//     queryKey: CART_QUERY_KEY,
//     queryFn: () => getCart(),
//     initialData: [],
//   });

//   // mutation: add item
// const addToCartMutation = useMutation({
//   mutationFn: async ({ item }: { item: CartItemLocal }) => {
//     addToLocalCart(item);
//     return getCart();
//   },
//   onSuccess: (newCart) => {
//     queryClient.setQueryData(CART_QUERY_KEY, newCart);
//   },
// });

//   // mutation: update toàn bộ giỏ (ví dụ xóa/sp)
//   const updateCartMutation = useMutation({
//     mutationFn: async (items: CartItemLocal[]) => {
//       saveCart(items);
//       return getCart();
//     },
//     onSuccess: (newCart) => {
//       queryClient.setQueryData(CART_QUERY_KEY, newCart);
//     },
//   });

//   // mutation: update số lượng
//   const updateQuantityMutation = useMutation({
//     mutationFn: async ({
//       product_id,
//       quantity,
//     }: {
//       product_id: string;
//       quantity: number;
//     }) => {
//       return updateLocalCartQuantity(product_id, quantity);
//     },
//     onSuccess: (newCart) => {
//       queryClient.setQueryData(CART_QUERY_KEY, newCart);
//     },
//   });

//   // mutation: update status
//   const updateStatusMutation = useMutation({
//     mutationFn: async ({
//       product_id,
//       is_active,
//     }: {
//       product_id: string;
//       is_active: boolean;
//     }) => {
//       return updateLocalCartStatus(product_id, is_active);
//     },
//     onSuccess: (newCart) => {
//       queryClient.setQueryData(CART_QUERY_KEY, newCart);
//     },
//   });

//   // mutation: remove item
//   const removeItemMutation = useMutation({
//     mutationFn: async (product_id: string) => {
//       return removeFromLocalCart(product_id);
//     },
//     onSuccess: (newCart) => {
//       queryClient.setQueryData(CART_QUERY_KEY, newCart);
//     },
//   });

//   return {
//     cart: cartQuery.data ?? [],
//     isLoading: cartQuery.isLoading,
//     addToCartLocal: addToCartMutation.mutate,
//     updateCart: updateCartMutation.mutate,
//     updateQuantity: updateQuantityMutation.mutate,
//     removeItem: removeItemMutation.mutate, // ✅
//     updateStatus: updateStatusMutation.mutate,
//   };
// }

import {
  addToLocalCart,
  CartItemLocal,
  getCart,
  removeFromLocalCart,
  saveCart,
  updateLocalCartQuantity,
  updateLocalCartStatus,
} from "@/lib/utils/cart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const CART_QUERY_KEY = ["cart"];

export function useCartLocal() {
  const queryClient = useQueryClient();

  // 🔥 Lắng nghe event mỗi khi localStorage thay đổi
  useEffect(() => {
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    };

    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, [queryClient]);

  // 👇 Query lấy cart (tự refetch khi invalidate)
  const cartQuery = useQuery<CartItemLocal[]>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => getCart(),
    initialData: [],
  });

  // 🔥 Helper function: emit event để đồng bộ realtime
  const emitUpdate = (newCart: CartItemLocal[]) => {
    queryClient.setQueryData(CART_QUERY_KEY, newCart);
    window.dispatchEvent(new Event("cart-updated"));
  };

  // ADD
  const addToCartMutation = useMutation({
    mutationFn: async ({ item }: { item: CartItemLocal }) => {
      addToLocalCart(item);
      return getCart();
    },
    onSuccess: emitUpdate,
  });

  // UPDATE WHOLE CART
  const updateCartMutation = useMutation({
    mutationFn: async (items: CartItemLocal[]) => {
      saveCart(items);
      return getCart();
    },
    onSuccess: emitUpdate,
  });

  // UPDATE QUANTITY
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      product_id,
      quantity,
    }: {
      product_id: string;
      quantity: number;
    }) => {
      return updateLocalCartQuantity(product_id, quantity);
    },
    onSuccess: emitUpdate,
  });

  // UPDATE STATUS
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      product_id,
      is_active,
    }: {
      product_id: string;
      is_active: boolean;
    }) => {
      return updateLocalCartStatus(product_id, is_active);
    },
    onSuccess: emitUpdate,
  });

  // REMOVE
  const removeItemMutation = useMutation({
    mutationFn: async (product_id: string) => {
      return removeFromLocalCart(product_id);
    },
    onSuccess: emitUpdate,
  });

  return {
    cart: cartQuery.data ?? [],
    isLoading: cartQuery.isLoading,
    addToCartLocal: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
  };
}
