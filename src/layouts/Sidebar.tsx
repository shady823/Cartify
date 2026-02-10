import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX } from "react-icons/fi";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, brandsApi } from "@/api";
import { cn } from "@/utils/cn";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [searchParams] = useSearchParams();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);

  // Enable filters on all pages to ensure data is available
  const filtersEnabled = true;

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) =>
      categoriesApi.getAll({ signal }).then((r) => r.data),
    enabled: filtersEnabled,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: ({ signal }) => brandsApi.getAll({ signal }).then((r) => r.data),
    enabled: filtersEnabled,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const categories = categoriesData?.data ?? [];
  const brands = brandsData?.data ?? [];
  const currentCategory = searchParams.get("category");
  const currentBrand = searchParams.get("brand");

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 border-r border-[var(--color-border)] bg-[var(--color-background)] lg:static lg:z-auto lg:block lg:h-auto lg:w-64 lg:border-r lg:shrink-0",
          !open && "hidden lg:block",
        )}
      >
        <motion.div
          initial={false}
          animate={open ? { x: 0 } : { x: -288 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex h-full flex-col lg:!translate-x-0 lg:!animate-none"
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] lg:border-0">
            <span className="font-semibold text-lg text-[var(--color-foreground)]">
              Filters
            </span>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors"
              aria-label="Close sidebar"
            >
              <FiX className="h-5 w-5 text-[var(--color-foreground)]" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-4">
            {/** Categories Section */}
            <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setCategoriesOpen((o) => !o)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-[var(--color-card-hover)] transition-colors"
              >
                Categories
                <FiChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    categoriesOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 pb-3 space-y-0.5">
                      {categoriesLoading ? (
                        // Show loading state for categories
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : (
                        <>
                          <Link
                            to="/products"
                            className={cn(
                              "block px-3 py-2 rounded-xl text-sm transition-colors",
                              !currentCategory
                                ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                                : "hover:bg-[var(--color-card-hover)]",
                            )}
                          >
                            All
                          </Link>
                          {categories.map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/products?category=${cat._id}`}
                              className={cn(
                                "block px-3 py-2 rounded-xl text-sm transition-colors",
                                currentCategory === cat._id
                                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                                  : "hover:bg-[var(--color-card-hover)]",
                              )}
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/** Brands Section */}
            <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setBrandsOpen((o) => !o)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-[var(--color-card-hover)] transition-colors"
              >
                Brands
                <FiChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    brandsOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {brandsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 pb-3 space-y-0.5">
                      {brandsLoading ? (
                        // Show loading state for brands
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : (
                        <>
                          <Link
                            to="/products"
                            className={cn(
                              "block px-3 py-2 rounded-xl text-sm transition-colors",
                              !currentBrand
                                ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                                : "hover:bg-[var(--color-card-hover)]",
                            )}
                          >
                            All
                          </Link>
                          {brands.map((brand) => (
                            <Link
                              key={brand._id}
                              to={`/products?brand=${brand._id}`}
                              className={cn(
                                "block px-3 py-2 rounded-xl text-sm transition-colors",
                                currentBrand === brand._id
                                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                                  : "hover:bg-[var(--color-card-hover)]",
                              )}
                            >
                              {brand.name}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </motion.div>
      </aside>
    </>
  );
}
