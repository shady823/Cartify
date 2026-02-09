import { useCartQuery } from "./useCartQuery";

export function useCartCount(options?: { enabled?: boolean }): number {
  const { data } = useCartQuery(options);
  return data?.numOfCartItems ?? 0;
}
