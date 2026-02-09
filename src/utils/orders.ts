import type { ShippingAddress } from "@/types";

export interface LocalOrder {
  _id: string;
  shippingAddress: ShippingAddress;
  cartItems: Array<{
    product: string;
    count: number;
    price: number;
  }>;
  totalOrderPrice: number;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
}

export function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function saveOrder(order: LocalOrder): void {
  try {
    const existing = getOrders();
    const updated = [order, ...existing];
    localStorage.setItem("orders", JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save order:", error);
  }
}

export function getOrders(): LocalOrder[] {
  try {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get orders:", error);
    return [];
  }
}

export function clearOrders(): void {
  try {
    localStorage.removeItem("orders");
  } catch (error) {
    console.error("Failed to clear orders:", error);
  }
}
