import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/api";
import { Skeleton } from "@/components/ui";
import { FiPackage, FiCheck } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { getOrders } from "@/utils/orders";
import type { Order } from "@/types";
import type { LocalOrder } from "@/utils/orders";

type OrderType = Order | LocalOrder;

export function Orders() {
  const [localOrders, setLocalOrders] = useState<LocalOrder[]>([]);

  useEffect(() => {
    setLocalOrders(getOrders());
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      ordersApi
        .getMyOrders()
        .then((r) => r.data)
        .catch(() => ({ data: [] })),
  });
  const apiOrders = data?.data ?? [];

  // Combine local and API orders, sorted by date (newest first)
  const allOrders = [...(localOrders as OrderType[]), ...apiOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (isLoading && allOrders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center"
      >
        <FiPackage className="h-16 w-16 mx-auto text-muted mb-4" />
        <h1 className="text-3xl font-bold text-on-background mb-4">
          No orders yet
        </h1>
        <p className="text-muted">
          When you place an order, it will appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-on-background mb-8">Orders</h1>
      <div className="space-y-4">
        {allOrders.map((order, i) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-muted">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="font-semibold text-on-background mt-1">
                  EGP {order.totalOrderPrice}
                </p>
                <p className="text-sm text-muted mt-1">
                  {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                  {order.cartItems.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                    order.isPaid
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning",
                  )}
                >
                  {order.isPaid ? (
                    <>
                      <FiCheck className="h-4 w-4" />
                      Paid
                    </>
                  ) : (
                    "Pending"
                  )}
                </span>
                {order.isDelivered && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                    Delivered
                  </span>
                )}
              </div>
            </div>
            {order.shippingAddress && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <p className="text-sm text-muted">
                  <span className="font-medium text-on-background">
                    Address:
                  </span>{" "}
                  {order.shippingAddress.details}
                </p>
                <p className="text-sm text-muted">
                  <span className="font-medium text-on-background">City:</span>{" "}
                  {order.shippingAddress.city}
                </p>
                <p className="text-sm text-muted">
                  <span className="font-medium text-on-background">Phone:</span>{" "}
                  {order.shippingAddress.phone}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
