import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { formatEUR } from "@/lib/format-euro";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { ProductItem } from "@/types/products";
import Image from "next/image";
import { useProductsAlgoliaSearch } from "@/features/products/hook";

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
      <DrawerContent className="h-full overflow-hidden border-r-0 bg-[#f8fbf4] p-0 shadow-2xl duration-500 data-[vaul-drawer-direction=left]:w-[92vw] data-[vaul-drawer-direction=left]:max-w-[560px] data-[vaul-drawer-direction=left]:sm:max-w-[560px]">
        <div className="flex h-full flex-col">
          <div className="relative overflow-hidden border-b border-primary/10 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-primary/10" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <DrawerTitle className="text-2xl font-bold uppercase tracking-wide text-primary">
                  {t("searchProduct")}
                </DrawerTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("searchProductHint")}
                </p>
              </div>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  aria-label={t("closeSearch")}
                >
                  <X className="h-5 w-5" />
                </button>
              </DrawerClose>
            </div>
          </div>

          <Command
            className="flex-1 bg-transparent px-4 py-4 sm:px-5 [&_[data-slot=command-input-wrapper]]:h-14 [&_[data-slot=command-input-wrapper]]:rounded-2xl [&_[data-slot=command-input-wrapper]]:border [&_[data-slot=command-input-wrapper]]:border-primary/15 [&_[data-slot=command-input-wrapper]]:bg-white [&_[data-slot=command-input-wrapper]]:px-4 [&_[data-slot=command-input-wrapper]]:shadow-sm [&_[data-slot=command-input-wrapper]_svg]:text-primary [&_[data-slot=command-input]]:text-base"
            shouldFilter={false}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
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
              <Button
                type="button"
                className="h-14 rounded-2xl px-4 shadow-sm"
                onClick={handleSubmit}
                disabled={!query.trim()}
                aria-label={t("searchProduct")}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <CommandList className="mt-4 flex-1 overflow-auto pr-1">
              {isLoading && (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/20 bg-white/70 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>{t("loading")}...</span>
                </div>
              )}
              {!isLoading && results.length === 0 && query.trim().length > 0 && (
                <CommandEmpty className="rounded-2xl border border-dashed border-primary/20 bg-white/70 py-10 text-center text-sm text-muted-foreground">
                  {t("noResult")}
                </CommandEmpty>
              )}
              {results.length > 0 && (
                <CommandGroup className="p-0 [&_[cmdk-group-items]]:space-y-3">
                  {results.map((product: ProductItem, index) => {
                    const safeStaticFiles = Array.isArray(product?.static_files)
                      ? product.static_files
                      : [];
                    const imageUrl =
                      safeStaticFiles[0]?.url ?? "/placeholder-product.webp";
                    const productName =
                      typeof product?.name === "string" &&
                      product.name.trim().length > 0
                        ? product.name
                        : "Produkt";
                    const safeUrlKey =
                      typeof product?.url_key === "string"
                        ? product.url_key.trim()
                        : "";
                    const detailPath = safeUrlKey
                      ? `/produkt/${safeUrlKey}`
                      : "/alle-produkte";
                    const finalPrice = Number(product?.final_price);
                    const listPrice = Number(product?.price);
                    const displayPrice = Number.isFinite(finalPrice)
                      ? finalPrice
                      : Number.isFinite(listPrice)
                        ? listPrice
                        : null;

                    return (
                      <CommandItem
                        key={product.id ?? `search-drawer-product-${index}`}
                        value={productName}
                        onSelect={() => {
                          router.push(detailPath, { locale });
                          setQuery("");
                          setOpen(false);
                        }}
                        className="mb-3 cursor-pointer rounded-2xl border border-transparent bg-white p-3 shadow-sm transition last:mb-0 data-[selected=true]:border-primary/25 data-[selected=true]:bg-white hover:border-primary/25 hover:shadow-md"
                      >
                        <div className="flex w-full items-center gap-3">
                          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/5 bg-[#f7f7f2]">
                            <Image
                              src={imageUrl}
                              height={64}
                              width={64}
                              alt={productName}
                              className="h-full w-full object-contain p-1.5"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                              {productName}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                #{product.id_provider}
                              </span>
                              {displayPrice !== null && (
                                <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-semibold text-foreground">
                                  {formatEUR(displayPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 shrink-0 text-primary/70" />
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
