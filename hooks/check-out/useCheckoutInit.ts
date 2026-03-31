// hooks/checkout/useCheckoutInit.ts
"use client";

import { useCartLocal } from "@/hooks/cart";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { getUserById } from "@/features/users/api";
import {
  getAddressByUserId,
  getInvoiceAddressByUserId,
} from "@/features/address/api";
import { getCartItems } from "@/features/cart/api";
import {
  calculateShipping,
  checkShippingType,
  normalizeCartItems,
} from "@/hooks/caculate-shipping";
import { useAtom } from "jotai";
import { authHydratedAtom, userIdAtom, userIdGuestAtom } from "@/store/auth";

export function useCheckoutInit() {
  const [authHydrated] = useAtom(authHydratedAtom);
  const [userLoginId, setUserLoginId] = useAtom(userIdAtom);
  const [userGuestId, setUserGuestId] = useAtom(userIdGuestAtom);

  const userLoginIdFromStorage =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const effectiveUserLoginId = userLoginId || userLoginIdFromStorage;
  const finalUserId = effectiveUserLoginId || userGuestId;
  const isServerCartMode = Boolean(effectiveUserLoginId);

  const { data: user } = useQuery<User>({
    queryKey: ["user", finalUserId],
    queryFn: () => getUserById(finalUserId ?? ""),
    enabled: !!finalUserId,
    retry: false,
  });

  const { data: addresses } = useQuery({
    queryKey: ["address-by-user", effectiveUserLoginId],
    queryFn: () => getAddressByUserId(effectiveUserLoginId ?? ""),
    enabled: !!effectiveUserLoginId,
    retry: false,
  });

  const { data: invoiceAddress } = useQuery({
    queryKey: ["invoice-address-by-user", effectiveUserLoginId],
    queryFn: () => getInvoiceAddressByUserId(effectiveUserLoginId ?? ""),
    enabled: !!effectiveUserLoginId,
    retry: false,
  });

  // Cart
  const { cart: localCart } = useCartLocal();

  const { data: cartItems, isLoading: isLoadingCart } = useQuery({
    queryKey: ["cart-items", effectiveUserLoginId], // chỉ login user mới có cart server
    queryFn: async () => {
      const response = await getCartItems();
      return [...response].sort((a, b) => {
        const latestA = Math.max(
          ...a.items.map((i) => new Date(i.created_at).getTime()),
        );
        const latestB = Math.max(
          ...b.items.map((i) => new Date(i.created_at).getTime()),
        );
        return latestB - latestA;
      });
    },

    // ⭐ ONLY CALL WHEN REAL LOGIN EXISTS
    enabled: authHydrated && !!effectiveUserLoginId,
    retry: false,
  });

  const hasServerCart = isServerCartMode;
  const effectiveCartItems = isServerCartMode
    ? (cartItems ?? []).flatMap((g) => g.items)
    : localCart;

  const normalized = normalizeCartItems(effectiveCartItems, isServerCartMode);

  const shippingCost = calculateShipping(normalized);
  const hasOtherCarrier = checkShippingType(normalized);
  const isCheckoutCartReady =
    authHydrated && (!isServerCartMode || !isLoadingCart);
  const totalAmount = 1;

  return {
    user,
    addresses,
    invoiceAddress,
    cartItems,
    localCart,
    isLoadingCart,
    hasServerCart,
    shippingCost,
    hasOtherCarrier,
    userGuestId,
    setUserGuestId,
    userLoginId: effectiveUserLoginId,
    authHydrated,
    isServerCartMode,
    isCheckoutCartReady,
    setUserLoginId,
    finalUserId,
    totalAmount,
  };
}
