// components/TrustedShops.tsx
"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export function TrustedShops() {
  const pathname = usePathname();

  // ❌ Không load TrustedShops trong admin

  return (
    <Script
      id="trusted-shops"
      src="//widgets.trustedshops.com/js/XEDAB0ABA095EB0276C83ADAB7FC0885F.js"
      strategy="lazyOnload"
      async
      data-desktop-position="left"
      data-desktop-custom-width="156"
      data-desktop-disable-reviews="false"
      data-desktop-enable-custom="false"
      data-desktop-enable-fadeout="false"
      data-mobile-position="left"
      data-mobile-custom-width="156"
      data-mobile-disable-reviews="false"
      data-mobile-enable-fadeout="true"
      data-disable-mobile="false"
      data-disable-trustbadge="false"
      data-color-scheme="dark"
      charSet="UTF-8"
    />
  );
}
