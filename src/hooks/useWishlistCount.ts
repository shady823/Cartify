import { useWishlistQuery } from "./useWishlistQuery";

export function useWishlistCount(options?: { enabled?: boolean }): number {
  const { data } = useWishlistQuery(options);
  return data?.count ?? 0;
}
