import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard } from "@/features/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui";
import { Button } from "@/components/ui";
import { useWishlistQuery } from "@/hooks/useWishlistQuery";

export function Wishlist() {
  const { data, isLoading } = useWishlistQuery();

  const list = data?.data ?? [];
  const products = Array.isArray(list) ? list : [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-on-background mb-8">Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-3xl font-bold text-on-background mb-4">
          Your wishlist is empty
        </h1>
        <p className="text-muted mb-8">
          Save items you like by clicking the heart icon.
        </p>
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
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-on-background mb-8">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isInWishlist />
        ))}
      </div>
    </motion.div>
  );
}
