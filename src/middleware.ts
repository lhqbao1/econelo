import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed", // ✅ Ẩn /de cho default locale
  localeDetection: false,
});

export default function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 🚫 Redirect /de/... -> /... để tránh trùng lặp canonical
  if (pathname.startsWith("/de/")) {
    const cleanPath = pathname.replace(/^\/de/, "") || "/";
    return NextResponse.redirect(new URL(cleanPath, req.url), 301);
  }

  // ✅ Nhận diện URL kiểu WooCommerce cũ
  const looksLikeOldWooProduct =
    pathname.startsWith("/product/") &&
    !/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(pathname);

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
    "order"
  ].some((param) => searchParams.has(param));

  const isOtherOldWpPaths =
    pathname.startsWith("/shop/") ||
    pathname.startsWith("/product-category/") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/my-account");

  // 🚫 Nếu là URL WooCommerce cũ → trả về 410 Gone
  if (looksLikeOldWooProduct || hasWpParams || isOtherOldWpPaths) {
    return new NextResponse("This page has been permanently removed.", {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // ✅ Cho phép route Next.js hợp lệ tiếp tục
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|txt|xml|mp4|webm|ogg|mp3|wav|pdf|woff|ttf|eot)).*)",
  ],
};
