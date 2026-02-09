import { useQuery } from "@tanstack/react-query";
import { wishlistApi } from "@/api";
import type { WishlistResponse } from "@/types";

export function useWishlistQuery(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: ({ signal }) =>
      wishlistApi
        .get({ signal })
        .then((r) => r.data)
        .catch(() => null as WishlistResponse | null),
    enabled,
  });
}

