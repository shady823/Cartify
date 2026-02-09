import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productsApi } from "@/api";
import { ProductCard } from "@/features/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import type { ProductListItem } from "@/types";

const PAGE_SIZE = 12;

function getProductId(
  p: { id?: string; _id?: string } | null | undefined,
): string {
  return p?.id ?? p?._id ?? "";
}

function getPageItems(
  page: unknown,
): Array<ProductListItem & { _id?: string }> {
  const data = (page as { data?: unknown } | null | undefined)?.data;
  return Array.isArray(data)
    ? (data as Array<ProductListItem & { _id?: string }>)
    : [];
}

function normalizeProduct(
  p: ProductListItem & { _id?: string },
): ProductListItem {
  return {
    ...p,
    id: p.id ?? p._id ?? "",
  };
}

function dedupeById<T extends { id?: string; _id?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = item.id ?? (item as { _id?: string })._id ?? "";
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const searchQuery =
    (useOutletContext() as { searchQuery?: string })?.searchQuery ??
    searchParams.get("q") ??
    "";
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const fetchNextPageLockRef = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["products", "infinite", { category, brand }],
    queryFn: ({ pageParam }) =>
      productsApi
        .getAll({
          page: pageParam,
          limit: PAGE_SIZE,
          category: category || undefined,
          brand: brand || undefined,
        })
        .then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const lastItems = getPageItems(lastPage);
      if (lastItems.length === 0) return undefined;

      const meta = (lastPage as { metadata?: unknown })?.metadata as
        | {
            currentPage?: number;
            nextPage?: number | string | null;
            numberOfPages?: number;
          }
        | undefined;

      const prevPages = allPages.slice(0, -1);
      const prevItems = prevPages.flatMap(getPageItems);
      const prevIds = new Set(prevItems.map(getProductId).filter(Boolean));
      const hasNewItems = lastItems.some((p) => {
        const id = getProductId(p);
        return Boolean(id) && !prevIds.has(id);
      });
      if (!hasNewItems) return undefined;

      if (typeof meta?.nextPage === "number") return meta.nextPage;
      if (typeof meta?.nextPage === "string") {
        const parsed = Number(meta.nextPage);
        if (Number.isFinite(parsed)) return parsed;
      }
      if (
        typeof meta?.currentPage === "number" &&
        typeof meta?.numberOfPages === "number"
      ) {
        return meta.currentPage < meta.numberOfPages
          ? meta.currentPage + 1
          : undefined;
      }

      const page = (lastPage as { page?: unknown })?.page;
      const totalPages = (lastPage as { totalPages?: unknown })?.totalPages;
      if (typeof page === "number" && typeof totalPages === "number") {
        return page < totalPages ? page + 1 : undefined;
      }

      if (lastItems.length < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
  });

  const wishlistIds = useWishlistIds({ enabled: Boolean(data) });
  const wishlistIdSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (fetchNextPageLockRef.current) return;

    fetchNextPageLockRef.current = true;
    void fetchNextPage().finally(() => {
      fetchNextPageLockRef.current = false;
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { rootMargin: "100px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleLoadMore]);

  const products = useMemo(() => {
    const raw =
      data?.pages.flatMap((p) => (p.data ?? []).map(normalizeProduct)) ?? [];
    const deduped = dedupeById(raw);

    if (!searchQuery.trim()) {
      return deduped;
    }

    const query = searchQuery.trim().toLowerCase();
    return deduped.filter((product) => {
      const title = product.title.toLowerCase();
      const description = product.description.toLowerCase();
      return title.includes(query) || description.includes(query);
    });
  }, [data, searchQuery]);
  const showSkeletons = isLoading || (isFetching && products.length === 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-[var(--color-foreground)] dark:text-[var(--color-foreground)] mb-8"
      >
        All products
      </motion.h1>

      {showSkeletons ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistIdSet.has(product.id)}
                imageLoading={i < 8 ? "eager" : "lazy"}
              />
            ))}
          </div>

          <div
            ref={loadMoreRef}
            className="h-10 flex items-center justify-center py-8"
          >
            {isFetchingNextPage && (
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-bounce" />
              </div>
            )}
          </div>

          {products.length === 0 && !isFetching && (
            <p className="text-center text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)] py-16">
              No products found. Try changing filters or search.
            </p>
          )}
        </>
      )}
    </div>
  );
}
