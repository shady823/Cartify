import { api } from "./axios";
import type {
  Product,
  ProductListItem,
  PaginatedResponse,
  ProductsQueryParams,
} from "@/types";

export const productsApi = {
  getAll: (params?: ProductsQueryParams) =>
    api.get<PaginatedResponse<ProductListItem>>("/api/v1/products", {
      params,
    }),

  getById: (id: string) => api.get<{ data: Product }>(`/api/v1/products/${id}`),
};
