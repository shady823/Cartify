import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export function useSearchParamsState(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams);
      if (next) params.set(key, next);
      else params.delete(key);
      setSearchParams(params);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}
