import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartApi, wishlistApi } from "@/api";
import { Button } from "@/components/ui";
import type { ProductListItem } from "@/types";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: ProductListItem;
  isInWishlist?: boolean;
  imageLoading?: "eager" | "lazy";
}

function ProductCardComponent({
  product,
  isInWishlist = false,
  imageLoading = "lazy",
}: ProductCardProps) {
  const productId = product.id ?? (product as { _id?: string })._id ?? "";
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: () => cartApi.add(productId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const toggleWishlist = useMutation({
    mutationFn: () =>
      isInWishlist ? wishlistApi.remove(productId) : wishlistApi.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(
        isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      );
    },
    onError: () => toast.error("Something went wrong"),
  });

  const hasDiscount =
    product.priceAfterDiscount != null &&
    product.priceAfterDiscount > 0 &&
    product.priceAfterDiscount < product.price;
  const price = hasDiscount ? product.priceAfterDiscount : product.price;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] dark:bg-[var(--color-card)]/80 overflow-hidden shadow-lg hover:shadow-hover transition-shadow duration-300"
    >
      <Link to={`/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[var(--color-card-hover)] dark:bg-[var(--color-card-hover)]/50">
          <img
            src={product.imageCover}
            alt={product.title}
            loading={imageLoading}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-xl bg-[var(--color-destructive)] px-2.5 py-1 text-xs font-semibold text-white">
              Sale
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-[var(--color-foreground)] dark:text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-hover)] transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)] line-clamp-1">
            {product.category?.name}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-hover)]">
              EGP {price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[var(--color-muted-foreground)] line-through">
                EGP {product.price}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist.mutate();
          }}
          disabled={toggleWishlist.isPending || !productId}
          className={cn(
            "p-2.5 rounded-xl bg-[var(--color-card)]/90 dark:bg-[var(--color-card)]/80 shadow-lg border border-[var(--color-border)] transition-colors",
            isInWishlist
              ? "text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/20 dark:hover:bg-[var(--color-destructive)]/30"
              : "hover:bg-[var(--color-card-hover)] dark:hover:bg-[var(--color-card-hover)]/50",
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart className={cn("h-5 w-5", isInWishlist && "fill-current")} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addToCart.mutate();
          }}
          disabled={addToCart.isPending || !productId}
          className="p-2.5 rounded-xl bg-[var(--color-card)]/90 dark:bg-[var(--color-card)]/80 shadow-lg border border-[var(--color-border)] hover:bg-[var(--color-primary)]/20 dark:hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] dark:text-[var(--color-primary-hover)] transition-colors"
          aria-label="Add to cart"
        >
          <FiShoppingCart className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-5">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          loading={addToCart.isPending}
          disabled={!productId}
          onClick={(e) => {
            e.preventDefault();
            addToCart.mutate();
          }}
        >
          Add to cart
        </Button>
      </div>
    </motion.article>
  );
}


export const ProductCard = React.memo(ProductCardComponent);
