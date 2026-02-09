import { api } from "./axios";
import type { AxiosRequestConfig } from "axios";
import type { Brand } from "@/types";

export const brandsApi = {
  getAll: (config?: AxiosRequestConfig) =>
    api.get<{ data: Brand[] }>("/api/v1/brands", config),
};
