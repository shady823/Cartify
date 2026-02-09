import { api } from "./axios";
import type { Order, CreateOrderPayload, OrdersResponse } from "@/types";

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    api.post<{ session?: { url: string }; data?: Order }>(
      "/api/v1/checkout-sessions",
      payload,
    ),

  getMyOrders: () => api.get<OrdersResponse>("/api/v1/orders/user/me"),
};
