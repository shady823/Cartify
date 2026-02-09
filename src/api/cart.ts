import { api } from "./axios";
import type { AxiosRequestConfig } from "axios";
import type { CartResponse } from "@/types";

export const cartApi = {
  get: (config?: AxiosRequestConfig) => api.get<CartResponse>("/api/v1/cart", config),

  add: (productId: string, count: number = 1) =>
    api.post<CartResponse>("/api/v1/cart", { productId, count }),

  updateCount: (itemId: string, count: number) =>
    api.put<CartResponse>(`/api/v1/cart/${itemId}`, { count }),

  remove: (itemId: string) =>
    api.delete<CartResponse>(`/api/v1/cart/${itemId}`),

  clear: () => api.delete<CartResponse>("/api/v1/cart"),
};
