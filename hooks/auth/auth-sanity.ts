"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";

export function AuthSanity() {
  const [, setUserId] = useAtom(userIdAtom);

  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");

    if (uid && !token) {
      localStorage.removeItem("user_id");
      setUserId(null);
    }
  }, []);

  return null;
}
