import type { MetadataRoute } from "next";

const SITE_URL = "https://www.econelo.de";

function withEnglishPrefix(paths: string[]): string[] {
  const full = new Set<string>();

  for (const path of paths) {
    full.add(path);
    if (path === "/") {
      full.add("/en");
      continue;
    }
    full.add(`/en${path}`);
  }

  return [...full];
}

export default function robots(): MetadataRoute.Robots {
  const blockedAppPaths = withEnglishPrefix([
    "/kasse",
    "/warenkorb",
    "/payment-result",
    "/mein-konto",
    "/meine-bestellungen",
    "/danke",
  ]);

  const legacyPaths = [
    "/wp-admin/",
    "/wp-content/",
    "/product-category/",
    "/shop/",
    "/cart/",
    "/checkout/",
    "/my-account/",
    "/admin/",
    "/dsp/",
  ];

  const querySpamPatterns = [
    "/*?add-to-cart*",
    "/*add_to_cart*",
    "/*remove_item*",
    "/*_wpnonce*",
    "/*?add_to_wishlist*",
    "/*wc-api*",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...legacyPaths, ...blockedAppPaths, ...querySpamPatterns],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
