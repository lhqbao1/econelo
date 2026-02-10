import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateProduct,
  deleteProduct,
  editProduct,
  generateSEO,
  getAllProducts,
  GetAllProductsParams,
  getProductById,
  getProductByTag,
  getProductsAlgoliaSearch,
  GetProductsSearchParams,
} from "./api";
import { ProductInput } from "@/lib/schema/product";
import { ProductResponse } from "@/types/products";

interface SEOInput {
  title: string;
  description: string;
}

export function useGetAllProducts(
  {
    page,
    page_size,
    all_products,
    search,
    is_econelo,
  }: GetAllProductsParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["products", page, page_size, all_products, search, is_econelo], // queryKey thay đổi khi page/page_size thay đổi
    queryFn: () =>
      getAllProducts({ page, page_size, all_products, search, is_econelo }),
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}

export function useProductsAlgoliaSearch(params?: GetProductsSearchParams) {
  return useQuery<ProductResponse>({
    queryKey: [
      "products-algolia-search",
      params?.page,
      params?.page_size,
      params?.query,
      params?.brand,
      params?.is_active,
      params?.brandsKey,
      params?.categoriesKey, // 👈 STRING
      params?.brandsKey, // 👈 STRING
      params?.color,
      params?.colorsKey,
      params?.materials,
      params?.materialsKey,
      params?.is_econelo,
    ],
    queryFn: () => getProductsAlgoliaSearch(params),
    enabled: !!params, // không gọi khi params chưa sẵn sàng
    refetchOnWindowFocus: false,
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    retry: false,
  });
}

export function useGetProductByTag(tag: string) {
  return useQuery({
    queryKey: ["product-by-tag", tag],
    queryFn: () => getProductByTag(tag),
    enabled: !!tag,
    retry: false,
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => CreateProduct(input),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useEditProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) =>
      editProduct(input, id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGenerateSEO() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SEOInput) => generateSEO(input),
    // onSuccess: (res) => {
    //   qc.invalidateQueries({ queryKey: ["products"] })
    // },
  });
}
