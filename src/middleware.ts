import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  localeDetection: false,
});

const TRACKING_PARAMS = [
  "srsltid",
  "gclid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hasAffiliateCode = searchParams.has("aff");

  let changed = false;

  // =========================
  // 1️⃣ REMOVE TRACKING PARAMS
  // =========================
  TRACKING_PARAMS.forEach((param) => {
    if (hasAffiliateCode && param === "utm_source") return;

    if (searchParams.has(param)) {
      searchParams.delete(param);
      changed = true;
    }
  });

  if (changed) {
    return NextResponse.redirect(url, 302);
  }

  // =========================
  // 2️⃣ REDIRECT /de/... → /
  // =========================
  if (pathname.startsWith("/de/")) {
    const cleanPath = pathname.replace(/^\/de/, "") || "/";
    const cleanUrl = new URL(cleanPath, req.url);
    cleanUrl.search = searchParams.toString();
    return NextResponse.redirect(cleanUrl, 301);
  }

  // =========================
  // 3️⃣ BLOCK WOOCOMMERCE CŨ
  // =========================
  const looksLikeOldWooProduct =
    pathname.startsWith("/product/") &&
    !/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(
      pathname,
    );

  const hasWpParams = [
    "add_to_wishlist",
    "_wpnonce",
    "remove_item",
    "add-to-cart",
    "wc-api",
    "product-page",
    "orderby",
    "coupon_code",
    "apply_coupon",
    "order",
  ].some((param) => searchParams.has(param));

  const isOtherOldWpPaths =
    pathname.startsWith("/shop") ||
    pathname.startsWith("/product-category") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/my-account");

  if (looksLikeOldWooProduct || hasWpParams || isOtherOldWpPaths) {
    return new NextResponse("This page has been permanently removed.", {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // =========================
  // 4️⃣ NEXT-INTL
  // =========================
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|txt|xml|mp4|webm|ogg|mp3|wav|pdf|woff|ttf|eot)).*)",
  ],
};
