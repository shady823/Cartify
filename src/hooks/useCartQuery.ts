import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/api";
import type { CartResponse } from "@/types";

function getCachedPriceAfterDiscount(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: string,
): number | undefined {
  const direct = queryClient.getQueryData(["product", productId]) as
    | { priceAfterDiscount?: number }
    | undefined;
  if (typeof direct?.priceAfterDiscount === "number") return direct.priceAfterDiscount;
  if (typeof (direct as { priceAfterDiscount?: unknown } | undefined)?.priceAfterDiscount === "string") {
    const parsed = Number(
      (direct as { priceAfterDiscount?: unknown } | undefined)?.priceAfterDiscount,
    );
    if (Number.isFinite(parsed)) return parsed;
  }

  const candidates = queryClient.getQueriesData({ queryKey: ["products"] });
  for (const [, data] of candidates) {
    if (!data) continue;

    const root = data as unknown;
    const pages = (root as { pages?: unknown })?.pages;
    const directList = (root as { data?: unknown })?.data;

    const lists: unknown[] = [];
    if (Array.isArray(directList)) lists.push(directList);
    if (Array.isArray(pages)) {
      for (const p of pages) {
        const pageList = (p as { data?: unknown } | null | undefined)?.data;
        if (Array.isArray(pageList)) lists.push(pageList);
      }
    }

    for (const list of lists) {
      const match = (list as Array<{ id?: string; _id?: string; priceAfterDiscount?: unknown }>).find(
        (p) => (p?.id ?? p?._id) === productId,
      );
      const val = match?.priceAfterDiscount;
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        const parsed = Number(val);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
  }

  return undefined;
}

export function useCartQuery(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["cart"],
    queryFn: ({ signal }) =>
      cartApi
        .get({ signal })
        .then((r) => r.data)
        .then((data) => {
          if (!data?.data?.products) return data;

          const products = data.data.products.map((item) => {
            const productId =
              item.product?.id ?? (item.product as { _id?: string } | null | undefined)?._id ?? "";
            if (!productId) return item;

            if (item.product?.priceAfterDiscount == null) {
              const cached = getCachedPriceAfterDiscount(queryClient, productId);
              if (typeof cached === "number") {
                return {
                  ...item,
                  product: { ...item.product, priceAfterDiscount: cached },
                };
              }
            }
            return item;
          });

          return {
            ...data,
            data: { ...data.data, products },
          };
        })
        .catch(() => null as CartResponse | null),
    enabled,
  });
}
