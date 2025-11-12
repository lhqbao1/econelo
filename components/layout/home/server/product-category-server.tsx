// CategorySectionServer.tsx — SERVER COMPONENT
import { getCategories } from "@/features/category/api";
import CategorySection from "../categories";

export default async function CategorySectionServer() {
  const categories = await getCategories({ is_econelo: true });
  return <CategorySection categories={categories} />;
}
