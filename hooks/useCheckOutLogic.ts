"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useCreateAddress,
  useCreateInvoiceAddress,
  useUpdateInvoiceAddress,
} from "@/features/address/hook";
import {
  useCheckMailExist,
  useSignUpGuess,
} from "@/features/auth/hook";
import {
  useCreateCheckOut,
} from "@/features/checkout/hook";
import {
  useCreatePayment,
} from "@/features/payment/hook";
import { useCartLocal } from "@/hooks/cart";
import { useSyncLocalCart } from "@/features/cart/hook";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { getCartItems, getCartByUserId } from "@/features/cart/api";
import {
  getUserById,
} from "@/features/users/api";
import {
  getAddressByUserId,
  getInvoiceAddressByUserId,
} from "@/features/address/api";

import {
  CreateOrderFormValues,
  CreateOrderSchema,
  checkoutDefaultValues,
} from "@/lib/schema/checkout";
import {
  calculateShipping,
  checkShippingType,
  normalizeCartItems,
} from "@/hooks/caculate-shipping";
import { mapToSupplierCarts } from "@/hooks/map-cart-to-supplier";
import { CartResponse } from "@/types/cart";
import { useAtom } from "jotai";
import { checkOutIdAtom, paymentIdAtom } from "@/store/payment";

