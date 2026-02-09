import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[var(--color-card-hover)] dark:bg-[var(--color-card-hover)] animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-card)] dark:bg-[var(--color-card)] overflow-hidden shadow-lg",
      )}
    >
      <Skeleton className="aspect-square w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
}
