// app/components/layout/home/ProductTabsServer.tsx
import { getCategoriesWithChildren } from "@/features/category/api";
import { dehydrate, QueryClient, DehydratedState } from "@tanstack/react-query";
import { QueryProvider } from "@/lib/query-provider";
import ProductTabsClient from "../product-tabs";

export default async function ProductTabsServer() {
  const queryClient = new QueryClient();

  // Prefetch categories server-side
  await queryClient.prefetchQuery({
    queryKey: ["categories-with-children", "econelo"],
    queryFn: () => getCategoriesWithChildren({ is_econelo: true }),
  });

  const state: DehydratedState = dehydrate(queryClient);

  const categories = await queryClient.getQueryData<
    Awaited<ReturnType<typeof getCategoriesWithChildren>>
  >(["categories-with-children", "econelo"]);

  const categoriesList = categories?.flatMap((cat) => cat.children || []) ?? [];

  // hydrate categories để client không fetch lại
  return <ProductTabsClient categoriesList={categoriesList} />;
}