export function useCheckoutLogic() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
    const [paymentId, setPaymentId] = useAtom(paymentIdAtom);
  const [checkout, setCheckOut] = useAtom(checkOutIdAtom);

  const [userId, setUserId] = useState<string>("");
  const [userIdLogin, setUserIdLogin] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [openBankDialog, setOpenBankDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string>("");

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(CreateOrderSchema(t)),
    defaultValues: checkoutDefaultValues,
  });

  // ✅ Cart + User + Address queries
  const { cart: localCart } = useCartLocal();

  useEffect(() => {
    const storedId = localStorage.getItem("userIdGuest");
    const storedLogin = localStorage.getItem("userId");
    if (storedLogin) setUserIdLogin(storedLogin);
    if (storedId) setUserId(storedId);
  }, []);

  const { data: user } = useQuery({
    queryKey: ["user", userIdLogin || userId],
    queryFn: () => getUserById(userIdLogin || userId),
    enabled: !!(userIdLogin || userId),
    retry: false,
  });

  const { data: addresses } = useQuery({
    queryKey: ["address-by-user", userIdLogin || userId],
    queryFn: () => getAddressByUserId(userIdLogin || userId),
    enabled: !!(userIdLogin || userId),
    retry: false,
  });

  const { data: invoiceAddress } = useQuery({
    queryKey: ["invoice-address-by-user", userIdLogin || userId],
    queryFn: () => getInvoiceAddressByUserId(userIdLogin || userId),
    enabled: !!(userIdLogin || userId),
    retry: false,
  });

  const { data: cartItems, isLoading: isLoadingCart } = useQuery({
    queryKey: ["cart-items", userIdLogin || userId],
    queryFn: () => getCartItems(),
    enabled: !!(userIdLogin || userId),
    retry: false,
  });

  
  useEffect(() => {
    const defaults: Partial<CreateOrderFormValues> = {};

    if (user) {
      defaults.first_name = user.first_name ?? "";
      defaults.last_name = user.last_name ?? "";
      defaults.email = user.email ?? "";
    }

    if (invoiceAddress) {
      defaults.invoice_address_line = invoiceAddress.address_line ?? "";
      defaults.invoice_postal_code = invoiceAddress.postal_code ?? "";
      defaults.invoice_city = invoiceAddress.city ?? "";
      defaults.invoice_address_id = invoiceAddress.id;
    }

    if (addresses && addresses.length > 0) {
      const shippingAddress = addresses.find((a) => a.is_default);

      if (shippingAddress) {
        defaults.shipping_address_line = shippingAddress.address_line ?? "";
        defaults.shipping_postal_code = shippingAddress.postal_code ?? "";
        defaults.shipping_city = shippingAddress.city ?? "";
        defaults.shipping_address_id = shippingAddress.id;
        defaults.phone_number = shippingAddress.phone_number ?? "";
      }
    }

    if (Object.keys(defaults).length > 0) {
      form.reset({
        ...form.getValues(),
        ...defaults,
      });
    }
  }, [user, invoiceAddress, addresses, form]);


  // ✅ Mutations
  const syncLocalCartMutation = useSyncLocalCart(true);
  const checkMailExistMutation = useCheckMailExist();
  const createUserAccountMutation = useSignUpGuess();
  const createInvoiceAddressMutation = useCreateInvoiceAddress();
  const editInvoiceAddressMutation = useUpdateInvoiceAddress();
  const createShippingAddressMutation = useCreateAddress();
  const createCheckOutMutation = useCreateCheckOut();
  const createPaymentMutation = useCreatePayment();

  // ✅ Derived data
  const hasServerCart = Array.isArray(cartItems) && cartItems.length > 0;
  const normalizedItems = normalizeCartItems(
    hasServerCart ? cartItems.flatMap((g) => g.items) : localCart,
    hasServerCart
  );

  const shippingCost = calculateShipping(normalizedItems);
  const hasOtherCarrier = checkShippingType(normalizedItems);


  const handleSubmit = useCallback(
    async (data: CreateOrderFormValues) => {
      let cleanupNeeded = false;

      try {
        let userId = user?.id;
        let invoiceAddressId = invoiceAddress?.id;
        let shippingAddressId = addresses?.find((a) => a.is_default)?.id;
        const invoiceAddressCountry = invoiceAddress?.country;
        let cartData: CartResponse = [];
        let shippingCostCurrent = 0;

        // ✅ Nếu là guest checkout
        if (data.email && !userId) {
          const exists = await checkMailExistMutation.mutateAsync(data.email);

          if (!exists) {
            // Email đã tồn tại → cần OTP → dừng ở đây
            setOtpEmail(data.email);
            setOpenOtpDialog(true);
            cleanupNeeded = true; // đánh dấu cần cleanup
            return;
          } else {
            // Chưa có user → tạo mới guest
            const newUser = await createUserAccountMutation.mutateAsync({
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              phone_number: data.phone_number,
            });

            userId = newUser.id;
            cleanupNeeded = true; // đánh dấu cần cleanup nếu lỗi xảy ra sau này

            // Lưu token + userIdGuest
            localStorage.setItem("access_token", newUser.access_token);
            localStorage.setItem("userIdGuest", newUser.id);

            // Sync local cart
            await syncLocalCartMutation.mutateAsync();
            const res = await getCartByUserId(newUser.id);
            cartData = res;
            shippingCostCurrent = calculateShipping(
              normalizeCartItems(
                cartData.flatMap((group) => group.items),
                true
              )
            );
          }
        }

        // ✅ Invoice address
        if (
          !invoiceAddressCountry ||
          invoiceAddressCountry === "" ||
          !invoiceAddressId
        ) {
          const newInvoice = await createInvoiceAddressMutation.mutateAsync({
            user_id: userId ?? "",
            recipient_name: data.first_name + " " + data.last_name,
            postal_code: data.invoice_postal_code,
            phone_number: data.phone_number,
            address_line: data.invoice_address_line,
            city: data.invoice_city,
            country: data.invoice_city,
            state: data.invoice_city,
          });
          invoiceAddressId = newInvoice.id;
        } else if (
          data.invoice_address_line !== invoiceAddress?.address_line ||
          data.invoice_postal_code !== invoiceAddress?.postal_code ||
          data.invoice_city !== invoiceAddress?.city ||
          data.phone_number !== invoiceAddress?.phone_number
        ) {
          const newInvoice = await editInvoiceAddressMutation.mutateAsync({
            addressId: invoiceAddressId,
            address: {
              user_id: userId ?? "",
              recipient_name: data.first_name + " " + data.last_name,
              postal_code: data.invoice_postal_code,
              phone_number: data.phone_number,
              address_line: data.invoice_address_line,
              city: data.invoice_city,
              country: data.invoice_city,
              state: data.invoice_city,
            },
          });
          invoiceAddressId = newInvoice.id;
        }

        // ✅ Shipping address
        if (!shippingAddressId) {
          const newShipping = await createShippingAddressMutation.mutateAsync({
            user_id: userId ?? "",
            recipient_name: data.first_name + " " + data.last_name,
            postal_code: data.invoice_postal_code,
            phone_number: data.phone_number,
            address_line: data.invoice_address_line,
            city: data.shipping_city,
            country: data.shipping_city,
            is_default: true,
            state: data.shipping_city,
          });
          shippingAddressId = newShipping.id;
        }

        // ✅ Checkout
        const checkout = await createCheckOutMutation.mutateAsync({
          ...data,
          invoice_address_id: invoiceAddressId,
          shipping_address_id: shippingAddressId,
          supplier_carts: mapToSupplierCarts(cartItems ? cartItems : cartData),
          note: data.note,
          total_shipping:
            shippingCostCurrent > 0 ? shippingCostCurrent : shippingCost,
        });
        toast.success(t("orderSuccess"));
        setCheckOut(checkout.id);

        // ✅ Payment handling
        if (data.payment_method !== "bank") {
          const payment = await createPaymentMutation.mutateAsync({
            checkout_id: checkout.id,
            pay_channel: data.payment_method,
          });

          setPaymentId(payment.payment_order_id);
          if (data.payment_method === "paypal") {
            router.push(payment.approve_url, { locale });
          } else if (data.payment_method === "card") {
            setOpenCardDialog(true);
            setTotal(payment.amount);
            setClientSecret(payment.clientSecret);
          }
        } else {
          setOpenBankDialog(true);
        }

        // ✅ Nếu đến đây không lỗi → không cần cleanup
        cleanupNeeded = false;
      } catch (error) {
        toast.error(t("orderFail"));
        console.error(error);
        form.reset();
        cleanupNeeded = true;
      } finally {
        if (cleanupNeeded) {
          // ✅ Luôn xóa userIdGuest nếu đang là guest
          if (localStorage.getItem("userIdGuest")) {
            localStorage.removeItem("userIdGuest");
            localStorage.removeItem("access_token");
            console.log("🧹 Guest user data cleaned up.");
          }
        }
      }
    },
    [user, invoiceAddress, addresses]
  );

  const isLoading =
  isLoadingCart ||
  createCheckOutMutation.isPending ||
  createPaymentMutation.isPending;

  return {
    form,
    user,
    addresses,
    invoiceAddress,
    isLoading,
    cartItems,
    isLoadingCart,
    clientSecret,
    setClientSecret,
    total,
    localCart,
    setTotal,
    hasOtherCarrier,
    openCardDialog,
    setOpenCardDialog,
    openBankDialog,
    setOpenBankDialog,
    openOtpDialog,
    setOpenOtpDialog,
    otpEmail,
    shippingCost,
    handleSubmit,
  };
}
