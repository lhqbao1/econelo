// features/auth/hooks.ts
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  login,
  logout,
  LoginInput,
  signUp,
  SignUpInput,
  forgotPassword,
  resetPassword,
  loginAdmin,
  checkMailExist,
  loginOtp,
  loginCookie,
  signUpGuess,
  sendOtp,
  sendOtpDSP,
  loginOtpDSP,
  loginOtpGuest,
} from "./api";
import { tokenStore } from "@/lib/token";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (res) => {
      qc.refetchQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      tokenStore.set(null);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: (input: SignUpInput) => signUp(input),
    onSuccess(data, variables, context) {
      // localStorage.setItem("userId", data.id)
    },
  });
}

export function useSignUpGuess() {
  return useMutation({
    mutationFn: (input: SignUpInput) => signUpGuess(input),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      email,
      code,
      new_password,
    }: {
      email: string;
      code: string;
      new_password: string;
    }) => resetPassword(email, code, new_password),
  });
}

export function useCheckMailExist() {
  return useMutation({
    mutationFn: (email: string) => checkMailExist(email),
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (email: string) => sendOtp(email),
  });
}

export function useSendOtpAdmin() {
  return useMutation({
    mutationFn: (username: string) => loginAdmin(username),
  });
}

export function useSendOtpDSP() {
  return useMutation({
    mutationFn: (username: string) => sendOtpDSP(username),
  });
}

export function useLoginDSPOtp() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      loginOtpDSP(email, code),
    onSuccess(data) {},
  });
}

export function useLoginOtp() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      loginOtp(email, code),

    async onSuccess(data) {
      // ⏳ chờ cookie update vào request (cực kỳ quan trọng!)
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 🔥 force refresh cart
      await qc.invalidateQueries({ queryKey: ["cart-items"] });
    },
  });
}

export function useLoginOtpGuest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      loginOtpGuest(email, code),
  });
}
