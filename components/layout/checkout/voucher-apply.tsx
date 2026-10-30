"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVoucherByCode } from "@/features/voucher/api";
import { useMutation } from "@tanstack/react-query";
import { currentVoucherAtom } from "@/store/voucher";
import { useAtom } from "jotai";
import { BadgePercent, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

const VoucherApply = () => {
  const t = useTranslations();
  const [currentVoucher, setCurrentVoucher] = useAtom(currentVoucherAtom);
  const [code, setCode] = useState("");

  const { mutate: applyVoucher, isPending: isFetching } = useMutation({
    mutationFn: getVoucherByCode,
    onSuccess: (voucher) => {
      if (!voucher?.id) {
        toast.error(t("invalidVoucher"));
        return;
      }
      setCurrentVoucher(voucher);
      toast.success(t("voucherApplied"));
    },
    onError: () => {
      toast.error(t("invalidVoucher"));
    },
  });

  const handleApply = () => {
    if (!code.trim()) return;
    applyVoucher(code.trim());
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <BadgePercent className="w-5 h-5 shrink-0 text-muted-foreground" />

        <Input
          placeholder={t("applyCoupons")}
          className="flex-1 bg-white"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Button
          type="button"
          onClick={handleApply}
          disabled={isFetching}
        >
          {isFetching ? t("checking") : t("apply")}
        </Button>
      </div>

      {currentVoucher ? (
        <div className="space-y-2" role="status">
          <p className="text-sm font-medium">{t("appliedVouchers")}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 py-1 pl-3 pr-1 text-sm text-emerald-800">
              <span className="min-w-0 break-all font-medium">{currentVoucher.code}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isFetching}
                aria-label={`${t("remove")} ${currentVoucher.code}`}
                onClick={() => {
                  setCurrentVoucher(null);
                  setCode("");
                }}
                className="h-7 w-7 shrink-0 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VoucherApply;
