"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";

export function AuthSanity() {
  const [, setUserId] = useAtom(userIdAtom);

  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");

    // ❌ chỉ có 1 trong 2 → clear hết
    if ((uid && !token) || (!uid && token)) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("access_token");
      setUserId(null);
    }
  }, [setUserId]);

  return null;
}
