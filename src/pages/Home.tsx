import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api";
import { ProductCard } from "@/features/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { Button } from "@/components/ui";

export function Home() {
  const { data: productsData } = useQuery({
    queryKey: ["products", "featured", { limit: 8 }],
    queryFn: () => productsApi.getAll({ limit: 8 }).then((r) => r.data),
  });
  const wishlistIds = useWishlistIds({ enabled: Boolean(productsData) });
  const wishlistIdSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
  const products = productsData?.data ?? [];
  const isLoading = !productsData;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl mx-4 mt-4 lg:mx-8 lg:mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 lg:p-20 text-white shadow-hover"
        >
          <div className="relative z-10 max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-indigo-200 text-sm font-medium uppercase tracking-wider"
            >
              Welcome to Store
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Premium products, delivered to you
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-indigo-100 max-w-xl"
            >
              Discover quality items with fast shipping and exceptional customer
              service. Shop the latest trends and best deals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <Link to="/products">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Shop now
                  <FiArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_white_0%,_transparent_50%)]" />
          </div>
        </motion.div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold transition-colors duration-300 ease-in-out hover:text-[var(--color-primary-hover)] "
          >
            Featured products
          </motion.h2>
          <Link
            to="/products"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistIdSet.has(product.id)}
                imageLoading={i < 4 ? "eager" : "lazy"}
              />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
