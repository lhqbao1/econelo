"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLoginOtp, useSendOtp, useSendOtpAdmin } from "@/features/auth/hook";
import { toast } from "sonner";
import { useState } from "react";
import { Link, useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSyncLocalCart } from "@/features/cart/hook";
import LoginGoogleButton from "./login-google";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";
import { useAtom } from "jotai";
import { userIdAtom } from "@/store/auth";

interface LoginFormProps {
  isAdmin?: boolean;
}

export default function LoginFormTransparent({
  isAdmin = false,
}: LoginFormProps) {
  const [seePassword, setSeePassword] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [userId, setUserId] = useAtom(userIdAtom);

  const formSchema = z.object({
    username: z.string().min(1, t("emailRequired")).email(t("invalidEmail")),
    code: z.string().optional().nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });

  const sendOtpMutation = useSendOtp();
  const loginAdminMutation = useSendOtpAdmin();
  const submitOtpMutation = useLoginOtp();
  const syncLocalCartMutation = useSyncLocalCart();

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!seePassword && !isAdmin) {
      sendOtpMutation.mutate(values.username, {
        onSuccess: () => {
          toast.success(t("sendedEmail"));
          setSeePassword(true);
        },
        onError: () => toast.error(t("invalidEmail")),
      });
    } else if (!seePassword && isAdmin) {
      loginAdminMutation.mutate(values.username, {
        onSuccess: () => {
          toast.success(t("sendedEmail"));
          setSeePassword(true);
        },
        onError: () => toast.error(t("invalidEmail")),
      });
    } else if (seePassword) {
      submitOtpMutation.mutate(
        {
          email: values.username,
          code: values.code ?? "",
        },
        {
          onSuccess: (data) => {
            const token = data.access_token;
            localStorage.setItem(
              isAdmin ? "admin_access_token" : "access_token",
              token,
            );
            setUserId(data.id);
            toast.success(t("loginSuccess"));
            if (!isAdmin) syncLocalCartMutation.mutate();
            router.push(isAdmin ? "/admin/orders/list" : "/", { locale });
          },
          onError: () => toast.error(t("invalidCredentials")),
        },
      );
    }
  };

  const handleAutoSubmitOtp = (code: string) => {
    if (code.length !== 6) return;

    if (!isAdmin) {
      submitOtpMutation.mutate(
        {
          email: form.getValues("username"),
          code,
        },
        {
          onSuccess: (data) => {
            const token = data.access_token;
            localStorage.setItem("access_token", token);
            setUserId(data.id);
            router.push("/", { locale });
            syncLocalCartMutation.mutate();
            toast.success(t("loginSuccess"));
          },
          onError() {
            toast.error(t("invalidCredentials"));
          },
        },
      );
    } else {
      submitOtpMutation.mutate(
        {
          email: form.getValues("username"),
          code,
        },
        {
          onSuccess: (data) => {
            const token = data.access_token;
            localStorage.setItem("admin_access_token", token);
            setUserId(data.id);
            router.push("/admin/orders/list", { locale });
            toast.success(t("loginSuccess"));
          },
          onError(error) {
            toast.error(error.message);
          },
        },
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center lg:min-w-[500px] min-w-10/12 justify-center relative overflow-hidden p-4">
      {/* Gradient blur background overlay */}
      <div className="relative z-10 w-full  bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 capitalize">
            {t("welcomeBack")}
          </h1>
          <p className="text-gray-600 text-sm">{t("signIn")}</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      {...field}
                      disabled={seePassword}
                      className="w-full rounded-xl border border-white/30 bg-white/20 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* OTP Code */}
            {seePassword && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value ?? ""}
                          onChange={(value) => {
                            field.onChange(value);
                            if (value.length === 6) {
                              // ✅ Gọi auto submit OTP nếu đủ 6 số
                              handleAutoSubmitOtp(value);
                            }
                          }}
                          className="gap-3"
                        >
                          <InputOTPGroup>
                            {[...Array(6)].map((_, i) => (
                              <InputOTPSlot
                                key={i}
                                index={i}
                                className="w-10 h-12 text-lg text-center font-semibold bg-white/30 border border-white/40 text-gray-900 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary/90 text-white font-semibold hover:bg-primary/30 transition capitalize"
              disabled={
                sendOtpMutation.isPending ||
                submitOtpMutation.isPending ||
                loginAdminMutation.isPending
              }
            >
              {sendOtpMutation.isPending ||
              loginAdminMutation.isPending ||
              submitOtpMutation.isPending ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : seePassword ? (
                t("signInButton")
              ) : (
                t("getOtp")
              )}
            </Button>
          </form>
        </Form>

        {/* Social login */}
        {!isAdmin && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-3 uppercase">
              {t("continueWith")}
            </p>
            <div className="space-y-3">
              <LoginGoogleButton />
            </div>
          </div>
        )}

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <Link
            href="/anmelden"
            className="text-sm text-gray-700 hover:underline"
          >
            {t("noAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}
