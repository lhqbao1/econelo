"use client";
import HoverButton from "@/components/shared/hover-button";
import { ContactFormInput } from "@/features/contact/api";
import { useUploadContactForm } from "@/features/contact/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";
import z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { contactOrderIdAtom } from "@/store/checkout";

const formSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  subject: z.string().min(1, "Bitte wählen Sie ein Thema aus"),
  order_id: z.string().optional(),
  message: z.string().min(1, "Bitte geben Sie eine Nachricht ein"),
  file_url: z.string().optional(),
});

const SUBJECT_OPTIONS_DE = [
  "Frage zu einem Produkt",
  "Bestellstatus / Sendungsverfolgung",
  "Bestellung ändern oder stornieren",
  "Frage zum Versand / zur Lieferung",
  "Frage zur Zahlung oder Rechnung",
  "Garantie oder Reklamation",
  "B2B",
  "Konto",
  "Sonstige / Allgemeine Anfrage",
  "Datenschutzanliegen",
];

const ContactForm = () => {
  const t = useTranslations();
  const [contactOrderId, setContactOrderId] = useAtom(contactOrderIdAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      order_id: "",
      message: "",
    },
  });

  const uploadContactFormMutation = useUploadContactForm();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => {
        if (key === "email" || key === "subject") return true;
        return value !== null && value !== undefined && value !== "";
      }),
    ) as unknown as ContactFormInput;

    uploadContactFormMutation.mutate(
      {
        ...cleanedValues,
        order_id: contactOrderId,
      },
      {
        onSuccess() {
          toast.success("Ihre Nachricht wurde erfolgreich gesendet.");
          form.reset();
        },
        onError() {
          toast.error(
            "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
          );
        },
      },
    );
  };

  return (
    <div className="w-full min-h-[70vh] grid md:grid-cols-2 grid-cols-1">
      <div className="bg-primary flex justify-end items-center">
        <div className="w-3/4 space-y-6">
          <div className="flex justify-start items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="uppercase text-sm font-semibold text-white">
              {t("getInTouch")}
            </span>
          </div>
          <div>
            <h2 className="text-white lg:text-4xl text-3xl font-bold">
              {t("sendMessageUs")}
            </h2>
            <p className="text-white">{t("sendMessageUsDes")}</p>
          </div>
          <div className="text-white">
            <p>{t("openTime")}</p>
            <p>{t("closedTime")}</p>
          </div>
          <HoverButton
            redirect_url="#"
            text={t("requestCallback")}
          />
        </div>
      </div>

      <div className="bg-[#EEF3F5] flex justify-center items-center">
        <div className="w-3/4 bg-white rounded-xl md:px-6 lg:px-12 xl:px-16 md:py-4 lg:py-10 xl:py-12">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="lg:text-base font-semibold text-sm">
                      {t("email")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="lg:text-base font-semibold text-sm">
                      {t("subject")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border w-full">
                          <SelectValue placeholder={t("subjectPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUBJECT_OPTIONS_DE.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="lg:text-base font-semibold text-sm">
                      {t("message")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("messagePlaceholder")}
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex lg:justify-end justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadContactFormMutation.isPending}
                >
                  {t("back")}
                </Button>
                <Button type="submit">
                  {uploadContactFormMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>{t("submit")}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
