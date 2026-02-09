import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "@/api";
import { Skeleton } from "@/components/ui";

export function Brands() {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsApi.getAll().then((r) => r.data),
  });
  const brands = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-on-background mb-8"
      >
        Brands
      </motion.h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-3xl" />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {brands.map((brand, i) => (
            <motion.div
              key={brand._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/products?brand=${brand._id}`}
                className="group flex flex-col items-center rounded-3xl border border-border bg-card p-6 shadow-soft hover:shadow-hover transition-all duration-300"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-surface">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="mt-4 font-medium text-on-background text-center group-hover:text-primary transition-colors">
                  {brand.name}
                </h2>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
