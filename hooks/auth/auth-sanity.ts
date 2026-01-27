"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";

const isValid = (v: string | null) =>
  v !== null && v !== "null" && v !== "undefined" && v.trim() !== "";

export function AuthSanity() {
  const [, setUserId] = useAtom(userIdAtom);

  useEffect(() => {
    const uidRaw = localStorage.getItem("user_id");
    const tokenRaw = localStorage.getItem("access_token");

    const hasUid = isValid(uidRaw);
    const hasToken = isValid(tokenRaw);

    // ❌ chỉ có 1 trong 2 → clear hết
    if (hasUid !== hasToken) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("access_token");
      setUserId(null);
    }
  }, [setUserId]);

  return null;
}
