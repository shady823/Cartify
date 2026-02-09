import { useWishlistQuery } from "./useWishlistQuery";

export function useWishlistIds(options?: { enabled?: boolean }): string[] {
  const { data } = useWishlistQuery(options);
  const list = data?.data ?? [];
  return Array.isArray(list) ? list.map((p: { id: string }) => p.id) : [];
}
