"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/types/user";
import { useUpdateUser } from "@/features/users/hook";
import { useState } from "react";
import { useTranslations } from "next-intl";

const profileSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  email: z.string().email(),
  phone_number: z.string().optional(),
  language: z.string().optional(),
  is_notified: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function MyAccountProfile({ user }: { user: Customer }) {
  const updateUserMutation = useUpdateUser();
  const [isNotified, setIsNotified] = useState<boolean>(
    user.is_notified ?? false
  );
  const t = useTranslations();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      gender: user?.gender || "",
      date_of_birth: user?.date_of_birth?.split("T")[0] || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      language: user?.language || "en",
      is_notified: user?.is_notified || false,
    },
  });

  const isPending = false; // giả lập loading từ mutation

  const onSubmit = (values: ProfileFormValues) => {
    updateUserMutation.mutate(
      {
        id: user.id,
        user: {
          ...user,
          is_notified: isNotified,
        },
      },
      {
        onSuccess(data, variables, context) {
          toast.success(t("turnOnNotificationsSuccess"));
        },
        onError(error, variables, context) {
          toast.error(t("turnOnNotificationsError"));
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Section 1: Personal Info */}
        <section>
          <h2 className="text-xl font-bold mb-6">{t("userInformation")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("first_name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("last_name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gender")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">{t("male")}</SelectItem>
                      <SelectItem value="female">{t("female")}</SelectItem>
                      <SelectItem value="other">{t("otherGender")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dateOfBirth")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Section 2: Contact Info */}
        <section>
          <h2 className="text-xl font-bold mb-6">{t("contactInformation")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-gray-100" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone_number")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+49 ..." />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_notified"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-between border rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="space-y-1">
                        <FormLabel className="text-[15px] font-semibold text-gray-800">
                          {field.value
                            ? t("newsletter_subscribed")
                            : t("newsletter_not_subscribed")}
                        </FormLabel>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                          {field.value
                            ? t("newsletter_subscribe_confirm_active", {
                                email: user.email,
                              })
                            : t("newsletter_subscribe_confirm", {
                                email: user.email,
                              })}
                        </p>
                      </div>

                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 transition-colors"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Submit button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
