import { api } from "./axios";
import type { AxiosRequestConfig } from "axios";
import type { Category } from "@/types";

export const categoriesApi = {
  getAll: (config?: AxiosRequestConfig) =>
    api.get<{ data: Category[] }>("/api/v1/categories", config),
};
