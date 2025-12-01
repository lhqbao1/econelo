"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useSignUp, useCheckMailExist } from "@/features/auth/hook";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignUpFormTransparent() {
  const t = useTranslations();
  const signUp = useSignUp();
  const checkMailMutation = useCheckMailExist();
  const router = useRouter();
  const locale = useLocale();

  const formSchema = z.object({
    email: z.string().min(1, t("emailRequired")).email(t("invalidEmail")),
    first_name: z.string().min(1, { message: t("first_name_required") }),
    last_name: z.string().min(1, { message: t("last_name_required") }),
    phone_number: z
      .string()
      .min(6, { message: t("phone_number_short") })
      .refine((val) => /^\+?[0-9]+$/.test(val), {
        message: t("phone_number_invalid"),
      }),
    gender: z.string().min(1, { message: t("gender_required") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      gender: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    checkMailMutation.mutate(values.email, {
      onSuccess() {
        signUp.mutate(
          {
            email: values.email,
            phone_number: values.phone_number,
            first_name: values.first_name,
            last_name: values.last_name,
            gender: values.gender,
          },
          {
            onSuccess: () => {
              form.reset();
              toast.success(t("signUpSuccess"));
              router.push("/mein-konto", { locale });
            },
            onError: () => {
              toast.error(t("signUpFail"));
            },
          },
        );
      },
      onError() {
        toast.error(t("useDifferentEmail"));
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center lg:min-w-[500px] justify-center relative overflow-hidden p-4">
      {/* Glass form container */}
      <div className="relative z-10 w-full bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("createAccount")}
          </h1>
          <p className="text-gray-600 text-sm">{t("signupMessage")}</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Gender (RadioGroup) */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    {t("gender")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex justify-start mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="male"
                          id="male"
                          className="border-gray-400"
                        />
                        <label
                          htmlFor="male"
                          className="text-gray-700"
                        >
                          {t("male")}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="female"
                          id="female"
                          className="border-gray-400"
                        />
                        <label
                          htmlFor="female"
                          className="text-gray-700"
                        >
                          {t("female")}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="other"
                          id="other"
                          className="border-gray-400"
                        />
                        <label
                          htmlFor="other"
                          className="text-gray-700"
                        >
                          {t("other")}
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("first_name")}
                      {...field}
                      className="w-full rounded-xl border border-white/30 bg-white/20 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("last_name")}
                      {...field}
                      className="w-full rounded-xl border border-white/30 bg-white/20 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("email")}
                      {...field}
                      className="w-full rounded-xl border border-white/30 bg-white/20 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("phone_number")}
                      {...field}
                      className="w-full rounded-xl border border-white/30 bg-white/20 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary/90 text-white font-semibold hover:bg-primary/30 transition"
              disabled={signUp.isPending || checkMailMutation.isPending}
            >
              {signUp.isPending || checkMailMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                </div>
              ) : (
                t("createAccount")
              )}
            </Button>
          </form>
        </Form>

        {/* Already have account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-center mt-6 space-x-1">
            <span>{t("already_have_account")}</span>
            <Link
              href="/anmelden"
              className="text-sm text-primary hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
