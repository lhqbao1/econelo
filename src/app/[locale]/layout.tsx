import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing } from "@/src/i18n/routing";
import type { Metadata } from "next";
import IntlClientProviderWithAuth from "./intlProviderWithAuth";
import { getMessages } from "next-intl/server";
import { AuthSanity } from "@/hooks/auth/auth-sanity";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// 🏗️ Tạo static path cho các ngôn ngữ
export async function generateStaticParams() {
  return [{ locale: "de" }, { locale: "en" }];
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <IntlClientProviderWithAuth
      locale={locale}
      messages={messages} // ✅ BẮT BUỘC
      timeZone="Europe/Berlin"
    >
      <AuthSanity />
      {children}
    </IntlClientProviderWithAuth>
  );
}
