import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type ToastPosition = "top-right" | "bottom-center";

export function Providers({ children }: { children: React.ReactNode }) {
  const [toastPosition, setToastPosition] = useState<ToastPosition>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return "top-right";
    return window.matchMedia("(max-width: 640px)").matches
      ? "bottom-center"
      : "top-right";
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return;

    const media = window.matchMedia("(max-width: 640px)");
    const update = () =>
      setToastPosition(media.matches ? "bottom-center" : "top-right");

    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position={toastPosition}
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid var(--border)",
            pointerEvents: "none",
          },
        }}
      />
    </QueryClientProvider>
  );
}
