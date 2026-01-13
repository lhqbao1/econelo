import { CreateOrderFormValues } from "@/lib/schema/checkout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelMainCheckout,
  cancelOrder,
  createCheckOut,
  GetAllCheckoutParams,
  getCheckOut,
  getCheckOutByCheckOutId,
  getCheckOutByUserId,
  getCheckOutMain,
  getCheckOutStatistics,
  getCheckOutSupplier,
  getCheckOutSupplierByCheckOutId,
  getMainCheckOutByMainCheckOutId,
} from "./api";

export function useGetCheckOut({ page, page_size }: GetAllCheckoutParams = {}) {
  return useQuery({
    queryKey: ["checkout", page, page_size],
    queryFn: () => getCheckOut({ page, page_size }),
    retry: false,
  });
}

export function useGetCheckOutSupplier({
  page,
  page_size,
}: GetAllCheckoutParams = {}) {
  return useQuery({
    queryKey: ["supplier-checkout", page, page_size],
    queryFn: () => getCheckOutSupplier({ page, page_size }),
    retry: false,
  });
}

export function useGetCheckOutMain({
  page,
  page_size,
}: GetAllCheckoutParams = {}) {
  return useQuery({
    queryKey: ["checkout-main", page, page_size],
    queryFn: () => getCheckOutMain({ page, page_size }),
    retry: false,
  });
}

export function useCreateCheckOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: CreateOrderFormValues) => createCheckOut(item),
    onSuccess: () => {
      qc.refetchQueries({ queryKey: ["checkout"] });
      qc.refetchQueries({ queryKey: ["checkout-statistic"] });
      qc.refetchQueries({ queryKey: ["cart-items"] });
    },
  });
}

export function useGetCheckOutByCheckOutId(checkout_id: string) {
  return useQuery({
    queryKey: ["checkout-id", checkout_id],
    queryFn: () => getCheckOutByCheckOutId(checkout_id),
    enabled: !!checkout_id,
    retry: false,
  });
}

export function useGetSupplierCheckOutByCheckOutId(checkout_id: string) {
  return useQuery({
    queryKey: ["supplier-checkout-id", checkout_id],
    queryFn: () => getCheckOutSupplierByCheckOutId(checkout_id),
    enabled: !!checkout_id,
    retry: false,
  });
}

export function useGetMainCheckOutByMainCheckOutId(main_checkout_id: string) {
  return useQuery({
    queryKey: ["checkout-id", main_checkout_id],
    queryFn: () => getMainCheckOutByMainCheckOutId(main_checkout_id),
    enabled: !!main_checkout_id,
    retry: false,
  });
}

export function useGetCheckOutByUserId(user_id: string) {
  return useQuery({
    queryKey: ["checkout-user-id", user_id],
    queryFn: () => getCheckOutByUserId(user_id),
    enabled: !!user_id,
    retry: false,
  });
}

export function useGetCheckOutStatistic() {
  return useQuery({
    queryKey: ["checkout-statistic"],
    queryFn: () => getCheckOutStatistics(),
    retry: false,
  });
}

export const useCancelMainCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMainCheckout,

    onSuccess: () => {
      // 🔁 refresh invoice list của user
      queryClient.invalidateQueries({
        queryKey: ["invoice-by-user-id"],
      });

      // (optional) refresh order list nếu có
      queryClient.invalidateQueries({
        queryKey: ["checkout-user-id"],
      });
    },
  });
};

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (main_checkout_id: string) => cancelOrder(main_checkout_id),
    onSuccess: (data, variables) => {
      qc.refetchQueries({ queryKey: ["checkout-main"] });
      qc.refetchQueries({ queryKey: ["checkout"] });
      qc.refetchQueries({ queryKey: ["checkout-statistic"] });
      qc.refetchQueries({ queryKey: ["checkout-user-id"] });
      qc.refetchQueries({
        queryKey: ["checkout-main-id", variables],
      });
    },
  });
}
