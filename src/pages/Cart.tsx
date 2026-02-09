import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartApi } from "@/api";
import { Button, Skeleton } from "@/components/ui";
import type { CartResponse } from "@/types";
import { useCartQuery } from "@/hooks/useCartQuery";

export function Cart() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCartQuery();

  const updateCount = useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      cartApi.updateCount(productId, count),
    onMutate: async ({ productId, count }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const prev = queryClient.getQueryData<CartResponse | null>(["cart"]);
      if (prev?.data?.products) {
        const products = prev.data.products.map((p) => {
          const pId =
            p.product?.id ?? (p.product as { _id?: string })?._id ?? "";
          if (pId === productId) {
            return { ...p, count };
          }
          return p;
        });
        const numOfCartItems = products.reduce((sum, p) => sum + p.count, 0);
        const totalCartPrice = products.reduce(
          (sum, p) =>
            sum + (p.product?.priceAfterDiscount ?? p.price) * p.count,
          0,
        );
        queryClient.setQueryData<CartResponse>(["cart"], {
          ...prev,
          numOfCartItems,
          data: { ...prev.data, products, totalCartPrice },
        });
      }
      return { prev };
    },
    onError: (_err, _item, context) => {
      if (context?.prev) queryClient.setQueryData(["cart"], context.prev);
      toast.error("Failed to update");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const remove = useMutation({
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
          data: { ...prev.data, products, totalCartPrice },
        });
      }
      return { prev };
    },
    onError: (_err, _itemId, context) => {
      if (context?.prev) queryClient.setQueryData(["cart"], context.prev);
      toast.error("Failed to remove");
    },
    onSuccess: () => toast.success("Removed from cart"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const cart = data?.data;
  const items = cart?.products ?? [];
  const total = items.reduce(
    (sum, item) =>
      sum + (item.product?.priceAfterDiscount ?? item.price) * item.count,
    0,
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border-border bg-card p-4"
            >
              <Skeleton className="h-24 w-24 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-3xl font-bold text-on-background mb-4">
          Your cart is empty
        </h1>
        <p className="text-muted mb-8">Add some products to get started.</p>
        <Link to="/products">
          <Button variant="primary" size="lg">
            Browse products
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-on-background mb-8">Cart</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const lineId = item.id ?? item._id ?? "";
          const productId =
            item.product?.id ?? (item.product as { _id?: string })?._id ?? "";
          const unitPrice = item.product?.priceAfterDiscount ?? item.price;
          const originalPrice = item.product?.price ?? item.price;
          const hasDiscount = unitPrice !== originalPrice;

          return (
            <motion.div
              key={lineId || productId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border-border bg-card p-4 shadow-soft"
            >
              <Link
                to={`/products/${productId}`}
                className="flex gap-4 sm:flex-1 min-w-0"
              >
                <img
                  src={item.product.imageCover}
                  alt={item.product.title}
                  loading="lazy"
                  decoding="async"
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-on-background truncate">
                    {item.product.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-primary">EGP {unitPrice} each</p>
                    {hasDiscount && (
                      <p className="text-muted text-sm line-through">
                        EGP {originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center rounded-xl border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      updateCount.mutate({
                        productId,
                        count: Math.max(1, item.count - 1),
                      })
                    }
                    disabled={
                      updateCount.isPending || item.count <= 1 || !productId
                    }
                    className="h-10 w-10 flex items-center justify-center hover:bg-hover transition-colors disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="h-10 w-12 flex items-center justify-center font-medium border-x border-border text-sm">
                    {item.count}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateCount.mutate({ productId, count: item.count + 1 })
                    }
                    disabled={updateCount.isPending || !productId}
                    className="h-10 w-10 flex items-center justify-center hover:bg-hover transition-colors"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold text-on-background w-20 text-right">
                  EGP {unitPrice * item.count}
                </p>

                <button
                  type="button"
                  onClick={() => remove.mutate(productId)}
                  disabled={remove.isPending || !productId}
                  className="p-2 rounded-xl text-error hover:bg-error/10 transition-colors"
                  aria-label="Remove item"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border-border bg-card p-6 shadow-soft">
        <div className="flex justify-between text-xl font-semibold text-on-background">
          <span>Total</span>
          <span>EGP {total}</span>
        </div>
        <Link to="/checkout" className="mt-4 block">
          <Button variant="primary" size="lg" className="w-full">
            Proceed to checkout
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
