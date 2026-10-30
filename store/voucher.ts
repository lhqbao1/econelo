import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { VoucherItem } from "@/types/voucher";

export const currentVoucherAtom = atomWithStorage<VoucherItem | null>(
  "applied_voucher",
  null,
);

export const lastVoucherAtom = atom<string | null>(null);

export const hasRequestedVoucherAtom = atom<boolean>(false);

export const voucherDialogAtom = atom<"none" | "request" | "apply" | "success">(
  "none",
);
