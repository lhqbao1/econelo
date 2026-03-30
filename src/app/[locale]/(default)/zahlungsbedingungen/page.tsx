import ListPolicy from "@/components/layout/policy/list-policy";
import {
  getPolicyItemsByVersion,
  getPolicyVersion,
} from "@/features/policy/api";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Script from "next/script";

// ✅ Metadata SEO cho trang Payment Terms
export const metadata = {
  title: "Zahlungsbedingungen | Econelo",
  description:
    "Alle Informationen zu Zahlungsarten, Zahlungsmethoden und Zahlungsbedingungen bei Econelo.",
  alternates: {
    canonical: "https://econelo.de/zahlungsbedingungen",
  },
  openGraph: {
    title: "Zahlungsbedingungen - Econelo",
    description:
      "Details zu allen Zahlungsarten und Zahlungsbedingungen bei Econelo.",
    url: "https://econelo.de/zahlungsbedingungen",
    siteName: "Econelo",
    locale: "de_DE",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Zahlungsbedingungen | Econelo",
    description:
      "Übersicht aller Zahlungsarten und Zahlungsbedingungen von Econelo.",
  },
};

export const revalidate = 3600; // ISR: regen mỗi 1h

export default async function PaymentTermsPage() {
  const queryClient = new QueryClient();

  // Lấy phiên bản policy
  const version = await getPolicyVersion();
  const firstVersion = version.length > 0 ? version[0].id : null;

  // Prefetch version list
  await queryClient.prefetchQuery({
    queryKey: ["policy-version"],
    queryFn: () => getPolicyVersion(),
  });

  // Prefetch items nếu có version
  if (firstVersion) {
    await queryClient.prefetchQuery({
      queryKey: ["policy-items", firstVersion],
      queryFn: () => getPolicyItemsByVersion(firstVersion),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      {/* ✅ Schema.org structured data cho Payment Terms */}
      <Script
        id="schema-payment-terms"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PaymentMethod",
            name: "Zahlungsbedingungen",
            url: "https://econelo.de/zahlungsbedingungen",
            description:
              "Übersicht der akzeptierten Zahlungsarten, Zahlungsbedingungen und Zahlungsabwicklung bei Econelo.",
            acceptedPaymentMethod: [
              "https://schema.org/CreditCard",
              "https://schema.org/PayPal",
              "https://schema.org/BankAccount",
              "https://schema.org/PrePayment",
            ],
            inLanguage: "de",
            provider: {
              "@type": "Organization",
              name: "Econelo",
              url: "https://econelo.de",
            },
          }),
        }}
      />

      <HydrationBoundary state={dehydratedState}>
        <div className="w-full min-h-screen">
          {firstVersion ? (
            <ListPolicy
              versionId={firstVersion}
              versionData={version}
              versionName={version[0].name}
              currentPage="Zahlungsbedingungen"
            />
          ) : (
            <div className="text-center py-20 text-gray-500">
              Keine Zahlungsbedingungen gefunden
            </div>
          )}
        </div>
      </HydrationBoundary>
    </>
  );
}
