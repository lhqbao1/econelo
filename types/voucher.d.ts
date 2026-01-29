export interface Voucher {
  id: number;
  title: string;
  type: string;
  discountAmount: number;
  code: string;
}

export interface VoucherItem {
  code: string;
  name: string;
  type: string;
  discount_type: string;
  discount_value: number;
  max_discount: number;
  min_order_value: number;
  start_at: string; // ISO date
  end_at: string; // ISO date
  total_usage_limit: number;
  user_usage_limit: number;
  is_active: boolean;
  carrier: string[];

  id: string;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface VoucherShippingItem {
  voucher_id: string;
  max_shipping_discount: number;
  shipping_method: string;
  id: string;
  created_at: string;
  updated_at: string;
}
