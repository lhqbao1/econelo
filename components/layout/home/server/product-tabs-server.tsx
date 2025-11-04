// app/components/layout/home/ProductTabsServer.tsx
import { getCategories } from "@/features/category/api";
import ProductTabs from "../product-tabs";

export default async function ProductTabsServer() {
  const categories = await getCategories({ is_econelo: true });

  const categoriesList = categories?.flatMap((cat) => cat.children || []) ?? [];

  return <ProductTabs categoriesList={categoriesList} />;
}
