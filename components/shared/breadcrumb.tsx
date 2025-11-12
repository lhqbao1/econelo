"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link } from "@/src/i18n/navigation";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import React from "react";

interface CustomBreadCrumbProps {
  currentPage?: string;
  parentPage?: string;
  isProductPage?: boolean;
  currentPageLink?: string;
}

export default function CustomBreadCrumb({
  currentPage,
  isProductPage,
  parentPage,
  currentPageLink,
}: CustomBreadCrumbProps) {
  const params = useParams();
  const { slug } = params;
  const t = useTranslations();

  // Normalize slug thành array
  const slugArray: string[] = slug ? (Array.isArray(slug) ? slug : [slug]) : [];

  return (
    <Breadcrumb className="pt-2">
      <BreadcrumbList className="">
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="capitalize text-gray-500 font-medium text-base"
          >
            {t("home")}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {parentPage ? (
          <>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize text-gray-500 font-medium text-base">
                {parentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          ""
        )}

        {/* Current page (if provided) */}
        {currentPage ? (
          <>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize text-gray-500 font-medium text-base">
                <Link href={currentPageLink ? `/${currentPageLink}` : "/"}>
                  {currentPage}
                </Link>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          slugArray.map((item, idx) => {
            const isLast = idx === slugArray.length - 1;
            const hideLast = isLast && isProductPage;
            const href = "/" + slugArray.slice(0, idx + 1).join("/");

            return (
              <React.Fragment key={idx}>
                {idx === 0 ? (
                  ""
                ) : (
                  <BreadcrumbSeparator className="text-primary" />
                )}
                {!hideLast && (
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="capitalize text-gray-500 font-medium text-base">
                        {item}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className="capitalize text-gray-500 font-medium text-base"
                        href={href}
                      >
                        {item}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                )}
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
