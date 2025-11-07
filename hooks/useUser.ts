"use client";

import { useAtom, useSetAtom } from "jotai";
import { userAtom, isUserLoadedAtom } from "@/store/auth";
import { useEffect } from "react";
import { getMe } from "@/features/auth/api";
import type { User } from "@/types/user";

/**
 * Hook để quản lý và truy cập thông tin user từ Jotai store.
 * Tự động fetch user khi có userId trong localStorage.
 */
export function useUser() {
  const [user, setUser] = useAtom(userAtom);
  const setIsLoaded = useSetAtom(isUserLoadedAtom);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoaded(true);
      return;
    }

    (async () => {
      try {
        const data = await getMe();
        setUser(data as User);
      } catch {
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, [setUser, setIsLoaded]);

  return { user };
}
