import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useGetProductsSelect } from "@/features/product-group/hook";
import { ProductItem } from "@/types/products";
import Image from "next/image";
import {
  useGetAllProducts,
  useProductsAlgoliaSearch,
} from "@/features/products/hook";

interface SearchDrawerProps {
  isSticky: boolean;
}

const SearchDrawer = ({ isSticky }: SearchDrawerProps) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);
  const isShopAllPage = pathname.includes("alle-produkte");

  // debounce query
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const shouldFetch = open && debouncedQuery.length > 0;

  const { data, isLoading } = useProductsAlgoliaSearch(
    shouldFetch
      ? {
          query: debouncedQuery,
          is_econelo: true,
          is_active: true,
          page_size: 10,
        }
      : undefined,
  );

  const results = data?.items ?? [];

  const baseColor = !isHome ? "primary" : isSticky ? "primary" : "white";
  const iconColor = `text-${baseColor}`;

  function handleSubmit() {
    const value = query.trim();
    if (!value) return;

    setOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);

    const target = `/${locale}/alle-produkte?${params.toString()}`;

    if (isShopAllPage) {
      router.replace(target, { locale });
    } else {
      router.push(target, { locale });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <button className="p-2 hover:scale-110 transition-transform duration-200">
          <Search
            className={cn(
              "w-6 h-6 cursor-pointer transition-colors duration-200",
              iconColor,
            )}
            strokeWidth={2}
          />
        </button>
      </DrawerTrigger>
      <DrawerContent className="w-full h-full flex flex-col p-0 data-[vaul-drawer-direction=left]:w-full duration-500 min-w-[500px]">
        <DrawerTitle className="border-b-2 p-4 flex justify-between">
          <div className="uppercase font-bold text-xl text-primary">
            {t("searchProduct")}
          </div>
          <DrawerClose>
            <X />
          </DrawerClose>
        </DrawerTitle>
        <Command className="h-full w-full" shouldFilter={false}>
          <div className="p-2 border-b">
            <CommandInput
              placeholder={t("searchProduct")}
              value={query}
              onValueChange={setQuery}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
          <CommandList className="flex-1 overflow-auto">
            {isLoading && <CommandEmpty>{t("loading")}...</CommandEmpty>}
            {!isLoading && results.length === 0 && query.trim().length > 0 && (
              <CommandEmpty>{t("noResult")}</CommandEmpty>
            )}
            {results.length > 0 && (
              <CommandGroup>
                {results.map((product: ProductItem) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => {
                      router.push(`/produkt/${product.url_key}`, { locale });
                      setQuery("");
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-3 flex-1 items-center">
                        <Image
                          src={
                            product.static_files &&
                            product.static_files.length > 0
                              ? product.static_files[0].url
                              : "/placeholder-product.webp"
                          }
                          height={50}
                          width={50}
                          alt=""
                          className="h-12 w-12"
                          unoptimized
                        />
                        <div className="font-semibold line-clamp-2">
                          {product.name}
                        </div>
                      </div>
                      <div className="text-[#666666]">
                        {product.id_provider}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
