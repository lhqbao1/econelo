import { apiAdmin, apiPublic } from "@/lib/axios";
import { ProductItem } from "@/types/products";
import { VoucherItem, VoucherShippingItem } from "@/types/voucher";

export interface VoucherUsageInput {
  voucher_id: string;
  user_id: string;
  order_id: string;
}

export interface GetVoucherForCheckoutInput {
  product_ids: string[];
  user_id: string | null;
  carrier?: string;
  order_value: number;
}

interface CreateVoucherUsagePayload {
  voucher_ids: string[];
  user_id: string;
  order_id: string;
}

export async function useVoucherApi(input: VoucherUsageInput) {
  const { data } = await apiPublic.post(`/vouchers/usage`, input, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return data as VoucherShippingItem;
}

export async function getVoucherForCheckout(input: GetVoucherForCheckoutInput) {
  const { data } = await apiPublic.post("/vouchers/checkout", input, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data as VoucherItem[];
}

export async function sendVoucherViaEmail(email: string) {
  const { data } = await apiAdmin.post(
    "/vouchers/send-email-voucher",
    null, // ✅ không có body
    {
      params: { email }, // ✅ query string
      withCredentials: true,
    },
  );

  return data;
}

export async function createVoucherUsage(payload: CreateVoucherUsagePayload) {
  const { data } = await apiAdmin.post("/vouchers/usage", payload, {
    withCredentials: true,
  });

  return data;
}

export async function getVoucherByCode(code: string) {
  const { data } = await apiPublic.get(`/vouchers/get-voucher-by-code/${code}`);
  return data as VoucherItem;
}

export async function getVoucherProducts(voucher_id: string) {
  const { data } = await apiPublic.get(`/vouchers/products/${voucher_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
    },
    withCredentials: true,
  });

  return data as ProductItem[];
}

export async function getVoucherById(voucher_id: string) {
  const { data } = await apiPublic.get(`/vouchers/details/${voucher_id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data as VoucherItem;
}
