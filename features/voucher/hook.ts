import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVoucherByCode,
  getVoucherById,
  getVoucherForCheckout,
  GetVoucherForCheckoutInput,
  getVoucherProducts,
  sendVoucherViaEmail,
  useVoucherApi,
  VoucherUsageInput,
} from "./api";

export function useUseVoucher() {
  return useMutation({
    mutationFn: (input: VoucherUsageInput) => useVoucherApi(input),
  });
}

export function useGetVoucherForCheckout(
  input: GetVoucherForCheckoutInput,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["vouchers", "checkout", input],
    queryFn: () => getVoucherForCheckout(input),
    enabled: enabled && input.product_ids.length > 0 && input.order_value > 0,
  });
}

export function useSendVoucherViaEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => sendVoucherViaEmail(email),
    onSuccess: (res) => {
      // qc.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });
}

export function useGetVoucherByCode(code: string) {
  return useQuery({
    queryKey: ["voucher-by-code", code],
    queryFn: () => getVoucherByCode(code),
    enabled: !!code,
    retry: false,
  });
}

export function useGetVoucherProducts(voucher_id: string) {
  return useQuery({
    queryKey: ["voucher-products", voucher_id],
    queryFn: () => getVoucherProducts(voucher_id),
    enabled: !!voucher_id,
  });
}

export function useGetVoucherById(voucher_id: string) {
  return useQuery({
    queryKey: ["voucher", voucher_id],
    queryFn: () => getVoucherById(voucher_id),
    enabled: !!voucher_id,
  });
}
