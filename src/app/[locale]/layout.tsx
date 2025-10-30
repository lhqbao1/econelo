import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing } from "@/src/i18n/routing";
import MainHeader from "@/components/header/header";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "de" }, { locale: "en" }];
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // 🟢 Load translation messages cho locale
    let messages;
    try {
        messages = (await import(`@/messages/${locale}.json`)).default;
    } catch (error) {
        console.error(`❌ Missing translation file for locale: ${locale}`);
        notFound();
    }

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <MainHeader />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
