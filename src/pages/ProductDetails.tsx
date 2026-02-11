import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productsApi, cartApi, wishlistApi } from "@/api";
import { Button } from "@/components/ui";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { Skeleton } from "@/components/ui";
import { cn } from "@/utils/cn";
import type { CartResponse } from "@/types";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const queryClient = useQueryClient();
  const wishlistIds = useWishlistIds();
  const isInWishlist = id ? wishlistIds.includes(id) : false;

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id!).then((r) => r.data.data),
    enabled: !!id,
  });

  const addToCart = useMutation({
    mutationFn: async (qty: number) => {
      const getProductIdFromCartItem = (item: unknown): string => {
        const product = (item as { product?: unknown } | null | undefined)
          ?.product as { id?: unknown; _id?: unknown } | null | undefined;
        const productId = product?.id;
        if (typeof productId === "string" && productId) return productId;
        const _id = product?._id;
        if (typeof _id === "string" && _id) return _id;
        return "";
      };

      const cartData = queryClient.getQueryData([
        "cart",
      ]) as CartResponse | null;
      if (cartData?.data?.products) {
        const existingItem = cartData.data.products.find(
          (item) => getProductIdFromCartItem(item) === id,
        );
        if (existingItem) {
          const existingProductId = getProductIdFromCartItem(existingItem) || id!;
          return cartApi.updateCount(existingProductId, existingItem.count + qty);
        }
      }

      const addResponse = await cartApi.add(id!, qty);
      const serverItem = addResponse.data?.data?.products?.find(
        (item) => getProductIdFromCartItem(item) === id,
      );
      const serverCount = serverItem?.count;

      if (qty > 1 && (typeof serverCount !== "number" || serverCount < qty)) {
        const addedProductId = serverItem ? getProductIdFromCartItem(serverItem) : "";
        return cartApi.updateCount(addedProductId || id!, qty);
      }
      return addResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const toggleWishlist = useMutation({
    mutationFn: () =>
      isInWishlist ? wishlistApi.remove(id!) : wishlistApi.add(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(
        isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      );
    },
    onError: () => toast.error("Something went wrong"),
  });

  if (error || !id) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-slate-500 dark:text-slate-400">Product not found.</p>
        <Link
          to="/products"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const product = data;
  const images = product.images?.length ? product.images : [product.imageCover];
  const price = product.priceAfterDiscount ?? product.price;
  const hasDiscount = product.priceAfterDiscount != null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-3xl border border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-card)] dark:bg-[var(--color-card)]">
            <img
              src={images[imageIndex] ?? product.imageCover}
              alt={product.title}
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 touch-pan-x snap-x snap-mandatory sm:mx-0 sm:px-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={cn(
                    "h-20 w-20 shrink-0 snap-start rounded-xl border-2 overflow-hidden transition-all",
                    imageIndex === i
                      ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                      : "border-[var(--color-border)] dark:border-[var(--color-border)] hover:border-[var(--color-muted)] dark:hover:border-[var(--color-muted-foreground)]",
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-[var(--color-foreground)]">
            {product.title}
          </h1>
          <p className="mt-2 text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)]">
            {product.category?.name} · {product.brand?.name}
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
              EGP {price}
            </span>
            {hasDiscount && (
              <span className="text-base sm:text-xl text-[var(--color-muted)] line-through">
                EGP {product.price}
              </span>
            )}
          </div>

          <p className="mt-6 text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)] leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <div className="order-1 sm:order-none flex items-center rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-12 w-12 flex items-center justify-center hover:bg-[var(--color-card-hover)] dark:hover:bg-[var(--color-card-hover)] transition-colors"
              >
                −
              </button>
              <span className="h-12 w-14 flex items-center justify-center font-medium border-x border-[var(--color-border)] dark:border-[var(--color-border)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(product.quantity, q + 1))
                }
                className="h-12 w-12 flex items-center justify-center hover:bg-[var(--color-card-hover)] dark:hover:bg-[var(--color-card-hover)] transition-colors"
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              loading={addToCart.isPending}
              onClick={() => addToCart.mutate(quantity)}
              className="order-3 sm:order-none sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <FiShoppingCart className="h-5 w-5" />
              Add to cart
            </Button>

            <button
              type="button"
              onClick={() => toggleWishlist.mutate()}
              disabled={toggleWishlist.isPending}
              className={cn(
                "order-2 sm:order-none self-end sm:self-auto p-3 rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-border)] hover:bg-[var(--color-card-hover)] dark:hover:bg-[var(--color-card-hover)] transition-colors",
                isInWishlist &&
                  "text-red-500 border-red-200 dark:border-red-900",
              )}
              aria-label={
                isInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <FiHeart
                className={cn("h-5 w-5", isInWishlist && "fill-current")}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

