import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/api";
import { Button } from "@/components/ui";
import type { CartResponse } from "@/types";
import { useCartQuery } from "@/hooks/useCartQuery";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCartQuery({ enabled: open });
  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartApi.remove(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const prev = queryClient.getQueryData<CartResponse | null>(["cart"]);
      if (prev?.data?.products) {
        const products = prev.data.products.filter(
          (p) =>
            (p.product?.id ?? (p.product as { _id?: string })?._id ?? "") !==
            productId,
        );
        const numOfCartItems = products.reduce((sum, p) => sum + p.count, 0);
        const totalCartPrice = products.reduce(
          (sum, p) =>
            sum + (p.product?.priceAfterDiscount ?? p.price) * p.count,
          0,
        );
        queryClient.setQueryData<CartResponse>(["cart"], {
          ...prev,
          numOfCartItems,
          data: {
            ...prev.data,
            products,
            totalCartPrice,
          },
        });
      }
      return { prev };
    },
    onError: (_err, _itemId, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["cart"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const cart = data?.data;
  const items = cart?.products ?? [];
  const total = items.reduce((sum, item) => {
    const unitPrice = item.product?.priceAfterDiscount ?? item.price;
    return sum + unitPrice * item.count;
  }, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--color-background)] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-hover)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
              <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                Cart
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-[var(--radius-xl)] hover:bg-[var(--color-card-hover)]  transition-colors"
                aria-label="Close cart"
              >
                <FiX className="h-5 w-5 text-[var(--color-foreground)]" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="h-20 w-20 rounded-[var(--radius-2xl)] bg-[var(--color-border)]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-[var(--color-border)]" />
                        <div className="h-4 w-1/2 rounded bg-[var(--color-border)]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-[var(--color-muted-foreground)]">
                  <p>Your cart is empty</p>
                  <Link to="/products" onClick={onClose}>
                    <Button variant="primary" className="mt-4 w-full">
                      Browse products
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => {
                    const lineId = item.id ?? item._id ?? "";
                    const productId =
                      item.product?.id ??
                      (item.product as { _id?: string })?._id ??
                      "";
                    return (
                      <li
                        key={lineId || productId}
                        className="flex gap-4 rounded-[var(--radius-2xl)] border border-[var(--color-border)] p-3"
                      >
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          loading="lazy"
                          decoding="async"
                          className="h-20 w-20 rounded-[var(--radius-md)] object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--color-foreground)] truncate">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-[var(--color-primary)]">
                            EGP {item.product?.priceAfterDiscount ?? item.price}{" "}
                            × {item.count}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMutation.mutate(productId)}
                          disabled={removeMutation.isPending || !productId}
                          className="text-[var(--color-destructive)] hover:text-[var(--color-primary-hover)] p-1 rounded-lg hover:bg-[var(--color-card-hover)]"
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-border)] p-4 space-y-3">
                <div className="flex justify-between text-lg font-semibold text-[var(--color-foreground)]">
                  <span>Total</span>
                  <span>EGP {total}</span>
                </div>
                <Link to="/cart" onClick={onClose}>
                  <Button variant="primary" className="w-full">
                    View cart & checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
