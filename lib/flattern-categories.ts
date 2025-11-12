// utils/categories.ts
import { CategoryResponse } from "@/types/categories";

/**
 * Flatten all children categories into one flat array
 * (ignores root level, only returns nested children)
 */
export function flattenChildCategories(categories: CategoryResponse[]): CategoryResponse[] {
  const result: CategoryResponse[] = [];

  const traverse = (nodes: CategoryResponse[]) => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        // Push children (not the parent itself)
        result.push(...node.children);
        traverse(node.children); // continue deeper
      }
    }
  };

  traverse(categories);
  return result;
}
