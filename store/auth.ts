// features/auth/state.ts
"use client";
import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { getMe } from "@/features/auth/api";
import { User } from "@/types/user";

export const userIdAtom = atomWithStorage<string | null>("user_id", null);
export const userIdGuestAtom = atomWithStorage<string | null>(
  "userIdGuest",
  null,
);
export const accessTokenAtom = atomWithStorage<string | null>(
  "access_token",
  null,
);

// 🧩 Atom lưu thông tin user (null nếu chưa đăng nhập)
export const userAtom = atom<User | null>(null);

// 🧩 Atom boolean xác định đã load xong (để tránh nháy UI)
export const isUserLoadedAtom = atom<boolean>(false);

// 🧩 Atom async — có thể dùng nếu bạn muốn React Query-like behavior
export const userQueryAtom = atom(async (get) => {
  const user = get(userAtom);
  if (user) return user;

  try {
    const fetchedUser = await getMe();
    return fetchedUser as User;
  } catch {
    return null;
  }
});
