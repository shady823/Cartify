import { api } from "./axios";
import type { AxiosRequestConfig } from "axios";
import type { WishlistResponse } from "@/types";

export const wishlistApi = {
  get: (config?: AxiosRequestConfig) =>
    api.get<WishlistResponse>("/api/v1/wishlist", config),

  add: (productId: string) =>
    api.post<WishlistResponse>("/api/v1/wishlist", { productId }),

  remove: (productId: string) =>
    api.delete<WishlistResponse>(`/api/v1/wishlist/${productId}`),
};
